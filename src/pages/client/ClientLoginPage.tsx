import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { EnvelopeSimple, Lock, SpinnerGap, ArrowCounterClockwise } from '@phosphor-icons/react';

export const ClientLoginPage: React.FC = () => {
  const { signInWithPassword, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/espace-client';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendConfirm = async () => {
    if (!email || resendCooldown > 0) return;
    setResendCooldown(60);
    const res = await resendVerificationEmail(email);
    if (!res.error) {
      setResendSuccess(true);
    }
  };

  React.useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsEmailUnconfirmed(false);
    setResendSuccess(false);

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Veuillez renseigner votre adresse e-mail.';
    }
    if (!password) {
      errors.password = 'Veuillez saisir votre mot de passe.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const res = await signInWithPassword(email.trim(), password);
    setLoading(false);

    if (res.error) {
      if (res.error.message.startsWith('EMAIL_NOT_CONFIRMED:')) {
        setIsEmailUnconfirmed(true);
        setError('Veuillez confirmer votre adresse e-mail via le lien reçu avant de vous connecter.');
      } else if (res.error.message.includes('bloqué') || res.error.message.includes('tentatives')) {
        setError(res.error.message);
      } else {
        // Message générique de sécurité : ne jamais révéler si l'email existe en base
        setError('Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.');
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à vos commandes, factures et tarifs usine dédiés"
      maxWidth="md"
      hasError={Boolean(error)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium space-y-2"
          >
            <div>{error}</div>
            {isEmailUnconfirmed && (
              <div>
                <button
                  type="button"
                  onClick={handleResendConfirm}
                  disabled={resendCooldown > 0}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:underline bg-white px-2.5 py-1 rounded-md border border-slate-300"
                >
                  <ArrowCounterClockwise size={13} className={resendCooldown > 0 ? 'animate-spin' : ''} />
                  <span>{resendCooldown > 0 ? `Patientez ${resendCooldown}s` : "Renvoyer l'email de confirmation"}</span>
                </button>
                {resendSuccess && (
                  <p className="text-emerald-700 font-semibold text-[11px] mt-1">
                    Email de confirmation réexpédié. Vérifiez vos courriers indésirables.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Adresse email */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Adresse e-mail
          </label>
          <div className="relative">
            <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
              }}
              placeholder="vous@entreprise.bj"
              aria-invalid={Boolean(fieldErrors.email)}
              className={`w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-colors focus:outline-hidden focus:ring-2 focus:bg-white ${
                fieldErrors.email ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-[#0131FD]'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mot de passe
            </label>
            <Link
              to="/espace-client/mot-de-passe-oublie"
              className="text-xs text-[#0131FD] hover:underline font-semibold"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <PasswordInput
            id="login-password"
            required
            autoComplete="current-password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
            }}
            placeholder="Votre mot de passe"
            error={fieldErrors.password}
            leftIcon={<Lock size={18} />}
          />
        </div>

        {/* Bouton principal de connexion */}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] bg-[#0B1F3A] hover:bg-[#132A4C] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-[#0B1F3A]/20 transition-all flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
        >
          {loading ? (
            <>
              <SpinnerGap size={18} className="animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <span>Se connecter</span>
          )}
        </button>
      </form>

      {/* Séparateur & Lien Inscription */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Nouveau client BTP ou distributeur agréé ?{' '}
          <Link to="/espace-client/inscription" className="text-[#0131FD] font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
