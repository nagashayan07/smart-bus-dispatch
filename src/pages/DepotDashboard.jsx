import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import { BMTC_DEPOTS } from '../data/bengaluruRoutes';
import {
  Building2,
  Bus,
  CheckCircle2,
  Clock,
  Send,
  X,
  Phone,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers,
  Milestone
} from 'lucide-react';

export default function DepotDashboard() {
  const { alerts, acceptAlert } = useDispatch();
  const { lang } = useLanguage();

  const [selectedDepotNumber, setSelectedDepotNumber] = useState('Depot #09');
  const [activeModalAlert, setActiveModalAlert] = useState(null);

  // Modal Form Inputs
  const [busesToSend, setBusesToSend] = useState(1);
  const [busRegistration, setBusRegistration] = useState('KA-04-F-8513 (Depot #09 Volvo)');
  const [driverName, setDriverName] = useState('Manjunath Swamy (DRV-512)');
  const [driverPhone, setDriverPhone] = useState('+91 94480 55112');
  const [etaMinutes, setEtaMinutes] = useState('8 Mins');

  const currentDepot = BMTC_DEPOTS.find((d) => d.depotNumber === selectedDepotNumber) || BMTC_DEPOTS[0];

  const handleOpenDispatchModal = (alert) => {
    setActiveModalAlert(alert);
    const maxBuses = Math.min(alert.requiredBuses || 1, currentDepot.busesAvailable || 2);
    setBusesToSend(maxBuses > 0 ? maxBuses : 1);
    setBusRegistration(`KA-04-F-${Math.floor(1000 + Math.random() * 9000)} (${currentDepot.depotNumber} Express)`);
  };

  const handleConfirmDispatch = (e) => {
    if (e) e.preventDefault();
    if (!activeModalAlert) return;

    const alertId = activeModalAlert.id || activeModalAlert._id;

    acceptAlert(alertId, {
      assignedBus: busRegistration,
      driverName: driverName,
      driverPhone: driverPhone,
      eta: etaMinutes,
      dispatchedBusesCount: Number(busesToSend),
      acceptedBy: {
        depotNumber: currentDepot.depotNumber,
        depotName: currentDepot.name,
      },
    });

    // Close modal
    setActiveModalAlert(null);
  };

  // Pending alerts specifically targeting this depot or in pending state
  const pendingRequests = alerts.filter(
    (a) => a.status === 'Pending' && (a.targetDepotNumber === currentDepot.depotNumber || !a.targetDepotNumber)
  );

  const activeDispatches = alerts.filter(
    (a) => a.status === 'Dispatched' && (a.targetDepotNumber === currentDepot.depotNumber || a.acceptedBy?.depotNumber === currentDepot.depotNumber)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Depot Selector Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {lang === 'kn' ? 'ಡಿಪೋ ಕಾರ್ಯಾಚರಣೆ ಕೇಂದ್ರ' : 'Depot Operations Hub'}
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {currentDepot.depotNumber}: {currentDepot.name}
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'kn' ? 'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ:' : 'Direct Depot Helpline:'} {currentDepot.phone} • {currentDepot.busesAvailable} {lang === 'kn' ? 'ಮೀಸಲು ಬಸ್‌ಗಳು ಸಿದ್ಧವಿವೆ' : 'Reserve Buses In Depot Standby'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-semibold">{lang === 'kn' ? 'ಡಿಪೋ ಆಯ್ಕೆ:' : 'Switch Depot:'}</label>
          <select
            value={selectedDepotNumber}
            onChange={(e) => setSelectedDepotNumber(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
          >
            {BMTC_DEPOTS.map((d) => (
              <option key={d.depotNumber} value={d.depotNumber}>
                {d.depotNumber} - {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incoming Surge Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{lang === 'kn' ? 'ಸ್ವೀಕರಿಸಲಾದ ತುರ್ತು ಜನದಟ್ಟಣೆ ವರದಿಗಳು' : 'Incoming Relief Requests for this Depot'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">({pendingRequests.length} Pending)</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="font-bold text-white">
                {lang === 'kn' ? 'ಯಾವುದೇ ಬಾಕಿ ವಿನಂತಿಗಳಿಲ್ಲ' : 'No Pending Surge Alerts'}
              </p>
              <p>{lang === 'kn' ? 'ಈ ಡಿಪೋಗೆ ಯಾವುದೇ ಹೊಸ ಪರಿಹಾರ ಬಸ್‌ಗಳ ಬೇಡಿಕೆ ಬಂದಿಲ್ಲ.' : 'All incoming field transit requests for this depot have been handled.'}</p>
            </div>
          ) : (
            pendingRequests.map((alert) => (
              <div
                key={alert.id || alert._id}
                className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-white block text-base">{alert.stopLocation}</span>
                    <span className="text-[11px] text-slate-400">
                      {alert.passengerCount} Commuters • {alert.requiredBuses} Buses Needed
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold">
                    {alert.severity || 'Surge'}
                  </span>
                </div>

                {alert.customRoute && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                    <Milestone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      Corridor: <strong>{alert.customRoute.origin}</strong> ➔ <strong>{alert.customRoute.destination}</strong>
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400 font-mono">Reported: {alert.timestamp}</span>
                  <button
                    onClick={() => handleOpenDispatchModal(alert)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? 'ಪರಿಹಾರ ಬಸ್ ಕಳುಹಿಸಿ' : 'Dispatch Relief Bus'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Active Dispatches out of this Depot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'kn' ? 'ಮಾರ್ಗದಲ್ಲಿರುವ ಬಸ್‌ಗಳು' : 'Active Dispatched Units'}</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">({activeDispatches.length})</span>
          </div>

          {activeDispatches.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
              {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಬಸ್‌ಗಳು ಮಾರ್ಗದಲ್ಲಿಲ್ಲ.' : 'No relief buses currently en-route from this depot.'}
            </div>
          ) : (
            activeDispatches.map((disp) => (
              <div
                key={disp.id || disp._id}
                className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{disp.assignedBus}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 font-mono">
                    ETA: {disp.eta || '8 Mins'}
                  </span>
                </div>
                <div className="text-slate-300">Destination: {disp.stopLocation}</div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span>Pilot: {disp.driverName}</span>
                  <span className="font-mono">{disp.driverPhone}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DISPATCH ALLOCATION POPUP MODAL */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setActiveModalAlert(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                {currentDepot.depotNumber} FLEET ALLOCATION
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Dispatch Relief to {activeModalAlert.stopLocation}
              </h3>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              {/* Bus Count */}
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    How many buses can this depot send?
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    Max: {currentDepot.busesAvailable || 2}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={currentDepot.busesAvailable || 5}
                    value={busesToSend}
                    onChange={(e) => setBusesToSend(e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-center text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <span className="text-slate-400 text-xs">of {activeModalAlert.requiredBuses || 1} required</span>
                </div>
              </div>

              {/* Bus Registration */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Bus Registration Number (Vehicle 1)</label>
                <input
                  type="text"
                  required
                  value={busRegistration}
                  onChange={(e) => setBusRegistration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Driver & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Driver Phone Number</label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* ETA */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Estimated Arrival Time (ETA)</label>
                <input
                  type="text"
                  required
                  value={etaMinutes}
                  onChange={(e) => setEtaMinutes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModalAlert(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/40 transition active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Dispatch ({busesToSend} Buses)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
