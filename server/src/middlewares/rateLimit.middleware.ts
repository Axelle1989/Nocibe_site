import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';

const isDev = !ENV.IS_PRODUCTION;

// Limiteur global pour toutes les routes API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 3000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de requêtes reçues. Veuillez patienter quelques minutes avant de réessayer.',
    code: 'RATE_LIMITED',
  },
});

// Limiteur pour l'authentification (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de tentatives de connexion ou d’inscription. Veuillez réessayer dans 15 minutes.',
    code: 'RATE_LIMITED',
  },
});

// Limiteur pour mot de passe oublié & renvoi vérification email
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: isDev ? 100 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de demandes de réinitialisation. Veuillez patienter avant de réessayer.',
    code: 'RATE_LIMITED',
  },
});

// Limiteur pour formulaires publics sensibles (Contact, Devis B2B)
export const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de messages ou devis envoyés. Veuillez patienter avant une nouvelle soumission.',
    code: 'RATE_LIMITED',
  },
});
