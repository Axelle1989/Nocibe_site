// DONNÉES OFFICIELLES & POINTS DE VENTE NOCIBÉ BÉNIN
export interface Outlet {
  id: string;
  name: string;
  type: 'Dépôt d\'Usine Direct' | 'Magasin Central' | 'Distributeur Agréé';
  department: string;
  commune: string;
  address: string;
  phone: string;
  mapQuery: string;
  openingHours: string;
  stocks: string[];
  lat: number;
  lng: number;
}

export const OUTLETS: Outlet[] = [
  {
    id: 'depot-masse',
    name: 'Dépôt Central Usine de Massé',
    type: 'Dépôt d\'Usine Direct',
    department: 'Plateau',
    commune: 'Adja-Ouèrè / Massé',
    address: 'Zone Industrielle Cimentière de Massé',
    phone: '+229 01 47 81 67 78',
    mapQuery: 'Massé, Adja-Ouèrè, Bénin',
    openingHours: 'Lun - Sam : 06h00 - 20h00',
    stocks: ['CPJ 35', 'CPJ 45', 'CPA 55', 'Vrac Citerne'],
    lat: 7.0253,
    lng: 2.6686,
  },
  {
    id: 'depot-cotonou-port',
    name: 'Plateforme Logistique Portuaire & Siège',
    type: 'Magasin Central',
    department: 'Littoral',
    commune: 'Cotonou',
    address: 'Boulevard de la Marina, Face Direction du Port',
    phone: '+229 01 21 30 15 45',
    mapQuery: 'Boulevard de la Marina, Cotonou, Bénin',
    openingHours: 'Lun - Ven : 07h30 - 18h00 | Sam : 08h00 - 13h00',
    stocks: ['CPJ 35', 'CPJ 45', 'CPA 55'],
    lat: 6.3570,
    lng: 2.4280,
  },
  {
    id: 'depot-calavi',
    name: 'Dépôt Régional Abomey-Calavi',
    type: 'Distributeur Agréé',
    department: 'Atlantique',
    commune: 'Abomey-Calavi',
    address: 'Carrefour Kpota, Axe Principal Inter-États',
    phone: '+229 01 97 22 40 10',
    mapQuery: 'Carrefour Kpota, Abomey-Calavi, Bénin',
    openingHours: 'Lun - Sam : 07h30 - 18h30',
    stocks: ['CPJ 35', 'CPJ 45'],
    lat: 6.4485,
    lng: 2.3556,
  },
  {
    id: 'depot-porto-novo',
    name: 'Comptoir de Distribution Ouémé',
    type: 'Distributeur Agréé',
    department: 'Ouémé',
    commune: 'Porto-Novo',
    address: 'Quartier Ouando, Voie Principale du Marché',
    phone: '+229 01 95 14 33 20',
    mapQuery: 'Ouando, Porto-Novo, Bénin',
    openingHours: 'Lun - Sam : 07h30 - 18h00',
    stocks: ['CPJ 35', 'CPJ 45'],
    lat: 6.5050,
    lng: 2.6050,
  },
  {
    id: 'depot-boicon',
    name: 'Hub Logistique Carrefour Bohicon',
    type: 'Magasin Central',
    department: 'Zou',
    commune: 'Bohicon',
    address: 'Carrefour Zakpo, RNIE 2 vers Parakou',
    phone: '+229 01 96 48 55 12',
    mapQuery: 'Carrefour Zakpo, Bohicon, Bénin',
    openingHours: 'Lun - Sam : 07h00 - 19h00',
    stocks: ['CPJ 35', 'CPJ 45', 'CPA 55'],
    lat: 7.1783,
    lng: 2.0667,
  },
  {
    id: 'depot-parakou',
    name: 'Dépôt Grand Nord Parakou',
    type: 'Magasin Central',
    department: 'Borgou',
    commune: 'Parakou',
    address: 'Quartier Albarika, Route Inter-États Nord',
    phone: '+229 01 97 88 19 60',
    mapQuery: 'Albarika, Parakou, Bénin',
    openingHours: 'Lun - Sam : 07h30 - 18h00',
    stocks: ['CPJ 35', 'CPJ 45', 'CPA 55'],
    lat: 9.3372,
    lng: 2.6303,
  },
  {
    id: 'depot-lokossa',
    name: 'Comptoir Mono-Couffo',
    type: 'Distributeur Agréé',
    department: 'Mono',
    commune: 'Lokossa',
    address: 'Avenue Principale, Proche Carrefour Agatogbo',
    phone: '+229 01 94 30 77 05',
    mapQuery: 'Lokossa, Bénin',
    openingHours: 'Lun - Sam : 08h00 - 18h00',
    stocks: ['CPJ 35', 'CPJ 45'],
    lat: 6.6383,
    lng: 1.7167,
  },
  {
    id: 'depot-natitingou',
    name: 'Dépôt Relais Atacora-Donga',
    type: 'Distributeur Agréé',
    department: 'Atacora',
    commune: 'Natitingou',
    address: 'Sortie Sud vers Djougou, Quartier Santa',
    phone: '+229 01 96 11 82 44',
    mapQuery: 'Natitingou, Bénin',
    openingHours: 'Lun - Sam : 08h00 - 17h30',
    stocks: ['CPJ 35', 'CPJ 45'],
    lat: 10.3042,
    lng: 1.3796,
  },
];

export default OUTLETS;
