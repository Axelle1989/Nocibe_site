# 🛡️ Guide Administrateur — Console de Gestion NOCIBÉ

Ce guide s'adresse aux gestionnaires commerciaux, répartiteurs logistiques et administrateurs du système d'information de la **Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.)**.

---

## 🔐 1. Accès & Sécurité Administrateur

### URL de la console
L'espace d'administration interne est accessible à l'URL suivante (non divulguée dans les menus publics du site) :
```
/admin/connexion
```

### Vérification des autorisations
1. Renseignez votre adresse email institutionnelle (ex : `admin@nocibe.bj`) et votre mot de passe administrateur.
2. Le système vérifie la présence du rôle `ADMIN` en base de données et délivre un jeton JWT d'administration.
3. Si le compte ne dispose pas des droits nécessaires, l'accès est strictement refusé par le middleware de sécurité (`requireAdmin`).

### Recommandation de Sécurité des Mots de Passe
Pour tous les comptes disposant d'un droit de validation d'expéditions ou de facturation, il est obligatoire d'utiliser un mot de passe fort (au moins 12 caractères incluant majuscules, minuscules, chiffres et caractères spéciaux).

---

## 📦 2. Gestion des Commandes & Logistique Usine (`/admin`)

La page principale d'administration permet de piloter le flux quotidien des départs de camions depuis l'usine de Massé :

### Recherche et filtres rapides
- **Barre de recherche** : Recherche instantanée par numéro de commande (`NOC-2026-XXXXXX`), nom de ville ou quartier.
- **Filtres par statut** :
  - `Toutes` : Historique complet.
  - `En attente` : Nouvelles commandes nécessitant validation de solvabilité.
  - `Confirmées` : Commandes acceptées, prêtes pour ordonnancement.
  - `Ensachage` : En cours de conditionnement sur les lignes de Massé.
  - `En route` : Camions en cours d'acheminement.
  - `Livrées` : Bons de livraison signés.

### Mise à jour des états logistiques
Pour chaque commande sélectionnée dans la liste de gauche, le panneau de droite permet de :
1. Cliquer sur l'action correspondante :
   - **Confirmer Usine** (`confirmee`)
   - **Ensachage Massé** (`en_preparation`)
   - **Camion en route** (`en_livraison`)
   - **Livré & Réceptionné** (`livree`)
2. Ajouter une note ou l'immatriculation du camion (ex : `Camion plateau BJ-4820 - Chauffeur Koffi`).
3. **Conséquence automatique** : L'action insère un événement dans `order_events`, déclenche la mise à jour en temps réel chez le client et expédie une notification.

---

## 💬 3. Messagerie Directe avec le Client

Le gestionnaire dispose d'un canal d'échange textuel direct attaché à chaque commande :
1. Saisissez votre message dans le champ situé au bas de la fiche commande (ex : *« Bonjour, le camion est actuellement au péage d'Ahozon, arrivée estimée dans 45 minutes »*).
2. Cliquez sur l'icône d'envoi.
3. Le message est immédiatement visible par le client sur son tableau de bord et horodaté.

---

## 📥 4. Export CSV des Commandes

Pour le reporting financier ou l'intégration dans l'ERP de facturation NOCIBÉ :
1. Cliquez sur le bouton **« Exporter CSV »** situé en haut à droite.
2. Un fichier normalisé est généré automatiquement avec le nom :
   ```
   nocibe-commandes-AAAA-MM-JJ.csv
   ```
3. **Colonnes incluses** :
   - `Numero_Commande` : Référence normalisée.
   - `Date` : Date de création ISO.
   - `Statut` : État logistique.
   - `Client_Id` : Identifiant unique de l'acheteur.
   - `Montant_FCFA` : Montant total TTC en Francs CFA.
   - `Destination` : Ville et quartier de déchargement.
   - `Quantite_Sacs` : Total de sacs de 50 kg commandés.

---

## 📑 5. Pilotage du Catalogue & des Actualités (`/admin/contenu`)

La rubrique **Catalogue & Actualités** permet de moduler les contenus sans toucher au code source :

### Badges « Nouveau » et « Recommandé »
- Basculez les interrupteurs sur les ciments pour afficher ou masquer instantanément les pastilles promotionnelles sur le site public :
  - **Badge "Nouveau"** : Met en exergue les formulations récentes (ex : *CPA 55 Haute Résistance*).
  - **Badge "Recommandé"** : Valorise les produits phares pour le gros œuvre béninois (ex : *CPJ 45*).

### Publication de communiqués usine
- Création et prévisualisation des notes d'information destinées aux entreprises partenaires (calendriers de maintenance du four rotatif de Massé, avis de congés annuels, rapports qualité laboratoire).

---

## 👥 6. Gestion du Recrutement & des Talents (`/admin/recrutement`)

La rubrique **Recrutement & Talents** permet à l'équipe des Ressources Humaines de traiter l'ensemble des candidatures reçues :

### Fonctionnalités disponibles
1. **Filtres et Recherche** :
   - Filtrer par statut : *Nouvelle, En revue, Entretien, Retenue, Rejetée, Vivier*.
   - Filtrer par type : *Offre d'emploi, Stage académique, Stage professionnel, Candidature spontanée*.
   - Recherche textuelle par nom de candidat ou email.
2. **Consultation détaillée du dossier** :
   - Affichage complet des informations : coordonnées, diplôme, niveau d'études, années d'expérience, disponibilité, prétentions salariales et résumé de motivation.
   - Téléchargement sécurisé du CV déposé (`GET /api/careers/admin/applications/:id/cv`). Le fichier est vérifié par signature binaire (magic-bytes) pour écarter tout risque d'exécutable malveillant.
3. **Évaluation & Décision RH** :
   - Mise à jour du statut de la candidature.
   - Ajout ou modification d'une **note interne RH** confidentielle (ex : avis du jury d'entretien, proposition salariale, date de prise de poste).
4. **Export CSV** :
   - Export d'un clic de la liste complète des candidats pour traitement dans les outils SIRH ou reporting de la Direction Générale.

---

## 🔧 7. Maintenance & Bonnes Pratiques

- **Sauvegardes de la base** : Assurées quotidiennement par le service PostgreSQL (avec rétention et instantanés automatisés).
- **En cas de doute sur une commande** : Contactez le réceptionnaire par le numéro de téléphone renseigné avant d'autoriser la sortie usine du camion.
- **Protection des données candidats (RGPD / Loi Béninoise sur les données personnelles)** : Les CV et données des candidats doivent être traités en toute confidentialité et purgés après un délai maximal de 24 mois.

&copy; 2026 NOCIBÉ S.A. — Direction des Systèmes d'Information, Logistique & RH.

