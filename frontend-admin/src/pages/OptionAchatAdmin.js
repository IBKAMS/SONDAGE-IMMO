import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const OptionAchatAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    cta: false,
    financement: false,
    avantages: false,
    timeline: false,
    faq: false
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/option-achat-content`);
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

  const handleCtaChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      ctaSection: { ...prev.ctaSection, [field]: value }
    }));
  };

  const handleFinancementChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      financementSection: { ...prev.financementSection, [field]: value }
    }));
  };

  const handleOptionChange = (optionNum, field, value) => {
    const optionKey = `option${optionNum}`;
    setContent(prev => ({
      ...prev,
      financementSection: {
        ...prev.financementSection,
        [optionKey]: {
          ...prev.financementSection[optionKey],
          [field]: value
        }
      }
    }));
  };

  const handleAvantagesChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      avantagesSection: { ...prev.avantagesSection, [field]: value }
    }));
  };

  const handleAvantageChange = (avantageNum, field, value) => {
    const avantageKey = `avantage${avantageNum}`;
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

  const handleTimelineChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      timelineSection: { ...prev.timelineSection, [field]: value }
    }));
  };

  const handlePhaseChange = (phaseNum, field, value) => {
    const phaseKey = `phase${phaseNum}`;
    setContent(prev => ({
      ...prev,
      timelineSection: {
        ...prev.timelineSection,
        [phaseKey]: {
          ...prev.timelineSection[phaseKey],
          [field]: value
        }
      }
    }));
  };

  const handleFaqChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      faqSection: { ...prev.faqSection, [field]: value }
    }));
  };

  const handleFaqItemChange = (faqNum, field, value) => {
    const faqKey = `faq${faqNum}`;
    setContent(prev => ({
      ...prev,
      faqSection: {
        ...prev.faqSection,
        [faqKey]: {
          ...prev.faqSection[faqKey],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/option-achat-content/${content._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        alert('Contenu enregistré avec succès!');
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
        <h1>Gestion du Contenu - Options d'Achat</h1>
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
                  placeholder="Ex: Options d'Achat"
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <textarea
                  value={content.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  placeholder="Ex: Découvrez nos solutions de financement flexibles..."
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section CTA */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('cta')}>
            <h2>Section CTA (Appel à l'action)</h2>
            {expandedSections.cta ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.cta && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  value={content.ctaSection.title}
                  onChange={(e) => handleCtaChange('title', e.target.value)}
                  placeholder="Ex: Prêt à Concrétiser Votre Projet ?"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={content.ctaSection.description}
                  onChange={(e) => handleCtaChange('description', e.target.value)}
                  placeholder="Ex: Remplissez notre questionnaire personnalisé..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Texte du bouton</label>
                <input
                  type="text"
                  value={content.ctaSection.buttonText}
                  onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                  placeholder="Ex: Commencer le Questionnaire"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Financement */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('financement')}>
            <h2>Section Financement (Solutions de financement)</h2>
            {expandedSections.financement ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.financement && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.financementSection.title}
                  onChange={(e) => handleFinancementChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.financementSection.subtitle}
                  onChange={(e) => handleFinancementChange('subtitle', e.target.value)}
                />
              </div>

              {/* Option 1 */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Option 1 - Paiement Comptant</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.financementSection.option1.titre}
                    onChange={(e) => handleOptionChange(1, 'titre', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.financementSection.option1.description}
                    onChange={(e) => handleOptionChange(1, 'description', e.target.value)}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={content.financementSection.option1.popular}
                      onChange={(e) => handleOptionChange(1, 'popular', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Option populaire
                  </label>
                </div>

                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="form-group">
                    <label>Avantage {num}</label>
                    <input
                      type="text"
                      value={content.financementSection.option1[`avantage${num}`]}
                      onChange={(e) => handleOptionChange(1, `avantage${num}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Option 2 */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Option 2 - Échelonnement Promoteur</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.financementSection.option2.titre}
                    onChange={(e) => handleOptionChange(2, 'titre', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.financementSection.option2.description}
                    onChange={(e) => handleOptionChange(2, 'description', e.target.value)}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={content.financementSection.option2.popular}
                      onChange={(e) => handleOptionChange(2, 'popular', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Option populaire
                  </label>
                </div>

                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="form-group">
                    <label>Avantage {num}</label>
                    <input
                      type="text"
                      value={content.financementSection.option2[`avantage${num}`]}
                      onChange={(e) => handleOptionChange(2, `avantage${num}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Option 3 */}
              <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '15px', color: '#856404' }}>Option 3 - Financement Bancaire</h3>

                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={content.financementSection.option3.titre}
                    onChange={(e) => handleOptionChange(3, 'titre', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={content.financementSection.option3.description}
                    onChange={(e) => handleOptionChange(3, 'description', e.target.value)}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={content.financementSection.option3.popular}
                      onChange={(e) => handleOptionChange(3, 'popular', e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Option populaire
                  </label>
                </div>

                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="form-group">
                    <label>Avantage {num}</label>
                    <input
                      type="text"
                      value={content.financementSection.option3[`avantage${num}`]}
                      onChange={(e) => handleOptionChange(3, `avantage${num}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section Avantages */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('avantages')}>
            <h2>Section Avantages (Pourquoi investir)</h2>
            {expandedSections.avantages ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.avantages && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.avantagesSection.title}
                  onChange={(e) => handleAvantagesChange('title', e.target.value)}
                />
              </div>

              {[1, 2, 3, 4].map((num) => (
                <div key={num} style={{ marginTop: '20px', padding: '15px', background: num % 2 === 0 ? '#e7f3ff' : '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Avantage {num}</h3>

                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.avantagesSection[`avantage${num}`].titre}
                      onChange={(e) => handleAvantageChange(num, 'titre', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.avantagesSection[`avantage${num}`].description}
                      onChange={(e) => handleAvantageChange(num, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Timeline */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('timeline')}>
            <h2>Section Timeline (Calendrier du projet)</h2>
            {expandedSections.timeline ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.timeline && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.timelineSection.title}
                  onChange={(e) => handleTimelineChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.timelineSection.subtitle}
                  onChange={(e) => handleTimelineChange('subtitle', e.target.value)}
                />
              </div>

              {[1, 2, 3].map((num) => (
                <div key={num} style={{ marginTop: '20px', padding: '15px', background: num === 2 ? '#e7f3ff' : '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>Phase {num}</h3>

                  <div className="form-group">
                    <label>Phase (label)</label>
                    <input
                      type="text"
                      value={content.timelineSection[`phase${num}`].phase}
                      onChange={(e) => handlePhaseChange(num, 'phase', e.target.value)}
                      placeholder="Ex: Phase Actuelle"
                    />
                  </div>

                  <div className="form-group">
                    <label>Titre</label>
                    <input
                      type="text"
                      value={content.timelineSection[`phase${num}`].titre}
                      onChange={(e) => handlePhaseChange(num, 'titre', e.target.value)}
                      placeholder="Ex: Commercialisation"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="text"
                      value={content.timelineSection[`phase${num}`].date}
                      onChange={(e) => handlePhaseChange(num, 'date', e.target.value)}
                      placeholder="Ex: Novembre 2024"
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <input
                      type="text"
                      value={content.timelineSection[`phase${num}`].statut}
                      onChange={(e) => handlePhaseChange(num, 'statut', e.target.value)}
                      placeholder="Ex: En cours"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={content.timelineSection[`phase${num}`].description}
                      onChange={(e) => handlePhaseChange(num, 'description', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section FAQ */}
        <div className="content-section">
          <div className="section-header" onClick={() => toggleSection('faq')}>
            <h2>Section FAQ (Questions fréquentes)</h2>
            {expandedSections.faq ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {expandedSections.faq && (
            <div className="section-body">
              <div className="form-group">
                <label>Titre de la section</label>
                <input
                  type="text"
                  value={content.faqSection.title}
                  onChange={(e) => handleFaqChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sous-titre</label>
                <input
                  type="text"
                  value={content.faqSection.subtitle}
                  onChange={(e) => handleFaqChange('subtitle', e.target.value)}
                />
              </div>

              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} style={{ marginTop: '20px', padding: '15px', background: num % 2 === 0 ? '#e7f3ff' : '#f8f9fa', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', color: '#1a5490' }}>FAQ {num}</h3>

                  <div className="form-group">
                    <label>Question</label>
                    <textarea
                      value={content.faqSection[`faq${num}`].question}
                      onChange={(e) => handleFaqItemChange(num, 'question', e.target.value)}
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>Réponse</label>
                    <textarea
                      value={content.faqSection[`faq${num}`].answer}
                      onChange={(e) => handleFaqItemChange(num, 'answer', e.target.value)}
                      rows="4"
                    />
                  </div>
                </div>
              ))}
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

export default OptionAchatAdmin;
