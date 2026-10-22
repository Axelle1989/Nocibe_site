export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  phoneMain: string;
  phoneCotonou: string;
  phoneFactory: string;
  phone: {
    display: string;
    international: string;
    raw: string;
  };
  phoneSecondary?: {
    display: string;
    international: string;
    raw: string;
  };
  email: string;
  headquarters: {
    name: string;
    address: string;
    city: string;
    mapQuery: string;
  };
  factory: {
    name: string;
    address: string;
    commune: string;
    department: string;
    mapQuery: string;
  };
  openingHours: {
    cotonou: string;
    factory: string;
    weekdays: string;
    saturday: string;
  };
  socialLinks: {
    facebook: string;
    linkedin: string;
    youtube?: string;
  };
  certifications: Array<{
    code: string;
    name: string;
    description: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "NOCIBÉ",
  tagline: "Nouvelle Cimenterie du Bénin",
  description: "Leader industriel de la production de ciment haute performance au Bénin et en Afrique de l'Ouest. Usine moderne intégrée de Massé.",
  url: "https://nocibe.bj",
  phoneMain: "+229 01 47 81 67 78",
  phoneCotonou: "+229 01 21 30 15 45",
  phoneFactory: "+229 01 47 81 67 78",
  phone: {
    display: "+229 01 47 81 67 78",
    international: "+2290147816778",
    raw: "0147816778",
  },
  phoneSecondary: {
    display: "+229 01 21 30 15 45",
    international: "+2290121301545",
    raw: "0121301545",
  },
  email: "contact@nocibe.bj",
  headquarters: {
    name: "Direction Commerciale & Siège Cotonou",
    address: "Boulevard de la Marina, Cotonou, République du Bénin",
    city: "Cotonou",
    mapQuery: "Boulevard+de+la+Marina+Cotonou+Benin",
  },
  factory: {
    name: "Usine Intégrée de Massé",
    address: "Zone Industrielle Cimentière, Massé, Commune d'Adja-Ouèrè",
    commune: "Adja-Ouèrè",
    department: "Plateau",
    mapQuery: "Masse+Adja-Ouere+Plateau+Benin",
  },
  openingHours: {
    cotonou: "Lun - Ven : 08h00 - 18h00 | Sam : 08h00 - 13h00",
    factory: "Production 24h/24 · Expéditions : 06h00 - 20h00",
    weekdays: "08h00 - 18h00",
    saturday: "08h00 - 13h00",
  },
  socialLinks: {
    facebook: "https://facebook.com/nbocibebenin",
    linkedin: "https://linkedin.com/company/nocibe-benin",
    youtube: "https://youtube.com/@nocibebenin",
  },
  certifications: [
    {
      code: "EN 197-1",
      name: "Norme Européenne & Béninoise Ciment",
      description: "Conformité stricte aux exigences mécaniques, physiques et chimiques des ciments courants.",
    },
    {
      code: "ISO 9001:2015",
      name: "Système de Management de la Qualité",
      description: "Contrôle qualité permanent de l'extraction de la roche à l'ensachage final.",
    },
    {
      code: "ISO 14001:2015",
      name: "Management Environnemental",
      description: "Filtres à manches haute efficacité et valorisation des ressources thermiques.",
    },
  ],
};

export const SITE_CONFIG = siteConfig;

export interface LocationInfo {
  id: 'cotonou' | 'masse';
  name: string;
  shortName: string;
  label: string;
  address: string;
  cityOrCommune: string;
  department: string;
  phone: string;
  email: string;
  openingHours: string;
  lat: number;
  lng: number;
  // À REMPLACER : lien Google Maps exact
  mapsUrl: string;
  // À REMPLACER : lien Google Maps exact
  embedUrl: string;
  // À REMPLACER : lien Google Maps exact
  directionsUrl: string;
  features: string[];
}

export const LOCATIONS: Record<'cotonou' | 'masse', LocationInfo> = {
  cotonou: {
    id: 'cotonou',
    name: 'Direction Commerciale & Siège Social Cotonou',
    shortName: 'Siège Cotonou',
    label: 'Siège Social Cotonou',
    address: 'Boulevard de la Marina, Cotonou, République du Bénin',
    cityOrCommune: 'Cotonou',
    department: 'Littoral',
    phone: '+229 01 21 30 15 45',
    email: 'contact@nocibe.bj',
    openingHours: 'Lun - Ven : 08h00 - 18h00 | Sam : 08h00 - 13h00',
    lat: 6.3571,
    lng: 2.4326,
    // À REMPLACER : lien Google Maps exact
    mapsUrl: 'https://maps.google.com/?q=6.3571,2.4326',
    // À REMPLACER : lien Google Maps exact
    embedUrl: 'https://maps.google.com/maps?q=6.3571,2.4326&hl=fr&z=15&output=embed',
    // À REMPLACER : lien Google Maps exact
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=6.3571,2.4326',
    features: [
      'Accueil commercial & contrats grands comptes',
      'Facturation B2B & réceptions d\'échantillons',
      'Direction générale & services administratifs'
    ]
  },
  masse: {
    id: 'masse',
    name: 'Complexe Industriel Intégré de Massé',
    shortName: 'Usine de Massé',
    label: 'Usine de Massé (Plateau)',
    address: 'Zone Industrielle Cimentière, Massé, Commune d\'Adja-Ouèrè, Département du Plateau, Bénin',
    cityOrCommune: 'Adja-Ouèrè',
    department: 'Plateau',
    phone: '+229 01 47 81 67 78',
    email: 'usine.masse@nocibe.bj',
    openingHours: 'Production 24h/24 · Expéditions & Pesage : 06h00 - 20h00',
    lat: 7.0253,
    lng: 2.6687,
    // À REMPLACER : lien Google Maps exact
    mapsUrl: 'https://maps.google.com/?q=7.0253,2.6687',
    // À REMPLACER : lien Google Maps exact
    embedUrl: 'https://maps.google.com/maps?q=7.0253,2.6687&hl=fr&z=14&output=embed',
    // À REMPLACER : lien Google Maps exact
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=7.0253,2.6687',
    features: [
      'Capacité 1,5 MT de clinker & ciments EN 197-1',
      'Ponts-bascules automatisés pour camions 30T+',
      'Laboratoire central d\'essais béton robotisé'
    ]
  }
};

export default siteConfig;

