const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },

  // Informations générales
  statut: {
    type: String,
    enum: ['en_projet', 'en_construction', 'livraison_proche', 'livré'],
    default: 'en_projet'
  },
  date_livraison: Date,

  // Promoteur
  promoteur: {
    nom: String,
    description: String,
    logo: String,
    contact: {
      telephone: String,
      email: String,
      adresse: String
    }
  },

  // Architecte
  architecte: {
    nom: String,
    description: String,
    portfolio: String,
    logo: String,
    contact: {
      telephone: String,
      email: String,
      adresse: String,
      site_web: String
    },
    realisations: [{
      nom: String,
      annee: String,
      categorie: String,
      localisation: String,
      image: String
    }]
  },

  // Localisation
  localisation: {
    ville: String,
    commune: String,
    quartier: String,
    adresse: String,
    coordonnees: {
      latitude: Number,
      longitude: Number
    },
    proximites: [{
      type: String, // école, hôpital, transport, etc.
      nom: String,
      distance: String
    }]
  },

  // Analyse économique
  analyse_economique: {
    contexte_pays: String,
    developpement_commune: String,
    opportunites: [String],
    avantages: [String]
  },

  // Médias
  images: [{
    url: String,
    titre: String,
    description: String,
    ordre: Number
  }],

  videos: [{
    url: String,
    titre: String,
    type: String, // youtube, vimeo, local
    ordre: Number
  }],

  visite_3d_url: String,

  // Documents
  documents: [{
    titre: String,
    type: String, // brochure, plan, notice, etc.
    url: String,
    taille: Number
  }],

  // Banques partenaires
  banques_partenaires: [{
    nom: String,
    logo: String,
    taux: String,
    conditions: String,
    contact: String
  }],

  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Génération automatique du slug
projetSchema.pre('save', function(next) {
  if (this.isModified('nom')) {
    this.slug = this.nom
      .toLowerCase()
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Projet', projetSchema);
