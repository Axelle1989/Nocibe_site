import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middlewares/auth.middleware.js';
import { PublishStatus } from '@prisma/client';

export const newsRouter = Router();

// ========================================================
// 1. COMMUNIQUÉS OFFICIELS
// ========================================================

// GET /api/news/communiques
newsRouter.get('/communiques', async (_req: Request, res: Response): Promise<void> => {
  try {
    const communiques = await prisma.communique.findMany({
      where: { statut: PublishStatus.PUBLIE },
      orderBy: { date: 'desc' },
    });
    res.json({ communiques });
  } catch (err) {
    console.error('[GET COMMUNIS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des communiqués.' });
  }
});

// GET /api/news/communiques/:slug
newsRouter.get('/communiques/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const communique = await prisma.communique.findUnique({
      where: { slug },
    });

    if (!communique || communique.statut !== PublishStatus.PUBLIE) {
      res.status(404).json({ error: 'Communiqué introuvable.' });
      return;
    }

    res.json({ communique });
  } catch (err) {
    console.error('[GET COMMUNIQUE DETAIL ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement du communiqué.' });
  }
});

// ========================================================
// 2. ÉVÉNEMENTS INDUSTRIELS & INSTITUTIONNELS
// ========================================================

// GET /api/news/events
newsRouter.get('/events', async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      where: { statut: PublishStatus.PUBLIE },
      orderBy: { dateDebut: 'asc' },
    });
    res.json({ events });
  } catch (err) {
    console.error('[GET EVENTS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des événements.' });
  }
});

// GET /api/news/events/:slug
newsRouter.get('/events/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const event = await prisma.event.findUnique({
      where: { slug },
    });

    if (!event || event.statut !== PublishStatus.PUBLIE) {
      res.status(404).json({ error: 'Événement introuvable.' });
      return;
    }

    res.json({ event });
  } catch (err) {
    console.error('[GET EVENT DETAIL ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement de l’événement.' });
  }
});

// ========================================================
// 3. ADMINISTRATION (COMMUNIQUÉS & ÉVÉNEMENTS)
// ========================================================

newsRouter.post('/admin/communiques', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titre, slug, categorie, resume, contenu, pdfUrl, pdfName } = req.body;
    const com = await prisma.communique.create({
      data: {
        titre,
        slug: slug || titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        categorie: categorie || 'Direction Générale',
        resume,
        contenu,
        pdfUrl: pdfUrl || null,
        pdfName: pdfName || null,
        statut: PublishStatus.PUBLIE,
      },
    });
    res.status(201).json({ message: 'Communiqué créé.', communique: com });
  } catch (err) {
    console.error('[ADMIN CREATE COMMUNIQUE ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la création du communiqué.' });
  }
});

newsRouter.post('/admin/events', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { titre, slug, type, dateDebut, dateFin, lieu, ville, lat, lng, resume, description, image } = req.body;
    const ev = await prisma.event.create({
      data: {
        titre,
        slug: slug || titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        type: type || 'Conférence',
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        lieu,
        ville: ville || 'Massé',
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        resume,
        description,
        image: image || null,
        statut: PublishStatus.PUBLIE,
      },
    });
    res.status(201).json({ message: 'Événement créé.', event: ev });
  } catch (err) {
    console.error('[ADMIN CREATE EVENT ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la création de l’événement.' });
  }
});
