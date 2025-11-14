import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const LogementsAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    filters: true,
    noResults: true,
    cta: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logements-content`);
      const data = await response.json();
      if (data.success && data.data) {
        // Initialiser les stats s'ils n'existent pas
        if (data.data.hero && !data.data.hero.stats) {
          data.data.hero.stats = {
            labelTotal: 'Logements',
            labelDisponibles: 'Disponibles',
            labelPrixMin: 'Prix minimum'
          };
        }
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

  const handleHeroStatsChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: { ...prev.hero.stats, [field]: value }
      }
    }));
  };

  const handleFiltersChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      filters: { ...prev.filters, [field]: value }
    }));
  };

  const handleNoResultsChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      noResults: { ...prev.noResults, [field]: value }
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
      const response = await fetch(`${API_URL}/api/logements-content/${content._id}`, {
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
        <h1>Gestion du Contenu - Page Logements</h1>
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
                  placeholder="Ex: Nos Logements"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Découvrez notre sélection..."
                />
              </div>
              <div className="form-group">
                <h3>Labels des Statistiques</h3>
                <label>Label Total</label>
                <input
                  type="text"
                  value={content.hero.stats.labelTotal}
                  onChange={(e) => handleHeroStatsChange('labelTotal', e.target.value)}
                  placeholder="Ex: Logements"
                />
              </div>
              <div className="form-group">
                <label>Label Disponibles</label>
                <input
                  type="text"
                  value={content.hero.stats.labelDisponibles}
                  onChange={(e) => handleHeroStatsChange('labelDisponibles', e.target.value)}
                  placeholder="Ex: Disponibles"
                />
              </div>
              <div className="form-group">
                <label>Label Prix Minimum</label>
                <input
                  type="text"
                  value={content.hero.stats.labelPrixMin}
                  onChange={(e) => handleHeroStatsChange('labelPrixMin', e.target.value)}
                  placeholder="Ex: Prix minimum"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Filtres */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('filters')}>
            <h2>Section Filtres</h2>
            {expandedSections.filters ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.filters && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.filters.title}
                  onChange={(e) => handleFiltersChange('title', e.target.value)}
                  placeholder="Ex: Filtrer les logements"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bouton Afficher</label>
                  <input
                    type="text"
                    value={content.filters.buttonShow}
                    onChange={(e) => handleFiltersChange('buttonShow', e.target.value)}
                    placeholder="Ex: Afficher"
                  />
                </div>
                <div className="form-group">
                  <label>Bouton Masquer</label>
                  <input
                    type="text"
                    value={content.filters.buttonHide}
                    onChange={(e) => handleFiltersChange('buttonHide', e.target.value)}
                    placeholder="Ex: Masquer"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Label Type de Bien</label>
                <input
                  type="text"
                  value={content.filters.labelTypeBien}
                  onChange={(e) => handleFiltersChange('labelTypeBien', e.target.value)}
                  placeholder="Ex: Type de bien"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Label Prix Minimum</label>
                  <input
                    type="text"
                    value={content.filters.labelPrixMin}
                    onChange={(e) => handleFiltersChange('labelPrixMin', e.target.value)}
                    placeholder="Ex: Prix minimum (FCFA)"
                  />
                </div>
                <div className="form-group">
                  <label>Label Prix Maximum</label>
                  <input
                    type="text"
                    value={content.filters.labelPrixMax}
                    onChange={(e) => handleFiltersChange('labelPrixMax', e.target.value)}
                    placeholder="Ex: Prix maximum (FCFA)"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Label Superficie Minimum</label>
                  <input
                    type="text"
                    value={content.filters.labelSuperficieMin}
                    onChange={(e) => handleFiltersChange('labelSuperficieMin', e.target.value)}
                    placeholder="Ex: Superficie min (m²)"
                  />
                </div>
                <div className="form-group">
                  <label>Label Superficie Maximum</label>
                  <input
                    type="text"
                    value={content.filters.labelSuperficieMax}
                    onChange={(e) => handleFiltersChange('labelSuperficieMax', e.target.value)}
                    placeholder="Ex: Superficie max (m²)"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Label Statut</label>
                <input
                  type="text"
                  value={content.filters.labelStatut}
                  onChange={(e) => handleFiltersChange('labelStatut', e.target.value)}
                  placeholder="Ex: Statut"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bouton Réinitialiser</label>
                  <input
                    type="text"
                    value={content.filters.buttonReset}
                    onChange={(e) => handleFiltersChange('buttonReset', e.target.value)}
                    placeholder="Ex: Réinitialiser"
                  />
                </div>
                <div className="form-group">
                  <label>Texte Résultats</label>
                  <input
                    type="text"
                    value={content.filters.resultsText}
                    onChange={(e) => handleFiltersChange('resultsText', e.target.value)}
                    placeholder="Ex: résultat(s)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Aucun Résultat */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('noResults')}>
            <h2>Section Aucun Résultat</h2>
            {expandedSections.noResults ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.noResults && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.noResults.title}
                  onChange={(e) => handleNoResultsChange('title', e.target.value)}
                  placeholder="Ex: Aucun logement trouvé"
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <input
                  type="text"
                  value={content.noResults.message}
                  onChange={(e) => handleNoResultsChange('message', e.target.value)}
                  placeholder="Ex: Essayez de modifier vos critères de recherche"
                />
              </div>
              <div className="form-group">
                <label>Texte du Bouton</label>
                <input
                  type="text"
                  value={content.noResults.buttonReset}
                  onChange={(e) => handleNoResultsChange('buttonReset', e.target.value)}
                  placeholder="Ex: Réinitialiser les filtres"
                />
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
                  placeholder="Ex: Vous avez trouvé votre logement idéal ?"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.cta.subtitle}
                  onChange={(e) => handleCtaChange('subtitle', e.target.value)}
                  placeholder="Ex: Répondez à notre questionnaire..."
                />
              </div>
              <div className="form-group">
                <label>Texte du Bouton</label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                  placeholder="Ex: Commencer le questionnaire"
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

export default LogementsAdmin;
