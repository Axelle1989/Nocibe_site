import { Router, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { authenticateToken, requireAdmin, requireVerified, AuthRequest } from '../middlewares/auth.middleware.js';
import { OrderStatus } from '@prisma/client';
import { auditService } from '../services/audit.service.js';

export const ordersRouter = Router();

// Mes commandes (Client authentifié)
ordersRouter.get('/my', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: true,
        events: { orderBy: { createdAt: 'asc' } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error('[ORDERS MY ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement des commandes.' });
  }
});

// Toutes les commandes (Admin NOCIBÉ uniquement)
ordersRouter.get('/all', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true, nom: true, prenom: true, telephone: true, entreprise: true } },
        items: true,
        events: { orderBy: { createdAt: 'asc' } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error('[ORDERS ALL ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du chargement de l’ensemble des commandes.' });
  }
});

// Détail d'une commande (Protection IDOR stricte)
ordersRouter.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { numeroCommande: id }],
      },
      include: {
        user: { select: { id: true, email: true, nom: true, prenom: true, telephone: true, entreprise: true } },
        items: true,
        events: { orderBy: { createdAt: 'asc' } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Commande introuvable.' });
      return;
    }

    // Contrôle IDOR : L'utilisateur doit être le propriétaire ou un administrateur
    if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
      res.status(403).json({ error: 'Accès non autorisé à cette commande.' });
      return;
    }

    res.json({ order });
  } catch (err) {
    console.error('[ORDER DETAIL ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
});

// Créer une commande (Email vérifié obligatoire + recalcul strict des prix en BDD)
ordersRouter.post('/', authenticateToken, requireVerified, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      items,
      modePaiement,
      modeLivraison,
      adresseLivraison,
      dateLivraisonSouhaitee,
      notes,
      telephoneReception,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'La commande doit comporter au moins un produit.' });
      return;
    }

    // Recalcul sécurisé des prix côté serveur à partir du catalogue certifié
    const orderItemsData = [];
    let calculatedMontantTotal = 0;

    for (const item of items) {
      const productId = item.productId || item.product_id || item.id;
      const slug = item.slug;
      const quantite = Math.max(1, parseInt(item.quantite || item.quantity, 10) || 1);

      // Recherche du produit en base
      const product = await prisma.product.findFirst({
        where: {
          OR: [
            ...(productId ? [{ id: String(productId) }] : []),
            ...(slug ? [{ slug: String(slug) }] : []),
          ],
        },
      });

      if (!product) {
        res.status(400).json({
          error: `Le produit sélectionné (${item.nomProduit || item.name || productId}) est introuvable au catalogue.`,
        });
        return;
      }

      const unitPrice = product.unitPrice;
      const itemTotal = unitPrice * quantite;
      calculatedMontantTotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        nomProduit: product.name,
        quantite,
        prixUnitaire: unitPrice,
        prixTotal: itemTotal,
      });
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const numeroCommande = `NOC-2026-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        numeroCommande,
        userId: req.user!.id,
        montantTotal: calculatedMontantTotal,
        modePaiement: modePaiement || 'Virement bancaire',
        modeLivraison: modeLivraison || 'livraison',
        adresseLivraison: adresseLivraison || null,
        dateLivraisonSouhaitee: dateLivraisonSouhaitee || null,
        notes: notes || null,
        telephoneReception: telephoneReception || null,
        statut: OrderStatus.EN_ATTENTE,
        items: {
          create: orderItemsData,
        },
        events: {
          create: {
            statut: OrderStatus.EN_ATTENTE,
            description: 'Commande enregistrée sur le portail NOCIBÉ. En attente de validation commerciale.',
            auteurRole: 'system',
          },
        },
      },
      include: {
        items: true,
        events: true,
      },
    });

    // Notification interne client
    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        titre: `Commande ${numeroCommande} créée`,
        message: `Votre commande de ${orderItemsData.length} référence(s) pour un montant total de ${calculatedMontantTotal.toLocaleString('fr-FR')} FCFA a été enregistrée.`,
        type: 'success',
        lien: '/espace-client/commandes',
      },
    });

    res.status(201).json({
      message: 'Commande validée avec succès.',
      order,
      orderId: order.id,
      numeroCommande: order.numeroCommande,
      montantTotal: calculatedMontantTotal,
    });
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
  }
});

// Admin: Changer le statut d'une commande + Traçabilité AuditLog
ordersRouter.put('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { statut, description } = req.body;

    const validStatus = Object.values(OrderStatus).includes(statut as OrderStatus);
    if (!validStatus) {
      res.status(400).json({ error: 'Statut de commande invalide.' });
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Commande introuvable.' });
      return;
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        statut: statut as OrderStatus,
        events: {
          create: {
            statut: statut as OrderStatus,
            description: description || `Mise à jour du statut : ${statut}`,
            auteurRole: 'admin',
          },
        },
      },
    });

    // Journal d'audit pour traçabilité administrative
    await auditService.log({
      adminId: req.user!.id,
      action: 'UPDATE_ORDER_STATUS',
      targetResource: 'order',
      targetId: order.id,
      details: {
        numeroCommande: order.numeroCommande,
        previousStatus: existingOrder.statut,
        newStatus: statut,
      },
      ipAddress: req.ip,
    });

    // Notifier le client
    await prisma.notification.create({
      data: {
        userId: order.userId,
        titre: `Mise à jour commande ${order.numeroCommande}`,
        message: description || `Le statut de votre commande est passé à ${statut}.`,
        type: 'info',
        lien: '/espace-client/commandes',
      },
    });

    res.json({ message: 'Statut mis à jour.', order });
  } catch (err) {
    console.error('[UPDATE ORDER STATUS ERROR]', err);
    res.status(500).json({ error: 'Erreur lors du changement de statut.' });
  }
});

// Envoyer un message dans une commande (Protection IDOR)
ordersRouter.post('/:id/messages', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400).json({ error: 'Le message ne peut pas être vide.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      res.status(404).json({ error: 'Commande introuvable.' });
      return;
    }

    // Protection IDOR : seul l'administrateur ou l'acheteur peut poster
    const isAdm = req.user!.role === 'ADMIN';
    if (!isAdm && order.userId !== req.user!.id) {
      res.status(403).json({ error: 'Accès non autorisé aux échanges de cette commande.' });
      return;
    }

    const orderMsg = await prisma.orderMessage.create({
      data: {
        orderId: id,
        userId: req.user!.id,
        expediteur: isAdm ? 'admin' : 'client',
        expediteurNom: isAdm ? 'Logistique NOCIBÉ Massé' : `${req.user!.prenom} ${req.user!.nom}`,
        message: message.trim(),
        lu: isAdm,
      },
    });

    res.status(201).json({ message: 'Message envoyé.', data: orderMsg });
  } catch (err) {
    console.error('[SEND ORDER MESSAGE ERROR]', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi du message.' });
  }
});
