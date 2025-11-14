import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CITÉ KONGO</h3>
            <p>Votre projet immobilier de prestige en Côte d'Ivoire</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/presentation">Présentation</Link></li>
              <li><Link to="/logements">Logements</Link></li>
              <li><Link to="/localisation">Localisation</Link></li>
              <li><Link to="/option-achat">Option d'Achat</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Informations</h4>
            <ul>
              <li><Link to="/promoteur">Le Promoteur</Link></li>
              <li><Link to="/architecte">L'Architecte</Link></li>
              <li><Link to="/analyse-economique">Analyse Économique</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="contact-info">
              <li>
                <FaPhone />
                <span>+225 XX XX XX XX XX</span>
              </li>
              <li>
                <FaEnvelope />
                <span>contact@citekongo.ci</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Kongo Immobilier. Tous droits réservés. | Powered by ALiz Strategy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
