const mongoose = require('mongoose');

const presentationContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Cité KONGO'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'L\'habitat de demain - accessible, moderne et parfaitement intégré'
    }
  },
  project: {
    title: {
      type: String,
      required: true,
      default: 'Le Projet'
    },
    leadParagraph: {
      type: String,
      required: true,
      default: 'Idéalement située dans la commune de Port-Bouët, au cœur du quartier ABEKAN-BERNARD, la Cité KONGO offre un cadre de vie moderne et sécurisé.'
    },
    description: {
      type: String,
      required: true,
      default: 'Ce projet ambitieux propose des villas d\'exception, alliant confort, design contemporain et qualité de construction. Chaque logement a été pensé pour répondre aux besoins des familles modernes en quête de bien-être et de sérénité.'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pour s'assurer qu'un seul contenu est actif
presentationContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('PresentationContent', presentationContentSchema);
