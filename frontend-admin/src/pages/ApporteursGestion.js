import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch,
  FaEye, FaToggleOn, FaToggleOff, FaCopy, FaCheck,
  FaSync, FaTimes, FaUserTie, FaChartLine, FaMoneyBillWave,
  FaEnvelope, FaPhone, FaGlobe, FaPercent, FaKey, FaLock,
  FaSignInAlt, FaEyeSlash, FaRoad, FaClipboardList, FaPhoneAlt,
  FaSearchLocation, FaClipboardCheck, FaFileSignature, FaHardHat, FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import './ApporteursGestion.css';

// Définition des étapes du dossier
const ETAPES_DOSSIER = [
  { id: 'dossier_cree', label: 'Dossier créé', icon: FaClipboardList },
  { id: 'contact_etabli', label: 'Contact établi', icon: FaPhoneAlt },
  { id: 'visite_effectuee', label: 'Visite effectuée', icon: FaSearchLocation },
  { id: 'reservation', label: 'Réservation', icon: FaClipboardCheck },
  { id: 'financement_valide', label: 'Financement validé', icon: FaMoneyBillWave },
  { id: 'signature_notaire', label: 'Signature notaire', icon: FaFileSignature },
  { id: 'construction', label: 'Construction', icon: FaHardHat },
  { id: 'remise_cles', label: 'Remise des clés', icon: FaHome }
];

const ApporteursGestion = () => {
  const navigate = useNavigate();
  const { loginAsApporteur, user } = useAuth();

  const [apporteurs, setApporteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showProspectsModal, setShowProspectsModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedApporteur, setSelectedApporteur] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [adminPassword, setAdminPassword] = useState('');
  const [accessError, setAccessError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    pays: 'Côte d\'Ivoire',
    password: '',
    confirmPassword: '',
    tauxCommission: 2
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [updatingEtape, setUpdatingEtape] = useState(null);

  useEffect(() => {
    fetchApporteurs();
  }, []);

  const fetchApporteurs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteurs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setApporteurs(result.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des apporteurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProspects = async (apporteurId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteurs/${apporteurId}/prospects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setProspects(result.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
    }
  };

  const handleOpenModal = (apporteur = null) => {
    if (apporteur) {
      setSelectedApporteur(apporteur);
      setFormData({
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone || '',
        pays: apporteur.pays || 'Côte d\'Ivoire',
        password: '',
        confirmPassword: '',
        tauxCommission: apporteur.tauxCommission || 2
      });
    } else {
      setSelectedApporteur(null);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        pays: 'Côte d\'Ivoire',
        password: '',
        confirmPassword: '',
        tauxCommission: 2
      });
    }
    setFormErrors({});
    setShowFormPassword(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApporteur(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    if (!selectedApporteur && !formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    // Vérification de la confirmation du mot de passe (seulement si un mot de passe est saisi)
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = selectedApporteur
        ? `${API_URL}/api/apporteurs/${selectedApporteur._id}`
        : `${API_URL}/api/apporteurs`;

      const method = selectedApporteur ? 'PUT' : 'POST';

      const dataToSend = { ...formData };
      // Supprimer confirmPassword avant l'envoi
      delete dataToSend.confirmPassword;
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        await fetchApporteurs();
        handleCloseModal();
        alert(selectedApporteur ? 'Apporteur modifié avec succès' : 'Apporteur créé avec succès');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'opération');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'opération');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (apporteur) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteurs/${apporteur._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actif: !apporteur.actif })
      });

      if (response.ok) {
        await fetchApporteurs();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (apporteurId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet apporteur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteurs/${apporteurId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchApporteurs();
        alert('Apporteur supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleRegenerateCode = async (apporteurId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir régénérer le code ? L\'ancien code ne sera plus valide.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/apporteurs/${apporteurId}/regenerate-code`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchApporteurs();
        alert('Code régénéré avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la régénération du code');
    }
  };

  const handleViewProspects = async (apporteur) => {
    setSelectedApporteur(apporteur);
    await fetchProspects(apporteur._id);
    setShowProspectsModal(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const togglePasswordVisibility = (apporteurId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [apporteurId]: !prev[apporteurId]
    }));
  };

  const handleOpenAccessModal = (apporteur) => {
    setSelectedApporteur(apporteur);
    setAdminPassword('');
    setAccessError('');
    setShowAccessModal(true);
  };

  const handleAccessDashboard = async () => {
    if (!adminPassword) {
      setAccessError('Veuillez entrer votre mot de passe admin');
      return;
    }

    try {
      const result = await loginAsApporteur(
        selectedApporteur.email,
        user.email,
        adminPassword
      );

      if (result.success) {
        setShowAccessModal(false);
        navigate('/apporteur-dashboard');
      } else {
        setAccessError(result.message || 'Erreur de connexion');
      }
    } catch (error) {
      setAccessError('Erreur lors de l\'accès au dashboard');
    }
  };

  const handleUpdateEtape = async (prospectId, newEtape) => {
    setUpdatingEtape(prospectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/questionnaires/${prospectId}/etape`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ etapeDossier: newEtape })
      });

      if (response.ok) {
        // Rafraîchir la liste des prospects
        if (selectedApporteur) {
          await fetchProspects(selectedApporteur._id);
        }
        // Rafraîchir aussi les apporteurs pour les stats
        await fetchApporteurs();
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la mise à jour de l\'étape');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour de l\'étape');
    } finally {
      setUpdatingEtape(null);
    }
  };

  const getEtapeLabel = (etapeId) => {
    const etape = ETAPES_DOSSIER.find(e => e.id === etapeId);
    return etape ? etape.label : 'Dossier créé';
  };

  const getEtapeIndex = (etapeId) => {
    return ETAPES_DOSSIER.findIndex(e => e.id === etapeId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter apporteurs
  const filteredApporteurs = apporteurs.filter(a => {
    const matchesSearch =
      a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'actif' && a.actif) ||
      (filterStatus === 'inactif' && !a.actif);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalApporteurs = apporteurs.length;
  const activeApporteurs = apporteurs.filter(a => a.actif).length;
  const totalProspects = apporteurs.reduce((sum, a) => sum + (a.statistiques?.prospectsReferes || 0), 0);
  const totalCommissions = apporteurs.reduce((sum, a) => sum + (a.statistiques?.commissionsGagnees || 0), 0);

  if (loading) {
    return (
      <div className="apporteurs-page">
        <div className="loading-container">
          <FaSync className="loading-spinner" />
          <p>Chargement des apporteurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="apporteurs-page">
      {/* Header */}
      <div className="apporteurs-header">
        <div className="header-content">
          <div>
            <h1><FaUserTie /> Gestion des Apporteurs d'Affaires</h1>
            <p>Gérez vos partenaires commerciaux et suivez leurs performances</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <FaUserPlus /> Nouvel Apporteur
          </button>
        </div>
      </div>

      {/* Stats */}
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
            <h3>Total Apporteurs</h3>
            <p className="stat-value">{totalApporteurs}</p>
            <span className="stat-description">{activeApporteurs} actifs</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          style={{ '--stat-color': '#7C3AED' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-content">
            <h3>Prospects Référés</h3>
            <p className="stat-value">{totalProspects}</p>
            <span className="stat-description">Total tous apporteurs</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          style={{ '--stat-color': '#10B981' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-icon"><FaMoneyBillWave /></div>
          <div className="stat-content">
            <h3>Commissions Gagnées</h3>
            <p className="stat-value">{formatCurrency(totalCommissions)}</p>
            <span className="stat-description">Total versé</span>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Apporteurs Table */}
      <div className="apporteurs-table-container">
        <table className="apporteurs-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom Complet</th>
              <th>Contact</th>
              <th>Mot de passe</th>
              <th>Pays</th>
              <th>Commission</th>
              <th>Statistiques</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApporteurs.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  <FaUsers className="empty-icon" />
                  <p>Aucun apporteur trouvé</p>
                </td>
              </tr>
            ) : (
              filteredApporteurs.map((apporteur) => (
                <tr key={apporteur._id}>
                  <td>
                    <div className="code-cell">
                      <span className="apporteur-code">{apporteur.code}</span>
                      <button
                        className="btn-icon btn-copy"
                        onClick={() => handleCopyCode(apporteur.code)}
                        title="Copier le code"
                      >
                        {copiedCode === apporteur.code ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="name-cell">
                      <span className="apporteur-name">{apporteur.prenom} {apporteur.nom}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span><FaEnvelope /> {apporteur.email}</span>
                      {apporteur.telephone && (
                        <span><FaPhone /> {apporteur.telephone}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="password-cell">
                      {apporteur.motDePasseInitial ? (
                        <>
                          <span className="password-value">
                            {visiblePasswords[apporteur._id]
                              ? apporteur.motDePasseInitial
                              : '••••••••'}
                          </span>
                          <button
                            className="btn-icon btn-toggle-password"
                            onClick={() => togglePasswordVisibility(apporteur._id)}
                            title={visiblePasswords[apporteur._id] ? 'Masquer' : 'Afficher'}
                          >
                            {visiblePasswords[apporteur._id] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </>
                      ) : (
                        <span className="password-not-available">
                          <FaLock /> Non disponible
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="pays-badge">
                      <FaGlobe /> {apporteur.pays || 'Non renseigné'}
                    </span>
                  </td>
                  <td>
                    <span className="commission-badge">
                      <FaPercent /> {apporteur.tauxCommission}%
                    </span>
                  </td>
                  <td>
                    <div className="stats-cell">
                      <span className="stat-item">
                        <strong>{apporteur.statistiques?.prospectsReferes || 0}</strong> prospects
                      </span>
                      <span className="stat-item">
                        <strong>{apporteur.statistiques?.conversions || 0}</strong> conversions
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${apporteur.actif ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleStatus(apporteur)}
                      title={apporteur.actif ? 'Désactiver' : 'Activer'}
                    >
                      {apporteur.actif ? <FaToggleOn /> : <FaToggleOff />}
                      <span>{apporteur.actif ? 'Actif' : 'Inactif'}</span>
                    </button>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-icon btn-access"
                        onClick={() => handleOpenAccessModal(apporteur)}
                        title="Accéder au dashboard"
                      >
                        <FaSignInAlt />
                      </button>
                      <button
                        className="btn-icon btn-view"
                        onClick={() => handleViewProspects(apporteur)}
                        title="Voir les prospects"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleOpenModal(apporteur)}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-regenerate"
                        onClick={() => handleRegenerateCode(apporteur._id)}
                        title="Régénérer le code"
                      >
                        <FaKey />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(apporteur._id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <h2>
                {selectedApporteur ? (
                  <><FaEdit /> Modifier l'Apporteur</>
                ) : (
                  <><FaUserPlus /> Nouvel Apporteur</>
                )}
              </h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className={formErrors.prenom ? 'error' : ''}
                  />
                  {formErrors.prenom && <span className="error-message">{formErrors.prenom}</span>}
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className={formErrors.nom ? 'error' : ''}
                  />
                  {formErrors.nom && <span className="error-message">{formErrors.nom}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label><FaGlobe className="label-icon" /> Pays de résidence</label>
                  <select
                    value={formData.pays}
                    onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                  >
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="France">France</option>
                    <option value="États-Unis">États-Unis</option>
                    <option value="Canada">Canada</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Mali">Mali</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaLock className="label-icon" /> Mot de passe {selectedApporteur ? '(laisser vide pour ne pas changer)' : '*'}
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showFormPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={formErrors.password ? 'error' : ''}
                      placeholder={selectedApporteur ? '••••••••' : 'Minimum 6 caractères'}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      title={showFormPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showFormPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                </div>
                <div className="form-group">
                  <label>
                    <FaLock className="label-icon" /> Confirmer le mot de passe {!selectedApporteur && '*'}
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showFormPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={formErrors.confirmPassword ? 'error' : ''}
                      placeholder="Retapez le mot de passe"
                    />
                  </div>
                  {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-group">
                <label><FaPercent className="label-icon" /> Taux de Commission (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.tauxCommission}
                  onChange={(e) => setFormData({ ...formData, tauxCommission: parseFloat(e.target.value) })}
                />
              </div>

              {selectedApporteur && (
                <div className="current-code-info">
                  <FaKey />
                  <span>Code actuel: <strong>{selectedApporteur.code}</strong></span>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : (selectedApporteur ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Prospects */}
      {showProspectsModal && selectedApporteur && (
        <div className="modal-overlay" onClick={() => setShowProspectsModal(false)}>
          <motion.div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <h2>
                <FaEye /> Prospects de {selectedApporteur.prenom} {selectedApporteur.nom}
              </h2>
              <button className="btn-close" onClick={() => setShowProspectsModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="prospects-summary">
              <div className="summary-item">
                <strong>{selectedApporteur.statistiques?.prospectsReferes || 0}</strong>
                <span>Prospects référés</span>
              </div>
              <div className="summary-item">
                <strong>{selectedApporteur.statistiques?.conversions || 0}</strong>
                <span>Conversions</span>
              </div>
              <div className="summary-item">
                <strong>{formatCurrency(selectedApporteur.statistiques?.commissionsGagnees || 0)}</strong>
                <span>Commissions gagnées</span>
              </div>
              <div className="summary-item">
                <strong>{formatCurrency(selectedApporteur.statistiques?.commissionsEnAttente || 0)}</strong>
                <span>En attente</span>
              </div>
            </div>

            <div className="prospects-list">
              {prospects.length === 0 ? (
                <div className="empty-prospects">
                  <FaUsers className="empty-icon" />
                  <p>Aucun prospect référé par cet apporteur</p>
                </div>
              ) : (
                <table className="prospects-table">
                  <thead>
                    <tr>
                      <th>N° Dossier</th>
                      <th>Nom</th>
                      <th>Contact</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th><FaRoad /> Étape Dossier</th>
                      <th>Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prospects.map((prospect) => {
                      const currentEtapeIndex = getEtapeIndex(prospect.etapeDossier || 'dossier_cree');
                      return (
                        <tr key={prospect._id}>
                          <td>
                            <span className="dossier-number">{prospect.numeroDossier || '-'}</span>
                          </td>
                          <td>{prospect.prenom} {prospect.nom}</td>
                          <td>
                            <div className="prospect-contact">
                              <span>{prospect.email}</span>
                              <span>{prospect.telephone}</span>
                            </div>
                          </td>
                          <td>{new Date(prospect.date_soumission).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <span className={`status-badge status-${prospect.statut}`}>
                              {prospect.statut}
                            </span>
                          </td>
                          <td>
                            <div className="etape-selector-container">
                              <select
                                className={`etape-select etape-${currentEtapeIndex >= 3 ? 'advanced' : currentEtapeIndex >= 1 ? 'progress' : 'start'}`}
                                value={prospect.etapeDossier || 'dossier_cree'}
                                onChange={(e) => handleUpdateEtape(prospect._id, e.target.value)}
                                disabled={updatingEtape === prospect._id}
                              >
                                {ETAPES_DOSSIER.map((etape, index) => (
                                  <option key={etape.id} value={etape.id}>
                                    {index + 1}. {etape.label}
                                  </option>
                                ))}
                              </select>
                              {updatingEtape === prospect._id && (
                                <FaSync className="etape-loading" />
                              )}
                              <div className="etape-progress-bar">
                                <div
                                  className="etape-progress-fill"
                                  style={{ width: `${((currentEtapeIndex + 1) / ETAPES_DOSSIER.length) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`commission-status status-${prospect.commission?.statut || 'non_applicable'}`}>
                              {prospect.commission?.statut === 'payee'
                                ? formatCurrency(prospect.commission?.montant || 0)
                                : prospect.commission?.statut || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Access Dashboard */}
      {showAccessModal && selectedApporteur && (
        <div className="modal-overlay" onClick={() => setShowAccessModal(false)}>
          <motion.div
            className="modal-content modal-small"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <h2>
                <FaSignInAlt /> Accès Dashboard Apporteur
              </h2>
              <button className="btn-close" onClick={() => setShowAccessModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="access-modal-content">
              <div className="apporteur-info-box">
                <p><strong>Apporteur :</strong> {selectedApporteur.prenom} {selectedApporteur.nom}</p>
                <p><strong>Email :</strong> {selectedApporteur.email}</p>
                {selectedApporteur.telephone && (
                  <p><strong>Téléphone :</strong> {selectedApporteur.telephone}</p>
                )}
              </div>

              <p className="access-description">
                Pour accéder au dashboard de cet apporteur, veuillez entrer votre mot de passe administrateur.
              </p>

              {accessError && (
                <div className="access-error">
                  {accessError}
                </div>
              )}

              <div className="form-group">
                <label><FaLock /> Mot de passe Admin</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe admin"
                  onKeyPress={(e) => e.key === 'Enter' && handleAccessDashboard()}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAccessModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAccessDashboard}
                >
                  <FaSignInAlt /> Accéder au Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApporteursGestion;
