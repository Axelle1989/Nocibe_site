import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { EnvelopeOpen, ArrowCounterClockwise, CheckCircle, ShieldCheck } from '@phosphor-icons/react';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  const start = local.slice(0, 2);
  const end = local.slice(-1);
  return `${start}****${end}@${domain}`;
}

export const ClientVerifyEmailPage: React.FC = () => {
  const { user, resendVerificationEmail, isEmailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as { email?: string; emailSent?: boolean } | null;
  const emailFromState = stateData?.email;
  const emailSentInitial = stateData?.emailSent;
  const rawEmail = emailFromState || user?.email || 'votre.email@domaine.bj';
  const masked = maskEmail(rawEmail);

  const [cooldown, setCooldown] = useState(0);
  const [sentMessage, setSentMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    emailSentInitial === false ? "Compte créé, mais l'e-mail de vérification n'a pas pu être envoyé automatiquement." : null
  );

  useEffect(() => {
    if (isEmailVerified) {
      navigate('/espace-client', { replace: true });
    }
  }, [isEmailVerified, navigate]);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setErrorMessage(null);
    const res = await resendVerificationEmail(rawEmail);
    if (res.error) {
      setErrorMessage(res.error.message);
    } else {
      setSentMessage(true);
      setCooldown(60);
    }
  };

  return (
    <AuthLayout
      title="Vérifiez votre boîte mail"
      subtitle="Finalisez l'activation de votre compte client NOCIBÉ"
      maxWidth="md"
      hasError={Boolean(errorMessage)}
    >
      <div className="space-y-4">
        <div className="w-14 h-14 bg-[#0131FD]/10 text-[#0131FD] rounded-2xl flex items-center justify-center mx-auto border border-[#0131FD]/20">
          <EnvelopeOpen size={32} weight="duotone" />
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            Un e-mail contenant un lien sécurisé a été transmis à l'adresse suivante :
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-bold text-[#0B1F3A] mt-2 inline-block select-all">
            {masked}
          </div>
        </div>

        {/* Message d'erreur ou d'échec d'envoi */}
        {errorMessage && (
          <div role="alert" className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Confirmation de réexpédition */}
        {sentMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle size={16} weight="fill" />
            <span>Nouvel email envoyé ! Vérifiez également vos courriers indésirables.</span>
          </div>
        )}

        {/* Encadré d'information sécurité */}
        <div className="text-left bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5 text-xs">
            <ShieldCheck size={16} className="text-[#0131FD]" />
            <span>Sécurité de vos opérations industrielles</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            La confirmation de votre adresse garantit la confidentialité de vos factures proforma et autorisations de chargement à l'usine de Massé.
          </p>
        </div>

        {/* Bouton de renvoi avec compte à rebours */}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="w-full min-h-[44px] bg-[#0B1F3A] hover:bg-[#132A4C] text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-[#0B1F3A]/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
        >
          <ArrowCounterClockwise size={16} className={cooldown > 0 ? 'animate-spin' : ''} />
          <span>
            {cooldown > 0
              ? `Renvoyer l'e-mail (${cooldown}s)`
              : "Renvoyer l'e-mail de confirmation"}
          </span>
        </button>

        {/* Liens de bas de carte : Changer d'adresse & Connexion */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <Link
            to="/espace-client/inscription"
            className="text-[#0131FD] hover:underline"
          >
            Changer d'adresse
          </Link>
          <Link
            to="/espace-client/connexion"
            className="hover:text-slate-800"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
