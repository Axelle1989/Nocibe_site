import React, { useState } from 'react';
import { HISTORY_MILESTONES } from '../data/history';
import { DIRECTOR_DATA } from '../data/director';
import { SectionHeader } from '../components/ui/SectionHeader';
import { HistoryTimeline } from '../components/history/HistoryTimeline';
import {
  Quotes,
  SealCheck,
  CaretDown,
  CaretUp,
  ArrowRight,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState(false);

  return (
    <div className="w-full py-10 sm:py-14 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        <SectionHeader
          eyebrow="Depuis 2013 au Bénin"
          titleBeforeItalic="Notre"
          italicWord="histoire"
          titleAfterItalic="& notre enracinement"
          subtitle="De la pose de la première pierre à Massé à l'autosuffisance cimentière nationale, découvrez l'épopée industrielle de la Nouvelle Cimenterie du Bénin."
        />

        {/* Featured factory visual with key historical figures */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="/images/vue-aerienne-usine-hd.jpg"
              alt="Vue aérienne du site industriel de Massé"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Site de Massé (Plateau)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-playfair">
                Le premier complexe cimentier 100% intégré du Bénin
              </h3>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="card-nocibe p-6 bg-white border-slate-200">
              <div className="text-3xl font-bold font-playfair text-[#0B1F3A] mb-1">
                +13 Années
              </div>
              <div className="text-xs font-bold uppercase text-[#0B1F3A] tracking-wider mb-2">
                D'engagement industriel
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Une aventure commencée avec la volonté souveraine de valoriser les gisements calcaires nationaux et de créer une valeur ajoutée locale pérenne.
              </p>
            </div>

            <div className="card-nocibe p-6 bg-white border-slate-200">
              <div className="text-3xl font-bold font-playfair text-[#0B1F3A] mb-1">
                100 Md FCFA
              </div>
              <div className="text-xs font-bold uppercase text-[#16A34A] tracking-wider mb-2">
                Investissements cumulés
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Technologies de clinkérisation européennes, laboratoires robotisés et broyeurs verticaux à basse empreinte carbone.
              </p>
            </div>
          </div>
        </div>

        {/* Section « Le mot du Directeur Général » (ancre #mot-du-directeur) */}
        <section id="mot-du-directeur" className="scroll-mt-28">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Portrait Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-[#07142A] to-[#0131FD] p-1 shadow-lg relative group">
                {!imgError && DIRECTOR_DATA.image ? (
                  <img
                    src={DIRECTOR_DATA.image}
                    alt={DIRECTOR_DATA.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#07142A] flex flex-col items-center justify-center text-white rounded-xl p-4">
                    <div className="w-20 h-20 rounded-full bg-[#0131FD]/30 border-2 border-[#0131FD] flex items-center justify-center font-serif text-3xl font-black text-[#00CCFF] mb-2">
                      {DIRECTOR_DATA.initials}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-slate-300 font-bold">Direction Générale</span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#07142A]">{DIRECTOR_DATA.name}</h3>
                <p className="text-xs font-semibold text-[#0131FD]">{DIRECTOR_DATA.title}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[11px] text-slate-600 font-medium">
                  <SealCheck size={14} className="text-emerald-600" weight="fill" />
                  <span>Complexe de Massé (Bénin)</span>
                </div>
              </div>
            </div>

            {/* Message Column */}
            <div className="md:col-span-8 space-y-5">
              <div>
                <span className="eyebrow text-[#0131FD]">Gouvernance & Vision</span>
                <h3 className="text-2xl font-bold font-playfair text-[#0B1F3A] mt-1">
                  Le Mot du Directeur Général
                </h3>
              </div>

              {/* Catchphrase quote banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF3FF] border-l-4 border-[#0131FD] text-slate-800 italic relative">
                <Quotes size={32} weight="fill" className="text-[#0131FD]/20 absolute top-3 right-4" />
                <p className="text-sm sm:text-base font-serif font-bold text-[#07142A] leading-relaxed">
                  « {DIRECTOR_DATA.catchphrase} »
                </p>
              </div>

              {/* Shortened body with "Lire la suite" toggle */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-sans">
                <p>
                  {DIRECTOR_DATA.paragraphs[0]}
                </p>
                <p>
                  {DIRECTOR_DATA.paragraphs[1]}
                </p>

                {expandedMessage && (
                  <div className="space-y-3 pt-1 border-t border-slate-100 animate-in fade-in duration-200">
                    {DIRECTOR_DATA.paragraphs.slice(2).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExpandedMessage(!expandedMessage)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0131FD] hover:text-[#0026C7] transition"
                >
                  <span>{expandedMessage ? 'Réduire le message' : 'Lire le message complet'}</span>
                  {expandedMessage ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
                </button>
              </div>

              {/* Signature block */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sm text-[#07142A]">{DIRECTOR_DATA.name}</p>
                  <p className="text-xs text-slate-500">{DIRECTOR_DATA.signatureTitle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{DIRECTOR_DATA.date}</p>
                </div>

                <Link
                  to="/produits"
                  className="px-4 py-2 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Découvrir nos ciments certifiés</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Frise chronologique interactive (Milestones) */}
        <section className="space-y-6 pt-2">
          <div className="text-center">
            <span className="eyebrow text-[#0131FD]">Jalons Majeurs</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-[#0B1F3A] mt-1">
              Les grandes étapes de notre développement
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2">
              Parcourez plus d'une décennie d'innovations techniques, d'investissements stratégiques et d'excellence industrielle au Bénin.
            </p>
          </div>

          <HistoryTimeline milestones={HISTORY_MILESTONES} />
        </section>
      </div>
    </div>
  );
};
