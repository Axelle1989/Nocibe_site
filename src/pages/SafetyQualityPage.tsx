import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SAFETY_PILLARS } from '../data/sustainability';
import {
  ShieldCheck,
  CheckCircle,
  HardHat,
  ArrowsClockwise,
  Certificate,
  Gauge,
  Factory,
  ArrowRight,
  ClipboardText,
} from '@phosphor-icons/react';

export const SafetyQualityPage: React.FC = () => {
  const navigate = useNavigate();

  const isoStandards = [
    {
      title: 'ISO 9001 : 2015',
      label: 'Système de Management de la Qualité',
      description: 'Garantit l\'homogénéité constante de nos clinkers et ciments par des procédures documentées, des audits internes mensuels et la traçabilité totale du calcaire jusqu\'au sac ensaché.',
      status: 'Certifié Bureau Veritas',
    },
    {
      title: 'ISO 14001 : 2015',
      label: 'Système de Management Environnemental',
      description: 'Encadre la gestion rigoureuse des rejets atmosphériques (poussières < 10 mg/Nm³), la recirculation de l\'eau industrielle et la préservation de la biodiversité sur la concession de Massé.',
      status: 'Certifié Bureau Veritas',
    },
    {
      title: 'Norme Harmonisée EN 197-1',
      label: 'Spécifications Ciments Courants',
      description: 'Conformité stricte aux exigences mécaniques, physiques et chimiques pour les classes de résistance 32.5, 42.5 et 52.5 (temps de prise, expansion, perte au feu et sulfate).',
      status: 'Contrôle continu 24/7',
    },
  ];

  const labSteps = [
    {
      step: '01',
      title: 'Spectrométrie de Fluorescence X (XRF)',
      description: 'Analyse robotisée toutes les heures de la composition chimique élémentaire du cru et du clinker (CaO, SiO₂, Al₂O₃, Fe₂O₃) pour maintenir un module de saturation parfait.',
    },
    {
      step: '02',
      title: 'Contrôle de la Finesse de Mouture (Blaine)',
      description: 'Mesure de la surface spécifique au perméabilimètre de Blaine garantissant une réactivité optimale lors de l\'hydratation et évitant le ressuage sur chantier.',
    },
    {
      step: '03',
      title: 'Essais de Prise & Stabilité Le Chatelier',
      description: 'Vérification quotidienne de l\'aiguille de Vicat (début et fin de prise) et essai d\'expansion à chaud Le Chatelier (< 10 mm) pour prévenir tout risque de fissuration.',
    },
    {
      step: '04',
      title: 'Presses de Compression Hydraulique à 2, 7 & 28j',
      description: 'Écrasement d\'éprouvettes normalisées de mortier (40×40×160 mm) conservées en salle régulée à 20°C et 95% d\'humidité pour valider les courbes de résistance.',
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Excellence Industrielle & Métrologie"
          titleBeforeItalic="Sécurité intégrée &"
          italicWord="qualité certifiée"
          titleAfterItalic="EN 197-1"
          subtitle="La politique QHSE de la NOCIBÉ combine une culture rigoureuse du Zéro Accident avec un laboratoire robotisé de pointe pour garantir des liants d'une fiabilité absolue."
        />

        {/* 1. Zéro accident Banner */}
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#162E52] text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#16A34A]/20 text-[#4ADE80] text-xs font-bold px-3 py-1 rounded-full border border-[#16A34A]/30">
              <ShieldCheck size={16} weight="bold" />
              <span>Priorité Absolue : Objectif Zéro Accident</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-white">
              Plus de 500 jours consécutifs sans accident avec arrêt
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sur le site de l'usine intégrée de Massé et dans nos carrières d'extraction, aucun impératif de production ne prévaut sur la sécurité de nos salariés, sous-traitants et chauffeurs partenaires.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black font-playfair text-[#4ADE80]">0</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Accident majeur</div>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black font-playfair text-white">100%</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Personnel formé</div>
            </div>
          </div>
        </div>

        {/* 2. Les 3 Piliers de la Sécurité */}
        <div className="space-y-4">
          <div>
            <span className="eyebrow text-[#0131FD]">Culture Préventive</span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A]">
              Les 3 Piliers du Standard Zéro Accident
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAFETY_PILLARS.map((pil, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EBF3FF] text-[#0131FD] flex items-center justify-center mb-4">
                    <HardHat size={26} weight="duotone" />
                  </div>
                  <h4 className="text-base font-bold text-[#0B1F3A] mb-2">{pil.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pil.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="inline-block text-[11px] font-bold text-[#0131FD] bg-[#EBF3FF] px-3 py-1 rounded-full">
                    {pil.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Certifications ISO 9001, ISO 14001 & EN 197-1 */}
        <div className="space-y-4">
          <div>
            <span className="eyebrow text-[#0131FD]">Homologations Officielles</span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A]">
              Certifications Internationales & Conformité
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isoStandards.map((std, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black font-playfair text-[#0B1F3A]">{std.title}</span>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {std.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0131FD] mb-2">{std.label}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{std.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <CheckCircle size={15} weight="fill" className="text-[#16A34A]" />
                  <span>Audité annuellement par des tiers accrédités</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Laboratoire Central & Essais EN 197-1 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="max-w-3xl">
            <span className="eyebrow text-[#0131FD]">Métrologie & Rigueur Scientifique</span>
            <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A] mb-2">
              Le Laboratoire Central de Massé : 4 Étapes de Contrôle Robotisé
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Chaque heure de production donne lieu à des prélèvements systématiques. Nos équipements robotisés garantissent que chaque sac de ciment respecte ou surpasse les seuils de la norme européenne EN 197-1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
            {labSteps.map((step) => (
              <div key={step.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xl font-black font-playfair text-[#0131FD]">{step.step}</span>
                <h4 className="text-xs font-bold text-[#0B1F3A] leading-snug">{step.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Strip */}
        <div className="bg-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-600 font-medium text-center sm:text-left">
            Vous souhaitez consulter nos caractéristiques techniques détaillées ou télécharger nos fiches d'essais ?
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/produits#specifications')}
              className="btn-primary px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              Fiches Techniques
            </button>
            <button
              type="button"
              onClick={() => navigate('/objectifs-2030')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-[#0B1F3A] border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Objectifs 2030
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyQualityPage;
