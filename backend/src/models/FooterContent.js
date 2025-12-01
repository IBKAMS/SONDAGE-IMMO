const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema({
  // Section principale
  brand: {
    name: {
      type: String,
      default: 'CITÉ KONGO'
    },
    slogan: {
      type: String,
      default: 'Votre projet immobilier de prestige en Côte d\'Ivoire'
    }
  },
  // Section Navigation
  navigation: {
    title: {
      type: String,
      default: 'Navigation'
    },
    links: [{
      label: String,
      url: String
    }]
  },
  // Section Informations
  informations: {
    title: {
      type: String,
      default: 'Informations'
    },
    links: [{
      label: String,
      url: String
    }]
  },
  // Section Contact
  contact: {
    title: {
      type: String,
      default: 'Contact'
    },
    phone: {
      type: String,
      default: '+225 XX XX XX XX XX'
    },
    email: {
      type: String,
      default: 'contact@citekongo.ci'
    },
    address: {
      type: String,
      default: 'Abidjan, Côte d\'Ivoire'
    }
  },
  // Copyright
  copyright: {
    text: {
      type: String,
      default: '© 2024 Cité Kongo. Tous droits réservés.'
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
footerContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('FooterContent', footerContentSchema);
