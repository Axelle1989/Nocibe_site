import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Lock, SpinnerGap, CheckCircle, ShieldCheck } from '@phosphor-icons/react';

export const ClientResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!password) {
      errors.password = 'Veuillez saisir votre nouveau mot de passe.';
    } else if (password.length < 10) {
      errors.password = 'Le mot de passe doit comporter au moins 10 caractères.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      if (token) {
        await api.auth.resetPassword(token, password);
        setSuccess(true);
        setTimeout(() => navigate('/espace-client/connexion'), 2500);
      } else {
        const res = await updatePassword(password);
        if (res.error) {
          setError(res.error.message);
        } else {
          setSuccess(true);
          setTimeout(() => navigate('/espace-client/profil'), 2500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Le lien de réinitialisation est invalide ou a expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Nouveau mot de passe"
      subtitle="Définissez un mot de passe sécurisé pour votre espace client"
      maxWidth="md"
      hasError={Boolean(error)}
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle size={32} weight="fill" />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#0B1F3A]">Mot de passe mis à jour !</h2>
            <p className="text-xs text-slate-500 mt-1">
              Votre nouveau mot de passe est actif. Redirection automatique vers la connexion...
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/espace-client/connexion"
              className="inline-flex items-center justify-center w-full min-h-[44px] bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Se connecter maintenant
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reset-password" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nouveau mot de passe (10 car. min) *
            </label>
            <PasswordInput
              id="reset-password"
              required
              autoComplete="new-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="Votre nouveau mot de passe"
              error={fieldErrors.password}
              leftIcon={<Lock size={18} />}
            />
          </div>

          <div>
            <label htmlFor="reset-confirm" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Confirmez le nouveau mot de passe *
            </label>
            <PasswordInput
              id="reset-confirm"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Répétez le mot de passe"
              error={fieldErrors.confirmPassword}
              leftIcon={<Lock size={18} />}
            />
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-xs text-slate-700 flex items-start gap-2">
            <ShieldCheck size={18} className="text-[#0131FD] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Pour une sécurité maximale, incluez au moins une majuscule, une minuscule, un chiffre et un caractère spécial.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] bg-[#0131FD] hover:bg-[#0026C7] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-[#0131FD]/20 transition-all flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
          >
            {loading ? (
              <>
                <SpinnerGap size={18} className="animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer le mot de passe</span>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/espace-client/connexion"
              className="text-xs text-[#0131FD] hover:underline font-bold"
            >
              &larr; Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
