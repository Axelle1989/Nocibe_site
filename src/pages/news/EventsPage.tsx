import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { api } from '../../lib/api';
import {
  CalendarBlank,
  Clock,
  MapPin,
  CaretRight,
  ArrowLeft,
  Sparkle,
  HardHat,
  Ticket,
} from '@phosphor-icons/react';

interface EventItem {
  id: string;
  titre: string;
  slug: string;
  typeEvenement: string;
  dateDebut: string;
  dateFin: string | null;
  lieu: string;
  adresse: string | null;
  descriptionCourte: string;
  statut: string;
  inscriptionRequise: boolean;
  lienInscription: string | null;
}

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.news.getEvents();
        if (res?.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error('Erreur chargement événements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.dateDebut) >= now);
  const pastEvents = events.filter((e) => new Date(e.dateDebut) < now);

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const eventTypeLabel = (type: string) => {
    switch (type) {
      case 'SALON_BTP':
        return 'Salon & Foire BTP';
      case 'PORTES_OUVERTES':
        return 'Portes Ouvertes Usine';
      case 'SEMINAIRE':
        return 'Séminaire Professionnel';
      case 'RSE_COMMUNAUTE':
        return 'Action RSE & Environnement';
      case 'FORMATION':
        return 'Formation Technique';
      default:
        return type;
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
            eyebrow="Agenda & Rencontres Industrielles"
            titleBeforeItalic="Les Événements"
            italicWord="NOCIBÉ"
            titleAfterItalic="au Bénin"
            subtitle="Salons professionnels, journées portes ouvertes de l'usine de Massé, formations maçonniques et actions citoyennes."
          />
        </div>

        {/* ONGLETS À VENIR / PASSÉS */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-[#0131FD] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-[#0131FD] border border-slate-200'
              }`}
            >
              <CalendarBlank size={16} weight="bold" />
              <span>Événements à venir ({upcomingEvents.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-[#0131FD] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-[#0131FD] border border-slate-200'
              }`}
            >
              <Clock size={16} weight="bold" />
              <span>Événements passés ({pastEvents.length})</span>
            </button>
          </div>
        </div>

        {/* LISTE DES ÉVÉNEMENTS */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Chargement du calendrier des événements...</p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CalendarBlank size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              {activeTab === 'upcoming' ? 'Aucun événement à venir pour le moment' : 'Aucun événement passé enregistré'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Revenez bientôt consulter les prochaines dates de rencontres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedEvents.map((evt) => {
              const startDate = new Date(evt.dateDebut);
              const dayStr = startDate.toLocaleDateString('fr-FR', { day: 'numeric' });
              const monthStr = startDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#0131FD]/30 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {/* Date block */}
                      <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1F3A] to-[#0131FD] text-white flex flex-col items-center justify-center shadow-md">
                        <span className="text-xl font-black font-serif leading-none">{dayStr}</span>
                        <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5 text-[#00CCFF]">{monthStr}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0131FD]">
                            {eventTypeLabel(evt.typeEvenement)}
                          </span>
                          {evt.inscriptionRequise && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              Sur inscription
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#07142A] group-hover:text-[#0131FD] transition line-clamp-2">
                          {evt.titre}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {evt.descriptionCourte}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#0131FD]" />
                        <span>{evt.lieu}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>{startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <Link
                      to={`/actualites/evenements/${evt.slug}`}
                      className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-[#0131FD] text-[#07142A] hover:text-white font-bold transition inline-flex items-center gap-1.5"
                    >
                      <span>Détails & Agenda</span>
                      <CaretRight size={13} weight="bold" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

