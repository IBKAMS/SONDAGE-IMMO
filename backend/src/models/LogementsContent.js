const mongoose = require('mongoose');

const logementsContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Nos Logements'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Découvrez notre sélection d\'appartements et villas'
    },
    stats: {
      labelTotal: {
        type: String,
        default: 'Logements'
      },
      labelDisponibles: {
        type: String,
        default: 'Disponibles'
      },
      labelPrixMin: {
        type: String,
        default: 'Prix minimum'
      }
    }
  },
  filters: {
    title: {
      type: String,
      default: 'Filtrer les logements'
    },
    buttonShow: {
      type: String,
      default: 'Afficher'
    },
    buttonHide: {
      type: String,
      default: 'Masquer'
    },
    labelTypeBien: {
      type: String,
      default: 'Type de bien'
    },
    labelPrixMin: {
      type: String,
      default: 'Prix minimum (FCFA)'
    },
    labelPrixMax: {
      type: String,
      default: 'Prix maximum (FCFA)'
    },
    labelSuperficieMin: {
      type: String,
      default: 'Superficie min (m²)'
    },
    labelSuperficieMax: {
      type: String,
      default: 'Superficie max (m²)'
    },
    labelStatut: {
      type: String,
      default: 'Statut'
    },
    buttonReset: {
      type: String,
      default: 'Réinitialiser'
    },
    resultsText: {
      type: String,
      default: 'résultat(s)'
    }
  },
  noResults: {
    title: {
      type: String,
      default: 'Aucun logement trouvé'
    },
    message: {
      type: String,
      default: 'Essayez de modifier vos critères de recherche'
    },
    buttonReset: {
      type: String,
      default: 'Réinitialiser les filtres'
    }
  },
  cta: {
    title: {
      type: String,
      default: 'Vous avez trouvé votre logement idéal ?'
    },
    subtitle: {
      type: String,
      default: 'Répondez à notre questionnaire pour être recontacté rapidement'
    },
    buttonText: {
      type: String,
      default: 'Commencer le questionnaire'
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
logementsContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('LogementsContent', logementsContentSchema);
