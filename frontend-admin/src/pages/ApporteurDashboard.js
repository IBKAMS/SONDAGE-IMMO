import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaMoneyBillWave, FaChartLine, FaCalendarAlt,
  FaSync, FaEye, FaCopy, FaCheck, FaUserTie, FaClipboardList,
  FaPhoneAlt, FaEnvelope, FaHome, FaPercentage, FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import './ApporteurDashboard.css';

const ApporteurDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('prospects');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/apporteur/dashboard/stats`, { headers });
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        setStats(statsResult.data);
      }

      // Fetch prospects
      const prospectsResponse = await fetch(`${API_URL}/api/apporteur/dashboard/prospects`, { headers });
      if (prospectsResponse.ok) {
        const prospectsResult = await prospectsResponse.json();
        setProspects(prospectsResult.data || []);
      }

      // Fetch commissions
      const commissionsResponse = await fetch(`${API_URL}/api/apporteur/dashboard/commissions`, { headers });
      if (commissionsResponse.ok) {
        const commissionsResult = await commissionsResponse.json();
        setCommissions(commissionsResult.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProspect = async (prospectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteur/dashboard/prospects/${prospectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setSelectedProspect(result.data);
        setShowProspectModal(true);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleCopyCode = () => {
    if (user?.code) {
      navigator.clipboard.writeText(user.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'nouveau': return '#3B82F6';
      case 'en_cours': return '#F59E0B';
      case 'converti': return '#10B981';
      case 'perdu': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'converti': return 'Converti';
      case 'perdu': return 'Perdu';
      default: return statut;
    }
  };

  const getCommissionStatusLabel = (statut) => {
    switch (statut) {
      case 'non_applicable': return 'N/A';
      case 'en_attente': return 'En attente';
      case 'validee': return 'Validée';
      case 'payee': return 'Payée';
      default: return statut;
    }
  };

  if (loading) {
    return (
      <div className="apporteur-dashboard">
        <div className="loading-container">
          <FaSync className="loading-spinner" />
          <p>Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="apporteur-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              <FaUserTie /> Bienvenue, {user?.prenom} {user?.nom}
            </h1>
            <p>Voici le suivi de vos activités d'apporteur d'affaires</p>
          </motion.div>
          <div className="code-section">
            <span className="code-label">Votre Code Apporteur</span>
            <div className="code-display">
              <span className="code-value">{user?.code || 'N/A'}</span>
              <button
                className="btn-copy-code"
                onClick={handleCopyCode}
                title="Copier le code"
              >
                {copiedCode ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p className="code-hint">Partagez ce code avec vos prospects</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          style={{ '--stat-color': '#4F46E5' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-content">
            <h3>Prospects Référés</h3>
            <p className="stat-value">{stats?.prospectsReferes || 0}</p>
            <span className="stat-description">Total de prospects apportés</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          style={{ '--stat-color': '#10B981' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-content">
            <h3>Conversions</h3>
            <p className="stat-value">{stats?.conversions || 0}</p>
            <span className="stat-description">Prospects convertis en clients</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          style={{ '--stat-color': '#F59E0B' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-content">
            <h3>Commissions en Attente</h3>
            <p className="stat-value">{formatCurrency(stats?.commissionsEnAttente || 0)}</p>
            <span className="stat-description">Potentielles sur ventes en cours</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card-highlight"
          style={{ '--stat-color': '#7C3AED' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-content">
            <h3>Commissions Gagnées</h3>
            <p className="stat-value">{formatCurrency(stats?.commissionsGagnees || 0)}</p>
            <span className="stat-description">Total des commissions versées</span>
          </div>
        </motion.div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <FaInfoCircle />
        <div>
          <strong>Votre taux de commission : {user?.tauxCommission || 2}%</strong>
          <p>Sur chaque vente réalisée grâce à vos prospects</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'prospects' ? 'active' : ''}`}
          onClick={() => setActiveTab('prospects')}
        >
          <FaClipboardList /> Mes Prospects ({prospects.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'commissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('commissions')}
        >
          <FaMoneyBillWave /> Mes Commissions ({commissions.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'prospects' && (
          <div className="prospects-section">
            {prospects.length === 0 ? (
              <div className="empty-state">
                <FaUsers className="empty-icon" />
                <h3>Aucun prospect pour le moment</h3>
                <p>Partagez votre code <strong>{user?.code}</strong> avec vos contacts pour commencer</p>
              </div>
            ) : (
              <div className="prospects-grid">
                {prospects.map((prospect) => (
                  <motion.div
                    key={prospect._id}
                    className="prospect-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="prospect-header">
                      <div className="prospect-info">
                        <h4>{prospect.prenom} {prospect.nom}</h4>
                        <span className="dossier-number">
                          {prospect.numeroDossier || 'N° en attente'}
                        </span>
                      </div>
                      <span
                        className="status-badge"
                        style={{ '--status-color': getStatusColor(prospect.statut) }}
                      >
                        {getStatusLabel(prospect.statut)}
                      </span>
                    </div>

                    <div className="prospect-details">
                      <div className="detail-item">
                        <FaEnvelope />
                        <span>{prospect.email}</span>
                      </div>
                      {prospect.telephone && (
                        <div className="detail-item">
                          <FaPhoneAlt />
                          <span>{prospect.telephone}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <FaCalendarAlt />
                        <span>{formatDate(prospect.date_soumission)}</span>
                      </div>
                      {prospect.preferences?.propertyType && (
                        <div className="detail-item">
                          <FaHome />
                          <span>{prospect.preferences.propertyType}</span>
                        </div>
                      )}
                    </div>

                    <div className="prospect-footer">
                      <div className="commission-info">
                        <span className="commission-label">Commission:</span>
                        <span className={`commission-status status-${prospect.commission?.statut || 'non_applicable'}`}>
                          {prospect.commission?.statut === 'payee'
                            ? formatCurrency(prospect.commission?.montant || 0)
                            : getCommissionStatusLabel(prospect.commission?.statut || 'non_applicable')}
                        </span>
                      </div>
                      <button
                        className="btn-view"
                        onClick={() => handleViewProspect(prospect._id)}
                      >
                        <FaEye /> Détails
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="commissions-section">
            {commissions.length === 0 ? (
              <div className="empty-state">
                <FaMoneyBillWave className="empty-icon" />
                <h3>Aucune commission pour le moment</h3>
                <p>Les commissions apparaîtront ici lorsque vos prospects seront convertis</p>
              </div>
            ) : (
              <div className="commissions-table-container">
                <table className="commissions-table">
                  <thead>
                    <tr>
                      <th>N° Dossier</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Date Paiement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((commission) => (
                      <tr key={commission._id}>
                        <td>
                          <span className="dossier-number">{commission.numeroDossier || '-'}</span>
                        </td>
                        <td>{commission.prenom} {commission.nom}</td>
                        <td>{formatDate(commission.date_soumission)}</td>
                        <td>
                          <span className="commission-amount">
                            {formatCurrency(commission.commission?.montant || 0)}
                          </span>
                        </td>
                        <td>
                          <span className={`commission-status-badge status-${commission.commission?.statut}`}>
                            {getCommissionStatusLabel(commission.commission?.statut)}
                          </span>
                        </td>
                        <td>
                          {commission.commission?.datePaiement
                            ? formatDate(commission.commission.datePaiement)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Commission Summary */}
            <div className="commission-summary">
              <div className="summary-card">
                <h4>Résumé des Commissions</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">En attente de validation</span>
                    <span className="summary-value pending">
                      {formatCurrency(commissions
                        .filter(c => c.commission?.statut === 'en_attente')
                        .reduce((sum, c) => sum + (c.commission?.montant || 0), 0))}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Validées (en cours)</span>
                    <span className="summary-value validated">
                      {formatCurrency(commissions
                        .filter(c => c.commission?.statut === 'validee')
                        .reduce((sum, c) => sum + (c.commission?.montant || 0), 0))}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payées</span>
                    <span className="summary-value paid">
                      {formatCurrency(commissions
                        .filter(c => c.commission?.statut === 'payee')
                        .reduce((sum, c) => sum + (c.commission?.montant || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prospect Detail Modal */}
      {showProspectModal && selectedProspect && (
        <div className="modal-overlay" onClick={() => setShowProspectModal(false)}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <h2>
                <FaEye /> Détails du Prospect
              </h2>
              <button className="btn-close" onClick={() => setShowProspectModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="prospect-detail-header">
                <div>
                  <h3>{selectedProspect.prenom} {selectedProspect.nom}</h3>
                  <span className="dossier-badge">{selectedProspect.numeroDossier || 'N° en attente'}</span>
                </div>
                <span
                  className="status-badge-large"
                  style={{ '--status-color': getStatusColor(selectedProspect.statut) }}
                >
                  {getStatusLabel(selectedProspect.statut)}
                </span>
              </div>

              <div className="detail-sections">
                <div className="detail-section">
                  <h4>Informations de Contact</h4>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <FaEnvelope />
                      <span>{selectedProspect.email}</span>
                    </div>
                    <div className="detail-row">
                      <FaPhoneAlt />
                      <span>{selectedProspect.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="detail-row">
                      <FaCalendarAlt />
                      <span>Inscrit le {formatDate(selectedProspect.date_soumission)}</span>
                    </div>
                  </div>
                </div>

                {selectedProspect.preferences && (
                  <div className="detail-section">
                    <h4>Préférences</h4>
                    <div className="detail-grid">
                      {selectedProspect.preferences.propertyType && (
                        <div className="detail-row">
                          <FaHome />
                          <span>Type: {selectedProspect.preferences.propertyType}</span>
                        </div>
                      )}
                      {selectedProspect.budget?.globalBudget && (
                        <div className="detail-row">
                          <FaMoneyBillWave />
                          <span>Budget: {formatCurrency(selectedProspect.budget.globalBudget)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Commission</h4>
                  <div className="commission-detail">
                    <div className="commission-row">
                      <span>Statut:</span>
                      <span className={`commission-status-badge status-${selectedProspect.commission?.statut || 'non_applicable'}`}>
                        {getCommissionStatusLabel(selectedProspect.commission?.statut || 'non_applicable')}
                      </span>
                    </div>
                    {selectedProspect.commission?.montant > 0 && (
                      <div className="commission-row">
                        <span>Montant:</span>
                        <span className="commission-amount-large">
                          {formatCurrency(selectedProspect.commission.montant)}
                        </span>
                      </div>
                    )}
                    {selectedProspect.commission?.datePaiement && (
                      <div className="commission-row">
                        <span>Payée le:</span>
                        <span>{formatDate(selectedProspect.commission.datePaiement)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedProspect.score_interet && (
                  <div className="detail-section">
                    <h4>Score d'Intérêt</h4>
                    <div className="score-display">
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{ width: `${selectedProspect.score_interet}%` }}
                        ></div>
                      </div>
                      <span className="score-value">{selectedProspect.score_interet}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tips Section */}
      <div className="tips-section">
        <h3><FaExclamationTriangle /> Conseils pour Réussir</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-number">1</span>
            <h4>Partagez votre code</h4>
            <p>Donnez votre code <strong>{user?.code}</strong> à vos contacts intéressés par l'immobilier</p>
          </div>
          <div className="tip-card">
            <span className="tip-number">2</span>
            <h4>Suivez vos prospects</h4>
            <p>Consultez régulièrement ce tableau de bord pour suivre l'évolution de vos dossiers</p>
          </div>
          <div className="tip-card">
            <span className="tip-number">3</span>
            <h4>Restez informé</h4>
            <p>Les commissions sont versées après la finalisation des ventes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApporteurDashboard;
