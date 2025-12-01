import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Presentation from './pages/Presentation';
import Promoteur from './pages/Promoteur';
import Architecte from './pages/Architecte';
import Logements from './pages/Logements';
import Visite3D from './pages/Visite3D';
import Localisation from './pages/Localisation';
import AnalyseEconomique from './pages/AnalyseEconomique';
import OptionAchat from './pages/OptionAchat';
import Questionnaire from './pages/Questionnaire';

// Composants globaux
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/presentation" element={<Presentation />} />
            <Route path="/promoteur" element={<Promoteur />} />
            <Route path="/architecte" element={<Architecte />} />
            <Route path="/logements" element={<Logements />} />
            <Route path="/visite-3d" element={<Visite3D />} />
            <Route path="/localisation" element={<Localisation />} />
            <Route path="/analyse-economique" element={<AnalyseEconomique />} />
            <Route path="/option-achat" element={<OptionAchat />} />
            <Route path="/questionnaire/:logementId?" element={<Questionnaire />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
