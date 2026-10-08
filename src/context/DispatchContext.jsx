import React, { createContext, useContext, useState, useEffect } from 'react';

const DispatchContext = createContext();

export function DispatchProvider({ children }) {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('bmtc_role') || 'reporter');
  
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('bmtc_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'alt-default-1',
        stopLocation: 'NES Office / Yelahanka Police Station',
        severity: 'Critical',
        passengerCount: 130,
        requiredBuses: 2,
        targetDepotNumber: 'Depot #09',
        targetDepot: 'Puttenahalli Depot (Yelahanka)',
        depotPhone: '080-22953609',
        nearestDistance: '1.7 km',
        status: 'Pending',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customRoute: {
          origin: 'NES Office / Yelahanka Police Station',
          destination: 'Majestic Kempegowda Bus Station (KBS)'
        }
      }
    ];
  });

  const [passengerRequests, setPassengerRequests] = useState(() => {
    const saved = localStorage.getItem('bmtc_pax_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'pax-req-1',
        passengerName: 'ram',
        origin: 'ITPL Main Gate (Whitefield)',
        destination: 'Corporation Circle (Hudson Circle)',
        groupCount: 1,
        status: 'Pending',
        time: 'Just now'
      },
      {
        id: 'pax-req-2',
        passengerName: 'ram',
        origin: 'Electronic City Toll / Infosys Gate',
        destination: 'Majestic Kempegowda Bus Station (KBS)',
        groupCount: 1,
        status: 'Pending',
        time: 'Just now'
      },
      {
        id: 'pax-req-3',
        passengerName: 'Commuter',
        origin: 'Yelahanka Old Town / Santhe Circle',
        destination: 'Majestic Kempegowda Bus Station (KBS)',
        groupCount: 1,
        status: 'Pending',
        time: 'Just now'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('bmtc_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('bmtc_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('bmtc_pax_requests', JSON.stringify(passengerRequests));
  }, [passengerRequests]);

  const login = (role) => setUserRole(role);
  const logout = () => {
    setUserRole('passenger');
    localStorage.removeItem('bmtc_role');
  };

  const createAlert = (alertData) => {
    const newAlert = {
      ...alertData,
      id: 'alt-' + Date.now(),
      status: 'Pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const acceptAlert = (alertId, dispatchDetails) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if ((a.id || a._id) === alertId) {
          return {
            ...a,
            status: 'Dispatched',
            ...dispatchDetails,
          };
        }
        return a;
      })
    );
  };

  // AUTOMATED CLEARANCE: When a trip is completed at the destination or stop,
  // matching passenger requests automatically transition to "Completed"
  const markTripCompleted = (alertId) => {
    let completedStop = null;
    let completedRoute = null;
    let busPlate = null;

    setAlerts((prev) =>
      prev.map((a) => {
        if ((a.id || a._id) === alertId) {
          completedStop = a.stopLocation;
          completedRoute = a.customRoute;
          busPlate = a.assignedBus;
          return {
            ...a,
            status: 'Completed',
            completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return a;
      })
    );

    // Automatically transition matching passenger requests from Pending -> Completed
    if (completedStop || completedRoute) {
      setPassengerRequests((prev) =>
        prev.map((req) => {
          const matchesStop = completedStop && (req.origin.includes(completedStop) || completedStop.includes(req.origin));
          const matchesCorridor = completedRoute && req.origin === completedRoute.origin;

          if (matchesStop || matchesCorridor) {
            return {
              ...req,
              status: 'Completed',
              clearedByBus: busPlate || 'BMTC Relief Fleet',
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return req;
        })
      );
    }
  };

  const addPassengerRequest = (requestData) => {
    const newReq = {
      ...requestData,
      id: 'pax-req-' + Date.now(),
      status: 'Pending',
      time: 'Just now'
    };
    setPassengerRequests((prev) => [newReq, ...prev]);
  };

  return (
    <DispatchContext.Provider
      value={{
        userRole,
        login,
        logout,
        alerts,
        createAlert,
        acceptAlert,
        markTripCompleted,
        passengerRequests,
        addPassengerRequest
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  return useContext(DispatchContext);
}
