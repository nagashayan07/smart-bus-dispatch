import React, { useState, useMemo } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { ALL_BANGALORE_STOPS, BMTC_DEPOTS } from '../data/bengaluruRoutes';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bus, 
  ShieldAlert, 
  Navigation, 
  Phone, 
  UserCheck, 
  Calculator, 
  Building2, 
  Archive, 
  CheckCheck, 
  Activity, 
  PhoneCall, 
  XCircle, 
  ArrowRight,
  RotateCw,
  Route,
  ChevronDown,
  ChevronUp,
  Milestone,
  Layers
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
  const [selectedStopId, setSelectedStopId] = useState('s_nes'); // NES Yelahanka
  const [severity, setSeverity] = useState('Critical');
  const [passengerCount, setPassengerCount] = useState(130); // 2 buses demand
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [expandedCompletedId, setExpandedCompletedId] = useState(null);

  const currentStop = useMemo(
    () => ALL_BANGALORE_STOPS.find((s) => s.id === selectedStopId) || ALL_BANGALORE_STOPS[0],
    [selectedStopId]
  );

  const nearestDepots = useMemo(() => {
    return BMTC_DEPOTS.map((depot) => ({
      ...depot,
      distanceKm: calculateDistanceKm(currentStop.lat, currentStop.lng, depot.lat, depot.lng),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentStop]);

  const nearestDepot = nearestDepots[0];
  const nextBackupDepot = nearestDepots[1];

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
    });
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4500);
  };

  const activeAlerts = alerts.filter((a) => a.status !== 'Completed');
  const completedAlerts = alerts.filter((a) => a.status === 'Completed');

  const getTraveledStops = (originDepot, destination) => {
    return [
      { step: 1, stop: `${originDepot} (Departure Bay)`, time: '0 mins', status: 'Departed' },
      { step: 2, stop: 'Bellary Road / Flyover Connector', time: '+4 mins', status: 'Passed' },
      { step: 3, stop: 'Yelahanka Police Station Circle', time: '+7 mins', status: 'Current Checkpoint' },
      { step: 4, stop: `${destination} (Commuter Terminal)`, time: 'ETA: 8-9 mins', status: 'Arriving' }
    ];
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full rounded-3xl overflow-hidden p-4 md:p-8 flex flex-col justify-between">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-20 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/40 pointer-events-none" />

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
        {/* Left Side: Live Multi-Depot Fleet Tracker */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>BMTC Multi-Depot Fleet Dispatch Matrix</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Field Dispatch & Multi-Depot Tracker
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              When relief demand exceeds a single depot reserve, the load is split automatically across the nearest depots.
            </p>
          </div>

          {/* Tabs */}
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
              <span>Active Relief Transit ({activeAlerts.length})</span>
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
              <span>Completed Operations Archive ({completedAlerts.length})</span>
            </button>
          </div>

          {/* ACTIVE DISPATCHES TAB */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-slate-600 animate-pulse" />
                  No pending requests. Transmit an alert on the right to start dispatch.
                </div>
              ) : (
                activeAlerts.map((dispatch) => {
                  const waves = dispatch.dispatchedWaves || [];
                  const isFullySatisfied = dispatch.status === 'Dispatched';
                  const remainingNeeded = dispatch.requiredBuses - (dispatch.fulfilledBuses || 0);
                  const isRouteOpen = expandedRouteId === (dispatch.id || dispatch._id);

                  return (
                    <div
                      key={dispatch.id || dispatch._id}
                      className="rounded-2xl p-5 border border-slate-800 bg-slate-900/90 backdrop-blur shadow-xl space-y-4"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isFullySatisfied ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                            <span className="font-bold text-white text-base">{dispatch.stopLocation}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold">
                              Total Demand: {dispatch.requiredBuses} Buses
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 block">
                            Fulfilled so far: <strong className="text-emerald-400">{dispatch.fulfilledBuses || 0}</strong> of {dispatch.requiredBuses} Buses
                          </span>
                        </div>

                        {/* Top Pill */}
                        <div>
                          {isFullySatisfied ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ALL {dispatch.requiredBuses} BUSES DISPATCHED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase animate-pulse">
                              <Clock className="w-4 h-4 text-amber-400" />
                              {remainingNeeded} BUS FORWARDED TO {dispatch.targetDepotNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* DISPATCHED WAVES BREAKDOWN (SHOWS EACH DEPOT'S CONTRIBUTION) */}
                      {waves.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            Dispatched Fleet Waves:
                          </span>

                          <div className="space-y-2">
                            {waves.map((wave) => (
                              <div
                                key={wave.waveNumber}
                                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black text-[10px]">
                                      WAVE {wave.waveNumber}
                                    </span>
                                    <span className="font-bold text-white">
                                      {wave.busesSent} Bus from {wave.depotNumber} ({wave.depotName})
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                                    ETA: {wave.eta}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-900">
                                  <div className="text-slate-300 flex items-center gap-1">
                                    <Bus className="w-3.5 h-3.5 text-indigo-400" />
                                    <strong className="font-mono text-emerald-400">{wave.assignedBus}</strong>
                                  </div>
                                  <div className="text-slate-300 flex items-center gap-1">
                                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{wave.driverName}</span>
                                  </div>
                                  <div className="text-slate-400 flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{wave.driverPhone}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* IF PARTIAL: SHOW NEXT DEPOT NOTICE */}
                      {remainingNeeded > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <RotateCw className="w-4 h-4 animate-spin text-amber-400" />
                            <span>
                              Remaining <strong>{remainingNeeded} Bus</strong> request auto-forwarded to next depot: <strong>{dispatch.targetDepotNumber} ({dispatch.targetDepot})</strong>
                            </span>
                          </div>
                          <span className="text-[10px] font-mono bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700">
                            Awaiting Pickup
                          </span>
                        </div>
                      )}

                      {/* TRAVELED STOPS EXPANDER */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          onClick={() => setExpandedRouteId(isRouteOpen ? null : (dispatch.id || dispatch._id))}
                          className="px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Route className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isRouteOpen ? 'Hide Traveled Stops' : 'View Traveled Stops Timeline'}</span>
                          {isRouteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => markTripCompleted(dispatch.id || dispatch._id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Complete & Archive Trip</span>
                        </button>
                      </div>

                      {isRouteOpen && (
                        <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                              <Navigation className="w-4 h-4 text-emerald-400" />
                              Corridor & Intermediate Stops Traveled:
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">Live Telemetry Progression</span>
                          </div>

                          <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 via-indigo-400 to-emerald-400">
                            {getTraveledStops(waves[0]?.depotName || dispatch.targetDepot, dispatch.stopLocation).map((stopItem) => (
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
                  );
                })
              )}
            </div>
          )}

          {/* COMPLETED TAB */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedAlerts.length === 0 ? (
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  No completed relief tasks archived yet.
                </div>
              ) : (
                completedAlerts.map((completed) => {
                  const isCompletedRouteOpen = expandedCompletedId === (completed.id || completed._id);
                  const waves = completed.dispatchedWaves || [];

                  return (
                    <div
                      key={completed.id || completed._id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur shadow-xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="font-bold text-white text-base">{completed.stopLocation}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              {completed.passengerCount} Commuters Cleared
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 block mt-1">
                            Dispatched: {completed.requiredBuses} Buses across {waves.length > 0 ? `${waves.length} Depots/Waves` : 'Nearest Depot'}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          MISSION COMPLETED
                        </span>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">Vehicle</span>
                          <span className="font-mono text-emerald-300 font-bold truncate block mt-0.5">
                            {completed.assignedBus || waves[0]?.assignedBus || 'KA-04-F-8821'}
                          </span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">Duty Pilot</span>
                          <span className="text-slate-100 font-semibold truncate block mt-0.5">
                            {completed.driverName || waves[0]?.driverName || 'Manjunath Swamy'}
                          </span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">Driver Mobile</span>
                          <span className="text-slate-300 font-mono truncate block mt-0.5">
                            {completed.driverPhone || waves[0]?.driverPhone || '+91 94480 55112'}
                          </span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">Completed At</span>
                          <span className="text-emerald-400 font-mono block mt-0.5">
                            {completed.completedAt || 'Recently'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setExpandedCompletedId(isCompletedRouteOpen ? null : (completed.id || completed._id))}
                          className="px-3.5 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Route className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isCompletedRouteOpen ? 'Hide Traveled Stops' : 'View Traveled Stops'}</span>
                          {isCompletedRouteOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {isCompletedRouteOpen && (
                        <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150">
                          <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 to-indigo-500">
                            {getTraveledStops(waves[0]?.depotName || 'Depot', completed.stopLocation).map((stopItem) => (
                              <div key={stopItem.step} className="relative flex items-center justify-between text-xs">
                                <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-emerald-400" />
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">{stopItem.stop}</span>
                                  <span className="text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
                                    {stopItem.status}
                                  </span>
                                </div>
                                <span className="font-mono text-[11px] text-slate-400">{stopItem.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
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
                  Field Terminal Transmission
                </span>
                <h2 className="text-xl font-black text-white">Broadcast Crowd Surge</h2>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            {submittedMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Demand sent to nearest depot: {nearestDepot.depotNumber} ({nearestDepot.name})!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Current Bus Stop
                </label>
                <select
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 transition"
                >
                  {ALL_BANGALORE_STOPS.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name} ({stop.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Surge Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Moderate', 'Surge', 'Critical'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeverity(level)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        severity === level
                          ? level === 'Critical'
                            ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                            : level === 'Surge'
                            ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                            : 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Estimated Commuters Waiting</label>
                  <span className="text-[10px] text-slate-400 font-mono">~{COMMUTERS_PER_BUS} pax / bus</span>
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

              <div className="bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-indigo-400" /> Fleet Sizing Recommendation
                  </span>
                  <span className="text-lg font-black text-white bg-indigo-600 px-3 py-0.5 rounded-lg">
                    {calculatedBusCount} Buses
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Target capacity: {calculatedBusCount * COMMUTERS_PER_BUS} passengers</p>
              </div>

              <div className="space-y-2 bg-slate-950 border border-emerald-500/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Primary Depot (Nearest):
                  </span>
                  <span className="font-bold text-white">{nearestDepot.depotNumber} ({nearestDepot.name})</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Distance:</span>
                  <span className="font-bold text-emerald-400">{nearestDepot.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Backup Failover Depot:</span>
                  <span className="text-indigo-300 font-semibold">{nextBackupDepot.depotNumber} ({nextBackupDepot.name})</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Request for {calculatedBusCount} Buses</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
