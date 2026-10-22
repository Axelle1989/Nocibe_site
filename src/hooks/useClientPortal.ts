import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Order, ClientNotification, OrderMessage, OrderStatus } from '../types/auth';

const MOCK_ORDERS_KEY = 'nocibe_client_orders_v1';
const MOCK_NOTIFS_KEY = 'nocibe_client_notifications_v1';

// Initial demo mock orders
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-2026-001',
    numero_commande: 'NOC-2026-048291',
    user_id: 'mock-client-01',
    statut: 'en_livraison',
    montant_total: 1840000,
    mode_paiement: 'Virement bancaire',
    mode_livraison: 'livraison',
    adresse_livraison: {
      ville: 'Cotonou',
      quartier: 'Akpakpa PK3',
      precision: 'Chantier Résidence Lagune - Face station',
    },
    date_livraison_souhaitee: '2026-10-18',
    telephone_reception: '+229 97 00 11 22',
    notes: 'Livraison par camion plateau de 30 tonnes si possible.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'item-1',
        order_id: 'ord-2026-001',
        nom_produit: 'Ciment CPJ 45 - Sac 50kg (Palette 40 sacs)',
        quantite: 400,
        prix_unitaire: 4600,
        prix_total: 1840000,
      },
    ],
    events: [
      {
        id: 'ev-1',
        order_id: 'ord-2026-001',
        statut: 'en_attente',
        description: 'Commande enregistrée sur le portail NOCIBÉ.',
        auteur_role: 'system',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'ev-2',
        order_id: 'ord-2026-001',
        statut: 'confirmee',
        description: 'Commande validée par le service commercial NOCIBÉ Cotonou.',
        auteur_role: 'admin',
        created_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      },
      {
        id: 'ev-3',
        order_id: 'ord-2026-001',
        statut: 'en_preparation',
        description: 'Palettes chargées au centre d’ensachage de l’usine de Massé.',
        auteur_role: 'admin',
        created_at: new Date(Date.now() - 86400000 * 0.8).toISOString(),
      },
      {
        id: 'ev-4',
        order_id: 'ord-2026-001',
        statut: 'en_livraison',
        description: 'Camion benne immatriculé BJ-4820 en cours d’acheminement vers Akpakpa.',
        auteur_role: 'admin',
        created_at: new Date(Date.now() - 86400000 * 0.2).toISOString(),
      },
    ],
    messages: [
      {
        id: 'msg-1',
        order_id: 'ord-2026-001',
        expediteur: 'admin',
        expediteur_nom: 'Logistique NOCIBÉ Massé',
        message: 'Bonjour M. Dossou, le camion a quitté la cimenterie à 07h30. Arrivée prévue vers 11h sur Akpakpa.',
        lu: true,
        created_at: new Date(Date.now() - 86400000 * 0.2).toISOString(),
      },
    ],
  },
  {
    id: 'ord-2026-002',
    numero_commande: 'NOC-2026-037190',
    user_id: 'mock-client-01',
    statut: 'livree',
    montant_total: 2600000,
    mode_paiement: 'Chèque certifié',
    mode_livraison: 'livraison',
    adresse_livraison: {
      ville: 'Abomey-Calavi',
      quartier: 'Bidossessi',
      precision: 'Hangar BTP Atlantique',
    },
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    items: [
      {
        id: 'item-2',
        order_id: 'ord-2026-002',
        nom_produit: 'Ciment CPA 55 Haute Résistance (Sac 50kg)',
        quantite: 500,
        prix_unitaire: 5200,
        prix_total: 2600000,
      },
    ],
    events: [
      {
        id: 'ev-10',
        order_id: 'ord-2026-002',
        statut: 'livree',
        description: 'Livraison réceptionnée et signée au dépôt Calavi.',
        auteur_role: 'admin',
        created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      },
    ],
  },
];

const INITIAL_DEMO_NOTIFS: ClientNotification[] = [
  {
    id: 'notif-1',
    user_id: 'mock-client-01',
    titre: 'Expédition en cours - Commande NOC-2026-048291',
    message: 'Votre ciment CPJ 45 a quitté l’usine de Massé en direction de votre chantier Akpakpa.',
    lu: false,
    lien: '/espace-client/commandes/ord-2026-001',
    type: 'commande',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'mock-client-01',
    titre: 'Nouveau ciment CPA 55 certifié EN 197-1',
    message: 'Découvrez la nouvelle formule haute résistance pour radiers et fondations lourdes.',
    lu: true,
    lien: '/espace-client/actualites',
    type: 'produit',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

export const useClientPortal = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders
  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // Try API
    try {
      const res = await api.orders.getMyOrders();
      if (res.orders) {
        setOrders(res.orders as any);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback to localStorage
    }

    try {
      const stored = localStorage.getItem(MOCK_ORDERS_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        setOrders(INITIAL_DEMO_ORDERS);
      }
    } catch {
      setOrders(INITIAL_DEMO_ORDERS);
    }
    setLoading(false);
  }, [user]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const stored = localStorage.getItem(MOCK_NOTIFS_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        localStorage.setItem(MOCK_NOTIFS_KEY, JSON.stringify(INITIAL_DEMO_NOTIFS));
        setNotifications(INITIAL_DEMO_NOTIFS);
      }
    } catch {
      setNotifications(INITIAL_DEMO_NOTIFS);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
    loadNotifications();
  }, [loadOrders, loadNotifications]);

  // Add order message
  const sendMessage = async (orderId: string, messageText: string, expediteurNom: string) => {
    if (!messageText.trim()) return;

    const newMsg: OrderMessage = {
      id: 'msg-' + Date.now(),
      order_id: orderId,
      user_id: user?.id,
      expediteur: 'client',
      expediteur_nom: expediteurNom,
      message: messageText.trim(),
      lu: true,
      created_at: new Date().toISOString(),
    };

    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            messages: [...(o.messages || []), newMsg],
          };
        }
        return o;
      });
      localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, lu: true } : n));
      localStorage.setItem(MOCK_NOTIFS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, lu: true }));
      localStorage.setItem(MOCK_NOTIFS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Place order
  const placeOrder = async (orderData: {
    items: { nom_produit: string; quantite: number; prix_unitaire: number; prix_total: number; product_id?: string }[];
    montant_total: number;
    mode_paiement: string;
    mode_livraison: 'livraison' | 'retrait_usine';
    adresse_livraison?: { ville: string; quartier: string; precision?: string };
    date_livraison_souhaitee?: string;
    notes?: string;
    telephone_reception?: string;
  }): Promise<{ success: boolean; orderId?: string; numero_commande?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Vous devez être connecté pour passer commande.' };
    }

    // Try API
    try {
      const res = await api.orders.create({
        items: orderData.items,
        montantTotal: orderData.montant_total,
        modePaiement: orderData.mode_paiement,
        modeLivraison: orderData.mode_livraison,
        adresseLivraison: orderData.adresse_livraison,
        dateLivraisonSouhaitee: orderData.date_livraison_souhaitee,
        notes: orderData.notes,
        telephoneReception: orderData.telephone_reception,
      });

      if (res.orderId) {
        await loadOrders();
        return { success: true, orderId: res.orderId, numero_commande: res.numeroCommande };
      }
    } catch {
      // Fallback to local simulation
    }

    // Local order creation
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const numero_commande = `NOC-2026-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      numero_commande,
      user_id: user.id,
      statut: 'en_attente',
      montant_total: orderData.montant_total,
      mode_paiement: orderData.mode_paiement,
      mode_livraison: orderData.mode_livraison,
      adresse_livraison: orderData.adresse_livraison,
      date_livraison_souhaitee: orderData.date_livraison_souhaitee,
      telephone_reception: orderData.telephone_reception,
      notes: orderData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderData.items.map((it, idx) => ({
        id: `it-${orderId}-${idx}`,
        order_id: orderId,
        product_id: it.product_id,
        nom_produit: it.nom_produit,
        quantite: it.quantite,
        prix_unitaire: it.prix_unitaire,
        prix_total: it.prix_total,
      })),
      events: [
        {
          id: `ev-${orderId}-1`,
          order_id: orderId,
          statut: 'en_attente',
          description: 'Commande enregistrée avec succès. En attente de validation usine.',
          auteur_role: 'system',
          created_at: new Date().toISOString(),
        },
      ],
      messages: [],
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Create notification
    const newNotif: ClientNotification = {
      id: 'notif-' + Date.now(),
      user_id: user.id,
      order_id: orderId,
      titre: `Commande validée : ${numero_commande}`,
      message: 'Votre commande a été transmise aux équipes logistiques de Massé.',
      lu: false,
      lien: `/espace-client/commandes/${orderId}`,
      type: 'commande',
      created_at: new Date().toISOString(),
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(MOCK_NOTIFS_KEY, JSON.stringify(updated));
      return updated;
    });

    return { success: true, orderId, numero_commande };
  };

  const unreadNotifsCount = notifications.filter(n => !n.lu).length;

  return {
    orders,
    notifications,
    unreadNotifsCount,
    loading,
    loadOrders,
    sendMessage,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    placeOrder,
  };
};

