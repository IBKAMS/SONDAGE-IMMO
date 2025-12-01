import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PresentationAdmin.css';

const PresentationAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    project: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/presentation-content`);
      const data = await response.json();
      if (data.success) {
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
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const handleProjectChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      project: {
        ...prev.project,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/presentation-content/${content._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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
      <div className="presentation-admin-page">
        <div className="loading">Chargement du contenu...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="presentation-admin-page">
        <div className="error">Erreur: Aucun contenu trouvé</div>
      </div>
    );
  }

  return (
    <div className="presentation-admin-page">
      <div className="presentation-header">
        <h1>Gestion du Contenu - Page Présentation</h1>
      </div>

      <div className="presentation-content">
        {/* Section Hero */}
        <div className="content-section">
          <div
            className="section-header"
            onClick={() => toggleSection('hero')}
          >
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
                  placeholder="Ex: Cité KONGO"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: L'habitat de demain..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Le Projet */}
        <div className="content-section">
          <div
            className="section-header"
            onClick={() => toggleSection('project')}
          >
            <h2>Section "Le Projet"</h2>
            {expandedSections.project ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.project && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.project.title}
                  onChange={(e) => handleProjectChange('title', e.target.value)}
                  placeholder="Ex: Le Projet"
                />
              </div>
              <div className="form-group">
                <label>Premier paragraphe (Introduction)</label>
                <textarea
                  value={content.project.leadParagraph}
                  onChange={(e) => handleProjectChange('leadParagraph', e.target.value)}
                  placeholder="Première description du projet..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Deuxième paragraphe (Description détaillée)</label>
                <textarea
                  value={content.project.description}
                  onChange={(e) => handleProjectChange('description', e.target.value)}
                  placeholder="Description détaillée du projet..."
                  rows="4"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons de sauvegarde en bas */}
      <div className="presentation-footer">
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={saving}
        >
          <FaUndo /> Annuler les modifications
        </button>
        <button
          className="btn btn-primary btn-large"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Enregistrement en cours...' : 'Enregistrer toutes les modifications'}
        </button>
      </div>
    </div>
  );
};

export default PresentationAdmin;
