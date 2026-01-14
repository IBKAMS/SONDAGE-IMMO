const mongoose = require('mongoose');

// Configuration globale du plan de masse
const PlanMasseConfigSchema = new mongoose.Schema({
  // Image du plan de masse (stockée en base64 ou URL)
  imageBase64: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  imageName: {
    type: String,
    default: 'plan-de-masse.png'
  },
  // Statistiques
  totalLots: {
    type: Number,
    default: 115
  },
  lotsF4: {
    type: Number,
    default: 75
  },
  lotsF5: {
    type: Number,
    default: 30
  },
  lotsF6: {
    type: Number,
    default: 10
  },
  // Couleurs par type (pour l'affichage)
  couleurs: {
    F4: { type: String, default: '#EC4899' },  // Rose/Magenta
    F5: { type: String, default: '#B45309' },  // Marron
    F6: { type: String, default: '#3B82F6' }   // Bleu
  },
  // État de configuration
  isConfigured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanMasseConfig', PlanMasseConfigSchema);
