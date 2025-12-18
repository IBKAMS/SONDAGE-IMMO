import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSpinner, FaEye, FaEyeSlash, FaPhone, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Email ou téléphone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Rediriger vers le dashboard approprié selon le type d'utilisateur
      if (userType === 'apporteur') {
        navigate('/apporteur-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!identifier || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const result = await login(identifier, password);

      if (result.success) {
        // Rediriger vers le dashboard approprié selon le type d'utilisateur
        if (result.userType === 'apporteur') {
          navigate('/apporteur-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <motion.div
            className="login-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <span className="logo-icon">🏠</span>
          </motion.div>
          <h1 className="login-title">Panneau d'Administration</h1>
          <p className="login-subtitle">Connectez-vous pour continuer</p>
        </div>

        {error && (
          <motion.div
            className="login-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier" className="form-label">
              <FaUser className="label-icon" />
              Email ou Téléphone
            </label>
            <input
              type="text"
              id="identifier"
              className="form-input"
              placeholder="votre@email.com ou +225 07 XX XX XX"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="label-icon" />
              Mot de passe
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Application de Sondage Immobilier - Administration
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
