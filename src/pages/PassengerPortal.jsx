import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import { ALL_BANGALORE_STOPS } from '../data/bengaluruRoutes';
import { 
  Navigation, 
  Send, 
  CheckCircle2, 
  Bus, 
  Clock, 
  ArrowRight,
  Compass,
  MapPin,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function PassengerPortal() {
  const { alerts, addPassengerRequest } = useDispatch();
  const { lang } = useLanguage();

  const [originId, setOriginId] = useState('s_nes');
  const [destId, setDestId] = useState('s1');
  const [passengerName, setPassengerName] = useState('');
  const [groupCount, setGroupCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const originStop = ALL_BANGALORE_STOPS.find((s) => s.id === originId) || ALL_BANGALORE_STOPS[0];
  const destStop = ALL_BANGALORE_STOPS.find((s) => s.id === destId) || ALL_BANGALORE_STOPS[1];

  // Active relief buses heading towards passenger pickup stop
  const incomingBuses = alerts.filter(
    (a) => a.status === 'Dispatched' && a.stopLocation.includes(originStop.name.split(' ')[0])
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassengerRequest({
      passengerName: passengerName.trim() || 'Commuter',
      origin: originStop.name,
      destination: destStop.name,
      groupCount: Number(groupCount)
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಸಾರಿಗೆ ಪೋರ್ಟಲ್' : 'Commuter Transit Desk'}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {lang === 'kn' ? 'ಬಸ್ ಅಗತ್ಯತೆ ಮತ್ತು ಮಾರ್ಗ ಕೋರಿಕೆ' : 'Request Relief Bus Route'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಆರಂಭಿಕ ಮತ್ತು ತಲುಪುವ ನಿಲ್ದಾಣವನ್ನು ನಮೂದಿಸಿ. ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿ ಅಧಿಕಾರಿಗಳು ಈ ಬೇಡಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಸೂಕ್ತ ಬಸ್ ವ್ಯವಸ್ಥೆ ಮಾಡುತ್ತಾರೆ.'
                : 'Broadcast where you are traveling to the local Field In-Charge so they can estimate crowd volume and allocate relief buses.'}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
            <Bus className="w-6 h-6 text-indigo-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {lang === 'kn' ? 'ನಿಲ್ದಾಣಕ್ಕೆ ಬರುವ ಪರಿಹಾರ ಬಸ್‌ಗಳು' : 'Incoming Relief Buses'}
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {incomingBuses.length > 0 ? `${incomingBuses.length} En-Route` : 'Regular Frequency'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Request Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400" />
            {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ವಿವರ ನಮೂದಿಸಿ' : 'Submit Your Travel Itinerary'}
          </h2>
          <span className="text-xs text-slate-500 font-mono">BMTC Direct Relay</span>
        </div>

        {submitted && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">{lang === 'kn' ? 'ಮನವಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!' : 'Demand Broadcast Successfully!'}</p>
              <p className="text-slate-300 font-normal mt-0.5">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ಮಾಹಿತಿಯನ್ನು ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿ ಕಂಟ್ರೋಲ್ ರೂಮ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.'
                  : 'Your request has been forwarded directly to the Field In-Charge console to determine the reliable relief route.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin Stop */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ನೀವು ಇರುವ ನಿಲ್ದಾಣ (From)' : 'Pickup Station (From)'}
              </label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {ALL_BANGALORE_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Stop */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {lang === 'kn' ? 'ನೀವು ತಲುಪಬೇಕಾದ ಸ್ಥಳ (To Destination)' : 'Target Destination (To)'}
              </label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {ALL_BANGALORE_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400">
                {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)' : 'Commuter Name (Optional)'}
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400">
                {lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ' : 'Number of Travelers in Group'}
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={groupCount}
                onChange={(e) => setGroupCount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Route Summary Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                {lang === 'kn' ? 'ಕೋರಲಾದ ಬಸ್ ಮಾರ್ಗ' : 'Requested Transit Path'}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-2 mt-0.5">
                {originStop.name} <ArrowRight className="w-3.5 h-3.5 text-slate-500" /> {destStop.name}
              </span>
            </div>
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-mono font-bold">
              {groupCount} Commuter{groupCount > 1 ? 's' : ''}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-xs"
          >
            <Send className="w-4 h-4" />
            <span>
              {lang === 'kn' ? 'ಸ್ಥಳೀಯ ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿಗೆ ಕಳುಹಿಸಿ' : 'Send Travel Demand to Field In-Charge'}
            </span>
          </button>
        </form>

        {/* Live Incoming Buses Status for this Commuter */}
        {incomingBuses.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-pulse" />
              {lang === 'kn' ? 'ನಿಮ್ಮ ನಿಲ್ದಾಣಕ್ಕೆ ಬರುತ್ತಿರುವ ಪರಿಹಾರ ಬಸ್' : 'Active Relief Bus Heading to Your Stop'}
            </span>
            {incomingBuses.map((bus) => (
              <div key={bus.id || bus._id} className="bg-slate-950 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{bus.assignedBus}</span>
                  <span className="text-slate-400 text-[11px]">Pilot: {bus.driverName}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono font-bold block">ETA: {bus.eta || '8 Mins'}</span>
                  <span className="text-[10px] text-slate-500">From {bus.targetDepotNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
