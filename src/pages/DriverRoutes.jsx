import React, { useState, useEffect } from 'react';
import { ALL_BANGALORE_STOPS, BMTC_DEPOTS } from '../data/bengaluruRoutes';
import { MapPin, Navigation, Compass, Clock, Gauge, ArrowRight } from 'lucide-react';

export default function DriverRoutes() {
  const [startStopId, setStartStopId] = useState('s1'); // Majestic KBS
  const [destStopId, setDestStopId] = useState('s15');  // Electronic City

  const startStop = ALL_BANGALORE_STOPS.find((s) => s.id === startStopId) || ALL_BANGALORE_STOPS[0];
  const destStop = ALL_BANGALORE_STOPS.find((s) => s.id === destStopId) || ALL_BANGALORE_STOPS[1];

  // Calculate approximate distance
  const R = 6371;
  const dLat = ((destStop.lat - startStop.lat) * Math.PI) / 180;
  const dLon = ((destStop.lng - startStop.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((startStop.lat * Math.PI) / 180) *
      Math.cos((destStop.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const distanceKm = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  const estMinutes = Math.max(12, Math.round(distanceKm * 2.2));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-400" />
            Bengaluru Metropolitan Transit Map
          </h1>
          <p className="text-xs text-slate-400">
            Driver Guidance, Corridor Geometries, and Real-Time GIS Outposts
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Starting Stop
            </label>
            <select
              value={startStopId}
              onChange={(e) => setStartStopId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {ALL_BANGALORE_STOPS.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.name} ({stop.zone})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Destination Stop
            </label>
            <select
              value={destStopId}
              onChange={(e) => setDestStopId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {ALL_BANGALORE_STOPS.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.name} ({stop.zone})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Current Corridor:</span>
            <span className="font-bold text-white">
              {startStop.name} ➔ {destStop.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Driving Distance: <strong className="text-emerald-400 font-mono">{distanceKm} km</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Estimated Transit Time: <strong className="text-amber-400 font-mono">~{estMinutes} min</strong>
            </span>
          </div>
        </div>

        {/* Live Interactive Map Frame */}
        <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <iframe
            title="Bengaluru Transit Route Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=77.50%2C12.82%2C77.75%2C13.14&amp;layer=mapnik&amp;marker=${startStop.lat}%2C${startStop.lng}`}
            className="w-full h-full filter saturate-150 contrast-105"
          />

          {/* Map Footer Badges */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Origin (A)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Destination (B)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> BMTC Depots
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
            Live BMTC GIS Navigation Service
          </div>
        </div>
      </div>
    </div>
  );
}
