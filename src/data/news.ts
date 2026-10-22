// ACTUALITÉS OFFICIELLES & COMMUNIQUÉS NOCIBÉ
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Usine' | 'RSE' | 'Chantiers' | 'Événements';
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  sections?: { id: string; title: string; content: string }[];
  isFeatured?: boolean;
  author: string;
}

export const newsData: NewsArticle[] = [
  {
    id: "mise-en-service-broyeur-2026",
    slug: "mise-en-service-nouvelle-unite-broyage-masse",
    title: "Mise en service de la nouvelle unité de broyage à l'usine intégrée de Massé",
    category: "Usine",
    date: "15 mars 2026",
    readTime: "4 min de lecture",
    image: "/images/vue-aerienne-usine-hd.jpg",
    isFeatured: true,
    author: "Direction Technique NOCIBÉ",
    excerpt: "Pour accompagner l'accélération des grands chantiers d'infrastructure au Bénin, la NOCIBÉ augmente sa capacité de production de 600 000 tonnes supplémentaires par an.",
    content: [
      "La Nouvelle Cimenterie du Bénin (NOCIBÉ) franchit une étape stratégique majeure avec la mise en service officielle de son unité de broyage vertical de dernière génération sur le complexe industriel de Massé, dans le département du Plateau.",
      "Cet investissement industriel structurant permet de porter la capacité annuelle globale du site à plus de 2,1 millions de tonnes de ciment de haute qualité. Équipé d'entraînements à vitesse variable et de séparateurs dynamiques de haute précision, ce nouveau broyeur réduit la consommation spécifique d'électricité de 18 % par rapport aux broyeurs à boulets classiques.",
      "« Cette extension industrielle répond directement à la forte dynamique de construction engagée dans les 77 communes du Bénin, qu'il s'agisse des projets d'asphaltage urbain, de la zone industrielle de Glo-Djigbé ou des logements sociaux », a déclaré la Direction Générale lors de la cérémonie d'inauguration.",
      "L'unité s'accompagne également de deux nouveaux silos de stockage de 5 000 tonnes chacun et d'une ligne d'ensachage automatisée capable de charger simultanément 6 camions gros porteurs en moins de 25 minutes, fluidifiant ainsi considérablement les rotations logistiques."
    ],
    sections: [
      { id: 'contexte-industriel', title: '1. Un bond capacitaire pour le Bénin', content: 'Le nouveau broyeur vertical porte la production à 2,1 millions de tonnes par an, garantissant la fin définitive des tensions d\'approvisionnement nationales.' },
      { id: 'technologie-rendement', title: '2. Efficacité énergétique et réduction carbone', content: 'Doté de séparateurs dynamiques de 4e génération, ce broyeur consomme 18% d\'électricité en moins et produit des farines de clinker à la granulométrie parfaitement homogène.' },
      { id: 'logistique-silos', title: '3. Logistique fluide et chargement rapide', content: 'Deux silos tampon de 5 000 tonnes et des rampes télescopiques automatisées réduisent le temps de chargement d\'un camion de 40 tonnes à moins de 15 minutes.' },
    ],
  },
  {
    id: "renouvellement-iso-14001",
    slug: "renouvellement-certification-iso-14001-environnement",
    title: "NOCIBÉ renouvelle avec succès sa double certification ISO 9001 et ISO 14001",
    category: "RSE",
    date: "10 mars 2026",
    readTime: "3 min de lecture",
    image: "/images/produits/cpj-35-sac-ouvert-truelle.webp",
    isFeatured: false,
    author: "Département QHSE",
    excerpt: "L'organisme certificateur Bureau Veritas a validé la conformité stricte de l'ensemble de nos processus d'extraction, de cuisson et de distribution aux normes environnementales.",
    content: [
      "À l'issue d'un audit approfondi de cinq jours mené sur l'ensemble de nos sites d'exploitation, la NOCIBÉ a obtenu le renouvellement sans réserve de ses certifications ISO 9001 (Management de la Qualité) et ISO 14001 (Management Environnemental).",
      "Ce renouvellement consacre les efforts continus déployés par nos équipes pour limiter l'empreinte environnementale de l'industrie cimentière au Bénin. Notre dispositif de filtration par manches filtrantes haute performance garantit des rejets de poussières inférieurs à 10 mg/Nm³, soit un niveau deux fois plus exigeant que les seuils réglementaires internationaux.",
      "Par ailleurs, notre plan de réhabilitation progressive des carrières d'argile et de calcaire a permis de reboiser plus de 65 hectares d'espèces locales avec les populations riveraines d'Adja-Ouèrè."
    ],
    sections: [
      { id: 'audit-bureau-veritas', title: '1. Un audit d\'accréditation sans réserve', content: 'Plus de 120 points de contrôle ont été validés par les auditeurs indépendants sur la carrière, le four et les laboratoires de métrologie.' },
      { id: 'filtration-rejets', title: '2. Filtres à manches et rejets < 10 mg/Nm³', content: 'Les technologies de captation garantissent une atmosphère saine autour du complexe de Massé et protègent les cours d\'eau environnants.' },
    ],
  },
  {
    id: "fourniture-port-cotonou",
    slug: "livraison-record-extension-port-autonome-cotonou",
    title: "Livraison record de ciment CPA 55 pour le nouveau terminal du Port de Cotonou",
    category: "Chantiers",
    date: "12 février 2026",
    readTime: "4 min de lecture",
    image: "/images/camion-livraison-hd.jpg",
    isFeatured: false,
    author: "Pôle Grands Comptes BTP",
    excerpt: "Plus de 45 000 tonnes de ciment de haute résistance marine ont été acheminées sans rupture de flux pour couler les nouveaux quais de déchargement en eau profonde.",
    content: [
      "Dans le cadre des travaux de modernisation et d'extension du Port Autonome de Cotonou, la NOCIBÉ a assuré avec succès la fourniture continue de ciment Portland pur CPA 55 destiné aux bétons maritimes en immersion.",
      "Soumises aux assauts constants de l'eau de mer et des embruns salins, ces infrastructures portuaires exigent un béton d'une compacité extrême, formulé avec un clinker contrôlé à faible teneur en aluminates tricalciques (C3A).",
      "Une flotte dédiée de camions citernes a assuré des livraisons en flux tendu 24h/24 directement aux centrales à béton installées sur le port, démontrant l'agilité logistique de notre organisation industrielle."
    ],
    sections: [
      { id: 'enjeu-portuaire', title: '1. Des quais maritimes conçus pour 100 ans', content: 'Le ciment CPA 55 de la NOCIBÉ garantit une résistance à l\'agression saline et chlorurée indispensable en milieu océanique tropical.' },
      { id: 'rotations-vrac', title: '2. Chaîne logistique continue 24/7', content: 'Des rotations ininterrompues de camions-citernes ont permis de couler les massifs en béton armé sans aucun joint froid structurel.' },
    ],
  },
  {
    id: "partenariat-artisans-macons-benin",
    slug: "programme-national-formation-artisans-macons",
    title: "Lancement du programme national de formation pour 1 200 artisans maçons",
    category: "Événements",
    date: "28 janvier 2026",
    readTime: "3 min de lecture",
    image: "/images/batiment-siege-hd.jpg",
    isFeatured: false,
    author: "Direction des Relations Professionnelles",
    excerpt: "En partenariat avec la Fédération Nationale des Artisans du Bâtiment, la NOCIBÉ lance une tournée technique dans les 12 départements pour optimiser le dosage et la résistance des bétons.",
    content: [
      "Parce que la solidité d'un bâtiment dépend autant de la qualité du ciment que de sa mise en œuvre sur le terrain, la NOCIBÉ initie un vaste programme de formation pratique gratuit destiné aux professionnels du BTP béninois.",
      "Animés par nos ingénieurs du laboratoire d'essais de Massé, ces ateliers abordent les règles de l'art : calcul exact du rapport eau/ciment, choix des granulats propres, vibration correcte du béton armé et protection contre la dessiccation par temps chaud.",
      "Chaque artisan participant reçoit un guide mémento de chantier en français et langues locales (Fon, Yoruba), ainsi qu'un certificat d'aptitude aux bétons durables."
    ],
    sections: [
      { id: 'tournee-departements', title: '1. 12 départements sillonnés', content: 'Des ateliers pratiques réunissant des maîtres-maçons et apprentis pour perfectionner le gâchage, la cure et le coffrage des mortiers.' },
      { id: 'guide-technique', title: '2. Un mémento de poche bilingue offert', content: 'Un support technique résumant les dosages recommandés par type d\'ouvrage pour éviter les pathologies courantes de fissuration.' },
    ],
  },
  {
    id: "campagne-reboisement-2026",
    slug: "campagne-reboisement-masse-25000-arbres",
    title: "Campagne 2026 de reboisement : 25 000 jeunes arbres plantés sur le Plateau",
    category: "RSE",
    date: "14 janvier 2026",
    readTime: "3 min de lecture",
    image: "/images/produits/cpj-35-palette-chantier.webp",
    isFeatured: false,
    author: "Service Environnement & Foresterie",
    excerpt: "Les élèves des écoles primaires de Massé et les agents de la NOCIBÉ ont uni leurs forces pour restaurer la biodiversité forestière d'Adja-Ouèrè.",
    content: [
      "Dans le cadre de son plan décennal de développement durable, la NOCIBÉ a orchestré une grande journée citoyenne de reboisement mobilisant plus de 300 collaborateurs et habitants des villages voisins.",
      "Les espèces plantées (tecks, anacardiers greffés, acacias) proviennent directement de la pépinière forestière de l'usine et sont adaptées aux conditions pédologiques de la région.",
      "Cette initiative porte à 65 hectares la superficie totale déjà revégétalisée sur les anciennes zones d'extraction d'argile."
    ],
    sections: [
      { id: 'pepiniere-locale', title: '1. Des plants indigènes issus de notre pépinière', content: 'Sélection rigoureuse des espèces pour restaurer durablement la fertilité des sols et créer des brise-vents naturels.' },
      { id: 'partenariat-scolaire', title: '2. Sensibilisation des jeunes générations', content: 'Chaque enfant participant parraine un arbre et suit sa croissance au fil des années scolaires.' },
    ],
  },
  {
    id: "portes-ouvertes-etudiants-uac",
    slug: "journee-portes-ouvertes-etudiants-polytechnique-abomey-calavi",
    title: "Immersion industrielle : 80 élèves ingénieurs de l'EPAC accueillis à Massé",
    category: "Événements",
    date: "18 décembre 2025",
    readTime: "4 min de lecture",
    image: "/images/vue-aerienne-usine-hd.jpg",
    isFeatured: false,
    author: "Pôle Ressources Humaines & Talents",
    excerpt: "Les futurs diplômés en génie civil et génie mécanique de l'Université d'Abomey-Calavi ont découvert les technologies de cuisson à 1450°C et le laboratoire robotisé.",
    content: [
      "Pépinière de l'excellence technique béninoise, la NOCIBÉ a ouvert les portes de son usine intégrée de Massé à une délégation d'étudiants de l'École Polytechnique d'Abomey-Calavi (EPAC).",
      "Guidés par nos ingénieurs de quart, les étudiants ont pu appréhender en conditions réelles les étapes de la clinkérisation au four rotatif, le contrôle automatisé par fluorescence X et les presses hydrauliques de résistance.",
      "Plusieurs propositions de stages de fin d'études et d'embauches de jeunes ingénieurs ont été formulées à l'issue de cette journée d'échanges."
    ],
    sections: [
      { id: 'parcours-visite', title: '1. Du concasseur au laboratoire de compression', content: 'Une visite immersive de plus de 4 heures commentée par nos chefs de départements extraction, broyage et expédition.' },
      { id: 'recrutement-talents', title: '2. Accompagner la relève industrielle béninoise', content: 'NOCIBÉ confirme son engagement d\'intégrer chaque année les meilleurs majors de promotion dans ses équipes de cadres dirigeants.' },
    ],
  },
];

export const NEWS_ARTICLES: NewsArticle[] = newsData;
export default NEWS_ARTICLES;
