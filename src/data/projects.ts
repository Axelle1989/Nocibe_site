// DONNÉES FICTIVES : à remplacer
export interface Project {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Industrie' | 'Portuaire' | 'Édifices publics' | 'Routier';
  location: string;
  year: string;
  cimentUtilise: string;
  description: string;
  image: string;
  chiffreCle?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'port-autonome-cotonou',
    title: 'Extension & Modernisation du Port Autonome de Cotonou',
    category: 'Portuaire',
    location: 'Cotonou, Littoral',
    year: '2022 - 2024',
    cimentUtilise: 'CPA 55 & CPJ 45 Haute Durabilité',
    description: 'Coulage des quais d\'accostage en eau profonde, bassins logistiques et terre-pleins lourds soumis aux agressions marines et sels de chlorure.',
    image: '/images/realisations/port-cotonou.webp',
    chiffreCle: '+45 000 T de ciment coulé',
  },
  {
    id: 'gdiz-glo-djigbe',
    title: 'Zone Industrielle Spéciale de Glo-Djigbé (GDIZ)',
    category: 'Industrie',
    location: 'Glo-Djigbé, Atlantique',
    year: '2021 - En cours',
    cimentUtilise: 'CPJ 45 Résistance Rapide',
    description: 'Fondations des hangars industriels textile, unités agroalimentaires, dalots d\'assainissement et voiries lourdes de transit des conteneurs.',
    image: '/images/realisations/gdiz-glo-djigbe.webp',
    chiffreCle: '400 hectares viabilisés',
  },
  {
    id: 'complexe-industriel-masse',
    title: 'Complexe Cimentier Intégré de Massé',
    category: 'Industrie',
    location: 'Massé, Plateau',
    year: '2019 - 2021',
    cimentUtilise: 'CPA 55 Haute Performance',
    description: 'Silos de stockage de clinker de 50m de hauteur, massifs de fondation du four rotatif et plateformes de broyage vertical haute capacité.',
    image: '/images/vue-aerienne-usine-hd.jpg',
    chiffreCle: '1,5 M tonnes/an de capacité',
  },
  {
    id: 'pont-oueme-bonou',
    title: 'Ouvrages d\'Art & Dalots de Franchissement du Fleuve Ouémé',
    category: 'Infrastructure',
    location: 'Bonou / Adjohoun, Ouémé',
    year: '2020 - 2023',
    cimentUtilise: 'CPA 55 Prémix Ouvrage d\'Art',
    description: 'Piles de ponts coulées sous eau, tabliers en béton précontraint et culées résistantes aux crues saisonnières intenses.',
    image: '/images/realisations/pont-porto-novo.webp',
    chiffreCle: '50+ dalots & ponts construits',
  },
  {
    id: 'asphaltage-cotonou-porto-novo',
    title: 'Projet Asphaltage des Grandes Agglomérations',
    category: 'Routier',
    location: 'Cotonou, Porto-Novo, Parakou',
    year: '2018 - 2024',
    cimentUtilise: 'CPJ 35 & CPJ 45 Voirie',
    description: 'Bordures coulées sur place, caniveaux d\'évacuation pluviale préfabriqués, pavage lourd et assainissement urbain durable.',
    image: '/images/realisations/echangeur-vedoko.webp',
    chiffreCle: '180 km de voiries stabilisées',
  },
  {
    id: 'chur-abomey-calavi',
    title: 'Centre Hospitalier Universitaire de Référence (CHUR)',
    category: 'Édifices publics',
    location: 'Abomey-Calavi, Atlantique',
    year: '2021 - 2024',
    cimentUtilise: 'CPJ 45 Bâtiment Résistant',
    description: 'Superstructure multipolaire de pointe, radiologie blindée en béton baryté haute densité et dalles techniques anti-vibrations.',
    image: '/images/realisations/tour-administrative.webp',
    chiffreCle: '530 lits & blocs opératoires',
  },
];
