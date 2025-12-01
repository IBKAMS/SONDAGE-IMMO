import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import API_URL from '../config';
import './Footer.css';

const Footer = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/footer-content`);
        const data = await response.json();
        if (data.success) {
          setContent(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement footer:', error);
      }
    };

    fetchFooterContent();
  }, []);

  // Valeurs par défaut si l'API n'est pas disponible
  const brand = content?.brand || {
    name: 'CITÉ KONGO',
    slogan: "Votre projet immobilier de prestige en Côte d'Ivoire"
  };

  const navigation = content?.navigation?.links || [
    { label: 'Présentation', url: '/presentation' },
    { label: 'Logements', url: '/logements' },
    { label: 'Localisation', url: '/localisation' },
    { label: "Option d'Achat", url: '/option-achat' }
  ];

  const informations = content?.informations?.links || [
    { label: 'Le Promoteur', url: '/promoteur' },
    { label: "L'Architecte", url: '/architecte' },
    { label: 'Analyse Économique', url: '/analyse-economique' }
  ];

  const contact = content?.contact || {
    phone: '+225 XX XX XX XX XX',
    email: 'contact@citekongo.ci',
    address: "Abidjan, Côte d'Ivoire"
  };

  const copyright = content?.copyright?.text || `© ${new Date().getFullYear()} Kongo Immobilier. Tous droits réservés. | Powered by ALiz Strategy`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{brand.name}</h3>
            <p>{brand.slogan}</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>{content?.navigation?.title || 'Navigation'}</h4>
            <ul>
              {navigation.map((link, index) => (
                <li key={index}>
                  <Link to={link.url}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>{content?.informations?.title || 'Informations'}</h4>
            <ul>
              {informations.map((link, index) => (
                <li key={index}>
                  <Link to={link.url}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>{content?.contact?.title || 'Contact'}</h4>
            <ul className="contact-info">
              <li>
                <FaPhone />
                <span>{contact.phone}</span>
              </li>
              <li>
                <FaEnvelope />
                <span>{contact.email}</span>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>{contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
