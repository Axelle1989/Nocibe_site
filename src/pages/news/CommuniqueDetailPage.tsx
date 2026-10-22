import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  FileText,
  CalendarBlank,
  SealCheck,
  Printer,
  ArrowLeft,
  ShareNetwork,
  Check,
  Buildings,
} from '@phosphor-icons/react';

export const CommuniqueDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [communique, setCommunique] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCommunique = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.news.getCommuniqueBySlug(slug);
        if (res?.communique) {
          setCommunique(res.communique);
        }
      } catch (err) {
        console.error('Erreur chargement communiqué:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunique();
  }, [slug]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Chargement du communiqué officiel...</p>
      </div>
    );
  }

  if (!communique) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center max-w-xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-800">Communiqué introuvable</h2>
        <p className="text-xs text-slate-500 mt-2">Le document recherché n'existe pas ou n'est plus en ligne.</p>
        <Link
          to="/actualites/communiques"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0131FD] text-white text-xs font-bold"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Retour aux communiqués</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Barre d'outils haute (masquée à l'impression) */}
        <div className="flex items-center justify-between gap-4 print:hidden text-xs">
          <Link
            to="/actualites/communiques"
            className="inline-flex items-center gap-1.5 font-bold text-[#0131FD] hover:underline"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Tous les communiqués officiels</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0131FD] transition text-[11px] font-semibold flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" weight="bold" />
                  <span className="text-emerald-700">Lien copié</span>
                </>
              ) : (
                <>
                  <ShareNetwork size={14} />
                  <span>Partager</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#0131FD] hover:bg-[#0026C7] text-white transition text-[11px] font-bold flex items-center gap-1.5"
            >
              <Printer size={14} weight="bold" />
              <span>Imprimer / PDF</span>
            </button>
          </div>
        </div>

        {/* DOCUMENT OFFICIEL STYLE PAPIER À EN-TÊTE */}
        <article className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/90 shadow-md space-y-8 print:border-none print:shadow-none print:p-0">
          {/* En-tête institutionnel */}
          <div className="border-b-2 border-[#0B1F3A] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="font-serif font-black tracking-wider text-2xl text-[#0B1F3A]">
                NOCI<span className="text-[#0131FD]">BÉ</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">
                Nouvelle Cimenterie du Bénin S.A.
              </div>
              <div className="text-[10px] text-slate-400">
                Complexe Industriel de Massé - Commune de Pobè (Bénin)
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="font-mono font-bold text-[#0131FD]">RÉF : {communique.reference}</div>
              <div className="text-slate-500 mt-1">
                Fait à Massé, le {new Date(communique.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
                <SealCheck size={14} weight="fill" />
                <span>Diffusion Publique Officielle</span>
              </div>
            </div>
          </div>

          {/* Titre & Résumé */}
          <div className="space-y-4">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#0131FD]">
              COMMUNIQUÉ DE PRESSE & AVIS OFFICIEL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#07142A] leading-tight">
              {communique.titre}
            </h1>
            {communique.resume && (
              <p className="text-sm sm:text-base font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border-l-4 border-[#0131FD]">
                {communique.resume}
              </p>
            )}
          </div>

          {/* Contenu principal */}
          <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
            {communique.contenu.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bloc Signature Officielle */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-[11px] text-slate-400">
              <p>Contact presse & relations institutionnelles :</p>
              <p className="font-semibold text-slate-600">communication@nocibe-benin.bj | +229 21 30 00 00</p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500 italic">Pour la Nouvelle Cimenterie du Bénin,</p>
              <p className="font-serif font-bold text-base text-[#07142A] mt-2">{communique.signataire}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <SealCheck size={13} className="text-[#0131FD]" weight="fill" />
                <span>Cachet & Signature Électronique Validés</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CommuniqueDetailPage;

