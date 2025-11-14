import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const PromoteurAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    mission: true,
    videoSection: true,
    stats: true,
    valeurs: true,
    projets: true,
    nouveauProjet: true,
    contact: true
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/promoteur-content`);
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

  const handleMissionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      mission: { ...prev.mission, [field]: value }
    }));
  };

  const handleVideoSectionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      videoSection: { ...prev.videoSection, [field]: value }
    }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent(prev => ({ ...prev, stats: newStats }));
  };

  const addStat = () => {
    const newStat = {
      value: 0,
      label: '',
      order: content.stats.length + 1
    };
    setContent(prev => ({ ...prev, stats: [...prev.stats, newStat] }));
  };

  const removeStat = (index) => {
    if (window.confirm('Supprimer cette statistique ?')) {
      const newStats = content.stats.filter((_, i) => i !== index);
      newStats.forEach((stat, i) => { stat.order = i + 1; });
      setContent(prev => ({ ...prev, stats: newStats }));
    }
  };

  const handleValeurChange = (index, field, value) => {
    const newValeurs = [...content.valeurs];
    newValeurs[index] = { ...newValeurs[index], [field]: value };
    setContent(prev => ({ ...prev, valeurs: newValeurs }));
  };

  const addValeur = () => {
    const newValeur = {
      titre: '',
      description: '',
      order: content.valeurs.length + 1
    };
    setContent(prev => ({ ...prev, valeurs: [...prev.valeurs, newValeur] }));
  };

  const removeValeur = (index) => {
    if (window.confirm('Supprimer cette valeur ?')) {
      const newValeurs = content.valeurs.filter((_, i) => i !== index);
      newValeurs.forEach((valeur, i) => { valeur.order = i + 1; });
      setContent(prev => ({ ...prev, valeurs: newValeurs }));
    }
  };

  const handleProjetChange = (index, field, value) => {
    const newProjets = [...content.projetsSection.projets];
    newProjets[index] = { ...newProjets[index], [field]: value };
    setContent(prev => ({
      ...prev,
      projetsSection: { ...prev.projetsSection, projets: newProjets }
    }));
  };

  const handleCaracteristiqueChange = (projetIndex, caracIndex, value) => {
    const newProjets = [...content.projetsSection.projets];
    newProjets[projetIndex].caracteristiques[caracIndex] = value;
    setContent(prev => ({
      ...prev,
      projetsSection: { ...prev.projetsSection, projets: newProjets }
    }));
  };

  const addCaracteristique = (projetIndex) => {
    const newProjets = [...content.projetsSection.projets];
    newProjets[projetIndex].caracteristiques.push('');
    setContent(prev => ({
      ...prev,
      projetsSection: { ...prev.projetsSection, projets: newProjets }
    }));
  };

  const removeCaracteristique = (projetIndex, caracIndex) => {
    const newProjets = [...content.projetsSection.projets];
    newProjets[projetIndex].caracteristiques = newProjets[projetIndex].caracteristiques.filter((_, i) => i !== caracIndex);
    setContent(prev => ({
      ...prev,
      projetsSection: { ...prev.projetsSection, projets: newProjets }
    }));
  };

  const addProjet = () => {
    const newProjet = {
      nom: '',
      localisation: '',
      partenariat: '',
      description: '',
      caracteristiques: [],
      order: content.projetsSection.projets.length + 1
    };
    setContent(prev => ({
      ...prev,
      projetsSection: {
        ...prev.projetsSection,
        projets: [...prev.projetsSection.projets, newProjet]
      }
    }));
  };

  const removeProjet = (index) => {
    if (window.confirm('Supprimer ce projet ?')) {
      const newProjets = content.projetsSection.projets.filter((_, i) => i !== index);
      newProjets.forEach((projet, i) => { projet.order = i + 1; });
      setContent(prev => ({
        ...prev,
        projetsSection: { ...prev.projetsSection, projets: newProjets }
      }));
    }
  };

  const handleNouveauProjetChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      nouveauProjet: { ...prev.nouveauProjet, [field]: value }
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
      const response = await fetch(`${API_URL}/api/promoteur-content/${content._id}`, {
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
        <h1>Gestion du Contenu - Page Promoteur</h1>
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
                  placeholder="Ex: KONGO IMMOBILIER"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Le partenaire de confiance..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Mission */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('mission')}>
            <h2>Section Mission</h2>
            {expandedSections.mission ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.mission && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.mission.title}
                  onChange={(e) => handleMissionChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Premier paragraphe</label>
                <textarea
                  value={content.mission.leadParagraph}
                  onChange={(e) => handleMissionChange('leadParagraph', e.target.value)}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Paragraphe en surbrillance (mission principale)</label>
                <textarea
                  value={content.mission.highlightParagraph}
                  onChange={(e) => handleMissionChange('highlightParagraph', e.target.value)}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Paragraphe de description</label>
                <textarea
                  value={content.mission.descriptionParagraph}
                  onChange={(e) => handleMissionChange('descriptionParagraph', e.target.value)}
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

        {/* Section Statistiques */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('stats')}>
            <h2>Statistiques ({content.stats.length})</h2>
            {expandedSections.stats ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.stats && (
            <div className="section-body">
              {content.stats.sort((a, b) => a.order - b.order).map((stat, index) => (
                <div key={index} className="item-card">
                  <div className="item-header">
                    <h3>Statistique {index + 1}</h3>
                    <button className="btn-delete" onClick={() => removeStat(index)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Valeur (nombre)</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                        placeholder="Ex: Projets Réalisés"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-add" onClick={addStat}>
                <FaPlus /> Ajouter une statistique
              </button>
            </div>
          )}
        </div>

        {/* Section Valeurs */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('valeurs')}>
            <h2>Nos Valeurs ({content.valeurs.length})</h2>
            {expandedSections.valeurs ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.valeurs && (
            <div className="section-body">
              {content.valeurs.sort((a, b) => a.order - b.order).map((valeur, index) => (
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

        {/* Section Projets Réalisés */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('projets')}>
            <h2>Projets Emblématiques ({content.projetsSection.projets.length})</h2>
            {expandedSections.projets ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.projets && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.projetsSection.title}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    projetsSection: { ...prev.projetsSection, title: e.target.value }
                  }))}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre de la section</label>
                <textarea
                  value={content.projetsSection.subtitle}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    projetsSection: { ...prev.projetsSection, subtitle: e.target.value }
                  }))}
                  rows="2"
                />
              </div>

              {content.projetsSection.projets.sort((a, b) => a.order - b.order).map((projet, pIndex) => (
                <div key={pIndex} className="item-card projet-card">
                  <div className="item-header">
                    <h3>Projet {pIndex + 1}</h3>
                    <button className="btn-delete" onClick={() => removeProjet(pIndex)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Nom du projet</label>
                    <input
                      type="text"
                      value={projet.nom}
                      onChange={(e) => handleProjetChange(pIndex, 'nom', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Localisation</label>
                      <input
                        type="text"
                        value={projet.localisation}
                        onChange={(e) => handleProjetChange(pIndex, 'localisation', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Partenariat (optionnel)</label>
                      <input
                        type="text"
                        value={projet.partenariat || ''}
                        onChange={(e) => handleProjetChange(pIndex, 'partenariat', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={projet.description}
                      onChange={(e) => handleProjetChange(pIndex, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                  <div className="form-group">
                    <label>Caractéristiques</label>
                    {projet.caracteristiques.map((carac, cIndex) => (
                      <div key={cIndex} className="caracteristique-row">
                        <input
                          type="text"
                          value={carac}
                          onChange={(e) => handleCaracteristiqueChange(pIndex, cIndex, e.target.value)}
                          placeholder="Ex: 8 locaux commerciaux"
                        />
                        <button
                          className="btn-delete-small"
                          onClick={() => removeCaracteristique(pIndex, cIndex)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => addCaracteristique(pIndex)}
                    >
                      <FaPlus /> Ajouter une caractéristique
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-add" onClick={addProjet}>
                <FaPlus /> Ajouter un projet
              </button>
            </div>
          )}
        </div>

        {/* Section Nouveau Projet */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('nouveauProjet')}>
            <h2>Nouveau Projet (Cité KONGO)</h2>
            {expandedSections.nouveauProjet ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.nouveauProjet && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.nouveauProjet.sectionTitle}
                  onChange={(e) => handleNouveauProjetChange('sectionTitle', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Nom du projet</label>
                <input
                  type="text"
                  value={content.nouveauProjet.nom}
                  onChange={(e) => handleNouveauProjetChange('nom', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Localisation</label>
                <input
                  type="text"
                  value={content.nouveauProjet.localisation}
                  onChange={(e) => handleNouveauProjetChange('localisation', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.nouveauProjet.description}
                  onChange={(e) => handleNouveauProjetChange('description', e.target.value)}
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
                <label>Description</label>
                <input
                  type="text"
                  value={content.contact.description}
                  onChange={(e) => handleContactChange('description', e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    value={content.contact.telephone}
                    onChange={(e) => handleContactChange('telephone', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  value={content.contact.adresse}
                  onChange={(e) => handleContactChange('adresse', e.target.value)}
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

export default PromoteurAdmin;
