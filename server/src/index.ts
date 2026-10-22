import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { ENV } from './config/env.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { quotesRouter } from './routes/quotes.routes.js';
import { contactRouter } from './routes/contact.routes.js';
import { careersRouter } from './routes/careers.routes.js';
import { newsRouter } from './routes/news.routes.js';
import { prisma } from './config/prisma.js';
import { mailService } from './services/mail.service.js';

const app = express();

// Trust proxy en production (derrière reverse proxy Caddy / Nginx / Load Balancer)
if (ENV.IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

// Sécurisation des en-têtes HTTP via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Attribution d'un identifiant unique par requête (X-Request-Id)
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = `REQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  (req as any).reqId = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
});

// Liste blanche stricte construite depuis CLIENT_URL
const allowedOriginsSet = new Set(ENV.ALLOWED_ORIGINS);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requêtes sans header Origin (tests internes, curl) autorisées hors production
      if (!origin) {
        if (!ENV.IS_PRODUCTION) {
          callback(null, true);
        } else {
          callback(new Error('Origine non spécifiée refusée par la politique CORS.'));
        }
        return;
      }

      if (allowedOriginsSet.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origine '${origin}' non autorisée par la politique de sécurité CORS NOCIBÉ.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
  })
);

// Parseur de cookies & limitation stricte de charge utile à 100kb
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Route racine GET / (pas de numéro de version)
app.get('/', (_req: Request, res: Response) => {
  res.json({ service: 'NOCIBÉ API', status: 'ok' });
});

// Limiteur de débit global sur l'ensemble de l'API
app.use('/api', globalLimiter);

// Routes de l'API
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/careers', careersRouter);
app.use('/api/news', newsRouter);

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected (postgresql)';
  } catch {
    dbStatus = 'unavailable';
  }

  res.json({
    status: 'ok',
    service: 'NOCIBÉ API Node/Express',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Gestionnaire d'erreurs centralisé (avec Request ID, masquage des détails techniques)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const reqId = (req as any).reqId || `REQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  console.error(`[API ERROR ${reqId}]`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  const isProd = ENV.IS_PRODUCTION;

  res.status(statusCode).json({
    error: isProd
      ? 'Une erreur interne est survenue sur le serveur NOCIBÉ.'
      : err.message || 'Erreur interne du serveur',
    reqId,
    code: err.code || 'INTERNAL_ERROR',
  });
});

// Diagnostics au démarrage (développement)
async function verifyStartupServices() {
  if (ENV.IS_PRODUCTION) return;

  let dbOk = false;
  let migrationsOk = false;
  let smtpOk = false;
  let dbMsg = '';
  let migMsg = '';
  let smtpMsg = '';

  // 1. Connexion Base de Données
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (err: any) {
    dbMsg = err.message || 'inaccessible';
  }

  // 2. Vérification des migrations
  try {
    const applied: any[] = await prisma.$queryRaw`SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`;
    if (applied && applied.length > 0) {
      migrationsOk = true;
    } else {
      migMsg = 'Aucune migration enregistrée';
    }
  } catch (err: any) {
    migMsg = err.message || 'table de migrations absente';
  }

  // 3. Connexion SMTP
  const smtpCheck = await mailService.verifySmtp();
  smtpOk = smtpCheck.ok;
  smtpMsg = smtpCheck.error || '';

  const report = [
    dbOk ? 'DB OK' : `DB ÉCHEC (${dbMsg})`,
    migrationsOk ? 'Migrations OK' : `Migrations ÉCHEC (${migMsg})`,
    smtpOk ? 'SMTP OK' : `SMTP ÉCHEC (${smtpMsg})`,
  ];

  console.log(`🩺 Vérification au démarrage : ${report.join(' / ')}`);
}

app.listen(ENV.PORT, async () => {
  console.log(`🚀 Serveur NOCIBÉ API démarré sur http://localhost:${ENV.PORT}`);
  console.log(`📡 Base de données PostgreSQL : ${ENV.DATABASE_URL.replace(/:[^:]*@/, ':****@')}`);
  console.log(`🛡️ Origines CORS autorisées :`, ENV.ALLOWED_ORIGINS);
  await verifyStartupServices();
});
