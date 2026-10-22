import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SpinnerGap } from '@phosphor-icons/react';

interface GuardProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<GuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <SpinnerGap className="w-8 h-8 text-[#0B1F3A] animate-spin" />
        <p className="text-sm text-slate-500">Chargement de votre session sécurisée...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/espace-client/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const RequireVerifiedUser: React.FC<GuardProps> = ({ children }) => {
  const { user, isEmailVerified, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <SpinnerGap className="w-8 h-8 text-[#0B1F3A] animate-spin" />
        <p className="text-sm text-slate-500">Vérification de l'accès client...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/espace-client/connexion" state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/espace-client/verifier-email" replace />;
  }

  return <>{children}</>;
};

export const RequireAdmin: React.FC<GuardProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <SpinnerGap className="w-8 h-8 text-[#0B1F3A] animate-spin" />
        <p className="text-sm text-slate-500">Vérification des autorisations administrateur...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/connexion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

