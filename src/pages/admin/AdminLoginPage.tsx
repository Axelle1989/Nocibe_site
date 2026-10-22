import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { ShieldCheck, Lock, EnvelopeSimple, SpinnerGap, ArrowLeft } from '@phosphor-icons/react';

export const AdminLoginPage: React.FC = () => {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError('Le mot de passe administrateur doit comporter au moins 10 caractères.');
      return;
    }

    setLoading(true);
    const res = await signInWithPassword(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#07142A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="text-[#0131FD]" />
          <span>Retour au site vitrine NOCIBÉ</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-[#0B1F3A] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#1E3A5F]">
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <Logo variant="auth" className="[&_span]:text-white" />
          </div>
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
            <ShieldCheck size={26} weight="duotone" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Console d'Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Réservé aux équipes de direction, expéditions et logistique NOCIBÉ
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Identifiant Administrateur
            </label>
            <div className="relative">
              <EnvelopeSimple className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@nocibe.bj"
                className="w-full pl-10 pr-4 py-2.5 bg-[#132A4C] border border-[#1E3A5F] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <PasswordInput
              id="admin-password"
              variant="dark"
              required
              minLength={10}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 10 caractères"
              autoComplete="current-password"
              leftIcon={<Lock className="text-slate-400" size={18} />}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0131FD] hover:bg-[#0026c7] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <SpinnerGap size={18} className="animate-spin" />
                <span>Connexion sécurisée...</span>
              </>
            ) : (
              <span>Entrer dans la console d'administration</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
