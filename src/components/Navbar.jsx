import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Radio, LogOut, Map } from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';
import Logo from './Logo';

export default function Navbar() {
  const navigate = useNavigate();
  const { userRole, logout } = useDispatch();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2">
            {/* 1. Only show Field In-Charge tab if logged in as reporter */}
            {userRole === 'reporter' && (
              <NavLink
                to="/reporter"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                Field In-Charge Terminal
              </NavLink>
            )}

            {/* 2. Only show Depot Ops Hub tab if logged in as depot manager */}
            {userRole === 'depot' && (
              <NavLink
                to="/depot"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                Depot Operations Hub
              </NavLink>
            )}

            {/* 3. Only show Driver Route Map tab if logged in as driver */}
            {userRole === 'driver' && (
              <NavLink
                to="/routes"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Map className="w-3.5 h-3.5 text-indigo-400" />
                Driver Navigation Map
              </NavLink>
            )}
          </nav>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
