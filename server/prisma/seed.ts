import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initialisation (Seed) de la base de données PostgreSQL NOCIBÉ...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@nocibe.bj';
  const adminPasswordPlain = process.env.SEED_ADMIN_PASSWORD || 'Nocibe2026!AdminSecurise#BJ';
  const clientEmail = process.env.SEED_DEMO_EMAIL || 'client@entreprise.bj';
  const clientPasswordPlain = process.env.SEED_DEMO_PASSWORD || 'Nocibe2026!ClientSecurise#BJ';

  // Coût bcrypt 12 pour conformité renforcée
  const adminPasswordHash = await bcrypt.hash(adminPasswordPlain, 12);
  const clientPasswordHash = await bcrypt.hash(clientPasswordPlain, 12);

  // 1. Compte Administrateur
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
      emailVerifie: true,
    },
    create: {
      email: adminEmail,
      password: adminPasswordHash,
      nom: 'Direction Générale',
      prenom: 'Admin NOCIBÉ',
      telephone: '+229 01 47 81 67 78',
      entreprise: 'NOCIBÉ S.A.',
      role: Role.ADMIN,
      isActive: true,
      emailVerifie: true,
    },
  });
  console.log('✅ Compte Administrateur initialisé :', admin.email);

  // 2. Compte Client Démo
  const client = await prisma.user.upsert({
    where: { email: clientEmail },
    update: {
      password: clientPasswordHash,
      role: Role.CLIENT,
      isActive: true,
      emailVerifie: true,
    },
    create: {
      email: clientEmail,
      password: clientPasswordHash,
      nom: 'Bio',
      prenom: 'Armel',
      telephone: '+229 97 00 11 22',
      entreprise: 'BTP Bénin Constructions',
      role: Role.CLIENT,
      isActive: true,
      emailVerifie: true,
    },
  });
  console.log('✅ Compte Client Démo initialisé :', client.email);

  // 3. Catalogue des Ciments Certifiés EN 197-1
  const products = [
    {
      slug: 'ciment-nocibe-cpj-35',
      name: 'Ciment NOCIBÉ CPJ 35',
      shortGrade: 'CPJ 35',
      classe: '32.5 R',
      designation: 'CEM II/B-LL 32.5 R',
      isFeatured: false,
      isRecommended: false,
      nouveau: false,
      badge: 'Polyvalent & Économique',
      targetUse: 'Maçonnerie courante, crépissages, enduits de façades, dallages piétons et bétons non armés.',
      description: 'Ciment de classe courante alliant maniabilité remarquable et durabilité. Idéal pour les chantiers résidentiels individuels et travaux de second œuvre.',
      resistance2d: '≥ 15 MPa',
      resistance28d: '≥ 32,5 MPa',
      packaging: 'Sac de 50 kg plastifié (Palette de 40 sacs = 2T)',
      unit: 'sacs',
      unitPrice: 4200,
      priceDisplay: '4 200 FCFA / sac 50kg',
      standard: 'EN 197-1 (CEM II/B-LL 32.5 R)',
      image: '/images/produits/cpj-35-palette-fond-blanc.webp',
      pdfName: 'Fiche_Technique_NOCIBE_CPJ35.pdf',
      pdfUrl: '/docs/fiche-technique-cpj35.pdf',
      order: 1,
    },
    {
      slug: 'ciment-nocibe-cpj-45',
      name: 'Ciment NOCIBÉ CPJ 45',
      shortGrade: 'CPJ 45',
      classe: '42.5 R',
      designation: 'CEM II/A-L 42.5 R',
      isFeatured: true,
      isRecommended: true,
      nouveau: false,
      badge: 'Recommandé Gros Œuvre',
      targetUse: 'Béton armé fortement sollicité, poteaux, poutres, dalles de compression, fondations profondes.',
      description: 'Le ciment de référence pour les entreprises de construction et les majors du BTP au Bénin. Formulé à base de calcaire pur extrait de la carrière de Massé.',
      resistance2d: '≥ 20 MPa',
      resistance28d: '≥ 42,5 MPa',
      packaging: 'Sac de 50 kg haute résistance (Palette 40 sacs)',
      unit: 'sacs',
      unitPrice: 4600,
      priceDisplay: '4 600 FCFA / sac 50kg',
      standard: 'EN 197-1 (CEM II/A-L 42.5 R)',
      image: '/images/produits/cpj-35-sac-seul-chantier.webp',
      pdfName: 'Fiche_Technique_NOCIBE_CPJ45.pdf',
      pdfUrl: '/docs/fiche-technique-cpj45.pdf',
      order: 2,
    },
    {
      slug: 'ciment-nocibe-cpa-55',
      name: 'Ciment NOCIBÉ CPA 55',
      shortGrade: 'CPA 55',
      classe: '52.5 R',
      designation: 'CEM I 52.5 R',
      isFeatured: false,
      isRecommended: false,
      nouveau: false,
      badge: 'Haute Performance',
      targetUse: 'Ouvrages d\'art, ponts fluviaux, quais portuaires et béton précontraint.',
      description: 'Ciment Portland pur à très haute teneur en clinker (>95%). Spécifiquement élaboré pour les travaux maritimes sévères et les bétons à hautes performances.',
      resistance2d: '≥ 30 MPa',
      resistance28d: '≥ 52,5 MPa',
      packaging: 'Vrac pulvérulent citerne & Sacs 50 kg',
      unit: 'sacs',
      unitPrice: 4900,
      priceDisplay: '4 900 FCFA / sac 50kg',
      standard: 'EN 197-1 (CEM I 52.5 R)',
      image: '/images/produits/cpj-35-sac-4-vues.webp',
      pdfName: 'Fiche_Technique_NOCIBE_CPA55.pdf',
      pdfUrl: '/docs/fiche-technique-cpa55.pdf',
      order: 3,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ ${products.length} produits du catalogue insérés.`);

  // 4. Offres d'Emploi & Stages (Carrières)
  const jobOffers = [
    {
      slug: 'ingenieur-procedes-cimenterie',
      titre: 'Ingénieur Procédés Cimenterie (Ligne de Cuisson & Broyage)',
      type: 'EMPLOI_CDI' as const,
      secteur: 'Production & carrière',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Supervision technique de la ligne intégrée de clinkerisation et broyage de ciment à l’usine de Massé. Optimisation des bilans thermiques et massiques.',
      missions: 'Piloter les paramètres de fonctionnement du four rotatif et des broyeurs à boulets. Analyser les bilans thermiques et les consommations d’énergie. Coordonner les arrêts planifiés.',
      profil: 'Diplôme d’Ingénieur Génie Chimique, Matériaux ou Procédés (Bac+5). Minimum 3 ans d’expérience en industrie cimentière ou minérale lourde.',
      competences: ['Cuisson clinker', 'Broyage ciment', 'Bilan thermique', 'Régulation industrielle'],
      duree: 'CDI',
    },
    {
      slug: 'technicien-superieur-laboratoire-qualite',
      titre: 'Technicien Supérieur Contrôle Qualité & Laboratoire Béton',
      type: 'EMPLOI_CDI' as const,
      secteur: 'Laboratoire & contrôle qualité',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Réalisation des essais physiques, chimiques et mécaniques normalisés EN 197-1 sur les matières premières, clinker et ciments finis.',
      missions: 'Prélèvement et préparation des échantillons en continu. Essais d’écrasement à 2, 7 et 28 jours. Fluorescence X et titrimétrie. Établissement des certificats d’analyse.',
      profil: 'BTS/DUT ou Licence en Chimie industrielle, Génie civil ou Matériaux. Rigueur et sens aigu de la conformité normative.',
      competences: ['Norme EN 197-1', 'Spectrométrie FX', 'Presse d’écrasement', 'Essais Blaine'],
      duree: 'CDI',
    },
    {
      slug: 'chef-equipe-maintenance-mecanique',
      titre: 'Chef d’Équipe Maintenance Mécanique Fours & Broyeurs',
      type: 'EMPLOI_CDI' as const,
      secteur: 'Maintenance mécanique',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Encadrement des techniciens de maintenance préventive et corrective sur les équipements lourds du complexe industriel.',
      missions: 'Gestion des interventions sur réducteurs, bandes transporteuses, concasseurs et séparateurs dynamiques. Diagnostic vibratoire et graissage centralisé.',
      profil: 'Licence ou BTS Maintenance Industrielle / Génie Mécanique avec au moins 5 ans d’expérience sur site cimentier.',
      competences: ['Alignement laser', 'Analyse vibratoire', 'Soudure industrielle', 'GMAO'],
      duree: 'CDI',
    },
    {
      slug: 'responsable-qhse-environnement',
      titre: 'Responsable Hygiène, Sécurité & Environnement (QHSE)',
      type: 'EMPLOI_CDI' as const,
      secteur: 'QHSE & environnement',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Pilotage de la politique Zéro Accident et gestion des impacts environnementaux de l’usine et de la carrière de calcaire.',
      missions: 'Animation des quarts d’heure sécurité et audits de terrain. Suivi des émissions atmosphériques (filtres à manches). Gestion des permis de travail et EPI.',
      profil: 'Master QHSE avec expérience confirmée en milieu industriel classé ICPE au Bénin ou en Afrique de l’Ouest.',
      competences: ['ISO 45001', 'ISO 14001', 'Analyse des risques', 'Gestion des rejets'],
      duree: 'CDI',
    },
    {
      slug: 'responsable-logistique-flotte',
      titre: 'Responsable Logistique & Flotte Grands Porteurs',
      type: 'EMPLOI_CDI' as const,
      secteur: 'Logistique & transport',
      lieu: 'Cotonou / Massé',
      description: 'Coordination des expéditions de ciment vrac (citernes) et sacs sur l’ensemble du territoire béninois et corridors UEMOA.',
      missions: 'Affectation des camions aux ponts-bascules. Suivi géolocalisé des convois. Optimisation des délais de rotation et relation avec les transporteurs partenaires.',
      profil: 'Bac+4/5 en Logistique et Transport. Excellente maîtrise des flux de fret lourd et gestion des bordereaux de livraison.',
      competences: ['Gestion de flotte', 'Bordereaux d’expédition', 'Régulation trafic', 'ERP'],
      duree: 'CDI',
    },
    {
      slug: 'stage-professionnel-optimisation-energetique',
      titre: 'Stage Professionnel : Optimisation Énergétique Broyeur à Ciment',
      type: 'STAGE_PROFESSIONNEL' as const,
      secteur: 'Production & carrière',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Mission d’ingénierie appliquée : audit énergétique des ateliers de broyage et proposition de leviers de réduction de kWh/tonne.',
      missions: 'Mesures des consommations électriques spécifiques. Évaluation du profil granulométrique. Rédaction d’un plan d’action d’efficacité énergétique.',
      profil: 'Jeune diplômé(e) Ingénieur Électromécanique, Énergétique ou Procédés (Bac+5). Convention de stage requise.',
      competences: ['Audit énergétique', 'Modélisation de flux', 'Rapport technique'],
      duree: '6 mois',
    },
    {
      slug: 'stage-academique-chimie-clinker',
      titre: 'Stage Académique : Analyse Chimique Clinker & Pouzzolanes',
      type: 'STAGE_ACADEMIQUE' as const,
      secteur: 'Laboratoire & contrôle qualité',
      lieu: 'Massé (Adja-Ouèrè)',
      description: 'Stage de fin d’études portant sur la réactivité hydraulique des ajouts minéraux calcaires extraits de la carrière de Massé.',
      missions: 'Analyses diffractométriques et titrage de la chaux libre. Suivi du temps de prise et de l’expansion Le Chatelier.',
      profil: 'Étudiant(e) en Master 2 ou Licence 3 Chimie appliquée, Matériaux ou Génie des procédés. Rapport de stage soutenable.',
      competences: ['Essais laboratoire', 'Chimie des silicates', 'Norme EN 196'],
      duree: '3 à 4 mois',
    },
  ];

  for (const job of jobOffers) {
    await prisma.jobOffer.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    });
  }
  console.log(`✅ ${jobOffers.length} offres d'emploi et stages insérés.`);

  // 5. Communiqués Officiels
  const communiques = [
    {
      slug: 'renouvellement-certification-en-197-1',
      titre: 'Renouvellement de la Certification Normative EN 197-1 pour la Gamme NOCIBÉ',
      categorie: 'Direction Générale',
      date: new Date('2026-03-15'),
      resume: 'L’ensemble des ciments produits à l’usine intégrée de Massé (CPJ 35, CPJ 45 et CPA 55) confirme sa conformité aux exigences européennes et béninoises.',
      contenu: 'La Direction Générale de la Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.) a l’honneur d’informer ses partenaires du BTP, distributeurs agréés et prescripteurs du renouvellement sans réserve de la certification de conformité EN 197-1 pour l’ensemble de sa gamme de ciments.\n\nCe résultat couronne les investissements continus consentis au laboratoire central robotisé de Massé et garantit des résistances mécaniques régulières et supérieures aux seuils minimaux normatifs.',
      pdfName: 'Communique_NOCIBE_Certification_EN197-1.pdf',
      pdfUrl: '/docs/communique-certification.pdf',
    },
    {
      slug: 'inauguration-ligne-ensachage-grande-vitesse',
      titre: 'Mise en Service de la Nouvelle Ligne d’Ensachage Rotative Haute Cadence',
      categorie: 'Industrie & Usine',
      date: new Date('2026-02-10'),
      resume: 'Un bond de productivité permettant de charger jusqu’à 4 800 sacs par heure et de réduire considérablement l’attente des camions transporteurs.',
      contenu: 'Dans le cadre de son plan d’excellence opérationnelle 2026, NOCIBÉ S.A. annonce la mise en exploitation industrielle de sa nouvelle ensacheuse rotative de dernière génération sur le complexe cimentier de Massé.\n\nCette installation permet d’atteindre une cadence de chargement de 4 800 sacs de 50 kg par heure avec système d’étanchéité anti-poussière renforcé, fluidifiant ainsi le transit des transporteurs.',
      pdfName: 'Communique_Ligne_Ensachage_2026.pdf',
      pdfUrl: '/docs/communique-ensachage.pdf',
    },
    {
      slug: 'rapport-rse-2025-decarbonation',
      titre: 'Rapport RSE 2025 : Baisse de 18% des Émissions Spécifiques de CO2 par Tonne',
      categorie: 'Développement Durable',
      date: new Date('2026-01-20'),
      resume: 'Valorisation des biomasses locales et optimisation de l’efficacité thermique des fours rotatifs de Massé.',
      contenu: 'NOCIBÉ S.A. publie son bilan annuel de responsabilité sociétale et environnementale. Grâce à la substitution partielle des combustibles fossiles par des sous-produits agricoles locaux (coques de coton et palmier) et à des filtres à manches de très haute performance (émissions < 10 mg/Nm³), l’empreinte carbone par tonne de ciment liant diminue de 18% par rapport à l’exercice précédent.',
      pdfName: 'Rapport_RSE_NOCIBE_2025.pdf',
      pdfUrl: '/docs/rapport-rse-2025.pdf',
    },
    {
      slug: 'approvisionnement-prioritaire-grands-chantiers',
      titre: 'NOCIBÉ Fournisseur de Référence des Grands Projets d’Infrastructures du Bénin',
      categorie: 'Partenariats BTP',
      date: new Date('2025-11-28'),
      resume: 'Sécurisation de l’approvisionnement des ouvrages d’art nationaux, voiries bitumées et aménagements portuaires.',
      contenu: 'Pour soutenir l’élan national de modernisation des infrastructures routières et portuaires en République du Bénin, NOCIBÉ a conclu des protocoles d’approvisionnement direct avec les majors du génie civil. Nos équipes logistiques assurent des livraisons en vrac 24h/24 directement sur les centrales à béton des chantiers.',
      pdfName: 'Protocole_BTP_Infrastructures.pdf',
      pdfUrl: '/docs/protocole-btp.pdf',
    },
  ];

  for (const c of communiques) {
    await prisma.communique.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`✅ ${communiques.length} communiqués officiels insérés.`);

  // 6. Événements Industriels & Institutionnels
  const events = [
    {
      slug: 'salon-btp-infrastructures-cotonou-2026',
      titre: 'Salon International du BTP et des Équipements de Cotonou',
      type: 'Salon Professionnel',
      dateDebut: new Date('2026-11-12T09:00:00Z'),
      dateFin: new Date('2026-11-15T18:00:00Z'),
      lieu: 'Palais des Congrès de Cotonou',
      ville: 'Cotonou',
      lat: 6.3541,
      lng: 2.4042,
      resume: 'Rencontrez les ingénieurs NOCIBÉ au stand officiel A12 pour découvrir nos ciments haute résistance et solutions bétons pour climats tropicaux.',
      description: 'Le grand rendez-vous des bâtisseurs, architectes, entreprises de construction et maîtres d’ouvrage. NOCIBÉ y animera une table ronde sur la normalisation des ciments au Bénin.',
      image: '/images/actualites/usine-four-clinker.jpg',
    },
    {
      slug: 'journee-portes-ouvertes-usine-masse',
      titre: 'Journée Portes Ouvertes & Visite Technique du Complexe de Massé',
      type: 'Visite Technique',
      dateDebut: new Date('2026-12-05T08:30:00Z'),
      dateFin: new Date('2026-12-05T16:00:00Z'),
      lieu: 'Complexe Cimentier Intégré de Massé, Commune d’Adja-Ouèrè',
      ville: 'Massé',
      lat: 7.0253,
      lng: 2.6687,
      resume: 'Visite guidée exclusive des installations : carrière de calcaire, salle de commande centralisée robotisée, four rotatif et laboratoire.',
      description: 'Ouvert aux écoles d’ingénieurs, universitaires et partenaires B2B sur inscription préalable. Découvrez les coulisses de la production cimentière béninoise.',
      image: '/images/actualites/chantier-infrastructure-cotonou.jpg',
    },
    {
      slug: 'colloque-betons-durables-afrique-ouest',
      titre: 'Colloque Technique : Formulation des Bétons Durables en Environnement Sévère',
      type: 'Séminaire Scientifique',
      dateDebut: new Date('2027-01-22T09:30:00Z'),
      dateFin: new Date('2027-01-22T17:00:00Z'),
      lieu: 'Hôtel Golden Tulip Le Diplomate, Cotonou',
      ville: 'Cotonou',
      lat: 6.3578,
      lng: 2.4189,
      resume: 'Atelier de restitution technique animé par les experts laboratoires NOCIBÉ et chercheurs en génie civil.',
      description: 'Présentation des protocoles de cure, prévention de la fissuration précoce par temps chaud et formulations adaptées au ciment NOCIBÉ CPJ 45 et CPA 55.',
      image: '/images/actualites/soutien-communautes-masse.jpg',
    },
    {
      slug: 'forum-recrutement-metiers-industrie-2027',
      titre: 'Forum de Recrutement & Métiers de l’Industrie Lourde',
      type: 'Recrutement',
      dateDebut: new Date('2027-02-18T10:00:00Z'),
      dateFin: new Date('2027-02-18T18:00:00Z'),
      lieu: 'Campus Universitaire d’Abomey-Calavi (EPAC)',
      ville: 'Abomey-Calavi',
      lat: 6.4485,
      lng: 2.3551,
      resume: 'Rencontre avec la DRH NOCIBÉ pour nos programmes de stages de fin d’études et opportunités de recrutement d’ingénieurs et techniciens.',
      description: 'Sessions d’entretiens éclairs (speed-interviews), présentation de nos programmes d’intégration pour jeunes diplômés et témoignages de collaborateurs.',
      image: '/images/actualites/usine-four-clinker.jpg',
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: ev,
      create: ev,
    });
  }
  console.log(`✅ ${events.length} événements insérés.`);

  console.log('🎉 Seeding PostgreSQL terminé avec succès.');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
