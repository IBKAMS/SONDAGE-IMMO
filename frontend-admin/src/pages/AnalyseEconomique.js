import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const AnalyseEconomiqueAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    intro: false,
    video: false,
    urbanisation: false,
    portBouet: false,
    abekan: false,
    pestel: false,
    marche: false,
    conclusion: false
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/analyse-economique-content`);
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

  const handleIntroChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      introSection: { ...prev.introSection, [field]: value }
    }));
  };

  const handleIntroHighlightChange = (index, value) => {
    const newItems = [...content.introSection.highlightItems];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      introSection: { ...prev.introSection, highlightItems: newItems }
    }));
  };

  const handleIntroPndChange = (index, value) => {
    const newItems = [...content.introSection.pndItems];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      introSection: { ...prev.introSection, pndItems: newItems }
    }));
  };

  const handleVideoChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      videoSection: { ...prev.videoSection, [field]: value }
    }));
  };

  const handleUrbanisationChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      urbanisationSection: { ...prev.urbanisationSection, [field]: value }
    }));
  };

  const handleUrbanisationDeficitChange = (index, value) => {
    const newItems = [...content.urbanisationSection.deficitItems];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      urbanisationSection: { ...prev.urbanisationSection, deficitItems: newItems }
    }));
  };

  const handlePortBouetChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      portBouetSection: { ...prev.portBouetSection, [field]: value }
    }));
  };

  const handleAbekanChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      abekanSection: { ...prev.abekanSection, [field]: value }
    }));
  };

  const handleAbekanCaracChange = (index, value) => {
    const newItems = [...content.abekanSection.caracItems];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      abekanSection: { ...prev.abekanSection, caracItems: newItems }
    }));
  };

  const handleAbekanDemandeChange = (index, value) => {
    const newItems = [...content.abekanSection.demandeItems];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      abekanSection: { ...prev.abekanSection, demandeItems: newItems }
    }));
  };

  const handlePestelChange = (category, index, value) => {
    const fieldName = `${category}Items`;
    const newItems = [...content.pestelSection[fieldName]];
    newItems[index] = value;
    setContent(prev => ({
      ...prev,
      pestelSection: { ...prev.pestelSection, [fieldName]: newItems }
    }));
  };

  const handleMarcheChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      marcheSection: { ...prev.marcheSection, [field]: value }
    }));
  };

  const handleConclusionChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      conclusionSection: { ...prev.conclusionSection, [field]: value }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/analyse-economique-content/${content._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      const data = await response.json();
      if (data.success) {
        // Mettre à jour immédiatement avec les données retournées par le backend
        setContent(data.data);
        alert('Contenu enregistré avec succès!');
        // Attendre un peu pour que l'utilisateur voie le changement
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
        <h1>Gestion du Contenu - Analyse Économique</h1>
        <div className="header-actions">
          <button
            className="btn-reset"
            onClick={handleReset}
            disabled={saving}
          >
            <FaUndo /> Annuler
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            <FaSave /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
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
                  placeholder="Ex: Analyse Économique"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Étude du contexte économique ivoirien..."
                  rows="2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Introduction */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('intro')}>
            <h2>Section Introduction (Dynamisme économique)</h2>
            {expandedSections.intro ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.intro && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.introSection.title}
                  onChange={(e) => handleIntroChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Paragraphe 1</label>
                <textarea
                  value={content.introSection.paragraph1}
                  onChange={(e) => handleIntroChange('paragraph1', e.target.value)}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Paragraphe 2</label>
                <textarea
                  value={content.introSection.paragraph2}
                  onChange={(e) => handleIntroChange('paragraph2', e.target.value)}
                  rows="4"
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Indicateurs macroéconomiques</h3>

                <div className="form-group">
                  <label>Titre de l'encadré</label>
                  <input
                    type="text"
                    value={content.introSection.highlightTitle}
                    onChange={(e) => handleIntroChange('highlightTitle', e.target.value)}
                  />
                </div>

                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="form-group">
                    <label>Indicateur {index + 1}</label>
                    <input
                      type="text"
                      value={content.introSection.highlightItems[index]}
                      onChange={(e) => handleIntroHighlightChange(index, e.target.value)}
                      placeholder={`Ex: Croissance PIB 2023 : +6,2 %`}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Paragraphe 3</label>
                <textarea
                  value={content.introSection.paragraph3}
                  onChange={(e) => handleIntroChange('paragraph3', e.target.value)}
                  rows="4"
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Plan National de Développement (PND)</h3>

                <div className="form-group">
                  <label>Titre PND</label>
                  <input
                    type="text"
                    value={content.introSection.pndTitle}
                    onChange={(e) => handleIntroChange('pndTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description PND</label>
                  <textarea
                    value={content.introSection.pndDescription}
                    onChange={(e) => handleIntroChange('pndDescription', e.target.value)}
                    rows="3"
                  />
                </div>

                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="form-group">
                    <label>Point PND {index + 1}</label>
                    <input
                      type="text"
                      value={content.introSection.pndItems[index]}
                      onChange={(e) => handleIntroPndChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section Vidéo */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('video')}>
            <h2>Section Vidéo</h2>
            {expandedSections.video ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.video && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.videoSection.title}
                  onChange={(e) => handleVideoChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <textarea
                  value={content.videoSection.subtitle}
                  onChange={(e) => handleVideoChange('subtitle', e.target.value)}
                  rows="2"
                />
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                Note: La vidéo elle-même est gérée dans la section "Vidéos" du menu
              </p>
            </div>
          )}
        </div>

        {/* Section Urbanisation */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('urbanisation')}>
            <h2>Section Urbanisation d'Abidjan</h2>
            {expandedSections.urbanisation ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.urbanisation && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.urbanisationSection.title}
                  onChange={(e) => handleUrbanisationChange('title', e.target.value)}
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Statistiques principales</h3>

                <div className="form-group">
                  <label>Statistique 1 - Valeur</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat1Value}
                    onChange={(e) => handleUrbanisationChange('stat1Value', e.target.value)}
                    placeholder="Ex: 6,32 M"
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 1 - Libellé</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat1Label}
                    onChange={(e) => handleUrbanisationChange('stat1Label', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 1 - Évolution</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat1Evolution}
                    onChange={(e) => handleUrbanisationChange('stat1Evolution', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Statistique 2 - Valeur</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat2Value}
                    onChange={(e) => handleUrbanisationChange('stat2Value', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 2 - Libellé</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat2Label}
                    onChange={(e) => handleUrbanisationChange('stat2Label', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 2 - Évolution</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat2Evolution}
                    onChange={(e) => handleUrbanisationChange('stat2Evolution', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Statistique 3 - Valeur</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat3Value}
                    onChange={(e) => handleUrbanisationChange('stat3Value', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 3 - Libellé</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat3Label}
                    onChange={(e) => handleUrbanisationChange('stat3Label', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Statistique 3 - Évolution</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.stat3Evolution}
                    onChange={(e) => handleUrbanisationChange('stat3Evolution', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Paragraphe 1</label>
                <textarea
                  value={content.urbanisationSection.paragraph1}
                  onChange={(e) => handleUrbanisationChange('paragraph1', e.target.value)}
                  rows="4"
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#856404' }}>Déficit de logements</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.urbanisationSection.deficitTitle}
                    onChange={(e) => handleUrbanisationChange('deficitTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Paragraphe</label>
                  <textarea
                    value={content.urbanisationSection.deficitParagraph}
                    onChange={(e) => handleUrbanisationChange('deficitParagraph', e.target.value)}
                    rows="3"
                  />
                </div>

                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="form-group">
                    <label>Point {index + 1}</label>
                    <input
                      type="text"
                      value={content.urbanisationSection.deficitItems[index]}
                      onChange={(e) => handleUrbanisationDeficitChange(index, e.target.value)}
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label>Phrase de conclusion en surbrillance</label>
                  <textarea
                    value={content.urbanisationSection.deficitHighlight}
                    onChange={(e) => handleUrbanisationChange('deficitHighlight', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Paragraphe 2</label>
                <textarea
                  value={content.urbanisationSection.paragraph2}
                  onChange={(e) => handleUrbanisationChange('paragraph2', e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Port-Bouët */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('portBouet')}>
            <h2>Section Port-Bouët</h2>
            {expandedSections.portBouet ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.portBouet && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.portBouetSection.title}
                  onChange={(e) => handlePortBouetChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Paragraphe d'introduction</label>
                <textarea
                  value={content.portBouetSection.leadParagraph}
                  onChange={(e) => handlePortBouetChange('leadParagraph', e.target.value)}
                  rows="4"
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Évolution démographique</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demoTitle}
                    onChange={(e) => handlePortBouetChange('demoTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Année 1</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo1Year}
                    onChange={(e) => handlePortBouetChange('demo1Year', e.target.value)}
                    placeholder="Ex: 1998"
                  />
                </div>
                <div className="form-group">
                  <label>Valeur 1</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo1Value}
                    onChange={(e) => handlePortBouetChange('demo1Value', e.target.value)}
                    placeholder="Ex: 212 000 hab."
                  />
                </div>

                <div className="form-group">
                  <label>Année 2</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo2Year}
                    onChange={(e) => handlePortBouetChange('demo2Year', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Valeur 2</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo2Value}
                    onChange={(e) => handlePortBouetChange('demo2Value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Année 3</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo3Year}
                    onChange={(e) => handlePortBouetChange('demo3Year', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Valeur 3</label>
                  <input
                    type="text"
                    value={content.portBouetSection.demo3Value}
                    onChange={(e) => handlePortBouetChange('demo3Value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Taux de croissance</label>
                  <textarea
                    value={content.portBouetSection.demoGrowthRate}
                    onChange={(e) => handlePortBouetChange('demoGrowthRate', e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Atouts stratégiques</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.portBouetSection.atoutsTitle}
                    onChange={(e) => handlePortBouetChange('atoutsTitle', e.target.value)}
                  />
                </div>

                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
                    <div className="form-group">
                      <label>Atout {num} - Titre</label>
                      <input
                        type="text"
                        value={content.portBouetSection[`atout${num}Title`]}
                        onChange={(e) => handlePortBouetChange(`atout${num}Title`, e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Atout {num} - Description</label>
                      <textarea
                        value={content.portBouetSection[`atout${num}Description`]}
                        onChange={(e) => handlePortBouetChange(`atout${num}Description`, e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section Abékan Bernard */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('abekan')}>
            <h2>Section Abékan Bernard</h2>
            {expandedSections.abekan ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.abekan && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.abekanSection.title}
                  onChange={(e) => handleAbekanChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Paragraphe d'introduction</label>
                <textarea
                  value={content.abekanSection.leadParagraph}
                  onChange={(e) => handleAbekanChange('leadParagraph', e.target.value)}
                  rows="4"
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Caractéristiques</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.abekanSection.caracTitle}
                    onChange={(e) => handleAbekanChange('caracTitle', e.target.value)}
                  />
                </div>

                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="form-group">
                    <label>Caractéristique {index + 1}</label>
                    <input
                      type="text"
                      value={content.abekanSection.caracItems[index]}
                      onChange={(e) => handleAbekanCaracChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Position stratégique</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.abekanSection.positionTitle}
                    onChange={(e) => handleAbekanChange('positionTitle', e.target.value)}
                  />
                </div>

                {[1, 2, 3, 4].map((num) => (
                  <div key={num} style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
                    <div className="form-group">
                      <label>Position {num} - Titre</label>
                      <input
                        type="text"
                        value={content.abekanSection[`position${num}Title`]}
                        onChange={(e) => handleAbekanChange(`position${num}Title`, e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Position {num} - Description</label>
                      <textarea
                        value={content.abekanSection[`position${num}Description`]}
                        onChange={(e) => handleAbekanChange(`position${num}Description`, e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#856404' }}>Demande locale</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.abekanSection.demandeTitle}
                    onChange={(e) => handleAbekanChange('demandeTitle', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Paragraphe</label>
                  <textarea
                    value={content.abekanSection.demandeParagraph}
                    onChange={(e) => handleAbekanChange('demandeParagraph', e.target.value)}
                    rows="3"
                  />
                </div>

                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="form-group">
                    <label>Point {index + 1}</label>
                    <input
                      type="text"
                      value={content.abekanSection.demandeItems[index]}
                      onChange={(e) => handleAbekanDemandeChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section PESTEL */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('pestel')}>
            <h2>Section PESTEL</h2>
            {expandedSections.pestel ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.pestel && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.pestelSection.title}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    pestelSection: { ...prev.pestelSection, title: e.target.value }
                  }))}
                />
              </div>

              {[
                { key: 'politique', label: 'Politique', icon: '🏛️' },
                { key: 'economique', label: 'Économique', icon: '💰' },
                { key: 'socioculturel', label: 'Socioculturel', icon: '👥' },
                { key: 'technologique', label: 'Technologique', icon: '💻' },
                { key: 'environnemental', label: 'Environnemental', icon: '🌍' },
                { key: 'legal', label: 'Légal', icon: '⚖️' }
              ].map(({ key, label, icon }) => (
                <div key={key} style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>{icon} {label}</h3>

                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="form-group">
                      <label>Point {index + 1}</label>
                      <input
                        type="text"
                        value={content.pestelSection[`${key}Items`][index]}
                        onChange={(e) => handlePestelChange(key, index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Marché */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('marche')}>
            <h2>Section Marché Immobilier</h2>
            {expandedSections.marche ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.marche && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.marcheSection.title}
                  onChange={(e) => handleMarcheChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Titre coûts de construction</label>
                <input
                  type="text"
                  value={content.marcheSection.coutsTitle}
                  onChange={(e) => handleMarcheChange('coutsTitle', e.target.value)}
                />
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Coût 1 - Logement économique</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout1Title}
                    onChange={(e) => handleMarcheChange('cout1Title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Valeur</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout1Value}
                    onChange={(e) => handleMarcheChange('cout1Value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout1Description}
                    onChange={(e) => handleMarcheChange('cout1Description', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Coût 2 - Logement moyen</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout2Title}
                    onChange={(e) => handleMarcheChange('cout2Title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Valeur</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout2Value}
                    onChange={(e) => handleMarcheChange('cout2Value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout2Description}
                    onChange={(e) => handleMarcheChange('cout2Description', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Coût 3 - Haut de gamme</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout3Title}
                    onChange={(e) => handleMarcheChange('cout3Title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Valeur</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout3Value}
                    onChange={(e) => handleMarcheChange('cout3Value', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={content.marcheSection.cout3Description}
                    onChange={(e) => handleMarcheChange('cout3Description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Conclusion */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('conclusion')}>
            <h2>Section Conclusion</h2>
            {expandedSections.conclusion ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.conclusion && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.conclusionSection.title}
                  onChange={(e) => handleConclusionChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Paragraphe d'introduction</label>
                <textarea
                  value={content.conclusionSection.leadParagraph}
                  onChange={(e) => handleConclusionChange('leadParagraph', e.target.value)}
                  rows="3"
                />
              </div>

              {[1, 2, 3, 4].map((num) => (
                <div key={num} style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Point {num}</h3>

                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.conclusionSection[`point${num}Title`]}
                      onChange={(e) => handleConclusionChange(`point${num}Title`, e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.conclusionSection[`point${num}Description`]}
                      onChange={(e) => handleConclusionChange(`point${num}Description`, e.target.value)}
                      rows="3"
                    />
                  </div>
                </div>
              ))}

              <div className="form-group">
                <label>Déclaration finale 1</label>
                <textarea
                  value={content.conclusionSection.finalStatement1}
                  onChange={(e) => handleConclusionChange('finalStatement1', e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Déclaration finale 2 (en surbrillance)</label>
                <textarea
                  value={content.conclusionSection.finalStatement2}
                  onChange={(e) => handleConclusionChange('finalStatement2', e.target.value)}
                  rows="2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons fixes en bas */}
      <div className="fixed-footer">
        <button
          className="btn-reset"
          onClick={handleReset}
          disabled={saving}
        >
          <FaUndo /> Annuler les modifications
        </button>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Enregistrement en cours...' : 'Enregistrer toutes les modifications'}
        </button>
      </div>
    </div>
  );
};

export default AnalyseEconomiqueAdmin;
