export type UserRole = 'client' | 'admin';

export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  entreprise?: string;
  role: UserRole;
  is_active: boolean;
  email_verifie: boolean;
  avatar_url?: string;
  adresses_livraison?: {
    label: string;
    ville: string;
    quartier: string;
    precision?: string;
    is_default?: boolean;
  }[];
  preferences?: {
    email_notifications: boolean;
    sms_notifications: boolean;
    newsletter: boolean;
  };
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'en_attente'
  | 'confirmee'
  | 'en_preparation'
  | 'en_livraison'
  | 'livree'
  | 'annulee';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  nom_produit: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  statut: OrderStatus;
  description: string;
  auteur_role: string;
  created_at: string;
}

export interface OrderMessage {
  id: string;
  order_id: string;
  user_id?: string;
  expediteur: 'client' | 'support' | 'admin';
  expediteur_nom: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  numero_commande: string;
  user_id: string;
  statut: OrderStatus;
  montant_total: number;
  mode_paiement: string;
  mode_livraison: 'livraison' | 'retrait_usine';
  adresse_livraison?: {
    ville: string;
    quartier: string;
    precision?: string;
  };
  date_livraison_souhaitee?: string;
  notes?: string;
  telephone_reception?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  events?: OrderEvent[];
  messages?: OrderMessage[];
}

export interface ClientNotification {
  id: string;
  user_id: string;
  order_id?: string;
  titre: string;
  message: string;
  lu: boolean;
  lien?: string;
  type?: 'commande' | 'info' | 'produit';
  created_at: string;
}

