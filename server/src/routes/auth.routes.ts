import { Router, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { ENV } from '../config/env.js';
import { authenticateToken, AuthRequest } from '../middlewares/auth.middleware.js';
import { authLimiter, passwordResetLimiter } from '../middlewares/rateLimit.middleware.js';
import { mailService } from '../services/mail.service.js';
import { auditService } from '../services/audit.service.js';

export const authRouter = Router();

// Hachage SHA256 pour les tokens stockés en base (refresh, email, reset)
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Durées et options des cookies
const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

const getCookieOptions = (maxAgeMs: number, path: string = '/') => ({
  httpOnly: true,
  secure: ENV.IS_PRODUCTION,
  sameSite: (ENV.IS_PRODUCTION ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: maxAgeMs,
  path,
});

// Politique de mot de passe renforcée (10 car. min, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{10,}$/;

const registerSchema = z.object({
  email: z.string().email('Format d’adresse email invalide'),
  password: z
    .string()
    .min(10, 'Le mot de passe doit comporter au moins 10 caractères')
    .regex(
      passwordRegex,
      'Le mot de passe doit inclure au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'
    ),
  nom: z.string().min(2, 'Le nom est obligatoire'),
  prenom: z.string().min(2, 'Le prénom est obligatoire'),
  telephone: z.string().min(8, 'Numéro de téléphone requis'),
  entreprise: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Format d’adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Jeton de réinitialisation manquant'),
  newPassword: z
    .string()
    .min(10, 'Le mot de passe doit comporter au moins 10 caractères')
    .regex(
      passwordRegex,
      'Le mot de passe doit inclure au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'
    ),
});

// Hash factice pour neutraliser les attaques temporelles (timing attacks) lors d'un email inexistant
const DUMMY_HASH = '$2a$12$e80b2rYV6E7c04a0JkXFte1Fepm0c36U7l87fJ9e1eKz123456789';

// Helper pour émettre les tokens et cookies
async function generateAndSetTokens(
  res: Response,
  user: { id: string; email: string; role: 'CLIENT' | 'ADMIN' }
): Promise<{ accessToken: string; refreshToken: string }> {
  // 1. Access Token JWT court (15 min)
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  // 2. Refresh Token aléatoire cryptographique
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const hashedRefreshToken = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  // Enregistrer le token hashé en base
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashedRefreshToken,
      expiresAt,
    },
  });

  // 3. Déposer les cookies httpOnly
  res.cookie('nocibe_access_token', accessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY_MS, '/'));
  res.cookie('nocibe_refresh_token', rawRefreshToken, getCookieOptions(REFRESH_TOKEN_EXPIRY_MS, '/api/auth'));

  return { accessToken, refreshToken: rawRefreshToken };
}

// ==========================================
// 1. INSCRIPTION
// ==========================================
authRouter.post('/register', authLimiter, async (req, res: Response): Promise<void> => {
  const reqId = (req as any).reqId || `REQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0]?.toString() || 'global';
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      res.status(400).json({
        error: Object.values(fieldErrors)[0] || 'Données du formulaire invalides.',
        code: 'VALIDATION_ERROR',
        fieldErrors,
      });
      return;
    }

    const data = validation.data;
    const normalizedEmail = data.email.toLowerCase().trim();

    // Vérification de la disponibilité de la base et doublon d'email
    let existing;
    try {
      existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbErr: any) {
      console.error(`[${reqId}] Échec requête DB User :`, dbErr.message || dbErr);
      res.status(503).json({
        error: 'Le service de base de données est temporairement indisponible. Veuillez réessayer.',
        code: 'SERVICE_UNAVAILABLE',
        reqId,
      });
      return;
    }

    if (existing) {
      res.status(409).json({
        error: 'Un compte existe déjà avec cette adresse email.',
        code: 'EMAIL_ALREADY_EXISTS',
        fieldErrors: { email: 'Un compte existe déjà avec cette adresse email.' },
      });
      return;
    }

    // Hachage du mot de passe (coût 12 pour bcrypt)
    const hashedPassword = await bcrypt.hash(data.password, 12);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          password: hashedPassword,
          nom: data.nom.trim(),
          prenom: data.prenom.trim(),
          telephone: data.telephone.trim(),
          entreprise: data.entreprise?.trim() || null,
          role: 'CLIENT',
          isActive: true,
          emailVerifie: false,
        },
      });
    } catch (createErr: any) {
      console.error(`[${reqId}] Échec création User en base :`, createErr.message || createErr);
      res.status(503).json({
        error: 'Impossible d\'enregistrer votre compte pour le moment. Veuillez réessayer.',
        code: 'DATABASE_ERROR',
        reqId,
      });
      return;
    }

    // Génération du jeton de vérification d'email
    const rawEmailToken = crypto.randomBytes(32).toString('hex');
    const hashedEmailToken = hashToken(rawEmailToken);
    const emailExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    try {
      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashedEmailToken,
          expiresAt: emailExpiresAt,
        },
      });
    } catch (tokenErr: any) {
      console.error(`[${reqId}] Échec enregistrement token email :`, tokenErr.message || tokenErr);
    }

    // Envoi de l'e-mail de confirmation (l'échec d'envoi n'annule pas la création du compte)
    let emailSent = false;
    try {
      emailSent = await mailService.sendVerificationEmail(user.email, user.prenom, rawEmailToken);
    } catch (mailErr: any) {
      console.error(`[${reqId}] Erreur SMTP lors de l'inscription :`, mailErr.message || mailErr);
      emailSent = false;
    }

    // Attribution des tokens de session
    const { accessToken } = await generateAndSetTokens(res, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: emailSent
        ? 'Compte créé avec succès. Un e-mail de confirmation vous a été envoyé.'
        : 'Compte créé, mais l\'e-mail de vérification n\'a pas pu être envoyé.',
      emailSent,
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        entreprise: user.entreprise,
        role: user.role,
        emailVerifie: false,
      },
    });
  } catch (err: any) {
    console.error(`[AUTH REGISTER ERROR ${reqId}]`, err.message || err);
    res.status(500).json({
      error: `Une erreur interne est survenue lors de la création de votre compte. Veuillez contacter le support (Réf: ${reqId}).`,
      reqId,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
});

// ==========================================
// 2. CONNEXION
// ==========================================
authRouter.post('/login', authLimiter, async (req, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const normalizedEmail = data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Protection anti-énumération & contre les attaques de timing
    if (!user) {
      await bcrypt.compare(data.password, DUMMY_HASH);
      res.status(401).json({ error: 'Identifiants de connexion invalides.' });
      return;
    }

    // Vérification de verrouillage temporaire (brute force protection)
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      res.status(429).json({
        error: `Compte temporairement verrouillé suite à plusieurs tentatives échouées. Réessayez dans ${waitMinutes} minute(s).`,
      });
      return;
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      const newAttempts = user.failedLoginAttempts + 1;
      const willLock = newAttempts >= 5;
      const lockedUntil = willLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          ...(willLock && { lockedUntil }),
        },
      });

      res.status(401).json({ error: 'Identifiants de connexion invalides.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'Ce compte a été suspendu. Veuillez contacter le support NOCIBÉ.' });
      return;
    }

    // Réinitialisation des tentatives échouées après succès
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
    }

    const { accessToken } = await generateAndSetTokens(res, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Connexion réussie.',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        entreprise: user.entreprise,
        role: user.role,
        emailVerifie: user.emailVerifie,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Données invalides.' });
      return;
    }
    console.error('[AUTH LOGIN ERROR]', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la tentative de connexion.' });
  }
});

// ==========================================
// 3. RAFRAÎCHISSEMENT DU TOKEN (ROTATION)
// ==========================================
authRouter.post('/refresh', async (req, res: Response): Promise<void> => {
  try {
    const rawRefreshToken = req.cookies?.nocibe_refresh_token || req.body?.refreshToken;

    if (!rawRefreshToken) {
      res.status(401).json({ error: 'Jeton de rafraîchissement absent.' });
      return;
    }

    const hashedToken = hashToken(rawRefreshToken);

    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashedToken },
      include: { user: true },
    });

    if (!tokenDoc || tokenDoc.revoked || tokenDoc.expiresAt < new Date()) {
      res.clearCookie('nocibe_access_token', { path: '/' });
      res.clearCookie('nocibe_refresh_token', { path: '/api/auth' });
      res.status(401).json({ error: 'Session expirée ou révoquée. Veuillez vous reconnecter.' });
      return;
    }

    if (!tokenDoc.user || !tokenDoc.user.isActive) {
      res.status(401).json({ error: 'Compte inactif.' });
      return;
    }

    // Rotation du Refresh Token : on révoque l'ancien
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHashedRefreshToken = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: tokenDoc.id },
        data: {
          revoked: true,
          replacedByTokenHash: newHashedRefreshToken,
        },
      }),
      prisma.refreshToken.create({
        data: {
          userId: tokenDoc.userId,
          tokenHash: newHashedRefreshToken,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

    const newAccessToken = jwt.sign(
      { id: tokenDoc.user.id, email: tokenDoc.user.email, role: tokenDoc.user.role },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('nocibe_access_token', newAccessToken, getCookieOptions(ACCESS_TOKEN_EXPIRY_MS, '/'));
    res.cookie('nocibe_refresh_token', newRawRefreshToken, getCookieOptions(REFRESH_TOKEN_EXPIRY_MS, '/api/auth'));

    res.json({
      message: 'Session renouvelée.',
      token: newAccessToken,
      user: {
        id: tokenDoc.user.id,
        email: tokenDoc.user.email,
        nom: tokenDoc.user.nom,
        prenom: tokenDoc.user.prenom,
        telephone: tokenDoc.user.telephone,
        entreprise: tokenDoc.user.entreprise,
        role: tokenDoc.user.role,
        emailVerifie: tokenDoc.user.emailVerifie,
      },
    });
  } catch (err) {
    console.error('[AUTH REFRESH ERROR]', err);
    res.status(500).json({ error: 'Impossible de renouveler la session.' });
  }
});

// ==========================================
// 4. DÉCONNEXION (RÉVOCATION)
// ==========================================
authRouter.post('/logout', async (req, res: Response): Promise<void> => {
  try {
    const rawRefreshToken = req.cookies?.nocibe_refresh_token || req.body?.refreshToken;

    if (rawRefreshToken) {
      const hashedToken = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: hashedToken },
        data: { revoked: true },
      });
    }

    res.clearCookie('nocibe_access_token', { path: '/' });
    res.clearCookie('nocibe_refresh_token', { path: '/api/auth' });

    res.json({ message: 'Déconnexion réussie.' });
  } catch (err) {
    console.error('[AUTH LOGOUT ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
});

// ==========================================
// 5. VÉRIFICATION D'EMAIL
// ==========================================
authRouter.post('/verify-email', async (req, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Jeton de confirmation manquant.' });
      return;
    }

    const hashedToken = hashToken(token);

    const tokenDoc = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash: hashedToken },
      include: { user: true },
    });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      res.status(400).json({ error: 'Le lien de confirmation est invalide ou a expiré.' });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenDoc.userId },
        data: { emailVerifie: true },
      }),
      prisma.emailVerificationToken.delete({
        where: { id: tokenDoc.id },
      }),
    ]);

    res.json({
      message: 'Votre adresse e-mail a été confirmée avec succès. Vous pouvez désormais commander vos ciments en ligne.',
    });
  } catch (err) {
    console.error('[AUTH VERIFY EMAIL ERROR]', err);
    res.status(500).json({ error: 'Impossible de confirmer l’adresse email.' });
  }
});

// ==========================================
// 6. RENVOI EMAIL DE VÉRIFICATION
// ==========================================
authRouter.post('/resend-verification', passwordResetLimiter, async (req, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Adresse e-mail requise.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (user && !user.emailVerifie) {
      await prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id },
      });

      const rawEmailToken = crypto.randomBytes(32).toString('hex');
      const hashedEmailToken = hashToken(rawEmailToken);
      const emailExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash: hashedEmailToken,
          expiresAt: emailExpiresAt,
        },
      });

      await mailService.sendVerificationEmail(user.email, user.prenom, rawEmailToken);
    }

    // Réponse neutre pour éviter l'énumération
    res.json({
      message: 'Si cette adresse email est associée à un compte non vérifié, un nouvel email de confirmation a été envoyé.',
    });
  } catch (err) {
    console.error('[AUTH RESEND VERIFICATION ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du renvoi du lien de confirmation.' });
  }
});

// ==========================================
// 7. MOT DE PASSE OUBLIÉ (DEMANDE)
// ==========================================
authRouter.post('/forgot-password', passwordResetLimiter, async (req, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    if (normalizedEmail) {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (user && user.isActive) {
        // Nettoyer les anciens jetons
        await prisma.passwordResetToken.deleteMany({
          where: { userId: user.id },
        });

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash: hashedResetToken,
            expiresAt,
          },
        });

        await mailService.sendPasswordResetEmail(user.email, rawToken);
      }
    }

    // Réponse invariable (anti-énumération)
    res.json({
      message: 'Si cette adresse e-mail correspond à un compte actif, vous recevrez un lien de réinitialisation sous peu.',
    });
  } catch (err) {
    console.error('[AUTH FORGOT PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la demande.' });
  }
});

// ==========================================
// 8. MOT DE PASSE OUBLIÉ (VALIDATION & RESET)
// ==========================================
authRouter.post('/reset-password', passwordResetLimiter, async (req, res: Response): Promise<void> => {
  try {
    const data = resetPasswordSchema.parse(req.body);
    const hashedToken = hashToken(data.token);

    const resetTokenDoc = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashedToken },
      include: { user: true },
    });

    if (!resetTokenDoc || resetTokenDoc.expiresAt < new Date()) {
      res.status(400).json({ error: 'Ce lien de réinitialisation est invalide ou a expiré.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenDoc.userId },
        data: {
          password: hashedPassword,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      }),
      // Supprimer le jeton utilisé
      prisma.passwordResetToken.delete({
        where: { id: resetTokenDoc.id },
      }),
      // Révoquer TOUS les refresh tokens de l'utilisateur pour déconnexion globale
      prisma.refreshToken.updateMany({
        where: { userId: resetTokenDoc.userId },
        data: { revoked: true },
      }),
    ]);

    await auditService.log({
      action: 'PASSWORD_RESET',
      targetResource: 'user',
      targetId: resetTokenDoc.userId,
      details: { email: resetTokenDoc.user.email },
      ipAddress: req.ip,
    });

    res.json({ message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Données invalides.' });
      return;
    }
    console.error('[AUTH RESET PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Impossible de réinitialiser le mot de passe.' });
  }
});

// ==========================================
// 9. PROFIL CONNECTÉ (ME)
// ==========================================
authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        entreprise: true,
        role: true,
        isActive: true,
        emailVerifie: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Profil introuvable.' });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error('[AUTH ME ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ==========================================
// 10. MISE À JOUR PROFIL
// ==========================================
authRouter.put('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nom, prenom, telephone, entreprise } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(nom && { nom: String(nom).trim() }),
        ...(prenom && { prenom: String(prenom).trim() }),
        ...(telephone && { telephone: String(telephone).trim() }),
        ...(entreprise !== undefined && { entreprise: entreprise ? String(entreprise).trim() : null }),
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
        entreprise: true,
        role: true,
        emailVerifie: true,
      },
    });

    res.json({ message: 'Profil mis à jour.', user: updated });
  } catch (err) {
    console.error('[AUTH UPDATE PROFILE ERROR]', err);
    res.status(500).json({ error: 'Impossible de mettre à jour le profil.' });
  }
});

// ==========================================
// 11. MODIFICATION DU MOT DE PASSE (DEPUIS L'ESPACE CLIENT)
// ==========================================
authRouter.put('/password', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || !passwordRegex.test(newPassword)) {
      res.status(400).json({
        error:
          'Le nouveau mot de passe doit comporter au moins 10 caractères et inclure une majuscule, une minuscule, un chiffre et un caractère spécial.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur introuvable.' });
      return;
    }

    if (currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user!.id },
        data: { password: hashedPassword },
      }),
      // Révocation de toutes les sessions
      prisma.refreshToken.updateMany({
        where: { userId: req.user!.id },
        data: { revoked: true },
      }),
    ]);

    // Émettre un nouveau set de cookies pour la session en cours
    await generateAndSetTokens(res, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await auditService.log({
      action: 'PASSWORD_CHANGE',
      targetResource: 'user',
      targetId: user.id,
      ipAddress: req.ip,
    });

    res.json({ message: 'Mot de passe modifié avec succès. Toutes vos autres sessions ont été fermées.' });
  } catch (err) {
    console.error('[AUTH PASSWORD ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du changement de mot de passe.' });
  }
});
