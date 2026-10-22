# 📋 Inventaire des Données Fictives & Guide de Remplacement — NOCIBÉ

Pour permettre le développement, la validation graphique et la démonstration complète sans attendre les validations de la direction générale, le projet intègre des données de démonstration typées et réalistes.

Ce document dresse l'inventaire exhaustif de tous les contenus à remplacer par la direction de **NOCIBÉ S.A.** avant l'ouverture officielle au public.

---

## 📑 1. Récapitulatif des Données & Fichiers Concernés

| Domaine / Fichier source | Données de démonstration actuelles | Actions requises avant mise en production |
| :--- | :--- | :--- |
| `src/config/site.ts` | Numéros de téléphone `+229 01 47 81 67 78` et adresses emails génériques | Standard téléphonique officiel du siège de Cotonou et de l'usine de Massé |
| `src/data/director.ts` | Mot du Directeur Général (M. Jean-Philippe Meunier) et photo de démonstration | Discours validé et portrait officiel haute définition du Directeur Général en poste |
| `server/prisma/seed.ts` & BDD | 7 offres d'emploi fictives (Ingénieur Process, Chef de Carrière, Stagiaires...) | Liste réelle des postes ouverts validée par la Direction des Ressources Humaines |
| `server/prisma/seed.ts` & BDD | 4 communiqués officiels (notes de presse, certifications, bilan RSE) | Vrais communiqués signés et numéros de référence officiels du secrétariat général |
| `server/prisma/seed.ts` & BDD | 4 événements (Salon BTP Cotonou, Portes ouvertes Massé, Reboisement Pobè) | Calendrier événementiel certifié de la direction de la communication |
| `src/data/products.ts` | Prix indicatifs en FCFA (ex : 4 200 à 5 200 FCFA/sac) | Barème tarifaire officiel en vigueur fixé par la direction commerciale |
| `src/data/outlets.ts` | Dépôts et revendeurs agréés (Cotonou, Calavi, Parakou...) | Liste certifiée des distributeurs agréés NOCIBÉ et coordonnées GPS |
| `src/data/projects.ts` | Chantiers emblématiques (Échangeur de Vèdoko, Port de Cotonou...) | Liste contractuelle des réalisations de référence construites avec le ciment NOCIBÉ |
| `src/data/team.ts` | Noms et fonctions de la direction générale et usine | Trombinoscope officiel et biographies validées par les ressources humaines |
| `src/pages/LegalPage.tsx` | Mentions légales types (RCCM fictif, IFU provisoire) | Numéro RCCM officiel, IFU réel, capital social enregistré au greffe du tribunal de commerce de Cotonou |
| `server/.env` | `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` de développement | Comptes administrateurs réels avec mots de passe complexes et 2FA obligatoire |

---

## 🛠️ 2. Guide de Remplacement par Section

### 2.1 Espace Carrières & Offres d'Emploi
1. Ouvrez `server/prisma/seed.ts` ou utilisez l'interface d'administration `/admin/recrutement`.
2. Pour chaque offre, vérifier :
   - L'intitulé de poste exact
   - La référence interne RH (ex: `NOC-2026-ING-01`)
   - Le département et le site (Massé, Cotonou, Parakou)
   - Les missions et le profil requis
   - La date limite de candidature réelle

### 2.2 Communiqués & Publications Officielles
1. Dans `server/prisma/seed.ts` ou la base PostgreSQL, remplacer :
   - Le titre et la référence officielle (ex: `NOC-DIR-2026-001`)
   - Le texte intégral du communiqué
   - Le nom et titre exact du signataire
   - La date d'effet ou de publication

### 2.3 Agenda Événementiel
1. Remplacer les dates, heures, adresses et liens d'inscription dans `server/prisma/seed.ts`.
2. Vérifier les types d'événements : `SALON_BTP`, `PORTES_OUVERTES`, `SEMINAIRE`, `RSE_COMMUNAUTE`.

### 2.4 Mot du Directeur Général (`src/data/director.ts`)
```typescript
export const DIRECTOR_DATA = {
  name: "Nom et Prénom du DG",
  title: "Directeur Général — Nouvelle Cimenterie du Bénin",
  image: "/images/direction/dg-portrait.webp",
  catchphrase: "Citation forte sur la vision et l'excellence...",
  paragraphs: [
    "Texte officiel du message...",
  ],
};
```

---

## 🔄 3. Procédure de Réinitialisation en Production

1. Définir les variables d'environnement sécurisées dans `server/.env` :
   ```env
   SEED_ADMIN_EMAIL="admin.officiel@nocibe.bj"
   SEED_ADMIN_PASSWORD="[MOT_DE_PASSE_TRES_FORT_ET_SECRET]"
   ```
2. Appliquer les migrations PostgreSQL :
   ```bash
   npx prisma migrate deploy
   ```
3. Exécuter le seed validé :
   ```bash
   npm --prefix server run db:seed
   ```

&copy; 2026 NOCIBÉ S.A. — Direction des Systèmes d'Information & Secrétariat Général.
