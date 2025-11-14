import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaBuilding, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import API_URL from '../config';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/home-content`);
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-page"><div className="loading">Chargement...</div></div>;
  }

  if (!content) {
    return <div className="home-page"><div className="error">Erreur de chargement du contenu</div></div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content.hero.title}</h1>
            <p className="hero-subtitle">
              {content.hero.subtitle}
            </p>
            <p className="hero-description">
              {content.hero.description}
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate('/logements')}
              >
                {content.hero.primaryButtonText}
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={() => navigate('/option-achat')}
              >
                {content.hero.secondaryButtonText}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {content.stats.sort((a, b) => a.order - b.order).map((stat, index) => {
              const icons = [FaHome, FaBuilding, FaMapMarkedAlt, FaChartLine];
              const Icon = icons[index % icons.length];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="stat-card"
                >
                  <Icon className="stat-icon" />
                  <h3>{stat.title}</h3>
                  <p>{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section quick-links-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {content.quickLinks.sectionTitle}
          </motion.h2>

          <div className="quick-links-grid">
            {content.quickLinks.cards.sort((a, b) => a.order - b.order).map((card, index) => {
              const routes = ['/presentation', '/promoteur', '/architecte', '/localisation'];
              const route = routes[index % routes.length];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="quick-link-card"
                  onClick={() => navigate(route)}
                >
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>{content.cta.title}</h2>
            <p>{content.cta.description}</p>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/option-achat')}
            >
              {content.cta.buttonText}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
