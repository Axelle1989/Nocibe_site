# Répertoire des Images Officielles NOCIBÉ

Ce dossier rassemble l'ensemble des médias statiques utilisés sur le site officiel de la Nouvelle Cimenterie du Bénin.
Toutes les images doivent être optimisées au format **WebP** ou **PNG** (haute définition 2x pour les logos).

---

## 1. Produits (`public/images/produits/`)
Photos des sacs de ciment et du vrac, fond neutre industriel ou studio :
- `ciment-cpj-35.webp` (800 × 800 px, 1:1) — Sac de 50 kg CPJ 35
- `ciment-cpj-45.webp` (800 × 800 px, 1:1) — Sac de 50 kg CPJ 45
- `ciment-cpa-55.webp` (800 × 800 px, 1:1) — Sac de 50 kg CPA 55 Haute Résistance
- `ciment-vrac.webp` (800 × 800 px, 1:1) — Camion citerne vrac & trémie de chargement
- `vue-palette.webp` (800 × 600 px, 4:3) — Palette de 40 sacs filmée
- `vue-chargement.webp` (800 × 600 px, 4:3) — Manutention et expédition en usine

---

## 2. Grands Chantiers & Réalisations (`public/images/realisations/`)
Photos de chantiers réels au Bénin au ratio fixe **4:3** :
- `port-cotonou.webp` (800 × 600 px, 4:3) — Quai et terre-plein Port Autonome de Cotonou
- `gdiz-glo-djigbe.webp` (800 × 600 px, 4:3) — Hangars industriels et voiries GDIZ
- `pont-oueme.webp` (800 × 600 px, 4:3) — Piles et tabliers en béton armé CPA 55
- `asphaltage-cotonou.webp` (800 × 600 px, 4:3) — Voiries urbaines et caniveaux Cotonou
- `echangeur-godomey.webp` (800 × 600 px, 4:3) — Ouvrages d'art et viaducs
- `stade-general-mathieu-kerekou.webp` (800 × 600 px, 4:3) — Rénovation structure béton

---

## 3. Clients & Témoignages (`public/images/clients/`)
Photos d'entreprises partenaires et conducteurs de travaux au ratio **4:3** :
- `btp-atlantique.webp` (800 × 600 px, 4:3) — Entreprise de gros œuvre en action
- `benin-infrastructures.webp` (800 × 600 px, 4:3) — Chantier autoroutier
- `depot-akpakpa.webp` (800 × 600 px, 4:3) — Quincaillerie et grossiste distributeur
- `colombes-genie-civil.webp` (800 × 600 px, 4:3) — Coffrage et coulage de radier

---

## 4. Usine Intégrée de Massé (`public/images/usine/`)
Photos de l'appareil de production dans le département du Plateau :
- `vue-aerienne-masse.webp` (1600 × 900 px, 16:9) — Vue globale du complexe industriel
- `carriere-calcaire.webp` (1200 × 800 px, 3:2) — Extraction et concassage
- `four-rotatif.webp` (1200 × 800 px, 3:2) — Four de clinkerisation à 1 450 °C
- `broyeur-ciment.webp` (1200 × 800 px, 3:2) — Broyeur à boulets vertical
- `silos-stockage.webp` (1200 × 800 px, 3:2) — Silos de clinker et ciment fini
- `laboratoire-qualite.webp` (1200 × 800 px, 3:2) — Presses d'écrasement et spectrométrie X

---

## 5. Équipe & Direction (`public/images/equipe/`)
Portraits professionnels des dirigeants et ingénieurs :
- `direction-generale.webp` (600 × 600 px, 1:1) — Direction Générale
- `direction-usine.webp` (600 × 600 px, 1:1) — Direction de l'usine de Massé
- `responsable-qualite.webp` (600 × 600 px, 1:1) — Responsable du contrôle laboratoire
- `logistique-expeditions.webp` (600 × 600 px, 1:1) — Responsable flotte et enlèvements

---

## 6. Partenaires Institutionnels & Industriels (`public/images/partenaires/`)
Logos vectoriels ou PNG haute définition avec fond transparent :
- Logos : CNB (BTP), ABeGEC, Bureau Veritas, Ministère du Cadre de Vie, Ordre des Ingénieurs du Bénin.

---

## Fallback automatique
Si un fichier image n'est pas encore présent sur le serveur, le composant `<SafeImage />` bascule automatiquement sur un dégradé élégant Bleu Marine (`#0B1F3A`) avec l'emblème filigrané NOCIBÉ et le titre de l'élément, garantissant une esthétique soignée en permanence sans image brisée.
