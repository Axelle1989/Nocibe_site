import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth.middleware.js';
import { submissionLimiter } from '../middlewares/rateLimit.middleware.js';

export const contactRouter = Router();

const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom est obligatoire'),
  email: z.string().email('Format d’adresse email invalide'),
  sujet: z.string().min(3, 'Le sujet est obligatoire'),
  message: z.string().min(10, 'Le message doit comporter au moins 10 caractères'),
});

// Envoyer un message de contact (avec rate limiting strict)
contactRouter.post('/', submissionLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = contactSchema.parse(req.body);

    const contact = await prisma.contactMessage.create({
      data: {
        nom: data.nom.trim(),
        email: data.email.toLowerCase().trim(),
        sujet: data.sujet.trim(),
        message: data.message.trim(),
      },
    });

    res.status(201).json({ message: 'Message transmis avec succès à l’équipe NOCIBÉ.', id: contact.id });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0]?.message || 'Données fournies invalides.' });
      return;
    }
    console.error('[CONTACT POST ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
  }
});

// Admin: Voir tous les messages de contact
contactRouter.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ messages });
  } catch (err) {
    console.error('[CONTACT GET ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des messages.' });
  }
});

// Admin: Marquer un message comme lu
contactRouter.patch('/:id/read', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.update({
      where: { id },
      data: { lu: true },
    });
    res.json({ message: 'Message marqué comme lu.' });
  } catch (err) {
    console.error('[CONTACT MARK READ ERROR]', err);
    res.status(500).json({ error: 'Impossible de marquer le message.' });
  }
});
