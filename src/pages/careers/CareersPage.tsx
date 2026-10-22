import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/ui/SectionHeader';
import {
  Briefcase,
  GraduationCap,
  PaperPlaneTilt,
  ShieldCheck,
  TrendUp,
  Heart,
  Users,
  CheckCircle,
  CaretRight,
  CaretDown,
  Sparkle,
  HardHat,
  Lightbulb,
} from '@phosphor-icons/react';

export const CareersPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '+450', label: 'Collaborateurs au Bénin', detail: 'Sur le site de Massé et à Cotonou' },
    { value: '98%', label: 'Contrats en CDI', detail: 'Stabilité & sécurité de l\'emploi' },
    { value: '+35%', label: 'Femmes dans la technique', detail: 'Ingénierie, laboratoire & process' },
    { value: '2 500 h', label: 'Formation continue / an', detail: 'Montée en compétences & certifications' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Sécurité & Santé Prioritaires',
      desc: 'Culture stricte du Zéro Accident, équipements de protection aux normes mondiales et suivi médical régulier de tous les collaborateurs.',
    },
    {
      icon: TrendUp,
      title: 'Évolution & Gestion des Talents',
      desc: 'Plans de carrière personnalisés, mentorat par des experts internationaux de la cimenterie et promotions internes régulières.',
    },
    {
      icon: Heart,
      title: 'Équité, Diversité & Inclusion',
      desc: 'Égalité des chances, valorisation des talents locaux béninois et intégration active des jeunes diplômés et des femmes dans l\'industrie.',
    },
    {
      icon: Lightbulb,
      title: 'Fierté Industrielle & Innovation',
      desc: 'Participer directement à l\'indépendance cimentière du Bénin, aux plus grands chantiers d\'infrastructures et à la transition bas-carbone.',
    },
  ];

  const testimonials = [
    {
      name: 'Amina K.',
      role: 'Ingénieure Qualité & Process',
      exp: '4 ans chez NOCIBÉ',
      quote: 'Travailler au laboratoire de contrôle de Massé m\'a permis de maîtriser des technologies de pointe en spectrométrie. NOCIBÉ donne de réelles responsabilités aux jeunes ingénieurs béninois.',
      initials: 'AK',
    },
    {
      name: 'Sylvestre D.',
      role: 'Chef de Carrière & Extraction',
      exp: '7 ans chez NOCIBÉ',
      quote: 'La rigueur sur la sécurité est sans compromis. L\'esprit d\'équipe et le respect des riverains font de notre usine un pôle de développement concret pour toute la commune de Pobè.',
      initials: 'SD',
    },
    {
      name: 'Romaric T.',
      role: 'Technicien Supérieur Maintenance Électrique',
      exp: '3 ans chez NOCIBÉ',
      quote: 'Entré en stage académique après mon BTS à l\'EPAC, j\'ai été formé par des aînés passionnés avant de signer mon CDI. Ici, l\'apprentissage sur le terrain ne s\'arrête jamais.',
      initials: 'RT',
    },
  ];

  const faqs = [
    {
      q: 'Comment se déroule le processus de recrutement chez NOCIBÉ ?',
      a: 'Le processus comprend 3 à 4 étapes claires : 1) Sélection sur CV et lettre par l\'équipe RH (réponse sous 15 jours), 2) Entretien téléphonique ou vidéo de qualification, 3) Entretien technique avec le manager opérationnel à Massé ou Cotonou, 4) Entretien final RH et proposition d\'embauche.',
    },
    {
      q: 'Quels profils NOCIBÉ recherche-t-elle principalement ?',
      a: 'Nous recrutons principalement des ingénieurs et techniciens (Génie civil, Électromécanique, Automatismes, Chimie industrielle, QHSE, Géologie/Mines), ainsi que des professionnels de la chaîne logistique, des achats, du commerce B2B et des fonctions support (comptabilité, RH, SI).',
    },
    {
      q: 'Comment s\'organise la vie quotidienne sur le complexe industriel de Massé ?',
      a: 'Pour les postes basés à l\'usine de Massé (commune de Pobè), NOCIBÉ assure des navettes quotidiennes de transport pour le personnel, une cantine d\'entreprise subventionnée, un centre médical d\'urgence 24/7 et des logements d\'astreinte pour les équipes opérationnelles.',
    },
    {
      q: 'NOCIBÉ accueille-t-elle des stagiaires ?',
      a: 'Oui, très largement. Nous accueillons chaque année plus de 60 stagiaires dans le cadre de stages académiques (PFE, licences, masters) et professionnels (pré-embauche). Plus de 40% de nos techniciens juniors sont d\'anciens stagiaires.',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#07142A] via-[#0B1F3A] to-[#0131FD] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00CCFF]/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00CCFF] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkle size={14} weight="fill" />
            <span>Espace Carrières & Talents</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight max-w-3xl">
            Rejoignez l'aventure industrielle <span className="text-[#00CCFF]">NOCIBÉ</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Construisez l'avenir des infrastructures béninoises et ouest-africaines. Intégrez une équipe de passionnés qui transforment le calcaire local en ciment de classe internationale.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/carrieres/offres"
              className="px-6 py-3.5 rounded-xl bg-[#0131FD] hover:bg-white hover:text-[#07142A] text-white font-bold text-sm transition shadow-lg inline-flex items-center gap-2"
            >
              <Briefcase size={18} weight="bold" />
              <span>Consulter nos offres d'emploi</span>
            </Link>
            <Link
              to="/carrieres/stages"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm border border-white/20 transition inline-flex items-center gap-2"
            >
              <GraduationCap size={18} weight="bold" />
              <span>Filière Stages & Étudiants</span>
            </Link>
            <Link
              to="/carrieres/postuler"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition inline-flex items-center gap-2"
            >
              <PaperPlaneTilt size={18} weight="bold" />
              <span>Candidature spontanée</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CHIFFRES CLÉS RH */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md">
              <div className="font-serif text-2xl sm:text-3xl font-black text-[#0131FD]">{stat.value}</div>
              <div className="text-xs sm:text-sm font-bold text-[#07142A] mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TROIS PARCOURS D'ACCÈS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Opportunités"
          titleBeforeItalic="Trois voies pour"
          italicWord="rejoindre"
          titleAfterItalic="nos équipes"
          subtitle="Que vous soyez professionnel expérimenté, jeune diplômé ou étudiant en quête d'immersion, une opportunité vous attend."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Carte 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0131FD] flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Briefcase size={26} weight="duotone" />
              </div>
              <h3 className="text-lg font-bold text-[#07142A]">Offres d'Emploi</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Postes en CDI et CDD pour professionnels confirmés et jeunes talents en production, maintenance, génie civil, supply chain et fonctions corporate.
              </p>
            </div>
            <Link
              to="/carrieres/offres"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0131FD] group-hover:translate-x-1 transition"
            >
              <span>Voir les postes ouverts</span>
              <CaretRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Carte 2 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0099DD] flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <GraduationCap size={26} weight="duotone" />
              </div>
              <h3 className="text-lg font-bold text-[#07142A]">Stages Académiques & Pro</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Immersion concrète au cœur d'une usine moderne. Projets de fin d'études (PFE), stages d'été et stages professionnels de pré-embauche.
              </p>
            </div>
            <Link
              to="/carrieres/stages"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0131FD] group-hover:translate-x-1 transition"
            >
              <span>Découvrir le programme de stages</span>
              <CaretRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Carte 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <PaperPlaneTilt size={26} weight="duotone" />
              </div>
              <h3 className="text-lg font-bold text-[#07142A]">Candidature Spontanée</h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Votre profil ne correspond pas aux offres actuelles ? Déposez votre CV dans notre vivier de talents pour nos futurs recrutements.
              </p>
            </div>
            <Link
              to="/carrieres/postuler"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0131FD] group-hover:translate-x-1 transition"
            >
              <span>Déposer un dossier spontané</span>
              <CaretRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PILIERS RH */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Culture d'Entreprise"
            titleBeforeItalic="Nos engagements pour nos"
            italicWord="collaborateurs"
            titleAfterItalic=""
            subtitle="Chez NOCIBÉ, nous investissons dans les personnes avec une vision à long terme."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#0131FD] shadow-sm flex items-center justify-center mb-4">
                    <Icon size={22} weight="bold" />
                  </div>
                  <h4 className="text-sm font-bold text-[#07142A] mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TÉMOIGNAGES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          eyebrow="Paroles de Collaborateurs"
          titleBeforeItalic="Ils bâtissent"
          italicWord="NOCIBÉ"
          titleAfterItalic="au quotidien"
          subtitle="Découvrez le quotidien et l'évolution professionnelle de celles et ceux qui font tourner l'usine de Massé."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                « {t.quote} »
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B1F3A] to-[#0131FD] text-white flex items-center justify-center font-bold text-xs">
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#07142A]">{t.name}</div>
                  <div className="text-[11px] font-semibold text-[#0131FD]">{t.role}</div>
                  <div className="text-[10px] text-slate-400">{t.exp}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ RH */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <SectionHeader
          eyebrow="Questions Fréquentes"
          titleBeforeItalic="Tout ce que vous devez"
          italicWord="savoir"
          titleAfterItalic="sur nos recrutements"
          subtitle="Transparence et clarté sur nos conditions, nos processus et la vie sur notre site industriel."
        />

        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition">
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

        {/* CTA Bas de page */}
        <div className="mt-12 bg-gradient-to-r from-[#07142A] to-[#0B1F3A] rounded-3xl p-8 text-white text-center">
          <h3 className="font-serif text-xl sm:text-2xl font-bold">Prêt à nous rejoindre ?</h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Découvrez nos offres actuelles ou transmettez-nous votre candidature en quelques clics.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/carrieres/offres"
              className="px-6 py-2.5 rounded-xl bg-[#0131FD] hover:bg-white hover:text-[#07142A] text-white font-bold text-xs transition"
            >
              Voir les offres d'emploi
            </Link>
            <Link
              to="/carrieres/postuler"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
            >
              Déposer une candidature
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;

