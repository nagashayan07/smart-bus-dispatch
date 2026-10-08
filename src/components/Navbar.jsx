import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Radio, LogOut, Map, Languages } from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const { userRole, logout } = useDispatch();
  const { lang, toggleLanguage, t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-2">
            {userRole === 'reporter' && (
              <NavLink
                to="/reporter"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.fieldTerminal}</span>
                <span className="sm:hidden">{lang === 'kn' ? 'ಕ್ಷೇತ್ರ' : 'Terminal'}</span>
              </NavLink>
            )}

            {userRole === 'depot' && (
              <NavLink
                to="/depot"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.depotHub}</span>
                <span className="sm:hidden">{lang === 'kn' ? 'ಡಿಪೋ' : 'Depot'}</span>
              </NavLink>
            )}

            {userRole === 'driver' && (
              <NavLink
                to="/routes"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Map className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.driverMap}</span>
                <span className="sm:hidden">{lang === 'kn' ? 'ನಕ್ಷೆ' : 'Map'}</span>
              </NavLink>
            )}
          </nav>

          <button
            onClick={toggleLanguage}
            title="Switch Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.switchLanguage}</span>
          </button>

          <button
            onClick={handleLogout}
            title={t.logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.logout}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
