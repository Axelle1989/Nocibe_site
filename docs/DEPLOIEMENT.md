# 🚀 Guide de Déploiement en Production — NOCIBÉ

Ce guide décrit le déploiement en production de la plateforme NOCIBÉ :
- **Frontend** : React 19 + Vite hébergé sur **Vercel** (ou Netlify / Cloudflare Pages).
- **Backend API** : Node.js / Express hébergé sur un PaaS (ex. **Render**, **Railway**, ou un serveur VPS).
- **Base de données** : **PostgreSQL** géré (ex. **Neon**, **Railway**, ou service managé cloud) via **Prisma ORM**.

---

## 📋 Prérequis
- Un compte Git ([GitHub](https://github.com) ou [GitLab](https://gitlab.com)).
- Une instance PostgreSQL managée avec accès `DATABASE_URL` et `DIRECT_URL`.
- Un compte [Vercel](https://vercel.com) pour le frontend.
- Une plateforme d'hébergement Node.js (ex: Render, Railway, VPS) pour le dossier `server/`.
- Un nom de domaine officiel (ex : `nocibe.bj`).

---

## 🗄️ Étape 1 : Déploiement de la Base de Données PostgreSQL

### 1.1 Provisionner l'instance PostgreSQL
1. Créez une base PostgreSQL 16 auprès de votre fournisseur managé (ex: Neon, Railway, RDS).
2. Récupérez les deux chaînes de connexion :
   - `DATABASE_URL` : Chaîne de connexion poolée (PgBouncer/transaction pooling si disponible).
   - `DIRECT_URL` : Chaîne de connexion directe (nécessaire pour exécuter les migrations Prisma sans passer par le pooler).

### 1.2 Exécution des migrations Prisma
Depuis votre environnement de déploiement continu ou votre terminal configuré avec les variables de production :

```bash
# Appliquer les migrations déclarées
npm --prefix server run db:migrate

# Pour la production stricte (sans invite interactive) :
npx prisma migrate deploy --schema server/prisma/schema.prisma

# Initialiser le catalogue et le compte administrateur initial
npm --prefix server run db:seed
```

---

## 🖥️ Étape 2 : Déploiement du Serveur API (Node.js / Express)

### 2.1 Configuration du service
1. Créez un nouveau **Web Service** pointant vers la racine ou le sous-dossier `server/`.
2. Commande de build : `npm install && npm run build`
3. Commande de démarrage : `npm start` (ou `node dist/index.js`)

### 2.2 Variables d'environnement du Serveur
Renseignez les variables suivantes dans le panneau d'administration de votre hébergeur :

| Variable | Description | Exemple factice |
| :--- | :--- | :--- |
| `PORT` | Port d'écoute du serveur | `4000` |
| `NODE_ENV` | Environnement d'exécution | `production` |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | Chaîne directe pour migrations | `postgresql://user:pass@host:5432/db` |
| `JWT_ACCESS_SECRET` | Secret JWT accès (32 car. min) | `generer_une_cle_aleatoire_32_caracteres_min` |
| `JWT_REFRESH_SECRET` | Secret JWT refresh (32 car. min) | `generer_une_cle_aleatoire_32_caracteres_min` |
| `CLIENT_URL` | Origines autorisées CORS | `https://www.nocibe.bj,https://nocibe.bj` |
| `SMTP_HOST` | Hôte SMTP transactionnel | `smtp.votrefournisseur.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Identifiant SMTP | `identifiant_smtp` |
| `SMTP_PASS` | Mot de passe SMTP | `mot_de_passe_smtp` |
| `MAIL_FROM` | Expéditeur des emails | `NOCIBÉ S.A. <noreply@nocibe.bj>` |
| `HR_EMAIL` | Email de réception RH | `recrutement@nocibe.bj` |
| `UPLOAD_DIR` | Répertoire de stockage CV | `/var/data/nocibe_uploads` |

---

## ☁️ Étape 3 : Déploiement Frontend sur Vercel

### 3.1 Importer le dépôt Git
1. Connectez-vous sur Vercel et importez le dépôt du projet.
2. Définissez le framework sur **Vite**.
3. Commande de build : `npm run build`
4. Répertoire de sortie : `dist`

### 3.2 Variables d'environnement Frontend
Ajoutez la variable d'URL d'API pointant vers le serveur déployé à l'étape 2 :

| Nom de la variable | Description | Exemple |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL de base de l'API Node.js | `https://api.nocibe.bj` |

---

## 🔒 Étape 4 : Vérification Finale & Sécurité
1. Tester la route de santé : `GET https://api.nocibe.bj/api/health` → doit retourner `{"status":"ok","database":"connected (postgresql)"}`.
2. Vérifier que les requêtes CORS depuis des domaines non autorisés sont refusées.
3. Valider le chargement HTTPS et les en-têtes CSP/HSTS via les headers définis dans `vercel.json`.
