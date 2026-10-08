import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import { ALL_BANGALORE_STOPS } from '../data/bengaluruRoutes';
import { 
  Users, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Bus, 
  Clock, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

export default function PassengerPortal() {
  const { passengerRequests, addPassengerRequest, alerts } = useDispatch();
  const { lang } = useLanguage();

  const [originId, setOriginId] = useState('s_nes');
  const [destId, setDestId] = useState('s1'); // Majestic KBS
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [groupCount, setGroupCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const originStop = ALL_BANGALORE_STOPS.find((s) => s.id === originId) || ALL_BANGALORE_STOPS[0];
  const destStop = ALL_BANGALORE_STOPS.find((s) => s.id === destId) || ALL_BANGALORE_STOPS[1];

  // Count active relief buses heading towards passenger stop
  const incomingBuses = alerts.filter(
    (a) => a.status === 'Dispatched' && a.stopLocation.includes(originStop.name.split(' ')[0])
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassengerRequest({
      passengerName: passengerName.trim() || 'Commuter',
      passengerPhone: passengerPhone.trim() || '+91 98XXX XXXXX',
      origin: originStop.name,
      destination: destStop.name,
      groupCount: Number(groupCount)
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಸಾರಿಗೆ ಪೋರ್ಟಲ್' : 'Commuter Travel Demand Desk'}
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {lang === 'kn' ? 'ಬಸ್ ಅಗತ್ಯತೆ ಮತ್ತು ಮಾರ್ಗ ಮನವಿ' : 'Request Reliable Route Relief Bus'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {lang === 'kn'
                ? 'ನೀವು ಪ್ರಯಾಣಿಸಬೇಕಾದ ಆರಂಭಿಕ ಮತ್ತು ಅಂತಿಮ ನಿಲ್ದಾಣವನ್ನು ನಮೂದಿಸಿ. ಕ್ಷೇತ್ರದ ಪ್ರಭಾರಿ ಅಧಿಕಾರಿಗಳು ಈ ಬೇಡಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಸೂಕ್ತ ಮಾರ್ಗದಲ್ಲಿ ಬಸ್ ಕಳುಹಿಸುತ್ತಾರೆ.'
                : 'Select where you are and where you need to go. Field In-Charges aggregate passenger destinations to schedule the most reliable relief bus route.'}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3">
            <Bus className="w-6 h-6 text-indigo-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {lang === 'kn' ? 'ನಿಮ್ಮ ನಿಲ್ದಾಣಕ್ಕೆ ಬರುವ ಬಸ್‌ಗಳು' : 'Incoming Relief Buses'}
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {incomingBuses.length > 0 ? `${incomingBuses.length} Dispatched` : 'Standard Schedule'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Route Request Form */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ವಿವರ' : 'Where are you travelling?'}
            </h2>
            <span className="text-xs text-slate-500 font-mono">BMTC Direct Connect</span>
          </div>

          {submitted && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಪ್ರಯಾಣದ ಬೇಡಿಕೆಯನ್ನು ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ!'
                  : 'Your corridor travel demand has been relayed to the Field In-Charge!'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Origin Stop */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ನೀವು ಇರುವ ನಿಲ್ದಾಣ (From)' : 'Current Pickup Stop (From)'}
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
                {lang === 'kn' ? 'ನೀವು ತಲುಪಬೇಕಾದ ಸ್ಥಳ (To Destination)' : 'Where do you want to travel? (To)'}
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

            {/* Commuter Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)' : 'Your Name (Optional)'}
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
                  {lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ' : 'Number of Commuters'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={groupCount}
                  onChange={(e) => setGroupCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Travel Route Summary Preview */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                  {lang === 'kn' ? 'ಮನವಿ ಮಾಡಲಾದ ಕಾರಿಡಾರ್' : 'Selected Corridor'}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                  {originStop.name} <ArrowRight className="w-3 h-3 text-slate-500" /> {destStop.name}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold">
                {groupCount} Pax
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-xs"
            >
              <Send className="w-4 h-4" />
              <span>
                {lang === 'kn' ? 'ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿಗೆ ಮಾರ್ಗ ಮನವಿ ಸಲ್ಲಿಸಿ' : 'Send Travel Demand to Field In-Charge'}
              </span>
            </button>
          </form>
        </div>

        {/* Right Side: Live Waiting Queue & Destination Clusters */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-black text-white">
                  {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಪ್ರಯಾಣಿಕರ ಬೇಡಿಕೆಗಳು' : 'Live Commuter Demands at Bus Stands'}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {passengerRequests.length} Active Requests
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {passengerRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950 border border-slate-850 rounded-2xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{req.passengerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{req.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-400 font-semibold">{req.origin}</span>
                    <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="text-indigo-300 font-semibold">{req.destination}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px] text-slate-400">
                    <span>Group Size: <strong className="text-amber-400">{req.groupCount} passenger(s)</strong></span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
