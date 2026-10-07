import React from 'react';
import { Bus } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
        <Bus className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-black tracking-tight text-white text-lg">TRAVEL<span className="text-indigo-400">BUS</span></span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">BMTC</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono tracking-wider block">BENGALURU SMART DISPATCH</span>
      </div>
    </div>
  );
}
