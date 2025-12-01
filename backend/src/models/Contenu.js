const mongoose = require('mongoose');

const contenuSchema = new mongoose.Schema({
  projet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
    required: true
  },

  // Type de contenu
  section: {
    type: String,
    required: true,
    enum: [
      'accueil',
      'presentation',
      'promoteur',
      'architecte',
      'logements',
      'visite_3d',
      'localisation',
      'analyse_economique',
      'banques',
      'documents',
      'options_achat'
    ]
  },

  // Identifiant unique pour la section
  cle: {
    type: String,
    required: true
  },

  // Type de données
  type: {
    type: String,
    enum: ['texte', 'html', 'image', 'video', 'document', 'json'],
    default: 'texte'
  },

  // Contenu
  valeur: mongoose.Schema.Types.Mixed,

  // Métadonnées
  titre: String,
  description: String,
  ordre: {
    type: Number,
    default: 0
  },

  // Versions (historique)
  versions: [{
    valeur: mongoose.Schema.Types.Mixed,
    modifie_par: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    date_modification: {
      type: Date,
      default: Date.now
    }
  }],

  // Statut
  actif: {
    type: Boolean,
    default: true
  },

  // Dernière modification
  modifie_par: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index composé unique sur projet_id, section et cle
contenuSchema.index({ projet_id: 1, section: 1, cle: 1 }, { unique: true });

// Sauvegarder l'ancienne version avant modification
contenuSchema.pre('save', function(next) {
  if (!this.isNew && this.isModified('valeur')) {
    this.versions.push({
      valeur: this.valeur,
      modifie_par: this.modifie_par,
      date_modification: new Date()
    });

    // Garder uniquement les 10 dernières versions
    if (this.versions.length > 10) {
      this.versions = this.versions.slice(-10);
    }
  }
  next();
});

module.exports = mongoose.model('Contenu', contenuSchema);
