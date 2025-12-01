import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBed, FaBath, FaRulerCombined, FaCar, FaMapMarkerAlt,
  FaFilter, FaTimes, FaCheck
} from 'react-icons/fa';
import API_URL from '../config';
import './Logements.css';

const Logements = () => {
  const navigate = useNavigate();
  const [logements, setLogements] = useState([]);
  const [filteredLogements, setFilteredLogements] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);
  const [apiImages, setApiImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: 'tous',
    prixMin: '',
    prixMax: '',
    superficieMin: '',
    superficieMax: '',
    statut: 'tous'
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Charger les logements, contenu et images depuis l'API
    const fetchData = async () => {
      try {
        // Charger les logements depuis l'API
        const logementsResponse = await fetch(`${API_URL}/api/logements`);
        if (logementsResponse.ok) {
          const logementsData = await logementsResponse.json();
          const logementsArray = logementsData.data || [];
          setLogements(logementsArray);
          setFilteredLogements(logementsArray);

          // Calculer les stats
          const disponibles = logementsArray.filter(log => log.statut === 'disponible');
          const prix = logementsArray.map(log => log.prix);
          if (prix.length > 0) {
            setStats({
              total: logementsArray.length,
              disponibles: disponibles.length,
              prixMin: Math.min(...prix),
              prixMax: Math.max(...prix)
            });
          }
        }

        // Charger le contenu texte
        const contentResponse = await fetch(`${API_URL}/api/logements-content`);
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContent(contentData.data);
        }

        // Charger les images
        const imagesResponse = await fetch(`${API_URL}/api/images`);
        if (imagesResponse.ok) {
          const data = await imagesResponse.json();
          const formattedImages = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].url) {
              formattedImages[type] = data[type].url;
            }
          });
          setApiImages(formattedImages);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setImagesLoaded(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrer les logements localement
    let results = logements.filter(log => log.actif !== false);

    if (filters.type && filters.type !== 'tous') {
      results = results.filter(log => log.type === filters.type);
    }
    if (filters.prixMin) {
      results = results.filter(log => log.prix >= Number(filters.prixMin));
    }
    if (filters.prixMax) {
      results = results.filter(log => log.prix <= Number(filters.prixMax));
    }
    if (filters.superficieMin) {
      results = results.filter(log => log.superficie >= Number(filters.superficieMin));
    }
    if (filters.superficieMax) {
      results = results.filter(log => log.superficie <= Number(filters.superficieMax));
    }
    if (filters.statut && filters.statut !== 'tous') {
      results = results.filter(log => log.statut === filters.statut);
    }

    setFilteredLogements(results);
  }, [filters, logements]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'tous',
      prixMin: '',
      prixMax: '',
      superficieMin: '',
      superficieMax: '',
      statut: 'tous'
    });
  };

  const formatPrix = (prix) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'disponible': return 'statut-disponible';
      case 'réservé': return 'statut-reserve';
      case 'vendu': return 'statut-vendu';
      default: return '';
    }
  };

  const getLogementImage = (logement) => {
    // Mapper les IDs de logement aux types d'image
    const imageTypeMap = {
      'LOG-001': 'villa-duplex-4p',
      'LOG-002': 'villa-duplex-5p',
      'LOG-003': 'villa-triplex-6p'
    };

    const imageType = imageTypeMap[logement.id];

    // Si les images de l'API ont été chargées, utiliser uniquement l'API
    if (imagesLoaded) {
      // Retourner l'image de l'API si disponible
      if (imageType && apiImages[imageType]) {
        return apiImages[imageType];
      }
      // Si pas d'image dans l'API, retourner null pour utiliser le placeholder
      return null;
    }

    // Fallback sur l'image hardcodée SEULEMENT si l'API n'a pas encore chargé
    return logement.images[0];
  };

  return (
    <div className="logements-page">
      {/* Hero Section */}
      <section className="logements-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content?.hero?.title || "Nos Logements"}</h1>
            <p className="hero-subtitle">{content?.hero?.subtitle || "Découvrez notre sélection d'appartements et villas"}</p>
            {stats && (
              <div className="hero-stats">
                <div className="stat">
                  <span className="number">{stats.total}</span>
                  <span className="label">{content?.hero?.stats?.labelTotal || "Logements"}</span>
                </div>
                <div className="stat">
                  <span className="number">{stats.disponibles}</span>
                  <span className="label">{content?.hero?.stats?.labelDisponibles || "Disponibles"}</span>
                </div>
                <div className="stat">
                  <span className="number">À partir de {formatPrix(stats.prixMin)}</span>
                  <span className="label">{content?.hero?.stats?.labelPrixMin || "Prix minimum"}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Barre de filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="filters-section"
        >
          <div className="filters-header">
            <h2>
              <FaFilter /> {content?.filters?.title || "Filtrer les logements"}
            </h2>
            <button
              className="btn-toggle-filters"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (content?.filters?.buttonHide || 'Masquer') : (content?.filters?.buttonShow || 'Afficher')} les filtres
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="filters-form"
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label>{content?.filters?.labelTypeBien || "Type de bien"}</label>
                  <select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="tous">Tous les types</option>
                    <option value="Villa Duplex">Villa Duplex</option>
                    <option value="Villa Triplex">Villa Triplex</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>{content?.filters?.labelPrixMin || "Prix minimum (FCFA)"}</label>
                  <input
                    type="number"
                    name="prixMin"
                    value={filters.prixMin}
                    onChange={handleFilterChange}
                    placeholder="Ex: 120000000"
                  />
                </div>

                <div className="filter-group">
                  <label>{content?.filters?.labelPrixMax || "Prix maximum (FCFA)"}</label>
                  <input
                    type="number"
                    name="prixMax"
                    value={filters.prixMax}
                    onChange={handleFilterChange}
                    placeholder="Ex: 250000000"
                  />
                </div>

                <div className="filter-group">
                  <label>{content?.filters?.labelSuperficieMin || "Superficie min (m²)"}</label>
                  <input
                    type="number"
                    name="superficieMin"
                    value={filters.superficieMin}
                    onChange={handleFilterChange}
                    placeholder="Ex: 150"
                  />
                </div>

                <div className="filter-group">
                  <label>{content?.filters?.labelSuperficieMax || "Superficie max (m²)"}</label>
                  <input
                    type="number"
                    name="superficieMax"
                    value={filters.superficieMax}
                    onChange={handleFilterChange}
                    placeholder="Ex: 300"
                  />
                </div>

                <div className="filter-group">
                  <label>{content?.filters?.labelStatut || "Statut"}</label>
                  <select name="statut" value={filters.statut} onChange={handleFilterChange}>
                    <option value="tous">Tous</option>
                    <option value="disponible">Disponible</option>
                    <option value="réservé">Réservé</option>
                    <option value="vendu">Vendu</option>
                  </select>
                </div>
              </div>

              <div className="filters-actions">
                <button className="btn btn-secondary" onClick={resetFilters}>
                  <FaTimes /> {content?.filters?.buttonReset || "Réinitialiser"}
                </button>
                <span className="results-count">
                  {filteredLogements.length} {content?.filters?.resultsText || "résultat(s)"}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Grille des logements */}
        <div className="logements-grid">
          {filteredLogements.map((logement, index) => (
            <motion.div
              key={logement.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="logement-card"
            >
              <div className="logement-image">
                <img
                  src={getLogementImage(logement)}
                  alt={logement.nom}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x300/1a5490/ffffff?text=${encodeURIComponent(logement.type)}`;
                  }}
                />
              </div>

              <div className="logement-content">
                <h3>{logement.nom}</h3>
                <p className="logement-reference">Réf: {logement.reference}</p>

                <div className="logement-details">
                  <div className="detail-item">
                    <FaRulerCombined />
                    <span>{logement.superficie} m²</span>
                  </div>
                  <div className="detail-item">
                    <FaBed />
                    <span>{logement.nombreChambres} ch.</span>
                  </div>
                  <div className="detail-item">
                    <FaBath />
                    <span>{logement.nombreSallesBain} sdb</span>
                  </div>
                  {logement.parking.inclus && (
                    <div className="detail-item">
                      <FaCar />
                      <span>{logement.parking.nombrePlaces} pkg</span>
                    </div>
                  )}
                </div>

                <p className="logement-description">
                  {logement.description}
                </p>

                <div className="logement-equipements">
                  {logement.equipements.map((equip, idx) => (
                    <span key={idx} className="equipement-tag">
                      <FaCheck /> {equip}
                    </span>
                  ))}
                </div>

                <div className="logement-footer">
                  <div className="prix-section">
                    <div className="prix-container">
                      <span className="prix-label">Prix :</span>
                      <span className="prix">{formatPrix(logement.prix)}</span>
                    </div>

                    <button
                      className="btn btn-primary btn-dynamic"
                      onClick={() => navigate(`/questionnaire/${logement.id}`)}
                      disabled={logement.statut === 'vendu'}
                    >
                      {logement.statut === 'vendu' ? 'Vendu' : 'Je suis intéressé(e)'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLogements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="no-results"
          >
            <FaFilter size={50} />
            <h3>{content?.noResults?.title || "Aucun logement trouvé"}</h3>
            <p>{content?.noResults?.message || "Essayez de modifier vos critères de recherche"}</p>
            <button className="btn btn-secondary" onClick={resetFilters}>
              {content?.noResults?.buttonReset || "Réinitialiser les filtres"}
            </button>
          </motion.div>
        )}
      </div>

      {/* Call to Action */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2>{content?.cta?.title || "Vous avez trouvé votre logement idéal ?"}</h2>
            <p>{content?.cta?.subtitle || "Répondez à notre questionnaire pour être recontacté rapidement"}</p>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/questionnaire')}
            >
              {content?.cta?.buttonText || "Commencer le questionnaire"}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Logements;
