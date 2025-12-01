import React, { useState, useEffect } from 'react';
import {
  FaSave, FaUndo, FaChevronDown, FaChevronUp, FaPlus, FaTrash,
  FaEdit, FaGripVertical, FaToggleOn, FaToggleOff, FaQuestionCircle,
  FaSlidersH, FaListUl, FaCheckSquare, FaFont, FaEnvelope, FaPhone,
  FaCalendarAlt, FaAlignLeft, FaSortNumericDown
} from 'react-icons/fa';
import API_URL from '../config';
import './QuestionnaireAdmin.css';

const QUESTION_TYPES = [
  { value: 'text', label: 'Texte', icon: <FaFont /> },
  { value: 'email', label: 'Email', icon: <FaEnvelope /> },
  { value: 'tel', label: 'Téléphone', icon: <FaPhone /> },
  { value: 'date', label: 'Date', icon: <FaCalendarAlt /> },
  { value: 'select', label: 'Liste déroulante', icon: <FaListUl /> },
  { value: 'radio', label: 'Boutons radio', icon: <FaCheckSquare /> },
  { value: 'checkbox', label: 'Cases à cocher', icon: <FaCheckSquare /> },
  { value: 'range', label: 'Curseur (Slider)', icon: <FaSlidersH /> },
  { value: 'textarea', label: 'Zone de texte', icon: <FaAlignLeft /> },
  { value: 'ranking', label: 'Classement', icon: <FaSortNumericDown /> }
];

const QuestionnaireAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [editingStep, setEditingStep] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/questionnaire-content`);
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
        // Ouvrir la première étape par défaut
        if (data.data.steps && data.data.steps.length > 0) {
          setExpandedSteps({ 0: true });
        }
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
      alert('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepIndex) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const toggleQuestion = (stepIndex, questionIndex) => {
    const key = `${stepIndex}-${questionIndex}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Gestion du titre général
  const handleTitleChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  // Gestion des étapes
  const handleStepChange = (stepIndex, field, value) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value };
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const newStep = {
      title: 'Nouvelle Étape',
      icon: '📋',
      description: '',
      order: content.steps.length,
      isActive: true,
      questions: []
    };
    setContent(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    // Ouvrir la nouvelle étape
    setExpandedSteps(prev => ({
      ...prev,
      [content.steps.length]: true
    }));
  };

  const deleteStep = (stepIndex) => {
    if (!window.confirm(`Supprimer l'étape "${content.steps[stepIndex].title}" et toutes ses questions ?`)) return;

    const newSteps = content.steps.filter((_, index) => index !== stepIndex);
    // Réordonner
    newSteps.forEach((step, index) => {
      step.order = index;
    });
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const toggleStepActive = (stepIndex) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].isActive = !newSteps[stepIndex].isActive;
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  // Gestion des questions
  const handleQuestionChange = (stepIndex, questionIndex, field, value) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions[questionIndex] = {
      ...newSteps[stepIndex].questions[questionIndex],
      [field]: value
    };
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const addQuestion = (stepIndex) => {
    const newQuestion = {
      name: `question_${Date.now()}`,
      label: 'Nouvelle Question',
      type: 'text',
      required: false,
      tooltip: '',
      placeholder: '',
      options: [],
      order: content.steps[stepIndex].questions.length,
      isActive: true
    };
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions.push(newQuestion);
    setContent(prev => ({ ...prev, steps: newSteps }));

    // Ouvrir la nouvelle question
    const key = `${stepIndex}-${newSteps[stepIndex].questions.length - 1}`;
    setExpandedQuestions(prev => ({ ...prev, [key]: true }));
  };

  const deleteQuestion = (stepIndex, questionIndex) => {
    const question = content.steps[stepIndex].questions[questionIndex];
    if (!window.confirm(`Supprimer la question "${question.label}" ?`)) return;

    const newSteps = [...content.steps];
    newSteps[stepIndex].questions = newSteps[stepIndex].questions.filter((_, index) => index !== questionIndex);
    // Réordonner
    newSteps[stepIndex].questions.forEach((q, index) => {
      q.order = index;
    });
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const toggleQuestionRequired = (stepIndex, questionIndex) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions[questionIndex].required = !newSteps[stepIndex].questions[questionIndex].required;
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const toggleQuestionActive = (stepIndex, questionIndex) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions[questionIndex].isActive = !newSteps[stepIndex].questions[questionIndex].isActive;
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  // Gestion des options
  const addOption = (stepIndex, questionIndex) => {
    const newSteps = [...content.steps];
    const question = newSteps[stepIndex].questions[questionIndex];
    if (!question.options) question.options = [];
    question.options.push({
      value: `option_${question.options.length + 1}`,
      label: `Option ${question.options.length + 1}`,
      order: question.options.length
    });
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const handleOptionChange = (stepIndex, questionIndex, optionIndex, field, value) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions[questionIndex].options[optionIndex][field] = value;
    // Si on change le label, mettre à jour aussi la value
    if (field === 'label') {
      newSteps[stepIndex].questions[questionIndex].options[optionIndex].value = value;
    }
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const deleteOption = (stepIndex, questionIndex, optionIndex) => {
    const newSteps = [...content.steps];
    newSteps[stepIndex].questions[questionIndex].options =
      newSteps[stepIndex].questions[questionIndex].options.filter((_, index) => index !== optionIndex);
    // Réordonner
    newSteps[stepIndex].questions[questionIndex].options.forEach((opt, index) => {
      opt.order = index;
    });
    setContent(prev => ({ ...prev, steps: newSteps }));
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications du questionnaire ?')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/questionnaire-content/${content._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        alert('Questionnaire enregistré avec succès!');
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

  const handleResetToDefault = async () => {
    if (!window.confirm('Réinitialiser le questionnaire aux valeurs par défaut ? Toutes vos modifications seront perdues.')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/questionnaire-content/${content._id}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        alert('Questionnaire réinitialisé aux valeurs par défaut!');
      } else {
        alert('Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      alert('Erreur lors de la réinitialisation');
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type) => {
    const typeObj = QUESTION_TYPES.find(t => t.value === type);
    return typeObj ? typeObj.icon : <FaQuestionCircle />;
  };

  const needsOptions = (type) => {
    return ['select', 'radio', 'checkbox', 'ranking'].includes(type);
  };

  const needsRangeConfig = (type) => {
    return type === 'range';
  };

  if (loading) {
    return (
      <div className="questionnaire-admin-page">
        <div className="loading">Chargement du questionnaire...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="questionnaire-admin-page">
        <div className="error">Erreur: Aucun contenu trouvé</div>
      </div>
    );
  }

  return (
    <div className="questionnaire-admin-page">
      <div className="questionnaire-header">
        <h1>Gestion du Questionnaire</h1>
        <div className="header-actions">
          <button
            className="btn-reset-default"
            onClick={handleResetToDefault}
            disabled={saving}
            title="Réinitialiser aux valeurs par défaut"
          >
            Réinitialiser
          </button>
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

      <div className="questionnaire-content">
        {/* Section Titre */}
        <div className="content-section title-section">
          <h2>Configuration Générale</h2>
          <div className="section-body">
            <div className="form-group">
              <label>Titre du questionnaire</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleTitleChange('title', e.target.value)}
                placeholder="Titre du questionnaire"
              />
            </div>
            <div className="form-group">
              <label>Sous-titre</label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => handleTitleChange('subtitle', e.target.value)}
                placeholder="Sous-titre affiché"
              />
            </div>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="steps-header">
          <h2>Étapes du Questionnaire ({content.steps?.length || 0})</h2>
          <button className="btn-add-step" onClick={addStep}>
            <FaPlus /> Ajouter une étape
          </button>
        </div>

        {content.steps && content.steps.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className={`content-section step-section ${!step.isActive ? 'inactive' : ''}`}
          >
            <div className="section-header" onClick={() => toggleStep(stepIndex)}>
              <div className="step-info">
                <span className="step-icon">{step.icon}</span>
                <h3>Étape {stepIndex + 1}: {step.title}</h3>
                <span className="question-count">
                  ({step.questions?.length || 0} questions)
                </span>
                {!step.isActive && <span className="inactive-badge">Désactivée</span>}
              </div>
              <div className="step-actions">
                <button
                  className={`btn-toggle ${step.isActive ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleStepActive(stepIndex); }}
                  title={step.isActive ? 'Désactiver' : 'Activer'}
                >
                  {step.isActive ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.stopPropagation(); deleteStep(stepIndex); }}
                  title="Supprimer l'étape"
                >
                  <FaTrash />
                </button>
                {expandedSteps[stepIndex] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedSteps[stepIndex] && (
              <div className="section-body">
                {/* Configuration de l'étape */}
                <div className="step-config">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Titre de l'étape</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group small">
                      <label>Icône (emoji)</label>
                      <input
                        type="text"
                        value={step.icon}
                        onChange={(e) => handleStepChange(stepIndex, 'icon', e.target.value)}
                        maxLength="2"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description (optionnel)</label>
                    <input
                      type="text"
                      value={step.description || ''}
                      onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                      placeholder="Description affichée sous le titre"
                    />
                  </div>
                </div>

                {/* Questions de l'étape */}
                <div className="questions-container">
                  <div className="questions-header">
                    <h4>Questions</h4>
                    <button className="btn-add-question" onClick={() => addQuestion(stepIndex)}>
                      <FaPlus /> Ajouter une question
                    </button>
                  </div>

                  {step.questions && step.questions.map((question, questionIndex) => (
                    <div
                      key={questionIndex}
                      className={`question-item ${!question.isActive ? 'inactive' : ''}`}
                    >
                      <div
                        className="question-header"
                        onClick={() => toggleQuestion(stepIndex, questionIndex)}
                      >
                        <div className="question-info">
                          <span className="question-type-icon">{getTypeIcon(question.type)}</span>
                          <span className="question-label">{question.label}</span>
                          {question.required && <span className="required-badge">Requis</span>}
                          {!question.isActive && <span className="inactive-badge">Désactivée</span>}
                        </div>
                        <div className="question-actions">
                          <button
                            className={`btn-toggle-sm ${question.required ? 'required' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleQuestionRequired(stepIndex, questionIndex); }}
                            title={question.required ? 'Rendre optionnel' : 'Rendre obligatoire'}
                          >
                            *
                          </button>
                          <button
                            className={`btn-toggle-sm ${question.isActive ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleQuestionActive(stepIndex, questionIndex); }}
                            title={question.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {question.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            className="btn-delete-sm"
                            onClick={(e) => { e.stopPropagation(); deleteQuestion(stepIndex, questionIndex); }}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                          {expandedQuestions[`${stepIndex}-${questionIndex}`] ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>

                      {expandedQuestions[`${stepIndex}-${questionIndex}`] && (
                        <div className="question-body">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Label de la question</label>
                              <input
                                type="text"
                                value={question.label}
                                onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'label', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Nom technique</label>
                              <input
                                type="text"
                                value={question.name}
                                onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'name', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Type de question</label>
                              <select
                                value={question.type}
                                onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'type', e.target.value)}
                              >
                                {QUESTION_TYPES.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Placeholder</label>
                              <input
                                type="text"
                                value={question.placeholder || ''}
                                onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'placeholder', e.target.value)}
                                placeholder="Texte d'aide"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Info-bulle (tooltip)</label>
                            <textarea
                              value={question.tooltip || ''}
                              onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'tooltip', e.target.value)}
                              placeholder="Information complémentaire affichée au survol"
                              rows="2"
                            />
                          </div>

                          {/* Configuration du range/slider */}
                          {needsRangeConfig(question.type) && (
                            <div className="range-config">
                              <h5>Configuration du curseur</h5>
                              <div className="form-row triple">
                                <div className="form-group">
                                  <label>Minimum</label>
                                  <input
                                    type="number"
                                    value={question.min || 0}
                                    onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'min', parseInt(e.target.value))}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Maximum</label>
                                  <input
                                    type="number"
                                    value={question.max || 100}
                                    onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'max', parseInt(e.target.value))}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Pas</label>
                                  <input
                                    type="number"
                                    value={question.step || 1}
                                    onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'step', parseInt(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Configuration du ranking */}
                          {question.type === 'ranking' && (
                            <div className="form-group">
                              <label>Nombre maximum de sélections</label>
                              <input
                                type="number"
                                value={question.maxSelections || 3}
                                onChange={(e) => handleQuestionChange(stepIndex, questionIndex, 'maxSelections', parseInt(e.target.value))}
                                min="1"
                                max="10"
                              />
                            </div>
                          )}

                          {/* Options pour les types qui en ont besoin */}
                          {needsOptions(question.type) && (
                            <div className="options-config">
                              <div className="options-header">
                                <h5>Options ({question.options?.length || 0})</h5>
                                <button
                                  className="btn-add-option"
                                  onClick={() => addOption(stepIndex, questionIndex)}
                                >
                                  <FaPlus /> Ajouter
                                </button>
                              </div>
                              <div className="options-list">
                                {question.options && question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="option-item">
                                    <FaGripVertical className="drag-handle" />
                                    <input
                                      type="text"
                                      value={option.label}
                                      onChange={(e) => handleOptionChange(stepIndex, questionIndex, optionIndex, 'label', e.target.value)}
                                      placeholder="Texte de l'option"
                                    />
                                    <button
                                      className="btn-delete-option"
                                      onClick={() => deleteOption(stepIndex, questionIndex, optionIndex)}
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                ))}
                                {(!question.options || question.options.length === 0) && (
                                  <p className="no-options">Aucune option. Cliquez sur "Ajouter" pour créer des options.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {(!step.questions || step.questions.length === 0) && (
                    <p className="no-questions">
                      Aucune question dans cette étape. Cliquez sur "Ajouter une question" pour commencer.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {(!content.steps || content.steps.length === 0) && (
          <div className="no-steps">
            <p>Aucune étape dans le questionnaire.</p>
            <button className="btn-add-step" onClick={addStep}>
              <FaPlus /> Créer la première étape
            </button>
          </div>
        )}
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

export default QuestionnaireAdmin;
