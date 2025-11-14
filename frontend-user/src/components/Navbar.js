import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/presentation', label: 'Présentation' },
    { path: '/promoteur', label: 'Promoteur' },
    { path: '/architecte', label: 'Architecte' },
    { path: '/logements', label: 'Logements' },
    { path: '/visite-3d', label: 'Visite 3D' },
    { path: '/localisation', label: 'Localisation' },
    { path: '/analyse-economique', label: 'Analyse Économique' },
    { path: '/option-achat', label: 'Option d\'Achat' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h1>CITÉ KONGO</h1>
          </Link>

          <button className="navbar-toggler" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={location.pathname === link.path ? 'active' : ''}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
