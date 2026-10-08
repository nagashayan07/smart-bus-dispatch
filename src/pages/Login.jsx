import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import { Radio, LayoutDashboard, Bus, UserCheck, ShieldCheck, ArrowRight, Users } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur space-y-6">
        <div className="flex items-center justify-between">
          <Logo />
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30"
          >
            {lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">
            {lang === 'kn' ? 'ಲಾಗಿನ್ ಪೋರ್ಟಲ್' : 'Select Access Role'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'kn' ? 'ನಿಮ್ಮ ಕರ್ತವ್ಯ ಅಥವಾ ಸೇವೆಯ ಆಯ್ಕೆ ಮಾಡಿ' : 'Choose your role to enter the BMTC system'}
          </p>
        </div>

        {/* 4 Roles Selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRoleSelect('passenger')}
            className={`p-3 rounded-2xl border text-left transition ${
              role === 'passenger'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-bold block">{lang === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'Passenger'}</span>
            <span className="text-[10px] text-slate-400">Route Request</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('reporter')}
            className={`p-3 rounded-2xl border text-left transition ${
              role === 'reporter'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-5 h-5 text-indigo-400 mb-1" />
            <span className="text-xs font-bold block">{lang === 'kn' ? 'ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿ' : 'Field In-Charge'}</span>
            <span className="text-[10px] text-slate-400">Surge Alert</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('depot')}
            className={`p-3 rounded-2xl border text-left transition ${
              role === 'depot'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-bold block">{lang === 'kn' ? 'ಡಿಪೋ ಅಧಿಕಾರಿ' : 'Depot Ops'}</span>
            <span className="text-[10px] text-slate-400">Fleet Control</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('driver')}
            className={`p-3 rounded-2xl border text-left transition ${
              role === 'driver'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-xs font-bold block">{lang === 'kn' ? 'ಚಾಲಕರು' : 'Bus Driver'}</span>
            <span className="text-[10px] text-slate-400">Duty Map</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <span>{lang === 'kn' ? 'ಪ್ರವೇಶಿಸಿ (Sign In)' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
