import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaVideo, FaChartBar, FaUsers, FaHome } from 'react-icons/fa';
import API_URL from '../config';
import './Dashboard.css';

const Dashboard = () => {
  const [projectName, setProjectName] = useState('Projet Immobilier');
  const [dashboardStats, setDashboardStats] = useState({
    videosCount: 0,
    videoTypes: 'Chargement...',
    logementsCount: 0,
    analysisStatus: 'En cours',
    clientsStatus: 'Actif'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard-stats`);
        const data = await response.json();

        if (data.success && data.data) {
          setProjectName(data.data.projectName);
          setDashboardStats(data.data.stats);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      icon: <FaHome />,
      title: 'Projet immobilier',
      value: projectName,
      color: '#4F46E5'
    },
    {
      icon: <FaVideo />,
      title: 'Vidéos',
      value: loading ? '...' : dashboardStats.videosCount.toString(),
      description: dashboardStats.videoTypes,
      color: '#7C3AED'
    },
    {
      icon: <FaChartBar />,
      title: 'Analyses',
      value: dashboardStats.analysisStatus,
      description: 'Options d\'achat',
      color: '#C850C0'
    },
    {
      icon: <FaUsers />,
      title: 'Clients',
      value: dashboardStats.clientsStatus,
      description: 'Questionnaires',
      color: '#27AE60'
    }
  ];

  const quickActions = [
    {
      title: 'Gérer les vidéos',
      description: 'Charger et modifier les vidéos du projet',
      icon: <FaVideo />,
      link: '/videos',
      color: '#4F46E5'
    },
    {
      title: 'Analyses des données',
      description: 'Voir les réponses et statistiques',
      icon: <FaChartBar />,
      link: '/analytics',
      color: '#7C3AED'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Tableau de bord</h1>
          <p>Bienvenue dans l'interface d'administration de {projectName}</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="stat-card"
            style={{ '--card-color': stat.color }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              {stat.description && (
                <span className="stat-description">{stat.description}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Actions rapides</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Link
                to={action.link}
                className="action-card"
                style={{ '--action-color': action.color }}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="info-section"
      >
        <div className="info-card">
          <h3>À propos de ce panneau</h3>
          <p>
            Cet espace d'administration vous permet de gérer tous les aspects du projet
            immobilier {projectName}. Vous pouvez charger les vidéos, analyser les réponses
            des clients aux questionnaires, et suivre l'évolution du projet.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
