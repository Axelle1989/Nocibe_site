import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Users,
  ShieldCheck,
  HardHat,
  GraduationCap,
  EnvelopeSimple,
  Phone,
  Target,
  Compass,
  Plant,
  Truck,
  Handshake,
  CheckCircle,
} from '@phosphor-icons/react';
import { IconBeninMap, IconLabScale } from '../components/icons/IndustryIcons';

export const TeamPage: React.FC = () => {
  const values = [
    {
      title: 'Souveraineté & Ancrage Local',
      description: 'Valoriser les richesses géologiques du Plateau pour garantir l\'indépendance sans importation de clinker.',
      fact: '95 % d\'effectifs béninois',
      icon: IconBeninMap,
      color: 'text-[#0131FD]',
      bg: 'bg-[#EBF3FF]',
    },
    {
      title: 'Rigueur Normative EN 197-1',
      description: 'Analyses automatiques par fluorescence X et essais de compression certifiés à 2, 7 et 28 jours.',
      fact: 'Contrôles continus 24/7',
      icon: IconLabScale,
      color: 'text-[#0131FD]',
      bg: 'bg-[#EBF3FF]',
    },
    {
      title: 'Sécurité & Zéro Accident',
      description: 'La vie humaine prime sur tout impératif de tonnage. Protocoles stricts de consignation et de circulation.',
      fact: 'Objectif Zéro Accident',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Éco-Responsabilité & Reboisement',
      description: 'Récupération thermique sur four à 1450°C, filtration à manches et pépinière forestière dédiée.',
      fact: '-35 % CO₂ visés 2030',
      icon: Plant,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Continuité Logistique',
      description: 'Approvisionnement direct et permanent des chantiers névralgiques du pays depuis notre site de Massé.',
      fact: '8 dépôts régionaux',
      icon: Truck,
      color: 'text-[#0131FD]',
      bg: 'bg-[#EBF3FF]',
    },
    {
      title: 'Éthique Commerciale',
      description: 'Tarification directe sans intermédiaire spéculatif et formation active de la jeunesse technique locale.',
      fact: '+80 stagiaires / an',
      icon: Handshake,
      color: 'text-[#0B1F3A]',
      bg: 'bg-slate-100',
    },
  ];

  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          eyebrow="Gouvernance & Capital Humain"
          titleBeforeItalic="Une équipe au service de la"
          italicWord="solidité"
          titleAfterItalic="nationale"
          subtitle="Composée à plus de 95% d'ingénieurs, géologues et techniciens béninois, notre gouvernance incarne l'excellence industrielle et la responsabilité territoriale."
        />

        {/* Chiffres-clés RH & Production */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] font-playfair">500+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Collaborateurs directs & indirects</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0131FD] font-playfair">95 %</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Ingénieurs & cadres béninois</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] font-playfair">1,5 M t</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Capacité nominale par an</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] font-playfair">24 / 7</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Contrôle qualité laboratoire</div>
          </div>
        </div>

        {/* Team Grid with sober typography monogram badges */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="eyebrow text-[#0131FD]">Direction & Encadrement</span>
            <h3 className="text-2xl font-bold font-playfair text-[#0B1F3A] mt-1">
              Les membres du comité de direction
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="card-nocibe p-7 bg-white border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center font-playfair font-black text-xl shadow-md border-2 border-slate-200 shrink-0">
                      <span className="text-[#0131FD]">{member.initials[0]}</span>
                      <span>{member.initials[1]}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#0B1F3A] truncate">{member.name}</h3>
                      <div className="text-xs font-semibold text-[#0131FD]">{member.role}</div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{member.department}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                    {member.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <EnvelopeSimple size={14} className="text-[#0131FD] shrink-0" weight="bold" />
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-[#0131FD] transition truncate font-medium text-[11px] sm:text-xs"
                        title={`Écrire à ${member.name}`}
                      >
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#0131FD] shrink-0" weight="bold" />
                      <a
                        href={`tel:${member.phone.replace(/\s+/g, '')}`}
                        className="hover:text-[#0131FD] transition font-medium text-[11px] sm:text-xs"
                        title={`Appeler ${member.name}`}
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#EBF3FF] hover:bg-[#0131FD] text-[#0131FD] hover:text-white text-xs font-semibold transition-colors shadow-xs"
                      title={`Écrire à ${member.name}`}
                    >
                      <EnvelopeSimple size={14} weight="bold" />
                      <span>Écrire</span>
                    </a>
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-[#0B1F3A] text-slate-700 hover:text-white text-xs font-semibold transition-colors shadow-xs"
                      title={`Appeler ${member.name}`}
                    >
                      <Phone size={14} weight="bold" />
                      <span>Appeler</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-[#16A34A] font-semibold">
                      <ShieldCheck size={14} weight="fill" />
                      <span>Cadre Dirigeant</span>
                    </span>
                    <span>Massé / Cotonou</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section « Mission, Vision & Valeurs » (ancre #valeurs) */}
        <section id="valeurs" className="scroll-mt-28 space-y-10 pt-4">
          <div className="text-center">
            <span className="eyebrow text-[#0131FD]">Fondations Morales & Stratégiques</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-[#0B1F3A] mt-1">
              Mission, Vision & Valeurs Fondatrices
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2">
              L'ancrage territorial et la rigueur technique guident chaque décision opérationnelle de la Nouvelle Cimenterie du Bénin.
            </p>
          </div>

          {/* Mission & Vision (2 short cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-nocibe p-7 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#0131FD] flex items-center justify-center">
                  <Target size={24} weight="bold" />
                </div>
                <h4 className="text-lg font-bold text-[#0B1F3A] font-playfair">Notre Mission</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Produire localement des ciments normalisés de haute qualité pour garantir la souveraineté constructive du Bénin et fournir aux bâtisseurs des matériaux durables au prix le plus juste.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-[#0131FD]">
                <CheckCircle size={14} weight="fill" />
                <span>100% clinker cuit au Bénin</span>
              </div>
            </div>

            <div className="card-nocibe p-7 bg-white border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Compass size={24} weight="bold" />
                </div>
                <h4 className="text-lg font-bold text-[#0B1F3A] font-playfair">Notre Vision</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Devenir la référence cimentière éco-responsable de l'Afrique de l'Ouest, alliant décarbonation progressive des procédés, excellence technique et développement humain des communautés riveraines.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle size={14} weight="fill" />
                <span>Trajectoire décarbonation 2030</span>
              </div>
            </div>
          </div>

          {/* 6 Valeurs en tuiles compactes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl ${val.bg} ${val.color} flex items-center justify-center`}>
                        <IconComp size={22} weight="bold" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {val.fact}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#0B1F3A]">{val.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Commitment box */}
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="eyebrow text-slate-300">Emploi & Transmission</span>
            <h4 className="text-xl sm:text-2xl font-bold font-playfair text-white">
              500 collaborateurs directs formés aux technologies de pointe
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              NOCIBÉ forme chaque année plus de 80 jeunes diplômés issus des universités et lycées techniques du Bénin (Abomey-Calavi, Lokossa, Pobè) aux métiers de la cimenterie lourde.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
            <GraduationCap size={36} weight="duotone" />
          </div>
        </div>
      </div>
    </div>
  );
};
