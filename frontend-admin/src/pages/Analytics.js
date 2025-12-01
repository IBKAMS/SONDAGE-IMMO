import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaChartLine, FaPercent, FaHome,
  FaMoneyBillWave, FaCalendarAlt, FaFilter,
  FaDownload, FaEye, FaTrash
} from 'react-icons/fa';
import API_URL from '../config';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Treemap
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [responses, setResponses] = useState([]);
  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAllResponsesModal, setShowAllResponsesModal] = useState(false);

  // Nouveaux états pour les modals de détail des statistiques
  const [showTotalResponsesModal, setShowTotalResponsesModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);

  useEffect(() => {
    // Charger les données immédiatement
    fetchResponses();
    fetchLogements();

    // Configurer le rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(() => {
      fetchResponses();
      fetchLogements();
    }, 30000); // 30 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/questionnaires`);
      if (response.ok) {
        const result = await response.json();
        // L'API retourne { success, data, pagination }
        // Le tableau est dans result.data
        setResponses(Array.isArray(result.data) ? result.data : []);
      } else {
        setResponses([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogements = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logements`);
      if (response.ok) {
        const result = await response.json();
        setLogements(Array.isArray(result.data) ? result.data : []);
      } else {
        setLogements([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des logements:', error);
      setLogements([]);
    }
  };

  // Fonction pour afficher les détails d'une réponse
  const handleViewDetails = (response) => {
    setSelectedResponse(response);
    setShowDetailModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedResponse(null);
  };

  // Fonction pour afficher toutes les réponses
  const handleViewAllResponses = () => {
    setShowAllResponsesModal(true);
  };

  // Fonction pour fermer le modal de toutes les réponses
  const handleCloseAllResponsesModal = () => {
    setShowAllResponsesModal(false);
  };

  // Fonction pour supprimer une réponse
  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/questionnaires/${responseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Mettre à jour l'état local en retirant la réponse supprimée
        setResponses(prevResponses => prevResponses.filter(r => r._id !== responseId));
        alert('Réponse supprimée avec succès');
      } else {
        alert('Erreur lors de la suppression de la réponse');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la réponse');
    }
  };

  // Fonction pour vider toutes les réponses
  const handleDeleteAllResponses = async () => {
    if (!window.confirm('⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer TOUTES les réponses ? Cette action est irréversible !')) {
      return;
    }

    // Double confirmation pour sécurité
    if (!window.confirm('Confirmez-vous vraiment la suppression de TOUTES les réponses ?')) {
      return;
    }

    try {
      // Supprimer toutes les réponses une par une
      const deletePromises = responses.map(r =>
        fetch(`${API_URL}/api/questionnaires/${r._id}`, {
          method: 'DELETE'
        })
      );

      await Promise.all(deletePromises);

      // Vider l'état local
      setResponses([]);
      alert('Toutes les réponses ont été supprimées');
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les réponses:', error);
      alert('Erreur lors de la suppression de toutes les réponses');
      // Recharger les données pour avoir l'état correct
      fetchResponses();
    }
  };

  // Calcul des statistiques globales
  const totalResponses = responses.length;
  const avgBudget = responses.length > 0
    ? responses.reduce((sum, r) => sum + (r.budget?.globalBudget || 0), 0) / responses.length
    : 0;
  const avgInterest = responses.length > 0
    ? responses.reduce((sum, r) => sum + (r.score_interet || 0), 0) / responses.length
    : 0;

  // Calcul des statistiques de pourcentage de réservation
  const reservationStats = responses.reduce((acc, r) => {
    const percentage = r.budget?.reservationPercentage || r.pourcentageReservation;
    if (percentage) {
      // Extraire le nombre du pourcentage (ex: "30%" -> 30)
      const value = typeof percentage === 'string'
        ? parseInt(percentage.replace('%', '').trim())
        : percentage;
      if (!isNaN(value)) {
        acc.total += value;
        acc.count += 1;
      }
    }
    return acc;
  }, { total: 0, count: 0 });

  const avgReservationPercentage = reservationStats.count > 0
    ? (reservationStats.total / reservationStats.count).toFixed(1)
    : 0;
  const reservationResponseCount = reservationStats.count;

  // Données pour les graphiques
  const typeLogementData = responses.reduce((acc, r) => {
    const type = r.preferences?.propertyType || r.type_bien_interesse || 'Non spécifié';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartTypeLogement = Object.entries(typeLogementData).map(([name, value]) => ({
    name,
    value
  }));

  const budgetRanges = [
    { range: '50-100M', min: 50000000, max: 100000000, count: 0 },
    { range: '100-150M', min: 100000000, max: 150000000, count: 0 },
    { range: '150-200M', min: 150000000, max: 200000000, count: 0 },
    { range: '200-250M', min: 200000000, max: 250000000, count: 0 },
    { range: '250M+', min: 250000000, max: Infinity, count: 0 }
  ];

  responses.forEach(r => {
    const budget = r.budget?.globalBudget || 0;
    budgetRanges.forEach(range => {
      if (budget >= range.min && budget < range.max) {
        range.count++;
      }
    });
  });

  const chartBudget = budgetRanges.map(({ range, count }) => ({
    name: range,
    value: count
  }));

  const professionData = responses.reduce((acc, r) => {
    const prof = r.profession || 'Non spécifié';
    acc[prof] = (acc[prof] || 0) + 1;
    return acc;
  }, {});

  const topProfessions = Object.entries(professionData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const delaiAchatData = responses.reduce((acc, r) => {
    const delai = r.delaiAchat || 'Non spécifié';
    acc[delai] = (acc[delai] || 0) + 1;
    return acc;
  }, {});

  const chartDelai = Object.entries(delaiAchatData).map(([name, value]) => ({
    name,
    value
  }));

  const prioriteData = responses.reduce((acc, r) => {
    const priorite = r.prioritePrincipale || 'Non spécifié';
    acc[priorite] = (acc[priorite] || 0) + 1;
    return acc;
  }, {});

  const chartPriorite = Object.entries(prioriteData).map(([name, value]) => ({
    name,
    value
  }));

  const financementData = responses.reduce((acc, r) => {
    const financement = r.besoinFinancement || 'Non spécifié';
    acc[financement] = (acc[financement] || 0) + 1;
    return acc;
  }, {});

  const chartFinancement = Object.entries(financementData).map(([name, value]) => ({
    name,
    value
  }));

  // Données pour le graphique radar - Profil Client
  const radarData = [
    {
      subject: 'Budget',
      value: Math.min((avgBudget / 250000000) * 100, 100), // Normalise sur 250M max
      fullMark: 100
    },
    {
      subject: 'Engagement',
      value: avgInterest,
      fullMark: 100
    },
    {
      subject: 'Cash',
      value: ((responses.filter(r => r.budget?.willingToPayCashWithDiscount === 'Oui').length / Math.max(totalResponses, 1)) * 100),
      fullMark: 100
    },
    {
      subject: 'Réservation',
      value: parseFloat(avgReservationPercentage) || 0,
      fullMark: 100
    },
    {
      subject: 'Urgence',
      value: ((responses.filter(r => r.motivations?.timeline === 'Immédiat' || r.motivations?.timeline === 'Dans 3 mois').length / Math.max(totalResponses, 1)) * 100),
      fullMark: 100
    },
    {
      subject: 'Stabilité',
      value: ((responses.filter(r => r.demographics?.jobStability === 'Très stable').length / Math.max(totalResponses, 1)) * 100),
      fullMark: 100
    }
  ];

  // Calcul des catégories de qualification
  const qualificationStats = responses.reduce((acc, r) => {
    const score = r.score_interet || 0;
    if (score >= 70) {
      acc.chaud.count++;
      acc.chaud.responses.push(r);
    } else if (score >= 40) {
      acc.tiede.count++;
      acc.tiede.responses.push(r);
    } else {
      acc.froid.count++;
      acc.froid.responses.push(r);
    }
    return acc;
  }, {
    chaud: { count: 0, responses: [], percentage: 0 },
    tiede: { count: 0, responses: [], percentage: 0 },
    froid: { count: 0, responses: [], percentage: 0 }
  });

  // Calculer les pourcentages
  if (totalResponses > 0) {
    qualificationStats.chaud.percentage = ((qualificationStats.chaud.count / totalResponses) * 100).toFixed(1);
    qualificationStats.tiede.percentage = ((qualificationStats.tiede.count / totalResponses) * 100).toFixed(1);
    qualificationStats.froid.percentage = ((qualificationStats.froid.count / totalResponses) * 100).toFixed(1);
  }

  // Calculs basés sur les logements réels (Gestion des logements)
  const logementsStats = {
    total: logements.length,
    disponibles: logements.filter(l => l.statut === 'disponible').length,
    reserves: logements.filter(l => l.statut === 'réservé').length,
    vendus: logements.filter(l => l.statut === 'vendu').length,
    prixMin: logements.length > 0 ? Math.min(...logements.map(l => l.prix || 0)) : 0,
    prixMax: logements.length > 0 ? Math.max(...logements.map(l => l.prix || 0)) : 0,
    prixMoyen: logements.length > 0 ? logements.reduce((sum, l) => sum + (l.prix || 0), 0) / logements.length : 0,
    superficieMin: logements.length > 0 ? Math.min(...logements.map(l => l.superficie || 0)) : 0,
    superficieMax: logements.length > 0 ? Math.max(...logements.map(l => l.superficie || 0)) : 0,
    superficieMoyenne: logements.length > 0 ? logements.reduce((sum, l) => sum + (l.superficie || 0), 0) / logements.length : 0
  };

  // Répartition par type de logement (données réelles)
  const typesLogementsReels = logements.reduce((acc, l) => {
    const type = l.type || 'Non spécifié';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartTypesReels = Object.entries(typesLogementsReels).map(([name, value]) => ({
    name,
    value
  }));

  // Palette de couleurs modernes et harmonieuses
  const COLORS = [
    '#10B981', // Vert émeraude
    '#3B82F6', // Bleu vif
    '#8B5CF6', // Violet doux
    '#F59E0B', // Orange ambré
    '#EF4444', // Rouge corail
    '#06B6D4', // Cyan
    '#EC4899', // Rose
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316'  // Orange vif
  ];

  const stats = [
    {
      icon: <FaUsers />,
      title: 'Total Réponses',
      value: totalResponses,
      color: '#10B981',
      description: 'Questionnaires soumis',
      onClick: () => setShowTotalResponsesModal(true)
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Budget Moyen',
      value: `${(avgBudget / 1000000).toFixed(1)}M`,
      color: '#3B82F6',
      description: 'FCFA',
      onClick: () => setShowBudgetModal(true)
    },
    {
      icon: <FaChartLine />,
      title: 'Intérêt Moyen',
      value: `${avgInterest.toFixed(0)}/100`,
      color: '#8B5CF6',
      description: 'Score d\'engagement calculé',
      tooltip: 'Score calculé sur 100 points basé sur: budget (30pts), paiement cash (20pts), réservation (15pts), timeline (15pts), visite (10pts), opinion (10pts), consentements (5pts), stabilité emploi (5pts)',
      onClick: () => setShowInterestModal(true)
    },
    {
      icon: <FaHome />,
      title: 'Type Populaire',
      value: chartTypeLogement[0]?.name?.split(' ')[1] || 'N/A',
      color: '#F59E0B',
      description: 'Plus demandé',
      onClick: () => setShowPropertyTypeModal(true)
    }
  ];

  const exportData = () => {
    const csv = [
      ['Nom', 'Prénom', 'Email', 'Téléphone', 'Budget', 'Type Logement', 'Profession', 'Niveau Intérêt', 'Date'].join(','),
      ...responses.map(r => [
        r.nom || '',
        r.prenom || '',
        r.email || '',
        r.telephone || '',
        r.budgetTotal || '',
        r.typeLogement || '',
        r.profession || '',
        r.niveauInteret || '',
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-questionnaires-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Analyses des Données</h1>
            <p>Statistiques et interprétations des réponses au questionnaire "Option d'achat"</p>
          </motion.div>
          <div className="header-actions">
            <button className="btn-export" onClick={exportData}>
              <FaDownload /> Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">Toutes les catégories</option>
            <option value="budget">Budget & Financement</option>
            <option value="logement">Préférences Logement</option>
            <option value="professionnel">Professionnel</option>
            <option value="calendrier">Calendrier</option>
          </select>
        </div>
        <div className="filter-group">
          <FaCalendarAlt className="filter-icon" />
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="all">Toute période</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">3 derniers mois</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="stat-card clickable"
            style={{ '--stat-color': stat.color, cursor: 'pointer' }}
            title={stat.tooltip || ''}
            onClick={stat.onClick}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-description">
                {stat.description}
                {stat.tooltip && (
                  <span className="info-tooltip" title={stat.tooltip}> ℹ️</span>
                )}
              </span>
            </div>
            <div className="click-indicator">
              <FaEye style={{ fontSize: '0.8rem', opacity: 0.6 }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Type de Logement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Types de Logements Préférés</h3>
            <p>Répartition des choix de logement</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartTypeLogement}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartTypeLogement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              La majorité des clients s'intéressent aux {chartTypeLogement[0]?.name || 'logements'}.
              Cette tendance indique que le promoteur devrait prioriser ce type de bien dans son offre.
            </p>
          </div>
        </motion.div>

        {/* Budget Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Distribution des Budgets</h3>
            <p>Répartition des capacités financières</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartBudget}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#7C3AED" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              La tranche de budget la plus représentée est {budgetRanges.reduce((max, r) => r.count > max.count ? r : max).range} FCFA.
              Cela permet d'ajuster l'offre de logements aux capacités financières du marché cible.
            </p>
          </div>
        </motion.div>

        {/* Professions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="chart-card chart-card-wide"
        >
          <div className="chart-header">
            <h3>Top 8 Professions</h3>
            <p>Profils professionnels des clients potentiels</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProfessions} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              Les professions les plus représentées sont {topProfessions[0]?.name} ({topProfessions[0]?.value} réponses)
              et {topProfessions[1]?.name} ({topProfessions[1]?.value} réponses).
              Ces profils indiquent une clientèle stable avec un pouvoir d'achat intéressant.
            </p>
          </div>
        </motion.div>

        {/* Délai d'achat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Délai d'Achat Souhaité</h3>
            <p>Urgence et temporalité des projets</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDelai}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartDelai.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              La plupart des clients souhaitent acheter dans un délai de {chartDelai[0]?.name || 'court terme'}.
              Cela suggère un marché actif nécessitant une disponibilité rapide des biens.
            </p>
          </div>
        </motion.div>

        {/* Priorité Principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Priorités Principales</h3>
            <p>Critères de décision d'achat</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartPriorite}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#C850C0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              Le critère prioritaire pour les clients est "{chartPriorite[0]?.name}".
              Cette information est cruciale pour adapter la stratégie commerciale et marketing.
            </p>
          </div>
        </motion.div>

        {/* Besoin de Financement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Besoin de Financement</h3>
            <p>État des demandes de crédit</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartFinancement}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartFinancement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              {((chartFinancement.find(c => c.name.includes('Non'))?.value || 0) / totalResponses * 100).toFixed(0)}%
              des clients prévoient un paiement comptant. Le reste nécessite un accompagnement
              pour le financement bancaire.
            </p>
          </div>
        </motion.div>

        {/* Radar Chart - Profil Client */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Profil Client Moyen</h3>
            <p>Vue d'ensemble des caractéristiques client</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#666' }} />
                <Radar
                  name="Score Moyen"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value) => `${value.toFixed(0)}%`} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              Le profil moyen montre {avgInterest > 70 ? 'un fort engagement' : avgInterest > 50 ? 'un engagement modéré' : 'un engagement à renforcer'}
              avec un score de {avgInterest.toFixed(0)}/100. Les points forts incluent
              {radarData.filter(d => d.value > 60).length > 0 ?
                ` ${radarData.filter(d => d.value > 60).map(d => d.subject.toLowerCase()).join(', ')}.` :
                ' des aspects à développer.'
              }
            </p>
          </div>
        </motion.div>

        {/* Treemap - Répartition Professions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="chart-card"
        >
          <div className="chart-header">
            <h3>Répartition des Professions</h3>
            <p>Vue hiérarchique des secteurs d'activité</p>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={topProfessions}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#10B981"
              >
                <Tooltip
                  formatter={(value) => `${value} répondant(s)`}
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: '8px' }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div className="chart-interpretation">
            <h4>Interprétation:</h4>
            <p>
              Le secteur dominant est "{topProfessions[0]?.name}" avec {((topProfessions[0]?.value / totalResponses) * 100).toFixed(0)}%
              des répondants. Cette diversité professionnelle indique une clientèle
              {topProfessions.length > 5 ? ' très variée' : ' relativement homogène'}.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Section Offre Disponible - Données réelles des logements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="offre-disponible-section"
      >
        <h2>Offre Disponible (Gestion Logements)</h2>
        <p className="section-subtitle">Données réelles issues de la gestion des logements</p>

        <div className="offre-stats-grid">
          <div className="offre-stat-card">
            <div className="offre-stat-icon">🏘️</div>
            <div className="offre-stat-content">
              <h3>Total Logements</h3>
              <p className="offre-stat-value">{logementsStats.total}</p>
              <span className="offre-stat-detail">
                {logementsStats.disponibles} disponibles | {logementsStats.reserves} réservés | {logementsStats.vendus} vendus
              </span>
            </div>
          </div>

          <div className="offre-stat-card">
            <div className="offre-stat-icon">💰</div>
            <div className="offre-stat-content">
              <h3>Gamme de Prix</h3>
              <p className="offre-stat-value">{(logementsStats.prixMin / 1000000).toFixed(0)}M - {(logementsStats.prixMax / 1000000).toFixed(0)}M FCFA</p>
              <span className="offre-stat-detail">
                Prix moyen: {(logementsStats.prixMoyen / 1000000).toFixed(0)}M FCFA
              </span>
            </div>
          </div>

          <div className="offre-stat-card">
            <div className="offre-stat-icon">📐</div>
            <div className="offre-stat-content">
              <h3>Superficies</h3>
              <p className="offre-stat-value">{logementsStats.superficieMin} - {logementsStats.superficieMax} m²</p>
              <span className="offre-stat-detail">
                Moyenne: {logementsStats.superficieMoyenne.toFixed(0)} m²
              </span>
            </div>
          </div>

          <div className="offre-stat-card">
            <div className="offre-stat-icon">🏠</div>
            <div className="offre-stat-content">
              <h3>Types de Villas</h3>
              <p className="offre-stat-value">{chartTypesReels.length} types</p>
              <span className="offre-stat-detail">
                {chartTypesReels.map(t => `${t.name}: ${t.value}`).join(' | ')}
              </span>
            </div>
          </div>
        </div>

        {/* Liste détaillée des logements */}
        <div className="logements-detail-grid">
          <h3>Détail des Logements</h3>
          <div className="logements-cards">
            {logements.map((logement, idx) => (
              <div key={logement._id || idx} className={`logement-detail-card statut-${logement.statut}`}>
                <div className="logement-header">
                  <span className="logement-nom">{logement.nom}</span>
                  <span className={`statut-badge ${logement.statut}`}>{logement.statut}</span>
                </div>
                <div className="logement-info">
                  <div className="info-row">
                    <span className="label">Type:</span>
                    <span className="value">{logement.type}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Superficie:</span>
                    <span className="value">{logement.superficie} m²</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Prix:</span>
                    <span className="value prix">{(logement.prix / 1000000).toFixed(0)}M FCFA</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Chambres:</span>
                    <span className="value">{logement.nombreChambres}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Salles d'eau:</span>
                    <span className="value">{logement.nombreSallesBain}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparaison Offre vs Demande */}
        <div className="offre-demande-comparison">
          <h3>Comparaison Offre vs Demande</h3>
          <div className="comparison-grid">
            <div className="comparison-card">
              <h4>Types de Logements</h4>
              <div className="comparison-table">
                <div className="comparison-header">
                  <span>Type</span>
                  <span>Offre</span>
                  <span>Demande</span>
                </div>
                {chartTypesReels.map((type, idx) => {
                  const demande = chartTypeLogement.find(t =>
                    t.name.toLowerCase().includes(type.name.toLowerCase()) ||
                    type.name.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])
                  );
                  return (
                    <div key={idx} className="comparison-row">
                      <span className="type-name">{type.name}</span>
                      <span className="offre-value">{type.value}</span>
                      <span className="demande-value">{demande?.value || 0}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="comparison-card">
              <h4>Analyse Budget</h4>
              <div className="budget-analysis">
                <div className="analysis-item">
                  <span className="analysis-label">Budget moyen demandé:</span>
                  <span className="analysis-value">{(avgBudget / 1000000).toFixed(0)}M FCFA</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Prix moyen offre:</span>
                  <span className="analysis-value">{(logementsStats.prixMoyen / 1000000).toFixed(0)}M FCFA</span>
                </div>
                <div className="analysis-item">
                  <span className={`analysis-label ${avgBudget >= logementsStats.prixMoyen ? 'positive' : 'negative'}`}>
                    Écart:
                  </span>
                  <span className={`analysis-value ${avgBudget >= logementsStats.prixMoyen ? 'positive' : 'negative'}`}>
                    {avgBudget >= logementsStats.prixMoyen ? '+' : ''}{((avgBudget - logementsStats.prixMoyen) / 1000000).toFixed(0)}M FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="insights-section"
      >
        <h2>Insights Clés & Recommandations</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">💰</div>
            <h3>Budget & Financement</h3>
            <ul>
              <li>Budget moyen: <strong>{(avgBudget / 1000000).toFixed(1)}M FCFA</strong></li>
              <li>Répartition des budgets:</li>
              {chartBudget.map((range, idx) => (
                <li key={`budget-${idx}`} style={{marginLeft: '20px'}}>
                  {range.name}: <strong>{range.value}</strong> ({((range.value / totalResponses) * 100).toFixed(1)}%)
                </li>
              )).filter(r => r.value > 0)}
              <li>Réservation: <strong>{reservationResponseCount}</strong> personne{reservationResponseCount > 1 ? 's' : ''} ({avgReservationPercentage}% moyen)</li>
              <li>Paiement cash accepté: <strong>{responses.filter(r => r.budget?.willingToPayCashWithDiscount === 'Oui').length}</strong> ({((responses.filter(r => r.budget?.willingToPayCashWithDiscount === 'Oui').length / totalResponses) * 100).toFixed(1)}%)</li>
            </ul>
            <p className="insight-recommendation">
              <strong>Recommandation:</strong> Établir des partenariats bancaires et proposer
              des réductions attractives pour paiement comptant.
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🏠</div>
            <h3>Préférences Logement</h3>
            <ul>
              <li>Type préféré: <strong>{chartTypeLogement[0]?.name || 'N/A'}</strong></li>
              {chartTypeLogement.map((type, idx) => (
                <li key={idx}>
                  {type.name}: <strong>{type.value}</strong> ({((type.value / totalResponses) * 100).toFixed(1)}%)
                </li>
              )).slice(0, 5)}
            </ul>
            <p className="insight-recommendation">
              <strong>Recommandation:</strong> Prioriser le développement de
              {' ' + (chartTypeLogement[0]?.name?.toLowerCase() || 'logements')} de qualité supérieure
              avec {Math.round((chartTypeLogement[0]?.value / totalResponses) * 100)}% de la demande.
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">👥</div>
            <h3>Profil Client</h3>
            <ul>
              <li>Professions stables (cadres, fonctionnaires)</li>
              <li>Niveau d'intérêt moyen: {avgInterest.toFixed(0)}/100</li>
              <li>Forte engagement sur le long terme</li>
            </ul>
            <p className="insight-recommendation">
              <strong>Recommandation:</strong> Adapter la communication aux profils
              professionnels identifiés.
            </p>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⏱️</div>
            <h3>Temporalité</h3>
            <ul>
              <li>Délai souhaité: {chartDelai[0]?.name}</li>
              <li>Marché actif avec besoin rapide</li>
              <li>Planification d'emménagement dans 3-6 mois</li>
            </ul>
            <p className="insight-recommendation">
              <strong>Recommandation:</strong> Accélérer la disponibilité des logements
              et maintenir un stock disponible.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Responses List */}
      <div className="responses-section">
        <div className="responses-header">
          <h2>Réponses Détaillées ({totalResponses})</h2>
          <div className="responses-actions">
            <button className="btn-view-all" onClick={handleViewAllResponses}>
              <FaEye /> Voir tout
            </button>
            <button className="btn-delete-all" onClick={handleDeleteAllResponses}>
              <FaTrash /> Vider tout
            </button>
          </div>
        </div>
        <div className="responses-table-container">
          <table className="responses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Type Logement</th>
                <th>Budget</th>
                <th>Profession</th>
                <th>Intérêt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.slice(0, 10).map((response, index) => (
                <tr key={index}>
                  <td>{response.createdAt ? new Date(response.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{response.nom} {response.prenom}</td>
                  <td>{response.email}</td>
                  <td>{response.telephone}</td>
                  <td>{response.typeLogement || 'N/A'}</td>
                  <td>{((response.budgetTotal || 0) / 1000000).toFixed(0)}M</td>
                  <td>{response.profession}</td>
                  <td>
                    <span className="interest-badge" style={{
                      backgroundColor: response.niveauInteret >= 7 ? '#27AE60' :
                                      response.niveauInteret >= 4 ? '#F39C12' : '#E74C3C'
                    }}>
                      {response.niveauInteret}/10
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view-detail"
                        onClick={() => handleViewDetails(response)}
                      >
                        Détails
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteResponse(response._id)}
                        title="Supprimer cette réponse"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour les détails */}
      {showDetailModal && selectedResponse && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails du Questionnaire</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              {/* Informations personnelles */}
              <div className="detail-section">
                <h3>Informations Personnelles</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Nom:</strong> {selectedResponse.nom} {selectedResponse.prenom}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {selectedResponse.email}
                  </div>
                  <div className="detail-item">
                    <strong>Téléphone:</strong> {selectedResponse.telephone}
                  </div>
                  <div className="detail-item">
                    <strong>Âge:</strong> {selectedResponse.demographics?.age || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Situation familiale:</strong> {selectedResponse.demographics?.familyStatus || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Pays de résidence:</strong> {selectedResponse.demographics?.countryOfResidence || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Situation professionnelle */}
              <div className="detail-section">
                <h3>Situation Professionnelle</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Catégorie:</strong> {selectedResponse.demographics?.professionalCategory || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Profession:</strong> {selectedResponse.profession || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Secteur:</strong> {selectedResponse.demographics?.activitySector || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Revenu mensuel:</strong> {selectedResponse.demographics?.monthlyIncome || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Stabilité emploi:</strong> {selectedResponse.demographics?.jobStability || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Préférences de logement */}
              <div className="detail-section">
                <h3>Préférences de Logement</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Type souhaité:</strong> {selectedResponse.preferences?.propertyType || selectedResponse.typeLogement || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Quantité:</strong> {selectedResponse.preferences?.quantityDesired || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Nombre de pièces:</strong> {selectedResponse.preferences?.roomsDesired || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Budget et financement */}
              <div className="detail-section">
                <h3>Budget et Financement</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Budget total:</strong> {((selectedResponse.budget?.globalBudget || selectedResponse.budgetTotal || 0) / 1000000).toFixed(0)} millions FCFA
                  </div>
                  <div className="detail-item">
                    <strong>Apport personnel:</strong> {((selectedResponse.budget?.downPaymentAvailable || 0) / 1000000).toFixed(0)} millions FCFA
                  </div>
                  <div className="detail-item">
                    <strong>Capacité mensuelle:</strong> {((selectedResponse.budget?.monthlyCapacity || 0) / 1000).toFixed(0)}K FCFA
                  </div>
                  <div className="detail-item">
                    <strong>Mode de financement:</strong> {selectedResponse.budget?.financingMode || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>% Réservation:</strong> {selectedResponse.budget?.reservationPercentage || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Paiement cash (5% réduction):</strong> {selectedResponse.budget?.willingToPayCashWithDiscount || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Motivations */}
              <div className="detail-section">
                <h3>Motivations et Priorités</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Raison d'achat:</strong> {selectedResponse.motivations?.purchaseReason || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Timeline:</strong> {selectedResponse.motivations?.timeline || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Premier achat:</strong> {selectedResponse.motivations?.isFirstPurchase ? 'Oui' : 'Non'}
                  </div>
                  {selectedResponse.prioritesPrincipales && (
                    <div className="detail-item" style={{gridColumn: 'span 2'}}>
                      <strong>Priorités principales (classement):</strong>
                      <ol style={{marginTop: '5px', paddingLeft: '20px'}}>
                        {Object.entries(selectedResponse.prioritesPrincipales)
                          .filter(([key, value]) => value && value !== '')
                          .sort((a, b) => {
                            const order = {'Premier': 1, 'Second': 2, 'Troisième': 3};
                            return (order[a[0]] || 999) - (order[b[0]] || 999);
                          })
                          .map(([rank, priority]) => (
                            <li key={rank}>
                              <strong>{rank}:</strong> {priority}
                            </li>
                          ))
                        }
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              {/* Engagements */}
              <div className="detail-section">
                <h3>Engagements et Consentements</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Visite programmée:</strong> {selectedResponse.engagements?.scheduledVisit || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Opinion sur le projet:</strong> {selectedResponse.engagements?.projectOpinion || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Consent contact commercial:</strong> {selectedResponse.consents?.marketingContact ? 'Oui' : 'Non'}
                  </div>
                  <div className="detail-item">
                    <strong>Consent partage données:</strong> {selectedResponse.consents?.dataSharing ? 'Oui' : 'Non'}
                  </div>
                  <div className="detail-item">
                    <strong>Consent newsletter:</strong> {selectedResponse.consents?.newsletter ? 'Oui' : 'Non'}
                  </div>
                </div>
              </div>

              {/* Score et qualification */}
              <div className="detail-section">
                <h3>Évaluation</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Score d'intérêt:</strong> <span className="score-badge">{selectedResponse.score_interet || selectedResponse.niveauInteret || 0}/100</span>
                  </div>
                  <div className="detail-item">
                    <strong>Qualification:</strong> <span className={`qualification-badge ${selectedResponse.qualification}`}>
                      {selectedResponse.qualification || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Statut:</strong> {selectedResponse.statut || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Date de soumission:</strong> {selectedResponse.date_soumission ? new Date(selectedResponse.date_soumission).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Voir Tout */}
      {showAllResponsesModal && (
        <div className="modal-overlay" onClick={handleCloseAllResponsesModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Toutes les Réponses ({totalResponses})</h2>
              <button className="modal-close" onClick={handleCloseAllResponsesModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="all-responses-table-container">
                <table className="responses-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Type Logement</th>
                      <th>Budget</th>
                      <th>Profession</th>
                      <th>Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response, index) => (
                      <tr key={index}>
                        <td>{new Date(response.date_soumission).toLocaleDateString()}</td>
                        <td>{response.nom} {response.prenom}</td>
                        <td>{response.email}</td>
                        <td>{response.telephone}</td>
                        <td>{response.preferences?.propertyType || response.type_bien_interesse || '-'}</td>
                        <td>{((response.budget?.globalBudget || 0) / 1000000).toFixed(0)}M</td>
                        <td>{response.demographics?.professionalCategory || response.profession || '-'}</td>
                        <td>
                          <span className={`score-badge ${
                            response.score_interet >= 70 ? 'high' :
                            response.score_interet >= 40 ? 'medium' : 'low'
                          }`}>
                            {response.score_interet || 0}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-view-detail"
                              onClick={() => {
                                handleCloseAllResponsesModal();
                                handleViewDetails(response);
                              }}
                            >
                              Détails
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteResponse(response._id)}
                              title="Supprimer cette réponse"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseAllResponsesModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Total Réponses */}
      {showTotalResponsesModal && (
        <div className="modal-overlay" onClick={() => setShowTotalResponsesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détail des Réponses</h2>
              <button className="modal-close" onClick={() => setShowTotalResponsesModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="stats-detail-grid">
                <div className="stat-detail-card">
                  <h3>Total Général</h3>
                  <div className="stat-detail-value">{totalResponses}</div>
                  <p>Questionnaires complétés</p>
                </div>

                <div className="stat-detail-card">
                  <h3>Répartition par Qualification</h3>
                  <div className="qualification-breakdown">
                    <div className="qualification-item chaud">
                      <span className="qualification-label">🔥 CHAUD (≥70pts)</span>
                      <span className="qualification-value">{qualificationStats.chaud.count}</span>
                      <span className="qualification-percent">{qualificationStats.chaud.percentage}%</span>
                    </div>
                    <div className="qualification-item tiede">
                      <span className="qualification-label">🌡️ TIÈDE (40-69pts)</span>
                      <span className="qualification-value">{qualificationStats.tiede.count}</span>
                      <span className="qualification-percent">{qualificationStats.tiede.percentage}%</span>
                    </div>
                    <div className="qualification-item froid">
                      <span className="qualification-label">❄️ FROID (&lt;40pts)</span>
                      <span className="qualification-value">{qualificationStats.froid.count}</span>
                      <span className="qualification-percent">{qualificationStats.froid.percentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="stat-detail-card">
                  <h3>Évolution Temporelle</h3>
                  <div className="time-stats">
                    <div className="time-stat">
                      <span>Aujourd'hui:</span>
                      <strong>{responses.filter(r => {
                        const today = new Date().toDateString();
                        return new Date(r.date_soumission).toDateString() === today;
                      }).length}</strong>
                    </div>
                    <div className="time-stat">
                      <span>Cette semaine:</span>
                      <strong>{responses.filter(r => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(r.date_soumission) >= weekAgo;
                      }).length}</strong>
                    </div>
                    <div className="time-stat">
                      <span>Ce mois:</span>
                      <strong>{responses.filter(r => {
                        const monthAgo = new Date();
                        monthAgo.setDate(monthAgo.getDate() - 30);
                        return new Date(r.date_soumission) >= monthAgo;
                      }).length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTotalResponsesModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Budget Moyen */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Analyse Détaillée des Budgets</h2>
              <button className="modal-close" onClick={() => setShowBudgetModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="stats-detail-grid">
                <div className="stat-detail-card">
                  <h3>Budget Global Moyen</h3>
                  <div className="stat-detail-value">{(avgBudget / 1000000).toFixed(1)}M FCFA</div>
                  <p>Capacité d'investissement moyenne</p>
                </div>

                <div className="stat-detail-card">
                  <h3>Répartition par Tranches</h3>
                  <div className="budget-breakdown">
                    {chartBudget.map((range, idx) => (
                      <div key={idx} className="budget-range-item">
                        <span className="range-label">{range.name}:</span>
                        <div className="range-bar-container">
                          <div
                            className="range-bar"
                            style={{
                              width: `${(range.value / Math.max(...chartBudget.map(r => r.value))) * 100}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="range-value">{range.value} ({((range.value / totalResponses) * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-detail-card">
                  <h3>Capacités Financières</h3>
                  <div className="financial-stats">
                    <div className="financial-stat">
                      <span>Apport personnel moyen:</span>
                      <strong>{((responses.reduce((sum, r) => sum + (r.budget?.downPaymentAvailable || 0), 0) / Math.max(responses.length, 1)) / 1000000).toFixed(1)}M FCFA</strong>
                    </div>
                    <div className="financial-stat">
                      <span>Capacité mensuelle moyenne:</span>
                      <strong>{((responses.reduce((sum, r) => sum + (r.budget?.monthlyCapacity || 0), 0) / Math.max(responses.length, 1)) / 1000).toFixed(0)}K FCFA</strong>
                    </div>
                    <div className="financial-stat">
                      <span>% Réservation moyen:</span>
                      <strong>{avgReservationPercentage}%</strong>
                    </div>
                    <div className="financial-stat">
                      <span>Paiement cash (5% réduction):</span>
                      <strong>{responses.filter(r => r.budget?.willingToPayCashWithDiscount === 'Oui').length} ({((responses.filter(r => r.budget?.willingToPayCashWithDiscount === 'Oui').length / Math.max(totalResponses, 1)) * 100).toFixed(1)}%)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowBudgetModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Intérêt Moyen - DÉTAILLÉ AVEC SCORING */}
      {showInterestModal && (
        <div className="modal-overlay" onClick={() => setShowInterestModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Système de Scoring de Qualification Client</h2>
              <button className="modal-close" onClick={() => setShowInterestModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="scoring-explanation">
                <div className="scoring-header">
                  <h3>Score Moyen Global: <span className="score-highlight">{avgInterest.toFixed(0)}/100</span></h3>
                  <p>Le scoring permet d'identifier automatiquement les prospects les plus qualifiés</p>
                </div>

                <div className="scoring-criteria">
                  <h3>🎯 Critères de Notation (Total: 100 points)</h3>
                  <div className="criteria-grid">
                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">💰</span>
                        <h4>Budget Global</h4>
                        <span className="criterion-points">30 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>250M+ FCFA: <strong>30 pts</strong></li>
                          <li>200-249M FCFA: <strong>25 pts</strong></li>
                          <li>150-199M FCFA: <strong>20 pts</strong></li>
                          <li>100-149M FCFA: <strong>15 pts</strong></li>
                          <li>50-99M FCFA: <strong>10 pts</strong></li>
                          <li>{"<"}50M FCFA: <strong>5 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">💵</span>
                        <h4>Paiement Cash avec Réduction</h4>
                        <span className="criterion-points">20 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Oui: <strong>20 pts</strong></li>
                          <li>Non: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">📝</span>
                        <h4>Pourcentage de Réservation</h4>
                        <span className="criterion-points">15 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>30%+: <strong>15 pts</strong></li>
                          <li>20-29%: <strong>10 pts</strong></li>
                          <li>10-19%: <strong>5 pts</strong></li>
                          <li>{"<"}10%: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">⏰</span>
                        <h4>Timeline d'Achat</h4>
                        <span className="criterion-points">15 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Immédiat: <strong>15 pts</strong></li>
                          <li>Dans 3 mois: <strong>10 pts</strong></li>
                          <li>Dans 6 mois: <strong>5 pts</strong></li>
                          <li>Plus tard: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">🏠</span>
                        <h4>Souhait de Visite</h4>
                        <span className="criterion-points">10 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Oui: <strong>10 pts</strong></li>
                          <li>Peut-être: <strong>5 pts</strong></li>
                          <li>Non: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">💭</span>
                        <h4>Opinion sur le Projet</h4>
                        <span className="criterion-points">10 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Très intéressé: <strong>10 pts</strong></li>
                          <li>Intéressé: <strong>7 pts</strong></li>
                          <li>Moyennement: <strong>3 pts</strong></li>
                          <li>Peu/Pas intéressé: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">📧</span>
                        <h4>Consentements</h4>
                        <span className="criterion-points">5 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Newsletter: <strong>2 pts</strong></li>
                          <li>Contact commercial: <strong>2 pts</strong></li>
                          <li>Partage données: <strong>1 pt</strong></li>
                        </ul>
                      </div>
                    </div>

                    <div className="criterion-card">
                      <div className="criterion-header">
                        <span className="criterion-icon">💼</span>
                        <h4>Stabilité de l'Emploi</h4>
                        <span className="criterion-points">5 points</span>
                      </div>
                      <div className="criterion-details">
                        <ul>
                          <li>Très stable: <strong>5 pts</strong></li>
                          <li>Stable: <strong>3 pts</strong></li>
                          <li>Peu stable: <strong>1 pt</strong></li>
                          <li>Instable: <strong>0 pts</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="qualification-categories">
                  <h3>📊 Catégories de Qualification</h3>
                  <div className="categories-grid">
                    <div className="category-card chaud">
                      <div className="category-header">
                        <span className="category-icon">🔥</span>
                        <h4>CHAUD</h4>
                        <span className="category-range">≥ 70 points</span>
                      </div>
                      <div className="category-stats">
                        <div className="category-count">{qualificationStats.chaud.count} clients</div>
                        <div className="category-percent">{qualificationStats.chaud.percentage}%</div>
                      </div>
                      <p className="category-desc">Prospects hautement qualifiés, prêts à acheter</p>
                    </div>

                    <div className="category-card tiede">
                      <div className="category-header">
                        <span className="category-icon">🌡️</span>
                        <h4>TIÈDE</h4>
                        <span className="category-range">40 - 69 points</span>
                      </div>
                      <div className="category-stats">
                        <div className="category-count">{qualificationStats.tiede.count} clients</div>
                        <div className="category-percent">{qualificationStats.tiede.percentage}%</div>
                      </div>
                      <p className="category-desc">Prospects à potentiel nécessitant un suivi</p>
                    </div>

                    <div className="category-card froid">
                      <div className="category-header">
                        <span className="category-icon">❄️</span>
                        <h4>FROID</h4>
                        <span className="category-range">{"<"} 40 points</span>
                      </div>
                      <div className="category-stats">
                        <div className="category-count">{qualificationStats.froid.count} clients</div>
                        <div className="category-percent">{qualificationStats.froid.percentage}%</div>
                      </div>
                      <p className="category-desc">Prospects peu qualifiés ou en phase de réflexion</p>
                    </div>
                  </div>
                </div>

                <div className="scoring-distribution">
                  <h3>📈 Distribution des Scores</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: '0-20', count: responses.filter(r => r.score_interet < 20).length },
                      { name: '20-40', count: responses.filter(r => r.score_interet >= 20 && r.score_interet < 40).length },
                      { name: '40-60', count: responses.filter(r => r.score_interet >= 40 && r.score_interet < 60).length },
                      { name: '60-80', count: responses.filter(r => r.score_interet >= 60 && r.score_interet < 80).length },
                      { name: '80-100', count: responses.filter(r => r.score_interet >= 80).length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowInterestModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Type Populaire */}
      {showPropertyTypeModal && (
        <div className="modal-overlay" onClick={() => setShowPropertyTypeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Analyse des Types de Logements</h2>
              <button className="modal-close" onClick={() => setShowPropertyTypeModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="stats-detail-grid">
                <div className="stat-detail-card">
                  <h3>Type le Plus Demandé</h3>
                  <div className="stat-detail-value">{chartTypeLogement[0]?.name || 'N/A'}</div>
                  <p>{chartTypeLogement[0]?.value || 0} demandes ({((chartTypeLogement[0]?.value / totalResponses) * 100).toFixed(1)}%)</p>
                </div>

                <div className="stat-detail-card">
                  <h3>Répartition Complète</h3>
                  <div className="property-type-list">
                    {chartTypeLogement.map((type, idx) => (
                      <div key={idx} className="property-type-item">
                        <div className="type-rank">#{idx + 1}</div>
                        <div className="type-info">
                          <span className="type-name">{type.name}</span>
                          <div className="type-bar-container">
                            <div
                              className="type-bar"
                              style={{
                                width: `${(type.value / Math.max(...chartTypeLogement.map(t => t.value))) * 100}%`,
                                backgroundColor: COLORS[idx % COLORS.length]
                              }}
                            ></div>
                          </div>
                          <span className="type-stats">
                            {type.value} ({((type.value / totalResponses) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-detail-card">
                  <h3>Statistiques Complémentaires</h3>
                  <div className="additional-stats">
                    <div className="stat-item">
                      <span>Nombre de pièces moyen demandé:</span>
                      <strong>{
                        responses.reduce((sum, r) => {
                          const rooms = parseInt(r.preferences?.roomsDesired?.replace(/[^0-9]/g, '')) || 0;
                          return sum + rooms;
                        }, 0) / Math.max(responses.length, 1)
                      } pièces</strong>
                    </div>
                    <div className="stat-item">
                      <span>Quantité moyenne désirée:</span>
                      <strong>{
                        responses.reduce((sum, r) => {
                          const qty = parseInt(r.preferences?.quantityDesired) || 1;
                          return sum + qty;
                        }, 0) / Math.max(responses.length, 1)
                      } unités</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPropertyTypeModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
