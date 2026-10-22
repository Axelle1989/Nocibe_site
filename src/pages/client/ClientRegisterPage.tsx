import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { EnvelopeSimple, Lock, User, Phone, Building, SpinnerGap } from '@phosphor-icons/react';

export const ClientRegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Jauge de robustesse (Faible / Moyen / Fort)
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200', textClass: 'text-slate-400' };

    const hasMinLen = pwd.length >= 10;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);

    const criteriaCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

    if (!hasMinLen || criteriaCount < 3) {
      return { score: 1, label: 'Faible', color: 'bg-rose-500', textClass: 'text-rose-600' };
    }
    if (criteriaCount === 3) {
      return { score: 2, label: 'Moyen', color: 'bg-amber-500', textClass: 'text-amber-600' };
    }
    return { score: 3, label: 'Fort', color: 'bg-emerald-500', textClass: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorCode(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};

    if (!nom.trim()) errors.nom = 'Le nom est obligatoire.';
    if (!prenom.trim()) errors.prenom = 'Le prénom est obligatoire.';
    if (!telephone.trim()) errors.telephone = 'Le numéro de téléphone est obligatoire.';
    if (!email.trim()) errors.email = 'L’adresse e-mail est obligatoire.';

    if (!password) {
      errors.password = 'Le mot de passe est obligatoire.';
    } else if (password.length < 10) {
      errors.password = 'Le mot de passe doit comporter au moins 10 caractères.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
      errors.password = 'Incluez au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 symbole.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Les deux mots de passe ne correspondent pas.';
    }

    if (!acceptedTerms) {
      errors.terms = 'Vous devez accepter les conditions générales de vente NOCIBÉ.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Normalisation du téléphone avec l'indicatif Bénin +229
    const cleanPhone = telephone.replace(/\s+/g, '');
    const fullPhone = cleanPhone.startsWith('+229') ? cleanPhone : `+229${cleanPhone}`;

    setLoading(true);
    const res = await signUp({
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: fullPhone,
      entreprise: entreprise.trim() || undefined,
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (res.error) {
      const err = res.error as any;
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setErrorCode(err.code || (err.status === 409 ? 'EMAIL_ALREADY_EXISTS' : null));
      setError(err.message || 'Une erreur est survenue lors de la création de votre compte.');
    } else {
      navigate('/espace-client/verifier-email', {
        state: {
          email: email.trim(),
          emailSent: res.emailSent ?? true,
        },
      });
    }
  };

  return (
    <AuthLayout
      title="Créer un compte client"
      subtitle="Accédez à vos tarifs usine et au suivi logistique Massé"
      maxWidth="lg"
      hasError={Boolean(error)}
    >
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium space-y-1.5"
        >
          <p>{error}</p>
          {errorCode === 'EMAIL_ALREADY_EXISTS' && (
            <div className="flex items-center gap-3 pt-1 text-xs">
              <Link to="/espace-client/connexion" className="font-bold text-[#0131FD] hover:underline">
                Se connecter &rarr;
              </Link>
              <span className="text-slate-300">|</span>
              <Link to="/espace-client/mot-de-passe-oublie" className="font-bold text-[#0131FD] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label htmlFor="reg-nom" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <input
                id="reg-nom"
                type="text"
                required
                autoComplete="family-name"
                value={nom}
                onChange={e => {
                  setNom(e.target.value);
                  if (fieldErrors.nom) setFieldErrors(prev => ({ ...prev, nom: '' }));
                }}
                placeholder="Votre nom"
                aria-invalid={Boolean(fieldErrors.nom)}
                className={`w-full min-h-[44px] pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm transition-colors focus:outline-hidden focus:ring-2 focus:bg-white ${
                  fieldErrors.nom ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-[#0131FD]'
                }`}
              />
            </div>
            {fieldErrors.nom && (
              <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.nom}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-prenom" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Prénom *
            </label>
            <input
              id="reg-prenom"
              type="text"
              required
              autoComplete="given-name"
              value={prenom}
              onChange={e => {
                setPrenom(e.target.value);
                if (fieldErrors.prenom) setFieldErrors(prev => ({ ...prev, prenom: '' }));
              }}
              placeholder="Votre prénom"
              aria-invalid={Boolean(fieldErrors.prenom)}
              className={`w-full min-h-[44px] px-3.5 py-2 bg-slate-50 border rounded-xl text-sm transition-colors focus:outline-hidden focus:ring-2 focus:bg-white ${
                fieldErrors.prenom ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-[#0131FD]'
              }`}
            />
            {fieldErrors.prenom && (
              <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.prenom}</p>
            )}
          </div>
        </div>

        {/* Téléphone & Entreprise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label htmlFor="reg-telephone" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Téléphone *
            </label>
            <div className="relative flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#0131FD] focus-within:border-transparent focus-within:bg-white transition-colors min-h-[44px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-[#0B1F3A] bg-slate-100 border-r border-slate-200 select-none">
                <Phone size={14} className="text-[#0131FD]" />
                <span>+229</span>
              </span>
              <input
                id="reg-telephone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel-national"
                value={telephone}
                onChange={e => {
                  setTelephone(e.target.value);
                  if (fieldErrors.telephone) setFieldErrors(prev => ({ ...prev, telephone: '' }));
                }}
                placeholder="97 00 11 22"
                aria-invalid={Boolean(fieldErrors.telephone)}
                className="w-full px-3 py-2 bg-transparent text-sm focus:outline-hidden"
              />
            </div>
            {fieldErrors.telephone && (
              <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.telephone}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-entreprise" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Entreprise (Optionnel)
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <input
                id="reg-entreprise"
                type="text"
                autoComplete="organization"
                value={entreprise}
                onChange={e => setEntreprise(e.target.value)}
                placeholder="Nom de votre entreprise"
                className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0131FD] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Adresse e-mail professionnelle *
          </label>
          <div className="relative">
            <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="vous@entreprise.bj"
              aria-invalid={Boolean(fieldErrors.email)}
              className={`w-full min-h-[44px] pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-sm transition-colors focus:outline-hidden focus:ring-2 focus:bg-white ${
                fieldErrors.email ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-[#0131FD]'
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Mot de passe et confirmation (côte à côte) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Mot de passe *
            </label>
            <PasswordInput
              id="reg-password"
              required
              autoComplete="new-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
              }}
              placeholder="10 caractères min."
              error={fieldErrors.password}
              leftIcon={<Lock size={16} />}
            />

            {/* Jauge fine et compacte de robustesse du mot de passe */}
            {password.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-slate-500">Robustesse :</span>
                  <span className={strength.textClass}>{strength.label}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3].map(seg => (
                    <div
                      key={seg}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        seg <= strength.score ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Confirmation *
            </label>
            <PasswordInput
              id="reg-confirm"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Répétez le mot de passe"
              error={fieldErrors.confirmPassword}
              leftIcon={<Lock size={16} />}
            />
          </div>
        </div>

        {/* Case Conditions Générales */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={e => {
                setAcceptedTerms(e.target.checked);
                if (fieldErrors.terms) setFieldErrors(prev => ({ ...prev, terms: '' }));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0131FD] focus:ring-[#0131FD] shrink-0"
            />
            <span>
              J’accepte les{' '}
              <Link to="/mentions-legales" target="_blank" className="text-[#0131FD] font-semibold hover:underline">
                conditions générales
              </Link>{' '}
              et la politique de confidentialité de NOCIBÉ.
            </span>
          </label>
          {fieldErrors.terms && (
            <p role="alert" className="text-xs font-semibold text-rose-600 mt-1">{fieldErrors.terms}</p>
          )}
        </div>

        {/* Bouton de validation */}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] bg-[#0131FD] hover:bg-[#0026C7] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-[#0131FD]/20 transition-all flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
        >
          {loading ? (
            <>
              <SpinnerGap size={18} className="animate-spin" />
              <span>Création de votre compte...</span>
            </>
          ) : (
            <span>Créer mon compte client</span>
          )}
        </button>
      </form>

      {/* Lien Connexion */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Vous possédez déjà un compte ?{' '}
          <Link to="/espace-client/connexion" className="text-[#0131FD] font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
