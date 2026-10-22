// DONNÉES FICTIVES : à remplacer
export interface ProcessStep {
  step: number;
  title: string;
  temperature?: string;
  duration?: string;
  description: string;
  details: string[];
  image: string;
  highlight: string;
}

export const MANUFACTURING_PROCESS: ProcessStep[] = [
  {
    step: 1,
    title: 'Extraction minière & Concassage',
    temperature: 'Ambiante',
    description: 'Extraction sélective du calcaire et des argiles dans la concession minière de Massé, suivie d\'un concassage primaire et secondaire.',
    details: [
      'Gisement calcaire haute pureté à teneur constante en carbonate (CaCO₃ > 82%)',
      'Concasseur à mâchoires et concasseur à percussion réduisant les blocs rocheux à moins de 25 mm',
      'Stockage sous hall couvert de pré-homogénéisation circulaire pour garantir un lit de mélange parfait',
    ],
    image: '/images/process/extraction-calcaire.webp',
    highlight: 'Contrôle granulométrique laser continu',
  },
  {
    step: 2,
    title: 'Broyage du cru & Homogénéisation',
    temperature: '80°C - 110°C',
    description: 'Le mélange calcaire-argile-minerai de fer est finement broyé pour donner la "farine crue", séchée par les gaz chauds récupérés du four.',
    details: [
      'Broyeur vertical à galets éco-énergétique de dernière génération',
      'Silos d\'homogénéisation pneumatique avec aération étagée à fond incliné',
      'Analyse chimique par spectrométrie à fluorescence X (XRF) toutes les 15 minutes',
    ],
    image: '/images/process/cuisson-clinker.webp',
    highlight: 'Finesse de farine inférieure à 12% de refus à 90µm',
  },
  {
    step: 3,
    title: 'Clinkérisation au Four Rotatif à 1 450 °C',
    temperature: '1 450 °C',
    duration: '25 à 30 min',
    description: 'Étape thermo-chimique décisive : décarbonatation dans la tour de préchauffage à 5 étages, puis fusion et nodulisation à 1 450 °C.',
    details: [
      'Tour de préchauffeur à cyclones à basse perte de charge avec brûleur précalcinateur bas-NOx',
      'Four tubulaire rotatif incliné de 65 mètres garni de briques réfractaires magnésiennes',
      'Refroidisseur à grille nouvelle génération provoquant une trempe thermique brutale pour figer les silicates d\'alite (C3S)',
    ],
    image: '/images/process/broyage-ciment.webp',
    highlight: 'Cœur thermique de l\'usine : 1 450 °C sous surveillance pyrométrique infra-rouge',
  },
  {
    step: 4,
    title: 'Broyage ciment & Ajouts minéraux certifiés',
    temperature: '95°C',
    description: 'Le clinker refroidi est intimement broyé avec une proportion exacte de gypse (régulateur de prise) et d\'ajouts pouzzolaniques rigoureusement dosés.',
    details: [
      'Broyeur à boulets bi-compartiments avec séparateur dynamique d\'air haute efficacité',
      'Ajustement continu de la surface spécifique Blaine (3 600 à 4 800 cm²/g selon le grade)',
      'Dosage gravimétrique asservi électroniquement pour respecter scrupuleusement la norme EN 197-1',
    ],
    image: '/images/process/controle-qualite.webp',
    highlight: 'Surface spécifique Blaine contrôlée au gramme près',
  },
  {
    step: 5,
    title: 'Ensachage automatisé & Expédition vrac',
    temperature: 'Ambiante',
    description: 'Conditionnement sous ensacheuses rotatives automatiques hermétiques ou chargement immédiat en citernes pulvérulentes.',
    details: [
      'Carrousels d\'ensachage 8 becs à pesée dynamique avec contrôle de rejet automatique si écart > 100g',
      'Sacs kraft 3 plis biodégradables micro-perforés résistants à la manutention tropicale',
      'Lignes de palettisation robotisées et gares de chargement vrac sur pont-bascule certifié',
    ],
    image: '/images/process/ensachage-expedition.webp',
    highlight: 'Cadence d\'expédition : jusqu\'à 5 000 tonnes / jour',
  },
];

export const DID_YOU_KNOW = {
  title: 'Le Saviez-vous ?',
  stat: '1 450 °C',
  fact: 'La température au cœur du four rotatif de Massé équivaut à un quart de la chaleur à la surface du Soleil.',
  description: 'À cette température extrême, les molécules de silice, de chaux, d\'alumine et de fer fusionnent pour former le clinker hydraulique, composé minéral qui confère au ciment NOCIBÉ sa résistance centenaire inégalée face aux intempéries.',
  ecoFact: 'Grâce à notre préchauffeur cyclonique à 5 étages, 85% de la chaleur résiduelle est récupérée pour préchauffer la matière crue et produire de l\'énergie en cycle fermé.',
};
