import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { api } from '../../lib/api';
import {
  MagnifyingGlass,
  MapPin,
  Briefcase,
  CalendarBlank,
  CaretRight,
  Sparkle,
  Funnel,
  Buildings,
  CheckCircle,
} from '@phosphor-icons/react';

interface JobOffer {
  id: string;
  titre: string;
  slug: string;
  reference: string;
  departement: string;
  lieu: string;
  typeContrat: string;
  statut: string;
  estUrgent: boolean;
  dateLimite: string | null;
  experienceRequise: string | null;
  niveauEtudes: string | null;
  descriptionCourte: string;
}

export const JobOffersPage: React.FC = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedSector, setSelectedSector] = useState('Tous');
  const [selectedLocation, setSelectedLocation] = useState('Tous');

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await api.careers.getOffers({
          search: search || undefined,
          type: selectedType,
          secteur: selectedSector,
          lieu: selectedLocation,
        });
        if (res?.offers) {
          setOffers(res.offers);
        }
      } catch (err) {
        console.error('Erreur chargement offres:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchOffers, 250);
    return () => clearTimeout(timer);
  }, [search, selectedType, selectedSector, selectedLocation]);

  const contractTypeLabel = (type: string) => {
    switch (type) {
      case 'CDI':
        return 'CDI';
      case 'CDD':
        return 'CDD';
      case 'STAGE_ACADEMIQUE':
        return 'Stage Académique';
      case 'STAGE_PROFESSIONNEL':
        return 'Stage Professionnel';
      case 'VIE':
        return 'V.I.E';
      case 'ALTERNANCE':
        return 'Alternance';
      default:
        return type;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <SectionHeader
            eyebrow="Recrutement NOCIBÉ"
            titleBeforeItalic="Nos offres d'"
            italicWord="emploi"
            titleAfterItalic="& de stages"
            subtitle="Consultez nos postes ouverts et rejoignez un leader cimentier engagé pour le développement du Bénin."
          />
        </div>

        {/* BARRE DE FILTRES */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Recherche */}
            <div className="relative md:col-span-1">
              <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par titre ou mot-clé..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD] focus:bg-white transition"
              />
            </div>

            {/* Type de contrat */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                aria-label="Filtrer par type de contrat"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD] focus:bg-white transition"
              >
                <option value="Tous">Tous les contrats</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="STAGE_ACADEMIQUE">Stage Académique</option>
                <option value="STAGE_PROFESSIONNEL">Stage Professionnel</option>
                <option value="ALTERNANCE">Alternance</option>
              </select>
            </div>

            {/* Secteur */}
            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                aria-label="Filtrer par secteur ou département"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD] focus:bg-white transition"
              >
                <option value="Tous">Tous les secteurs</option>
                <option value="Production">Production & Exploitation</option>
                <option value="Maintenance">Maintenance & Travaux neufs</option>
                <option value="Qualité">Qualité, R&D & Laboratoire</option>
                <option value="Logistique">Logistique & Supply Chain</option>
                <option value="Commercial">Commercial & Ventes</option>
                <option value="Support">Fonctions support & RH</option>
              </select>
            </div>

            {/* Localisation */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filtrer par lieu"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD] focus:bg-white transition"
              >
                <option value="Tous">Toutes les localisations</option>
                <option value="Massé">Massé (Usine / Pobè)</option>
                <option value="Cotonou">Cotonou (Siège commercial)</option>
                <option value="Parakou">Parakou (Dépôt Nord)</option>
                <option value="Port">Port Autonome de Cotonou</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              <strong>{offers.length}</strong> offre{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}
            </span>
            <Link
              to="/carrieres/postuler"
              className="text-[#0131FD] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Aucune offre ne correspond ? Déposer une candidature spontanée</span>
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>
        </div>

        {/* LISTE DES OFFRES */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Chargement des offres en cours...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Aucune offre ne correspond à vos critères</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
              Essayez de réinitialiser vos filtres ou envoyez-nous directement votre candidature spontanée.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedType('Tous');
                  setSelectedSector('Tous');
                  setSelectedLocation('Tous');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Réinitialiser les filtres
              </button>
              <Link
                to="/carrieres/postuler"
                className="px-4 py-2 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition"
              >
                Candidature spontanée
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0131FD]/40 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Badges en-tête */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0131FD]">
                      {contractTypeLabel(offer.typeContrat)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {offer.departement}
                    </span>
                    {offer.estUrgent && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 inline-flex items-center gap-1">
                        <Sparkle size={12} weight="fill" />
                        <span>Recrutement urgent</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#07142A] group-hover:text-[#0131FD] transition line-clamp-2">
                    {offer.titre}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {offer.descriptionCourte}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-[11px] text-slate-500">
                    <div className="inline-flex items-center gap-1.5 mr-4">
                      <MapPin size={14} className="text-[#0131FD]" />
                      <span>{offer.lieu}</span>
                    </div>
                    {offer.dateLimite && (
                      <div className="inline-flex items-center gap-1.5">
                        <CalendarBlank size={14} className="text-slate-400" />
                        <span>Date limite : {new Date(offer.dateLimite).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/carrieres/offres/${offer.slug}`}
                    className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-[#0131FD] text-[#07142A] hover:text-white text-xs font-bold transition inline-flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Voir l'offre</span>
                    <CaretRight size={14} weight="bold" />
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

export default JobOffersPage;

