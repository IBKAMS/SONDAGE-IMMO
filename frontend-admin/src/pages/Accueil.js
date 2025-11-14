import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './Accueil.css';

const Accueil = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    stats: true,
    quickLinks: true,
    cta: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/home-content`);
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

  const handleStatChange = (index, field, value) => {
    const newStats = [...content.stats];
    newStats[index] = {
      ...newStats[index],
      [field]: value
    };
    setContent(prev => ({
      ...prev,
      stats: newStats
    }));
  };

  const addStat = () => {
    const newStat = {
      title: '',
      description: '',
      order: content.stats.length + 1
    };
    setContent(prev => ({
      ...prev,
      stats: [...prev.stats, newStat]
    }));
  };

  const removeStat = (index) => {
    if (window.confirm('Supprimer cette statistique ?')) {
      const newStats = content.stats.filter((_, i) => i !== index);
      // Réorganiser les numéros d'ordre
      newStats.forEach((stat, i) => {
        stat.order = i + 1;
      });
      setContent(prev => ({
        ...prev,
        stats: newStats
      }));
    }
  };

  const handleQuickLinkChange = (index, field, value) => {
    const newCards = [...content.quickLinks.cards];
    newCards[index] = {
      ...newCards[index],
      [field]: value
    };
    setContent(prev => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        cards: newCards
      }
    }));
  };

  const addQuickLink = () => {
    const newCard = {
      title: '',
      description: '',
      order: content.quickLinks.cards.length + 1
    };
    setContent(prev => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        cards: [...prev.quickLinks.cards, newCard]
      }
    }));
  };

  const removeQuickLink = (index) => {
    if (window.confirm('Supprimer ce lien rapide ?')) {
      const newCards = content.quickLinks.cards.filter((_, i) => i !== index);
      // Réorganiser les numéros d'ordre
      newCards.forEach((card, i) => {
        card.order = i + 1;
      });
      setContent(prev => ({
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          cards: newCards
        }
      }));
    }
  };

  const handleCtaChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/home-content/${content._id}`, {
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
      <div className="accueil-page">
        <div className="loading">Chargement du contenu...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="accueil-page">
        <div className="error">Erreur: Aucun contenu trouvé</div>
      </div>
    );
  }

  return (
    <div className="accueil-page">
      <div className="accueil-header">
        <h1>Gestion du Contenu - Page d'Accueil</h1>
      </div>

      <div className="accueil-content">
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
                  placeholder="Ex: Votre futur cadre de vie..."
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  placeholder="Description du projet..."
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Texte bouton principal</label>
                  <input
                    type="text"
                    value={content.hero.primaryButtonText}
                    onChange={(e) => handleHeroChange('primaryButtonText', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Texte bouton secondaire</label>
                  <input
                    type="text"
                    value={content.hero.secondaryButtonText}
                    onChange={(e) => handleHeroChange('secondaryButtonText', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Statistiques */}
        <div className="content-section">
          <div
            className="section-header"
            onClick={() => toggleSection('stats')}
          >
            <h2>Section Statistiques ({content.stats.length})</h2>
            {expandedSections.stats ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.stats && (
            <div className="section-body">
              {content.stats.sort((a, b) => a.order - b.order).map((stat, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h3>Statistique {index + 1}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => removeStat(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Titre</label>
                      <input
                        type="text"
                        value={stat.title}
                        onChange={(e) => handleStatChange(index, 'title', e.target.value)}
                        placeholder="Ex: 3 Types"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={stat.description}
                        onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                        placeholder="Ex: de villas disponibles"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-add"
                onClick={addStat}
              >
                <FaPlus /> Ajouter une statistique
              </button>
            </div>
          )}
        </div>

        {/* Section Liens Rapides */}
        <div className="content-section">
          <div
            className="section-header"
            onClick={() => toggleSection('quickLinks')}
          >
            <h2>Section Liens Rapides ({content.quickLinks.cards.length})</h2>
            {expandedSections.quickLinks ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.quickLinks && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.quickLinks.sectionTitle}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    quickLinks: {
                      ...prev.quickLinks,
                      sectionTitle: e.target.value
                    }
                  }))}
                  placeholder="Ex: Découvrir le Projet"
                />
              </div>
              {content.quickLinks.cards.sort((a, b) => a.order - b.order).map((card, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h3>Lien {index + 1}</h3>
                    <button
                      className="btn-delete"
                      onClick={() => removeQuickLink(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleQuickLinkChange(index, 'title', e.target.value)}
                      placeholder="Ex: Présentation"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={card.description}
                      onChange={(e) => handleQuickLinkChange(index, 'description', e.target.value)}
                      placeholder="Ex: Découvrez le projet Cité KONGO en détail"
                    />
                  </div>
                </div>
              ))}
              <button
                className="btn btn-add"
                onClick={addQuickLink}
              >
                <FaPlus /> Ajouter un lien rapide
              </button>
            </div>
          )}
        </div>

        {/* Section CTA (Call to Action) */}
        <div className="content-section">
          <div
            className="section-header"
            onClick={() => toggleSection('cta')}
          >
            <h2>Section Call to Action (Appel à l'action)</h2>
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
                  placeholder="Ex: Prêt à devenir propriétaire?"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.cta.description}
                  onChange={(e) => handleCtaChange('description', e.target.value)}
                  placeholder="Texte d'encouragement..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Texte du bouton</label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                  placeholder="Ex: Commencer maintenant"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons de sauvegarde en bas */}
      <div className="accueil-footer">
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

export default Accueil;
