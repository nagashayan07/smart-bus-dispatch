import React, { createContext, useContext, useState, useEffect } from 'react';
import { BMTC_DEPOTS, ALL_BANGALORE_STOPS } from '../data/bengaluruRoutes';

const DispatchContext = createContext();

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export function DispatchProvider({ children }) {
  const [userRole, setUserRoleState] = useState(() => {
    return localStorage.getItem('bmtc_role') || 'reporter';
  });

  const [alerts, setAlerts] = useState([
    {
      id: 'alert-sample-split',
      stopLocation: 'NES Office / Yelahanka Police Station',
      severity: 'Critical',
      passengerCount: 130,
      requiredBuses: 2,
      fulfilledBuses: 0,
      targetDepotNumber: 'Depot #09',
      targetDepot: 'Puttenahalli Depot (Yelahanka)',
      depotPhone: '080-22952509',
      nearestDistance: '1.2 km',
      status: 'Pending',
      dispatchedWaves: [],
      rejectedHistory: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const setUserRole = (role) => {
    setUserRoleState(role);
    localStorage.setItem('bmtc_role', role);
  };

  const logout = () => {
    localStorage.removeItem('bmtc_role');
    setUserRoleState(null);
  };

  const createAlert = (alertData) => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...alertData,
      fulfilledBuses: 0,
      status: 'Pending',
      dispatchedWaves: [],
      rejectedHistory: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // PARTIAL OR FULL DISPATCH LOGIC
  const dispatchRelief = (id, dispatchDetails = {}) => {
    const busesToDispatch = Number(dispatchDetails.busesToDispatch) || 1;
    const assignedBus = dispatchDetails.assignedBus || 'KA-04-F-8821 (Volvo AC)';
    const driverName = dispatchDetails.driverName || 'Manjunath Swamy (DRV-512)';
    const driverPhone = dispatchDetails.driverPhone || '+91 94480 55112';
    const eta = dispatchDetails.eta || '8 Mins';
    const depotNumber = dispatchDetails.targetDepotNumber;
    const depotName = dispatchDetails.targetDepot;

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id || a._id === id) {
          const newFulfilledTotal = (a.fulfilledBuses || 0) + busesToDispatch;
          const remainingNeeded = Math.max(0, a.requiredBuses - newFulfilledTotal);

          const newWave = {
            waveNumber: (a.dispatchedWaves?.length || 0) + 1,
            depotNumber,
            depotName,
            busesSent: busesToDispatch,
            assignedBus,
            driverName,
            driverPhone,
            eta,
            dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          const updatedWaves = [...(a.dispatchedWaves || []), newWave];

          // If fully satisfied
          if (remainingNeeded === 0) {
            return {
              ...a,
              status: 'Dispatched',
              fulfilledBuses: newFulfilledTotal,
              dispatchedWaves: updatedWaves,
              assignedBus,
              driverName,
              driverPhone,
              eta,
            };
          }

          // If partial: find next closest depot that hasn't fulfilled or rejected yet
          const stopObj = ALL_BANGALORE_STOPS.find((s) => s.name === a.stopLocation) || ALL_BANGALORE_STOPS[0];
          const excludedDepots = [...updatedWaves.map((w) => w.depotName), ...(a.rejectedHistory || []).map((r) => r.depotName)];

          const nextDepots = BMTC_DEPOTS.map((d) => ({
            ...d,
            dist: calculateDistanceKm(stopObj.lat, stopObj.lng, d.lat, d.lng),
          }))
            .filter((d) => !excludedDepots.includes(d.name))
            .sort((x, y) => x.dist - y.dist);

          const nextDepot = nextDepots[0] || BMTC_DEPOTS[0];

          return {
            ...a,
            status: 'Pending', // Stays pending for the remaining depot
            targetDepotNumber: nextDepot.depotNumber,
            targetDepot: nextDepot.name,
            depotPhone: nextDepot.phone,
            nearestDistance: `${nextDepot.dist} km`,
            fulfilledBuses: newFulfilledTotal,
            remainingBuses: remainingNeeded,
            dispatchedWaves: updatedWaves,
          };
        }
        return a;
      })
    );
  };

  // Full Rejection: passes all required buses to next depot
  const rejectRelief = (id, reason = 'No Buses Available') => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id || a._id === id) {
          const stopObj = ALL_BANGALORE_STOPS.find((s) => s.name === a.stopLocation) || ALL_BANGALORE_STOPS[0];

          const rejectionEntry = {
            depotNumber: a.targetDepotNumber,
            depotName: a.targetDepot,
            rejectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reason,
          };

          const updatedRejections = [...(a.rejectedHistory || []), rejectionEntry];
          const excluded = [...updatedRejections.map((r) => r.depotName), ...(a.dispatchedWaves || []).map((w) => w.depotName)];

          const nextDepots = BMTC_DEPOTS.map((d) => ({
            ...d,
            dist: calculateDistanceKm(stopObj.lat, stopObj.lng, d.lat, d.lng),
          }))
            .filter((d) => !excluded.includes(d.name))
            .sort((x, y) => x.dist - y.dist);

          const nextDepot = nextDepots[0] || BMTC_DEPOTS[0];

          return {
            ...a,
            status: 'Pending',
            targetDepotNumber: nextDepot.depotNumber,
            targetDepot: nextDepot.name,
            depotPhone: nextDepot.phone,
            nearestDistance: `${nextDepot.dist} km`,
            rejectedHistory: updatedRejections,
          };
        }
        return a;
      })
    );
  };

  const markTripCompleted = (id) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id || a._id === id) {
          return {
            ...a,
            status: 'Completed',
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return a;
      })
    );
  };

  return (
    <DispatchContext.Provider
      value={{
        userRole,
        setUserRole,
        logout,
        alerts,
        createAlert,
        dispatchRelief,
        rejectRelief,
        markTripCompleted,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  return useContext(DispatchContext);
}
