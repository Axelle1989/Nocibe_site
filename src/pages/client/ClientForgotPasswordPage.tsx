import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { EnvelopeSimple, SpinnerGap, CheckCircle, Key } from '@phosphor-icons/react';

export const ClientForgotPasswordPage: React.FC = () => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    const res = await sendPasswordReset(email.trim());
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <AuthLayout
      title="Mot de passe oublié ?"
      subtitle="Recevez un lien de réinitialisation sécurisé par e-mail"
      maxWidth="md"
      hasError={Boolean(error)}
    >
      {sent ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle size={32} weight="fill" />
          </div>

          <div>
            <h2 className="text-base font-bold text-[#0B1F3A]">Vérifiez votre boîte mail</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
              Si un compte est associé à <strong className="text-slate-800 select-all">{email}</strong>, un lien valable 1 heure vient de vous être envoyé.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/espace-client/connexion"
              className="inline-flex items-center justify-center w-full min-h-[44px] bg-[#0B1F3A] hover:bg-[#132A4C] text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Retour à la page de connexion
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
            <label htmlFor="forgot-email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Adresse e-mail de votre compte
            </label>
            <div className="relative">
              <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@entreprise.bj"
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0131FD] focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] bg-[#0B1F3A] hover:bg-[#132A4C] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-[#0B1F3A]/20 transition-all flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
          >
            {loading ? (
              <>
                <SpinnerGap size={18} className="animate-spin" />
                <span>Envoi du lien en cours...</span>
              </>
            ) : (
              <span className="flex items-center gap-2">
                <Key size={16} weight="bold" />
                <span>Envoyer le lien de réinitialisation</span>
              </span>
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
