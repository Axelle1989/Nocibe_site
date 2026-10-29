# 🔒 Politique & Architecture de Sécurité — NOCIBÉ

Ce document présente les mesures de sécurité mises en œuvre sur la plateforme web de la **Nouvelle Cimenterie du Bénin (NOCIBÉ S.A.)** pour garantir l'intégrité des commandes, la confidentialité des données commerciales et la conformité légale.

---

## 🛡️ 1. Principes Fondamentaux de Sécurité

### 1.1 Principe du Moindre Privilège (Zero Trust Frontend)
- **Aucun secret d'administration dans le code client** : Le frontend Vite n'embarque aucun identifiant de base de données. Toutes les opérations de persistance transitent par l'API Node.js/Express protégée par JWT.
- **Toutes les mutations critiques sont recalculées côté serveur** : Les commandes ne sont jamais validées sur la base de prix transmis par le navigateur, mais intégralement recalculées par l'API à partir du catalogue officiel en base.

### 1.2 Isolation Stricte des Données
- Les entités contenant des données d'utilisateurs (`User`, `Order`, `OrderItem`, `OrderEvent`, `OrderMessage`, `Notification`) sont isolées par compte avec vérification de propriété au niveau des contrôleurs.
- Un client connecté ne peut ni lire ni modifier les commandes ou devis d'une entreprise tierce.

### 1.3 Vérification d'Email Obligatoire pour Commander
- Conformément aux exigences de traçabilité industrielle, **la validation d'une commande de ciment exige obligatoirement une adresse email vérifiée** (`emailVerifie = true`).
- Les gardes de route React et les contrôles stricts de l'API bloquent tout utilisateur dont l'adresse n'a pas été confirmée.

---

## 🌐 2. En-têtes HTTP de Sécurité (`netlify.toml`)

Le fichier de configuration du déploiement (`netlify.toml`) impose les en-têtes stricts suivants sur l'ensemble des réponses HTTP :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(self)"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.tile.openstreetmap.org; connect-src 'self' http://localhost:4000 http://127.0.0.1:4000 https://router.project-osrm.org https://*.tile.openstreetmap.org https://api.nocibe.bj; frame-ancestors 'none';"
```

### Bénéfices :
- **CSP (Content Security Policy)** : Bloque l'injection de scripts malveillants tiers (anti-XSS).
- **HSTS** : Force le chiffrement HTTPS TLS 1.3 pendant 2 ans.
- **X-Frame-Options: DENY** : Empêche toute intégration dans des iframes externes (protection totale contre le Clickjacking).
- **X-Content-Type-Options: nosniff** : Empêche le détournement de type MIME par les navigateurs.

---

## 🔍 3. Validation Stricte des Entrées (Zod)

Tous les formulaires du frontend (inscription, contact, devis, commande) sont vérifiés par des schémas de validation **Zod** (`src/lib/validations.ts`) avant toute transmission réseau :
- Vérification du format des numéros béninois (8 ou 10 chiffres, indicatif `+229`).
- Longueur minimale et complexité des mots de passe.
- Nettoyage des chaînes de caractères pour empêcher les attaques par injection.

---

---

## 🛡️ 5. Sécurisation Approfondie de l'API & des Données

### 5.1 Sécurité des Téléversements de Fichiers (Module Carrières)
- **Signature Binaire (Magic Bytes)** : Vérification stricte au niveau binaire des fichiers uploadés (`%PDF-`, `D0 CF 11 E0`, `50 4B 03 04`) afin de bloquer les fichiers malveillants maquillés en documents.
- **Stockage hors racine web** : Répertoire `server/uploads/cv` inaccessible directement par HTTP public.
- **Autorisation stricte** : Téléchargement réservé aux administrateurs authentifiés via jeton de session.

### 5.2 Sessions & Tokens HttpOnly
- **Tokens courts (15 min)** transmis via cookie sécurisé `nocibe_access_token` (`httpOnly: true`, `SameSite: 'Lax'`, `Secure` en production).
- **Refresh Token (7 jours)** dans un cookie `nocibe_refresh_token` avec empreinte SHA-256 stockée en base, rotation à chaque utilisation et révocation instantanée lors de la déconnexion.
- **Absence totale de JWT dans le localStorage** (élimination des risques de vol de session par injection XSS).

### 5.3 Protection Brute-Force & Limitation de Débit (Rate Limiting)
- `express-rate-limit` configuré sur tous les endpoints critiques :
  - **Authentification** : 10 requêtes par 15 minutes.
  - **Soumissions formulaires (candidatures, devis, contact)** : 5 requêtes par 15 minutes.
  - **Trafic global** : 300 requêtes par 15 minutes.
- **Verrouillage temporaire de compte** : Verrouillage automatique de 15 minutes après 5 échecs consécutifs d'authentification.
- **Mots de passe** : Hachage bcrypt avec coût 12 et protection contre les attaques temporelles (timing attack mitigation).

&copy; 2026 NOCIBÉ S.A. — Direction de la Conformité & Sécurité des Systèmes d'Information.

