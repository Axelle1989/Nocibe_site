import React, { useState, useRef } from 'react';
import { SITE_CONFIG, LOCATIONS } from '../config/site';
import { SectionHeader } from '../components/ui/SectionHeader';
import { LeafletMap, LeafletMapRef, MapMarkerData } from '../components/maps/LeafletMap';
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Clock,
  PaperPlaneTilt,
  Buildings,
  Factory,
  CheckCircle,
  ArrowSquareOut,
  NavigationArrow,
} from '@phosphor-icons/react';
import { api } from '../lib/api';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Demande d\'information générale');
  const [message, setMessage] = useState('');
  const [activeSite, setActiveSite] = useState<'cotonou' | 'masse'>('cotonou');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mapRef = useRef<LeafletMapRef>(null);

  const currentLocation = LOCATIONS[activeSite];

  // Specific official coordinates
  const siteCoordinates = {
    cotonou: { lat: 6.3570, lng: 2.4280, name: 'Siège & Magasin Central Cotonou (Bd de la Marina)' },
    masse: { lat: 7.0253, lng: 2.6686, name: 'Usine Intégrée de Massé (Plateau)' },
  };

  const contactMarkers: MapMarkerData[] = [
    {
      id: 'site-cotonou',
      name: 'Siège Social NOCIBÉ - Cotonou',
      lat: siteCoordinates.cotonou.lat,
      lng: siteCoordinates.cotonou.lng,
      type: 'Siège Administratif & Commercial',
      commune: 'Cotonou',
      address: 'Boulevard de la Marina, Face Direction du Port',
      phone: SITE_CONFIG.phoneMain,
      isFactory: false,
    },
    {
      id: 'site-masse',
      name: 'Usine Intégrée de Massé - NOCIBÉ',
      lat: siteCoordinates.masse.lat,
      lng: siteCoordinates.masse.lng,
      type: 'Usine Intégrée & Carrières',
      commune: 'Adja-Ouèrè / Massé',
      address: 'Zone Industrielle Cimentière de Massé',
      phone: '+229 01 47 81 67 78',
      isFactory: true,
    },
  ];

  const handleTabChange = (site: 'cotonou' | 'masse') => {
    setActiveSite(site);
    const target = siteCoordinates[site];
    if (mapRef.current) {
      mapRef.current.flyTo(target.lat, target.lng, 14);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      setErrorMsg('Veuillez renseigner tous les champs obligatoires.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.contact.submit({
        nom: fullName,
        email,
        sujet: subject,
        message: `${message}\nTéléphone : ${phone || 'Non renseigné'}`,
      });
      setIsSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l’envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCoords = siteCoordinates[activeSite];

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <SectionHeader
          eyebrow="Direction Commerciale & Usine"
          titleBeforeItalic="Contactez"
          italicWord="nous"
          titleAfterItalic="directement"
          subtitle="Notre équipe commerciale et technique est à votre disposition pour toute commande, conseil technique ou partenariat industriel."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h3 className="text-xl font-bold font-playfair text-[#0B1F3A] mb-1">
              Envoyer un message officiel
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Remplissez les informations ci-dessous pour transmettre directement votre message à la direction commerciale et logistique NOCIBÉ.
            </p>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle size={44} weight="fill" className="text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-lg">Message officiel transmis avec succès !</h4>
                <p className="text-sm text-emerald-800">
                  Votre message a bien été enregistré. Notre équipe commerciale vous répondra dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Envoyer un nouveau message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                      Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex : Brice Houndégla"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                      Numéro de Téléphone (Bénin 10 chiffres) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+229 01 47 81 67 78"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                      Adresse Email professionnelle
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="b.houndegla@entreprise.bj"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                      Objet de votre demande *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD] bg-white"
                    >
                      <option value="Demande d'information générale">Information générale</option>
                      <option value="Commande de ciment vrac ou sacs">Commande de ciment (vrac ou sacs)</option>
                      <option value="Demande de cotation B2B grand chantier">Cotation grand chantier BTP</option>
                      <option value="Assistance technique dosage béton">Assistance technique laboratoire</option>
                      <option value="Candidature & Ressources Humaines">Candidature & Emploi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1F3A] mb-1">
                    Votre message ou détail du chantier *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre besoin : type de ciment souhaité (CPJ 35, CPJ 45, CPA 55), volume estimé, localisation du chantier et délais de livraison..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <PaperPlaneTilt size={18} weight="bold" />
                    <span>{isSubmitting ? 'Transmission en cours...' : 'Envoyer le message officiel'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Implantation Details & Leaflet Map with Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tabs switcher: Siège Cotonou vs Usine de Massé */}
            <div className="flex rounded-2xl bg-slate-200/80 p-1">
              <button
                type="button"
                onClick={() => handleTabChange('cotonou')}
                className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeSite === 'cotonou'
                    ? 'bg-white text-[#0B1F3A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                <Buildings size={16} weight="bold" />
                <span>Siège Cotonou</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('masse')}
                className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeSite === 'masse'
                    ? 'bg-white text-[#0B1F3A] shadow-sm'
                    : 'text-slate-600 hover:text-[#0B1F3A]'
                }`}
              >
                <Factory size={16} weight="bold" />
                <span>Usine de Massé</span>
              </button>
            </div>

            {/* Site Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] text-[#0131FD] flex items-center justify-center shrink-0">
                  {activeSite === 'cotonou' ? (
                    <Buildings size={22} weight="duotone" />
                  ) : (
                    <Factory size={22} weight="duotone" />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0B1F3A]">{currentLocation.name}</h4>
                  <span className="text-xs text-slate-500">{currentLocation.cityOrCommune} &bull; Dépt. {currentLocation.department}</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} weight="fill" className="text-[#0131FD] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{currentLocation.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} weight="fill" className="text-[#0131FD] shrink-0" />
                  <a
                    href={`tel:${currentLocation.phone.replace(/\s+/g, '')}`}
                    className="font-bold text-[#0B1F3A] hover:text-[#0131FD] transition"
                  >
                    {currentLocation.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <EnvelopeSimple size={16} weight="bold" className="text-slate-400 shrink-0" />
                  <a href={`mailto:${currentLocation.email}`} className="text-slate-600 hover:text-[#0131FD] transition">
                    {currentLocation.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} weight="bold" className="text-slate-400 shrink-0" />
                  <span>{currentLocation.openingHours}</span>
                </div>
              </div>

              {/* Site Features / Certifications */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                {currentLocation.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                    <CheckCircle size={14} weight="fill" className="text-[#16A34A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Leaflet Map with OpenStreetMap and OSRM Itinerary */}
              <div className="pt-2 border-t border-slate-100">
                <LeafletMap
                  ref={mapRef}
                  markers={contactMarkers}
                  center={[currentCoords.lat, currentCoords.lng]}
                  zoom={14}
                  height="300px"
                  destinationForRoute={{
                    lat: currentCoords.lat,
                    lng: currentCoords.lng,
                    name: currentCoords.name,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
