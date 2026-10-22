import React, { useState, useRef } from 'react';
import { OUTLETS, Outlet } from '../data/outlets';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LeafletMap, LeafletMapRef, MapMarkerData } from '../components/maps/LeafletMap';
import {
  MapPin,
  Phone,
  Clock,
  NavigationArrow,
  CheckCircle,
  MagnifyingGlass,
  MapTrifold,
  Crosshair,
  Factory,
  Buildings,
} from '@phosphor-icons/react';
import { IconCementBag } from '../components/icons/IndustryIcons';

interface OutletsPageProps {
  onOpenQuote: () => void;
}

export const OutletsPage: React.FC<OutletsPageProps> = ({ onOpenQuote }) => {
  const [selectedDept, setSelectedDept] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);

  const mapRef = useRef<LeafletMapRef>(null);

  const departments = ['Tous', 'Plateau', 'Littoral', 'Atlantique', 'Ouémé', 'Zou', 'Borgou', 'Mono', 'Atacora'];

  const filteredOutlets = OUTLETS.filter((o) => {
    const matchesDept = selectedDept === 'Tous' || o.department === selectedDept;
    const matchesQuery =
      searchQuery === '' ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.commune.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const markers: MapMarkerData[] = OUTLETS.map((o) => ({
    id: o.id,
    name: o.name,
    lat: o.lat,
    lng: o.lng,
    type: o.type,
    commune: o.commune,
    address: o.address,
    phone: o.phone,
    isFactory: o.id === 'depot-masse',
  }));

  const handleCenterMasse = () => {
    const masse = OUTLETS.find((o) => o.id === 'depot-masse');
    if (masse && mapRef.current) {
      setSelectedOutletId(masse.id);
      mapRef.current.flyTo(masse.lat, masse.lng, 15);
    }
  };

  const handleCenterCotonou = () => {
    const cot = OUTLETS.find((o) => o.id === 'depot-cotonou-port');
    if (cot && mapRef.current) {
      setSelectedOutletId(cot.id);
      mapRef.current.flyTo(cot.lat, cot.lng, 15);
    }
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutletId(outlet.id);
    if (mapRef.current) {
      mapRef.current.flyTo(outlet.lat, outlet.lng, 15);
    }
    // Scroll map into view gently if on mobile
    if (window.innerWidth < 768) {
      const mapElement = document.getElementById('carte-nationale-nocibe');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const activeOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0];

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          eyebrow="Réseau de Distribution & Dépôts Nationaux"
          titleBeforeItalic="Où acheter du ciment"
          italicWord="NOCIBÉ"
          titleAfterItalic="au Bénin"
          subtitle="Trouvez le dépôt d'usine ou le distributeur agréé le plus proche de votre chantier pour un approvisionnement immédiat, avec calcul d'itinéraire direct."
        />

        {/* National Interactive Leaflet Map Card */}
        <div id="carte-nationale-nocibe" className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <MapTrifold size={22} weight="bold" className="text-[#0131FD]" />
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">
                  Carte Interactive des Dépôts du Bénin
                </h3>
                <span className="text-[11px] text-slate-500">
                  Cartographie officielle OpenStreetMap &bull; 8 points de distribution certifiés
                </span>
              </div>
            </div>

            {/* Quick recenter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCenterMasse}
                className="btn-marine py-2 px-3 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                title="Recentrer sur l'usine de Massé"
              >
                <Factory size={15} weight="bold" />
                <span>Usine de Massé</span>
              </button>

              <button
                type="button"
                onClick={handleCenterCotonou}
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] flex items-center gap-1.5 transition-colors border border-slate-200"
                title="Recentrer sur le siège de Cotonou"
              >
                <Buildings size={15} weight="bold" />
                <span>Siège Cotonou</span>
              </button>
            </div>
          </div>

          {/* Leaflet Map with national zoom and OSRM routing */}
          <LeafletMap
            ref={mapRef}
            markers={markers}
            center={[8.0, 2.3]} // Center of Benin
            zoom={7}
            height="420px"
            selectedMarkerId={selectedOutletId}
            onSelectMarker={(m) => setSelectedOutletId(m.id)}
            destinationForRoute={{
              lat: activeOutlet.lat,
              lng: activeOutlet.lng,
              name: activeOutlet.name,
            }}
          />
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Department pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedDept === dept
                    ? 'bg-[#0131FD] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <MagnifyingGlass size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une ville, département..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
            />
          </div>
        </div>

        {/* Outlets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutlets.map((outlet) => {
            const isSelected = selectedOutletId === outlet.id;
            return (
              <div
                key={outlet.id}
                onClick={() => handleSelectOutlet(outlet)}
                className={`card-nocibe p-6 bg-white border flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[#0131FD] ring-2 ring-[#0131FD]/20 shadow-lg scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        outlet.type === "Dépôt d'Usine Direct"
                          ? 'bg-[#EBF3FF] text-[#0131FD]'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {outlet.type}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Dépt. {outlet.department}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0B1F3A] mb-1 leading-snug">
                    {outlet.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#0131FD] mb-3">
                    {outlet.commune}
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin size={15} weight="fill" className="text-[#0131FD] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{outlet.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={15} weight="fill" className="text-[#0131FD] shrink-0" />
                      <a
                        href={`tel:${outlet.phone.replace(/\s+/g, '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-[#0B1F3A] hover:text-[#0131FD] transition"
                      >
                        {outlet.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={15} weight="bold" className="shrink-0" />
                      <span className="text-[11px]">{outlet.openingHours}</span>
                    </div>
                  </div>

                  {/* Stocks available */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                      Ciments disponibles sur parc :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {outlet.stocks.map((stk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          <CheckCircle size={12} weight="fill" className="text-[#16A34A]" />
                          <span>{stk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#0131FD] font-semibold inline-flex items-center gap-1">
                    <NavigationArrow size={14} weight="bold" />
                    <span>Voir sur la carte</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOutlet(outlet);
                    }}
                    className="btn-primary py-1.5 px-3 text-[11px] font-bold rounded-lg"
                  >
                    Itinéraire direct
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOutlets.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">
              Aucun dépôt ne correspond à votre recherche pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletsPage;
