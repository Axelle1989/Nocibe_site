// DONNÉES FICTIVES : à remplacer
export interface FAQItem {
  id: string;
  category: 'Technique & Dosages' | 'Commande & B2B' | 'Normes & Qualité' | 'Livraison & Logistique';
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    id: 'dosage-dalle-fondation',
    category: 'Technique & Dosages',
    question: 'Quel type de ciment choisir pour une dalle ou des fondations au Bénin ?',
    answer: 'Pour les fondations et les dalles de maisons individuelles ou d\'immeubles R+1/R+2, nous recommandons le ciment NOCIBÉ CPJ 45 dosé à 350 kg/m³ (soit 7 sacs par mètre cube de béton). Il garantit une résistance rapide au décoffrage et une excellente tenue à l\'humidité résiduelle du sol tropical.'
  },
  {
    id: 'difference-cpj35-cpj45-cpa55',
    category: 'Technique & Dosages',
    question: 'Quelle est la différence concrète entre CPJ 35, CPJ 45 et CPA 55 ?',
    answer: 'La valeur numérique indique la résistance minimale à la compression à 28 jours en Mégapascals (MPa). Le CPJ 35 (≥32,5 MPa) est le ciment polyvalent par excellence (maçonnerie, enduits, chape). Le CPJ 45 (≥42,5 MPa) est destiné aux structures porteuses en béton armé (poteaux, poutres, dalles). Le CPA 55 (≥52,5 MPa) est un ciment pur haute performance réservé au génie civil, bétons précontraints et environnements agressifs.'
  },
  {
    id: 'delai-decoffrage',
    category: 'Technique & Dosages',
    question: 'Quel est le temps optimal de cure et de décoffrage du béton ?',
    answer: 'Avec le ciment NOCIBÉ CPJ 45, les coffrages verticaux (poteaux, voiles) peuvent être retirés dès 48 à 72 heures sous climat chaud et humide. Pour les dalles et poutres porteuses, maintenez les étais pendant au moins 21 à 28 jours en veillant à arroser le béton quotidiennement (cure) les 7 premiers jours afin d\'éviter le faïençage.'
  },
  {
    id: 'norme-en-197-1',
    category: 'Normes & Qualité',
    question: 'Que garantit la certification européenne EN 197-1 sur les ciments NOCIBÉ ?',
    answer: 'La norme harmonisée EN 197-1 impose des contrôles stricts en continu sur la composition chimique, la finesse de mouture Blaine, les temps de prise et la résistance mécanique à 2, 7 et 28 jours. Tous les lots NOCIBÉ font l\'objet d\'un prélèvement horaire certifié par notre laboratoire robotisé et audité par des bureaux de contrôle indépendants (Bureau Veritas).'
  },
  {
    id: 'commande-minimale-b2b',
    category: 'Commande & B2B',
    question: 'Quel est le volume minimal pour une commande directe usine en B2B ?',
    answer: 'Les expéditions directes depuis l\'usine de Massé se font à partir de 30 tonnes (soit un chargement complet de camion semi-remorque de 600 sacs de 50 kg ou en vrac par camion-citerne). Pour les besoins inférieurs, nous vous orientons vers notre réseau de distributeurs agréés présents dans chaque commune.'
  },
  {
    id: 'livraison-delais',
    category: 'Livraison & Logistique',
    question: 'Quels sont les délais de livraison sur le territoire béninois ?',
    answer: 'Pour les commandes fermes validées avant 12h00, la mise à disposition ou livraison sur chantier s\'effectue sous 24 à 48 heures dans les départements du Plateau, Ouémé, Littoral et Atlantique. Pour le Centre et le Septentrion (Zou, Collines, Borgou, Alibori, Donga, Atacora), comptez 48 à 72 heures.'
  },
  {
    id: 'vrac-ou-sacs',
    category: 'Commande & B2B',
    question: 'Proposez-vous le ciment en vrac pour centrales à béton et préfabricateurs ?',
    answer: 'Oui, NOCIBÉ dispose d\'une flotte dédiée de camions-citernes pulvérulents étanches de 35 tonnes pour approvisionner directement vos silos de stockage sur chantier ou usine de préfabrication de parpaings.'
  }
];

