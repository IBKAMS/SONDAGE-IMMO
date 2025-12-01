const mongoose = require('mongoose');

const OptionAchatContentSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      default: "Options d'Achat"
    },
    subtitle: {
      type: String,
      default: "Découvrez nos solutions de financement flexibles et choisissez le logement qui correspond à vos ambitions dans la CITÉ KONGO"
    }
  },
  ctaSection: {
    title: {
      type: String,
      default: "Prêt à Concrétiser Votre Projet ?"
    },
    description: {
      type: String,
      default: "Remplissez notre questionnaire personnalisé pour recevoir une offre adaptée à vos besoins et votre budget. Notre équipe vous contactera dans les 24h."
    },
    buttonText: {
      type: String,
      default: "Commencer le Questionnaire"
    }
  },
  logementsSection: {
    title: {
      type: String,
      default: "Nos Types de Logements"
    },
    subtitle: {
      type: String,
      default: "Des espaces conçus pour votre confort et votre bien-être"
    }
  },
  financementSection: {
    title: {
      type: String,
      default: "Solutions de Financement"
    },
    subtitle: {
      type: String,
      default: "Choisissez la formule qui vous convient le mieux"
    },
    option1: {
      titre: {
        type: String,
        default: "Paiement Comptant"
      },
      description: {
        type: String,
        default: "Bénéficiez d'avantages exclusifs en réglant comptant"
      },
      popular: {
        type: Boolean,
        default: false
      },
      avantage1: {
        type: String,
        default: "Réduction immédiate de 5%"
      },
      avantage2: {
        type: String,
        default: "Priorité sur le choix du logement"
      },
      avantage3: {
        type: String,
        default: "Frais de dossier offerts"
      },
      avantage4: {
        type: String,
        default: "Livraison garantie en priorité"
      }
    },
    option2: {
      titre: {
        type: String,
        default: "Échelonnement Promoteur"
      },
      description: {
        type: String,
        default: "Un plan de paiement adapté à votre rythme"
      },
      popular: {
        type: Boolean,
        default: true
      },
      avantage1: {
        type: String,
        default: "Apport initial de 30%"
      },
      avantage2: {
        type: String,
        default: "Solde échelonné jusqu'à la livraison"
      },
      avantage3: {
        type: String,
        default: "Sans intérêts bancaires"
      },
      avantage4: {
        type: String,
        default: "Flexibilité de paiement"
      }
    },
    option3: {
      titre: {
        type: String,
        default: "Financement Bancaire"
      },
      description: {
        type: String,
        default: "Nos partenaires bancaires vous accompagnent"
      },
      popular: {
        type: Boolean,
        default: false
      },
      avantage1: {
        type: String,
        default: "Partenariats avec banques locales"
      },
      avantage2: {
        type: String,
        default: "Taux préférentiels négociés"
      },
      avantage3: {
        type: String,
        default: "Accompagnement dans les démarches"
      },
      avantage4: {
        type: String,
        default: "Jusqu'à 20 ans de crédit"
      }
    }
  },
  avantagesSection: {
    title: {
      type: String,
      default: "Pourquoi Investir dans la CITÉ KONGO ?"
    },
    avantage1: {
      titre: {
        type: String,
        default: "Emplacement Premium"
      },
      description: {
        type: String,
        default: "Vue sur la lagune Ébrié, à Port-Bouët, zone en plein développement"
      }
    },
    avantage2: {
      titre: {
        type: String,
        default: "Investissement Rentable"
      },
      description: {
        type: String,
        default: "Fort potentiel de valorisation dans une zone stratégique"
      }
    },
    avantage3: {
      titre: {
        type: String,
        default: "Sécurité & Qualité"
      },
      description: {
        type: String,
        default: "Construction aux normes internationales, matériaux premium"
      }
    },
    avantage4: {
      titre: {
        type: String,
        default: "Cadre de Vie Exceptionnel"
      },
      description: {
        type: String,
        default: "Espaces verts, aires de jeux, commerces de proximité"
      }
    }
  },
  timelineSection: {
    title: {
      type: String,
      default: "Calendrier du Projet"
    },
    subtitle: {
      type: String,
      default: "Les étapes clés de votre investissement"
    },
    phase1: {
      phase: {
        type: String,
        default: "Phase Actuelle"
      },
      titre: {
        type: String,
        default: "Commercialisation"
      },
      date: {
        type: String,
        default: "Novembre 2024"
      },
      statut: {
        type: String,
        default: "En cours"
      },
      description: {
        type: String,
        default: "Réservations et préventes ouvertes"
      }
    },
    phase2: {
      phase: {
        type: String,
        default: "Phase 2"
      },
      titre: {
        type: String,
        default: "Début des Travaux"
      },
      date: {
        type: String,
        default: "T1 2025"
      },
      statut: {
        type: String,
        default: "À venir"
      },
      description: {
        type: String,
        default: "Démarrage de la construction"
      }
    },
    phase3: {
      phase: {
        type: String,
        default: "Phase 3"
      },
      titre: {
        type: String,
        default: "Livraison"
      },
      date: {
        type: String,
        default: "T4 2026"
      },
      statut: {
        type: String,
        default: "Prévu"
      },
      description: {
        type: String,
        default: "Remise des clés aux propriétaires"
      }
    }
  },
  faqSection: {
    title: {
      type: String,
      default: "Questions Fréquentes"
    },
    subtitle: {
      type: String,
      default: "Trouvez les réponses à vos questions"
    },
    faq1: {
      question: {
        type: String,
        default: "Quels documents sont nécessaires pour réserver ?"
      },
      answer: {
        type: String,
        default: "Pour réserver votre logement, vous aurez besoin d'une pièce d'identité en cours de validité, d'un justificatif de domicile récent, et de fournir un acompte de réservation. Notre équipe vous accompagnera dans toutes les démarches."
      }
    },
    faq2: {
      question: {
        type: String,
        default: "Le prix inclut-il les finitions ?"
      },
      answer: {
        type: String,
        default: "Oui, tous nos logements sont livrés avec des finitions haut de gamme : carrelage, peinture, cuisine équipée, sanitaires premium, portes et fenêtres aluminium. Les climatiseurs sont également inclus."
      }
    },
    faq3: {
      question: {
        type: String,
        default: "Puis-je visiter un logement témoin ?"
      },
      answer: {
        type: String,
        default: "Un appartement témoin sera disponible dès le début des travaux (T1 2025). En attendant, nous vous proposons des visites virtuelles 3D et des plans détaillés pour visualiser votre futur logement."
      }
    },
    faq4: {
      question: {
        type: String,
        default: "Quelles sont les garanties proposées ?"
      },
      answer: {
        type: String,
        default: "Tous nos logements bénéficient de la garantie décennale, de la garantie de parfait achèvement (1 an), et de la garantie biennale. Nous travaillons avec des assureurs reconnus pour votre sécurité."
      }
    },
    faq5: {
      question: {
        type: String,
        default: "Y a-t-il des frais supplémentaires à prévoir ?"
      },
      answer: {
        type: String,
        default: "Les frais de notaire (environ 10% du prix) et les frais de dossier bancaire (si financement) sont à prévoir. Nous vous fournissons une estimation détaillée lors de votre rendez-vous."
      }
    },
    faq6: {
      question: {
        type: String,
        default: "Puis-je revendre avant la livraison ?"
      },
      answer: {
        type: String,
        default: "Oui, vous êtes propriétaire dès la signature chez le notaire. Vous pouvez donc revendre votre bien en VEFA (Vente en État Futur d'Achèvement) avant même la livraison."
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure only one document has isActive=true
OptionAchatContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    // Désactiver tous les autres documents
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('OptionAchatContent', OptionAchatContentSchema);
