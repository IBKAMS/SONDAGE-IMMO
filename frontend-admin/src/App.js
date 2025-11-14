import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Analytics from './pages/Analytics';
import Accueil from './pages/Accueil';
import PresentationAdmin from './pages/PresentationAdmin';
import PromoteurAdmin from './pages/PromoteurAdmin';
import ArchitecteAdmin from './pages/Architecte';
import LogementsAdmin from './pages/Logements';
import LogementsGestion from './pages/LogementsGestion';
import Visite3DAdmin from './pages/Visite3D';
import LocalisationAdmin from './pages/Localisation';
import AnalyseEconomiqueAdmin from './pages/AnalyseEconomique';
import OptionAchatAdmin from './pages/OptionAchatAdmin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/videos" element={<Videos />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/accueil" element={<Accueil />} />
                      <Route path="/presentation" element={<PresentationAdmin />} />
                      <Route path="/promoteur" element={<PromoteurAdmin />} />
                      <Route path="/architecte" element={<ArchitecteAdmin />} />
                      <Route path="/logements" element={<LogementsAdmin />} />
                      <Route path="/logements-gestion" element={<LogementsGestion />} />
                      <Route path="/visite3d" element={<Visite3DAdmin />} />
                      <Route path="/localisation" element={<LocalisationAdmin />} />
                      <Route path="/analyse-economique" element={<AnalyseEconomiqueAdmin />} />
                      <Route path="/option-achat" element={<OptionAchatAdmin />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
