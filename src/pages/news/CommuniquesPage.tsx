import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { api } from '../../lib/api';
import {
  FileText,
  CalendarBlank,
  SealCheck,
  CaretRight,
  ArrowLeft,
  Sparkle,
  Newspaper,
  Buildings,
} from '@phosphor-icons/react';

interface Communique {
  id: string;
  titre: string;
  slug: string;
  reference: string;
  resume: string;
  signataire: string;
  statut: string;
  datePublication: string;
}

export const CommuniquesPage: React.FC = () => {
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommuniques = async () => {
      setLoading(true);
      try {
        const res = await api.news.getCommuniques();
        if (res?.communiques) {
          setCommuniques(res.communiques);
        }
      } catch (err) {
        console.error('Erreur chargement communiqués:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommuniques();
  }, []);

  return (
    <div className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link
              to="/actualites"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0131FD] hover:underline"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Retour à l'espace Actualités</span>
            </Link>
          </div>
          <SectionHeader
            eyebrow="Communication Institutionnelle"
            titleBeforeItalic="Les Communiqués"
            italicWord="Officiels"
            titleAfterItalic="de NOCIBÉ"
            subtitle="Déclarations de la direction générale, notes de conjoncture, avis techniques et prises de position réglementaires."
          />
        </div>

        {/* LISTE DES COMMUNIQUÉS */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Chargement des communiqués officiels...</p>
          </div>
        ) : communiques.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <FileText size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Aucun communiqué officiel publié pour le moment</h3>
            <p className="text-xs text-slate-500 mt-1">Consultez nos actualités récentes en attendant les prochaines publications.</p>
            <Link
              to="/actualites"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0131FD] text-white text-xs font-bold"
            >
              Voir les actualités
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {communiques.map((com) => (
              <div
                key={com.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0131FD]/30 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-[#0131FD] border border-blue-100">
                      Réf: {com.reference}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                      <CalendarBlank size={13} />
                      <span>{new Date(com.datePublication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      <SealCheck size={12} weight="fill" />
                      <span>Document Officiel</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#07142A] group-hover:text-[#0131FD] transition">
                    {com.titre}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {com.resume}
                  </p>

                  <div className="text-[11px] text-slate-500 italic pt-1">
                    Signataire : {com.signataire}
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    to={`/actualites/communiques/${com.slug}`}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0131FD] text-[#07142A] hover:text-white text-xs font-bold transition inline-flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Lire le communiqué</span>
                    <CaretRight size={14} weight="bold" className="group-hover/btn:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommuniquesPage;

