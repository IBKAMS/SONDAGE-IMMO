import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaChevronDown, FaChevronUp, FaPlus, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import API_URL from '../config';
import './PromoteurAdmin.css';

const QuestionnaireAdmin = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/questionnaire-content`);
      const data = await response.json();
      if (data.success && data.data) {
        setContent(data.data);
        // Expand first step by default
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

  const toggleStep = (index) => {
    setExpandedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleTitleChange = (value) => {
    setContent(prev => ({ ...prev, title: value }));
  };

  const handleSubtitleChange = (value) => {
    setContent(prev => ({ ...prev, subtitle: value }));
  };

  const handleStepChange = (stepIndex, field, value) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value };
      return { ...prev, steps: newSteps };
    });
  };

  const handleQuestionChange = (stepIndex, questionIndex, field, value) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      const newQuestions = [...newSteps[stepIndex].questions];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], [field]: value };
      newSteps[stepIndex] = { ...newSteps[stepIndex], questions: newQuestions };
      return { ...prev, steps: newSteps };
    });
  };

  const handleOptionChange = (stepIndex, questionIndex, optionIndex, field, value) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      const newQuestions = [...newSteps[stepIndex].questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
      newSteps[stepIndex] = { ...newSteps[stepIndex], questions: newQuestions };
      return { ...prev, steps: newSteps };
    });
  };

  const addOption = (stepIndex, questionIndex) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      const newQuestions = [...newSteps[stepIndex].questions];
      const currentOptions = newQuestions[questionIndex].options || [];
      const newOption = { label: 'Nouvelle option', value: `option_${currentOptions.length + 1}` };
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: [...currentOptions, newOption]
      };
      newSteps[stepIndex] = { ...newSteps[stepIndex], questions: newQuestions };
      return { ...prev, steps: newSteps };
    });
  };

  const removeOption = (stepIndex, questionIndex, optionIndex) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      const newQuestions = [...newSteps[stepIndex].questions];
      const newOptions = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
      newSteps[stepIndex] = { ...newSteps[stepIndex], questions: newQuestions };
      return { ...prev, steps: newSteps };
    });
  };

  const addQuestion = (stepIndex) => {
    setContent(prev => {
      const newSteps = [...prev.steps];
      const currentQuestions = newSteps[stepIndex].questions || [];
      const newQuestion = {
        name: `question_${Date.now()}`,
        label: 'Nouvelle question',
        type: 'text',
        required: false,
        isActive: true,
        order: currentQuestions.length + 1
      };
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        questions: [...currentQuestions, newQuestion]
      };
      return { ...prev, steps: newSteps };
    });
  };

  const removeQuestion = (stepIndex, questionIndex) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    setContent(prev => {
      const newSteps = [...prev.steps];
      const newQuestions = newSteps[stepIndex].questions.filter((_, i) => i !== questionIndex);
      newSteps[stepIndex] = { ...newSteps[stepIndex], questions: newQuestions };
      return { ...prev, steps: newSteps };
    });
  };

  const addStep = () => {
    setContent(prev => {
      const newStepNumber = prev.steps.length + 1;
      const newStep = {
        stepNumber: newStepNumber,
        title: `Nouvelle étape ${newStepNumber}`,
        icon: 'FaQuestion',
        description: '',
        isActive: true,
        questions: []
      };
      return { ...prev, steps: [...prev.steps, newStep] };
    });
  };

  const removeStep = (stepIndex) => {
    if (!window.confirm('Supprimer cette étape et toutes ses questions ?')) return;
    setContent(prev => {
      const newSteps = prev.steps.filter((_, i) => i !== stepIndex);
      // Renumber steps
      newSteps.forEach((step, i) => {
        step.stepNumber = i + 1;
      });
      return { ...prev, steps: newSteps };
    });
  };

  const handleSave = async () => {
    if (!window.confirm('Enregistrer les modifications ?')) return;

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
        alert('Contenu enregistré avec succès!');
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
    if (!window.confirm('Réinitialiser aux valeurs par défaut ? Toutes vos modifications seront perdues.')) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/questionnaire-content/${content._id}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.data);
        alert('Contenu réinitialisé avec succès!');
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

  const getTypeLabel = (type) => {
    const types = {
      'text': 'Texte',
      'email': 'Email',
      'tel': 'Téléphone',
      'date': 'Date',
      'select': 'Liste déroulante',
      'radio': 'Choix unique',
      'checkbox': 'Choix multiple',
      'range': 'Curseur',
      'textarea': 'Zone de texte',
      'ranking': 'Classement'
    };
    return types[type] || type;
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
        <h1>Gestion du Questionnaire</h1>
        <div className="header-actions">
          <button
            className="btn-reset"
            onClick={handleResetToDefault}
            disabled={saving}
            style={{ background: '#ff9800', color: 'white', border: 'none' }}
          >
            Valeurs par défaut
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

      <div className="promoteur-content">
        {/* Configuration générale */}
        <div className="content-section">
          <div className="section-header" style={{ cursor: 'default' }}>
            <h2>Configuration générale</h2>
          </div>
          <div className="section-body">
            <div className="form-group">
              <label>Titre du questionnaire</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Questionnaire"
              />
            </div>
            <div className="form-group">
              <label>Sous-titre</label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => handleSubtitleChange(e.target.value)}
                placeholder="Description du questionnaire"
              />
            </div>
          </div>
        </div>

        {/* Bouton ajouter étape */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={addStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <FaPlus /> Ajouter une étape
          </button>
        </div>

        {/* Étapes du questionnaire */}
        {content.steps && content.steps.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className="content-section"
            style={{
              opacity: step.isActive ? 1 : 0.6,
              background: step.isActive ? 'white' : '#f5f5f5'
            }}
          >
            <div className="section-header" onClick={() => toggleStep(stepIndex)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '1.2rem' }}>Étape {step.stepNumber}</span>
                <h2 style={{ margin: 0 }}>{step.title}</h2>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  ({step.questions?.length || 0} questions)
                </span>
                {!step.isActive && (
                  <span style={{
                    background: '#dc3545',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    Inactif
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStepChange(stepIndex, 'isActive', !step.isActive);
                  }}
                  style={{
                    background: step.isActive ? '#28a745' : '#e0e0e0',
                    color: step.isActive ? 'white' : '#666',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {step.isActive ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStep(stepIndex);
                  }}
                  style={{
                    background: '#ffebee',
                    color: '#dc3545',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <FaTrash />
                </button>
                {expandedSteps[stepIndex] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedSteps[stepIndex] && (
              <div className="section-body">
                {/* Config de l'étape */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Titre de l'étape</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Icône</label>
                      <input
                        type="text"
                        value={step.icon}
                        onChange={(e) => handleStepChange(stepIndex, 'icon', e.target.value)}
                        placeholder="Ex: FaUser, FaHome..."
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                      placeholder="Description de l'étape"
                    />
                  </div>
                </div>

                {/* Questions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: 0 }}>Questions</h4>
                  <button
                    onClick={() => addQuestion(stepIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 15px',
                      background: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <FaPlus /> Ajouter question
                  </button>
                </div>

                {step.questions && step.questions.length > 0 ? (
                  step.questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        overflow: 'hidden',
                        opacity: question.isActive ? 1 : 0.6,
                        background: question.isActive ? '#fff' : '#f5f5f5'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            background: '#1a5490',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {getTypeLabel(question.type)}
                          </span>
                          <span style={{ fontWeight: '500' }}>{question.label}</span>
                          {question.required && (
                            <span style={{
                              background: '#ff9800',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem'
                            }}>
                              Requis
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleQuestionChange(stepIndex, qIndex, 'required', !question.required)}
                            style={{
                              background: question.required ? '#ff9800' : '#e0e0e0',
                              color: question.required ? 'white' : '#666',
                              border: 'none',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            *
                          </button>
                          <button
                            onClick={() => handleQuestionChange(stepIndex, qIndex, 'isActive', !question.isActive)}
                            style={{
                              background: question.isActive ? '#28a745' : '#e0e0e0',
                              color: question.isActive ? 'white' : '#666',
                              border: 'none',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {question.isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                          <button
                            onClick={() => removeQuestion(stepIndex, qIndex)}
                            style={{
                              background: '#ffebee',
                              color: '#dc3545',
                              border: 'none',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div style={{ padding: '15px', background: '#fafafa' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                          <div className="form-group">
                            <label>Nom (identifiant)</label>
                            <input
                              type="text"
                              value={question.name}
                              onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'name', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Label (affiché)</label>
                            <input
                              type="text"
                              value={question.label}
                              onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'label', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Type</label>
                            <select
                              value={question.type}
                              onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'type', e.target.value)}
                            >
                              <option value="text">Texte</option>
                              <option value="email">Email</option>
                              <option value="tel">Téléphone</option>
                              <option value="date">Date</option>
                              <option value="select">Liste déroulante</option>
                              <option value="radio">Choix unique</option>
                              <option value="checkbox">Choix multiple</option>
                              <option value="range">Curseur</option>
                              <option value="textarea">Zone de texte</option>
                              <option value="ranking">Classement</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Placeholder</label>
                          <input
                            type="text"
                            value={question.placeholder || ''}
                            onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'placeholder', e.target.value)}
                            placeholder="Texte d'indication..."
                          />
                        </div>

                        {/* Config Range */}
                        {question.type === 'range' && (
                          <div style={{
                            background: '#e7f3ff',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '15px'
                          }}>
                            <h5 style={{ margin: '0 0 15px 0', color: '#1a5490' }}>Configuration du curseur</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                              <div className="form-group">
                                <label>Min</label>
                                <input
                                  type="number"
                                  value={question.min || 0}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'min', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="form-group">
                                <label>Max</label>
                                <input
                                  type="number"
                                  value={question.max || 100}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'max', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="form-group">
                                <label>Step</label>
                                <input
                                  type="number"
                                  value={question.step || 1}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'step', parseInt(e.target.value))}
                                />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <div className="form-group">
                                <label>Label Min</label>
                                <input
                                  type="text"
                                  value={question.minLabel || ''}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'minLabel', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label>Label Max</label>
                                <input
                                  type="text"
                                  value={question.maxLabel || ''}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'maxLabel', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Options pour select/radio/checkbox */}
                        {['select', 'radio', 'checkbox'].includes(question.type) && (
                          <div style={{
                            background: '#fff3e0',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '15px'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}>
                              <h5 style={{ margin: 0, color: '#e65100' }}>Options</h5>
                              <button
                                onClick={() => addOption(stepIndex, qIndex)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  background: '#ff9800',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem'
                                }}
                              >
                                <FaPlus /> Ajouter
                              </button>
                            </div>

                            {question.options && question.options.length > 0 ? (
                              question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px',
                                    background: 'white',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    marginBottom: '8px'
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => handleOptionChange(stepIndex, qIndex, optIndex, 'label', e.target.value)}
                                    placeholder="Label"
                                    style={{ flex: 1 }}
                                  />
                                  <input
                                    type="text"
                                    value={option.value}
                                    onChange={(e) => handleOptionChange(stepIndex, qIndex, optIndex, 'value', e.target.value)}
                                    placeholder="Valeur"
                                    style={{ flex: 1 }}
                                  />
                                  <button
                                    onClick={() => removeOption(stepIndex, qIndex, optIndex)}
                                    style={{
                                      background: '#ffebee',
                                      color: '#dc3545',
                                      border: 'none',
                                      padding: '6px 8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                                Aucune option
                              </p>
                            )}

                            {question.type === 'checkbox' && (
                              <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Nombre max de sélections</label>
                                <input
                                  type="number"
                                  value={question.maxSelections || 3}
                                  onChange={(e) => handleQuestionChange(stepIndex, qIndex, 'maxSelections', parseInt(e.target.value))}
                                  style={{ maxWidth: '80px' }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                    Aucune question dans cette étape
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {(!content.steps || content.steps.length === 0) && (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#999'
          }}>
            <p>Aucune étape dans le questionnaire</p>
            <p>Cliquez sur "Ajouter une étape" pour commencer</p>
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
