import React, { useEffect, useState, useCallback } from 'react';
import './NewYearCelebration2026.css';

const NewYearCelebration2026 = () => {
  const [fireworks, setFireworks] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sparkleTrail, setSparkleTrail] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  // Compte à rebours vers 2026
  useEffect(() => {
    const target = new Date('2026-01-01T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Feux d'artifice automatiques
  useEffect(() => {
    const createFirework = () => {
      const id = Date.now();
      const firework = {
        id,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 40,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#F472B6', '#34D399'][Math.floor(Math.random() * 6)],
        size: 80 + Math.random() * 60
      };

      setFireworks(prev => [...prev, firework]);

      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== id));
      }, 1500);
    };

    // Premier feu d'artifice après 2 secondes
    const initialTimeout = setTimeout(createFirework, 2000);

    // Feux d'artifice périodiques
    const interval = setInterval(() => {
      if (Math.random() > 0.3) createFirework();
    }, 3000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Trail de sparkles sur le curseur
  const handleMouseMove = useCallback((e) => {
    const sparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      size: 5 + Math.random() * 10
    };

    setSparkleTrail(prev => [...prev.slice(-15), sparkle]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Nettoyer les sparkles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setSparkleTrail(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  // Fermer le message de bienvenue
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="new-year-2026">
      {/* Message de bienvenue animé */}
      {showWelcome && (
        <div className="welcome-overlay" onClick={() => setShowWelcome(false)}>
          <div className="welcome-content">
            <div className="welcome-year">
              <span className="digit">2</span>
              <span className="digit">0</span>
              <span className="digit">2</span>
              <span className="digit">6</span>
            </div>
            <h2 className="welcome-title">Bonne Année !</h2>
            <p className="welcome-subtitle">L'année de votre nouvelle maison</p>
            <div className="welcome-house">🏠</div>
            <span className="click-hint">Cliquez pour continuer</span>
          </div>
        </div>
      )}

      {/* Feux d'artifice */}
      {fireworks.map(fw => (
        <div
          key={fw.id}
          className="firework"
          style={{
            left: `${fw.x}%`,
            top: `${fw.y}%`,
            '--fw-color': fw.color,
            '--fw-size': `${fw.size}px`
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="firework-particle" style={{ '--i': i }} />
          ))}
        </div>
      ))}

      {/* Trail de sparkles curseur */}
      {sparkleTrail.map(sparkle => (
        <div
          key={sparkle.id}
          className="cursor-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size
          }}
        />
      ))}

      {/* Compte à rebours */}
      <div className="countdown-widget">
        <div className="countdown-title">
          <span className="countdown-icon">🎆</span>
          2026 dans
        </div>
        <div className="countdown-timer">
          <div className="countdown-item">
            <span className="countdown-value">{countdown.days}</span>
            <span className="countdown-label">jours</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
            <span className="countdown-label">heures</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">min</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-item">
            <span className="countdown-value countdown-seconds">{String(countdown.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">sec</span>
          </div>
        </div>
      </div>

      {/* Badge flottant amélioré */}
      <div className="floating-badge">
        <div className="badge-glow"></div>
        <div className="badge-content">
          <span className="badge-emoji">🏡</span>
          <span className="badge-text">Votre maison en 2026</span>
          <span className="badge-emoji">✨</span>
        </div>
      </div>

      {/* Étoiles de fond */}
      <div className="stars-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Ruban doré */}
      <div className="golden-ribbon">
        <div className="ribbon-content">
          <span>🌟</span>
          <span>OFFRE SPÉCIALE 2026</span>
          <span>•</span>
          <span>Réservez votre villa dès maintenant</span>
          <span>•</span>
          <span>CITÉ KONGO</span>
          <span>🌟</span>
        </div>
      </div>
    </div>
  );
};

export default NewYearCelebration2026;
