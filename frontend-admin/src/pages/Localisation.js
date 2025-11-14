import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const LocalisationAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>URLs Google Maps</h3>
                <div className="form-group">
                  <label>URL d'embed de la carte (iframe)</label>
                  <textarea
                    value={content.mapSection.mapEmbedUrl}
                    onChange={(e) => handleMapSectionChange('mapEmbedUrl', e.target.value)}
                    placeholder="Ex: https://maps.google.com/maps?q=5.2447,-3.9317+(CITÉ+KONGO)&hl=fr&z=16&output=embed"
                    rows="2"
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem' }}>
                    Pour obtenir cette URL: Allez sur Google Maps → Cherchez votre localisation → Cliquez sur "Partager" → "Intégrer une carte" → Copiez l'URL dans src=""
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
