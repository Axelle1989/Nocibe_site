// DONNÉES FICTIVES : à remplacer
// Organigramme et Direction Générale NOCIBÉ (Avatars sobres & noms béninois)

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
  bio: string;
  email: string;
  phone: string;
  fictif: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'christian-houndegla',
    name: 'Dr. Christian Houndégla',
    role: 'Directeur Général',
    department: 'Direction Générale',
    initials: 'CH',
    bio: 'Ingénieur en génie civil et docteur en matériaux minéraux, plus de 22 ans d\'expérience dans le management d\'industries lourdes en Afrique subsaharienne.',
    email: 'christian.houndegla@nocibe.bj',
    phone: '+229 01 21 30 11 01',
    fictif: true
  },
  {
    id: 'aicha-bio-guerra',
    name: 'Ing. Aïcha Bio Guerra',
    role: 'Directrice Technique & Exploitation Usine',
    department: 'Usine de Massé',
    initials: 'AB',
    bio: 'Spécialiste en procédés thermiques et clinkérisation, elle pilote les opérations d\'extraction, de cuisson au four rotatif et la maintenance continue.',
    email: 'aicha.bioguerra@nocibe.bj',
    phone: '+229 01 21 30 11 02',
    fictif: true
  },
  {
    id: 'patrice-dossou',
    name: 'Patrice Dossou',
    role: 'Directeur Commercial & Relations B2B',
    department: 'Direction Commerciale',
    initials: 'PD',
    bio: 'Expert en logistique industrielle et approvisionnement des chantiers d\'envergure, il supervise le réseau de distribution national et les grands comptes BTP.',
    email: 'patrice.dossou@nocibe.bj',
    phone: '+229 01 21 30 11 03',
    fictif: true
  },
  {
    id: 'nadia-agbangla',
    name: 'Nadia Agbangla',
    role: 'Responsable QHSE & Développement Durable',
    department: 'Qualité, Hygiène, Sécurité, Environnement',
    initials: 'NA',
    bio: 'Garantit la conformité stricte à la norme européenne EN 197-1, aux certifications ISO 9001 et ISO 14001, ainsi que les programmes de reboisement à Massé.',
    email: 'nadia.agbangla@nocibe.bj',
    phone: '+229 01 21 30 11 04',
    fictif: true
  },
  {
    id: 'marcellin-zinsou',
    name: 'Ing. Marcellin Zinsou',
    role: 'Chef du Laboratoire Central & Contrôle Qualité',
    department: 'Laboratoire et Métrologie',
    initials: 'MZ',
    bio: 'Pilote les analyses robotisées de fluorescence X et les essais mécaniques de compression à 2, 7 et 28 jours pour certifier chaque lot de ciment.',
    email: 'marcellin.zinsou@nocibe.bj',
    phone: '+229 01 21 30 11 05',
    fictif: true
  },
  {
    id: 'felicienne-alapini',
    name: 'Félicienne Alapini',
    role: 'Directrice des Ressources Humaines & RSE',
    department: 'Ressources Humaines',
    initials: 'FA',
    bio: 'Engagée pour le développement du capital humain local, elle orchestre les programmes de formation continue et les initiatives communautaires dans le Plateau.',
    email: 'felicienne.alapini@nocibe.bj',
    phone: '+229 01 21 30 11 06',
    fictif: true
  }
];

export default TEAM_MEMBERS;
