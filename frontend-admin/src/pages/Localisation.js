import React, { useState, useEffect, useRef } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp, FaImage, FaTrash, FaUpload } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const LocalisationAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMapImage, setUploadingMapImage] = useState(false);
  const mapImageInputRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    infoSection: true,
    mapSection: true,
    avantages: true,
    accessibilite: true,
    cta: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/localisation-content`);
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
      alert('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleHeroChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handleInfoSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      infoSection: { ...prev.infoSection, [field]: value }
    }));
  };

  const handleMapSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      mapSection: { ...prev.mapSection, [field]: value }
    }));
  };

  const handleAvantagesSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      avantagesSection: { ...prev.avantagesSection, [field]: value }
    }));
  };

  const handleAvantageChange = (avantageKey, field, value) => {
    setContent(prev => ({
      ...prev,
      avantagesSection: {
        ...prev.avantagesSection,
        [avantageKey]: {
          ...prev.avantagesSection[avantageKey],
          [field]: value
        }
      }
    }));
  };

  const handleAccessibiliteSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      accessibiliteSection: { ...prev.accessibiliteSection, [field]: value }
    }));
  };

  const handleAccesChange = (accesKey, field, value) => {
    setContent(prev => ({
      ...prev,
      accessibiliteSection: {
        ...prev.accessibiliteSection,
        [accesKey]: {
          ...prev.accessibiliteSection[accesKey],
          [field]: value
        }
      }
    }));
  };

  const handleCtaChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/localisation-content/${content._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      const data = await response.json();
      if (data.success) {
        alert('Contenu enregistré avec succès!');
        fetchContent();
      } else {
        alert('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Annuler toutes les modifications ?')) {
      fetchContent();
    }
  };

  // Upload d'une image de carte (jusqu'à 4 images)
  const handleMapImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 10 Mo');
      return;
    }

    // Vérifier qu'on n'a pas déjà 4 images
    const currentImages = content.mapSection?.mapImages || [];
    if (currentImages.length >= 4) {
      alert('Maximum 4 images autorisées. Supprimez une image avant d\'en ajouter une nouvelle.');
      return;
    }

    setUploadingMapImage(true);

    try {
      const formData = new FormData();
      formData.append('mapImage', file);

      const response = await fetch(`${API_URL}/api/localisation-content/${content._id}/map-image`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Mettre à jour le state local avec le tableau d'images
        setContent(prev => ({
          ...prev,
          mapSection: {
            ...prev.mapSection,
            mapImages: data.data.mapImages,
            useCustomImage: data.data.useCustomImage
          }
        }));
        alert('Image de carte uploadée avec succès!');
      } else {
        alert(data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload image carte:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingMapImage(false);
      if (mapImageInputRef.current) {
        mapImageInputRef.current.value = '';
      }
    }
  };

  // Supprimer une image de carte spécifique
  const handleDeleteMapImage = async (imageIndex) => {
    const confirmMsg = imageIndex !== undefined
      ? `Supprimer l'image ${imageIndex + 1} ?`
      : 'Supprimer toutes les images de carte ?';

    if (!window.confirm(confirmMsg)) return;

    setUploadingMapImage(true);

    try {
      const url = imageIndex !== undefined
        ? `${API_URL}/api/localisation-content/${content._id}/map-image/${imageIndex}`
        : `${API_URL}/api/localisation-content/${content._id}/map-image`;

      const response = await fetch(url, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setContent(prev => ({
          ...prev,
          mapSection: {
            ...prev.mapSection,
            mapImages: data.data.mapImages,
            useCustomImage: data.data.useCustomImage
          }
        }));
        alert('Image supprimée avec succès');
      } else {
        alert(data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression image carte:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setUploadingMapImage(false);
    }
  };

  // Mettre à jour la légende d'une image
  const handleUpdateImageCaption = async (imageIndex, caption) => {
    try {
      const response = await fetch(
        `${API_URL}/api/localisation-content/${content._id}/map-image/${imageIndex}/caption`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caption })
        }
      );

      const data = await response.json();

      if (data.success) {
        setContent(prev => {
          const newMapImages = [...(prev.mapSection.mapImages || [])];
          newMapImages[imageIndex] = { ...newMapImages[imageIndex], caption };
          return {
            ...prev,
            mapSection: {
              ...prev.mapSection,
              mapImages: newMapImages
            }
          };
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour légende:', error);
    }
  };

  if (loading) {
    return (
      <div className="promoteur-admin-page">
        <div className="loading">Chargement du contenu...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="promoteur-admin-page">
        <div className="error">Erreur: Aucun contenu trouvé</div>
      </div>
    );
  }

  return (
    <div className="promoteur-admin-page">
      <div className="promoteur-header">
        <h1>Gestion du Contenu - Page Localisation</h1>
      </div>

      <div className="promoteur-content">
        {/* Section Hero */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('hero')}>
            <h2>Section Hero (Bannière principale)</h2>
            {expandedSections.hero ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.hero && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre principal</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  placeholder="Ex: Localisation"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: CITÉ KONGO - Abekan Bernard, Port-Bouët"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Information */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('infoSection')}>
            <h2>Section Information</h2>
            {expandedSections.infoSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.infoSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.infoSection.title}
                  onChange={(e) => handleInfoSectionChange('title', e.target.value)}
                  placeholder="Ex: Une localisation stratégique"
                />
              </div>
              <div className="form-group">
                <label>Texte d'introduction</label>
                <textarea
                  value={content.infoSection.leadText}
                  onChange={(e) => handleInfoSectionChange('leadText', e.target.value)}
                  placeholder="Ex: La CITÉ KONGO est idéalement située..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.infoSection.description}
                  onChange={(e) => handleInfoSectionChange('description', e.target.value)}
                  placeholder="Ex: Cette localisation privilégiée vous offre..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Carte */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('mapSection')}>
            <h2>Section Carte</h2>
            {expandedSections.mapSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.mapSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.mapSection.title}
                  onChange={(e) => handleMapSectionChange('title', e.target.value)}
                  placeholder="Ex: Découvrez notre emplacement"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.mapSection.subtitle}
                  onChange={(e) => handleMapSectionChange('subtitle', e.target.value)}
                  placeholder="Ex: Abekan Bernard, Port-Bouët - Abidjan, Côte d'Ivoire"
                />
              </div>

              {/* Section Images de Carte Personnalisées (jusqu'à 4) */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', border: '2px solid #4caf50' }}>
                <h3 style={{ marginBottom: '15px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaImage /> Images de Carte Personnalisées (Recommandé)
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
                  Uploadez jusqu'à <strong>4 images</strong> de carte pour créer un carrousel.
                  Cela évite les problèmes de blocage CORS avec les images Google.
                </p>

                {/* Affichage des images existantes */}
                {content.mapSection?.mapImages && content.mapSection.mapImages.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: '10px' }}>
                      Images uploadées ({content.mapSection.mapImages.length}/4):
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                      {content.mapSection.mapImages.map((image, index) => (
                        <div key={index} style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '10px',
                          border: '1px solid #ddd',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ position: 'relative', marginBottom: '10px' }}>
                            <img
                              src={image.url}
                              alt={`Image de carte ${index + 1}`}
                              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <span style={{
                              position: 'absolute',
                              top: '5px',
                              left: '5px',
                              background: '#4caf50',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              #{index + 1}
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="Légende de l'image (optionnel)"
                            value={image.caption || ''}
                            onChange={(e) => handleUpdateImageCaption(index, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #ddd',
                              marginBottom: '10px',
                              fontSize: '0.9rem'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteMapImage(index)}
                            disabled={uploadingMapImage}
                            style={{
                              width: '100%',
                              padding: '6px 12px',
                              background: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              fontSize: '0.85rem'
                            }}
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zone d'upload si moins de 4 images */}
                {(!content.mapSection?.mapImages || content.mapSection.mapImages.length < 4) && (
                  <div
                    onClick={() => mapImageInputRef.current?.click()}
                    style={{
                      border: '2px dashed #4caf50',
                      borderRadius: '8px',
                      padding: '30px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#f5fff5',
                      marginBottom: '15px'
                    }}
                  >
                    <FaUpload style={{ fontSize: '2rem', color: '#4caf50', marginBottom: '10px' }} />
                    <p style={{ color: '#2e7d32', fontWeight: 'bold', margin: '0' }}>
                      {uploadingMapImage ? 'Chargement en cours...' : 'Cliquez pour ajouter une image'}
                    </p>
                    <small style={{ color: '#666' }}>
                      PNG, JPG, WEBP - Max 10 Mo
                      {content.mapSection?.mapImages?.length > 0 &&
                        ` (${3 - content.mapSection.mapImages.length} restante${3 - content.mapSection.mapImages.length > 1 ? 's' : ''})`
                      }
                    </small>
                  </div>
                )}

                {/* Bouton pour supprimer toutes les images */}
                {content.mapSection?.mapImages && content.mapSection.mapImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMapImage()}
                    disabled={uploadingMapImage}
                    style={{
                      padding: '8px 16px',
                      background: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.9rem',
                      marginBottom: '15px'
                    }}
                  >
                    <FaTrash /> Supprimer toutes les images
                  </button>
                )}

                <input
                  type="file"
                  ref={mapImageInputRef}
                  onChange={handleMapImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={content.mapSection?.useCustomImage || false}
                      onChange={(e) => handleMapSectionChange('useCustomImage', e.target.checked)}
                    />
                    <span>Utiliser les images personnalisées (au lieu de l'iframe Google Maps)</span>
                  </label>
                  <small style={{ color: '#666', marginLeft: '26px', display: 'block', marginTop: '5px' }}>
                    Active le carrousel d'images sur la page Localisation du site
                  </small>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>URLs Google Maps (Alternative)</h3>
                <small style={{ color: '#666', display: 'block', marginBottom: '15px' }}>
                  Ces URLs seront utilisées si aucune image personnalisée n'est définie ou si la checkbox ci-dessus est décochée.
                </small>
                <div className="form-group">
                  <label>URL d'embed de la carte (iframe)</label>
                  <textarea
                    value={content.mapSection.mapEmbedUrl}
                    onChange={(e) => handleMapSectionChange('mapEmbedUrl', e.target.value)}
                    placeholder="Ex: https://maps.google.com/maps?q=5.2447,-3.9317+(CITÉ+KONGO)&hl=fr&z=16&output=embed"
                    rows="2"
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    Pour obtenir cette URL: Allez sur Google Maps &rarr; Cherchez votre localisation &rarr; Cliquez sur "Partager" &rarr; "Intégrer une carte" &rarr; Copiez l'URL dans src=""
                  </small>
                </div>
                <div className="form-group">
                  <label>URL de recherche Google Maps (lien détaillé)</label>
                  <textarea
                    value={content.mapSection.mapSearchUrl}
                    onChange={(e) => handleMapSectionChange('mapSearchUrl', e.target.value)}
                    placeholder="Ex: https://www.google.com/maps/search/Abekan+Bernard,+Port-Bouet,+Abidjan/@5.2447,-3.9317,16z"
                    rows="2"
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    URL pour ouvrir la recherche dans Google Maps (avec coordonnées)
                  </small>
                </div>
                <div className="form-group">
                  <label>URL directe Google Maps (bouton de la carte)</label>
                  <textarea
                    value={content.mapSection.mapDirectUrl}
                    onChange={(e) => handleMapSectionChange('mapDirectUrl', e.target.value)}
                    placeholder="Ex: https://www.google.com/maps/search/Abekan+Bernard+Port-Bouet+Abidjan"
                    rows="2"
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    URL simple pour le bouton "Ouvrir dans Google Maps"
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label>Texte indicateur</label>
                <input
                  type="text"
                  value={content.mapSection.indicatorText}
                  onChange={(e) => handleMapSectionChange('indicatorText', e.target.value)}
                  placeholder="Ex: Site du Projet"
                />
              </div>
              <div className="form-group">
                <label>Localisation indicateur</label>
                <input
                  type="text"
                  value={content.mapSection.indicatorLocation}
                  onChange={(e) => handleMapSectionChange('indicatorLocation', e.target.value)}
                  placeholder="Ex: Abekan Bernard"
                />
              </div>
              <div className="form-group">
                <label>Texte du lien</label>
                <input
                  type="text"
                  value={content.mapSection.linkText}
                  onChange={(e) => handleMapSectionChange('linkText', e.target.value)}
                  placeholder="Ex: Ouvrir dans Google Maps (Vue détaillée)"
                />
              </div>
              <div className="form-group">
                <label>Titre de la carte</label>
                <input
                  type="text"
                  value={content.mapSection.cardTitle}
                  onChange={(e) => handleMapSectionChange('cardTitle', e.target.value)}
                  placeholder="Ex: CITÉ KONGO"
                />
              </div>
              <div className="form-group">
                <label>Localisation 1 (carte)</label>
                <input
                  type="text"
                  value={content.mapSection.cardLocation1}
                  onChange={(e) => handleMapSectionChange('cardLocation1', e.target.value)}
                  placeholder="Ex: Abekan Bernard"
                />
              </div>
              <div className="form-group">
                <label>Localisation 2 (carte)</label>
                <input
                  type="text"
                  value={content.mapSection.cardLocation2}
                  onChange={(e) => handleMapSectionChange('cardLocation2', e.target.value)}
                  placeholder="Ex: Port-Bouët, Abidjan"
                />
              </div>
              <div className="form-group">
                <label>Localisation 3 (carte)</label>
                <input
                  type="text"
                  value={content.mapSection.cardLocation3}
                  onChange={(e) => handleMapSectionChange('cardLocation3', e.target.value)}
                  placeholder="Ex: Côte d'Ivoire"
                />
              </div>
              <div className="form-group">
                <label>Texte du bouton</label>
                <input
                  type="text"
                  value={content.mapSection.cardButtonText}
                  onChange={(e) => handleMapSectionChange('cardButtonText', e.target.value)}
                  placeholder="Ex: Ouvrir dans Google Maps"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Avantages */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('avantages')}>
            <h2>Section Avantages de la localisation</h2>
            {expandedSections.avantages ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.avantages && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.avantagesSection.title}
                  onChange={(e) => handleAvantagesSectionChange('title', e.target.value)}
                  placeholder="Ex: Les avantages de notre localisation"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre de la section</label>
                <input
                  type="text"
                  value={content.avantagesSection.subtitle}
                  onChange={(e) => handleAvantagesSectionChange('subtitle', e.target.value)}
                  placeholder="Ex: Un emplacement qui facilite votre quotidien"
                />
              </div>

              {/* Avantage 1 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 1</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage1.titre}
                      onChange={(e) => handleAvantageChange('avantage1', 'titre', e.target.value)}
                      placeholder="Ex: Vue sur la Lagune"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage1.description}
                      onChange={(e) => handleAvantageChange('avantage1', 'description', e.target.value)}
                      placeholder="Ex: Site donnant sur la lagune Ébrié..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Avantage 2 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 2</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage2.titre}
                      onChange={(e) => handleAvantageChange('avantage2', 'titre', e.target.value)}
                      placeholder="Ex: Proximité Aéroport"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage2.description}
                      onChange={(e) => handleAvantageChange('avantage2', 'description', e.target.value)}
                      placeholder="Ex: À quelques minutes de l'aéroport..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Avantage 3 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 3</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage3.titre}
                      onChange={(e) => handleAvantageChange('avantage3', 'titre', e.target.value)}
                      placeholder="Ex: Accès Rapide"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage3.description}
                      onChange={(e) => handleAvantageChange('avantage3', 'description', e.target.value)}
                      placeholder="Ex: Axes routiers majeurs..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Avantage 4 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 4</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage4.titre}
                      onChange={(e) => handleAvantageChange('avantage4', 'titre', e.target.value)}
                      placeholder="Ex: Commerces"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage4.description}
                      onChange={(e) => handleAvantageChange('avantage4', 'description', e.target.value)}
                      placeholder="Ex: Supermarchés à proximité..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Avantage 5 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 5</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage5.titre}
                      onChange={(e) => handleAvantageChange('avantage5', 'titre', e.target.value)}
                      placeholder="Ex: Santé"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage5.description}
                      onChange={(e) => handleAvantageChange('avantage5', 'description', e.target.value)}
                      placeholder="Ex: Hôpitaux accessibles..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Avantage 6 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Avantage 6</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection.avantage6.titre}
                      onChange={(e) => handleAvantageChange('avantage6', 'titre', e.target.value)}
                      placeholder="Ex: Transport"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection.avantage6.description}
                      onChange={(e) => handleAvantageChange('avantage6', 'description', e.target.value)}
                      placeholder="Ex: Réseau de transport public..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Accessibilité */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('accessibilite')}>
            <h2>Section Accessibilité</h2>
            {expandedSections.accessibilite ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.accessibilite && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.accessibiliteSection.title}
                  onChange={(e) => handleAccessibiliteSectionChange('title', e.target.value)}
                  placeholder="Ex: Comment nous rejoindre ?"
                />
              </div>

              {/* Accès 1 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Accès 1</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.accessibiliteSection.acces1.titre}
                      onChange={(e) => handleAccesChange('acces1', 'titre', e.target.value)}
                      placeholder="Ex: En transport public"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.accessibiliteSection.acces1.description}
                      onChange={(e) => handleAccesChange('acces1', 'description', e.target.value)}
                      placeholder="Ex: Lignes de bus régulières..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Accès 2 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Accès 2</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.accessibiliteSection.acces2.titre}
                      onChange={(e) => handleAccesChange('acces2', 'titre', e.target.value)}
                      placeholder="Ex: En voiture"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.accessibiliteSection.acces2.description}
                      onChange={(e) => handleAccesChange('acces2', 'description', e.target.value)}
                      placeholder="Ex: Depuis le Plateau..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Accès 3 */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
                <h3>Accès 3</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.accessibiliteSection.acces3.titre}
                      onChange={(e) => handleAccesChange('acces3', 'titre', e.target.value)}
                      placeholder="Ex: Depuis l'aéroport"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.accessibiliteSection.acces3.description}
                      onChange={(e) => handleAccesChange('acces3', 'description', e.target.value)}
                      placeholder="Ex: À seulement 10 minutes..."
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section CTA */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('cta')}>
            <h2>Section Call-to-Action (CTA)</h2>
            {expandedSections.cta ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.cta && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.cta.title}
                  onChange={(e) => handleCtaChange('title', e.target.value)}
                  placeholder="Ex: Intéressé par ce projet ?"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) => handleCtaChange('description', e.target.value)}
                  placeholder="Ex: Découvrez nos différentes options d'achat..."
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Texte du Bouton</label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                  placeholder="Ex: Découvrir les options d'achat"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer avec boutons de sauvegarde */}
      <div className="promoteur-footer">
        <button className="btn btn-secondary" onClick={handleReset} disabled={saving}>
          <FaUndo /> Annuler les modifications
        </button>
        <button className="btn btn-primary btn-large" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? 'Enregistrement en cours...' : 'Enregistrer toutes les modifications'}
        </button>
      </div>
    </div>
  );
};

export default LocalisationAdmin;
