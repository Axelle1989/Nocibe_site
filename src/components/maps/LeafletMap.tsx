import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  NavigationArrow,
  Crosshair,
  Clock,
  RoadHorizon,
  ArrowSquareOut,
  Info,
} from '@phosphor-icons/react';

// Fix Leaflet's default marker asset URLs to local static assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
});

// Custom factory / central depot icon (Brand Navy & Blue)
const createBrandIcon = (isFactory = false, isUser = false) => {
  if (isUser) {
    return L.divIcon({
      className: 'user-pin',
      html: `
        <div style="
          width: 28px;
          height: 28px;
          background-color: #0131FD;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(1, 49, 253, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  }

  const bg = isFactory ? '#0B1F3A' : '#0131FD';
  const label = isFactory ? '🏭' : '📍';

  return L.divIcon({
    className: 'nocibe-pin',
    html: `
      <div style="
        background: ${bg};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(11, 31, 58, 0.35);
        border: 2px solid #ffffff;
      ">
        <span style="transform: rotate(45deg); font-size: 14px;">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export interface MapMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type?: string;
  commune?: string;
  address?: string;
  phone?: string;
  isFactory?: boolean;
}

export interface LeafletMapRef {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  invalidateSize: () => void;
}

interface LeafletMapProps {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: MapMarkerData) => void;
  showRoutingUI?: boolean;
  destinationForRoute?: { lat: number; lng: number; name: string } | null;
}

// Controller to fly to position and trigger invalidateSize
function MapController({
  center,
  zoom,
  triggerInvalidate,
}: {
  center?: [number, number];
  zoom?: number;
  triggerInvalidate?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);
    return () => clearTimeout(timer);
  }, [map, triggerInvalidate]);

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 14, { duration: 1 });
    }
  }, [center, zoom, map]);

  return null;
}

// Map click handler to set user starting point when geolocation is refused
function MapClickHandler({ onLocationPicked }: { onLocationPicked: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationPicked(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      markers,
      center = [7.0253, 2.6686], // Default: Usine de Massé
      zoom = 12,
      height = '380px',
      selectedMarkerId,
      onSelectMarker,
      showRoutingUI = true,
      destinationForRoute,
    },
    ref
  ) => {
    const [currentCenter, setCurrentCenter] = useState<[number, number]>(center);
    const [currentZoom, setCurrentZoom] = useState<number>(zoom);
    const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isSelectingOnMap, setIsSelectingOnMap] = useState(false);

    // Route state
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [routeSummary, setRouteSummary] = useState<{ distanceKm: number; durationMin: number } | null>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const [routeError, setRouteError] = useState<string | null>(null);

    // Expose imperative methods to parent
    useImperativeHandle(ref, () => ({
      flyTo: (lat: number, lng: number, customZoom = 14) => {
        setCurrentCenter([lat, lng]);
        setCurrentZoom(customZoom);
      },
      invalidateSize: () => {
        // Will trigger MapController
        setCurrentCenter((prev) => [...prev]);
      },
    }));

    // Read stored user position from localStorage on mount
    useEffect(() => {
      try {
        const stored = localStorage.getItem('nocibe_user_position');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
            setUserPosition({ lat: parsed.lat, lng: parsed.lng });
          }
        }
      } catch (e) {
        // Ignore JSON error
      }
    }, []);

    // Keep center synced if prop changes
    useEffect(() => {
      if (center) {
        setCurrentCenter(center);
        setCurrentZoom(zoom);
      }
    }, [center[0], center[1], zoom]);

    // Handle "Ma position" button
    const handleGetLocation = () => {
      if (!navigator.geolocation) {
        setGeoError('La géolocalisation n\'est pas prise en charge par votre navigateur.');
        return;
      }
      setIsLocating(true);
      setGeoError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserPosition(coords);
          try {
            localStorage.setItem('nocibe_user_position', JSON.stringify(coords));
          } catch (e) {
            // ignore
          }
          setCurrentCenter([coords.lat, coords.lng]);
          setCurrentZoom(14);
        },
        (err) => {
          setIsLocating(false);
          if (err.code === err.PERMISSION_DENIED) {
            setGeoError('Autorisation de géolocalisation refusée. Cliquez sur la carte pour définir votre point de départ.');
            setIsSelectingOnMap(true);
          } else if (err.code === err.TIMEOUT) {
            setGeoError('Délai d\'attente dépassé pour la position. Veuillez réessayer.');
          } else {
            setGeoError('Impossible de récupérer votre position actuelle.');
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    };

    // Calculate OSRM Route
    const handleCalculateRoute = async (targetDest?: { lat: number; lng: number; name: string }) => {
      const dest = targetDest || destinationForRoute || (markers.length > 0 ? markers[0] : null);
      if (!dest) {
        setRouteError('Aucune destination sélectionnée.');
        return;
      }
      if (!userPosition) {
        setRouteError('Veuillez d\'abord définir votre position (« Ma position » ou clic sur la carte).');
        return;
      }

      setIsLoadingRoute(true);
      setRouteError(null);

      try {
        // Call public OSRM router
        const url = `https://router.project-osrm.org/route/v1/driving/${userPosition.lng},${userPosition.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erreur de calcul d\'itinéraire OSRM');
        const data = await res.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] // GeoJSON is [lng, lat], Leaflet is [lat, lng]
          );
          setRouteCoords(coords);
          setRouteSummary({
            distanceKm: Math.round((route.distance / 1000) * 10) / 10,
            durationMin: Math.round(route.duration / 60),
          });

          // Center map around midpoint
          if (coords.length > 0) {
            const mid = coords[Math.floor(coords.length / 2)];
            setCurrentCenter(mid);
            setCurrentZoom(10);
          }
        } else {
          throw new Error('Aucun itinéraire routier trouvé.');
        }
      } catch (err: any) {
        console.warn('OSRM route fetch failed:', err);
        setRouteError('Impossible de calculer le tracé automatique. Utilisez le lien de secours ci-dessous.');
      } finally {
        setIsLoadingRoute(false);
      }
    };

    const handleClearRoute = () => {
      setRouteCoords([]);
      setRouteSummary(null);
      setRouteError(null);
    };

    const activeDest = destinationForRoute || (markers.length > 0 ? markers[0] : null);

    return (
      <div className="space-y-3">
        {/* Routing controls toolbar if enabled */}
        {showRoutingUI && (
          <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="btn-primary py-2 px-3 text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                title="Détecter ma position actuelle"
              >
                <Crosshair size={15} weight="bold" className={isLocating ? 'animate-spin' : ''} />
                <span>{isLocating ? 'Recherche...' : userPosition ? 'Position trouvée ✓' : 'Ma position'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCalculateRoute()}
                disabled={!userPosition || isLoadingRoute}
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-[#0B1F3A] hover:bg-[#162E52] text-white flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <NavigationArrow size={15} weight="bold" />
                <span>{isLoadingRoute ? 'Calcul...' : 'Tracer l\'itinéraire'}</span>
              </button>

              {routeCoords.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRoute}
                  className="py-2 px-2.5 text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  Effacer
                </button>
              )}

              {isSelectingOnMap && (
                <span className="text-[11px] text-[#0131FD] font-semibold flex items-center gap-1 animate-pulse">
                  <Info size={14} />
                  <span>Cliquez sur la carte pour choisir votre départ</span>
                </span>
              )}
            </div>

            {/* External fallback map link */}
            {activeDest && (
              <a
                href={
                  userPosition
                    ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userPosition.lat}%2C${userPosition.lng}%3B${activeDest.lat}%2C${activeDest.lng}`
                    : `https://www.openstreetmap.org/?mlat=${activeDest.lat}&mlon=${activeDest.lng}#map=14/${activeDest.lat}/${activeDest.lng}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-[#0131FD] inline-flex items-center gap-1 font-semibold ml-auto"
                title="Ouvrir dans OpenStreetMap"
              >
                <span>Ouvrir dans cartes</span>
                <ArrowSquareOut size={13} weight="bold" />
              </a>
            )}
          </div>
        )}

        {/* Route Info Badge */}
        {routeSummary && (
          <div className="bg-[#EBF3FF] border border-[#0131FD]/30 p-3 rounded-xl flex items-center justify-between text-xs text-[#0B1F3A] animate-in fade-in">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-[#0131FD]">
                <RoadHorizon size={16} weight="bold" />
                <span>Distance : {routeSummary.distanceKm} km</span>
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Clock size={16} weight="bold" />
                <span>
                  Durée estimée : {Math.floor(routeSummary.durationMin / 60) > 0 ? `${Math.floor(routeSummary.durationMin / 60)}h ` : ''}
                  {routeSummary.durationMin % 60} min
                </span>
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Tracé en direct via OSRM</span>
          </div>
        )}

        {/* Geolocation feedback error if any */}
        {geoError && (
          <div className="bg-amber-50 text-amber-800 text-xs p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
            <span>{geoError}</span>
            <button
              type="button"
              onClick={() => setGeoError(null)}
              className="text-amber-900 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Map Container */}
        <div
          style={{ height }}
          className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0"
        >
          <MapContainer
            center={currentCenter}
            zoom={currentZoom}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* OpenStreetMap public tiles - Free, reliable, zero API key required */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            <MapController center={currentCenter} zoom={currentZoom} />

            {/* Click to select starting position handler */}
            <MapClickHandler
              onLocationPicked={(lat, lng) => {
                const picked = { lat, lng };
                setUserPosition(picked);
                setIsSelectingOnMap(false);
                setGeoError(null);
                try {
                  localStorage.setItem('nocibe_user_position', JSON.stringify(picked));
                } catch (e) {
                  // ignore
                }
              }}
            />

            {/* User Position Marker */}
            {userPosition && (
              <Marker
                position={[userPosition.lat, userPosition.lng]}
                icon={createBrandIcon(false, true)}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <strong className="text-[#0131FD] block">Votre position</strong>
                    <span>Point de départ pour l'itinéraire</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination Outlets & Sites */}
            {markers.map((marker) => {
              const isSelected = selectedMarkerId === marker.id;
              return (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={createBrandIcon(marker.isFactory || marker.id.includes('masse'))}
                  eventHandlers={{
                    click: () => {
                      if (onSelectMarker) onSelectMarker(marker);
                    },
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 p-1 max-w-[200px]">
                      <span className="font-bold text-[#0B1F3A] block">{marker.name}</span>
                      {marker.type && (
                        <span className="text-[10px] uppercase font-bold text-[#0131FD] block">
                          {marker.type}
                        </span>
                      )}
                      {marker.address && <p className="text-slate-600 text-[11px]">{marker.address}</p>}
                      {marker.phone && (
                        <a
                          href={`tel:${marker.phone.replace(/\s+/g, '')}`}
                          className="text-[#0131FD] font-semibold text-[11px] block"
                        >
                          {marker.phone}
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCalculateRoute(marker)}
                        className="mt-2 w-full btn-primary py-1 px-2 text-[10px] font-bold rounded-lg"
                      >
                        Tracer vers ce site
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* OSRM Route Polyline */}
            {routeCoords.length > 0 && (
              <Polyline
                positions={routeCoords}
                pathOptions={{
                  color: '#0131FD',
                  weight: 5,
                  opacity: 0.85,
                  lineJoin: 'round',
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    );
  }
);

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;

