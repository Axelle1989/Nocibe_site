import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  CalendarBlank,
  Clock,
  MapPin,
  ArrowLeft,
  ShareNetwork,
  DownloadSimple,
  Check,
  CheckCircle,
  Users,
  Buildings,
  NavigationArrow,
} from '@phosphor-icons/react';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.news.getEventBySlug(slug);
        if (res?.event) {
          setEvent(res.event);
        }
      } catch (err) {
        console.error('Erreur chargement événement:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIcs = () => {
    if (!event) return;
    const start = new Date(event.dateDebut);
    const end = event.dateFin ? new Date(event.dateFin) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const formatIcsDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NOCIBE//Evenements//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:nocibe-evt-${event.id}@nocibe-benin.bj`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${event.titre}`,
      `DESCRIPTION:${event.descriptionCourte.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.lieu} - ${event.adresse || ''}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nocibe_${event.slug || 'evenement'}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center">
        <div className="w-8 h-8 border-3 border-[#0131FD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Chargement de l'événement...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-full bg-[#F8FAFC] py-20 text-center max-w-xl mx-auto px-4">
        <h2 className="text-xl font-bold text-slate-800">Événement introuvable</h2>
        <p className="text-xs text-slate-500 mt-2">Cet événement n'existe pas ou a été déplacé.</p>
        <Link
          to="/actualites/evenements"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0131FD] text-white text-xs font-bold"
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Retour à l'agenda</span>
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.dateDebut);
  const endDate = event.dateFin ? new Date(event.dateFin) : null;

  return (
    <div className="w-full bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation haute */}
        <div className="flex items-center justify-between gap-4 text-xs">
          <Link
            to="/actualites/evenements"
            className="inline-flex items-center gap-1.5 font-bold text-[#0131FD] hover:underline"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Tous les événements</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-[#0131FD] transition text-[11px] font-semibold flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" weight="bold" />
                  <span className="text-emerald-700">Lien copié</span>
                </>
              ) : (
                <>
                  <ShareNetwork size={14} />
                  <span>Partager</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="px-3.5 py-1.5 rounded-lg bg-[#0131FD] hover:bg-[#0026C7] text-white transition text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>Ajouter à mon calendrier (.ics)</span>
            </button>
          </div>
        </div>

        {/* CARTE PRINCIPALE */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0131FD]">
              {event.typeEvenement}
            </span>
            {event.inscriptionRequise && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Inscription obligatoire
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#07142A] leading-tight">
            {event.titre}
          </h1>

          {/* Grille Date, Heure, Lieu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0131FD] shadow-xs">
                <CalendarBlank size={20} weight="bold" />
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Date</span>
                <p className="font-bold text-[#07142A] text-xs sm:text-sm mt-0.5">
                  {startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0131FD] shadow-xs">
                <Clock size={20} weight="bold" />
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Horaire</span>
                <p className="font-bold text-[#07142A] text-xs sm:text-sm mt-0.5">
                  {startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {endDate && ` - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0131FD] shadow-xs">
                <MapPin size={20} weight="bold" />
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Lieu</span>
                <p className="font-bold text-[#07142A] text-xs sm:text-sm mt-0.5">{event.lieu}</p>
                {event.adresse && <p className="text-[11px] text-slate-500 mt-0.5">{event.adresse}</p>}
              </div>
            </div>
          </div>

          {/* Contenu et programme */}
          <div className="space-y-6 pt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#07142A] mb-2">À propos de cet événement</h2>
              <p className="leading-relaxed whitespace-pre-line">{event.descriptionCourte}</p>
            </div>

            {event.programme && (
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                <h3 className="font-serif text-base font-bold text-[#07142A] flex items-center gap-2">
                  <Clock size={18} className="text-[#0131FD]" />
                  <span>Programme indicatif de la rencontre</span>
                </h3>
                <div className="text-xs sm:text-sm space-y-2 text-slate-700">
                  {Array.isArray(event.programme) ? (
                    event.programme.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={15} className="text-[#0131FD] shrink-0 mt-0.5" weight="fill" />
                        <span>{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="whitespace-pre-line">{event.programme}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA Inscription / Calendrier */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Télécharger l'invitation (.ics)</span>
            </button>

            {event.inscriptionRequise && event.lienInscription ? (
              <a
                href={event.lienInscription}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition text-center shadow-md"
              >
                S'inscrire à l'événement
              </a>
            ) : (
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold transition text-center shadow-md"
              >
                Nous contacter pour cet événement
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

