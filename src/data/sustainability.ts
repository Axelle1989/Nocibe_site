// DONNÉES FICTIVES : à remplacer
// Engagements RSE, Objectifs 2030 et Sécurité & Qualité NOCIBÉ

export interface Goal2030 {
  id: string;
  title: string;
  targetYear: string;
  currentPercentage: number;
  targetDescription: string;
  iconName: string;
}

export const OBJECTIFS_2030: Goal2030[] = [
  {
    id: 'emissions-co2',
    title: 'Décarbonation & Efficacité Thermique',
    targetYear: '2030',
    currentPercentage: 68,
    targetDescription: 'Réduction de 30% des émissions spécifiques de CO₂ par tonne de ciment grâce au préchauffeur à 5 étages et aux combustibles alternatifs.',
    iconName: 'Leaf'
  },
  {
    id: 'reboisement-carrieres',
    title: 'Réhabilitation des Carrières & Biodiversité',
    targetYear: '2030',
    currentPercentage: 82,
    targetDescription: '100% des fronts d\'extraction de calcaire et d\'argile réhabilités et reboisés avec des essences d\'arbres indigènes dans la commune d\'Adja-Ouèrè.',
    iconName: 'Tree'
  },
  {
    id: 'recyclage-eau',
    title: 'Gestion Circulaire de l\'Eau',
    targetYear: '2030',
    currentPercentage: 90,
    targetDescription: 'Recyclage en circuit fermé de 95% des eaux de refroidissement des broyeurs et compresseurs sans rejet polluant dans les nappes phréatiques.',
    iconName: 'Drop'
  },
  {
    id: 'zero-accident',
    title: 'Objectif Zéro Accident & Santé au Travail',
    targetYear: '2030',
    currentPercentage: 94,
    targetDescription: 'Standard d\'or de sécurité industrielle avec plus de 500 jours consécutifs sans accident avec arrêt de travail sur le site de Massé.',
    iconName: 'ShieldCheck'
  }
];

export const SAFETY_PILLARS = [
  {
    title: 'Équipements de Protection Individuelle (EPI)',
    description: 'Port obligatoire du casque, chaussures de sécurité coquées, gants anticoupures et lunettes étanches sur 100% des zones industrielles.',
    highlight: 'Contrôle à chaque sas d\'accès'
  },
  {
    title: 'Culture de Sécurité Partagée',
    description: 'Quart d\'heure sécurité quotidien avant chaque prise de poste et formation continue de tous les conducteurs de camions et opérateurs.',
    highlight: '100% des salariés formés'
  },
  {
    title: 'Maintenance Préventive & Robotisée',
    description: 'Surveillance thermographique des paliers, analyse vibratoire continue du four rotatif et capteurs d\'étanchéité sur les filtres à poussières.',
    highlight: 'Captation poussières à 99,9%'
  }
];
