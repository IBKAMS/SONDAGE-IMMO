const mongoose = require('mongoose');

const LotSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['F4', 'F5', 'F6'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  prix: {
    type: Number,
    default: 0
  },
  superficie: {
    type: Number,
    default: 0
  },
  statut: {
    type: String,
    enum: ['disponible', 'reserve', 'vendu'],
    default: 'disponible'
  },
  // Position sur le plan de masse (en pourcentage)
  position: {
    x: { type: Number, required: true },      // Pourcentage depuis la gauche
    y: { type: Number, required: true },      // Pourcentage depuis le haut
    width: { type: Number, default: 2.5 },    // Largeur de la zone cliquable (%)
    height: { type: Number, default: 3.5 }    // Hauteur de la zone cliquable (%)
  },
  // Informations de réservation
  reservation: {
    clientNom: { type: String },
    clientEmail: { type: String },
    clientTelephone: { type: String },
    dateReservation: { type: Date },
    notes: { type: String }
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
LotSchema.index({ type: 1, statut: 1 });
LotSchema.index({ numero: 1 });

module.exports = mongoose.model('Lot', LotSchema);
