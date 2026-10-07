import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ALL_BANGALORE_STOPS, BMTC_DEPOTS } from '../data/bengaluruRoutes';
import { Navigation, ArrowRightLeft, Clock, MapPin, Gauge, Compass } from 'lucide-react';

const createStopIcon = (color, text) =>
  L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${color};
      width: 26px;
      height: 26px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">${text}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

const depotIcon = L.divIcon({
  className: 'depot-icon',
  html: `<div style="
    background-color: #7c3aed;
    width: 28px;
    height: 28px;
    border: 2px solid #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    box-shadow: 0 2px 10px rgba(124,58,237,0.7);
  ">DEP</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Auto-adjust map bounds to fit the generated route
function RouteFitter({ origin, destination, roadCoords }) {
  const map = useMap();
  useEffect(() => {
    if (roadCoords && roadCoords.length > 0) {
      const bounds = L.latLngBounds(roadCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [origin, destination, roadCoords, map]);
  return null;
}

export default function DriverRouteMap() {
  const [originId, setOriginId] = useState('s1'); // Majestic KBS
  const [destId, setDestId] = useState('s15');    // Electronic City Toll
  const [roadCoordinates, setRoadCoordinates] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMins, setDurationMins] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const originStop = ALL_BANGALORE_STOPS.find((s) => s.id === originId) || ALL_BANGALORE_STOPS[0];
  const destStop = ALL_BANGALORE_STOPS.find((s) => s.id === destId) || ALL_BANGALORE_STOPS[1];

  // Fetch true turn-by-turn road route via OSRM public engine
  useEffect(() => {
    if (!originStop || !destStop || originStop.id === destStop.id) {
      setRoadCoordinates([]);
      setDistanceKm(0);
      setDurationMins(0);
      return;
    }

    setLoadingRoute(true);
    const url = `https://router.project-osrm.org/route/v1/driving/${originStop.lng},${originStop.lat};${destStop.lng},${destStop.lat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          // OSRM returns [longitude, latitude] -> Leaflet requires [latitude, longitude]
          const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          setRoadCoordinates(coords);
          setDistanceKm((route.distance / 1000).toFixed(1));
          setDurationMins(Math.round(route.duration / 60));
        } else {
          // Fallback direct line
          setRoadCoordinates([
            [originStop.lat, originStop.lng],
            [destStop.lat, destStop.lng],
          ]);
        }
      })
      .catch((err) => {
        console.error('OSRM route fetch failed, using direct line fallback:', err);
        setRoadCoordinates([
          [originStop.lat, originStop.lng],
          [destStop.lat, destStop.lng],
        ]);
      })
      .finally(() => setLoadingRoute(false));
  }, [originId, destId]);

  const handleSwap = () => {
    setOriginId(destId);
    setDestId(originId);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col space-y-0">
      {/* Route Selector Controls */}
      <div className="p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">BMTC Driver Route Navigator</h2>
            </div>
            <p className="text-xs text-slate-400">Select any source and destination stop across Bengaluru</p>
          </div>

          {/* Source & Destination Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Starting Stop
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                {ALL_BANGALORE_STOPS.map((stop) => (
                  <option key={`orig-${stop.id}`} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              title="Swap Origin and Destination"
              className="mt-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Destination Stop
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-indigo-500"
              >
                {ALL_BANGALORE_STOPS.map((stop) => (
                  <option key={`dest-${stop.id}`} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Trip Stat Metric Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Trip Corridor:</span>
            <span className="font-bold text-white">
              {originStop.name} ➔ {destStop.name}
            </span>
            {loadingRoute && <span className="text-indigo-400 animate-pulse text-[11px]">(Recalculating road path...)</span>}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <Gauge className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-400">Driving Distance:</span>
              <span className="font-bold text-white">{distanceKm ? `${distanceKm} km` : '--'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Estimated Travel Time:</span>
              <span className="font-bold text-white">{durationMins ? `~${durationMins} mins` : '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="h-[520px] w-full relative z-0">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#e2e8f0' }}
        >
          {/* Detailed Bengaluru OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <RouteFitter origin={originStop} destination={destStop} roadCoords={roadCoordinates} />

          {/* Active Navigation Polyline following real roads */}
          {roadCoordinates.length > 0 && (
            <Polyline
              positions={roadCoordinates}
              pathOptions={{
                color: '#2563eb',
                weight: 6,
                opacity: 0.9,
              }}
            />
          )}

          {/* Origin Stop Marker */}
          <Marker position={[originStop.lat, originStop.lng]} icon={createStopIcon('#10b981', 'A')}>
            <Popup>
              <div className="text-slate-900 font-sans text-xs">
                <div className="font-bold text-emerald-700 text-sm">START: {originStop.name}</div>
                <div className="text-slate-600 font-medium">Zone: {originStop.zone}</div>
              </div>
            </Popup>
          </Marker>

          {/* Destination Stop Marker */}
          <Marker position={[destStop.lat, destStop.lng]} icon={createStopIcon('#ef4444', 'B')}>
            <Popup>
              <div className="text-slate-900 font-sans text-xs">
                <div className="font-bold text-rose-700 text-sm">DESTINATION: {destStop.name}</div>
                <div className="text-slate-600 font-medium">Zone: {destStop.zone}</div>
              </div>
            </Popup>
          </Marker>

          {/* Render All other stops as clickable blue waypoints */}
          {ALL_BANGALORE_STOPS.filter((s) => s.id !== originId && s.id !== destId).map((stop) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createStopIcon('#3b82f6', '•')}>
              <Popup>
                <div className="text-slate-900 font-sans text-xs">
                  <div className="font-bold text-indigo-700">{stop.name}</div>
                  <div className="text-slate-600 font-medium">{stop.zone} Zone Stop</div>
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => setOriginId(stop.id)}
                      className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                    >
                      Set Origin
                    </button>
                    <button
                      onClick={() => setDestId(stop.id)}
                      className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                    >
                      Set Dest
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render BMTC Depots */}
          {BMTC_DEPOTS.map((depot) => (
            <Marker key={depot.id} position={[depot.lat, depot.lng]} icon={depotIcon}>
              <Popup>
                <div className="text-slate-900 text-xs font-sans">
                  <div className="font-bold text-purple-700">{depot.name}</div>
                  <div className="text-slate-600 mt-1 font-semibold">Reserve Fleet: {depot.busesAvailable} Buses Ready</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Driver Guidance Banner */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Origin (A)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Destination (B)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Intermediate Stops (Clickable)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-purple-600"></span> BMTC Depots</span>
        </div>
        <div className="text-slate-500">Live BMTC GIS Navigation Service</div>
      </div>
    </div>
  );
}
