const mongoose = require('mongoose');

const visite3DContentSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Visite Virtuelle 3D'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Découvrez la Cité KONGO comme si vous y étiez'
    }
  },

  // Info Banner
  infoBanner: {
    title: {
      type: String,
      required: true,
      default: 'Explorez votre futur logement en 3D'
    },
    description: {
      type: String,
      required: true,
      default: 'Visualisez chaque détail du projet immobilier CITÉ KONGO en haute définition'
    }
  },

  // Video Section
  videoSection: {
    overlayText: {
      type: String,
      default: 'Cliquez pour lancer la visite 3D'
    },
    title: {
      type: String,
      required: true,
      default: 'Visite 3D Complète de la Cité KONGO'
    },
    description: {
      type: String,
      required: true,
      default: 'Plongez dans l\'univers de la Cité KONGO grâce à cette visite virtuelle immersive. Découvrez les espaces communs, les finitions de qualité et l\'agencement des différents types de villas disponibles.'
    },
    feature1: {
      title: {
        type: String,
        default: 'Villas Duplex & Triplex'
      },
      description: {
        type: String,
        default: 'Découvrez nos 3 modèles de villas'
      }
    },
    feature2: {
      title: {
        type: String,
        default: 'Finitions Premium'
      },
      description: {
        type: String,
        default: 'Matériaux de qualité supérieure'
      }
    },
    feature3: {
      title: {
        type: String,
        default: 'Espaces Verts'
      },
      description: {
        type: String,
        default: 'Jardins et terrasses aménagés'
      }
    }
  },

  // Info Cards
  infoCards: {
    card1: {
      title: {
        type: String,
        default: 'Plans Détaillés'
      },
      description: {
        type: String,
        default: 'Consultez les plans architecturaux de chaque type de villa'
      }
    },
    card2: {
      title: {
        type: String,
        default: 'Visite Interactive'
      },
      description: {
        type: String,
        default: 'Naviguez librement dans les espaces en 360°'
      }
    },
    card3: {
      title: {
        type: String,
        default: 'Qualité HD'
      },
      description: {
        type: String,
        default: 'Vidéo haute définition pour une expérience immersive'
      }
    }
  },

  // CTA Section
  cta: {
    title: {
      type: String,
      default: 'Vous souhaitez visiter en personne ?'
    },
    description: {
      type: String,
      default: 'Prenez rendez-vous avec notre équipe pour une visite guidée sur site'
    },
    buttonText: {
      type: String,
      default: 'Prendre rendez-vous'
    }
  },

  // Messages
  messages: {
    loadingText: {
      type: String,
      default: 'Chargement de la vidéo...'
    },
    errorText: {
      type: String,
      default: 'Aucune vidéo disponible'
    },
    videoNotSupported: {
      type: String,
      default: 'Votre navigateur ne supporte pas la lecture de vidéos.'
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
visite3DContentSchema.index({ isActive: 1 });

// Middleware pour s'assurer qu'il n'y a qu'un seul contenu actif à la fois
visite3DContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('Visite3DContent', visite3DContentSchema);
