import React, { useEffect, useState } from 'react';
import './NewYearCelebration.css';

const NewYearCelebration = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Générer des particules scintillantes
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 2 + Math.random() * 4,
          type: Math.random() > 0.5 ? 'star' : 'sparkle'
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="new-year-celebration">
      {/* Particules scintillantes */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`particle ${particle.type}`}
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
      </div>

      {/* Badge 2026 flottant */}
      <div className="year-badge">
        <span className="year-text">2026</span>
        <span className="year-subtitle">Nouvelle Année</span>
      </div>

      {/* Bannière festive */}
      <div className="festive-banner">
        <div className="banner-content">
          <span className="sparkle-icon">✨</span>
          <span className="banner-text">
            En 2026, offrez-vous la maison de vos rêves !
          </span>
          <span className="sparkle-icon">🏠</span>
        </div>
      </div>
    </div>
  );
};

export default NewYearCelebration;
