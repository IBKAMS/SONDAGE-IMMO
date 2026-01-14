import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaCompress, FaCheck, FaInfoCircle } from 'react-icons/fa';
import API_URL from '../config';
import './PlanInteractif.css';

// Couleurs par type de villa
const TYPE_COLORS = {
  F4: { bg: 'rgba(236, 72, 153, 0.5)', border: '#EC4899', selected: '#EC4899', name: 'Villa Duplex 4 Pièces' },
  F5: { bg: 'rgba(180, 83, 9, 0.5)', border: '#B45309', selected: '#B45309', name: 'Villa Duplex 5 Pièces' },
  F6: { bg: 'rgba(59, 130, 246, 0.5)', border: '#3B82F6', selected: '#3B82F6', name: 'Villa Triplex 8 Pièces' }
};

const STATUS_COLORS = {
  disponible: { bg: 'transparent', hover: 'rgba(34, 197, 94, 0.3)' },
  reserve: { bg: 'rgba(107, 114, 128, 0.7)' },
  vendu: { bg: 'rgba(239, 68, 68, 0.7)' }
};

const PlanInteractif = ({ onSelectLot, selectedLotId: externalSelectedId, filterType = null }) => {
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [hoveredLot, setHoveredLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const containerRef = useRef(null);
  const planImage = '/images/plan-masse.png';

  // Charger les lots depuis l'API
  useEffect(() => {
    fetchLots();
  }, []);

  // Synchroniser avec la sélection externe
  useEffect(() => {
    if (externalSelectedId) {
      const lot = lots.find(l => l._id === externalSelectedId);
      if (lot) setSelectedLot(lot);
    }
  }, [externalSelectedId, lots]);

  const fetchLots = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lots`);
      if (response.ok) {
        const data = await response.json();
        setLots(data);
      }
    } catch (error) {
      console.error('Erreur chargement lots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLotClick = (lot) => {
    if (lot.statut !== 'disponible') {
      return;
    }

    // Si déjà sélectionné, désélectionner
    if (selectedLot?._id === lot._id) {
      setSelectedLot(null);
      if (onSelectLot) onSelectLot(null);
    } else {
      setSelectedLot(lot);
      if (onSelectLot) onSelectLot(lot);
    }
  };

  const getDisplayedLots = () => {
    if (!filterType) return lots;
    return lots.filter(lot => lot.type === filterType);
  };

  const getStats = () => {
    const displayedLots = getDisplayedLots();
    return {
      total: displayedLots.length,
      disponibles: displayedLots.filter(l => l.statut === 'disponible').length,
      reserves: displayedLots.filter(l => l.statut === 'reserve').length,
      vendus: displayedLots.filter(l => l.statut === 'vendu').length
    };
  };

  if (loading) {
    return (
      <div className="plan-interactif-loading">
        <div className="spinner"></div>
        <p>Chargement du plan...</p>
      </div>
    );
  }

  if (lots.length === 0) {
    return (
      <div className="plan-interactif-empty">
        <FaInfoCircle size={48} />
        <p>Le plan de masse interactif n'est pas encore configuré.</p>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div
      ref={containerRef}
      className={`plan-interactif-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {/* En-tête */}
      <div className="plan-interactif-header">
        <h3>Sélectionnez votre logement sur le plan</h3>
        <div className="plan-interactif-actions">
          <button
            className="btn-toggle-legend"
            onClick={() => setShowLegend(!showLegend)}
          >
            {showLegend ? 'Masquer' : 'Afficher'} légende
          </button>
          <button
            className="btn-fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Légende */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="plan-interactif-legend"
          >
            <div className="legend-types">
              <span className="legend-title">Types:</span>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: TYPE_COLORS.F4.border }}></span>
                F4 - Duplex 4P
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: TYPE_COLORS.F5.border }}></span>
                F5 - Duplex 5P
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: TYPE_COLORS.F6.border }}></span>
                F6 - Triplex 8P
              </div>
            </div>
            <div className="legend-status">
              <span className="legend-title">Statuts:</span>
              <div className="legend-item">
                <span className="legend-color available"></span>
                Disponible ({stats.disponibles})
              </div>
              <div className="legend-item">
                <span className="legend-color reserved"></span>
                Réservé ({stats.reserves})
              </div>
              <div className="legend-item">
                <span className="legend-color sold"></span>
                Vendu ({stats.vendus})
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone du plan */}
      <div className="plan-interactif-map">
        <img
          src={planImage}
          alt="Plan de masse Cité Kongo"
          className="plan-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x800?text=Plan+de+masse';
          }}
        />

        {/* Lots */}
        {getDisplayedLots().map((lot) => {
          const isSelected = selectedLot?._id === lot._id;
          const isHovered = hoveredLot?._id === lot._id;
          const isAvailable = lot.statut === 'disponible';
          const typeColor = TYPE_COLORS[lot.type] || TYPE_COLORS.F4;

          return (
            <motion.div
              key={lot._id}
              className={`lot-marker ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
              style={{
                top: `${lot.position.y}%`,
                left: `${lot.position.x}%`,
                width: `${lot.position.width}%`,
                height: `${lot.position.height}%`,
                backgroundColor: isSelected
                  ? typeColor.selected
                  : lot.statut === 'reserve'
                    ? STATUS_COLORS.reserve.bg
                    : lot.statut === 'vendu'
                      ? STATUS_COLORS.vendu.bg
                      : isHovered
                        ? typeColor.bg
                        : 'transparent',
                borderColor: typeColor.border,
              }}
              onClick={() => handleLotClick(lot)}
              onMouseEnter={() => setHoveredLot(lot)}
              onMouseLeave={() => setHoveredLot(null)}
              whileHover={isAvailable ? { scale: 1.1 } : {}}
              animate={isSelected ? {
                boxShadow: [
                  `0 0 0 0 ${typeColor.selected}`,
                  `0 0 0 8px transparent`,
                  `0 0 0 0 ${typeColor.selected}`
                ]
              } : {}}
              transition={isSelected ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              {isSelected && (
                <motion.div
                  className="selected-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <FaCheck />
                </motion.div>
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {(isHovered || isSelected) && (
                  <motion.div
                    className="lot-tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <strong>{lot.numero}</strong>
                    <span>{typeColor.name}</span>
                    <span className={`status ${lot.statut}`}>
                      {lot.statut === 'disponible' ? 'Disponible' :
                       lot.statut === 'reserve' ? 'Réservé' : 'Vendu'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Info lot sélectionné */}
      <AnimatePresence>
        {selectedLot && (
          <motion.div
            className="selected-lot-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="selected-lot-details">
              <div className="lot-badge" style={{ backgroundColor: TYPE_COLORS[selectedLot.type]?.border }}>
                {selectedLot.numero}
              </div>
              <div className="lot-info-text">
                <strong>{TYPE_COLORS[selectedLot.type]?.name}</strong>
                <span>Votre sélection</span>
              </div>
            </div>
            <button
              className="btn-deselect"
              onClick={() => {
                setSelectedLot(null);
                if (onSelectLot) onSelectLot(null);
              }}
            >
              Changer de choix
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanInteractif;
