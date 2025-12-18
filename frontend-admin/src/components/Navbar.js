import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaVideo, FaChartBar, FaTachometerAlt, FaBars, FaTimes, FaHome, FaFileAlt, FaBuilding, FaDraftingCompass, FaCube, FaMapMarkerAlt, FaChartLine, FaMoneyBillWave, FaClipboardList, FaSignOutAlt, FaUser, FaUserTie } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isApporteur, userType } = useAuth();

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

  // Menu items for admin users
  const adminMenuItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Tableau de bord' },
    { path: '/videos', icon: <FaVideo />, label: 'Vidéos/Images' },
    { path: '/analytics', icon: <FaChartBar />, label: 'Analyses' },
    { path: '/apporteurs', icon: <FaUserTie />, label: 'Apporteurs' },
    { path: '/accueil', icon: <FaHome />, label: 'Accueil' },
    { path: '/presentation', icon: <FaFileAlt />, label: 'Présentation' },
    { path: '/promoteur', icon: <FaBuilding />, label: 'Promoteur' },
    { path: '/architecte', icon: <FaDraftingCompass />, label: 'Architecte' },
    { path: '/logements', icon: <FaHome />, label: 'Logements' },
    { path: '/logements-gestion', icon: <FaHome />, label: 'Gestion Logements' },
    { path: '/visite3d', icon: <FaCube />, label: 'Visite 3D' },
    { path: '/localisation', icon: <FaMapMarkerAlt />, label: 'Localisation' },
    { path: '/analyse-economique', icon: <FaChartLine />, label: 'Analyse Économique' },
    { path: '/option-achat', icon: <FaMoneyBillWave />, label: 'Option d\'Achat' },
    { path: '/questionnaire', icon: <FaClipboardList />, label: 'Questionnaire' },
  ];

  // Menu items for apporteur users (limited view)
  const apporteurMenuItems = [
    { path: '/apporteur-dashboard', icon: <FaTachometerAlt />, label: 'Mon Tableau de bord' },
  ];

  // Select menu items based on user type
  const menuItems = isApporteur ? apporteurMenuItems : adminMenuItems;

  // Logo link based on user type
  const logoLink = isApporteur ? '/apporteur-dashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={logoLink} className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">{isApporteur ? 'APPORTEUR' : 'ADMIN'}</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path)}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {/* User Info and Logout */}
          <li className="nav-item nav-user">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span className="user-name">
                {user ? `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email : 'Utilisateur'}
              </span>
              {isApporteur && user?.code && (
                <span className="user-code">Code: {user.code}</span>
              )}
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
