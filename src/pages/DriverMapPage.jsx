import React from 'react';
import DriverRouteMap from '../components/DriverRouteMap';

export default function DriverMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Bengaluru Metropolitan Transit Map</h1>
          <p className="text-xs text-slate-400">Driver Guidance, Corridor Geometries, and Fleet Depot Outposts</p>
        </div>
      </div>
      <DriverRouteMap />
    </div>
  );
}
