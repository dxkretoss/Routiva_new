import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { getLocationCoords } from '../lib/geoUtils';

// Fix Leaflet Default Marker Icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Colored SVG Marker Factory
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #090d16;
        font-weight: 800;
        font-size: 11px;
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export default function LeafletRouteMap({ 
  startLocation = 'Nikol', 
  destLocation = 'Thaltej', 
  routePoints = [], 
  preferredPickups = [],
  preferredDrops = [],
  height = '360px',
  highlightSegment = null
}) {
  const startCoord = getLocationCoords(startLocation);
  const destCoord = getLocationCoords(destLocation);

  // Build sequenced coordinates list
  const fullCoordinates = [
    [startCoord.lat, startCoord.lng],
    ...routePoints.map(p => {
      const c = p.lat && p.lng ? { lat: Number(p.lat), lng: Number(p.lng) } : getLocationCoords(p.name);
      return [c.lat, c.lng];
    }),
    [destCoord.lat, destCoord.lng]
  ];

  // Center on midpoint
  const centerLat = (startCoord.lat + destCoord.lat) / 2;
  const centerLng = (startCoord.lng + destCoord.lng) / 2;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-dark-border relative z-0">
      <MapContainer
        center={[centerLat || 23.0450, centerLng || 72.5800]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start Point Marker */}
        <Marker position={[startCoord.lat, startCoord.lng]} icon={createCustomIcon('#10b981', 'S')}>
          <Popup>
            <div className="text-xs">
              <strong className="text-brand-400 block">Origin:</strong>
              {startLocation}
            </div>
          </Popup>
        </Marker>

        {/* Intermediate Sequenced Route Points */}
        {routePoints.map((pt, idx) => {
          const c = pt.lat && pt.lng ? { lat: Number(pt.lat), lng: Number(pt.lng) } : getLocationCoords(pt.name);
          return (
            <Marker key={pt.name || idx} position={[c.lat, c.lng]} icon={createCustomIcon('#6ee7b7', idx + 1)}>
              <Popup>
                <div className="text-xs">
                  <strong className="text-emerald-300 block">Stop #{idx + 1}:</strong>
                  {pt.name}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Preferred Pickup Locations (Amber/Orange) */}
        {preferredPickups.map((p, idx) => {
          const c = p.latitude && p.longitude ? { lat: Number(p.latitude), lng: Number(p.longitude) } : getLocationCoords(p.name);
          return (
            <React.Fragment key={`pref_pick_${idx}`}>
              <Marker position={[c.lat, c.lng]} icon={createCustomIcon('#f59e0b', 'P')}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-amber-400 block">Preferred Pickup:</strong>
                    {p.name}
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[c.lat, c.lng]}
                radius={1500}
                pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1, weight: 1, dashArray: '4, 4' }}
              />
            </React.Fragment>
          );
        })}

        {/* Preferred Drop Locations (Sky Blue) */}
        {preferredDrops.map((p, idx) => {
          const c = p.latitude && p.longitude ? { lat: Number(p.latitude), lng: Number(p.longitude) } : getLocationCoords(p.name);
          return (
            <React.Fragment key={`pref_drop_${idx}`}>
              <Marker position={[c.lat, c.lng]} icon={createCustomIcon('#38bdf8', 'D')}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-sky-400 block">Preferred Drop:</strong>
                    {p.name}
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[c.lat, c.lng]}
                radius={1500}
                pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.1, weight: 1, dashArray: '4, 4' }}
              />
            </React.Fragment>
          );
        })}

        {/* Destination Marker */}
        <Marker position={[destCoord.lat, destCoord.lng]} icon={createCustomIcon('#f43f5e', 'E')}>
          <Popup>
            <div className="text-xs">
              <strong className="text-rose-400 block">Destination:</strong>
              {destLocation}
            </div>
          </Popup>
        </Marker>

        {/* Full Route Polyline */}
        <Polyline
          positions={fullCoordinates}
          pathOptions={{
            color: '#10b981',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8'
          }}
        />
      </MapContainer>
    </div>
  );
}
