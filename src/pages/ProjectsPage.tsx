import React, { useState } from 'react';
import { PROJECTS } from '../data/projects';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SafeImage } from '../components/ui/SafeImage';
import { MapPin } from '@phosphor-icons/react';

interface ProjectsPageProps {
  onOpenQuote: () => void;
}

type ProjectCategory = 'Tous' | 'Infrastructure' | 'Industrie' | 'Portuaire' | 'Édifices publics' | 'Routier';

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenQuote }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('Tous');

  const categories: ProjectCategory[] = [
    'Tous',
    'Infrastructure',
    'Industrie',
    'Portuaire',
    'Édifices publics',
    'Routier'
  ];

  const filteredProjects = activeCategory === 'Tous'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          eyebrow="Ouvrages d'Art & Bâtiments d'Envergure"
          titleBeforeItalic="Nos"
          italicWord="Réalisations"
          titleAfterItalic="au Bénin"
          subtitle="Explorez les ponts, autoroutes, quais portuaires et ensembles industriels coulés avec les ciments certifiés NOCIBÉ."
        />

        {/* Categories Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                activeCategory === cat
                  ? 'bg-[#0B1F3A] text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card-nocibe overflow-hidden bg-white flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 select-none">
                  <SafeImage
                    src={project.image}
                    alt={project.title}
                    fallbackTitle={project.title}
                    fallbackCategory={project.category}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105 pointer-events-none select-none"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {project.category}
                  </div>
                  {project.chiffreCle && (
                    <div className="absolute bottom-3 right-3 bg-[#0131FD] text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
                      {project.chiffreCle}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} weight="fill" className="text-[#0131FD]" />
                    <span>{project.location}</span>
                    <span>&bull;</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B1F3A] mb-2 leading-snug group-hover:text-[#0131FD] transition">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A]">
                  <span>Formulation : {project.cimentUtilise}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold font-playfair">
            Vous avez un projet de construction ou d'infrastructure ?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Nos ingénieurs technico-commerciaux vous accompagnent sur les dosages optimaux et la logistique directe sur votre chantier.
          </p>
          <button
            type="button"
            onClick={onOpenQuote}
            className="btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            Demande de devis B2B
          </button>
        </div>
      </div>
    </div>
  );
};

