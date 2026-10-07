import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { BMTC_DEPOTS } from '../data/bengaluruRoutes';
import { 
  Building2, 
  Bus, 
  CheckCircle2, 
  Clock, 
  Phone, 
  UserCheck, 
  ShieldCheck, 
  Send, 
  X,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DepotDashboard() {
  const { alerts, dispatchRelief, rejectRelief } = useDispatch();
  const [selectedDepotId, setSelectedDepotId] = useState('d9'); // Puttenahalli Depot
  const [activeModalAlert, setActiveModalAlert] = useState(null);

  const [busesToDispatch, setBusesToDispatch] = useState(1);
  const [assignedBus, setAssignedBus] = useState('KA-04-F-8821 (Volvo AC)');
  const [driverName, setDriverName] = useState('Manjunath Swamy (DRV-512)');
  const [driverPhone, setDriverPhone] = useState('+91 94480 55112');
  const [eta, setEta] = useState('8 Mins');

  const currentDepot = BMTC_DEPOTS.find((d) => d.id === selectedDepotId) || BMTC_DEPOTS[0];

  // Pending requests targeted at this depot
  const pendingRequests = alerts.filter(
    (a) =>
      a.status === 'Pending' &&
      (a.targetDepotNumber === currentDepot.depotNumber || a.targetDepot === currentDepot.name)
  );

  const openDispatchModal = (alert) => {
    setActiveModalAlert(alert);
    const needed = alert.requiredBuses - (alert.fulfilledBuses || 0);
    // Can send at most what is needed or what this depot has available
    const maxCanSend = Math.min(needed, currentDepot.busesAvailable || 1);
    setBusesToDispatch(Math.max(1, maxCanSend));
    setAssignedBus(`KA-04-F-${Math.floor(1000 + Math.random() * 9000)} (${currentDepot.depotNumber} Volvo)`);
  };

  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!activeModalAlert) return;

    dispatchRelief(activeModalAlert.id || activeModalAlert._id, {
      busesToDispatch: Number(busesToDispatch),
      assignedBus,
      driverName,
      driverPhone,
      eta,
      targetDepotNumber: currentDepot.depotNumber,
      targetDepot: currentDepot.name,
      depotPhone: currentDepot.phone,
    });

    setActiveModalAlert(null);
  };

  const handleReject = (alertId) => {
    rejectRelief(alertId, 'Depot Fleet Reserve Exhausted (0 Buses Available)');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Depot Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[10px] font-black uppercase">
              {currentDepot.depotNumber}
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-400" />
              {currentDepot.name} Command Desk
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Control Helpline: <span className="text-slate-200 font-mono">{currentDepot.phone}</span> • Operational Fleet: <strong className="text-emerald-400">{currentDepot.busesAvailable} buses ready</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Operating As:</label>
          <select
            value={selectedDepotId}
            onChange={(e) => setSelectedDepotId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          >
            {BMTC_DEPOTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.depotNumber}: {d.name} ({d.busesAvailable} Buses)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PENDING SURGE REQUESTS QUEUE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Inbound Relief Demands for {currentDepot.depotNumber} ({pendingRequests.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live Grid Synchronized</span>
        </div>

        <div className="divide-y divide-slate-800">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-slate-400 font-semibold">All surge requests processed!</p>
              <p className="text-[11px] text-slate-600">No pending inbound demands targeting {currentDepot.name}.</p>
            </div>
          ) : (
            pendingRequests.map((alert) => {
              const remainingNeeded = alert.requiredBuses - (alert.fulfilledBuses || 0);

              return (
                <div
                  key={alert.id || alert._id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 hover:bg-slate-850 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-base">{alert.stopLocation}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {alert.severity}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-300 bg-indigo-600/20 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                        Total Demand: {alert.requiredBuses} Buses
                      </span>
                      {alert.fulfilledBuses > 0 && (
                        <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                          {alert.fulfilledBuses} Already Dispatched • {remainingNeeded} Still Needed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Waiting Passengers: <strong className="text-white">{alert.passengerCount}</strong></span>
                      <span>•</span>
                      <span>Distance: <strong className="text-emerald-400">{alert.nearestDistance || 'Nearby'}</strong></span>
                      <span>•</span>
                      <span>This Depot Capacity: <strong className="text-amber-300">{currentDepot.busesAvailable} Ready</strong></span>
                    </div>

                    {alert.dispatchedWaves?.length > 0 && (
                      <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/30">
                        <strong>Previous Dispatches:</strong> {alert.dispatchedWaves.map((w) => `${w.busesSent} bus from ${w.depotNumber}`).join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleReject(alert.id || alert._id)}
                      className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      title="Decline and forward all to next closest depot"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Decline (0 Buses)</span>
                    </button>

                    <button
                      onClick={() => openDispatchModal(alert)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/40 transition"
                    >
                      <Bus className="w-4 h-4" />
                      <span>Approve & Dispatch Fleet</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL: SELECT HOW MANY BUSES THIS DEPOT CAN SEND */}
      {activeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">
                  {currentDepot.depotNumber} Fleet Allocation
                </span>
                <h3 className="text-lg font-bold text-white">
                  Dispatch Relief to {activeModalAlert.stopLocation}
                </h3>
              </div>
              <button onClick={() => setActiveModalAlert(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              {/* SELECT NUMBER OF BUSES TO DISPATCH */}
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    How many buses can this depot send?
                  </label>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Max: {Math.min(activeModalAlert.requiredBuses - (activeModalAlert.fulfilledBuses || 0), currentDepot.busesAvailable)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={Math.min(activeModalAlert.requiredBuses - (activeModalAlert.fulfilledBuses || 0), currentDepot.busesAvailable || 1)}
                    value={busesToDispatch}
                    onChange={(e) => setBusesToDispatch(e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-black text-center text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-slate-300">
                    of {activeModalAlert.requiredBuses - (activeModalAlert.fulfilledBuses || 0)} required
                  </span>
                </div>

                {Number(busesToDispatch) < (activeModalAlert.requiredBuses - (activeModalAlert.fulfilledBuses || 0)) && (
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-start gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      You are sending <strong>{busesToDispatch} bus</strong>. The remaining <strong>{(activeModalAlert.requiredBuses - (activeModalAlert.fulfilledBuses || 0)) - busesToDispatch} bus</strong> will automatically be forwarded to the next nearest depot!
                    </span>
                  </div>
                )}
              </div>

              {/* BUS & PILOT DETAILS */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Bus Registration Number (Vehicle 1)</label>
                <input
                  type="text"
                  required
                  value={assignedBus}
                  onChange={(e) => setAssignedBus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Driver Phone Number</label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Estimated Arrival Time (ETA)</label>
                <input
                  type="text"
                  required
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-amber-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAlert(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-2 shadow-lg shadow-indigo-600/40"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Dispatch ({busesToDispatch} {busesToDispatch === 1 ? 'Bus' : 'Buses'})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
