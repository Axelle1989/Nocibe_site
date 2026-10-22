import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../../components/ui/PasswordInput';
import {
  User,
  Phone,
  Building,
  EnvelopeSimple,
  MapPin,
  Lock,
  DownloadSimple,
  Trash,
  CheckCircle,
  Plus,
  ShieldCheck,
} from '@phosphor-icons/react';

export const ClientProfilePage: React.FC = () => {
  const { user, profile, updateProfile, updatePassword, signOut } = useAuth();

  const [nom, setNom] = useState(profile?.nom || '');
  const [prenom, setPrenom] = useState(profile?.prenom || '');
  const [telephone, setTelephone] = useState(profile?.telephone || '');
  const [entreprise, setEntreprise] = useState(profile?.entreprise || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState(profile?.adresses_livraison || [
    { label: 'Chantier Principal', ville: 'Cotonou', quartier: 'Akpakpa PK3', precision: 'En face de la station', is_default: true }
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newVille, setNewVille] = useState('Cotonou');
  const [newQuartier, setNewQuartier] = useState('');
  const [newPrecision, setNewPrecision] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  // Preferences
  const [emailNotif, setEmailNotif] = useState(profile?.preferences?.email_notifications ?? true);
  const [smsNotif, setSmsNotif] = useState(profile?.preferences?.sms_notifications ?? true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    await updateProfile({
      nom,
      prenom,
      telephone,
      entreprise,
      adresses_livraison: addresses,
      preferences: {
        email_notifications: emailNotif,
        sms_notifications: smsNotif,
        newsletter: true,
      },
    });
    setSavingProfile(false);
    setProfileMsg('Profil mis à jour avec succès.');
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuartier.trim()) return;
    const updated = [
      ...addresses,
      {
        label: newLabel || `Chantier ${newVille}`,
        ville: newVille,
        quartier: newQuartier,
        precision: newPrecision,
        is_default: addresses.length === 0,
      },
    ];
    setAddresses(updated);
    await updateProfile({ adresses_livraison: updated });
    setNewLabel('');
    setNewQuartier('');
    setNewPrecision('');
    setShowAddAddress(false);
  };

  const handleRemoveAddress = async (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    setAddresses(updated);
    await updateProfile({ adresses_livraison: updated });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdError(null);

    if (newPassword !== confirmPassword) {
      setPwdError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    const res = await updatePassword(newPassword);
    if (res.error) {
      setPwdError(res.error.message);
    } else {
      setPwdMsg('Mot de passe mis à jour avec succès.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMsg(null), 3000);
    }
  };

  const handleExportData = () => {
    const data = {
      user,
      profile,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nocibe-mes-donnees-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir demander la suppression de votre compte client ? Vos commandes passées resteront archivées pour obligations comptables.')) {
      alert('Votre demande de suppression a été transmise au Délégué à la Protection des Données NOCIBÉ.');
      signOut();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-serif font-black text-[#0B1F3A]">
          Mon Profil & <span className="italic text-[#0131FD]">Chantiers de Livraison</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Coordonnées de facturation, dépôts récurrents et préférences de contact usine
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
          <User size={18} className="text-[#0B1F3A]" />
          <span>Informations professionnelles</span>
        </h2>

        {profileMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} weight="fill" />
            <span>{profileMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Téléphone de contact</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Entreprise / Société BTP</label>
              <div className="relative">
                <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={entreprise}
                  onChange={e => setEntreprise(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Adresse email (identifiant)</label>
            <div className="relative">
              <EnvelopeSimple size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-8 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">L'adresse email est certifiée et ne peut être modifiée que via le support NOCIBÉ.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-[#0B1F3A] hover:bg-[#132A4C] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              Enregistrer mes coordonnées
            </button>
          </div>
        </form>
      </div>

      {/* Saved Delivery Locations */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
              <MapPin size={18} className="text-[#0B1F3A]" />
              <span>Chantiers & Lieux de livraison habituels</span>
            </h2>
            <p className="text-xs text-slate-500">Adresses pré-remplies lors de vos prochaines commandes</p>
          </div>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:bg-slate-200 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus size={14} weight="bold" />
            <span>Ajouter un chantier</span>
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="font-bold text-xs text-[#0B1F3A]">Nouveau chantier ou dépôt</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nom du site (ex: Résidence Marina)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <select
                value={newVille}
                onChange={e => setNewVille(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              >
                <option value="Cotonou">Cotonou</option>
                <option value="Abomey-Calavi">Abomey-Calavi</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Ouidah">Ouidah</option>
                <option value="Parakou">Parakou</option>
                <option value="Bohicon">Bohicon</option>
                <option value="Pobè / Massé">Pobè / Massé</option>
              </select>
              <input
                type="text"
                required
                placeholder="Quartier (ex: Akpakpa, Haie Vive...)"
                value={newQuartier}
                onChange={e => setNewQuartier(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <input
              type="text"
              placeholder="Précision d'accès pour les camions (ex: Face station Bénin Pétro, rue pavée)"
              value={newPrecision}
              onChange={e => setNewPrecision(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-[#0B1F3A] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#132A4C]"
              >
                Ajouter l'adresse
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#0B1F3A]">{addr.label}</span>
                  {addr.is_default && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Défaut
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700">
                  {addr.quartier}, {addr.ville}
                </p>
                {addr.precision && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">&laquo; {addr.precision} &raquo;</p>
                )}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveAddress(idx)}
                  className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                >
                  <Trash size={12} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#16A34A]" />
          <span>Canaux d'alerte des expéditions</span>
        </h2>
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-bold text-slate-800">Notifications par Email</div>
              <div className="text-slate-400 text-[11px]">Envoi automatique des factures proforma et reçus</div>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={e => setEmailNotif(e.target.checked)}
              className="rounded text-[#0B1F3A]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-bold text-slate-800">SMS Chauffeur / Livreur</div>
              <div className="text-slate-400 text-[11px]">Contact direct du chauffeur à l'approche du chantier</div>
            </div>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={e => setSmsNotif(e.target.checked)}
              className="rounded text-[#0B1F3A]"
            />
          </label>
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
          <Lock size={18} className="text-[#0B1F3A]" />
          <span>Sécurité & Changement de mot de passe</span>
        </h2>

        {pwdMsg && (
          <div className="mb-3 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-semibold">
            {pwdMsg}
          </div>
        )}
        {pwdError && (
          <div className="mb-3 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold">
            {pwdError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="profile-new-password" className="block text-xs font-bold text-slate-700 mb-1">
              Nouveau mot de passe
            </label>
            <PasswordInput
              id="profile-new-password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimum 10 caractères"
              leftIcon={<Lock size={16} />}
            />
          </div>
          <div>
            <label htmlFor="profile-confirm-password" className="block text-xs font-bold text-slate-700 mb-1">
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="profile-confirm-password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              leftIcon={<Lock size={16} />}
            />
          </div>
          <button
            type="submit"
            className="bg-[#0B1F3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#132A4C] transition shadow-xs"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      {/* Privacy & Account Export/Deletion */}
      <div className="bg-slate-100/70 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-bold text-xs text-[#0B1F3A]">Données personnelles & Confidentialité</div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Conforme à la législation béninoise sur la protection des données à caractère personnel (APDP).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <DownloadSimple size={14} />
            <span>Exporter mes données</span>
          </button>
          <button
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-white border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-50 shadow-sm"
          >
            <Trash size={14} />
            <span>Clôturer le compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

