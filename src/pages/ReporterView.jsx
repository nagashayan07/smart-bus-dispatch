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
  ArrowRight,
  Users,
  Compass,
  AlertTriangle
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
  const { alerts, createAlert, markTripCompleted, passengerRequests } = useDispatch();
  const { t, lang } = useLanguage();

  const [selectedStopId, setSelectedStopId] = useState('s_nes');
  const [severity, setSeverity] = useState('Critical');
  const [passengerCount, setPassengerCount] = useState(130);
  const [activeTab, setActiveTab] = useState('live');
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  // Optional Custom Route Specification
  const [showCustomRoute, setShowCustomRoute] = useState(false);
  const [customOriginId, setCustomOriginId] = useState('s_nes');
  const [customDestinationId, setCustomDestinationId] = useState('s1');

  // Segregate pending vs completed passenger requests automatically
  const pendingPassengerDemands = passengerRequests.filter((r) => r.status !== 'Completed');
  const completedPassengerDemands = passengerRequests.filter((r) => r.status === 'Completed');

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

  const isInvalidRoute = showCustomRoute && customOriginId === customDestinationId;

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

  const handleAdoptPassengerRoute = (req) => {
    const foundOrigin = ALL_BANGALORE_STOPS.find((s) => s.name === req.origin);
    const foundDest = ALL_BANGALORE_STOPS.find((s) => s.name === req.destination);
    if (foundOrigin) setSelectedStopId(foundOrigin.id);
    if (foundOrigin) setCustomOriginId(foundOrigin.id);
    if (foundDest) setCustomDestinationId(foundDest.id);
    setShowCustomRoute(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalidRoute) return;

    createAlert({
      stopLocation: currentStop.name,
      severity,
      passengerCount: Number(passengerCount),
      requiredBuses: calculatedBusCount,
      targetDepotNumber: nearestDepot.depotNumber,
      targetDepot: nearestDepot.name,
      depotPhone: nearestDepot.phone,
      nearestDistance: `${nearestDepot.distanceKm} km`,
      customRoute: showCustomRoute
        ? {
            origin: customOriginStop.name,
            destination: customDestStop.name,
          }
        : null,
    });
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* HEADER & PENDING COMMUTER DEMANDS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{t.telemetryBadge}</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t.fieldTitle}</h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{t.fieldSubtitle}</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {lang === 'kn' ? 'ಬಾಕಿ ಇರುವ ಪ್ರಯಾಣಿಕರ ಬೇಡಿಕೆಗಳು' : 'Pending Passenger Requests'}
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {pendingPassengerDemands.length} {lang === 'kn' ? 'ಬಾಕಿ ಇವೆ' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>

        {/* COMMUTER DEMAND QUEUE: ONLY SHOWS ACTIVE/PENDING DEMANDS */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಲೈವ್ ಪ್ರಯಾಣ ಬೇಡಿಕೆಗಳು' : 'Live Commuter Route Demands'}
              </h3>
            </div>
            {pendingPassengerDemands.length > 0 && (
              <span className="text-[11px] text-slate-400">
                {lang === 'kn' ? 'ಬಸ್ ನಿಲ್ದಾಣ ತಲುಪಿದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತೆರವುಗೊಳ್ಳುತ್ತದೆ' : 'Auto-clears once relief bus reaches stop'}
              </span>
            )}
          </div>

          {pendingPassengerDemands.length === 0 ? (
            <div className="bg-slate-950/70 border border-dashed border-emerald-500/30 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto" />
              <div className="text-xs font-bold text-white">
                {lang === 'kn'
                  ? 'ಯಾವುದೇ ಬಾಕಿ ಬೇಡಿಕೆಗಳಿಲ್ಲ — ಎಲ್ಲಾ ಪ್ರಯಾಣಿಕರ ಬೇಡಿಕೆಗಳಿಗೆ ಬಸ್‌ಗಳು ತಲುಪಿವೆ!'
                  : 'All Passenger Requests Cleared — Relief Buses Reached Stops!'}
              </div>
              <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                {lang === 'kn'
                  ? 'ಯಾವುದಾದರೂ ಪ್ರಯಾಣಿಕರು ಹೊಸ ಮಾರ್ಗವನ್ನು ಕೋರಿದಾಗ ಮಾತ್ರ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.'
                  : 'When passengers submit new travel requests, they will automatically appear here until served.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingPassengerDemands.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl space-y-2 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-900">
                      <span className="font-bold text-white truncate max-w-[120px]">{req.passengerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{req.time}</span>
                    </div>

                    <div className="mt-2 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-emerald-400 font-semibold truncate text-[11px]">{req.origin}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-300">
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                        <span className="font-semibold truncate text-[11px]">{req.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-mono font-bold">
                      {req.groupCount} Pax
                    </span>

                    <button
                      onClick={() => handleAdoptPassengerRoute(req)}
                      title="Adopt this route into dispatch form"
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3" />
                      <span>{lang === 'kn' ? 'ಅಳವಡಿಸಿ' : 'Adopt'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DISPATCH CONTROLS & ACTIVE MISSION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Active Relief Transits & Archive */}
        <div className="lg:col-span-7 space-y-6">
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
                          
                          {dispatch.customRoute && (
                            <div className="text-xs text-indigo-300 flex items-center gap-1.5 pt-0.5">
                              <Route className="w-3.5 h-3.5 text-indigo-400" />
                              <span>
                                {lang === 'kn' ? 'ನಿಗದಿತ ಮಾರ್ಗ:' : 'Designated Corridor:'}{' '}
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

          {/* COMPLETED ARCHIVE: SHOWS COMPLETED BUS MISSIONS AND SERVED PASSENGERS */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              {/* Completed Bus Dispatches */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'kn' ? 'ಪೂರ್ಣಗೊಂಡ ಪರಿಹಾರ ಕಾರ್ಯಾಚರಣೆಗಳು' : 'Fulfilled Bus Missions'} ({completedAlerts.length})
                </span>

                {completedAlerts.length === 0 ? (
                  <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಪೂರ್ಣಗೊಂಡ ಸೇವೆಗಳಿಲ್ಲ.' : 'No completed relief tasks archived yet.'}
                  </div>
                ) : (
                  completedAlerts.map((completed) => (
                    <div key={completed.id || completed._id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="font-bold text-white text-base">{completed.stopLocation}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                              {completed.passengerCount} {t.commutersCleared}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.missionCompleted}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">{t.busVehicle}</span>
                          <span className="font-mono text-emerald-300 font-bold truncate block mt-0.5">
                            {completed.assignedBus}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">{t.dutyPilot}</span>
                          <span className="text-slate-100 font-semibold truncate block mt-0.5">
                            {completed.driverName}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 font-bold block">{t.driverMobile}</span>
                          <span className="text-slate-300 font-mono truncate block mt-0.5">
                            {completed.driverPhone}
                          </span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
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

              {/* Automatically Fulfilled Passenger Demands */}
              {completedPassengerDemands.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {lang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತೆರವುಗೊಳಿಸಲಾದ ಪ್ರಯಾಣಿಕರ ಕೋರಿಕೆಗಳು' : 'Auto-Fulfilled Commuter Requests'} ({completedPassengerDemands.length})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {completedPassengerDemands.map((pax) => (
                      <div key={pax.id} className="bg-slate-950 border border-emerald-500/30 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-bold text-white">{pax.passengerName}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">Fulfilled</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {pax.origin} ➔ {pax.destination} ({pax.groupCount} Pax)
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Cleared by: {pax.clearedByBus} @ {pax.completedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Broadcast Surge Form */}
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

              {/* Optional Corridor Selector */}
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

                    {isInvalidRoute ? (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <div>
                          <strong className="block font-bold">
                            {lang === 'kn' ? 'ತಪ್ಪಾದ ಮಾರ್ಗ ಆಯ್ಕೆ!' : 'Invalid Transit Route!'}
                          </strong>
                          <span className="text-[11px] text-rose-200/90">
                            {lang === 'kn'
                              ? 'ಆರಂಭಿಕ ಮತ್ತು ಅಂತಿಮ ನಿಲ್ದಾಣಗಳು ಒಂದೇ ಆಗಿರಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ತಲುಪುವ ನಿಲ್ದಾಣವನ್ನು ಆರಿಸಿ.'
                              : 'Starting stop and ending destination cannot be the same. Please choose a different destination stop.'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>
                          {lang === 'kn' ? 'ಬಸ್ ಮಾರ್ಗ:' : 'Route Corridor:'}{' '}
                          <strong>{customOriginStop.name}</strong> ➔ <strong>{customDestStop.name}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Priority */}
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

              {/* Sizing Box */}
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

              {/* Nearest Depot Card */}
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

              {isInvalidRoute ? (
                <div className="w-full py-3.5 px-4 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-300 text-center font-bold flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>
                    {lang === 'kn'
                      ? 'ಆರಂಭಿಕ ಮತ್ತು ಅಂತಿಮ ನಿಲ್ದಾಣಗಳು ಒಂದೇ ಆಗಿವೆ — ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ'
                      : 'Origin and Destination are identical — Cannot transmit request'}
                  </span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendRequestBtn} {nearestDepot.depotNumber} ({nearestDepot.name})</span>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
