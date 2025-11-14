const mongoose = require('mongoose');

const promoteurContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'KONGO IMMOBILIER'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Le partenaire de confiance pour votre projet de vie'
    }
  },
  mission: {
    title: {
      type: String,
      required: true,
      default: 'Notre Mission'
    },
    leadParagraph: {
      type: String,
      required: true,
      default: 'Dans le paysage dynamique d\'Abidjan, KONGO IMMOBILIER se distingue par sa vision et la qualité de ses réalisations.'
    },
    highlightParagraph: {
      type: String,
      required: true,
      default: 'Notre mission est simple : bâtir plus que des murs, créer des cadres de vie où chaque Ivoirien peut s\'épanouir.'
    },
    descriptionParagraph: {
      type: String,
      required: true,
      default: 'Nous ne nous contentons pas de construire des bâtiments, nous bâtissons votre avenir. Chaque projet est conçu avec soin pour offrir un environnement de vie harmonieux, moderne et accessible.'
    }
  },
  videoSection: {
    title: {
      type: String,
      default: 'Découvrez KONGO IMMOBILIER en vidéo'
    },
    subtitle: {
      type: String,
      default: 'Notre vision, nos projets et notre engagement envers vous'
    },
    overlayText: {
      type: String,
      default: 'Découvrir notre histoire'
    }
  },
  stats: [{
    value: { type: Number, required: true },
    label: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  valeurs: [{
    titre: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true }
  }],
  projetsSection: {
    title: {
      type: String,
      default: 'Nos Projets Emblématiques'
    },
    subtitle: {
      type: String,
      default: 'Notre expertise s\'illustre à travers plusieurs réalisations qui ont transformé le quotidien de nombreux habitants'
    },
    projets: [{
      nom: { type: String, required: true },
      localisation: { type: String, required: true },
      partenariat: { type: String },
      description: { type: String, required: true },
      caracteristiques: [{ type: String }],
      order: { type: Number, required: true }
    }]
  },
  nouveauProjet: {
    sectionTitle: {
      type: String,
      default: 'Notre Nouveau Projet'
    },
    nom: {
      type: String,
      default: 'La Cité KONGO'
    },
    localisation: {
      type: String,
      default: 'Port-Bouët, quartier ABEKAN-BERNARD'
    },
    description: {
      type: String,
      default: 'Forts de nos succès, nous sommes aujourd\'hui fiers de vous annoncer le lancement de la Cité KONGO. Idéalement située dans la commune de Port-Bouët, au cœur du quartier ABEKAN-BERNARD, la Cité KONGO incarne notre vision de l\'habitat de demain : accessible, moderne et parfaitement intégré à son environnement.'
    }
  },
  contact: {
    title: {
      type: String,
      default: 'Contactez KONGO IMMOBILIER'
    },
    description: {
      type: String,
      default: 'Nous sommes à votre écoute pour réaliser votre projet immobilier'
    },
    telephone: {
      type: String,
      default: '+225 XX XX XX XX XX'
    },
    email: {
      type: String,
      default: 'contact@kongoimmobilier.ci'
    },
    adresse: {
      type: String,
      default: 'Abidjan, Côte d\'Ivoire'
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
promoteurContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('PromoteurContent', promoteurContentSchema);
