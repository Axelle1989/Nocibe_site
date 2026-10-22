import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { SectionHeader } from '../../components/ui/SectionHeader';
import {
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileArrowUp,
  ShieldCheck,
  CheckCircle,
  Warning,
  Sparkle,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
} from '@phosphor-icons/react';

const DRAFT_KEY = 'nocibe_career_draft_v1';

export const ApplyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedOffreId = searchParams.get('offre') || '';
  const preselectedType = searchParams.get('type') || '';
  const preselectedSlug = searchParams.get('slug') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [offersList, setOffersList] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    pays: 'Bénin',
    typeCandidature: preselectedType || (preselectedOffreId ? 'OFFRE' : 'SPONTANEE'),
    jobOfferId: preselectedOffreId || '',
    secteurInteret: 'Production',
    niveauEtudes: 'Bac+5 / Ingénieur',
    diplome: '',
    anneesExperience: '1-3 ans',
    disponibilite: 'Immédiate',
    pretentionsSalariales: '',
    messageMotivation: '',
    consentementRgpd: false,
    websiteUrlHoneypot: '', // Honeypot
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [lettreFile, setLettreFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ reference: string; message: string } | null>(null);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const lettreInputRef = useRef<HTMLInputElement>(null);

  // Load existing draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          // Do not override if URL param exists
          typeCandidature: preselectedType || (preselectedOffreId ? 'OFFRE' : parsed.typeCandidature || prev.typeCandidature),
          jobOfferId: preselectedOffreId || parsed.jobOfferId || '',
        }));
      }
    } catch {
      // Ignorer
    }
  }, [preselectedOffreId, preselectedType]);

  // Save draft on change
  useEffect(() => {
    try {
      const { websiteUrlHoneypot, consentementRgpd, ...toSave } = formData;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
    } catch {
      // Ignorer
    }
  }, [formData]);

  // Load available offers for dropdown
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.careers.getOffers();
        if (res?.offers) {
          setOffersList(res.offers);
        }
      } catch (err) {
        console.error('Erreur chargement liste des offres:', err);
      }
    };
    fetchOffers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Le fichier CV dépasse la taille maximale autorisée (5 Mo).');
        return;
      }
      setCvFile(file);
      setErrorMsg(null);
    }
  };

  const handleLettreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('La lettre de motivation dépasse la taille maximale autorisée (5 Mo).');
        return;
      }
      setLettreFile(file);
      setErrorMsg(null);
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.prenom.trim() || !formData.nom.trim() || !formData.email.trim() || !formData.telephone.trim()) {
        setErrorMsg('Veuillez renseigner tous les champs obligatoires (Prénom, Nom, Email, Téléphone).');
        return false;
      }
      if (!formData.email.includes('@')) {
        setErrorMsg('Veuillez entrer une adresse email valide.');
        return false;
      }
    } else if (step === 2) {
      if (formData.typeCandidature === 'OFFRE' && !formData.jobOfferId) {
        setErrorMsg('Veuillez sélectionner l\'offre d\'emploi à laquelle vous postulez.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.diplome.trim()) {
        setErrorMsg('Veuillez préciser votre diplôme principal ou domaine d\'études.');
        return false;
      }
    } else if (step === 4) {
      if (!cvFile) {
        setErrorMsg('Veuillez joindre votre Curriculum Vitae (CV obligatoire, format PDF ou Word).');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot check
    if (formData.websiteUrlHoneypot) {
      // Bot detected silently
      setSuccessResult({
        reference: 'NOC-REC-2026-0000',
        message: 'Votre candidature a été reçue avec succès.',
      });
      return;
    }

    if (!formData.consentementRgpd) {
      setErrorMsg('Veuillez accepter le traitement de vos données personnelles pour finaliser l\'envoi.');
      return;
    }

    if (!cvFile) {
      setErrorMsg('Le CV est obligatoire.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const data = new FormData();
      data.append('prenom', formData.prenom);
      data.append('nom', formData.nom);
      data.append('email', formData.email);
      data.append('telephone', formData.telephone);
      data.append('ville', formData.ville || 'Non précisé');
      data.append('pays', formData.pays);
      data.append('typeCandidature', formData.typeCandidature);
      if (formData.jobOfferId) {
        data.append('jobOfferId', formData.jobOfferId);
      }
      data.append('secteurInteret', formData.secteurInteret);
      data.append('niveauEtudes', formData.niveauEtudes);
      data.append('diplome', formData.diplome);
      data.append('anneesExperience', formData.anneesExperience);
      data.append('disponibilite', formData.disponibilite);
      data.append('pretentionsSalariales', formData.pretentionsSalariales);
      data.append('messageMotivation', formData.messageMotivation);
      data.append('cv', cvFile);
      if (lettreFile) {
        data.append('lettre', lettreFile);
      }

      const res = await api.careers.submitApplication(data);

      if (res?.reference) {
        setSuccessResult({
          reference: res.reference,
          message: res.message || 'Candidature enregistrée avec succès.',
        });
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (err: any) {
      console.error('Erreur soumission candidature:', err);
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'envoi de votre candidature. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (successResult) {
    return (
      <div className="w-full bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle size={40} weight="fill" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0131FD]">
              Dossier reçu avec succès
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#07142A] mt-3">
              Merci, votre candidature est enregistrée !
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Un email de confirmation vous a été envoyé. Notre service des ressources humaines examinera vos compétences avec la plus grande attention.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Numéro de référence :</span>
              <span className="font-mono font-bold text-[#0131FD]">{successResult.reference}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Délai indicatif d'évaluation :</span>
              <span className="font-bold text-[#07142A]">15 jours ouvrés</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Statut initial :</span>
              <span className="font-semibold text-emerald-700">En cours d'examen préliminaire</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/carrieres/offres"
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              Consulter d'autres offres
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition shadow-sm"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <SectionHeader
            eyebrow="Espace Recrutement & Talents"
            titleBeforeItalic="Formulaire de"
            italicWord="candidature"
            titleAfterItalic="en ligne"
            subtitle="Renseignez vos coordonnées et transmettez votre CV en toute simplicité. Sauvegarde automatique en cours de saisie."
          />
        </div>

        {/* PROGRESS STEPPER */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { num: 1, label: 'Identité' },
              { num: 2, label: 'Candidature' },
              { num: 3, label: 'Parcours' },
              { num: 4, label: 'Documents' },
              { num: 5, label: 'Validation' },
            ].map((st) => (
              <div key={st.num} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep === st.num
                      ? 'bg-[#0131FD] text-white ring-4 ring-blue-100'
                      : currentStep > st.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > st.num ? <CheckCircle size={14} weight="bold" /> : st.num}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-1 hidden sm:block">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {/* Honeypot field anti-bot (invisible) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="websiteUrlHoneypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.websiteUrlHoneypot}
              onChange={handleInputChange}
            />
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Warning size={16} weight="bold" className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ÉTAPE 1 : IDENTITÉ & CONTACT */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#07142A]">Étape 1 : Vos coordonnées</h3>
                <p className="text-xs text-slate-500">Ces informations nous permettront de vous contacter pour la suite du processus.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Ex: Jean-Luc"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de famille <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Ex: Dossou"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: jean.dossou@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone (avec indicatif) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="Ex: +229 97 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ville de résidence</label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    placeholder="Ex: Cotonou, Pobè, Porto-Novo..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pays</label>
                  <select
                    name="pays"
                    value={formData.pays}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  >
                    <option value="Bénin">Bénin</option>
                    <option value="Togo">Togo</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Niger">Niger</option>
                    <option value="Autre pays">Autre pays</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : TYPE DE CANDIDATURE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#07142A]">Étape 2 : Type de candidature</h3>
                <p className="text-xs text-slate-500">Précisez le cadre de votre démarche auprès de NOCIBÉ.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Vous postulez pour :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { val: 'OFFRE', label: 'Réponse à une offre d\'emploi' },
                    { val: 'STAGE_ACADEMIQUE', label: 'Stage académique / PFE' },
                    { val: 'STAGE_PROFESSIONNEL', label: 'Stage professionnel tremplin' },
                    { val: 'SPONTANEE', label: 'Candidature spontanée / Vivier' },
                  ].map((t) => (
                    <label
                      key={t.val}
                      className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 cursor-pointer transition ${
                        formData.typeCandidature === t.val
                          ? 'border-[#0131FD] bg-blue-50/50 text-[#0131FD]'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="typeCandidature"
                        value={t.val}
                        checked={formData.typeCandidature === t.val}
                        onChange={handleInputChange}
                        className="text-[#0131FD] focus:ring-[#0131FD]"
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.typeCandidature === 'OFFRE' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sélectionnez l'offre ciblée <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobOfferId"
                    value={formData.jobOfferId}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  >
                    <option value="">-- Choisir une offre --</option>
                    {offersList.map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.titre} ({off.departement} - {off.lieu})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secteur ou département de prédilection
                </label>
                <select
                  name="secteurInteret"
                  value={formData.secteurInteret}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                >
                  <option value="Production">Production, Cuisson & Broyage</option>
                  <option value="Carrière">Carrière & Extraction calcaire</option>
                  <option value="Maintenance">Maintenance Mécanique & Électrique</option>
                  <option value="Qualité">Qualité, R&D & Laboratoire d'essais</option>
                  <option value="QHSE">QHSE (Sécurité, Hygiène, Environnement)</option>
                  <option value="Logistique">Supply Chain, Expéditions & Transports</option>
                  <option value="Commercial">Commercial, Ventes & Prescription BTP</option>
                  <option value="Support">Finance, Comptabilité, RH & Juridique</option>
                  <option value="Informatique">Systèmes d'Information & Réseaux</option>
                </select>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : PARCOURS & EXPÉRIENCE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#07142A]">Étape 3 : Votre profil & parcours</h3>
                <p className="text-xs text-slate-500">Précisez vos compétences académiques et professionnelles.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Niveau d'études le plus élevé</label>
                  <select
                    name="niveauEtudes"
                    value={formData.niveauEtudes}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  >
                    <option value="Baccalauréat / CAP / BEPC">Baccalauréat / CAP / BEPC</option>
                    <option value="Bac+2 / BTS / DUT">Bac+2 / BTS / DUT</option>
                    <option value="Bac+3 / Licence / Bachelor">Bac+3 / Licence / Bachelor</option>
                    <option value="Bac+5 / Ingénieur / Master">Bac+5 / Ingénieur / Master</option>
                    <option value="Doctorat / PhD">Doctorat / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Années d'expérience professionnelle</label>
                  <select
                    name="anneesExperience"
                    value={formData.anneesExperience}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  >
                    <option value="Débutant / Étudiant">Débutant / Étudiant (0 an)</option>
                    <option value="Moins d'un an">Moins d'un an</option>
                    <option value="1-3 ans">1 à 3 ans</option>
                    <option value="3-5 ans">3 à 5 ans</option>
                    <option value="5-10 ans">5 à 10 ans</option>
                    <option value="Plus de 10 ans">Plus de 10 ans</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Intitulé exact du diplôme ou spécialité <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="diplome"
                  required
                  value={formData.diplome}
                  onChange={handleInputChange}
                  placeholder="Ex: Ingénieur Génie Civil (EPAC) ou BTS Électromécanique"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Disponibilité</label>
                  <select
                    name="disponibilite"
                    value={formData.disponibilite}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  >
                    <option value="Immédiate">Immédiate</option>
                    <option value="1 mois de préavis">1 mois de préavis</option>
                    <option value="2 mois de préavis">2 mois de préavis</option>
                    <option value="3 mois de préavis">3 mois de préavis</option>
                    <option value="À convenir">À convenir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prétentions salariales mensuelles (FCFA, optionnel)</label>
                  <input
                    type="text"
                    name="pretentionsSalariales"
                    value={formData.pretentionsSalariales}
                    onChange={handleInputChange}
                    placeholder="Ex: 350 000 FCFA net"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message ou résumé de motivation</label>
                <textarea
                  name="messageMotivation"
                  rows={3}
                  value={formData.messageMotivation}
                  onChange={handleInputChange}
                  placeholder="Présentez en quelques phrases vos atouts et votre motivation à rejoindre l'industrie cimentière..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : DOCUMENTS JOINTS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#07142A]">Étape 4 : Vos documents</h3>
                <p className="text-xs text-slate-500">Formats acceptés : PDF, DOC, DOCX. Taille maximale : 5 Mo par fichier.</p>
              </div>

              {/* Upload CV */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Curriculum Vitae (CV) <span className="text-red-500">* (Obligatoire)</span>
                </label>
                <div
                  onClick={() => cvInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    cvFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 hover:border-[#0131FD] bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={cvInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                    className="hidden"
                  />
                  {cvFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={28} className="text-emerald-600" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">{cvFile.name}</div>
                        <div className="text-[11px] text-slate-500">{(cvFile.size / 1024).toFixed(0)} Ko</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCvFile(null);
                        }}
                        className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FileArrowUp size={32} className="text-[#0131FD] mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-800">Cliquez pour importer votre CV</p>
                      <p className="text-[11px] text-slate-400 mt-1">PDF, DOC ou DOCX jusqu'à 5 Mo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Lettre */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lettre de motivation ou Recommandation <span className="text-slate-400">(Facultatif)</span>
                </label>
                <div
                  onClick={() => lettreInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    lettreFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300 hover:border-[#0131FD] bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={lettreInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleLettreChange}
                    className="hidden"
                  />
                  {lettreFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={24} className="text-emerald-600" />
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">{lettreFile.name}</div>
                        <div className="text-[11px] text-slate-500">{(lettreFile.size / 1024).toFixed(0)} Ko</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLettreFile(null);
                        }}
                        className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-600">Ajouter une lettre de motivation (optionnel)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">PDF ou Word</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 5 : RÉCAPITULATIF & VALIDATION */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#07142A]">Étape 5 : Récapitulatif avant transmission</h3>
                <p className="text-xs text-slate-500">Vérifiez vos informations avant l'envoi définitif.</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Candidat :</span>
                  <span className="font-bold text-slate-800">{formData.prenom} {formData.nom}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Contact :</span>
                  <span className="font-bold text-slate-800">{formData.email} | {formData.telephone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Localisation :</span>
                  <span className="font-bold text-slate-800">{formData.ville || 'N/A'}, {formData.pays}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Type de candidature :</span>
                  <span className="font-bold text-[#0131FD]">{formData.typeCandidature}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Diplôme & Niveau :</span>
                  <span className="font-bold text-slate-800">{formData.diplome} ({formData.niveauEtudes})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document joint :</span>
                  <span className="font-bold text-emerald-700">{cvFile?.name || 'Aucun CV joint'}</span>
                </div>
              </div>

              {/* Consentement RGPD */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                <input
                  type="checkbox"
                  name="consentementRgpd"
                  checked={formData.consentementRgpd}
                  onChange={handleInputChange}
                  required
                  className="mt-0.5 rounded text-[#0131FD] focus:ring-[#0131FD]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  J'autorise la <strong>Nouvelle Cimenterie du Bénin (NOCIBÉ)</strong> à collecter et traiter mes données personnelles à des fins exclusives de recrutement, conformément à la réglementation béninoise sur la protection des données. Mes données seront conservées pour une durée maximale de 24 mois.
                </span>
              </label>
            </div>
          )}

          {/* BOUTONS NAVIGATION ÉTAPES */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ArrowLeft size={14} weight="bold" />
                <span>Précédent</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>Étape suivante</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-md"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmission en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} weight="bold" />
                    <span>Confirmer et soumettre ma candidature</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;

