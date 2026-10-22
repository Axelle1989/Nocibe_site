# 🇧🇯 NOCIBÉ — Nouvelle Cimenterie du Bénin

Plateforme web officielle et portail applicatif de la **Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.)**, usine intégrée de Massé (Département du Plateau) et direction générale à Cotonou.

Le projet allie un **site vitrine public industriel premium** (100% accessible, responsive, animations Motion), un **espace client sécurisé** avec suivi logistique en temps réel, un **espace carrières et talents** avec téléversement sécurisé de candidatures, un **module de communication institutionnelle** (communiqués et événements), et une **console d'administration** interne.

---

## 🏛️ Architecture Globale de la Plateforme

```
                                  ┌─────────────────────────────────────────┐
                                  │               NOCIBÉ BÉNIN              │
                                  └────────────────────┬────────────────────┘
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
         ▼                                             ▼                                             ▼
  ┌─────────────────────────────┐             ┌─────────────────────────────┐         ┌─────────────────────────────┐
  │     Site Vitrine Public     │             │    Espace Carrières & RH    │         │    Portail Client & Admin   │
  ├─────────────────────────────┤             ├─────────────────────────────┤         ├─────────────────────────────┤
  │ • Usine de Massé (1450 °C)  │             │ • Hub Carrières & Piliers   │         │ • Authentification sécurisée│
  │ • Catalogue Ciments EN197-1 │             │ • Offres d'emploi CDI/CDD   │         │ • Commandes & Factures      │
  │ • Calculateur de béton      │             │ • Stages Académiques & Pro  │         │ • Suivi camion usine Massé  │
  │ • Devis B2B & Panier local  │             │ • Candidature en ligne + CV │         │ • Messagerie expédition     │
  │ • Communiqués & Événements  │             │ • Console Recrutement Admin │         │ • Console logistique usine  │
  │ • Mot du Directeur Général  │             │ • Vérification magic-bytes  │         │ • Audit logs & exports CSV  │
  └─────────────────────────────┘             └─────────────────────────────┘         └─────────────────────────────┘
```

---

## 🛠️ Stack Technologique

- **Frontend** : React 19, Vite 6, TypeScript 5.8 (mode strict), Tailwind CSS v4, React Router 7, Motion.
- **Backend API** : Node.js, Express 4, Prisma ORM 6, Multer, Zod, bcryptjs, jsonwebtoken.
- **Base de Données** : PostgreSQL 16 Alpine (`docker-compose.yml` avec volume persistant).
- **Sécurité** : Cookies httpOnly sécurisés (`nocibe_access_token` & `nocibe_refresh_token`), rotation et révocation des refresh tokens, vérification de type binaire (magic-bytes) sur les CV téléversés, Rate Limiting, Helmet, et protection CSRF / CSP.

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js ≥ 20.0.0
- Docker & Docker Compose

### 1. Démarrer la Base de Données PostgreSQL
```bash
docker compose up -d postgres
```
- 🗄️ **PostgreSQL :** `127.0.0.1:5432` (Base : `nocibe_db`, Utilisateur : `nocibe_user`)
- 🛠️ **Adminer (Optionnel, profil tools) :** `docker compose --profile tools up -d adminer` (`http://127.0.0.1:8080`)

### 2. Initialiser les Migrations & le Seed Prisma
```bash
npm --prefix server run db:migrate
npm --prefix server run db:seed
```

### 3. Démarrer l'API Backend Express
```bash
npm --prefix server run dev
```
- 🚀 **API REST :** `http://localhost:4000/api`
- 🩺 **Healthcheck :** `http://localhost:4000/api/health`

### 4. Démarrer le Frontend Vite
```bash
npm run dev
```
- 🌐 **Site Web :** `http://localhost:3000` (ou `3001`)

---

## 🔑 Identifiants Démo Initialisés (Seed PostgreSQL)

| Rôle | Email | Mot de passe | Description |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@nocibe.bj` | `Nocibe2026!Admin` | Accès au panneau `/admin` (Logistique, Contenu, Recrutement) |
| **Client Démo** | `client@entreprise.bj` | `Nocibe2026!Client` | Portail client `/espace-client`, commandes et suivi |

---

## 📚 Documentation Complète

Retrouvez les guides détaillés dans le dossier [`docs/`](./docs/) et [`docs-internal/`](./docs-internal/) :
- [**Guide Utilisateur & Client**](./docs/GUIDE-UTILISATEUR.md) : Parcours vitrine, commande de ciment, carrières et communiqués.
- [**Guide Administrateur**](./docs/GUIDE-ADMIN.md) : Gestion logistique, validation des commandes et gestion des candidatures.
- [**Documentation Technique**](./docs/DOCUMENTATION-TECHNIQUE.md) : Architecture React 19, API Express, flux de données et sécurité.
- [**Base de Données & Prisma**](./docs/BASE-DE-DONNEES.md) : Modèles Prisma, diagramme ER et migrations PostgreSQL.
- [**Politique de Sécurité**](./docs/SECURITE.md) : En-têtes CSP/HSTS, cookies httpOnly, rate limiting et protection des fichiers.
- [**Inventaire des Données Fictives**](./docs/DONNEES-FICTIVES.md) : Contenus de démonstration à remplacer avant mise en production.
- [**Runbook d'Exploitation**](./docs-internal/RUNBOOK.md) : Procédures de démarrage, supervision et dépannage.
- [**Sécurité Interne & Secrets**](./docs-internal/SECURITE-INTERNE.md) : Rotation des clés JWT, gestion des sauvegardes et plan d'urgence.

---

## 🎨 Identité Visuelle & Normes

- **Couleurs de Marque** : Bleu Marine Industriel (`#0B1F3A`) et Bleu Vif NOCIBÉ (`#0131FD`), avec accents rares en Orange (`#F26A1B`).
- **Norme Cimentière** : Ciments certifiés conformes à la norme européenne et béninoise **EN 197-1**.
- **Conformité Réglementaire** : Conforme au Code du Numérique du Bénin (Loi n° 2017-20) et aux directives de l'APDP.

&copy; 2026 NOCIBÉ S.A. — Tous droits réservés.
