export interface DirectorMessageData {
  name: string;
  title: string;
  initials: string;
  image: string;
  catchphrase: string;
  paragraphs: string[];
  signatureTitle: string;
  date: string;
}

export const DIRECTOR_DATA: DirectorMessageData = {
  name: "Dr. Christian Houndégla",
  title: "Directeur Général de NOCIBÉ S.A.",
  initials: "CH",
  image: "",
  catchphrase: "Bâtir l'indépendance cimentière du Bénin avec l'excellence de notre calcaire et la force de nos talents.",
  paragraphs: [
    "Bienvenue sur la plateforme officielle de la Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.). Depuis notre usine intégrée de Massé, au cœur du département du Plateau, nous avons fait le choix stratégique de l'ancrage local et de l'excellence industrielle.",
    "L'accès à un ciment de haute performance, régulier et conforme aux normes les plus exigeantes (EN 197-1), constitue le socle indispensable de l'aménagement du territoire, du développement des infrastructures de transport et de la construction d'habitats durables pour nos concitoyens.",
    "Notre complexe industriel intègre les technologies les plus modernes de cuisson en four rotatif et d'ensachage automatisé, tout en maintenant un engagement constant en matière de responsabilité sociétale et environnementale. Chaque sac et chaque tonne de ciment qui franchissent nos ponts-bascules incarnent la rigueur de nos ingénieurs et la richesse de notre terroir minéral.",
    "À tous nos partenaires du BTP, promoteurs, distributeurs agréés et bâtisseurs individuels : NOCIBÉ est à vos côtés pour relever les défis architecturaux du Bénin et de l'espace UEMOA avec fiabilité, transparence et réactivité logistique.",
    "Ensemble, continuons à construire des ouvrages pérennes qui traverseront les générations."
  ],
  signatureTitle: "Le Directeur Général, NOCIBÉ S.A.",
  date: "Cotonou & Massé, République du Bénin",
};

