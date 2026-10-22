// DONNÉES FICTIVES : à remplacer
// Frise chronologique et jalons historiques de la cimenterie NOCIBÉ

export interface HistoryMilestone {
  id: string;
  year: string;
  shortLabel: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  validated: boolean;
}

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: '2013',
    year: '2013',
    shortLabel: 'Fondation',
    category: 'FONDATION',
    title: 'Pose de la Première Pierre à Massé',
    description: 'Lancement solennel du chantier de construction du premier complexe intégré de production de clinker et ciment dans le département du Plateau.',
    icon: 'Hammer',
    validated: true,
  },
  {
    id: '2015',
    year: '2015',
    shortLabel: 'Industrie',
    category: 'INDUSTRIE',
    title: 'Allumage du Four Rotatif à 1 450 °C',
    description: 'Première cuisson industrielle du calcaire béninois. NOCIBÉ produit ses premières tonnes de clinker 100% national, concrétisant l\'autonomie industrielle.',
    icon: 'Flame',
    validated: true,
  },
  {
    id: '2018',
    year: '2018',
    shortLabel: 'Qualité',
    category: 'QUALITÉ',
    title: 'Certification Européenne EN 197-1',
    description: 'Reconnaissance officielle de la conformité de nos ciments CPJ 35, CPJ 45 et CPA 55 aux plus hauts standards de résistance et de durabilité.',
    icon: 'ShieldCheck',
    validated: true,
  },
  {
    id: '2021',
    year: '2021',
    shortLabel: 'Expansion',
    category: 'EXPANSION',
    title: 'Fourniture des Grands Chantiers',
    description: 'Choix de NOCIBÉ pour le coulage des quais du Port Autonome de Cotonou et les fondations de la zone spéciale de Glo-Djigbé (GDIZ).',
    icon: 'Buildings',
    validated: true,
  },
  {
    id: '2024',
    year: '2024',
    shortLabel: 'Innovation',
    category: 'INNOVATION',
    title: 'Unité de Broyage Vertical',
    description: 'Mise en service d\'un broyeur haute technologie portant la capacité à 2,1 millions de tonnes par an tout en réduisant l\'empreinte énergétique.',
    icon: 'Cpu',
    validated: true,
  },
  {
    id: '2026',
    year: '2026',
    shortLabel: 'Aujourd\'hui',
    category: 'AVENIR',
    title: 'Décarbonation & Digitalisation',
    description: 'Déploiement du portail client sécurisé, suivi en direct des expéditions de ciment et renforcement de l\'économie circulaire à l\'usine.',
    icon: 'Sparkle',
    validated: true,
  },
];
