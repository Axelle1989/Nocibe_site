# Répertoire des Données Fictives à Remplacer Avant Mise en Production

Ce document recense l'intégralité des données de démonstration temporaires créées dans l'application NOCIBÉ. Chaque fichier source porte la mention `// DONNÉES FICTIVES : à remplacer` et les objets de données portent la propriété `fictif: true`.

---

## 1. Données Produits (`src/data/products.ts`)
- **Tarifs indicatifs FCFA** : 4 200 FCFA (CPJ 35), 4 500 FCFA (CPJ 45), 4 900 FCFA (CPA 55), 5 200 FCFA (Ciment Spécial PM), 86 000 FCFA/t (Vrac), 78 000 FCFA/t (Export).
  *À remplacer par la grille tarifaire officielle validée par la Direction Commerciale NOCIBÉ.*
- **Fiches PDF de démonstration** : `docs/fiche-technique-*.pdf`.
  *À remplacer par les PV officiels d'essais du laboratoire et certificats Bureau Veritas.*

---

## 2. Données Équipe Dirigeante (`src/data/team.ts`)
- **Membres du comité de direction** : Noms béninois d'exemple (ex: Dr. Christian HOUNDEGLA, Ing. Aïcha BIO GUERRA, Patrice DOSSOU, etc.).
- **Emails professionnels indicatifs** : `prenom.nom@nocibe.bj` (`christian.houndegla@nocibe.bj`, `aicha.bioguerra@nocibe.bj`, `patrice.dossou@nocibe.bj`, `nadia.agbangla@nocibe.bj`, `marcellin.zinsou@nocibe.bj`, `felicienne.alapini@nocibe.bj`).
- **Téléphones professionnels indicatifs** : Format béninois `+229 01 21 30 11 0X`.
- **Photos / Visuels** : Avatars typographiques avec monogrammes dans des cercles marine (interdiction stricte de photos de banques d'images occidentales respectée).
  *À remplacer par les véritables coordonnées (email/téléphone) et photos officielles des membres du comité de direction.*

---

## 3. Données Réalisations (`src/data/projects.ts`)
- **Volumes de ciment sur les chantiers** : Chiffres d'exemple représentatifs des grands projets nationaux (+45 000 T Port de Cotonou, 400 ha GDIZ, etc.).

---

## 4. Données Dépôts & Distributeurs (`src/data/outlets.ts`)
- **Numéros de téléphone et adresses** : Adresses de démonstration basées sur les carrefours réels de Cotonou, Calavi, Porto-Novo, Bohicon, Parakou.
  *À remplacer par la liste exhaustive des dépôts conventionnés et coordonnées des gérants de comptoirs.*

---

## 5. Contact & Configuration Générale (`src/config/site.ts`)
- Numéros de téléphone : Format 10 chiffres standard 2024 de démonstration (`+229 01 47 81 67 78` et `+229 01 21 30 15 45`).
- Email commercial : `contact@nocibe.bj` et `devis@nocibe.bj`.
- Liens réseaux sociaux : URLs de préfiguration (`facebook.com/nocibebenin`, `linkedin.com/company/nocibe-benin`).
