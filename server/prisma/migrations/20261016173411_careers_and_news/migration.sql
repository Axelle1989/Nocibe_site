-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('EMPLOI_CDI', 'EMPLOI_CDD', 'STAGE_ACADEMIQUE', 'STAGE_PROFESSIONNEL', 'ALTERNANCE', 'CANDIDATURE_SPONTANEE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('BROUILLON', 'PUBLIEE', 'CLOTUREE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('RECUE', 'EN_REVUE', 'ENTRETIEN', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('BROUILLON', 'PUBLIE', 'ARCHIVE');

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "secteur" TEXT NOT NULL,
    "lieu" TEXT NOT NULL DEFAULT 'Massé (Adja-Ouèrè)',
    "description" TEXT NOT NULL,
    "missions" TEXT NOT NULL,
    "profil" TEXT NOT NULL,
    "competences" JSONB,
    "duree" TEXT,
    "dateLimite" TIMESTAMP(3),
    "statut" "JobStatus" NOT NULL DEFAULT 'PUBLIEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "jobOfferId" TEXT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "pays" TEXT NOT NULL DEFAULT 'Bénin',
    "nationalite" TEXT NOT NULL DEFAULT 'Béninoise',
    "typeCandidature" "JobType" NOT NULL,
    "secteur" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "etablissement" TEXT NOT NULL,
    "filiere" TEXT NOT NULL,
    "diplomeAnnee" TEXT,
    "stageDuree" TEXT,
    "stageDatesDispo" TEXT,
    "conventionStage" BOOLEAN NOT NULL DEFAULT false,
    "stageTuteur" TEXT,
    "anneesExperience" TEXT,
    "dernierPoste" TEXT,
    "disponibilite" TEXT,
    "pretentionsSalariales" TEXT,
    "permis" TEXT,
    "langues" TEXT,
    "linkedinUrl" TEXT,
    "lettreMotivation" TEXT,
    "statut" "ApplicationStatus" NOT NULL DEFAULT 'RECUE',
    "noteInterne" TEXT,
    "cvFileName" TEXT NOT NULL,
    "cvOriginalName" TEXT NOT NULL,
    "cvMimeType" TEXT NOT NULL,
    "cvSize" INTEGER NOT NULL,
    "cvPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationFile" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL DEFAULT 'AUTRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communique" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "categorie" TEXT NOT NULL DEFAULT 'Direction Générale',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resume" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pdfName" TEXT,
    "statut" "PublishStatus" NOT NULL DEFAULT 'PUBLIE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Conférence',
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "lieu" TEXT NOT NULL,
    "ville" TEXT NOT NULL DEFAULT 'Massé',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "resume" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "statut" "PublishStatus" NOT NULL DEFAULT 'PUBLIE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_slug_key" ON "JobOffer"("slug");

-- CreateIndex
CREATE INDEX "JobOffer_statut_idx" ON "JobOffer"("statut");

-- CreateIndex
CREATE INDEX "JobOffer_type_idx" ON "JobOffer"("type");

-- CreateIndex
CREATE INDEX "JobOffer_secteur_idx" ON "JobOffer"("secteur");

-- CreateIndex
CREATE UNIQUE INDEX "Application_reference_key" ON "Application"("reference");

-- CreateIndex
CREATE INDEX "Application_statut_idx" ON "Application"("statut");

-- CreateIndex
CREATE INDEX "Application_typeCandidature_idx" ON "Application"("typeCandidature");

-- CreateIndex
CREATE INDEX "Application_secteur_idx" ON "Application"("secteur");

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "Application"("email");

-- CreateIndex
CREATE INDEX "ApplicationFile_applicationId_idx" ON "ApplicationFile"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Communique_slug_key" ON "Communique"("slug");

-- CreateIndex
CREATE INDEX "Communique_statut_idx" ON "Communique"("statut");

-- CreateIndex
CREATE INDEX "Communique_date_idx" ON "Communique"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_statut_idx" ON "Event"("statut");

-- CreateIndex
CREATE INDEX "Event_dateDebut_idx" ON "Event"("dateDebut");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFile" ADD CONSTRAINT "ApplicationFile_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
