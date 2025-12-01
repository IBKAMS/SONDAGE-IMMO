const mongoose = require('mongoose');

const logementSchema = new mongoose.Schema({
  // Informations de base
  id: {
    type: String,
    unique: true,
    sparse: true
  },
  reference: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Villa Duplex', 'Villa Triplex', 'studio', 'F2', 'F3', 'F4', 'F5', 'duplex', 'triplex', 'villa']
  },
  nom: {
    type: String,
    required: true
  },

  // Caractéristiques
  superficie: {
    type: Number,
    required: true
  },
  nombrePieces: Number,
  nombreChambres: Number,
  nombreSallesBain: Number,
  nombreWC: Number,
  etage: String,

  // Prix
  prix: {
    type: Number,
    required: true
  },
  prixM2: Number,

  // Description
  description: String,
  equipements: [String],

  // Équipements extérieurs
  balcon: {
    type: Boolean,
    default: false
  },
  terrasse: {
    type: Boolean,
    default: false
  },
  jardin: {
    type: Boolean,
    default: false
  },
  parking: {
    inclus: {
      type: Boolean,
      default: false
    },
    nombrePlaces: {
      type: Number,
      default: 0
    }
  },

  // Orientation
  orientation: {
    type: String,
    enum: ['nord', 'sud', 'est', 'ouest', 'nord-est', 'nord-ouest', 'sud-est', 'sud-ouest']
  },

  // Disponibilité
  statut: {
    type: String,
    enum: ['disponible', 'réservé', 'vendu'],
    default: 'disponible'
  },

  // Médias
  images: [String],
  planUrl: String,

  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour les recherches
logementSchema.index({ type: 1, statut: 1 });
// Note: L'index sur 'reference' est déjà créé automatiquement par 'unique: true'

// Calcul automatique du prix au m²
logementSchema.pre('save', function(next) {
  if (this.prix && this.superficie) {
    this.prixM2 = Math.round(this.prix / this.superficie);
  }
  next();
});

module.exports = mongoose.model('Logement', logementSchema);
