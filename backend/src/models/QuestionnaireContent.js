const mongoose = require('mongoose');

// Schéma pour une option de question
const optionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { _id: false });

// Schéma pour une question
const questionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'tel', 'date', 'select', 'radio', 'checkbox', 'range', 'textarea', 'ranking'],
    required: true
  },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  // Pour les types select, radio, checkbox, ranking
  options: [optionSchema],
  // Pour le type range
  min: { type: Number },
  max: { type: Number },
  step: { type: Number, default: 1 },
  // Pour ranking
  maxSelections: { type: Number, default: 3 },
  // Ordre d'affichage
  order: { type: Number, default: 0 },
  // Actif ou non
  isActive: { type: Boolean, default: true }
});

// Schéma pour une étape du questionnaire
const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, default: '📋' },
  description: { type: String, default: '' },
  questions: [questionSchema],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

// Schéma principal
const questionnaireContentSchema = new mongoose.Schema({
  // Titre général du questionnaire
  title: {
    type: String,
    default: 'Questionnaire Personnalisé'
  },
  subtitle: {
    type: String,
    default: 'Aidez-nous à trouver le logement idéal pour vous'
  },
  // Description affichée sur la page
  description: {
    type: String,
    default: ''
  },
  // Liste des étapes
  steps: [stepSchema],
  // Configuration des pays (pour les préfixes téléphoniques)
  paysAvecPrefixes: {
    type: Map,
    of: String,
    default: {
      'Côte d\'Ivoire': '+225',
      'France': '+33',
      'Sénégal': '+221',
      'Mali': '+223',
      'Burkina Faso': '+226',
      'Niger': '+227',
      'Togo': '+228',
      'Bénin': '+229',
      'Guinée': '+224',
      'Cameroun': '+237',
      'Congo': '+242',
      'Gabon': '+241',
      'République Démocratique du Congo': '+243',
      'Maroc': '+212',
      'Algérie': '+213',
      'Tunisie': '+216',
      'Égypte': '+20',
      'Nigeria': '+234',
      'Ghana': '+233',
      'Belgique': '+32',
      'Suisse': '+41',
      'Italie': '+39',
      'Allemagne': '+49',
      'Canada': '+1',
      'États-Unis': '+1',
      'Royaume-Uni': '+44',
      'Autre': ''
    }
  },
  // Textes de boutons
  buttonTexts: {
    previous: { type: String, default: 'Précédent' },
    next: { type: String, default: 'Suivant' },
    submit: { type: String, default: 'Soumettre le questionnaire' }
  },
  // Messages
  messages: {
    success: { type: String, default: 'Questionnaire soumis avec succès! Nous vous contacterons bientôt.' },
    error: { type: String, default: 'Erreur lors de la soumission. Veuillez réessayer.' },
    requiredField: { type: String, default: 'Veuillez remplir les champs obligatoires suivants:' }
  },
  // Actif ou non
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pour s'assurer qu'un seul contenu est actif
questionnaireContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('QuestionnaireContent', questionnaireContentSchema);
