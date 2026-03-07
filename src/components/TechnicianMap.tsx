import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, PlaneTakeoff, User, Shield, Star } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 4.0511,
  lng: 9.7085
};

const mapOptions = {
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#212121" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#bdbdbd" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#181818" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1b1b1b" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#2c2c2c" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8a8a8a" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [{ "color": "#373737" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#3c3c3c" }]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [{ "color": "#4e4e4e" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#757575" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#000000" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#3d3d3d" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

interface TechnicianMapProps {
  technicians: any[];
  drones: any[];
}

const TechnicianMap: React.FC<TechnicianMapProps> = ({ technicians, drones }) => {
  const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Chargement de la carte...</span>
      </div>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Technician Markers */}
      {technicians.map((tech) => (
        <Marker
          key={`tech-${tech.id}`}
          position={tech.coords || { lat: 4.05 + Math.random() * 0.02, lng: 9.7 + Math.random() * 0.02 }}
          onClick={() => setSelectedMarker({ ...tech, type: 'tech' })}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: tech.status === 'Available' ? '#10b981' : '#f59e0b',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 8,
          }}
        />
      ))}

      {/* Drone Markers */}
      {drones.map((drone) => (
        <Marker
          key={`drone-${drone.id}`}
          position={drone.coords || { lat: 4.05 + Math.random() * 0.02, lng: 9.7 + Math.random() * 0.02 }}
          onClick={() => setSelectedMarker({ ...drone, type: 'drone' })}
          icon={{
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 6,
            rotation: 45
          }}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.coords || { lat: 4.05, lng: 9.7 }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="p-2 min-w-[200px] text-slate-900">
            <div className="flex items-center gap-3 mb-2">
              {selectedMarker.type === 'tech' ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                  <img src={selectedMarker.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <PlaneTakeoff size={20} />
                </div>
              )}
              <div>
                <div className="font-bold text-sm">{selectedMarker.name || selectedMarker.project}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">
                  {selectedMarker.type === 'tech' ? selectedMarker.skill : 'Drone Mission'}
                </div>
              </div>
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Status</span>
                <span className={`font-bold ${selectedMarker.status === 'Available' || selectedMarker.status === 'Live' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedMarker.status}
                </span>
              </div>
              {selectedMarker.type === 'tech' && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Rating</span>
                  <div className="flex items-center gap-0.5 font-bold">
                    <Star size={8} className="fill-amber-500 text-amber-500" />
                    {selectedMarker.rating}
                  </div>
                </div>
              )}
              {selectedMarker.type === 'drone' && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Battery</span>
                  <span className="font-bold">{selectedMarker.battery}%</span>
                </div>
              )}
            </div>

            {selectedMarker.type === 'tech' && selectedMarker.status === 'Available' && (
              <button className="w-full py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 transition-all">
                Réserver Technicien
              </button>
            )}
            {selectedMarker.type === 'drone' && (
              <button className="w-full py-1.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold hover:bg-blue-600 transition-all">
                Voir Flux Vidéo
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default TechnicianMap;
