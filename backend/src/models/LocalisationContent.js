const mongoose = require('mongoose');

const localisationContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Localisation'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'CITÉ KONGO - Abekan Bernard, Port-Bouët'
    }
  },
  infoSection: {
    title: {
      type: String,
      required: true,
      default: 'Une localisation stratégique'
    },
    leadText: {
      type: String,
      required: true,
      default: 'La CITÉ KONGO est idéalement située dans le quartier Abekan Bernard à Port-Bouët, l\'une des communes les plus dynamiques d\'Abidjan.'
    },
    description: {
      type: String,
      required: true,
      default: 'Cette localisation privilégiée vous offre un accès facile à tous les services essentiels tout en bénéficiant du calme d\'un quartier résidentiel en développement.'
    }
  },
  mapSection: {
    title: {
      type: String,
      required: true,
      default: 'Découvrez notre emplacement'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Abekan Bernard, Port-Bouët - Abidjan, Côte d\'Ivoire'
    },
    mapEmbedUrl: {
      type: String,
      required: true,
      default: 'https://maps.google.com/maps?q=5.2447,-3.9317+(CITÉ+KONGO+-+Abekan+Bernard)&hl=fr&z=16&output=embed'
    },
    mapSearchUrl: {
      type: String,
      required: true,
      default: 'https://www.google.com/maps/search/Abekan+Bernard,+Port-Bouet,+Abidjan/@5.2447,-3.9317,16z'
    },
    mapDirectUrl: {
      type: String,
      required: true,
      default: 'https://www.google.com/maps/search/Abekan+Bernard+Port-Bouet+Abidjan'
    },
    indicatorText: {
      type: String,
      required: true,
      default: 'Site du Projet'
    },
    indicatorLocation: {
      type: String,
      required: true,
      default: 'Abekan Bernard'
    },
    linkText: {
      type: String,
      required: true,
      default: '📍 Ouvrir dans Google Maps (Vue détaillée)'
    },
    cardTitle: {
      type: String,
      required: true,
      default: 'CITÉ KONGO'
    },
    cardLocation1: {
      type: String,
      required: true,
      default: 'Abekan Bernard'
    },
    cardLocation2: {
      type: String,
      required: true,
      default: 'Port-Bouët, Abidjan'
    },
    cardLocation3: {
      type: String,
      required: true,
      default: 'Côte d\'Ivoire'
    },
    cardButtonText: {
      type: String,
      required: true,
      default: 'Ouvrir dans Google Maps'
    }
  },
  avantagesSection: {
    title: {
      type: String,
      required: true,
      default: 'Les avantages de notre localisation'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Un emplacement qui facilite votre quotidien'
    },
    avantage1: {
      titre: {
        type: String,
        required: true,
        default: 'Vue sur la Lagune'
      },
      description: {
        type: String,
        required: true,
        default: 'Site donnant sur la lagune Ébrié, offrant un cadre de vie exceptionnel'
      }
    },
    avantage2: {
      titre: {
        type: String,
        required: true,
        default: 'Proximité Aéroport'
      },
      description: {
        type: String,
        required: true,
        default: 'À quelques minutes de l\'aéroport international Félix Houphouët-Boigny'
      }
    },
    avantage3: {
      titre: {
        type: String,
        required: true,
        default: 'Accès Rapide'
      },
      description: {
        type: String,
        required: true,
        default: 'Axes routiers majeurs et voies bitumées directes'
      }
    },
    avantage4: {
      titre: {
        type: String,
        required: true,
        default: 'Commerces'
      },
      description: {
        type: String,
        required: true,
        default: 'Supermarchés, marchés et centres commerciaux à proximité'
      }
    },
    avantage5: {
      titre: {
        type: String,
        required: true,
        default: 'Santé'
      },
      description: {
        type: String,
        required: true,
        default: 'Hôpitaux et centres de santé facilement accessibles'
      }
    },
    avantage6: {
      titre: {
        type: String,
        required: true,
        default: 'Transport'
      },
      description: {
        type: String,
        required: true,
        default: 'Réseau de transport public bien desservi'
      }
    }
  },
  accessibiliteSection: {
    title: {
      type: String,
      required: true,
      default: 'Comment nous rejoindre ?'
    },
    acces1: {
      titre: {
        type: String,
        required: true,
        default: 'En transport public'
      },
      description: {
        type: String,
        required: true,
        default: 'Lignes de bus régulières desservant Port-Bouët depuis le Plateau et Treichville. Arrêt à proximité du quartier Abekan Bernard.'
      }
    },
    acces2: {
      titre: {
        type: String,
        required: true,
        default: 'En voiture'
      },
      description: {
        type: String,
        required: true,
        default: 'Depuis le Plateau : Direction Port-Bouët via le Boulevard VGE (environ 20 min).'
      }
    },
    acces3: {
      titre: {
        type: String,
        required: true,
        default: 'Depuis l\'aéroport'
      },
      description: {
        type: String,
        required: true,
        default: 'À seulement 10 minutes en voiture de l\'aéroport international Félix Houphouët-Boigny. Accès direct et rapide.'
      }
    }
  },
  cta: {
    title: {
      type: String,
      required: true,
      default: 'Intéressé par ce projet ?'
    },
    description: {
      type: String,
      required: true,
      default: 'Découvrez nos différentes options d\'achat et les modalités de financement disponibles pour concrétiser votre investissement dans la CITÉ KONGO.'
    },
    buttonText: {
      type: String,
      required: true,
      default: 'Découvrir les options d\'achat'
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
localisationContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('LocalisationContent', localisationContentSchema);
