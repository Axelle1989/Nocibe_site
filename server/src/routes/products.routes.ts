import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js';

export const productsRouter = Router();

// Liste des ciments / produits
productsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ products });
  } catch (err) {
    console.error('[PRODUCTS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
  }
});

// Détail d'un produit par slug
productsRouter.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      res.status(404).json({ error: 'Produit non trouvé.' });
      return;
    }

    res.json({ product });
  } catch (err) {
    console.error('[PRODUCT SLUG ERROR]', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Admin: Créer un produit
productsRouter.post('/', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).json({ message: 'Produit créé.', product });
  } catch (err) {
    console.error('[ADMIN CREATE PRODUCT ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la création du produit.' });
  }
});

// Admin: Mettre à jour un produit
productsRouter.put('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json({ message: 'Produit mis à jour.', product });
  } catch (err) {
    console.error('[ADMIN UPDATE PRODUCT ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});
