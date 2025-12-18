import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import API_URL from '../config';
import './CodeApporteurModal.css';

const CodeApporteurModal = ({ isOpen, onClose, onValidate, onSkip }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validatedApporteur, setValidatedApporteur] = useState(null);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError('');
      setValidatedApporteur(null);
    }
  };

  const validateCode = async () => {
    if (!code || code.length < 5) {
      setError('Le code doit contenir au moins 5 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/apporteurs/validate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (data.valid) {
        setValidatedApporteur(data.apporteur);
        // Attendre un peu pour montrer la validation puis continuer
        setTimeout(() => {
          onValidate(code, data.apporteur);
        }, 1500);
      } else {
        setError(data.message || 'Code non reconnu');
        setValidatedApporteur(null);
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      console.error('Erreur validation code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      validateCode();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="code-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="code-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>

          <div className="modal-header">
            <div className="modal-icon">
              <FaShieldAlt />
            </div>
            <h2>Accès Sécurisé</h2>
            <p className="modal-subtitle">
              Pour plus de sécurité et de confidentialité
            </p>
          </div>

          <div className="modal-body">
            <div className="security-notice">
              <FaLock className="notice-icon" />
              <p>
                Si vous avez été recommandé par un apporteur d'affaires,
                veuillez entrer son code ci-dessous. Sinon, vous pouvez
                continuer sans code.
              </p>
            </div>

            <div className="code-input-container">
              <label htmlFor="codeApporteur">Code Apporteur (optionnel)</label>
              <div className="code-input-wrapper">
                <input
                  type="text"
                  id="codeApporteur"
                  value={code}
                  onChange={handleCodeChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: ABC12"
                  maxLength={6}
                  autoComplete="off"
                  autoFocus
                  disabled={loading || validatedApporteur}
                />
                {validatedApporteur && (
                  <FaCheckCircle className="input-status valid" />
                )}
                {error && (
                  <FaTimesCircle className="input-status invalid" />
                )}
              </div>
              <span className="code-hint">
                {code.length}/5 caractères minimum
              </span>
            </div>

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {validatedApporteur && (
              <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaCheckCircle />
                <span>
                  Code validé ! Apporteur: <strong>{validatedApporteur.prenom} {validatedApporteur.nom}</strong>
                </span>
              </motion.div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn-validate"
              onClick={validateCode}
              disabled={loading || code.length < 5 || validatedApporteur}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Vérification...
                </>
              ) : validatedApporteur ? (
                <>
                  <FaCheckCircle />
                  Validé !
                </>
              ) : (
                'Valider le code'
              )}
            </button>

            <button
              className="btn-skip"
              onClick={handleSkip}
              disabled={loading}
            >
              Continuer sans code
            </button>
          </div>

          <div className="modal-privacy">
            <p>
              Vos données sont protégées et traitées de manière confidentielle
              conformément à notre politique de confidentialité.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CodeApporteurModal;
