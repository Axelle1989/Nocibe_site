import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger explicitement server/.env en priorité
const serverEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: serverEnvPath });
// Fallback sur le dossier d'exécution si applicable
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requise'),
  DIRECT_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET doit comporter au moins 32 caractères'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET doit comporter au moins 32 caractères'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL est requise'),
  SMTP_HOST: z.string().optional().default('localhost'),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().optional().default('NOCIBÉ S.A. <contact@nocibe.bj>'),
  HR_EMAIL: z.string().optional().default('recrutement@nocibe.bj'),
  UPLOAD_DIR: z.string().optional().default('./uploads'),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_DEMO_EMAIL: z.string().optional(),
  SEED_DEMO_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ ERREUR FATALE: Configuration des variables d\'environnement invalide :');
  const issues = parsed.error.issues.map(
    (issue) => `• ${issue.path.join('.') || 'variable'}: ${issue.message}`
  );
  console.error(issues.join('\n'));
  process.exit(1);
}

export const ENV = {
  ...parsed.data,
  ALLOWED_ORIGINS: parsed.data.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean),
  IS_PRODUCTION: parsed.data.NODE_ENV === 'production',
};
