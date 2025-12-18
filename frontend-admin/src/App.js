import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import QuestionnaireAdmin from './pages/QuestionnaireAdmin';
import TestCloudinary from './pages/TestCloudinary';
import TestCompressionSimple from './pages/TestCompressionSimple';
import ApporteursGestion from './pages/ApporteursGestion';
import ApporteurDashboard from './pages/ApporteurDashboard';
import './App.css';

// Component to handle route access based on user type
const AdminRoute = ({ children }) => {
  const { isAdmin, isApporteur } = useAuth();

  // If user is apporteur, redirect to their dashboard
  if (isApporteur) {
    return <Navigate to="/apporteur-dashboard" replace />;
  }

  return children;
};

// Component for default redirect based on user type
const DefaultRedirect = () => {
  const { isApporteur } = useAuth();
  return <Navigate to={isApporteur ? "/apporteur-dashboard" : "/dashboard"} replace />;
};

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
                      <Route path="/" element={<DefaultRedirect />} />

                      {/* Apporteur Dashboard - accessible to apporteurs */}
                      <Route path="/apporteur-dashboard" element={<ApporteurDashboard />} />

                      {/* Admin-only routes */}
                      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                      <Route path="/videos" element={<AdminRoute><Videos /></AdminRoute>} />
                      <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
                      <Route path="/apporteurs" element={<AdminRoute><ApporteursGestion /></AdminRoute>} />
                      <Route path="/accueil" element={<AdminRoute><Accueil /></AdminRoute>} />
                      <Route path="/presentation" element={<AdminRoute><PresentationAdmin /></AdminRoute>} />
                      <Route path="/promoteur" element={<AdminRoute><PromoteurAdmin /></AdminRoute>} />
                      <Route path="/architecte" element={<AdminRoute><ArchitecteAdmin /></AdminRoute>} />
                      <Route path="/logements" element={<AdminRoute><LogementsAdmin /></AdminRoute>} />
                      <Route path="/logements-gestion" element={<AdminRoute><LogementsGestion /></AdminRoute>} />
                      <Route path="/visite3d" element={<AdminRoute><Visite3DAdmin /></AdminRoute>} />
                      <Route path="/localisation" element={<AdminRoute><LocalisationAdmin /></AdminRoute>} />
                      <Route path="/analyse-economique" element={<AdminRoute><AnalyseEconomiqueAdmin /></AdminRoute>} />
                      <Route path="/option-achat" element={<AdminRoute><OptionAchatAdmin /></AdminRoute>} />
                      <Route path="/questionnaire" element={<AdminRoute><QuestionnaireAdmin /></AdminRoute>} />
                      <Route path="/test-cloudinary" element={<AdminRoute><TestCloudinary /></AdminRoute>} />
                      <Route path="/test-compression" element={<AdminRoute><TestCompressionSimple /></AdminRoute>} />
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
