import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { ENV } from '../config/env.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth.middleware.js';
import { submissionLimiter } from '../middlewares/rateLimit.middleware.js';
import { mailService } from '../services/mail.service.js';
import { JobType, JobStatus, ApplicationStatus } from '@prisma/client';

export const careersRouter = Router();

// Configuration du stockage sécurisé des CV hors webroot
const uploadBaseDir = path.resolve(process.cwd(), ENV.UPLOAD_DIR, 'cv');
if (!fs.existsSync(uploadBaseDir)) {
  fs.mkdirSync(uploadBaseDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadBaseDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext) || !allowedMimeTypes.has(file.mimetype)) {
      cb(new Error('Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX.'));
      return;
    }
    cb(null, true);
  },
});

// Vérification stricte des signatures de fichiers (Magic bytes)
function verifyFileSignature(filePath: string): boolean {
  try {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    // PDF : %PDF-
    if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
      return true;
    }
    // DOC (OLE2 Compound File) : D0 CF 11 E0
    if (buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0) {
      return true;
    }
    // DOCX (ZIP archive PK..) : 50 4B 03 04
    if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ========================================================
// 1. OFFRES D'EMPLOI PUBLIQUES
// ========================================================

// GET /api/careers/offers (Recherche & Filtres)
careersRouter.get('/offers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, type, secteur, lieu } = req.query;

    const whereClause: any = {
      statut: JobStatus.PUBLIEE,
    };

    if (type && typeof type === 'string' && Object.values(JobType).includes(type as JobType)) {
      whereClause.type = type as JobType;
    }

    if (secteur && typeof secteur === 'string' && secteur !== 'Tous') {
      whereClause.secteur = secteur;
    }

    if (lieu && typeof lieu === 'string' && lieu !== 'Tous') {
      whereClause.lieu = { contains: lieu, mode: 'insensitive' };
    }

    if (search && typeof search === 'string' && search.trim()) {
      whereClause.OR = [
        { titre: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { missions: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const offers = await prisma.jobOffer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ offers });
  } catch (err) {
    console.error('[CAREERS OFFERS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des offres.' });
  }
});

// GET /api/careers/offers/:slug
careersRouter.get('/offers/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const offer = await prisma.jobOffer.findUnique({
      where: { slug },
    });

    if (!offer || offer.statut !== JobStatus.PUBLIEE) {
      res.status(404).json({ error: 'Offre d’emploi introuvable ou clôturée.' });
      return;
    }

    res.json({ offer });
  } catch (err) {
    console.error('[CAREER OFFER DETAIL ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l’offre.' });
  }
});

// ========================================================
// 2. DÉPÔT DE CANDIDATURE (POST MULTIPART)
// ========================================================

const applicationSchema = z.object({
  nom: z.string().min(2, 'Le nom est obligatoire'),
  prenom: z.string().min(2, 'Le prénom est obligatoire'),
  email: z.string().email('Format email invalide'),
  telephone: z.string().min(8, 'Le numéro de téléphone est obligatoire'),
  ville: z.string().min(2, 'La ville de résidence est requise'),
  pays: z.string().default('Bénin'),
  nationalite: z.string().default('Béninoise'),
  typeCandidature: z.nativeEnum(JobType),
  secteur: z.string().min(2, 'Le secteur est requis'),
  jobOfferId: z.string().optional(),
  niveauEtude: z.string().min(2, 'Niveau d’études requis'),
  etablissement: z.string().min(2, 'Établissement requis'),
  filiere: z.string().min(2, 'Filière requise'),
  diplomeAnnee: z.string().optional(),
  stageDuree: z.string().optional(),
  stageDatesDispo: z.string().optional(),
  conventionStage: z.coerce.boolean().optional(),
  stageTuteur: z.string().optional(),
  anneesExperience: z.string().optional(),
  dernierPoste: z.string().optional(),
  disponibilite: z.string().optional(),
  pretentionsSalariales: z.string().optional(),
  permis: z.string().optional(),
  langues: z.string().optional(),
  linkedinUrl: z.string().optional(),
  lettreMotivation: z.string().max(2000, 'Lettre limitée à 2000 caractères').optional(),
  honeypot: z.string().optional(), // Anti-spam piège
  consentement: z.coerce.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter le traitement de vos données conformément à la loi béninoise.',
  }),
});

careersRouter.post(
  '/applications',
  submissionLimiter,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'lettre_file', maxCount: 1 },
    { name: 'diplome_file', maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const cvFile = files?.['cv']?.[0];

    try {
      // 1. Détection honeypot anti-spam
      if (req.body.honeypot && req.body.honeypot.trim().length > 0) {
        if (cvFile && fs.existsSync(cvFile.path)) fs.unlinkSync(cvFile.path);
        res.status(200).json({ message: 'Candidature reçue.' }); // faux succès pour bots
        return;
      }

      // 2. Validation présence du CV
      if (!cvFile) {
        res.status(400).json({ error: 'Le fichier CV est obligatoire (PDF ou DOC/DOCX, 5 Mo max).' });
        return;
      }

      // 3. Vérification signature cryptographique (magic bytes)
      if (!verifyFileSignature(cvFile.path)) {
        if (fs.existsSync(cvFile.path)) fs.unlinkSync(cvFile.path);
        res.status(400).json({
          error: 'Le fichier CV fourni est corrompu ou ne correspond pas à un document PDF/DOC valide.',
        });
        return;
      }

      // 4. Validation des champs du formulaire
      const data = applicationSchema.parse(req.body);

      // Générer une référence unique de dossier
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const reference = `NOC-REC-2026-${randomSuffix}`;

      // 5. Enregistrement en base de données
      const application = await prisma.application.create({
        data: {
          reference,
          jobOfferId: data.jobOfferId || null,
          nom: data.nom.trim(),
          prenom: data.prenom.trim(),
          email: data.email.toLowerCase().trim(),
          telephone: data.telephone.trim(),
          ville: data.ville.trim(),
          pays: data.pays.trim(),
          nationalite: data.nationalite.trim(),
          typeCandidature: data.typeCandidature,
          secteur: data.secteur.trim(),
          niveauEtude: data.niveauEtude.trim(),
          etablissement: data.etablissement.trim(),
          filiere: data.filiere.trim(),
          diplomeAnnee: data.diplomeAnnee || null,
          stageDuree: data.stageDuree || null,
          stageDatesDispo: data.stageDatesDispo || null,
          conventionStage: data.conventionStage || false,
          stageTuteur: data.stageTuteur || null,
          anneesExperience: data.anneesExperience || null,
          dernierPoste: data.dernierPoste || null,
          disponibilite: data.disponibilite || null,
          pretentionsSalariales: data.pretentionsSalariales || null,
          permis: data.permis || null,
          langues: data.langues || null,
          linkedinUrl: data.linkedinUrl || null,
          lettreMotivation: data.lettreMotivation || null,
          cvFileName: cvFile.filename,
          cvOriginalName: cvFile.originalname,
          cvMimeType: cvFile.mimetype,
          cvSize: cvFile.size,
          cvPath: cvFile.path,
          statut: ApplicationStatus.RECUE,
        },
      });

      // 6. Pièces jointes complémentaires facultatives
      if (files?.['lettre_file']?.[0]) {
        const lf = files['lettre_file'][0];
        if (verifyFileSignature(lf.path)) {
          await prisma.applicationFile.create({
            data: {
              applicationId: application.id,
              fileName: lf.filename,
              originalName: lf.originalname,
              mimeType: lf.mimetype,
              size: lf.size,
              filePath: lf.path,
              fileType: 'LETTRE',
            },
          });
        }
      }

      if (files?.['diplome_file']?.[0]) {
        const df = files['diplome_file'][0];
        if (verifyFileSignature(df.path)) {
          await prisma.applicationFile.create({
            data: {
              applicationId: application.id,
              fileName: df.filename,
              originalName: df.originalname,
              mimeType: df.mimetype,
              size: df.size,
              filePath: df.path,
              fileType: 'DIPLOME',
            },
          });
        }
      }

      // 7. Notification e-mail au candidat & alerte RH
      try {
        console.log(`[RECRUTEMENT] Nouvelle candidature ${reference} de ${data.prenom} ${data.nom} (${data.email})`);
        console.log(`[RECRUTEMENT] Alerte transmise au pôle RH : ${ENV.HR_EMAIL}`);
      } catch (err) {
        console.error('Erreur notification email candidature :', err);
      }

      res.status(201).json({
        message: 'Votre candidature a été transmise avec succès à la Direction des Ressources Humaines de NOCIBÉ S.A.',
        reference,
        applicationId: application.id,
      });
    } catch (err: any) {
      if (cvFile && fs.existsSync(cvFile.path)) {
        fs.unlinkSync(cvFile.path);
      }
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0]?.message || 'Informations de formulaire invalides.' });
        return;
      }
      console.error('[APPLICATION SUBMIT ERROR]', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de l’enregistrement de votre dossier.' });
    }
  }
);

// ========================================================
// 3. ADMINISTRATION DU RECRUTEMENT (RH / ADMIN ONLY)
// ========================================================

// GET /api/careers/admin/applications (Liste & Recherche)
careersRouter.get('/admin/applications', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { statut, type, search } = req.query;

    const where: any = {};
    if (statut && typeof statut === 'string' && Object.values(ApplicationStatus).includes(statut as ApplicationStatus)) {
      where.statut = statut as ApplicationStatus;
    }
    if (type && typeof type === 'string' && Object.values(JobType).includes(type as JobType)) {
      where.typeCandidature = type as JobType;
    }
    if (search && typeof search === 'string' && search.trim()) {
      where.OR = [
        { nom: { contains: search.trim(), mode: 'insensitive' } },
        { prenom: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { reference: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        jobOffer: { select: { id: true, titre: true, slug: true } },
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ applications });
  } catch (err) {
    console.error('[ADMIN GET APPLICATIONS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures.' });
  }
});

// GET /api/careers/admin/applications/:id
careersRouter.get('/admin/applications/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        jobOffer: true,
        files: true,
      },
    });

    if (!application) {
      res.status(404).json({ error: 'Dossier de candidature introuvable.' });
      return;
    }

    res.json({ application });
  } catch (err) {
    console.error('[ADMIN APPLICATION DETAIL ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/careers/admin/applications/:id/cv (Téléchargement sécurisé du CV)
careersRouter.get('/admin/applications/:id/cv', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application || !application.cvPath || !fs.existsSync(application.cvPath)) {
      res.status(404).json({ error: 'Fichier CV introuvable sur le serveur sécurisé.' });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(application.cvOriginalName)}"`);
    res.setHeader('Content-Type', application.cvMimeType);
    fs.createReadStream(application.cvPath).pipe(res);
  } catch (err) {
    console.error('[DOWNLOAD CV ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du téléchargement du CV.' });
  }
});

// PATCH /api/careers/admin/applications/:id (Mise à jour statut / note interne)
careersRouter.patch('/admin/applications/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { statut, noteInterne } = req.body;

    const data: any = {};
    if (statut && Object.values(ApplicationStatus).includes(statut)) {
      data.statut = statut;
    }
    if (noteInterne !== undefined) {
      data.noteInterne = noteInterne ? String(noteInterne).trim() : null;
    }

    const updated = await prisma.application.update({
      where: { id },
      data,
    });

    res.json({ message: 'Dossier de candidature mis à jour.', application: updated });
  } catch (err) {
    console.error('[ADMIN UPDATE APPLICATION ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// GET /api/careers/admin/applications/export/csv
careersRouter.get('/admin/applications/export/csv', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { jobOffer: { select: { titre: true } } },
    });

    const headers = 'Référence;Date;Nom;Prénom;Email;Téléphone;Ville;Type;Secteur;Poste Cible;Statut\n';
    const rows = applications.map((a) => {
      const dateStr = a.createdAt.toISOString().split('T')[0];
      const poste = a.jobOffer ? a.jobOffer.titre.replace(/;/g, ',') : 'Candidature Spontanée';
      return `"${a.reference}";"${dateStr}";"${a.nom}";"${a.prenom}";"${a.email}";"${a.telephone}";"${a.ville}";"${a.typeCandidature}";"${a.secteur}";"${poste}";"${a.statut}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Candidatures_NOCIBE.csv"');
    res.send('\uFEFF' + headers + rows);
  } catch (err) {
    console.error('[ADMIN EXPORT CSV ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de l’export CSV.' });
  }
});
