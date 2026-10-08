import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DispatchProvider } from './context/DispatchContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import PassengerPortal from './pages/PassengerPortal';
import ReporterView from './pages/ReporterView';
import DepotDashboard from './pages/DepotDashboard';
import DriverRoutes from './pages/DriverRoutes';

export default function App() {
  return (
    <LanguageProvider>
      <DispatchProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/passenger"
                element={
                  <>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 py-6">
                      <PassengerPortal />
                    </main>
                  </>
                }
              />

              <Route
                path="/reporter"
                element={
                  <>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 py-6">
                      <ReporterView />
                    </main>
                  </>
                }
              />

              <Route
                path="/depot"
                element={
                  <>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 py-6">
                      <DepotDashboard />
                    </main>
                  </>
                }
              />

              <Route
                path="/routes"
                element={
                  <>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 py-6">
                      <DriverRoutes />
                    </main>
                  </>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DispatchProvider>
    </LanguageProvider>
  );
}
