// Répertoire typé des ciments et liants hydrauliques NOCIBÉ
// Norme de référence : NF EN 197-1

/*
 * TODO [CLIENT NOCIBÉ] - Photos officielles attendues :
 * Les photos réelles haute définition fournies concernent le ciment CPJ 35 (palette fond blanc, sac seul, 4 vues, sac ouvert truelle, palette chantier).
 * Les produits suivants attendent leurs clichés d'emballage officiels dédiés :
 * - CPJ 45 (CEM II/A-LL 42.5 R)
 * - CPA 55 (CEM I 52.5 R)
 * - Ciment Spécial Prémix Travaux Maritimes (CEM II/A 42.5 PM-ES)
 * - Ciment Haute Résistance Vrac Citerne (CPJ 45 Vrac)
 * - Ciment NOCIBÉ Export CEM II/B-L (Export UEMOA)
 * En attendant, ils utilisent de manière cohérente les photos réelles de la gamme et le composant CementBagGraphic sans aucune photo hors-sujet (aucun camion, bâtiment ni vue aérienne d'usine).
 */

export interface Product {
  id: string;
  name: string;
  title: string;
  slug: string;
  shortGrade: string;
  classe: string;
  designation: string;
  isFeatured?: boolean;
  isRecommended?: boolean;
  nouveau?: boolean;
  badge?: string;
  targetUse: string;
  shortDesc: string;
  description: string;
  resistance2d: string;
  resistance28d: string;
  packaging: string;
  unit: 'sacs' | 'tonnes';
  unitPrice: number; // in FCFA (fictif)
  priceDisplay: string;
  standard: string;
  applications: string[];
  strengths: string[];
  gallery: string[];
  technicalData: {
    blaineFineness: string;
    initialSet: string;
    resistance2j: string;
    resistance28j: string;
    priseDebut: string;
    stabilite: string;
    perteFeu: string;
  };
  pdfFile: {
    name: string;
    size: string;
    url: string;
  };
  image: string;
  fictif: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'cpj-35',
    name: 'Ciment NOCIBÉ CPJ 35',
    title: 'Ciment NOCIBÉ CPJ 35',
    slug: 'ciment-nocibe-cpj-35',
    shortGrade: 'CPJ 35',
    classe: '32.5 R',
    designation: 'CEM II/B-LL 32.5 R',
    isFeatured: false,
    isRecommended: false,
    nouveau: false,
    badge: 'Courant & Bâtiment',
    targetUse: 'Travaux courants de maçonnerie, parpaings, enduits de façade et chapes.',
    shortDesc: 'Travaux courants de maçonnerie, parpaings, enduits de façade et chapes.',
    description: 'Le ciment polyvalent par excellence formulé pour tous les travaux courants du bâtiment au Bénin : mortiers de pose, fabrication d\'agglos vibrés, enduits et chapes lisses sans faïençage.',
    resistance2d: '≥ 12 MPa',
    resistance28d: '32,5 - 52,5 MPa',
    packaging: 'Sac de 50 kg & Vrac',
    unit: 'sacs',
    unitPrice: 4200,
    priceDisplay: '4 200 FCFA / sac 50kg',
    standard: 'EN 197-1 (CEM II/B-LL 32.5 R)',
    applications: [
      'Maçonnerie courante (murs de clôture, élévation agglos)',
      'Enduits de façade intérieurs et extérieurs',
      'Chapes de sol et pose de carrelage',
      'Bétons de propreté et fondations légères'
    ],
    strengths: [
      'Excellente plasticité facilitant le talochage',
      'Prise régulière sans fissuration de surface',
      'Rapport qualité / coût optimal pour maisons individuelles'
    ],
    gallery: [
      '/images/produits/cpj-35-palette-fond-blanc.webp',
      '/images/produits/cpj-35-sac-seul-chantier.webp',
      '/images/produits/cpj-35-sac-4-vues.webp',
      '/images/produits/cpj-35-sac-ouvert-truelle.webp',
      '/images/produits/cpj-35-palette-chantier.webp'
    ],
    technicalData: {
      blaineFineness: '3 600 cm²/g',
      initialSet: '≥ 75 min',
      resistance2j: '≥ 12 MPa',
      resistance28j: '32.5 à 52.5 MPa',
      priseDebut: '≥ 75 min',
      stabilite: '≤ 10 mm',
      perteFeu: '≤ 5.0 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_CPJ35.pdf',
      size: '245 Ko',
      url: '/docs/fiche-technique-cpj35.pdf'
    },
    image: '/images/produits/cpj-35-palette-fond-blanc.webp',
    fictif: false
  },
  {
    id: 'cpj-45',
    name: 'Ciment NOCIBÉ CPJ 45',
    title: 'Ciment NOCIBÉ CPJ 45',
    slug: 'ciment-nocibe-cpj-45',
    shortGrade: 'CPJ 45',
    classe: '42.5 R',
    designation: 'CEM II/A-LL 42.5 R',
    isFeatured: true,
    isRecommended: true,
    nouveau: false,
    badge: 'Recommandé Génie Civil',
    targetUse: 'Béton armé, structures porteuses, dalles, poteaux, poutres et immeubles R+1/R+8.',
    shortDesc: 'Béton armé, structures porteuses, dalles, poteaux, poutres et immeubles R+1/R+8.',
    description: 'Le ciment phare des chantiers structurants au Bénin. Cuit à 1 450 °C au four rotatif de Massé, il offre une cinétique de durcissement rapide garantissant un décoffrage sécurisé et une résistance centenaire.',
    resistance2d: '≥ 20 MPa',
    resistance28d: '42,5 - 62,5 MPa',
    packaging: 'Sac de 50 kg & Vrac citerne',
    unit: 'sacs',
    unitPrice: 4500,
    priceDisplay: '4 500 FCFA / sac 50kg',
    standard: 'EN 197-1 (CEM II/A-LL 42.5 R)',
    applications: [
      'Béton armé pour dalles pleines, poutres et poteaux',
      'Semelles de fondation, longrines et radiers',
      'Immeubles multipolaires R+1 à R+8 et complexes industriels',
      'Éléments préfabriqués (dalots, caniveaux, bordures T2)'
    ],
    strengths: [
      'Résistance rapide permettant un décoffrage accéléré',
      'Résistance optimale à l\'humidité tropicale résiduelle',
      'Adhérence maximale sur aciers à haute adhérence (FeE500)'
    ],
    gallery: [
      '/images/produits/cpj-35-sac-seul-chantier.webp',
      '/images/produits/cpj-35-palette-fond-blanc.webp',
      '/images/produits/cpj-35-sac-4-vues.webp'
    ],
    technicalData: {
      blaineFineness: '4 100 cm²/g',
      initialSet: '≥ 60 min',
      resistance2j: '≥ 20 MPa',
      resistance28j: '≥ 42.5 MPa',
      priseDebut: '≥ 60 min',
      stabilite: '≤ 5 mm',
      perteFeu: '≤ 3.5 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_CPJ45.pdf',
      size: '260 Ko',
      url: '/docs/fiche-technique-cpj45.pdf'
    },
    image: '/images/produits/cpj-35-sac-seul-chantier.webp',
    fictif: false
  },
  {
    id: 'cpa-55',
    name: 'Ciment NOCIBÉ CPA 55',
    title: 'Ciment NOCIBÉ CPA 55',
    slug: 'ciment-nocibe-cpa-55',
    shortGrade: 'CPA 55',
    classe: '52.5 R',
    designation: 'CEM I 52.5 R',
    isFeatured: false,
    isRecommended: false,
    nouveau: false,
    badge: 'Haute Performance',
    targetUse: 'Ouvrages d\'art, ponts fluviaux, quais portuaires et béton précontraint.',
    shortDesc: 'Ouvrages d\'art, ponts fluviaux, quais portuaires et béton précontraint.',
    description: 'Ciment Portland pur à très haute teneur en clinker (>95%). Spécifiquement élaboré pour les travaux maritimes sévères (Port de Cotonou) et les bétons à hautes performances nécessitant une résistance extrême.',
    resistance2d: '≥ 30 MPa',
    resistance28d: '≥ 52,5 MPa',
    packaging: 'Vrac pulvérulent citerne & Sacs 50 kg',
    unit: 'sacs',
    unitPrice: 4900,
    priceDisplay: '4 900 FCFA / sac 50kg',
    standard: 'EN 197-1 (CEM I 52.5 R)',
    applications: [
      'Piles et tabliers de ponts, quais maritimes sous eau',
      'Béton précontraint et voussoirs industriels',
      'Plates-formes logistiques lourdes pour conteneurs (GDIZ)',
      'Silos industriels et réservoirs de grande capacité'
    ],
    strengths: [
      'Résistance initiale fulgurante (≥ 30 MPa à 48 heures)',
      'Très haute compacité et imperméabilité aux ions chlorures',
      'Idéal pour centrales à béton prémélangé de haute cadence'
    ],
    gallery: [
      '/images/produits/cpj-35-sac-4-vues.webp',
      '/images/produits/cpj-35-palette-fond-blanc.webp',
      '/images/produits/cpj-35-sac-ouvert-truelle.webp'
    ],
    technicalData: {
      blaineFineness: '4 800 cm²/g',
      initialSet: '≥ 45 min',
      resistance2j: '≥ 30 MPa',
      resistance28j: '≥ 52.5 MPa',
      priseDebut: '≥ 45 min',
      stabilite: '≤ 3 mm',
      perteFeu: '≤ 2.0 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_CPA55.pdf',
      size: '285 Ko',
      url: '/docs/fiche-technique-cpa55.pdf'
    },
    image: '/images/produits/cpj-35-sac-4-vues.webp',
    fictif: false
  },
  {
    id: 'ciment-special',
    name: 'Ciment Spécial Prémix Travaux Maritimes',
    title: 'Ciment Spécial Prémix Travaux Maritimes',
    slug: 'ciment-special-premix-maritime',
    shortGrade: 'Ciment Spécial PM',
    classe: '42.5 PM-ES',
    designation: 'CEM II/A 42.5 PM-ES',
    isFeatured: false,
    isRecommended: false,
    nouveau: true,
    badge: 'Nouveau',
    targetUse: 'Ouvrages côtiers, digues, fondations en nappe phréatique saumâtre.',
    shortDesc: 'Ouvrages côtiers, digues, fondations en nappe phréatique saumâtre.',
    description: 'Formulation novatrice résistant aux eaux de mer et sols sulfatés. Développée pour répondre aux impératifs d\'assainissement lourd sur le cordon littoral béninois.',
    resistance2d: '≥ 22 MPa',
    resistance28d: '≥ 45,0 MPa',
    packaging: 'Sac de 50 kg plastifié & Big-Bag 1,5T',
    unit: 'sacs',
    unitPrice: 5200,
    priceDisplay: '5 200 FCFA / sac 50kg',
    standard: 'EN 197-1 / NF P 15-317 (PM-ES)',
    applications: [
      'Quais de pêche et digues de protection océanique',
      'Fondations en milieu lagunaire acide ou salin',
      'Stations d\'épuration et caniveaux d\'eaux usées'
    ],
    strengths: [
      'Immunité aux attaques d\'alcali-réaction et sulfates',
      'Faible chaleur d\'hydratation limitant les fissures thermiques',
      'Protection accrue des armatures galvanisées'
    ],
    gallery: [
      '/images/produits/cpj-35-sac-ouvert-truelle.webp',
      '/images/produits/cpj-35-palette-fond-blanc.webp',
      '/images/produits/cpj-35-sac-seul-chantier.webp'
    ],
    technicalData: {
      blaineFineness: '4 300 cm²/g',
      initialSet: '≥ 70 min',
      resistance2j: '≥ 22 MPa',
      resistance28j: '≥ 45.0 MPa',
      priseDebut: '≥ 70 min',
      stabilite: '≤ 3 mm',
      perteFeu: '≤ 2.5 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_Special_PM.pdf',
      size: '270 Ko',
      url: '/docs/fiche-technique-special-pm.pdf'
    },
    image: '/images/produits/cpj-35-sac-ouvert-truelle.webp',
    fictif: false
  },
  {
    id: 'ciment-vrac',
    name: 'Ciment Haute Résistance Vrac Citerne',
    title: 'Ciment Haute Résistance Vrac Citerne',
    slug: 'ciment-haute-resistance-vrac-citerne',
    shortGrade: 'CPJ 45 Vrac',
    classe: '42.5 R Vrac',
    designation: 'CEM II/A-LL 42.5 R Vrac',
    isFeatured: false,
    isRecommended: false,
    nouveau: false,
    badge: 'Centrales BPE & Silos',
    targetUse: 'Centrales à béton prémélangé, usines de parpaings automatiques et préfabrication lourde.',
    shortDesc: 'Livraison par camion citerne pulvérulente de 35 tonnes directement dans vos silos de chantier.',
    description: 'Solution logistique par excellence pour les industriels du BTP. Approvisionnement continu garantissant une fluidité maximale sans manutention de sacs.',
    resistance2d: '≥ 20 MPa',
    resistance28d: '≥ 45,0 MPa',
    packaging: 'Vrac en camion citerne de 35 tonnes',
    unit: 'tonnes',
    unitPrice: 86000,
    priceDisplay: '86 000 FCFA / tonne',
    standard: 'EN 197-1 CEM II/A-LL 42.5 R',
    applications: [
      'Alimentation continue des silos de chantier',
      'Centrales à béton prêt à l\'emploi (BPE)',
      'Unités de fabrication automatisée d\'agglos et bordures'
    ],
    strengths: [
      'Gain économique sur le conditionnement papier',
      'Dépotage pneumatique rapide en moins de 45 minutes',
      'Zéro perte matière lors de la manipulation'
    ],
    gallery: [
      '/images/produits/cpj-35-palette-chantier.webp',
      '/images/produits/cpj-35-palette-fond-blanc.webp'
    ],
    technicalData: {
      blaineFineness: '4 150 cm²/g',
      initialSet: '≥ 60 min',
      resistance2j: '≥ 20 MPa',
      resistance28j: '≥ 45.0 MPa',
      priseDebut: '≥ 60 min',
      stabilite: '≤ 4 mm',
      perteFeu: '≤ 3.0 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_Vrac.pdf',
      size: '255 Ko',
      url: '/docs/fiche-technique-vrac.pdf'
    },
    image: '/images/produits/cpj-35-palette-chantier.webp',
    fictif: false
  },
  {
    id: 'ciment-export',
    name: 'Ciment NOCIBÉ Export CEM II/B-L',
    title: 'Ciment NOCIBÉ Export CEM II/B-L',
    slug: 'ciment-nocibe-export-uemoa',
    shortGrade: 'Export UEMOA',
    classe: '32.5 N',
    designation: 'CEM II/B-L 32.5 N',
    isFeatured: false,
    isRecommended: false,
    nouveau: true,
    badge: 'Nouveau',
    targetUse: 'Corridor d\'exportation sous-régional (Niger, Burkina Faso, Togo, Mali).',
    shortDesc: 'Conditionnement renforcé sous film étirable résistant aux longs trajets transsahariens.',
    description: 'Ciment certifié selon les standards harmonisés de la CEDEAO et de l\'UEMOA. Palettisation sous bâche thermique thermo-rétractable assurant une préservation totale des qualités minérales.',
    resistance2d: '≥ 10 MPa',
    resistance28d: '≥ 32,5 MPa',
    packaging: 'Palette de 40 sacs (2T) thermo-houssée ou vrac conteneur',
    unit: 'tonnes',
    unitPrice: 78000,
    priceDisplay: '78 000 FCFA / tonne',
    standard: 'EN 197-1 / Norme UEMOA',
    applications: [
      'Grands projets routiers et d\'assainissement transfrontaliers',
      'Marchés régionaux de distribution BTP',
      'Infrastructures logistiques sahéliennes'
    ],
    strengths: [
      'Emballage tri-couche résistant à la poussière et aux intempéries',
      'Traçabilité douanière simplifiée par QR-code certifié',
      'Tenue au stockage prolongé jusqu\'à 6 mois'
    ],
    gallery: [
      '/images/produits/cpj-35-palette-fond-blanc.webp',
      '/images/produits/cpj-35-sac-4-vues.webp'
    ],
    technicalData: {
      blaineFineness: '3 700 cm²/g',
      initialSet: '≥ 80 min',
      resistance2j: '≥ 10 MPa',
      resistance28j: '≥ 32.5 MPa',
      priseDebut: '≥ 80 min',
      stabilite: '≤ 8 mm',
      perteFeu: '≤ 4.5 %'
    },
    pdfFile: {
      name: 'Fiche_Technique_NOCIBE_Export.pdf',
      size: '290 Ko',
      url: '/docs/fiche-technique-export.pdf'
    },
    image: '/images/produits/cpj-35-palette-fond-blanc.webp',
    fictif: false
  }
];

export const productsData = PRODUCTS;
export default PRODUCTS;
