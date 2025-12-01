const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Cité KONGO'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Votre futur cadre de vie à Port-Bouët, quartier ABEKAN-BERNARD'
    },
    description: {
      type: String,
      required: true,
      default: 'Découvrez nos villas d\'exception alliant confort, modernité et sécurité'
    },
    primaryButtonText: {
      type: String,
      default: 'Découvrir les logements'
    },
    secondaryButtonText: {
      type: String,
      default: 'Commencer le questionnaire'
    }
  },

  // Stats Section (4 statistiques)
  stats: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],

  // Quick Links Section
  quickLinks: {
    sectionTitle: {
      type: String,
      default: 'Découvrir le Projet'
    },
    cards: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      order: {
        type: Number,
        required: true
      }
    }]
  },

  // CTA Section (Call to Action)
  cta: {
    title: {
      type: String,
      default: 'Prêt à devenir propriétaire?'
    },
    description: {
      type: String,
      default: 'Répondez à notre questionnaire pour être recontacté rapidement'
    },
    buttonText: {
      type: String,
      default: 'Commencer maintenant'
    }
  },

  // Indique si c'est le contenu actif
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour récupérer rapidement le contenu actif
homeContentSchema.index({ isActive: 1 });

// Middleware pour s'assurer qu'il n'y a qu'un seul contenu actif à la fois
homeContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('HomeContent', homeContentSchema);
