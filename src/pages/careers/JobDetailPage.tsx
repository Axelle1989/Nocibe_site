import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  Briefcase,
  MapPin,
  CalendarBlank,
  ShareNetwork,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  Sparkle,
  ShieldCheck,
  ForkKnife,
  Bus,
  Buildings,
  CopySimple,
  Check,
} from '@phosphor-icons/react';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.careers.getOfferBySlug(slug);
        if (res?.offer) {
          setOffer(res.offer);
        }
      } catch (err) {
        console.error('Erreur chargement offre:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Chargement de l'offre...</p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center max-w-xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-800">Offre introuvable ou clôturée</h2>
        <p className="text-xs text-slate-500 mt-2">
          Cette offre n'est plus disponible ou a été déplacée.
        </p>
        <Link
          to="/carrieres/offres"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0131FD] text-white text-xs font-bold"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Retour aux offres</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Fil d'ariane */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <Link
            to="/carrieres/offres"
            className="inline-flex items-center gap-1.5 font-bold text-[#0131FD] hover:underline"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Toutes les offres d'emploi</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0131FD] hover:border-[#0131FD] transition text-[11px] font-semibold"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" weight="bold" />
                <span className="text-emerald-700">Lien copié !</span>
              </>
            ) : (
              <>
                <ShareNetwork size={14} />
                <span>Partager cette offre</span>
              </>
            )}
          </button>
        </div>

        {/* CARTE EN-TÊTE PRINCIPALE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0131FD]">
              {offer.typeContrat}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Réf : {offer.reference}
            </span>
            {offer.estUrgent && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                <Sparkle size={12} weight="fill" />
                <span>Urgent</span>
              </span>
            )}
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#07142A] leading-tight">
              {offer.titre}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#0131FD] font-semibold">
              Département {offer.departement}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Lieu</div>
              <div className="font-bold text-[#07142A] mt-0.5 flex items-center gap-1">
                <MapPin size={14} className="text-[#0131FD]" />
                <span>{offer.lieu}</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Expérience</div>
              <div className="font-bold text-[#07142A] mt-0.5">{offer.experienceRequise || 'Débutant accepté'}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Formation</div>
              <div className="font-bold text-[#07142A] mt-0.5">{offer.niveauEtudes || 'Bac+2 à Bac+5'}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Date limite</div>
              <div className="font-bold text-[#07142A] mt-0.5">
                {offer.dateLimite ? new Date(offer.dateLimite).toLocaleDateString('fr-FR') : 'Ouvert'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/carrieres/postuler?offre=${offer.id}&slug=${offer.slug}`}
              className="flex-1 py-3.5 px-6 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white font-bold text-sm text-center transition shadow-md"
            >
              Postuler à cette offre
            </Link>
          </div>
        </div>

        {/* CONTENU DE L'OFFRE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
          {/* Description générale */}
          <div>
            <h2 className="font-serif text-lg font-bold text-[#07142A] mb-3">Contexte du poste</h2>
            <p>{offer.descriptionCourte}</p>
          </div>

          {/* Missions */}
          {offer.missions && (
            <div>
              <h2 className="font-serif text-lg font-bold text-[#07142A] mb-3">Missions principales</h2>
              <div className="space-y-2">
                {Array.isArray(offer.missions) ? (
                  offer.missions.map((m: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle size={16} weight="fill" className="text-[#0131FD] shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))
                ) : (
                  <p className="whitespace-pre-line">{offer.missions}</p>
                )}
              </div>
            </div>
          )}

          {/* Profil recherché */}
          {offer.profilRecherche && (
            <div>
              <h2 className="font-serif text-lg font-bold text-[#07142A] mb-3">Profil recherché</h2>
              <p className="whitespace-pre-line">{offer.profilRecherche}</p>
            </div>
          )}

          {/* Compétences requises */}
          {offer.competences && (
            <div>
              <h2 className="font-serif text-lg font-bold text-[#07142A] mb-3">Compétences requises</h2>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(offer.competences) ? offer.competences : offer.competences.split(',')).map(
                  (c: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                    >
                      {c.trim()}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Avantages */}
          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h3 className="font-bold text-[#07142A] text-sm mb-3">Avantages & Cadre de travail NOCIBÉ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#0131FD]" weight="fill" />
                <span>Couverture santé & mutuelle groupe à 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <ForkKnife size={18} className="text-[#0131FD]" weight="fill" />
                <span>Restauration d'entreprise subventionnée</span>
              </div>
              <div className="flex items-center gap-2">
                <Bus size={18} className="text-[#0131FD]" weight="fill" />
                <span>Navettes de transport personnel (axe Pobè / Porto-Novo)</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#0131FD]" weight="fill" />
                <span>Plan annuel de formation continue certifiant</span>
              </div>
            </div>
          </div>

          {/* CTA Bas */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-500">
              Référence du poste : <strong className="text-slate-800">{offer.reference}</strong>
            </div>
            <Link
              to={`/carrieres/postuler?offre=${offer.id}&slug=${offer.slug}`}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition shadow text-center"
            >
              Postuler à cette offre maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;

