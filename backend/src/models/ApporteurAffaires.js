const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const apporteurAffairesSchema = new mongoose.Schema({
  // Code unique de l'apporteur (5 caractères alphanumériques)
  code: {
    type: String,
    required: [true, 'Le code apporteur est requis'],
    unique: true,
    uppercase: true,
    minlength: 5,
    maxlength: 6,
    index: true
  },

  // Informations personnelles
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  pays: {
    type: String,
    required: [true, 'Le pays est requis'],
    trim: true
  },

  // Authentification
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false // Ne pas renvoyer le mot de passe par défaut
  },

  // Configuration commission
  tauxCommission: {
    type: Number,
    default: 2, // 2% par défaut
    min: [0, 'Le taux ne peut pas être négatif'],
    max: [100, 'Le taux ne peut pas dépasser 100%']
  },

  // Statut
  actif: {
    type: Boolean,
    default: true
  },

  // Statistiques (mises à jour automatiquement)
  statistiques: {
    prospectsReferes: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    commissionsGagnees: {
      type: Number,
      default: 0
    },
    commissionsEnAttente: {
      type: Number,
      default: 0
    }
  },

  // Suivi
  derniere_connexion: {
    type: Date
  },

  // Notes administratives
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index pour les recherches
apporteurAffairesSchema.index({ nom: 'text', prenom: 'text', email: 'text' });

// Hash du mot de passe avant sauvegarde
apporteurAffairesSchema.pre('save', async function(next) {
  // Ne hasher que si le mot de passe a été modifié
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
apporteurAffairesSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode statique pour générer un code unique
apporteurAffairesSchema.statics.generateUniqueCode = async function() {
  // Caractères sans ambiguïté (sans I, O, 0, 1 qui peuvent être confondus)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Vérifier que le code n'existe pas déjà
    const existing = await this.findOne({ code });
    isUnique = !existing;
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Impossible de générer un code unique après plusieurs tentatives');
  }

  return code;
};

// Méthode statique pour valider un code
apporteurAffairesSchema.statics.validateCode = async function(code) {
  if (!code || code.length < 5) {
    return { valid: false, message: 'Code invalide' };
  }

  const apporteur = await this.findOne({
    code: code.toUpperCase(),
    actif: true
  });

  if (!apporteur) {
    return { valid: false, message: 'Code apporteur non reconnu ou inactif' };
  }

  return {
    valid: true,
    apporteur: {
      id: apporteur._id,
      code: apporteur.code,
      nom: apporteur.nom,
      prenom: apporteur.prenom
    }
  };
};

// Méthode pour incrémenter les prospects référés
apporteurAffairesSchema.methods.incrementProspects = async function() {
  this.statistiques.prospectsReferes += 1;
  await this.save();
};

// Méthode pour enregistrer une conversion
apporteurAffairesSchema.methods.registerConversion = async function(commissionAmount) {
  this.statistiques.conversions += 1;
  this.statistiques.commissionsEnAttente += commissionAmount;
  await this.save();
};

// Méthode pour marquer une commission comme payée
apporteurAffairesSchema.methods.markCommissionPaid = async function(commissionAmount) {
  this.statistiques.commissionsEnAttente -= commissionAmount;
  this.statistiques.commissionsGagnees += commissionAmount;
  await this.save();
};

// Virtual pour le nom complet
apporteurAffairesSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

// Virtual pour le taux de conversion
apporteurAffairesSchema.virtual('tauxConversion').get(function() {
  if (this.statistiques.prospectsReferes === 0) return 0;
  return ((this.statistiques.conversions / this.statistiques.prospectsReferes) * 100).toFixed(2);
});

// S'assurer que les virtuals sont inclus dans les réponses JSON
apporteurAffairesSchema.set('toJSON', { virtuals: true });
apporteurAffairesSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ApporteurAffaires', apporteurAffairesSchema);
