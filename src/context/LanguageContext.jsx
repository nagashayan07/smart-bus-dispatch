import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    appName: 'TRAVELBUS',
    subBrand: 'BENGALURU SMART DISPATCH',
    fieldTerminal: 'Field In-Charge Terminal',
    depotHub: 'Depot Operations Hub',
    driverMap: 'Driver Navigation Map',
    logout: 'Logout',
    switchLanguage: 'ಕನ್ನಡ',

    telemetryBadge: 'BMTC Real-Time Telemetry Link',
    fieldTitle: 'Field Dispatch & Fleet Live Tracker',
    fieldSubtitle: 'Inspect active en-route buses, duty crew contacts, traveled stop corridors, and real-time arrival estimates.',

    tabActiveTransit: 'Active Relief Transit',
    tabCompletedArchive: 'Completed Operations Archive',

    commuters: 'Commuters',
    busesReq: 'Buses Req.',
    requestedDepot: 'Requested Depot',
    waitingOnDepot: 'WAITING ON',
    dispatchedFrom: 'DISPATCHED FROM',
    busVehicle: 'Bus Vehicle',
    dutyPilot: 'Duty Pilot / Driver',
    driverMobile: 'Driver Mobile',
    liveEta: 'ETA',
    viewTraveledStops: 'View Traveled Stops',
    hideTraveledStops: 'Hide Traveled Stops',
    completeTrip: 'Complete Trip',
    missionCompleted: 'MISSION COMPLETED',
    commutersCleared: 'Commuters Cleared',

    formHeaderBadge: 'Field Terminal Transmission',
    formTitle: 'Broadcast Crowd Surge',
    currentStop: 'Current Bus Stop',
    surgePriority: 'Surge Priority Level',
    moderate: 'Moderate',
    surge: 'Surge',
    critical: 'Critical',
    estimatedCommuters: 'Estimated Commuters Waiting',
    paxPerBus: '~65 pax / bus',
    fleetSizing: 'Fleet Sizing Recommendation',
    targetNearestDepot: 'Target Nearest Depot:',
    roadDistance: 'Transit Distance:',
    busesReady: 'buses ready',
    sendRequestBtn: 'Send Request to',
  },
  kn: {
    appName: 'ಟ್ರಾವೆಲ್ ಬಸ್',
    subBrand: 'ಬೆಂಗಳೂರು ಸ್ಮಾರ್ಟ್ ಡಿಸ್ಪ್ಯಾಚ್ (ಬಿಎಂಟಿಸಿ)',
    fieldTerminal: 'ಕ್ಷೇತ್ರ ಪ್ರಭಾರಿ ನಿಯಂತ್ರಣ ಕೊಠಡಿ',
    depotHub: 'ಘಟಕ ಕಾರ್ಯಾಚರಣೆ ಕೇಂದ್ರ (ಡಿಪೋ)',
    driverMap: 'ಚಾಲಕರ ಮಾರ್ಗ ನಕ್ಷೆ',
    logout: 'ನಿರ್ಗಮಿಸಿ (ಲಾಗ್ ಔಟ್)',
    switchLanguage: 'English',

    telemetryBadge: 'ಬಿಎಂಟಿಸಿ ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ ಸಂಪರ್ಕ',
    fieldTitle: 'ಕ್ಷೇತ್ರ ರವಾನೆ ಮತ್ತು ಪರಿಹಾರ ಬಸ್ ಟ್ರ್ಯಾಕರ್',
    fieldSubtitle: 'ಮಾರ್ಗದಲ್ಲಿರುವ ಬಸ್‌ಗಳು, ಚಾಲಕರ ಸಂಪರ್ಕ ಮಾಹಿತಿ, ಹಾದುಹೋಗುವ ನಿಲ್ದಾಣಗಳು ಮತ್ತು ಆಗಮನದ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ.',

    tabActiveTransit: 'ಪ್ರಸ್ತುತ ಚಲನೆಯಲ್ಲಿರುವ ಬಸ್‌ಗಳು',
    tabCompletedArchive: 'ಪೂರ್ಣಗೊಂಡ ಸೇವೆಗಳ ಇತಿಹಾಸ',

    commuters: 'ಪ್ರಯಾಣಿಕರು',
    busesReq: 'ಅಗತ್ಯವಿರುವ ಬಸ್‌ಗಳು',
    requestedDepot: 'ವಿನಂತಿಸಿದ ಡಿಪೋ',
    waitingOnDepot: 'ಡಿಪೋ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
    dispatchedFrom: 'ಬಸ್ ಹೊರಟಿದೆ - ಡಿಪೋ',
    busVehicle: 'ಬಸ್ ಸಂಖ್ಯೆ',
    dutyPilot: 'ಕರ್ತವ್ಯ ನಿರತ ಚಾಲಕ',
    driverMobile: 'ಚಾಲಕರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    liveEta: 'ಆಗಮನದ ಸಮಯ (ETA)',
    viewTraveledStops: 'ಮಾರ್ಗದ ನಿಲ್ದಾಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    hideTraveledStops: 'ನಿಲ್ದಾಣಗಳನ್ನು ಮರೆಮಾಡಿ',
    completeTrip: 'ಪ್ರಯಾಣ ಪೂರ್ಣಗೊಳಿಸಿ',
    missionCompleted: 'ಕಾರ್ಯಾಚರಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
    commutersCleared: 'ಪ್ರಯಾಣಿಕರನ್ನು ಕರೆದೊಯ್ಯಲಾಗಿದೆ',

    formHeaderBadge: 'ಕ್ಷೇತ್ರ ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಪ್ರಸಾರ',
    formTitle: 'ಹೆಚ್ಚುವರಿ ಜನದಟ್ಟಣೆ ವರದಿ ಮಾಡಿ',
    currentStop: 'ಪ್ರಸ್ತುತ ಬಸ್ ನಿಲ್ದಾಣ',
    surgePriority: 'ಜನದಟ್ಟಣೆಯ ತೀವ್ರತೆ',
    moderate: 'ಸಾಧಾರಣ',
    surge: 'ಹೆಚ್ಚಿನ ದಟ್ಟಣೆ',
    critical: 'ಅತ್ಯಂತ ತುರ್ತು',
    estimatedCommuters: 'ಕಾಯುತ್ತಿರುವ ಪ್ರಯಾಣಿಕರ ಅಂದಾಜು ಸಂಖ್ಯೆ',
    paxPerBus: '~೬೫ ಮಂದಿ / ಬಸ್',
    fleetSizing: 'ಅಗತ್ಯವಿರುವ ಪರಿಹಾರ ಬಸ್‌ಗಳ ಲೆಕ್ಕಾಚಾರ',
    targetNearestDepot: 'ಹತ್ತಿರದ ನಿಯೋಜಿತ ಡಿಪೋ:',
    roadDistance: 'ರಸ್ತೆ ಅಂತರ:',
    busesReady: 'ಬಸ್‌ಗಳು ಸಿದ್ಧವಿವೆ',
    sendRequestBtn: 'ಮನವಿ ಕಳುಹಿಸಿ -',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('bmtc_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'kn' : 'en';
    setLang(nextLang);
    localStorage.setItem('bmtc_lang', nextLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
