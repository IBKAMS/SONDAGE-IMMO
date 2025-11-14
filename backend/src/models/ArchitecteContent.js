const mongoose = require('mongoose');

const architecteContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      required: true,
      default: 'ARCHITECTES 21'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Excellence architecturale depuis 2015'
    }
  },
  presentation: {
    title: {
      type: String,
      required: true,
      default: 'Notre Agence'
    },
    paragraph1: {
      type: String,
      required: true,
      default: 'Notre agence a été fondée en 2015 par Ahissan Louis-Habib TANOH, architecte DESA.'
    },
    paragraph2: {
      type: String,
      required: true,
      default: 'Il dirige une équipe pluridisciplinaire qui se compose d\'architectes, d\'architectes d\'intérieur, d\'urbanistes, d\'ingénieurs, d\'économistes en bâtiments, de techniciens, de juristes, de communicants et d\'artisans.'
    },
    paragraph3: {
      type: String,
      required: true,
      default: 'Cet aspect pluridisciplinaire permet de gérer tout type de projet.'
    }
  },
  videoSection: {
    title: {
      type: String,
      default: 'Découvrez ARCHITECTES 21 en vidéo'
    },
    subtitle: {
      type: String,
      default: 'Notre vision, nos réalisations et notre approche architecturale'
    },
    overlayText: {
      type: String,
      default: 'Découvrir notre univers'
    }
  },
  equipeSection: {
    title: {
      type: String,
      default: 'Notre Équipe Pluridisciplinaire'
    },
    membres: [{
      metier: { type: String, required: true },
      order: { type: Number, required: true }
    }]
  },
  valeursSection: {
    title: {
      type: String,
      default: 'Nos Engagements'
    },
    valeurs: [{
      titre: { type: String, required: true },
      description: { type: String, required: true },
      order: { type: Number, required: true }
    }]
  },
  engagement: {
    paragraph1: {
      type: String,
      default: 'Tout en restant fidèle à la commande initiale, l\'agence se doit d\'assurer le suivi architectural et administratif en vue d\'une prestation conforme aux intérêts du client.'
    },
    paragraph2: {
      type: String,
      default: 'Nous valorisons et capitalisons notre expertise à travers une équipe jeune et dynamique. Nous insufflons en chaque collaborateur, le devoir d\'atteindre la précision dans chacune de nos réalisations, par l\'emploi d\'un processus participatif.'
    }
  },
  architecteChef: {
    title: {
      type: String,
      default: 'Architecte en Chef'
    },
    nom: {
      type: String,
      default: 'Ahissan Louis-Habib TANOH'
    },
    titre: {
      type: String,
      default: 'Architecte DESA'
    },
    description: {
      type: String,
      default: 'Fondateur d\'ARCHITECTES 21 en 2015, Louis-Habib TANOH dirige avec excellence une équipe pluridisciplinaire dédiée à la réalisation de projets d\'envergure à travers la Côte d\'Ivoire.'
    }
  },
  contact: {
    title: {
      type: String,
      default: 'Contactez ARCHITECTES 21'
    },
    subtitle: {
      type: String,
      default: 'Pour vos projets architecturaux et d\'urbanisme'
    },
    adresse1: {
      type: String,
      default: '46 Rue du Commerce, Immeuble L\'Ebrien, Etage 5B'
    },
    adresse2: {
      type: String,
      default: 'Plateau, Abidjan'
    },
    adresse3: {
      type: String,
      default: '10 BP 2877'
    },
    telephone1: {
      type: String,
      default: '+225 27 20 23 09 55'
    },
    telephone2: {
      type: String,
      default: '+225 07 78 46 52 88'
    },
    email: {
      type: String,
      default: 'info@architectes21s.com'
    },
    siteWeb: {
      type: String,
      default: 'http://www.architectes21s.com'
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
architecteContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('ArchitecteContent', architecteContentSchema);
