import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaVideo, FaChartBar, FaTachometerAlt, FaBars, FaTimes, FaHome, FaFileAlt, FaBuilding, FaDraftingCompass, FaCube, FaMapMarkerAlt, FaChartLine, FaMoneyBillWave, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">ADMIN</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard')}`}
              onClick={closeMenu}
            >
              <FaTachometerAlt className="nav-icon" />
              <span>Tableau de bord</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/videos"
              className={`nav-link ${isActive('/videos')}`}
              onClick={closeMenu}
            >
              <FaVideo className="nav-icon" />
              <span>Vidéos/Images</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/analytics"
              className={`nav-link ${isActive('/analytics')}`}
              onClick={closeMenu}
            >
              <FaChartBar className="nav-icon" />
              <span>Analyses</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/accueil"
              className={`nav-link ${isActive('/accueil')}`}
              onClick={closeMenu}
            >
              <FaHome className="nav-icon" />
              <span>Accueil</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/presentation"
              className={`nav-link ${isActive('/presentation')}`}
              onClick={closeMenu}
            >
              <FaFileAlt className="nav-icon" />
              <span>Présentation</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/promoteur"
              className={`nav-link ${isActive('/promoteur')}`}
              onClick={closeMenu}
            >
              <FaBuilding className="nav-icon" />
              <span>Promoteur</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/architecte"
              className={`nav-link ${isActive('/architecte')}`}
              onClick={closeMenu}
            >
              <FaDraftingCompass className="nav-icon" />
              <span>Architecte</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/logements"
              className={`nav-link ${isActive('/logements')}`}
              onClick={closeMenu}
            >
              <FaHome className="nav-icon" />
              <span>Logements</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/logements-gestion"
              className={`nav-link ${isActive('/logements-gestion')}`}
              onClick={closeMenu}
            >
              <FaHome className="nav-icon" />
              <span>Gestion Logements</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/visite3d"
              className={`nav-link ${isActive('/visite3d')}`}
              onClick={closeMenu}
            >
              <FaCube className="nav-icon" />
              <span>Visite 3D</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/localisation"
              className={`nav-link ${isActive('/localisation')}`}
              onClick={closeMenu}
            >
              <FaMapMarkerAlt className="nav-icon" />
              <span>Localisation</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/analyse-economique"
              className={`nav-link ${isActive('/analyse-economique')}`}
              onClick={closeMenu}
            >
              <FaChartLine className="nav-icon" />
              <span>Analyse Économique</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/option-achat"
              className={`nav-link ${isActive('/option-achat')}`}
              onClick={closeMenu}
            >
              <FaMoneyBillWave className="nav-icon" />
              <span>Option d'Achat</span>
            </Link>
          </li>

          {/* User Info and Logout */}
          <li className="nav-item nav-user">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span className="user-name">
                {user ? `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email : 'Admin'}
              </span>
            </div>
          </li>

          <li className="nav-item">
            <button
              className="nav-link logout-button"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="nav-icon" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
