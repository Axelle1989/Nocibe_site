import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  nom: string;
  prenom: string;
  emailVerifie: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | null = null;

  // 1. Priorité au cookie httpOnly sécurisé
  if (req.cookies && req.cookies.nocibe_access_token) {
    token = req.cookies.nocibe_access_token;
  }

  // 2. Repli sur le header Authorization: Bearer <token>
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Accès non autorisé : Session requise.' });
    return;
  }

  try {
    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as {
      id: string;
      email: string;
      role: 'CLIENT' | 'ADMIN';
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        nom: true,
        prenom: true,
        isActive: true,
        emailVerifie: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Compte inactif ou introuvable.' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
      emailVerifie: user.emailVerifie,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Session expirée ou invalide.' });
  }
};

export const requireAuth = authenticateToken;

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Accès réservé à la direction et administration NOCIBÉ.' });
    return;
  }
  next();
};

export const requireVerified = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentification requise.' });
    return;
  }

  if (!req.user.emailVerifie && req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: 'Veuillez confirmer votre adresse email pour effectuer cette opération.',
      code: 'EMAIL_NOT_VERIFIED',
    });
    return;
  }

  next();
};
