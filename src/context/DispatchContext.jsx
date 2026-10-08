import React, { createContext, useContext, useState, useEffect } from 'react';

const DispatchContext = createContext();

export function DispatchProvider({ children }) {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('bmtc_role') || 'passenger');
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

  // Passenger Travel Demands List
  const [passengerRequests, setPassengerRequests] = useState(() => {
    const saved = localStorage.getItem('bmtc_pax_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'pax-req-1',
        passengerName: 'Ananya Rao',
        passengerPhone: '+91 98450 12890',
        origin: 'NES Office / Yelahanka Police Station',
        destination: 'Majestic Kempegowda Bus Station (KBS)',
        groupCount: 3,
        status: 'Queued',
        time: 'Just now'
      },
      {
        id: 'pax-req-2',
        passengerName: 'Karthik Gowda',
        passengerPhone: '+91 99801 44521',
        origin: 'NES Office / Yelahanka Police Station',
        destination: 'Hebbal Flyover Junction',
        groupCount: 2,
        status: 'Queued',
        time: '2 mins ago'
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

  const markTripCompleted = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if ((a.id || a._id) === alertId) {
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

  const addPassengerRequest = (requestData) => {
    const newReq = {
      ...requestData,
      id: 'pax-req-' + Date.now(),
      status: 'Queued',
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
