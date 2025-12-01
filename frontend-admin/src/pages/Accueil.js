import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './Accueil.css';

const Accueil = () => {
  const [content, setContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFooter, setSavingFooter] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    stats: true,
    quickLinks: true,
    cta: true,
    footer: true
  });

  useEffect(() => {
    fetchContent();
    fetchFooterContent();
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

  const fetchFooterContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/footer-content`);
      const data = await response.json();
      if (data.success) {
        setFooterContent(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement footer:', error);
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

  // Footer handlers
  const handleFooterBrandChange = (field, value) => {
    setFooterContent(prev => ({
      ...prev,
      brand: {
        ...prev.brand,
        [field]: value
      }
    }));
  };

  const handleFooterContactChange = (field, value) => {
    setFooterContent(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handleFooterCopyrightChange = (value) => {
    setFooterContent(prev => ({
      ...prev,
      copyright: {
        ...prev.copyright,
        text: value
      }
    }));
  };

  const handleFooterNavLinkChange = (index, field, value) => {
    const newLinks = [...footerContent.navigation.links];
    newLinks[index] = {
      ...newLinks[index],
      [field]: value
    };
    setFooterContent(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        links: newLinks
      }
    }));
  };

  const addFooterNavLink = () => {
    setFooterContent(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        links: [...prev.navigation.links, { label: '', url: '' }]
      }
    }));
  };

  const removeFooterNavLink = (index) => {
    if (window.confirm('Supprimer ce lien de navigation ?')) {
      const newLinks = footerContent.navigation.links.filter((_, i) => i !== index);
      setFooterContent(prev => ({
        ...prev,
        navigation: {
          ...prev.navigation,
          links: newLinks
        }
      }));
    }
  };

  const handleFooterInfoLinkChange = (index, field, value) => {
    const newLinks = [...footerContent.informations.links];
    newLinks[index] = {
      ...newLinks[index],
      [field]: value
    };
    setFooterContent(prev => ({
      ...prev,
      informations: {
        ...prev.informations,
        links: newLinks
      }
    }));
  };

  const addFooterInfoLink = () => {
    setFooterContent(prev => ({
      ...prev,
      informations: {
        ...prev.informations,
        links: [...prev.informations.links, { label: '', url: '' }]
      }
    }));
  };

  const removeFooterInfoLink = (index) => {
    if (window.confirm('Supprimer ce lien d\'information ?')) {
      const newLinks = footerContent.informations.links.filter((_, i) => i !== index);
      setFooterContent(prev => ({
        ...prev,
        informations: {
          ...prev.informations,
          links: newLinks
        }
      }));
    }
  };

  const handleSaveFooter = async () => {
    if (!window.confirm('Enregistrer les modifications du footer ?')) return;

    setSavingFooter(true);
    try {
      const response = await fetch(`${API_URL}/api/footer-content/${footerContent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(footerContent)
      });

      const data = await response.json();
      if (data.success) {
        alert('Footer enregistré avec succès!');
        fetchFooterContent();
      } else {
        alert('Erreur lors de l\'enregistrement du footer');
      }
    } catch (error) {
      console.error('Erreur sauvegarde footer:', error);
      alert('Erreur lors de l\'enregistrement du footer');
    } finally {
      setSavingFooter(false);
    }
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

        {/* Section Footer */}
        {footerContent && (
          <div className="content-section footer-section-admin">
            <div
              className="section-header"
              onClick={() => toggleSection('footer')}
            >
              <h2>Section Footer (Pied de page)</h2>
              {expandedSections.footer ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.footer && (
              <div className="section-body">
                {/* Marque */}
                <div className="subsection">
                  <h3>Marque</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom de la marque</label>
                      <input
                        type="text"
                        value={footerContent.brand?.name || ''}
                        onChange={(e) => handleFooterBrandChange('name', e.target.value)}
                        placeholder="Ex: CITÉ KONGO"
                      />
                    </div>
                    <div className="form-group">
                      <label>Slogan</label>
                      <input
                        type="text"
                        value={footerContent.brand?.slogan || ''}
                        onChange={(e) => handleFooterBrandChange('slogan', e.target.value)}
                        placeholder="Ex: Votre projet immobilier de prestige"
                      />
                    </div>
                  </div>
                </div>

                {/* Liens Navigation */}
                <div className="subsection">
                  <h3>Navigation ({footerContent.navigation?.links?.length || 0} liens)</h3>
                  {footerContent.navigation?.links?.map((link, index) => (
                    <div key={index} className="item-card">
                      <div className="item-header">
                        <h4>Lien {index + 1}</h4>
                        <button
                          className="btn-delete"
                          onClick={() => removeFooterNavLink(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Libellé</label>
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => handleFooterNavLinkChange(index, 'label', e.target.value)}
                            placeholder="Ex: Présentation"
                          />
                        </div>
                        <div className="form-group">
                          <label>URL</label>
                          <input
                            type="text"
                            value={link.url || ''}
                            onChange={(e) => handleFooterNavLinkChange(index, 'url', e.target.value)}
                            placeholder="Ex: /presentation"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-add"
                    onClick={addFooterNavLink}
                  >
                    <FaPlus /> Ajouter un lien de navigation
                  </button>
                </div>

                {/* Liens Informations */}
                <div className="subsection">
                  <h3>Informations ({footerContent.informations?.links?.length || 0} liens)</h3>
                  {footerContent.informations?.links?.map((link, index) => (
                    <div key={index} className="item-card">
                      <div className="item-header">
                        <h4>Lien {index + 1}</h4>
                        <button
                          className="btn-delete"
                          onClick={() => removeFooterInfoLink(index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Libellé</label>
                          <input
                            type="text"
                            value={link.label || ''}
                            onChange={(e) => handleFooterInfoLinkChange(index, 'label', e.target.value)}
                            placeholder="Ex: Le Promoteur"
                          />
                        </div>
                        <div className="form-group">
                          <label>URL</label>
                          <input
                            type="text"
                            value={link.url || ''}
                            onChange={(e) => handleFooterInfoLinkChange(index, 'url', e.target.value)}
                            placeholder="Ex: /promoteur"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-add"
                    onClick={addFooterInfoLink}
                  >
                    <FaPlus /> Ajouter un lien d'information
                  </button>
                </div>

                {/* Contact */}
                <div className="subsection">
                  <h3>Contact</h3>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="text"
                      value={footerContent.contact?.phone || ''}
                      onChange={(e) => handleFooterContactChange('phone', e.target.value)}
                      placeholder="Ex: +225 XX XX XX XX XX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={footerContent.contact?.email || ''}
                      onChange={(e) => handleFooterContactChange('email', e.target.value)}
                      placeholder="Ex: contact@citekongo.ci"
                    />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                    <input
                      type="text"
                      value={footerContent.contact?.address || ''}
                      onChange={(e) => handleFooterContactChange('address', e.target.value)}
                      placeholder="Ex: Abidjan, Côte d'Ivoire"
                    />
                  </div>
                </div>

                {/* Copyright */}
                <div className="subsection">
                  <h3>Copyright</h3>
                  <div className="form-group">
                    <label>Texte du copyright</label>
                    <input
                      type="text"
                      value={footerContent.copyright?.text || ''}
                      onChange={(e) => handleFooterCopyrightChange(e.target.value)}
                      placeholder="Ex: © 2024 Cité Kongo. Tous droits réservés."
                    />
                  </div>
                </div>

                {/* Bouton de sauvegarde du footer */}
                <div className="footer-save-section">
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveFooter}
                    disabled={savingFooter}
                  >
                    <FaSave /> {savingFooter ? 'Enregistrement...' : 'Enregistrer le Footer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
