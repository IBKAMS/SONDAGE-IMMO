import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaPlus, FaTrash, FaUndo, FaUpload, FaEye, FaEyeSlash, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import API_URL from '../config';

// Couleurs par type de villa
const TYPE_COLORS = {
  F4: { bg: 'rgba(236, 72, 153, 0.6)', border: '#EC4899', name: 'Villa Duplex 4P (Rose)' },
  F5: { bg: 'rgba(180, 83, 9, 0.6)', border: '#B45309', name: 'Villa Duplex 5P (Marron)' },
  F6: { bg: 'rgba(59, 130, 246, 0.6)', border: '#3B82F6', name: 'Villa Triplex 8P (Bleu)' }
};

const PlanMasseEditor = () => {
  const [lots, setLots] = useState([]);
  const [selectedType, setSelectedType] = useState('F4');
  const [selectedLot, setSelectedLot] = useState(null);
  const [showNumbers, setShowNumbers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planImage, setPlanImage] = useState('/images/plan-masse.png');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lotSize, setLotSize] = useState({ width: 2.5, height: 3.5 });
  const [nextNumero, setNextNumero] = useState({ F4: 1, F5: 1, F6: 1 });
  const [stats, setStats] = useState({ F4: 0, F5: 0, F6: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Charger les lots existants
  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lots`);
      if (response.ok) {
        const data = await response.json();
        setLots(data);
        updateStats(data);
        updateNextNumeros(data);
      }
    } catch (error) {
      console.error('Erreur chargement lots:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (lotsData) => {
    const newStats = { F4: 0, F5: 0, F6: 0 };
    lotsData.forEach(lot => {
      if (newStats[lot.type] !== undefined) {
        newStats[lot.type]++;
      }
    });
    setStats(newStats);
  };

  const updateNextNumeros = (lotsData) => {
    const maxNums = { F4: 0, F5: 0, F6: 0 };
    lotsData.forEach(lot => {
      const match = lot.numero.match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNums[lot.type]) {
          maxNums[lot.type] = num;
        }
      }
    });
    setNextNumero({
      F4: maxNums.F4 + 1,
      F5: maxNums.F5 + 1,
      F6: maxNums.F6 + 1
    });
  };

  // Générer le numéro du lot selon le type
  const generateNumero = (type) => {
    const prefixes = { F4: 'A', F5: 'B', F6: 'C' };
    const num = nextNumero[type];
    setNextNumero(prev => ({ ...prev, [type]: num + 1 }));
    return `${prefixes[type]}${String(num).padStart(2, '0')}`;
  };

  // Clic sur l'image pour placer un lot
  const handleMapClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newLot = {
      _id: `temp_${Date.now()}`,
      numero: generateNumero(selectedType),
      type: selectedType,
      statut: 'disponible',
      position: {
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        width: lotSize.width,
        height: lotSize.height
      }
    };

    setLots(prev => [...prev, newLot]);
    updateStats([...lots, newLot]);
  };

  // Supprimer un lot
  const handleDeleteLot = (lotId) => {
    setLots(prev => prev.filter(l => l._id !== lotId));
    setSelectedLot(null);
    updateStats(lots.filter(l => l._id !== lotId));
  };

  // Annuler le dernier lot ajouté
  const handleUndo = () => {
    if (lots.length === 0) return;
    const newLots = lots.slice(0, -1);
    setLots(newLots);
    updateStats(newLots);

    // Décrémenter le numéro
    const lastLot = lots[lots.length - 1];
    if (lastLot) {
      setNextNumero(prev => ({
        ...prev,
        [lastLot.type]: Math.max(1, prev[lastLot.type] - 1)
      }));
    }
  };

  // Supprimer tous les lots
  const handleClearAll = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer TOUS les lots ? Cette action est irréversible.')) {
      return;
    }
    setLots([]);
    setStats({ F4: 0, F5: 0, F6: 0 });
    setNextNumero({ F4: 1, F5: 1, F6: 1 });
  };

  // Sauvegarder tous les lots
  const handleSave = async () => {
    if (lots.length === 0) {
      alert('Aucun lot à sauvegarder');
      return;
    }

    setSaving(true);
    try {
      // Préparer les lots pour l'envoi (enlever les _id temporaires)
      const lotsToSave = lots.map(lot => ({
        numero: lot.numero,
        type: lot.type,
        statut: lot.statut || 'disponible',
        position: lot.position,
        prix: lot.prix || 0,
        superficie: lot.superficie || 0
      }));

      const response = await fetch(`${API_URL}/api/lots/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ lots: lotsToSave })
      });

      const data = await response.json();

      if (data.success) {
        alert(`${data.lots.length} lots sauvegardés avec succès !`);
        // Recharger les lots depuis le serveur
        fetchLots();
      } else {
        alert('Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des lots');
    } finally {
      setSaving(false);
    }
  };

  // Exporter la configuration en JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(lots, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'plan-masse-config.json');
    linkElement.click();
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement de la configuration...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        padding: isFullscreen ? '1rem' : '0',
        backgroundColor: isFullscreen ? '#1f2937' : 'transparent',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        overflow: isFullscreen ? 'auto' : 'visible'
      }}
    >
      {/* En-tête avec contrôles */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
      }}>
        {/* Sélecteur de type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontWeight: '600' }}>Type de villa:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: `2px solid ${TYPE_COLORS[selectedType].border}`,
              backgroundColor: TYPE_COLORS[selectedType].bg,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <option value="F4">F4 - Villa Duplex 4P (Rose)</option>
            <option value="F5">F5 - Villa Duplex 5P (Marron)</option>
            <option value="F6">F6 - Villa Triplex 8P (Bleu)</option>
          </select>
        </div>

        {/* Taille des lots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem' }}>Taille:</label>
          <input
            type="number"
            value={lotSize.width}
            onChange={(e) => setLotSize(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
            style={{ width: '60px', padding: '0.25rem' }}
            step="0.5"
            min="1"
            max="10"
          />
          <span>x</span>
          <input
            type="number"
            value={lotSize.height}
            onChange={(e) => setLotSize(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
            style={{ width: '60px', padding: '0.25rem' }}
            step="0.5"
            min="1"
            max="10"
          />
          <span>%</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowNumbers(!showNumbers)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: showNumbers ? '#3b82f6' : '#6b7280',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {showNumbers ? <FaEye /> : <FaEyeSlash />}
            Numéros
          </button>

          <button
            onClick={handleUndo}
            disabled={lots.length === 0}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: lots.length === 0 ? '#d1d5db' : '#f59e0b',
              color: 'white',
              cursor: lots.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FaUndo /> Annuler
          </button>

          <button
            onClick={handleClearAll}
            disabled={lots.length === 0}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: lots.length === 0 ? '#d1d5db' : '#ef4444',
              color: 'white',
              cursor: lots.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FaTrash /> Tout effacer
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#6366f1',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: TYPE_COLORS.F4.bg,
          border: `2px solid ${TYPE_COLORS.F4.border}`,
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          F4: {stats.F4}/75
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: TYPE_COLORS.F5.bg,
          border: `2px solid ${TYPE_COLORS.F5.border}`,
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          F5: {stats.F5}/30
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: TYPE_COLORS.F6.bg,
          border: `2px solid ${TYPE_COLORS.F6.border}`,
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          F6: {stats.F6}/10
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          Total: {lots.length}/115
        </div>
      </div>

      {/* Zone du plan de masse */}
      <div style={{
        position: 'relative',
        width: '100%',
        border: '3px solid #374151',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        <img
          ref={imageRef}
          src={planImage}
          alt="Plan de masse"
          onClick={handleMapClick}
          style={{
            width: '100%',
            height: 'auto',
            cursor: 'crosshair',
            display: 'block'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x800?text=Image+du+plan+de+masse';
          }}
        />

        {/* Affichage des lots */}
        {lots.map((lot) => (
          <div
            key={lot._id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLot(selectedLot?._id === lot._id ? null : lot);
            }}
            style={{
              position: 'absolute',
              top: `${lot.position.y}%`,
              left: `${lot.position.x}%`,
              width: `${lot.position.width}%`,
              height: `${lot.position.height}%`,
              backgroundColor: TYPE_COLORS[lot.type]?.bg || 'rgba(0,0,0,0.5)',
              border: `2px solid ${selectedLot?._id === lot._id ? '#fff' : (TYPE_COLORS[lot.type]?.border || '#000')}`,
              borderRadius: '4px',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: selectedLot?._id === lot._id ? '0 0 0 3px rgba(255,255,255,0.8)' : 'none',
              transition: 'all 0.2s ease'
            }}
            title={`${lot.numero} - ${TYPE_COLORS[lot.type]?.name || lot.type}`}
          >
            {showNumbers && (
              <span style={{
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                {lot.numero}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Info lot sélectionné */}
      {selectedLot && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Lot sélectionné:</strong> {selectedLot.numero} ({TYPE_COLORS[selectedLot.type]?.name})
            <br />
            <small>Position: X={selectedLot.position.x.toFixed(1)}%, Y={selectedLot.position.y.toFixed(1)}%</small>
          </div>
          <button
            onClick={() => handleDeleteLot(selectedLot._id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FaTrash /> Supprimer ce lot
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#dbeafe',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <strong>Instructions:</strong>
        <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Sélectionnez le type de villa (F4, F5 ou F6)</li>
          <li>Cliquez sur l'image pour placer une maison à l'emplacement exact</li>
          <li>Utilisez "Annuler" si vous faites une erreur</li>
          <li>Cliquez sur un lot pour le sélectionner et le supprimer si nécessaire</li>
          <li>Une fois tous les 115 lots placés, cliquez sur "Enregistrer"</li>
        </ol>
      </div>

      {/* Boutons d'action finaux */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={handleExport}
          disabled={lots.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: lots.length === 0 ? '#d1d5db' : '#6366f1',
            color: 'white',
            cursor: lots.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaDownload /> Exporter JSON
        </button>

        <button
          onClick={handleSave}
          disabled={saving || lots.length === 0}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: lots.length === 0 ? '#d1d5db' : '#22c55e',
            color: 'white',
            cursor: (saving || lots.length === 0) ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaSave /> {saving ? 'Enregistrement...' : 'Enregistrer la configuration'}
        </button>
      </div>
    </div>
  );
};

export default PlanMasseEditor;
