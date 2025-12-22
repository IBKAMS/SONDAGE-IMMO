const mongoose = require('mongoose');
const Counter = require('./Counter');

const questionnaireSchema = new mongoose.Schema({
  projet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
    required: true
  },
  logement_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Logement'
  },

  // Apporteur d'affaires
  codeApporteur: {
    type: String,
    default: null,
    uppercase: true,
    index: true
  },
  apporteur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApporteurAffaires',
    default: null
  },
  numeroDossier: {
    type: String,
    unique: true,
    sparse: true // Permet plusieurs valeurs null
  },

  // Commission tracking
  commission: {
    montant: {
      type: Number,
      default: 0
    },
    statut: {
      type: String,
      enum: ['non_applicable', 'en_attente', 'validee', 'payee'],
      default: 'non_applicable'
    },
    datePaiement: {
      type: Date,
      default: null
    }
  },

  // Informations de contact
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  // INTRODUCTION
  type_bien_interesse: String,

  // DÉMOGRAPHIE (Q3-Q10)
  demographics: {
    gender: String,
    age: Number,
    familyStatus: String,
    childrenCount: Number,
    professionalCategory: String,
    csp: String,
    activitySector: String,
    monthlyIncome: String,
    jobStability: String,
    countryOfResidence: String,
    nationality: String
  },

  // SITUATION ACTUELLE (Q11-Q15)
  currentSituation: {
    housingStatus: String,
    currentRent: Number,
    city: String,
    housingType: String,
    roomCount: Number
  },

  // MOTIVATIONS (Q16-Q18)
  motivations: {
    purchaseReason: String,
    timeline: String,
    isFirstPurchase: Boolean
  },

  // PRÉFÉRENCES (Q19-Q21)
  preferences: {
    propertyType: String,
    quantityDesired: Number,
    roomsDesired: Number,
    priorityFeatures: [String]
  },

  // BUDGET (Q22-Q25)
  budget: {
    globalBudget: Number,
    monthlyCapacity: Number,
    financingMode: String,
    downPaymentAvailable: Number,
    reservationPercentage: String,
    willingToPayCashWithDiscount: String
  },

  // CRITÈRES D'IMPORTANCE (échelle 1-5)
  criteria: {
    security: Number,
    quality: Number,
    accessibility: Number,
    greenSpaces: Number,
    services: Number,
    quietness: Number,
    investment: Number,
    modernity: Number,
    proximity: Number,
    standing: Number
  },

  // LOCALISATION (Q26-Q28)
  location: {
    preferredZones: [String],
    proximityImportance: String,
    maxDistanceWork: String
  },

  // CONNAISSANCE PROJET (Q29-Q35)
  projectKnowledge: {
    howKnown: String,
    projectOpinion: String,
    wantVisit: Boolean,
    visitAvailability: String,
    specificQuestions: String,
    concernsOrDoubts: String,
    decisionCriteria: [String]
  },

  // CONTACT FINAL (Q36-Q42)
  finalContact: {
    confirmName: String,
    confirmPhone: String,
    confirmEmail: String,
    preferredContactMethod: String,
    bestContactTime: String,
    newsletterConsent: Boolean,
    dataUsageConsent: Boolean
  },

  // Score et qualification
  score_interet: {
    type: Number,
    min: 0,
    max: 100
  },
  qualification: {
    type: String,
    enum: ['chaud', 'tiède', 'froid', 'à_qualifier'],
    default: 'à_qualifier'
  },

  // Statut
  statut: {
    type: String,
    enum: ['nouveau', 'en_cours', 'contacté', 'visité', 'converti', 'perdu', 'commission_payee'],
    default: 'nouveau'
  },

  // Étape du dossier (suivi progression)
  etapeDossier: {
    type: String,
    enum: [
      'dossier_cree',        // 1. Dossier créé (questionnaire soumis)
      'contact_etabli',      // 2. Contact établi
      'visite_effectuee',    // 3. Visite effectuée
      'reservation',         // 4. Réservation confirmée
      'financement_valide',  // 5. Financement validé
      'signature_notaire',   // 6. Signature chez le notaire
      'construction',        // 7. Construction en cours
      'remise_cles'          // 8. Remise des clés
    ],
    default: 'dossier_cree'
  },
  dateEtape: {
    type: Date,
    default: Date.now
  },
  historiqueEtapes: [{
    etape: String,
    date: {
      type: Date,
      default: Date.now
    },
    modifiePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }],

  // Notes et suivi
  notes: [{
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    contenu: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],

  date_soumission: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les recherches et analyses
questionnaireSchema.index({ projet_id: 1, statut: 1 });
questionnaireSchema.index({ email: 1 });
questionnaireSchema.index({ telephone: 1 });
questionnaireSchema.index({ date_soumission: -1 });

// Calcul automatique du score d'intérêt et génération numéro de dossier
questionnaireSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Génération du numéro de dossier
    try {
      const year = new Date().getFullYear();

      if (this.codeApporteur) {
        // Avec code apporteur: CODE-ANNEE-SEQUENCE (ex: ABC12-2026-001)
        const seq = await Counter.getNextSequence(`dossier_${this.codeApporteur}_${year}`);
        this.numeroDossier = `${this.codeApporteur}-${year}-${String(seq).padStart(3, '0')}`;
      } else {
        // Sans code (organique): ORG-ANNEE-SEQUENCE (ex: ORG-2026-001)
        const seq = await Counter.getNextSequence(`dossier_organic_${year}`);
        this.numeroDossier = `ORG-${year}-${String(seq).padStart(3, '0')}`;
      }
    } catch (error) {
      console.error('Erreur génération numéro dossier:', error);
    }

    // Calcul du score d'intérêt
    let score = 0;

    // Budget compatible (+30 points)
    if (this.budget.globalBudget > 0) score += 30;

    // Prêt à payer cash avec réduction (+20 points)
    if (this.budget.willingToPayCashWithDiscount === 'Oui') {
      score += 20;
    } else if (this.budget.willingToPayCashWithDiscount === 'À étudier') {
      score += 10;
    }

    // Pourcentage de réservation élevé (+15 points)
    if (this.budget.reservationPercentage) {
      const percentage = parseInt(this.budget.reservationPercentage);
      if (percentage >= 50) {
        score += 15;
      } else if (percentage >= 30) {
        score += 10;
      } else if (percentage >= 20) {
        score += 5;
      }
    }

    // Timeline court = intérêt élevé (+15 points)
    if (this.motivations.timeline === 'immédiat' || this.motivations.timeline === '0-3 mois') {
      score += 15;
    } else if (this.motivations.timeline === '3-6 mois') {
      score += 10;
    } else if (this.motivations.timeline === '6-12 mois') {
      score += 5;
    }

    // Veut visiter (+10 points)
    if (this.projectKnowledge.wantVisit) score += 10;

    // Opinion positive (+10 points)
    if (this.projectKnowledge.projectOpinion === 'très intéressé' ||
        this.projectKnowledge.projectOpinion === 'intéressé') {
      score += 10;
    }

    // Consentements (+5 points)
    if (this.finalContact.newsletterConsent) score += 3;
    if (this.finalContact.dataUsageConsent) score += 2;

    // Stabilité emploi (+5 points)
    if (this.demographics.jobStability === 'CDI' ||
        this.demographics.jobStability === 'fonctionnaire') {
      score += 5;
    }

    this.score_interet = Math.min(score, 100);

    // Qualification automatique
    if (score >= 70) {
      this.qualification = 'chaud';
    } else if (score >= 40) {
      this.qualification = 'tiède';
    } else {
      this.qualification = 'froid';
    }
  }
  next();
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);
