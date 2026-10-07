import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Shield, User, Lock, ArrowRight, MapPin, Gauge, Map } from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';
import Logo from '../components/Logo';

export default function Login() {
  const [role, setRole] = useState('reporter');
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();
  const { setUserRole } = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    setUserRole(role);

    if (role === 'reporter') {
      navigate('/reporter');
    } else if (role === 'depot') {
      navigate('/depot');
    } else {
      navigate('/routes');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col justify-between overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Cinematic Transit Terminal Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=85')`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-indigo-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#020617_85%)] pointer-events-none" />

      {/* Animation Styles */}
      <style>{`
        @keyframes driveLeftToRight {
          0% { transform: translateX(-400px); }
          100% { transform: translateX(100vw); }
        }
        @keyframes roadDashes {
          0% { background-position: 0 0; }
          100% { background-position: -120px 0; }
        }
        @keyframes rotateTire {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .bus-mover {
          position: absolute;
          bottom: 24px;
          left: 0;
          animation: driveLeftToRight 11s linear infinite;
          will-change: transform;
        }
        .highway-lines {
          background-image: repeating-linear-gradient(
            to right,
            #cbd5e1 0px,
            #cbd5e1 35px,
            transparent 35px,
            transparent 85px
          );
          animation: roadDashes 1.2s linear infinite;
        }
        .wheel-spin {
          transform-origin: center;
          animation: rotateTire 0.8s linear infinite;
        }
      `}</style>

      {/* Road & Moving Bus at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950/90 border-t-2 border-slate-700/80 shadow-2xl">
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 highway-lines opacity-50" />
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-amber-400/40" />
        </div>

        <div className="bus-mover flex items-end">
          <div className="relative">
            <div
              className="absolute top-8 right-[-220px] w-80 h-28 pointer-events-none blur-[2px]"
              style={{
                background: 'radial-gradient(ellipse at left, rgba(254, 240, 138, 0.7) 0%, rgba(254, 240, 138, 0.2) 45%, transparent 75%)',
                clipPath: 'polygon(0% 45%, 100% 5%, 100% 95%, 0% 65%)',
              }}
            />

            <svg
              className="w-[360px] h-[130px] drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)]"
              viewBox="0 0 360 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="170" cy="116" rx="160" ry="8" fill="#000000" fillOpacity="0.75" />
              <rect x="20" y="20" width="290" height="10" rx="3" fill="#312e81" stroke="#4338ca" strokeWidth="1" />
              <rect x="90" y="14" width="90" height="6" rx="2" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <rect x="20" y="30" width="290" height="74" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <path d="M 20 74 L 310 74 L 310 98 C 310 102 306 104 302 104 L 28 104 C 24 104 20 102 20 98 Z" fill="#3730a3" />
              <rect x="20" y="70" width="290" height="4" fill="#f59e0b" />
              <path d="M 255 36 L 298 36 C 304 36 308 40 308 46 L 308 68 L 255 68 Z" fill="#93c5fd" fillOpacity="0.85" />
              <circle cx="274" cy="50" r="5" fill="#0f172a" />
              <path d="M 268 68 C 268 60 280 60 280 68 Z" fill="#0f172a" />
              <rect x="34" y="38" width="34" height="28" rx="4" fill="#93c5fd" fillOpacity="0.75" />
              <rect x="76" y="38" width="36" height="28" rx="4" fill="#93c5fd" fillOpacity="0.75" />
              <rect x="120" y="38" width="36" height="28" rx="4" fill="#93c5fd" fillOpacity="0.75" />
              <rect x="164" y="38" width="36" height="28" rx="4" fill="#93c5fd" fillOpacity="0.75" />
              <rect x="208" y="38" width="24" height="64" rx="2" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
              <line x1="220" y1="38" x2="220" y2="102" stroke="#818cf8" strokeWidth="1" />
              <rect x="140" y="24" width="105" height="10" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
              <text x="146" y="32" fill="#fbbf24" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                KIA-9 KBS ➔ SILK BOARD
              </text>
              <rect x="34" y="80" width="30" height="12" rx="2" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
              <text x="37" y="89" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                BMTC
              </text>
              <text x="74" y="89" fill="#e2e8f0" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                KA-01-F-9412 • RELIEF
              </text>
              <circle cx="305" cy="80" r="5" fill="#fef08a" />
              <circle cx="305" cy="80" r="8" fill="#fde047" fillOpacity="0.35" />
              <rect x="302" y="88" width="5" height="3" rx="1" fill="#f97316" />
              <rect x="20" y="78" width="3" height="14" rx="1" fill="#ef4444" />
              <g transform="translate(80, 104)">
                <circle cx="0" cy="0" r="18" fill="#020617" stroke="#475569" strokeWidth="3" />
                <circle cx="0" cy="0" r="10" fill="#334155" />
                <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
                <g className="wheel-spin">
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                </g>
              </g>
              <g transform="translate(250, 104)">
                <circle cx="0" cy="0" r="18" fill="#020617" stroke="#475569" strokeWidth="3" />
                <circle cx="0" cy="0" r="10" fill="#334155" />
                <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
                <g className="wheel-spin">
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo size="lg" />

        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Relief Corridor Active</span>
        </div>
      </header>

      {/* Frosted Glass Login Terminal */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-7 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">Staff Operations Login</h2>
            <p className="text-xs text-slate-400">
              Select your duty authorization profile to enter assigned terminal
            </p>
          </div>

          {/* 3-Role Switching Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('reporter')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                role === 'reporter'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Field Officer
            </button>
            <button
              type="button"
              onClick={() => setRole('depot')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                role === 'depot'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Depot Ops
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition ${
                role === 'driver'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Bus Driver
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Duty Official ID / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    role === 'reporter'
                      ? 'e.g. officer_majestic'
                      : role === 'depot'
                      ? 'e.g. manager_depot_01'
                      : 'e.g. driver_ramesh_418'
                  }
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Terminal Passcode</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="********"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 transition duration-150"
            >
              <span>
                {role === 'reporter'
                  ? 'Sign In to Field Terminal'
                  : role === 'depot'
                  ? 'Sign In to Depot Hub'
                  : 'Sign In to Driver Map'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> 8 City Depots Linked
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Role-Restricted Access
            </span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full text-center py-4 text-slate-500 text-[11px] pointer-events-none">
        Bengaluru Metropolitan Transport Corporation (BMTC) Fleet & Surge Relief Dispatch
      </footer>
    </div>
  );
}
