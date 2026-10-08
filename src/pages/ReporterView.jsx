import React, { useState, useMemo } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import { ALL_BANGALORE_STOPS, BMTC_DEPOTS } from '../data/bengaluruRoutes';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bus, 
  ShieldAlert, 
  UserCheck, 
  Calculator, 
  Building2, 
  Archive, 
  CheckCheck, 
  Activity, 
  Phone, 
  Route, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

const COMMUTERS_PER_BUS = 65;

export default function ReporterView() {
  const { alerts, createAlert, markTripCompleted } = useDispatch();
  const { t, lang } = useLanguage();

  // Basic Form State
  const [selectedStopId, setSelectedStopId] = useState('s_nes');
  const [severity, setSeverity] = useState('Critical');
  const [passengerCount, setPassengerCount] = useState(130);
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [expandedCompletedId, setExpandedCompletedId] = useState(null);

  // Optional Custom Route Specification
  const [showCustomRoute, setShowCustomRoute] = useState(false);
  const [customOriginId, setCustomOriginId] = useState('s_nes');
  const [customDestinationId, setCustomDestinationId] = useState('s1'); // Majestic KBS default destination

  const currentStop = useMemo(
    () => ALL_BANGALORE_STOPS.find((s) => s.id === selectedStopId) || ALL_BANGALORE_STOPS[0],
    [selectedStopId]
  );

  const customOriginStop = useMemo(
    () => ALL_BANGALORE_STOPS.find((s) => s.id === customOriginId) || currentStop,
    [customOriginId, currentStop]
  );

  const customDestStop = useMemo(
    () => ALL_BANGALORE_STOPS.find((s) => s.id === customDestinationId) || ALL_BANGALORE_STOPS[0],
    [customDestinationId]
  );

  const nearestDepots = useMemo(() => {
    return BMTC_DEPOTS.map((depot) => ({
      ...depot,
      distanceKm: calculateDistanceKm(currentStop.lat, currentStop.lng, depot.lat, depot.lng),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentStop]);

  const nearestDepot = nearestDepots[0];

  const calculatedBusCount = useMemo(() => {
    const count = Number(passengerCount) || 0;
    if (count <= 0) return 1;
    return Math.max(1, Math.ceil(count / COMMUTERS_PER_BUS));
  }, [passengerCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAlert({
      stopLocation: currentStop.name,
      severity,
      passengerCount: Number(passengerCount),
      requiredBuses: calculatedBusCount,
      targetDepotNumber: nearestDepot.depotNumber,
      targetDepot: nearestDepot.name,
      depotPhone: nearestDepot.phone,
      nearestDistance: `${nearestDepot.distanceKm} km`,
      // Optional corridor details saved if enabled
      customRoute: showCustomRoute
        ? {
            origin: customOriginStop.name,
            destination: customDestStop.name,
          }
        : null,
    });
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4500);
  };

  const activeAlerts = alerts.filter((a) => a.status !== 'Completed');
  const completedAlerts = alerts.filter((a) => a.status === 'Completed');

  const getTraveledStops = (dispatch) => {
    const origin = dispatch.customRoute?.origin || dispatch.targetDepot || 'Depot Hub';
    const destination = dispatch.customRoute?.destination || dispatch.stopLocation;

    return [
      { step: 1, stop: `${origin} (${lang === 'kn' ? 'ಆರಂಭಿಕ ನಿಲ್ದಾಣ' : 'Origin Departure'})`, time: '0 mins', status: lang === 'kn' ? 'ಹೊರಟಿದೆ' : 'Departed' },
      { step: 2, stop: lang === 'kn' ? 'ಬಳ್ಳಾರಿ ರಸ್ತೆ / ಫ್ಲೈಓವರ್ ಕನೆಕ್ಟರ್' : 'Intermediate Transit Corridor', time: '+4 mins', status: lang === 'kn' ? 'ದಾಟಿದೆ' : 'Passed' },
      { step: 3, stop: `${dispatch.stopLocation} (${lang === 'kn' ? 'ಪಿಕಪ್ ನಿಲ್ದಾಣ' : 'Passenger Pickup'})`, time: '+7 mins', status: lang === 'kn' ? 'ಪ್ರಸ್ತುತ ನಿಲ್ದಾಣ' : 'Current Checkpoint' },
      { step: 4, stop: `${destination} (${lang === 'kn' ? 'ಅಂತಿಮ ತಲುಪುವ ಸ್ಥಳ' : 'Final Destination'})`, time: 'ETA: ~12 mins', status: lang === 'kn' ? 'ತಲುಪುತ್ತಿದೆ' : 'Arriving' }
    ];
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full rounded-3xl overflow-hidden p-4 md:p-8 flex flex-col justify-between">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
        {/* Left Side: Live Requests */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{t.telemetryBadge}</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t.fieldTitle}</h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{t.fieldSubtitle}</p>
          </div>

          {/* Section Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'live'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t.tabActiveTransit} ({activeAlerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Archive className="w-4 h-4 text-emerald-300" />
              <span>{t.tabCompletedArchive} ({completedAlerts.length})</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE TRANSIT */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-slate-600 animate-pulse" />
                  {lang === 'kn' ? 'ಯಾವುದೇ ಸಕ್ರಿಯ ವಿನಂತಿಗಳಿಲ್ಲ. ಬಲಭಾಗದಿಂದ ವಿನಂತಿಸಿ.' : 'No active requests. Transmit an alert on the right.'}
                </div>
              ) : (
                activeAlerts.map((dispatch) => {
                  const isAccepted = dispatch.status === 'Dispatched';
                  const isRouteOpen = expandedRouteId === (dispatch.id || dispatch._id);

                  return (
                    <div
                      key={dispatch.id || dispatch._id}
                      className="rounded-2xl p-5 border border-slate-800 bg-slate-900/90 backdrop-blur shadow-xl space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isAccepted ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                            <span className="font-bold text-white text-base">{dispatch.stopLocation}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold">
                              {dispatch.passengerCount} {t.commuters} • {dispatch.requiredBuses} {t.busesReq}
                            </span>
                          </div>
                          
                          {/* Custom Planned Route Display */}
                          {dispatch.customRoute && (
                            <div className="text-xs text-indigo-300 flex items-center gap-1.5 pt-0.5">
                              <Route className="w-3.5 h-3.5 text-indigo-400" />
                              <span>
                                {lang === 'kn' ? 'ನಿಗದಿತ ಮಾರ್ಗ:' : 'Designated Route:'}{' '}
                                <strong className="text-white">{dispatch.customRoute.origin}</strong> ➔ <strong className="text-emerald-400">{dispatch.customRoute.destination}</strong>
                              </span>
                            </div>
                          )}

                          <span className="text-xs text-slate-400 block">
                            {t.requestedDepot}: <strong className="text-indigo-300">{dispatch.targetDepotNumber} ({dispatch.targetDepot})</strong>
                          </span>
                        </div>

                        <div>
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              {t.dispatchedFrom} {dispatch.acceptedBy?.depotNumber || dispatch.targetDepotNumber}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase animate-pulse">
                              <Clock className="w-4 h-4 text-amber-400" />
                              {t.waitingOnDepot} {dispatch.targetDepotNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {isAccepted && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5 text-xs">
                              <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono text-emerald-300 font-bold">
                                <Bus className="w-4 h-4 text-emerald-400" />
                                <span>{t.busVehicle}: {dispatch.assignedBus}</span>
                              </div>

                              <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-white">
                                <UserCheck className="w-4 h-4 text-indigo-400" />
                                <span>{t.dutyPilot}: <strong>{dispatch.driverName}</strong></span>
                              </div>

                              <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-300 font-mono">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                <span>{dispatch.driverPhone}</span>
                              </div>

                              <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-300 font-bold font-mono">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>{t.liveEta}: {dispatch.eta || '8 Mins'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedRouteId(isRouteOpen ? null : (dispatch.id || dispatch._id))}
                                className="px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition"
                              >
                                <Route className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{isRouteOpen ? t.hideTraveledStops : t.viewTraveledStops}</span>
                                {isRouteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => markTripCompleted(dispatch.id || dispatch._id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>{t.completeTrip}</span>
                              </button>
                            </div>
                          </div>

                          {isRouteOpen && (
                            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                              <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 via-indigo-400 to-emerald-400">
                                {getTraveledStops(dispatch).map((stopItem) => (
                                  <div key={stopItem.step} className="relative flex items-center justify-between text-xs">
                                    <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-emerald-400" />
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-white">{stopItem.stop}</span>
                                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                                        {stopItem.status}
                                      </span>
                                    </div>
                                    <span className="font-mono text-[11px] text-indigo-300">{stopItem.time}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: COMPLETED ARCHIVE */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedAlerts.length === 0 ? (
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  {lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡ ಯಾವುದೇ ಸೇವೆಗಳಿಲ್ಲ.' : 'No completed relief tasks archived yet.'}
                </div>
              ) : (
                completedAlerts.map((completed) => (
                  <div key={completed.id || completed._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="font-bold text-white text-base">{completed.stopLocation}</span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {completed.passengerCount} {t.commutersCleared}
                          </span>
                        </div>
                        {completed.customRoute && (
                          <span className="text-xs text-indigo-300 block mt-0.5">
                            {completed.customRoute.origin} ➔ {completed.customRoute.destination}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.missionCompleted}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 font-bold block">{t.busVehicle}</span>
                        <span className="font-mono text-emerald-300 font-bold truncate block mt-0.5">
                          {completed.assignedBus}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 font-bold block">{t.dutyPilot}</span>
                        <span className="text-slate-100 font-semibold truncate block mt-0.5">
                          {completed.driverName}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 font-bold block">{t.driverMobile}</span>
                        <span className="text-slate-300 font-mono truncate block mt-0.5">
                          {completed.driverPhone}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 font-bold block">{lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡ ಸಮಯ' : 'Completed At'}</span>
                        <span className="text-emerald-400 font-mono block mt-0.5">
                          {completed.completedAt || 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Side: Broadcast Form */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                  {t.formHeaderBadge}
                </span>
                <h2 className="text-xl font-black text-white">{t.formTitle}</h2>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Surge Stop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {t.currentStop}
                </label>
                <select
                  value={selectedStopId}
                  onChange={(e) => {
                    setSelectedStopId(e.target.value);
                    setCustomOriginId(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 transition"
                >
                  {ALL_BANGALORE_STOPS.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name} ({stop.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* OPTIONAL ROUTE CORRIDOR TOGGLE (STARTING TO ENDING STOP) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {lang === 'kn' ? 'ನಿಗದಿತ ಮಾರ್ಗ ವಿವರ (ಐಚ್ಛಿಕ)' : 'Specify Transit Route Corridor'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lang === 'kn' ? 'ಆರಂಭಿಕ ಮತ್ತು ಅಂತಿಮ ನಿಲ್ದಾಣ (ಕಡ್ಡಾಯವಲ್ಲ)' : 'Start to End destination (Optional)'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCustomRoute(!showCustomRoute)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition border ${
                      showCustomRoute
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {showCustomRoute ? (lang === 'kn' ? 'ಸಕ್ರಿಯ' : 'Enabled') : (lang === 'kn' ? '+ ಸೇರಿಸಿ' : '+ Add')}
                  </button>
                </div>

                {/* Collapsible Dropdowns for Start and End Stop */}
                {showCustomRoute && (
                  <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {lang === 'kn' ? 'ಆರಂಭಿಕ ನಿಲ್ದಾಣ (Starting Stop):' : 'Starting Pickup Stop:'}
                      </label>
                      <select
                        value={customOriginId}
                        onChange={(e) => setCustomOriginId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {ALL_BANGALORE_STOPS.map((stop) => (
                          <option key={stop.id} value={stop.id}>
                            {stop.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        {lang === 'kn' ? 'ಅಂತಿಮ ತಲುಪುವ ನಿಲ್ದಾಣ (Ending Stop):' : 'Ending Destination Stop:'}
                      </label>
                      <select
                        value={customDestinationId}
                        onChange={(e) => setCustomDestinationId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        {ALL_BANGALORE_STOPS.map((stop) => (
                          <option key={stop.id} value={stop.id}>
                            {stop.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {lang === 'kn' ? 'ಬಸ್ ಮಾರ್ಗ:' : 'Route Corridor:'}{' '}
                        <strong>{customOriginStop.name}</strong> ➔ <strong>{customDestStop.name}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Priority Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">{t.surgePriority}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Moderate', label: t.moderate },
                    { key: 'Surge', label: t.surge },
                    { key: 'Critical', label: t.critical }
                  ].map((level) => (
                    <button
                      key={level.key}
                      type="button"
                      onClick={() => setSeverity(level.key)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        severity === level.key
                          ? level.key === 'Critical'
                            ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                            : level.key === 'Surge'
                            ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                            : 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commuters Waiting */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">{t.estimatedCommuters}</label>
                  <span className="text-[10px] text-slate-400 font-mono">{t.paxPerBus}</span>
                </div>
                <input
                  type="number"
                  min="20"
                  max="1500"
                  step="10"
                  required
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-mono"
                />
              </div>

              {/* Bus Sizing Box */}
              <div className="bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-indigo-400" /> {t.fleetSizing}
                  </span>
                  <span className="text-lg font-black text-white bg-indigo-600 px-3 py-0.5 rounded-lg">
                    {calculatedBusCount} {lang === 'kn' ? 'ಬಸ್‌ಗಳು' : 'Buses'}
                  </span>
                </div>
              </div>

              {/* Target Nearest Depot Card */}
              <div className="space-y-2 bg-slate-950 border border-emerald-500/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {t.targetNearestDepot}
                  </span>
                  <span className="font-bold text-white">{nearestDepot.depotNumber} ({nearestDepot.name})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>{t.roadDistance}</span>
                  <span className="font-bold text-emerald-400">{nearestDepot.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lang === 'kn' ? 'ಮೀಸಲು ಬಸ್‌ಗಳು:' : 'Available Reserve Fleet:'}</span>
                  <span className="text-indigo-300 font-semibold">{nearestDepot.busesAvailable} {t.busesReady}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 transition"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendRequestBtn} {nearestDepot.depotNumber} ({nearestDepot.name})</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
