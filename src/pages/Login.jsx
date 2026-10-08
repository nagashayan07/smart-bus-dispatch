import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import { 
  Radio, 
  LayoutDashboard, 
  Bus, 
  ArrowRight, 
  Users, 
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useDispatch();
  const { lang, toggleLanguage } = useLanguage();

  const [role, setRole] = useState('passenger');
  const [username, setUsername] = useState('commuter_ananya');
  const [password, setPassword] = useState('123456');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'passenger') {
      setUsername('commuter_ananya');
      setPassword('123456');
    } else if (selectedRole === 'reporter') {
      setUsername('field_nes_officer');
      setPassword('123456');
    } else if (selectedRole === 'depot') {
      setUsername('depot_mgr_09');
      setPassword('123456');
    } else if (selectedRole === 'driver') {
      setUsername('driver_manjunath');
      setPassword('123456');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
    if (role === 'passenger') navigate('/passenger');
    else if (role === 'reporter') navigate('/reporter');
    else if (role === 'depot') navigate('/depot');
    else if (role === 'driver') navigate('/routes');
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. PHOTOGRAPHIC HIGH-END TRANSIT BACKDROP */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2600&q=80')`,
        }}
      />
      
      {/* Dynamic atmospheric radial lighting & noise mesh */}
      <div className="absolute inset-0 bg-radial from-indigo-900/30 via-slate-950/85 to-slate-950 pointer-events-none" />
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none" />

      {/* 2. TOP BANNER BRANDING */}
      <header className="relative z-20 px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Namma BMTC Live Grid Active</span>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-lg shadow-amber-500/10"
        >
          <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
        </button>
      </header>

      {/* 3. CENTER GLASSMORPHIC LOGIN CARD */}
      <main className="relative z-20 flex items-center justify-center px-4 py-4 my-auto">
        <div className="w-full max-w-md bg-slate-900/85 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Bengaluru Urban Mobility Command</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {lang === 'kn' ? 'ಲಾಗಿನ್ ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ' : 'Select Access Role'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಬಸ್ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆಗೆ ಪ್ರವೇಶಿಸಿ' : 'Choose your assigned operational persona to proceed'}
            </p>
          </div>

          {/* 4 Multi-Role Selector Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                id: 'passenger',
                title: lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'Passenger',
                subtitle: 'Route Request',
                icon: Users,
                color: 'text-emerald-400',
                border: 'border-emerald-500/40',
                bg: 'bg-emerald-500/10'
              },
              {
                id: 'reporter',
                title: lang === 'kn' ? 'ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿ' : 'Field In-Charge',
                subtitle: 'Surge Alert',
                icon: Radio,
                color: 'text-indigo-400',
                border: 'border-indigo-500/40',
                bg: 'bg-indigo-500/10'
              },
              {
                id: 'depot',
                title: lang === 'kn' ? 'ಡಿಪೋ ಅಧಿಕಾರಿ' : 'Depot Ops',
                subtitle: 'Fleet Control',
                icon: LayoutDashboard,
                color: 'text-amber-400',
                border: 'border-amber-500/40',
                bg: 'bg-amber-500/10'
              },
              {
                id: 'driver',
                title: lang === 'kn' ? 'ಚಾಲಕರು' : 'Bus Driver',
                subtitle: 'Duty Map',
                icon: Bus,
                color: 'text-cyan-400',
                border: 'border-cyan-500/40',
                bg: 'bg-cyan-500/10'
              }
            ].map((r) => {
              const IconComp = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`p-3.5 rounded-2xl border text-left transition duration-200 relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <IconComp className={`w-5 h-5 mb-1.5 ${r.color}`} />
                  <span className="text-xs font-black block text-slate-100">{r.title}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{r.subtitle}</span>

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Login Form Inputs */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'kn' ? 'ಬಳಕೆದಾರ ಹೆಸರು (Username)' : 'Username / Duty ID'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition duration-150"
            >
              <span>{lang === 'kn' ? 'ಪ್ರವೇಶಿಸಿ (Sign In)' : 'Sign In to Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* 4. ANIMATED HIGHWAY ROAD & MOVING BMTC BUS AT THE BOTTOM */}
      <footer className="relative z-10 w-full overflow-hidden pb-1">
        {/* Streetlight glow / Horizon Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Highway Asphalt Road */}
        <div className="relative w-full h-16 bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-slate-800/80 overflow-hidden">
          {/* Animated Dashed Lane Road Lines */}
          <div className="absolute top-[48%] left-0 w-[200%] h-[3px] flex gap-8 animate-road-lane opacity-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-12 h-full bg-amber-400/80 rounded-full shrink-0" />
            ))}
          </div>

          {/* Continuous Moving BMTC Electric/Volvo Bus */}
          <div className="absolute bottom-2.5 flex items-center gap-2 animate-bus-travel">
            {/* Bus Vehicle Graphic Component */}
            <div className="relative flex items-center">
              {/* Bus Body */}
              <div className="h-9 w-32 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-xl rounded-tr-2xl shadow-[0_4px_20px_rgba(37,99,235,0.6)] border border-sky-400/40 relative flex items-center px-2">
                {/* Roof AC / Battery Unit */}
                <div className="absolute -top-1.5 left-4 right-8 h-1.5 bg-slate-300 rounded-t-md border-t border-slate-100" />

                {/* BMTC Logo on Bus */}
                <span className="text-[8px] font-black tracking-tighter text-white/90 mr-2 bg-slate-950/60 px-1 py-0.5 rounded">
                  BMTC EV
                </span>

                {/* Windows with interior light */}
                <div className="flex gap-1 items-center flex-1">
                  <div className="w-4 h-3 bg-amber-200/80 rounded-sm shadow-[0_0_6px_#fef08a]" />
                  <div className="w-4 h-3 bg-amber-200/80 rounded-sm shadow-[0_0_6px_#fef08a]" />
                  <div className="w-4 h-3 bg-amber-200/80 rounded-sm shadow-[0_0_6px_#fef08a]" />
                  <div className="w-5 h-3.5 bg-cyan-200/90 rounded-sm rounded-tr-md ml-auto shadow-[0_0_8px_#a5f3fc]" />
                </div>

                {/* Bus Front Headlight Beams projecting forward */}
                <div className="absolute right-[-2px] top-4 w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_12px_6px_rgba(251,191,36,0.9)]" />
                <div className="absolute right-[-50px] top-2 w-14 h-6 bg-gradient-to-r from-amber-300/40 to-transparent blur-sm transform -skew-y-6 pointer-events-none" />

                {/* Rear Red Taillight */}
                <div className="absolute left-[-1px] top-4 w-1 h-2 bg-rose-500 rounded-l shadow-[0_0_10px_#f43f5e]" />
              </div>

              {/* Rolling Wheels */}
              <div className="absolute bottom-[-4px] left-5 w-4 h-4 bg-slate-950 border-2 border-slate-600 rounded-full shadow-md animate-spin" />
              <div className="absolute bottom-[-4px] right-6 w-4 h-4 bg-slate-950 border-2 border-slate-600 rounded-full shadow-md animate-spin" />
            </div>

            {/* Exhaust / Speed Mist Particle Stream */}
            <div className="h-1 w-12 bg-gradient-to-l from-indigo-400/50 to-transparent rounded-full blur-[1px]" />
          </div>
        </div>
      </footer>

      {/* 5. EMBEDDED CSS ANIMATION KEYFRAMES FOR CONTINUOUS SMOOTH BUS CRUISE */}
      <style>{`
        @keyframes busTravel {
          0% {
            transform: translateX(-180px);
          }
          100% {
            transform: translateX(110vw);
          }
        }
        @keyframes roadLane {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-bus-travel {
          animation: busTravel 12s linear infinite;
        }
        .animate-road-lane {
          animation: roadLane 1.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
