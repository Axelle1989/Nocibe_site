import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth.middleware.js';
import { submissionLimiter } from '../middlewares/rateLimit.middleware.js';
import { QuoteStatus } from '@prisma/client';
import { auditService } from '../services/audit.service.js';

export const quotesRouter = Router();

const quoteSubmitSchema = z.object({
  nom: z.string().min(2, 'Le nom est obligatoire'),
  telephone: z.string().min(8, 'Le numéro de téléphone est obligatoire'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  produit: z.string().min(2, 'Le produit est obligatoire'),
  quantite: z.coerce.string().min(1, 'La quantité est obligatoire'),
  unite: z.string().default('sacs'),
  departement: z.string().default('Littoral (Cotonou)'),
  commune: z.string().default('Cotonou'),
  siteDetails: z.string().optional(),
  message: z.string().optional(),
});

// Soumettre une demande de devis B2B (avec rate-limiting)
quotesRouter.post('/', submissionLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = quoteSubmitSchema.parse(req.body);

    const quote = await prisma.quote.create({
      data: {
        nom: data.nom.trim(),
        telephone: data.telephone.trim(),
        email: data.email?.trim() || null,
        produit: data.produit.trim(),
        quantite: data.quantite.trim(),
        unite: data.unite.trim(),
        departement: data.departement.trim(),
        commune: data.commune.trim(),
        siteDetails: data.siteDetails?.trim() || null,
        message: data.message?.trim() || null,
        statut: QuoteStatus.NOUVEAU,
      },
    });

    res.status(201).json({
      message: 'Votre demande de devis a été transmise à notre service commercial.',
      quoteId: quote.id,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Données invalides.' });
      return;
    }
    console.error('[SUBMIT QUOTE ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi de la demande de devis.' });
  }
});

// Admin: Voir tous les devis
quotesRouter.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ quotes });
  } catch (err) {
    console.error('[GET QUOTES ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des devis.' });
  }
});

// Admin: Mettre à jour le statut d'un devis
quotesRouter.put('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { statut } = req.body;

    if (!Object.values(QuoteStatus).includes(statut)) {
      res.status(400).json({ error: 'Statut de devis invalide.' });
      return;
    }

    const updated = await prisma.quote.update({
      where: { id },
      data: { statut },
    });

    await auditService.log({
      adminId: req.user!.id,
      action: 'UPDATE_QUOTE_STATUS',
      targetResource: 'quote',
      targetId: id,
      details: { newStatus: statut },
      ipAddress: req.ip,
    });

    res.json({ message: 'Statut du devis actualisé.', quote: updated });
  } catch (err) {
    console.error('[UPDATE QUOTE STATUS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du devis.' });
  }
});
