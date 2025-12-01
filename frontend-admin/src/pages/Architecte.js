import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const Architecte = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    presentation: true,
    videoSection: true,
    equipeSection: true,
    valeursSection: true,
    engagement: true,
    architecteChef: true,
    contact: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/architecte-content`);
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
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const handlePresentationChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      presentation: { ...prev.presentation, [field]: value }
    }));
  };

  const handleVideoSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      videoSection: { ...prev.videoSection, [field]: value }
    }));
  };

  const handleEquipeSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      equipeSection: { ...prev.equipeSection, [field]: value }
    }));
  };

  const handleMembreChange = (index, field, value) => {
    const newMembres = [...content.equipeSection.membres];
    newMembres[index] = { ...newMembres[index], [field]: value };
    setContent(prev => ({
      ...prev,
      equipeSection: { ...prev.equipeSection, membres: newMembres }
    }));
  };

  const addMembre = () => {
    const newMembre = {
      metier: '',
      order: content.equipeSection.membres.length + 1
    };
    setContent(prev => ({
      ...prev,
      equipeSection: {
        ...prev.equipeSection,
        membres: [...prev.equipeSection.membres, newMembre]
      }
    }));
  };

  const removeMembre = (index) => {
    if (window.confirm('Supprimer ce membre ?')) {
      const newMembres = content.equipeSection.membres.filter((_, i) => i !== index);
      newMembres.forEach((membre, i) => { membre.order = i + 1; });
      setContent(prev => ({
        ...prev,
        equipeSection: { ...prev.equipeSection, membres: newMembres }
      }));
    }
  };

  const handleValeursSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      valeursSection: { ...prev.valeursSection, [field]: value }
    }));
  };

  const handleValeurChange = (index, field, value) => {
    const newValeurs = [...content.valeursSection.valeurs];
    newValeurs[index] = { ...newValeurs[index], [field]: value };
    setContent(prev => ({
      ...prev,
      valeursSection: { ...prev.valeursSection, valeurs: newValeurs }
    }));
  };

  const addValeur = () => {
    const newValeur = {
      titre: '',
      description: '',
      order: content.valeursSection.valeurs.length + 1
    };
    setContent(prev => ({
      ...prev,
      valeursSection: {
        ...prev.valeursSection,
        valeurs: [...prev.valeursSection.valeurs, newValeur]
      }
    }));
  };

  const removeValeur = (index) => {
    if (window.confirm('Supprimer cette valeur ?')) {
      const newValeurs = content.valeursSection.valeurs.filter((_, i) => i !== index);
      newValeurs.forEach((valeur, i) => { valeur.order = i + 1; });
      setContent(prev => ({
        ...prev,
        valeursSection: { ...prev.valeursSection, valeurs: newValeurs }
      }));
    }
  };

  const handleEngagementChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      engagement: { ...prev.engagement, [field]: value }
    }));
  };

  const handleArchitecteChefChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      architecteChef: { ...prev.architecteChef, [field]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/architecte-content/${content._id}`, {
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
        <h1>Gestion du Contenu - Page Architecte</h1>
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
                  placeholder="Ex: KONGO ARCHITECTURE"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Innovation et excellence architecturale"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Présentation */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('presentation')}>
            <h2>Section Présentation</h2>
            {expandedSections.presentation ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.presentation && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.presentation.title}
                  onChange={(e) => handlePresentationChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Premier paragraphe</label>
                <textarea
                  value={content.presentation.paragraph1}
                  onChange={(e) => handlePresentationChange('paragraph1', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Deuxième paragraphe</label>
                <textarea
                  value={content.presentation.paragraph2}
                  onChange={(e) => handlePresentationChange('paragraph2', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Troisième paragraphe</label>
                <textarea
                  value={content.presentation.paragraph3}
                  onChange={(e) => handlePresentationChange('paragraph3', e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Vidéo */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('videoSection')}>
            <h2>Section Vidéo</h2>
            {expandedSections.videoSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.videoSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.videoSection.title}
                  onChange={(e) => handleVideoSectionChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.videoSection.subtitle}
                  onChange={(e) => handleVideoSectionChange('subtitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Texte overlay (sur la vidéo)</label>
                <input
                  type="text"
                  value={content.videoSection.overlayText}
                  onChange={(e) => handleVideoSectionChange('overlayText', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Équipe */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('equipeSection')}>
            <h2>Section Équipe ({content.equipeSection.membres.length} membres)</h2>
            {expandedSections.equipeSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.equipeSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.equipeSection.title}
                  onChange={(e) => handleEquipeSectionChange('title', e.target.value)}
                />
              </div>

              {content.equipeSection.membres.sort((a, b) => a.order - b.order).map((membre, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h3>Membre {index + 1}</h3>
                    <button className="btn-delete" onClick={() => removeMembre(index)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Métier/Spécialité</label>
                    <input
                      type="text"
                      value={membre.metier}
                      onChange={(e) => handleMembreChange(index, 'metier', e.target.value)}
                      placeholder="Ex: Architecte principal, Ingénieur structure..."
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-add" onClick={addMembre}>
                <FaPlus /> Ajouter un membre
              </button>
            </div>
          )}
        </div>

        {/* Section Valeurs */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('valeursSection')}>
            <h2>Section Valeurs ({content.valeursSection.valeurs.length} valeurs)</h2>
            {expandedSections.valeursSection ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.valeursSection && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.valeursSection.title}
                  onChange={(e) => handleValeursSectionChange('title', e.target.value)}
                />
              </div>

              {content.valeursSection.valeurs.sort((a, b) => a.order - b.order).map((valeur, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h3>Valeur {index + 1}</h3>
                    <button className="btn-delete" onClick={() => removeValeur(index)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={valeur.titre}
                      onChange={(e) => handleValeurChange(index, 'titre', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={valeur.description}
                      onChange={(e) => handleValeurChange(index, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
              <button className="btn btn-add" onClick={addValeur}>
                <FaPlus /> Ajouter une valeur
              </button>
            </div>
          )}
        </div>

        {/* Section Engagement */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('engagement')}>
            <h2>Section Engagement</h2>
            {expandedSections.engagement ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.engagement && (
            <div className="section-body">
              <div className="form-group">
                <label>Premier paragraphe</label>
                <textarea
                  value={content.engagement.paragraph1}
                  onChange={(e) => handleEngagementChange('paragraph1', e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Deuxième paragraphe</label>
                <textarea
                  value={content.engagement.paragraph2}
                  onChange={(e) => handleEngagementChange('paragraph2', e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Architecte en Chef */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('architecteChef')}>
            <h2>Section Architecte en Chef</h2>
            {expandedSections.architecteChef ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.architecteChef && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.architecteChef.title}
                  onChange={(e) => handleArchitecteChefChange('title', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={content.architecteChef.nom}
                    onChange={(e) => handleArchitecteChefChange('nom', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Titre/Fonction</label>
                  <input
                    type="text"
                    value={content.architecteChef.titre}
                    onChange={(e) => handleArchitecteChefChange('titre', e.target.value)}
                    placeholder="Ex: Architecte en Chef"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.architecteChef.description}
                  onChange={(e) => handleArchitecteChefChange('description', e.target.value)}
                  rows="4"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Contact */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('contact')}>
            <h2>Section Contact</h2>
            {expandedSections.contact ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.contact && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => handleContactChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.contact.subtitle}
                  onChange={(e) => handleContactChange('subtitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Adresse ligne 1</label>
                <input
                  type="text"
                  value={content.contact.adresse1}
                  onChange={(e) => handleContactChange('adresse1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Adresse ligne 2</label>
                <input
                  type="text"
                  value={content.contact.adresse2}
                  onChange={(e) => handleContactChange('adresse2', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Adresse ligne 3</label>
                <input
                  type="text"
                  value={content.contact.adresse3}
                  onChange={(e) => handleContactChange('adresse3', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone 1</label>
                  <input
                    type="text"
                    value={content.contact.telephone1}
                    onChange={(e) => handleContactChange('telephone1', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone 2</label>
                  <input
                    type="text"
                    value={content.contact.telephone2}
                    onChange={(e) => handleContactChange('telephone2', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Site Web</label>
                  <input
                    type="text"
                    value={content.contact.siteWeb}
                    onChange={(e) => handleContactChange('siteWeb', e.target.value)}
                    placeholder="Ex: www.exemple.com"
                  />
                </div>
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

export default Architecte;
