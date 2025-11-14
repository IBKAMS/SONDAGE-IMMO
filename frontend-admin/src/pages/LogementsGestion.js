import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaEdit, FaHome, FaTimes, FaCheck } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const LogementsGestion = () => {
  const [logements, setLogements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    fetchLogements();
    fetchStats();
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

  const addImage = () => {
    const url = prompt('URL de l\'image:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }));
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
              <h2>Statistiques</h2>
            </div>
            <div className="section-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Total de logements</label>
                  <input type="text" value={stats.total} readOnly />
                </div>
                <div className="form-group">
                  <label>Disponibles</label>
                  <input type="text" value={stats.disponibles} readOnly />
                </div>
                <div className="form-group">
                  <label>Prix minimum</label>
                  <input type="text" value={formatPrice(stats.prixMin)} readOnly />
                </div>
                <div className="form-group">
                  <label>Prix maximum</label>
                  <input type="text" value={formatPrice(stats.prixMax)} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label>Salles de bain</label>
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
                <label>Images</label>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addImage}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <FaPlus /> Ajouter une image
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.images.map((img, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="text" value={img} readOnly style={{ flex: 1 }} />
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
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
