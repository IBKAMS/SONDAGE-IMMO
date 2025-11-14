import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_URL from '../config';
import './Presentation.css';

const Presentation = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresentationContent();
  }, []);

  const fetchPresentationContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/presentation-content`);
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
    return <div className="presentation-page"><div className="loading">Chargement...</div></div>;
  }

  if (!content) {
    return <div className="presentation-page"><div className="error">Erreur de chargement du contenu</div></div>;
  }

  return (
    <div className="presentation-page">
      <section className="presentation-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content.hero.title}</h1>
            <p className="hero-subtitle">{content.hero.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="content-section"
          >
            <h2 className="section-title">{content.project.title}</h2>
            <p className="lead">
              {content.project.leadParagraph}
            </p>
            <p>
              {content.project.description}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Presentation;
