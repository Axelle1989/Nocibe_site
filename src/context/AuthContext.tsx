import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { UserProfile, UserRole } from '../types/auth';
import { api } from '../lib/api';

const STORAGE_SESSION_KEY = 'nocibe_session_user_v2';

interface AuthState {
  user: {
    id: string;
    email: string;
    emailConfirmed: boolean;
  } | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  isApiConnected: boolean;
}

interface SignUpParams {
  email: string;
  password?: string;
  nom: string;
  prenom: string;
  telephone: string;
  entreprise?: string;
}

interface AuthContextType extends AuthState {
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (params: SignUpParams) => Promise<{ error: Error | null; needsEmailVerification: boolean }>;
  signOut: (scope?: 'local' | 'global') => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string, currentPassword?: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: (email?: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Profil de démonstration sécurisé pour initialisation
const DEFAULT_CLIENT_PROFILE: UserProfile = {
  id: 'usr-client-nocibe',
  nom: 'Bio',
  prenom: 'Armel',
  telephone: '+229 97 00 11 22',
  role: 'client',
  entreprise: 'BTP Bénin Constructions',
  is_active: true,
  email_verifie: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    isAdmin: false,
    isEmailVerified: false,
    isLoading: true,
    isApiConnected: true,
  });

  // Restauration de session sécurisée (via cookie httpOnly et /api/auth/me)
  useEffect(() => {
    async function initSession() {
      // 1. Pré-chargement rapide du profil mis en cache locale pour fluidité UI (hors token)
      try {
        const storedSession = localStorage.getItem(STORAGE_SESSION_KEY);
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.user && parsed.profile) {
            setState({
              user: parsed.user,
              profile: parsed.profile,
              role: parsed.profile?.role || 'client',
              isAdmin: parsed.profile?.role === 'admin',
              isEmailVerified: Boolean(parsed.user?.emailConfirmed),
              isLoading: false,
              isApiConnected: true,
            });
          }
        }
      } catch (e) {
        console.warn('Failed restoring cached profile', e);
      }

      // 2. Synchronisation authentifiée avec l'API backend via cookies httpOnly
      try {
        let meRes = await api.auth.getMe().catch(() => null);

        // Si getMe échoue (access token expiré), essayer un refresh
        if (!meRes || !meRes.user) {
          const refreshRes = await api.auth.refresh().catch(() => null);
          if (refreshRes && refreshRes.user) {
            meRes = await api.auth.getMe().catch(() => null);
          }
        }

        if (meRes && meRes.user) {
          const u = meRes.user;
          const role: UserRole = u.role === 'ADMIN' ? 'admin' : 'client';
          const prof: UserProfile = {
            id: u.id,
            nom: u.nom,
            prenom: u.prenom,
            telephone: u.telephone,
            entreprise: u.entreprise || '',
            role,
            is_active: u.isActive,
            email_verifie: u.emailVerifie,
            created_at: u.createdAt,
            updated_at: u.createdAt,
          };
          saveSession({ id: u.id, email: u.email, emailConfirmed: u.emailVerifie }, prof);
        } else {
          // Aucun jeton valide actif
          localStorage.removeItem(STORAGE_SESSION_KEY);
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            role: null,
            isAdmin: false,
            isEmailVerified: false,
          }));
        }
      } catch {
        // Mode déconnecté
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }

    initSession();
  }, []);

  const saveSession = (user: { id: string; email: string; emailConfirmed: boolean }, profile: UserProfile) => {
    const sessionData = { user, profile };
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    } catch {
      // Ignorer si stockage privé bloqué
    }
    setState({
      user,
      profile,
      role: profile.role,
      isAdmin: profile.role === 'admin',
      isEmailVerified: user.emailConfirmed,
      isLoading: false,
      isApiConnected: true,
    });
  };

  // Connexion par mot de passe
  const signInWithPassword = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (password.length < 10) {
      return { error: new Error('Le mot de passe doit comporter au moins 10 caractères.') };
    }

    try {
      const res = await api.auth.login(email, password);
      if (res.user) {
        const u = res.user;
        const role: UserRole = u.role === 'ADMIN' ? 'admin' : 'client';
        const profile: UserProfile = {
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
          telephone: u.telephone,
          entreprise: u.entreprise || '',
          role,
          is_active: true,
          email_verifie: u.emailVerifie,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        saveSession({ id: u.id, email: u.email, emailConfirmed: u.emailVerifie }, profile);
        return { error: null };
      }
    } catch (apiErr: any) {
      return { error: apiErr };
    }

    return { error: new Error('Identifiants de connexion invalides.') };
  };

  // Inscription
  const signUp = async (params: SignUpParams): Promise<{ error: Error | null; needsEmailVerification: boolean; emailSent?: boolean }> => {
    if (!params.password || params.password.length < 10) {
      return {
        error: new Error('Le mot de passe doit comporter au moins 10 caractères.'),
        needsEmailVerification: false,
      };
    }

    try {
      const res = await api.auth.register({
        email: params.email,
        password: params.password,
        nom: params.nom,
        prenom: params.prenom,
        telephone: params.telephone,
        entreprise: params.entreprise,
      });

      if (res.user) {
        const u = res.user;
        const profile: UserProfile = {
          id: u.id,
          nom: u.nom,
          prenom: u.prenom,
          telephone: u.telephone,
          entreprise: u.entreprise || '',
          role: 'client',
          is_active: true,
          email_verifie: Boolean(u.emailVerifie),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        saveSession({ id: u.id, email: u.email, emailConfirmed: Boolean(u.emailVerifie) }, profile);
        return { error: null, needsEmailVerification: !u.emailVerifie, emailSent: res.emailSent };
      }
    } catch (apiErr: any) {
      return { error: apiErr, needsEmailVerification: false };
    }

    return { error: new Error('Échec de la création du compte.'), needsEmailVerification: false };
  };

  // Déconnexion
  const signOut = async (_scope: 'local' | 'global' = 'local') => {
    try {
      await api.auth.logout();
    } catch {
      // Ignorer erreur réseau
    }
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // Ignorer
    }
    setState({
      user: null,
      profile: null,
      role: null,
      isAdmin: false,
      isEmailVerified: false,
      isLoading: false,
      isApiConnected: true,
    });
  };

  // Demande de réinitialisation de mot de passe
  const sendPasswordReset = async (email: string): Promise<{ error: Error | null }> => {
    try {
      await api.auth.forgotPassword(email);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Mise à jour de mot de passe
  const updatePassword = async (newPassword: string, currentPassword = ''): Promise<{ error: Error | null }> => {
    if (newPassword.length < 10) {
      return { error: new Error('Le nouveau mot de passe doit comporter au moins 10 caractères.') };
    }
    try {
      await api.auth.updatePassword(currentPassword, newPassword);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Renvoi d'email de confirmation
  const resendVerificationEmail = async (targetEmail?: string): Promise<{ error: Error | null }> => {
    const emailToSend = targetEmail || state.user?.email;
    if (!emailToSend) {
      return { error: new Error('Adresse e-mail requise pour le renvoi.') };
    }
    try {
      await api.auth.resendVerification(emailToSend);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Mise à jour du profil
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ error: Error | null }> => {
    try {
      const res = await api.auth.updateProfile(data);
      if (res.user && state.user) {
        const u = res.user;
        const updatedProfile: UserProfile = {
          ...state.profile!,
          nom: u.nom,
          prenom: u.prenom,
          telephone: u.telephone,
          entreprise: u.entreprise || '',
          updated_at: new Date().toISOString(),
        };
        saveSession(state.user, updatedProfile);
        return { error: null };
      }
    } catch (err: any) {
      return { error: err };
    }

    if (state.profile && state.user) {
      const updatedProfile = {
        ...state.profile,
        ...data,
        updated_at: new Date().toISOString(),
      };
      saveSession(state.user, updatedProfile);
      return { error: null };
    }
    return { error: new Error('Profil introuvable.') };
  };

  const contextValue = useMemo<AuthContextType>(() => ({
    ...state,
    signInWithPassword,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
    resendVerificationEmail,
    updateProfile,
  }), [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
