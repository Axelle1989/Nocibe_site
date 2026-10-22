import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/ui/SectionHeader';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Buildings,
  CheckCircle,
  CaretRight,
  CaretDown,
  Sparkle,
  Student,
  Certificate,
  Handshake,
} from '@phosphor-icons/react';

export const InternshipsPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const programs = [
    {
      type: 'STAGE_ACADEMIQUE',
      title: 'Stages Académiques & PFE',
      tag: 'Étudiants en cours de formation',
      duration: '1 à 6 mois',
      desc: 'Destiné aux étudiants inscrits en Licence, Master, Cycle Ingénieur ou BTS souhaitant valider leur diplôme par un stage d\'application ou un Projet de Fin d\'Études (PFE).',
      points: [
        'Sujet technique concret encadré par un tuteur ingénieur NOCIBÉ',
        'Accès aux installations industrielles et aux laboratoires de pointe de Massé',
        'Convention de stage obligatoire signée avec votre établissement',
        'Indemnité de stage et prise en charge de la restauration sur site',
      ],
      linkQuery: 'type=STAGE_ACADEMIQUE',
    },
    {
      type: 'STAGE_PROFESSIONNEL',
      title: 'Stages Professionnels Pré-embauche',
      tag: 'Jeunes Diplômés (Bac+2 à Bac+5)',
      duration: '6 à 12 mois',
      desc: 'Véritable passerelle vers le premier emploi pour les récents diplômés en génie civil, électromécanique, chimie, logistique ou gestion désirant une immersion opérationnelle complète.',
      points: [
        'Mise en situation réelle avec autonomie progressive sur des missions clés',
        'Évaluations semestrielles et plan de développement de compétences',
        'Opportunité forte de transformation en contrat à durée indéterminée (CDI)',
        'Rémunération attractive, mutuelle de santé et navette de transport',
      ],
      linkQuery: 'type=STAGE_PROFESSIONNEL',
    },
  ];

  const partners = [
    { name: 'EPAC', detail: 'École Polytechnique d\'Abomey-Calavi (Bénin)' },
    { name: 'UAC', detail: 'Université d\'Abomey-Calavi (Sciences & Technologies)' },
    { name: 'UNSTIM', detail: 'Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques (Abomey)' },
    { name: '2iE', detail: 'Institut International d\'Ingénierie de l\'Eau et de l\'Environnement (Ouagadougou)' },
    { name: 'INP-HB', detail: 'Institut National Polytechnique Félix Houphouët-Boigny (Yamoussoukro)' },
  ];

  const faqs = [
    {
      q: 'Une convention de stage est-elle obligatoire ?',
      a: 'Pour les stages académiques, oui : une convention tripartite délivrée par votre école ou université est indispensable avant toute prise de fonction. Pour les stages professionnels de jeunes diplômés, un contrat de stage professionnel régit l\'engagement conformément au Code du Travail béninois.',
    },
    {
      q: 'Les stages sont-ils rémunérés ?',
      a: 'Oui. Tous les stages chez NOCIBÉ bénéficient d\'une gratification mensuelle pour couvrir les frais de vie et de transport. Le déjeuner est en outre offert ou subventionné à la cantine de l\'usine de Massé.',
    },
    {
      q: 'NOCIBÉ aide-t-elle pour le logement des stagiaires éloignés ?',
      a: 'Pour les étudiants affectés à l\'usine de Massé (commune de Pobè) et résidant hors du département du Plateau, des solutions d\'hébergement conventionnées ou des facilités dans les résidences du site peuvent être accordées selon les disponibilités.',
    },
    {
      q: 'Quelles sont les chances d\'embauche à l\'issue d\'un stage ?',
      a: 'Plus de 40% des techniciens juniors et ingénieurs recrutés ces trois dernières années sont d\'anciens stagiaires NOCIBÉ. L\'excellence lors de votre stage est le meilleur passeport pour une offre de CDI.',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <SectionHeader
            eyebrow="Génération Talents Bénin"
            titleBeforeItalic="Programme d'"
            italicWord="immersion"
            titleAfterItalic="& Stages NOCIBÉ"
            subtitle="Développez vos compétences sur le terrain au contact des meilleurs experts de l'industrie cimentière ouest-africaine."
          />
        </div>

        {/* LES 2 PARCOURS DE STAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((prog, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0131FD]">
                    {prog.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Durée : {prog.duration}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#07142A]">
                  {prog.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {prog.desc}
                </p>

                <div className="mt-6 space-y-2.5">
                  {prog.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle size={16} weight="fill" className="text-[#0131FD] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  to={`/carrieres/postuler?${prog.linkQuery}`}
                  className="w-full py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <GraduationCap size={16} weight="bold" />
                  <span>Postuler pour ce type de stage</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* PARTENARIATS UNIVERSITAIRES */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Handshake size={28} className="text-[#0131FD]" weight="duotone" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#07142A]">Partenariats Écoles & Universités</h3>
              <p className="text-xs text-slate-500">NOCIBÉ collabore étroitement avec les institutions d'excellence de la sous-région.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {partners.map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
                <div className="font-serif font-black text-lg text-[#07142A]">{p.name}</div>
                <div className="text-[11px] text-slate-500 mt-1">{p.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ STAGES */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h3 className="font-serif text-xl font-bold text-center text-[#07142A] mb-6">
            Foire Aux Questions - Stages & Alternance
          </h3>

          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#07142A] hover:text-[#0131FD]"
              >
                <span>{faq.q}</span>
                <CaretDown
                  size={16}
                  weight="bold"
                  className={`shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[#0131FD]' : 'text-slate-400'}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BANNIÈRE DE CANDIDATURE */}
        <div className="bg-gradient-to-r from-[#07142A] to-[#0131FD] rounded-3xl p-8 sm:p-10 text-white text-center">
          <Student size={44} weight="duotone" className="mx-auto mb-3 text-[#00CCFF]" />
          <h3 className="font-serif text-2xl font-bold">Lancez votre carrière industrielle avec NOCIBÉ</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-xl mx-auto">
            Préparez votre convention de stage ou votre diplôme, et déposez votre dossier complet dès aujourd'hui.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/carrieres/postuler?type=STAGE_ACADEMIQUE"
              className="px-8 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#07142A] font-bold text-xs transition shadow-lg"
            >
              Remplir le formulaire de stage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipsPage;

