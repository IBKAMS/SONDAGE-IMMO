import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaPlus, FaTrash, FaEdit, FaHome, FaTimes, FaCheck, FaUpload, FaLink, FaImage, FaMap } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';
import PlanMasseEditor from '../components/PlanMasseEditor';

const LogementsGestion = () => {
  const [logements, setLogements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [logementsContent, setLogementsContent] = useState(null);
  const [customStats, setCustomStats] = useState({
    useCustomStats: false,
    customTotal: 0,
    customDisponibles: 0,
    customPrixMin: 0,
    customPrixMax: 0,
    customSections: []
  });
  const [editingLogement, setEditingLogement] = useState(null);
  const [formData, setFormData] = useState({
    reference: '',
    type: 'Villa Duplex',
    nom: '',
    superficie: 0,
    nombrePieces: 0,
    nombreChambres: 0,
    nombreSallesBain: 0,
    nombreWC: 0,
    etage: '',
    prix: 0,
    description: '',
    equipements: [],
    balcon: false,
    terrasse: false,
    jardin: false,
    parking: {
      inclus: false,
      nombrePlaces: 0
    },
    orientation: 'sud',
    statut: 'disponible',
    images: [],
    planUrl: '',
    actif: true
  });
  const [equipementInput, setEquipementInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchLogements();
    fetchStats();
    fetchLogementsContent();
  }, []);

  const fetchLogements = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logements/admin/all`);
      const data = await response.json();
      if (data.success) {
        setLogements(data.data);
      } else {
        console.error('Erreur API:', data);
      }
    } catch (error) {
      console.error('Erreur chargement logements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logements/stats/all`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const fetchLogementsContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logements-content`);
      const data = await response.json();
      if (data.success && data.data) {
        setLogementsContent(data.data);
        if (data.data.hero?.stats) {
          const statsData = data.data.hero.stats;

          // Migration: convertir l'ancien format vers le nouveau si nécessaire
          let sections = statsData.customSections || [];
          if (sections.length === 0 && statsData.villasSectionTitle) {
            // Convertir l'ancien format
            sections = [{
              title: statsData.villasSectionTitle || 'Répartition par type de villa',
              items: [
                { label: statsData.villasLabel1 || 'Villas Duplex 4P', value: statsData.villasValue1 || 75 },
                { label: statsData.villasLabel2 || 'Villas Duplex 5P', value: statsData.villasValue2 || 30 },
                { label: statsData.villasLabel3 || 'Villas Triplex 6P', value: statsData.villasValue3 || 10 }
              ]
            }];
          }

          setCustomStats({
            useCustomStats: statsData.useCustomStats || false,
            customTotal: statsData.customTotal || 0,
            customDisponibles: statsData.customDisponibles || 0,
            customPrixMin: statsData.customPrixMin || 0,
            customPrixMax: statsData.customPrixMax || 0,
            customSections: sections
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement contenu logements:', error);
    }
  };

  const handleCustomStatsChange = (field, value) => {
    setCustomStats(prev => ({
      ...prev,
      [field]: field === 'useCustomStats' ? value : (field === 'customSections' ? value : Number(value))
    }));
  };

  // Fonctions pour gérer les sections personnalisées
  const addSection = () => {
    setCustomStats(prev => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          title: 'Nouvelle section',
          items: [
            { label: 'Label 1', value: 0, optionsPosees: 0 },
            { label: 'Label 2', value: 0, optionsPosees: 0 },
            { label: 'Label 3', value: 0, optionsPosees: 0 }
          ]
        }
      ]
    }));
  };

  const removeSection = (sectionIndex) => {
    setCustomStats(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== sectionIndex)
    }));
  };

  const updateSectionTitle = (sectionIndex, title) => {
    setCustomStats(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex ? { ...section, title } : section
      )
    }));
  };

  const updateSectionItem = (sectionIndex, itemIndex, field, value) => {
    setCustomStats(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, j) =>
                j === itemIndex
                  ? { ...item, [field]: (field === 'value' || field === 'optionsPosees') ? Number(value) : value }
                  : item
              )
            }
          : section
      )
    }));
  };

  const addItemToSection = (sectionIndex) => {
    setCustomStats(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex
          ? { ...section, items: [...section.items, { label: 'Nouveau label', value: 0, optionsPosees: 0 }] }
          : section
      )
    }));
  };

  const removeItemFromSection = (sectionIndex, itemIndex) => {
    setCustomStats(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex
          ? { ...section, items: section.items.filter((_, j) => j !== itemIndex) }
          : section
      )
    }));
  };

  const saveCustomStats = async () => {
    setSavingStats(true);
    try {
      // Si pas de contenu existant, on crée un nouveau
      const url = logementsContent?._id
        ? `${API_URL}/api/logements-content/${logementsContent._id}`
        : `${API_URL}/api/logements-content`;

      const method = logementsContent?._id ? 'PUT' : 'POST';

      const updatedContent = {
        ...logementsContent,
        hero: {
          ...logementsContent?.hero,
          title: logementsContent?.hero?.title || 'Nos Logements',
          subtitle: logementsContent?.hero?.subtitle || 'Découvrez notre sélection d\'appartements et villas',
          stats: {
            ...logementsContent?.hero?.stats,
            useCustomStats: customStats.useCustomStats,
            customTotal: customStats.customTotal,
            customDisponibles: customStats.customDisponibles,
            customPrixMin: customStats.customPrixMin,
            customPrixMax: customStats.customPrixMax,
            customSections: customStats.customSections
          }
        }
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedContent)
      });

      const data = await response.json();
      if (data.success) {
        alert('Statistiques enregistrées avec succès');
        setLogementsContent(data.data);
      } else {
        alert(data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement des statistiques');
    } finally {
      setSavingStats(false);
    }
  };

  const openModal = (logement = null) => {
    if (logement) {
      setEditingLogement(logement);
      setFormData({
        reference: logement.reference,
        type: logement.type,
        nom: logement.nom,
        superficie: logement.superficie,
        nombrePieces: logement.nombrePieces || 0,
        nombreChambres: logement.nombreChambres || 0,
        nombreSallesBain: logement.nombreSallesBain || 0,
        nombreWC: logement.nombreWC || 0,
        etage: logement.etage || '',
        prix: logement.prix,
        description: logement.description || '',
        equipements: logement.equipements || [],
        balcon: logement.balcon || false,
        terrasse: logement.terrasse || false,
        jardin: logement.jardin || false,
        parking: logement.parking || { inclus: false, nombrePlaces: 0 },
        orientation: logement.orientation || 'sud',
        statut: logement.statut,
        images: logement.images || [],
        planUrl: logement.planUrl || '',
        actif: logement.actif !== undefined ? logement.actif : true
      });
    } else {
      setEditingLogement(null);
      setFormData({
        reference: '',
        type: 'Villa Duplex',
        nom: '',
        superficie: 0,
        nombrePieces: 0,
        nombreChambres: 0,
        nombreSallesBain: 0,
        nombreWC: 0,
        etage: '',
        prix: 0,
        description: '',
        equipements: [],
        balcon: false,
        terrasse: false,
        jardin: false,
        parking: {
          inclus: false,
          nombrePlaces: 0
        },
        orientation: 'sud',
        statut: 'disponible',
        images: [],
        planUrl: '',
        actif: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLogement(null);
    setEquipementInput('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParkingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      parking: {
        ...prev.parking,
        [field]: value
      }
    }));
  };

  const addEquipement = () => {
    if (equipementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipements: [...prev.equipements, equipementInput.trim()]
      }));
      setEquipementInput('');
    }
  };

  const removeEquipement = (index) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.filter((_, i) => i !== index)
    }));
  };

  const addImageByUrl = () => {
    if (imageUrlInput && imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 10 Mo');
      return;
    }

    setUploadingImage(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await fetch(`${API_URL}/api/logements/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.data.url]
        }));
        alert('Image uploadée avec succès');
      } else {
        alert(data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
      // Reset le file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingLogement
        ? `${API_URL}/api/logements/${editingLogement._id}`
        : `${API_URL}/api/logements`;

      const method = editingLogement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(editingLogement ? 'Logement modifié avec succès' : 'Logement créé avec succès');
        closeModal();
        fetchLogements();
        fetchStats();
      } else {
        alert(data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement du logement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/logements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Logement supprimé avec succès');
        fetchLogements();
        fetchStats();
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du logement');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="promoteur-admin-page">
        <div className="loading">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promoteur-admin-page">
      <div className="promoteur-header">
        <h1>
          <FaHome />
          Gestion des Logements
        </h1>
      </div>

      {stats && (
        <div className="promoteur-content">
          <div className="section">
            <div className="section-header">
              <h2>Statistiques (affichées sur le site)</h2>
              <button
                className="btn btn-success"
                onClick={saveCustomStats}
                disabled={savingStats}
              >
                <FaSave /> {savingStats ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
            <div className="section-body">
              {/* Option pour utiliser des valeurs personnalisées */}
              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: customStats.useCustomStats ? '#dcfce7' : '#f3f4f6',
                borderRadius: '8px',
                border: customStats.useCustomStats ? '2px solid #22c55e' : '1px solid #e5e7eb'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={customStats.useCustomStats}
                    onChange={(e) => handleCustomStatsChange('useCustomStats', e.target.checked)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  Utiliser des valeurs personnalisées (sinon valeurs automatiques)
                </label>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  {customStats.useCustomStats
                    ? 'Les valeurs ci-dessous seront affichées sur le site.'
                    : `Valeurs automatiques actuelles: ${stats.total} logements, ${stats.disponibles} disponibles, ${formatPrice(stats.prixMin)} - ${formatPrice(stats.prixMax)}`
                  }
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total de logements</label>
                  <input
                    type="number"
                    value={customStats.useCustomStats ? customStats.customTotal : stats.total}
                    onChange={(e) => handleCustomStatsChange('customTotal', e.target.value)}
                    disabled={!customStats.useCustomStats}
                    style={{ backgroundColor: customStats.useCustomStats ? '#fff' : '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label>Disponibles</label>
                  <input
                    type="number"
                    value={customStats.useCustomStats ? customStats.customDisponibles : stats.disponibles}
                    onChange={(e) => handleCustomStatsChange('customDisponibles', e.target.value)}
                    disabled={!customStats.useCustomStats}
                    style={{ backgroundColor: customStats.useCustomStats ? '#fff' : '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label>Prix minimum (FCFA)</label>
                  <input
                    type="number"
                    value={customStats.useCustomStats ? customStats.customPrixMin : stats.prixMin}
                    onChange={(e) => handleCustomStatsChange('customPrixMin', e.target.value)}
                    disabled={!customStats.useCustomStats}
                    style={{ backgroundColor: customStats.useCustomStats ? '#fff' : '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label>Prix maximum (FCFA)</label>
                  <input
                    type="number"
                    value={customStats.useCustomStats ? customStats.customPrixMax : stats.prixMax}
                    onChange={(e) => handleCustomStatsChange('customPrixMax', e.target.value)}
                    disabled={!customStats.useCustomStats}
                    style={{ backgroundColor: customStats.useCustomStats ? '#fff' : '#f3f4f6' }}
                  />
                </div>
              </div>

              {/* Sections de statistiques personnalisables */}
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#374151' }}>Sections de statistiques personnalisées</h3>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addSection}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FaPlus /> Ajouter une section
                  </button>
                </div>

                {customStats.customSections.length === 0 ? (
                  <div style={{
                    padding: '2rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <p>Aucune section personnalisée. Cliquez sur "Ajouter une section" pour en créer une.</p>
                  </div>
                ) : (
                  customStats.customSections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      style={{
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: '8px',
                        border: '2px solid #f59e0b'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ flex: 1, marginRight: '1rem', marginBottom: 0 }}>
                          <label style={{ fontWeight: '600', color: '#92400e' }}>Titre de la section</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                            style={{ backgroundColor: '#fff', fontWeight: '600' }}
                            placeholder="Ex: Répartition par type de villa"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => removeSection(sectionIndex)}
                          style={{ marginTop: '1.5rem' }}
                        >
                          <FaTrash /> Supprimer
                        </button>
                      </div>

                      <div className="form-row" style={{ flexWrap: 'wrap' }}>
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="form-group" style={{ position: 'relative', minWidth: '250px' }}>
                            <label>Type de logement {itemIndex + 1}</label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateSectionItem(sectionIndex, itemIndex, 'label', e.target.value)}
                              style={{ backgroundColor: '#fff', marginBottom: '0.5rem' }}
                              placeholder="Ex: Duplex 4P"
                            />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total unités</label>
                                <input
                                  type="number"
                                  value={item.value}
                                  onChange={(e) => updateSectionItem(sectionIndex, itemIndex, 'value', e.target.value)}
                                  style={{ backgroundColor: '#fff' }}
                                  placeholder="75"
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '600' }}>Options posées</label>
                                <input
                                  type="number"
                                  value={item.optionsPosees || 0}
                                  onChange={(e) => updateSectionItem(sectionIndex, itemIndex, 'optionsPosees', e.target.value)}
                                  style={{ backgroundColor: '#dcfce7', borderColor: '#22c55e' }}
                                  placeholder="12"
                                />
                              </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontStyle: 'italic' }}>
                              Affichera: "Déjà {item.optionsPosees || 0} options posées sur les {item.value} {item.label}"
                            </p>
                            {section.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItemFromSection(sectionIndex, itemIndex)}
                                style={{
                                  position: 'absolute',
                                  top: '0',
                                  right: '0',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px'
                                }}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={() => addItemToSection(sectionIndex)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        <FaPlus /> Ajouter un élément
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Plan de Masse Interactif */}
      <div className="promoteur-content">
        <div className="section">
          <div className="section-header">
            <h2><FaMap /> Plan de Masse Interactif</h2>
          </div>
          <div className="section-body">
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Configurez le plan de masse interactif en plaçant les 115 villas (75 F4 + 30 F5 + 10 F6).
              Ce plan sera affiché aux clients dans la rubrique "Option d'Achat" pour leur permettre de choisir leur maison.
            </p>
            <PlanMasseEditor />
          </div>
        </div>
      </div>

      <div className="promoteur-content">
        <div className="section">
          <div className="section-header">
            <h2>Liste des logements</h2>
            <button className="btn btn-success" onClick={() => openModal()}>
              <FaPlus /> Ajouter un logement
            </button>
          </div>
          <div className="section-body">
            {logements.length === 0 ? (
              <div className="empty-state">
                <p>Aucun logement pour le moment</p>
              </div>
            ) : (
              <div className="items-list">
                {logements.map((logement) => (
                  <div key={logement._id} className="item-card">
                    <div className="item-card-header">
                      <h4>{logement.nom}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => openModal(logement)}
                        >
                          <FaEdit /> Modifier
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(logement._id)}
                        >
                          <FaTrash /> Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="item-card-body">
                      <div className="form-row">
                        <div>
                          <strong>Référence:</strong> {logement.reference}
                        </div>
                        <div>
                          <strong>Type:</strong> {logement.type}
                        </div>
                      </div>
                      <div className="form-row">
                        <div>
                          <strong>Superficie:</strong> {logement.superficie} m²
                        </div>
                        <div>
                          <strong>Prix:</strong> {formatPrice(logement.prix)}
                        </div>
                      </div>
                      <div className="form-row">
                        <div>
                          <strong>Pièces:</strong> {logement.nombrePieces}
                        </div>
                        <div>
                          <strong>Chambres:</strong> {logement.nombreChambres}
                        </div>
                      </div>
                      <div className="form-row">
                        <div>
                          <strong>Statut:</strong> {' '}
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: logement.statut === 'disponible' ? '#d1fae5' :
                              logement.statut === 'réservé' ? '#fed7aa' : '#fecaca',
                            color: logement.statut === 'disponible' ? '#065f46' :
                              logement.statut === 'réservé' ? '#92400e' : '#991b1b'
                          }}>
                            {logement.statut}
                          </span>
                        </div>
                        <div>
                          <strong>Actif:</strong> {logement.actif ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLogement ? 'Modifier le logement' : 'Ajouter un logement'}</h2>
              <button className="btn btn-small btn-danger" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Référence *</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => handleChange('reference', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  >
                    <option value="Villa Duplex">Villa Duplex</option>
                    <option value="Villa Triplex">Villa Triplex</option>
                    <option value="villa">Villa</option>
                    <option value="duplex">Duplex</option>
                    <option value="triplex">Triplex</option>
                    <option value="studio">Studio</option>
                    <option value="F2">F2</option>
                    <option value="F3">F3</option>
                    <option value="F4">F4</option>
                    <option value="F5">F5</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Superficie (m²) *</label>
                  <input
                    type="number"
                    value={formData.superficie}
                    onChange={(e) => handleChange('superficie', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prix (FCFA) *</label>
                  <input
                    type="number"
                    value={formData.prix}
                    onChange={(e) => handleChange('prix', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de pièces</label>
                  <input
                    type="number"
                    value={formData.nombrePieces}
                    onChange={(e) => handleChange('nombrePieces', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre de chambres</label>
                  <input
                    type="number"
                    value={formData.nombreChambres}
                    onChange={(e) => handleChange('nombreChambres', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salles d'eau</label>
                  <input
                    type="number"
                    value={formData.nombreSallesBain}
                    onChange={(e) => handleChange('nombreSallesBain', parseInt(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>WC</label>
                  <input
                    type="number"
                    value={formData.nombreWC}
                    onChange={(e) => handleChange('nombreWC', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Étage</label>
                  <input
                    type="text"
                    value={formData.etage}
                    onChange={(e) => handleChange('etage', e.target.value)}
                    placeholder="Ex: R+1, R+2"
                  />
                </div>
                <div className="form-group">
                  <label>Orientation</label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => handleChange('orientation', e.target.value)}
                  >
                    <option value="nord">Nord</option>
                    <option value="sud">Sud</option>
                    <option value="est">Est</option>
                    <option value="ouest">Ouest</option>
                    <option value="nord-est">Nord-Est</option>
                    <option value="nord-ouest">Nord-Ouest</option>
                    <option value="sud-est">Sud-Est</option>
                    <option value="sud-ouest">Sud-Ouest</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Équipements</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={equipementInput}
                    onChange={(e) => setEquipementInput(e.target.value)}
                    placeholder="Ajouter un équipement"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipement())}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addEquipement}
                  >
                    <FaPlus />
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.equipements.map((eq, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#e0f2fe',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {eq}
                      <button
                        type="button"
                        onClick={() => removeEquipement(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0',
                          marginLeft: '0.25rem'
                        }}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.balcon}
                      onChange={(e) => handleChange('balcon', e.target.checked)}
                    />
                    Balcon
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.terrasse}
                      onChange={(e) => handleChange('terrasse', e.target.checked)}
                    />
                    Terrasse
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.jardin}
                      onChange={(e) => handleChange('jardin', e.target.checked)}
                    />
                    Jardin
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.parking.inclus}
                      onChange={(e) => handleParkingChange('inclus', e.target.checked)}
                    />
                    Parking inclus
                  </label>
                </div>
                <div className="form-group">
                  <label>Nombre de places de parking</label>
                  <input
                    type="number"
                    value={formData.parking.nombrePlaces}
                    onChange={(e) => handleParkingChange('nombrePlaces', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => handleChange('statut', e.target.value)}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="réservé">Réservé</option>
                    <option value="vendu">Vendu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.actif}
                      onChange={(e) => handleChange('actif', e.target.checked)}
                    />
                    Actif
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label><FaImage /> Images du logement</label>

                {/* Section Upload depuis l'ordinateur */}
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  border: '2px dashed #3b82f6'
                }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#1e40af' }}>
                    <FaUpload /> Uploader depuis l'ordinateur
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  {uploadingImage && (
                    <p style={{ color: '#3b82f6', fontSize: '0.9rem' }}>
                      Upload en cours...
                    </p>
                  )}
                </div>

                {/* Section Ajouter par URL */}
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #86efac'
                }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#166534' }}>
                    <FaLink /> Ajouter par URL
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://exemple.com/image.jpg"
                      style={{ flex: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageByUrl())}
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={addImageByUrl}
                      disabled={!imageUrlInput.trim()}
                    >
                      <FaPlus /> Ajouter
                    </button>
                  </div>
                </div>

                {/* Liste des images avec aperçu */}
                {formData.images.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                      Images ajoutées ({formData.images.length})
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: '1rem'
                    }}>
                      {formData.images.map((img, index) => (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#fff'
                          }}
                        >
                          <img
                            src={img}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150x100?text=Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px'
                            }}
                          >
                            <FaTimes />
                          </button>
                          <p style={{
                            fontSize: '0.7rem',
                            padding: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            backgroundColor: '#f3f4f6'
                          }}>
                            {img.split('/').pop()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>URL du plan</label>
                <input
                  type="text"
                  value={formData.planUrl}
                  onChange={(e) => handleChange('planUrl', e.target.value)}
                  placeholder="/assets/plans/..."
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  <FaSave /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogementsGestion;
