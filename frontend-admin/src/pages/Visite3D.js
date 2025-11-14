import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const Visite3DAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    infoBanner: true,
    videoSection: true,
    infoCards: true,
    cta: true,
    messages: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/visite3d-content`);
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

  const handleInfoBannerChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      infoBanner: { ...prev.infoBanner, [field]: value }
    }));
  };

  const handleVideoSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      videoSection: { ...prev.videoSection, [field]: value }
    }));
  };

  const handleVideoFeatureChange = (featureNumber, field, value) => {
    setContent(prev => ({
      ...prev,
      videoSection: {
        ...prev.videoSection,
        [featureNumber]: {
          ...prev.videoSection[featureNumber],
          [field]: value
        }
      }
    }));
  };

  const handleInfoCardChange = (cardNumber, field, value) => {
    setContent(prev => ({
      ...prev,
      infoCards: {
        ...prev.infoCards,
        [cardNumber]: {
          ...prev.infoCards[cardNumber],
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

  const handleMessagesChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      messages: { ...prev.messages, [field]: value }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/visite3d-content/${content._id}`, {
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
        <h1>Gestion du Contenu - Page Visite 3D</h1>
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
                  placeholder="Ex: Visite 3D de nos Biens"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Explorez nos biens immobiliers en immersion totale..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Info Banner */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('infoBanner')}>
            <h2>Section Bannière d'Information</h2>
            {expandedSections.infoBanner ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.infoBanner && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.infoBanner.title}
                  onChange={(e) => handleInfoBannerChange('title', e.target.value)}
                  placeholder="Ex: Une expérience immersive unique"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.infoBanner.description}
                  onChange={(e) => handleInfoBannerChange('description', e.target.value)}
                  placeholder="Ex: Découvrez nos biens comme si vous y étiez..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Video */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('videoSection')}>
            <h2>Section Vidéo</h2>
            {expandedSections.videoSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.videoSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Texte Overlay (superposition sur la vidéo)</label>
                <input
                  type="text"
                  value={content.videoSection.overlayText}
                  onChange={(e) => handleVideoSectionChange('overlayText', e.target.value)}
                  placeholder="Ex: Visitez comme si vous y étiez"
                />
              </div>
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.videoSection.title}
                  onChange={(e) => handleVideoSectionChange('title', e.target.value)}
                  placeholder="Ex: Une technologie de pointe pour votre confort"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.videoSection.description}
                  onChange={(e) => handleVideoSectionChange('description', e.target.value)}
                  placeholder="Ex: Notre technologie de visite virtuelle vous permet..."
                  rows="3"
                />
              </div>

              <h3>Fonctionnalité 1</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.videoSection.feature1.title}
                    onChange={(e) => handleVideoFeatureChange('feature1', 'title', e.target.value)}
                    placeholder="Ex: Navigation intuitive"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.videoSection.feature1.description}
                    onChange={(e) => handleVideoFeatureChange('feature1', 'description', e.target.value)}
                    placeholder="Ex: Déplacez-vous librement dans chaque pièce"
                  />
                </div>
              </div>

              <h3>Fonctionnalité 2</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.videoSection.feature2.title}
                    onChange={(e) => handleVideoFeatureChange('feature2', 'title', e.target.value)}
                    placeholder="Ex: Vue à 360°"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.videoSection.feature2.description}
                    onChange={(e) => handleVideoFeatureChange('feature2', 'description', e.target.value)}
                    placeholder="Ex: Observez chaque détail sous tous les angles"
                  />
                </div>
              </div>

              <h3>Fonctionnalité 3</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.videoSection.feature3.title}
                    onChange={(e) => handleVideoFeatureChange('feature3', 'title', e.target.value)}
                    placeholder="Ex: Haute qualité"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.videoSection.feature3.description}
                    onChange={(e) => handleVideoFeatureChange('feature3', 'description', e.target.value)}
                    placeholder="Ex: Des images en haute définition pour un réalisme parfait"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Info Cards */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('infoCards')}>
            <h2>Section Cartes d'Information</h2>
            {expandedSections.infoCards ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.infoCards && (
            <div className="section-body">
              <h3>Carte 1</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.infoCards.card1.title}
                    onChange={(e) => handleInfoCardChange('card1', 'title', e.target.value)}
                    placeholder="Ex: Gagnez du temps"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.infoCards.card1.description}
                    onChange={(e) => handleInfoCardChange('card1', 'description', e.target.value)}
                    placeholder="Ex: Visitez plusieurs biens en quelques minutes"
                  />
                </div>
              </div>

              <h3>Carte 2</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.infoCards.card2.title}
                    onChange={(e) => handleInfoCardChange('card2', 'title', e.target.value)}
                    placeholder="Ex: Accessible partout"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.infoCards.card2.description}
                    onChange={(e) => handleInfoCardChange('card2', 'description', e.target.value)}
                    placeholder="Ex: Depuis votre ordinateur, tablette ou smartphone"
                  />
                </div>
              </div>

              <h3>Carte 3</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.infoCards.card3.title}
                    onChange={(e) => handleInfoCardChange('card3', 'title', e.target.value)}
                    placeholder="Ex: Expérience réaliste"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.infoCards.card3.description}
                    onChange={(e) => handleInfoCardChange('card3', 'description', e.target.value)}
                    placeholder="Ex: Une immersion totale pour une meilleure décision"
                  />
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
                  placeholder="Ex: Prêt à explorer nos biens ?"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) => handleCtaChange('description', e.target.value)}
                  placeholder="Ex: Découvrez notre catalogue complet et trouvez le bien qui vous correspond"
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Texte du Bouton</label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                  placeholder="Ex: Voir nos logements"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Messages */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('messages')}>
            <h2>Messages Système</h2>
            {expandedSections.messages ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.messages && (
            <div className="section-body">
              <div className="form-group">
                <label>Texte de chargement</label>
                <input
                  type="text"
                  value={content.messages.loadingText}
                  onChange={(e) => handleMessagesChange('loadingText', e.target.value)}
                  placeholder="Ex: Chargement..."
                />
              </div>
              <div className="form-group">
                <label>Texte d'erreur</label>
                <input
                  type="text"
                  value={content.messages.errorText}
                  onChange={(e) => handleMessagesChange('errorText', e.target.value)}
                  placeholder="Ex: Erreur lors du chargement du contenu"
                />
              </div>
              <div className="form-group">
                <label>Message vidéo non supportée</label>
                <input
                  type="text"
                  value={content.messages.videoNotSupported}
                  onChange={(e) => handleMessagesChange('videoNotSupported', e.target.value)}
                  placeholder="Ex: Votre navigateur ne supporte pas la lecture de vidéos"
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

export default Visite3DAdmin;
