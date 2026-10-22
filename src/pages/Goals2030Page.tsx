import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Leaf,
  Tree,
  Drop,
  ShieldCheck,
  CheckCircle,
  ChartLineUp,
  ArrowRight,
  CalendarCheck,
  Target,
  Sparkle,
} from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';

interface GoalDetail {
  id: string;
  title: string;
  category: string;
  startYear: number;
  startValue: string;
  currentPercentage: number;
  currentValue: string;
  targetYear: number;
  targetValue: string;
  description: string;
  milestones: { year: number; text: string }[];
  color: string;
  bgGradient: string;
}

export const Goals2030Page: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const goals: GoalDetail[] = [
    {
      id: 'decarbonation',
      title: 'Décarbonation & Efficacité Énergétique',
      category: 'Climat & Énergie',
      startYear: 2019,
      startValue: '725 kg CO₂ / t',
      currentPercentage: 68,
      currentValue: '595 kg CO₂ / t',
      targetYear: 2030,
      targetValue: '490 kg CO₂ / t (-32%)',
      description: 'Optimisation continue de notre préchauffeur 5 étages, substitution progressive des combustibles fossiles par la biomasse agricole locale (coques de palmiste) et calcinateurs basse émission.',
      milestones: [
        { year: 2021, text: 'Mise en service du filtre à manches haute performance' },
        { year: 2024, text: 'Introduction de 15% de biomasse dans le mix combustible' },
        { year: 2027, text: 'Cible 25% de substitution thermique' },
        { year: 2030, text: 'Seuil cible < 500 kg CO₂ / tonne de ciment' },
      ],
      color: '#0131FD',
      bgGradient: 'from-[#0131FD] to-[#00CCFF]',
    },
    {
      id: 'biodiversite',
      title: 'Carrières Durables & Réhabilitation de la Biodiversité',
      category: 'Préservation des Sols',
      startYear: 2020,
      startValue: '15 hectares réhabilités',
      currentPercentage: 82,
      currentValue: '65 hectares revégétalisés',
      targetYear: 2030,
      targetValue: '100% des fronts d\'extraction reboisés (120 ha)',
      description: 'Chaque mètre carré excavé pour l\'argile ou le calcaire fait l\'objet d\'un remodelage topographique immédiat et d\'une replantation d\'espèces végétales locales en partenariat avec les eaux et forêts.',
      milestones: [
        { year: 2020, text: 'Création de la pépinière forestière de Massé' },
        { year: 2023, text: 'Cap franchi de 50 000 arbres indigènes plantés' },
        { year: 2026, text: 'Corridor écologique continu reliant la forêt classée' },
        { year: 2030, text: 'Sanctuaire naturel et restitution intégrale aux communes' },
      ],
      color: '#16A34A',
      bgGradient: 'from-[#16A34A] to-emerald-400',
    },
    {
      id: 'eau-circulaire',
      title: 'Gestion Circulaire de l\'Eau & Zéro Rejet Liquide',
      category: 'Ressources Hydriques',
      startYear: 2019,
      startValue: '45% d\'eau recyclée',
      currentPercentage: 90,
      currentValue: '90% de circuit fermé',
      targetYear: 2030,
      targetValue: '98% de recirculation sans prélèvement de nappe',
      description: 'L\'eau de refroidissement des broyeurs et compresseurs circule dans des aéroréfrigérants fermés avec bassins de décantation et récupération des eaux pluviales sur les toitures industrielles.',
      milestones: [
        { year: 2020, text: 'Bassin de décantation et filtration cyclonique' },
        { year: 2023, text: 'Collecteurs pluviaux sur 35 000 m² de toitures' },
        { year: 2027, text: 'Station autonome d\'ultrafiltration des eaux' },
        { year: 2030, text: 'Indépendance hydrique totale hors saison des pluies' },
      ],
      color: '#0284C7',
      bgGradient: 'from-[#0284C7] to-cyan-300',
    },
    {
      id: 'zero-accident',
      title: 'Zéro Accident & Culture de Sécurité Intégrée',
      category: 'Santé & Intégrité Humaine',
      startYear: 2019,
      startValue: 'Taux de fréquence initial : 4,2',
      currentPercentage: 94,
      currentValue: 'TF < 0,5 (+500 jours consécutifs)',
      targetYear: 2030,
      targetValue: 'Zéro accident avec arrêt (TF = 0)',
      description: 'La sécurité est la priorité absolue qui conditionne toute production. Audits quotidiens, protocoles de consignation stricts LOTO et implication des transporteurs dans la démarche sécurité.',
      milestones: [
        { year: 2021, text: 'Déploiement du quart d\'heure sécurité quotidien' },
        { year: 2023, text: 'Certification ISO 45001 du site de Massé' },
        { year: 2026, text: 'Automatisation complète des zones de palettisation' },
        { year: 2030, text: 'Pérennisation du standard Zéro Accident' },
      ],
      color: '#0B1F3A',
      bgGradient: 'from-[#0B1F3A] to-[#0131FD]',
    },
  ];

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <SectionHeader
          eyebrow="Feuille de Route Environnementale"
          titleBeforeItalic="Nos 4 grands objectifs pour"
          italicWord="2030"
          titleAfterItalic="au Bénin"
          subtitle="Des engagements quantifiés, auditables et conformes aux meilleures pratiques industrielles internationales pour concilier souveraineté constructive et préservation écologique."
        />

        {/* 4 Animated Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0131FD] bg-[#EBF3FF] px-3 py-1 rounded-full">
                    {goal.category}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-playfair text-[#0B1F3A]">
                      {goal.currentPercentage}%
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">réalisé</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-playfair text-[#0B1F3A] mb-2">
                  {goal.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {goal.description}
                </p>

                {/* Animated Progress Gauge */}
                <div className="space-y-2 mb-6">
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <motion.div
                      initial={shouldReduceMotion ? { width: `${goal.currentPercentage}%` } : { width: '0%' }}
                      animate={{ width: `${goal.currentPercentage}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full bg-gradient-to-r ${goal.bgGradient}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Départ ({goal.startYear}) : {goal.startValue}</span>
                    <span className="text-[#0131FD] font-bold">Actuel : {goal.currentValue}</span>
                  </div>
                </div>

                {/* Target Callout Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-5">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-[#0131FD] shrink-0" weight="bold" />
                    <span className="font-semibold text-[#0B1F3A]">Cible finale horizon {goal.targetYear} :</span>
                  </div>
                  <span className="font-bold text-[#16A34A]">{goal.targetValue}</span>
                </div>
              </div>

              {/* Milestones chronology */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Jalons et échéances clés :
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {goal.milestones.map((ms, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 leading-snug">
                      <strong className="text-[#0B1F3A] font-bold">{ms.year} :</strong> {ms.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section « Actions de terrain » (ancre #developpement-durable) */}
        <section id="developpement-durable" className="scroll-mt-28 space-y-8 pt-4">
          <div className="text-center">
            <span className="eyebrow text-emerald-600">Responsabilité Sociétale & Territoriale</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-[#0B1F3A] mt-1">
              Actions de Terrain & Reboisement du Plateau
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2">
              L'extraction géologique s'accompagne d'une restitution écologique immédiate et d'investissements humains concrets au profit des populations riveraines de Massé.
            </p>
          </div>

          {/* 4 Piliers Actions de terrain */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-nocibe p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Tree size={26} weight="bold" />
                </div>
                <h4 className="text-base font-bold text-[#0B1F3A]">Pépinière & Reboisement</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Production locale de plus de 25 000 plants d'essences locales pour revégétaliser les fronts de taille.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle size={14} weight="fill" />
                <span>+65 ha revégétalisés</span>
              </div>
            </div>

            <div className="card-nocibe p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0131FD] flex items-center justify-center">
                  <ShieldCheck size={26} weight="bold" />
                </div>
                <h4 className="text-base font-bold text-[#0B1F3A]">Éducation & Bourses</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Construction de classes, don de kits scolaires et bourses d'études pour la jeunesse riveraine.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#0131FD]">
                <CheckCircle size={14} weight="fill" />
                <span>3 500 élèves aidés</span>
              </div>
            </div>

            <div className="card-nocibe p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Drop size={26} weight="bold" />
                </div>
                <h4 className="text-base font-bold text-[#0B1F3A]">Eau Potable & Santé</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aménagement de forages d'eau potable et appui aux centres de santé pour les familles du Plateau.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-cyan-600">
                <CheckCircle size={14} weight="fill" />
                <span>12 forages créés</span>
              </div>
            </div>

            <div className="card-nocibe p-6 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Leaf size={26} weight="bold" />
                </div>
                <h4 className="text-base font-bold text-[#0B1F3A]">Économie Circulaire</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recyclage intégral des poussières filtrées et valorisation de coproduits agricoles locaux.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-teal-600">
                <CheckCircle size={14} weight="fill" />
                <span>100% poussières réinjectées</span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Summary & Navigation */}
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold font-playfair text-white">
              Découvrez aussi notre démarche Sécurité & Qualité
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Consultez les détails de nos certifications ISO 9001 / ISO 14001 et les tests robotisés de compression du laboratoire central.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => navigate('/securite-qualite')}
              className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              Sécurité & Qualité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals2030Page;

