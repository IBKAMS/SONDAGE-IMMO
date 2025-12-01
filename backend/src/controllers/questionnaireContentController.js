const QuestionnaireContent = require('../models/QuestionnaireContent');

// Données initiales par défaut (basées sur le questionnaire frontend-user)
const defaultSteps = [
  {
    title: "Informations Personnelles",
    icon: "👤",
    order: 0,
    isActive: true,
    questions: [
      { name: 'nom', label: 'Nom', type: 'text', required: true, order: 0 },
      { name: 'prenom', label: 'Prénom', type: 'text', required: true, order: 1 },
      { name: 'email', label: 'Email', type: 'email', required: true, order: 2 },
      { name: 'paysResidence', label: 'Pays de résidence', type: 'select', required: true, order: 3, options: [] },
      { name: 'nationalite', label: 'Nationalité', type: 'select', required: true, order: 4, options: [] },
      { name: 'telephone', label: 'Téléphone (avec préfixe du pays)', type: 'tel', required: true, order: 5, tooltip: 'Veuillez inclure le préfixe international de votre pays' },
      { name: 'age', label: 'Tranche d\'âge', type: 'select', order: 6, options: [
        { value: '18-25 ans', label: '18-25 ans', order: 0 },
        { value: '26-35 ans', label: '26-35 ans', order: 1 },
        { value: '36-45 ans', label: '36-45 ans', order: 2 },
        { value: '46-55 ans', label: '46-55 ans', order: 3 },
        { value: '56-65 ans', label: '56-65 ans', order: 4 },
        { value: '65+ ans', label: '65+ ans', order: 5 }
      ]},
      { name: 'situationFamiliale', label: 'Situation familiale', type: 'select', order: 7, options: [
        { value: 'Célibataire', label: 'Célibataire', order: 0 },
        { value: 'Marié(e)', label: 'Marié(e)', order: 1 },
        { value: 'Divorcé(e)', label: 'Divorcé(e)', order: 2 },
        { value: 'Veuf(ve)', label: 'Veuf(ve)', order: 3 },
        { value: 'Union libre', label: 'Union libre', order: 4 }
      ]}
    ]
  },
  {
    title: "Situation Professionnelle",
    icon: "💼",
    order: 1,
    isActive: true,
    questions: [
      { name: 'categorieProfessionnelle', label: 'Catégorie professionnelle', type: 'select', order: 0, options: [
        { value: 'Cadre supérieur', label: 'Cadre supérieur', order: 0 },
        { value: 'Cadre moyen', label: 'Cadre moyen', order: 1 },
        { value: 'Agent de maîtrise', label: 'Agent de maîtrise', order: 2 },
        { value: 'Employé', label: 'Employé', order: 3 },
        { value: 'Autres', label: 'Autres', order: 4 }
      ]},
      { name: 'profession', label: 'Profession', type: 'select', required: true, order: 1, options: [
        { value: 'Enseignant', label: 'Enseignant', order: 0 },
        { value: 'Médecin', label: 'Médecin', order: 1 },
        { value: 'Ingénieur', label: 'Ingénieur', order: 2 },
        { value: 'Avocat', label: 'Avocat', order: 3 },
        { value: 'Commerçant', label: 'Commerçant', order: 4 },
        { value: 'Chef d\'entreprise', label: 'Chef d\'entreprise', order: 5 },
        { value: 'Entrepreneur', label: 'Entrepreneur', order: 6 },
        { value: 'Informaticien', label: 'Informaticien', order: 7 },
        { value: 'Retraité', label: 'Retraité', order: 8 },
        { value: 'Autre', label: 'Autre', order: 9 }
      ]},
      { name: 'secteurActivite', label: 'Secteur d\'activité', type: 'select', required: true, order: 2, options: [
        { value: 'Public', label: 'Public', order: 0 },
        { value: 'Privé', label: 'Privé', order: 1 },
        { value: 'Entrepreneur', label: 'Entrepreneur', order: 2 },
        { value: 'Libéral', label: 'Libéral', order: 3 },
        { value: 'Autre', label: 'Autre', order: 4 }
      ]},
      { name: 'revenuMensuel', label: 'Revenu mensuel (FCFA)', type: 'range', order: 3, min: 0, max: 10000000, step: 500000 },
      { name: 'stabiliteEmploi', label: 'Stabilité de l\'emploi', type: 'radio', required: true, order: 4, options: [
        { value: 'CDI', label: 'CDI', order: 0 },
        { value: 'CDD', label: 'CDD', order: 1 },
        { value: 'Temporaire', label: 'Temporaire', order: 2 },
        { value: 'Entrepreneur', label: 'Entrepreneur', order: 3 }
      ]},
      { name: 'employeur', label: 'Employeur', type: 'text', order: 5 },
      { name: 'anciennete', label: 'Ancienneté (années)', type: 'select', order: 6, options: [
        { value: 'Moins de 1 an', label: 'Moins de 1 an', order: 0 },
        { value: '1-3 ans', label: '1-3 ans', order: 1 },
        { value: '3-5 ans', label: '3-5 ans', order: 2 },
        { value: '5-10 ans', label: '5-10 ans', order: 3 },
        { value: 'Plus de 10 ans', label: 'Plus de 10 ans', order: 4 }
      ]}
    ]
  },
  {
    title: "Préférences de Logement",
    icon: "🏠",
    order: 2,
    isActive: true,
    questions: [
      { name: 'typeLogement', label: 'Type de logement souhaité', type: 'radio', required: true, order: 0, tooltip: 'Sélectionnez le type de logement qui correspond à vos besoins', options: [
        { value: 'Villa Duplex 4 pièces (150 m²) - 120 millions FCFA', label: 'Villa Duplex 4 pièces (150 m²) - 120 millions FCFA', order: 0 },
        { value: 'Villa Duplex 5 pièces (250 m²) - 150 millions FCFA', label: 'Villa Duplex 5 pièces (250 m²) - 150 millions FCFA', order: 1 },
        { value: 'Villa Triplex 6 pièces (300 m²) - 250 millions FCFA', label: 'Villa Triplex 6 pièces (300 m²) - 250 millions FCFA', order: 2 },
        { value: 'Indécis', label: 'Indécis', order: 3 }
      ]},
      { name: 'quantiteLogements', label: 'Quantité de logements souhaités', type: 'range', required: true, order: 1, min: 1, max: 10, step: 1 },
      { name: 'nombrePieces', label: 'Nombre de pièces souhaité', type: 'range', order: 2, min: 2, max: 8, step: 1 },
      { name: 'superficieMin', label: 'Superficie minimale (m²)', type: 'range', order: 3, min: 50, max: 500, step: 10 },
      { name: 'nombreChambres', label: 'Nombre de chambres', type: 'range', order: 4, min: 1, max: 8, step: 1 },
      { name: 'nombreSallesBain', label: 'Nombre de salles d\'eau', type: 'range', order: 5, min: 1, max: 8, step: 1 }
    ]
  },
  {
    title: "Budget et Financement",
    icon: "💰",
    order: 3,
    isActive: true,
    questions: [
      { name: 'budgetTotal', label: 'Budget total (FCFA)', type: 'range', required: true, order: 0, min: 50000000, max: 300000000, step: 5000000, tooltip: 'Le montant total que vous êtes prêt à investir' },
      { name: 'apportPersonnel', label: 'Apport personnel (FCFA)', type: 'range', required: true, order: 1, min: 0, max: 100000000, step: 1000000 },
      { name: 'capaciteMensuelle', label: 'Capacité de remboursement mensuelle (FCFA)', type: 'range', required: true, order: 2, min: 100000, max: 3000000, step: 50000 },
      { name: 'besoinFinancement', label: 'Besoin de financement', type: 'radio', order: 3, options: [
        { value: 'Oui, déjà approuvé', label: 'Oui, déjà approuvé', order: 0 },
        { value: 'Oui, en cours', label: 'Oui, en cours', order: 1 },
        { value: 'Oui, à démarrer', label: 'Oui, à démarrer', order: 2 },
        { value: 'Non, paiement comptant', label: 'Non, paiement comptant', order: 3 }
      ]},
      { name: 'pourcentageReservation', label: 'Pourcentage pour la réservation', type: 'select', required: true, order: 4, options: [
        { value: '20%', label: '20%', order: 0 },
        { value: '25%', label: '25%', order: 1 },
        { value: '30%', label: '30%', order: 2 },
        { value: '50%', label: '50%', order: 3 },
        { value: '100%', label: '100%', order: 4 }
      ]},
      { name: 'pretPayerCashAvecReduction', label: 'Avec une réduction de 5%, seriez-vous prêt à payer comptant ?', type: 'radio', required: true, order: 5, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 },
        { value: 'À étudier', label: 'À étudier', order: 2 }
      ]}
    ]
  },
  {
    title: "Équipements et Commodités",
    icon: "⚡",
    order: 4,
    isActive: true,
    questions: [
      { name: 'equipementsEssentiels', label: 'Équipements essentiels', type: 'checkbox', order: 0, options: [
        { value: 'Climatisation', label: 'Climatisation', order: 0 },
        { value: 'Cuisine équipée', label: 'Cuisine équipée', order: 1 },
        { value: 'Placards intégrés', label: 'Placards intégrés', order: 2 },
        { value: 'Système de sécurité', label: 'Système de sécurité', order: 3 },
        { value: 'Panneaux solaires', label: 'Panneaux solaires', order: 4 },
        { value: 'Groupe électrogène', label: 'Groupe électrogène', order: 5 }
      ]},
      { name: 'proximiteServices', label: 'Proximité des services', type: 'checkbox', required: true, order: 1, options: [
        { value: 'Écoles', label: 'Écoles', order: 0 },
        { value: 'Hôpitaux', label: 'Hôpitaux', order: 1 },
        { value: 'Commerces', label: 'Commerces', order: 2 },
        { value: 'Transports', label: 'Transports', order: 3 },
        { value: 'Loisirs', label: 'Loisirs', order: 4 },
        { value: 'Mosquées/Églises', label: 'Mosquées/Églises', order: 5 }
      ]},
      { name: 'styleArchitectural', label: 'Style architectural préféré', type: 'radio', order: 2, options: [
        { value: 'Moderne', label: 'Moderne', order: 0 },
        { value: 'Classique', label: 'Classique', order: 1 },
        { value: 'Contemporain', label: 'Contemporain', order: 2 },
        { value: 'Mixte', label: 'Mixte', order: 3 }
      ]},
      { name: 'importanceVue', label: 'Importance de la vue', type: 'range', order: 3, min: 0, max: 10, step: 1 },
      { name: 'besoinExterieur', label: 'Espaces extérieurs souhaités', type: 'checkbox', required: true, order: 4, options: [
        { value: 'Jardin', label: 'Jardin', order: 0 },
        { value: 'Terrasse', label: 'Terrasse', order: 1 },
        { value: 'Balcon', label: 'Balcon', order: 2 },
        { value: 'Garage', label: 'Garage', order: 3 },
        { value: 'Piscine', label: 'Piscine', order: 4 }
      ]}
    ]
  },
  {
    title: "Localisation",
    icon: "📍",
    order: 5,
    isActive: true,
    questions: [
      { name: 'distanceTravail', label: 'Distance maximale du travail (km)', type: 'range', order: 0, min: 0, max: 50, step: 1 },
      { name: 'proximiteEcoles', label: 'Proximité des écoles', type: 'radio', order: 1, options: [
        { value: 'Très importante', label: 'Très importante', order: 0 },
        { value: 'Importante', label: 'Importante', order: 1 },
        { value: 'Peu importante', label: 'Peu importante', order: 2 },
        { value: 'Non concerné', label: 'Non concerné', order: 3 }
      ]},
      { name: 'acceTransports', label: 'Accès aux transports', type: 'radio', order: 2, options: [
        { value: 'Indispensable', label: 'Indispensable', order: 0 },
        { value: 'Souhaitable', label: 'Souhaitable', order: 1 },
        { value: 'Pas important', label: 'Pas important', order: 2 }
      ]},
      { name: 'environnementSouhaite', label: 'Environnement souhaité', type: 'select', order: 3, options: [
        { value: 'Calme et résidentiel', label: 'Calme et résidentiel', order: 0 },
        { value: 'Animé', label: 'Animé', order: 1 },
        { value: 'Mixte', label: 'Mixte', order: 2 },
        { value: 'Pas de préférence', label: 'Pas de préférence', order: 3 }
      ]},
      { name: 'securiteImportance', label: 'Importance de la sécurité', type: 'range', order: 4, min: 0, max: 10, step: 1 }
    ]
  },
  {
    title: "Calendrier et Disponibilité",
    icon: "📅",
    order: 6,
    isActive: true,
    questions: [
      { name: 'delaiAchat', label: 'Délai d\'achat souhaité', type: 'select', required: true, order: 0, options: [
        { value: 'Immédiat', label: 'Immédiat', order: 0 },
        { value: '1-3 mois', label: '1-3 mois', order: 1 },
        { value: '3-6 mois', label: '3-6 mois', order: 2 },
        { value: '6-12 mois', label: '6-12 mois', order: 3 },
        { value: 'Plus de 12 mois', label: 'Plus de 12 mois', order: 4 }
      ]},
      { name: 'dateEmmenagement', label: 'Date d\'emménagement souhaitée', type: 'date', order: 1 },
      { name: 'logementActuel', label: 'Situation de logement actuelle', type: 'radio', required: true, order: 2, options: [
        { value: 'Locataire', label: 'Locataire', order: 0 },
        { value: 'Propriétaire', label: 'Propriétaire', order: 1 },
        { value: 'Hébergé', label: 'Hébergé', order: 2 },
        { value: 'Autre', label: 'Autre', order: 3 }
      ]},
      { name: 'urgenceAchat', label: 'Niveau d\'urgence de l\'achat', type: 'range', required: true, order: 3, min: 0, max: 10, step: 1 },
      { name: 'flexibiliteDelai', label: 'Flexibilité sur les délais', type: 'radio', required: true, order: 4, options: [
        { value: 'Très flexible', label: 'Très flexible', order: 0 },
        { value: 'Moyennement flexible', label: 'Moyennement flexible', order: 1 },
        { value: 'Peu flexible', label: 'Peu flexible', order: 2 },
        { value: 'Pas flexible', label: 'Pas flexible', order: 3 }
      ]}
    ]
  },
  {
    title: "Besoins Spécifiques",
    icon: "🎯",
    order: 7,
    isActive: true,
    questions: [
      { name: 'handicapAdaptation', label: 'Besoin d\'adaptation handicap', type: 'radio', order: 0, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 },
        { value: 'À prévoir', label: 'À prévoir', order: 2 }
      ]},
      { name: 'espaceVoiture', label: 'Espace de stationnement', type: 'radio', order: 1, options: [
        { value: 'Garage fermé', label: 'Garage fermé', order: 0 },
        { value: 'Place couverte', label: 'Place couverte', order: 1 },
        { value: 'Place extérieure', label: 'Place extérieure', order: 2 },
        { value: 'Non nécessaire', label: 'Non nécessaire', order: 3 }
      ]},
      { name: 'nombreVehicules', label: 'Nombre de véhicules', type: 'range', order: 2, min: 0, max: 5, step: 1 },
      { name: 'animauxCompagnie', label: 'Animaux de compagnie', type: 'select', order: 3, options: [
        { value: 'Aucun', label: 'Aucun', order: 0 },
        { value: 'Chat', label: 'Chat', order: 1 },
        { value: 'Chien petit', label: 'Chien petit', order: 2 },
        { value: 'Chien grand', label: 'Chien grand', order: 3 },
        { value: 'Autres', label: 'Autres', order: 4 }
      ]},
      { name: 'bureauTeletravail', label: 'Bureau pour télétravail', type: 'radio', order: 4, options: [
        { value: 'Indispensable', label: 'Indispensable', order: 0 },
        { value: 'Souhaitable', label: 'Souhaitable', order: 1 },
        { value: 'Non nécessaire', label: 'Non nécessaire', order: 2 }
      ]}
    ]
  },
  {
    title: "Motivations et Priorités",
    icon: "🎖️",
    order: 8,
    isActive: true,
    questions: [
      { name: 'raisonAchat', label: 'Raison principale de l\'achat', type: 'select', required: true, order: 0, options: [
        { value: 'Résidence principale', label: 'Résidence principale', order: 0 },
        { value: 'Investissement locatif', label: 'Investissement locatif', order: 1 },
        { value: 'Résidence secondaire', label: 'Résidence secondaire', order: 2 },
        { value: 'Revente', label: 'Revente', order: 3 },
        { value: 'Autre', label: 'Autre', order: 4 }
      ]},
      { name: 'prioritesPrincipales', label: 'Classez vos 3 priorités principales', type: 'ranking', required: true, order: 1, maxSelections: 3, options: [
        { value: 'Prix abordable', label: 'Prix abordable', order: 0 },
        { value: 'Localisation stratégique', label: 'Localisation stratégique', order: 1 },
        { value: 'Superficie adaptée', label: 'Superficie adaptée', order: 2 },
        { value: 'Qualité de construction', label: 'Qualité de construction', order: 3 },
        { value: 'Design moderne', label: 'Design moderne', order: 4 },
        { value: 'Sécurité du quartier', label: 'Sécurité du quartier', order: 5 },
        { value: 'Proximité services', label: 'Proximité services', order: 6 },
        { value: 'Facilités de financement', label: 'Facilités de financement', order: 7 }
      ]},
      { name: 'informationsSup', label: 'Informations supplémentaires souhaitées', type: 'textarea', order: 2 },
      { name: 'evolutionFamiliale', label: 'Évolution familiale prévue (5 ans)', type: 'select', order: 3, options: [
        { value: 'Aucune', label: 'Aucune', order: 0 },
        { value: 'Agrandissement', label: 'Agrandissement', order: 1 },
        { value: 'Réduction', label: 'Réduction', order: 2 },
        { value: 'Incertain', label: 'Incertain', order: 3 }
      ]}
    ]
  },
  {
    title: "Engagement et Suivi",
    icon: "✅",
    order: 9,
    isActive: true,
    questions: [
      { name: 'niveauInteret', label: 'Niveau d\'intérêt pour Cité KONGO', type: 'range', order: 0, min: 0, max: 10, step: 1 },
      { name: 'souhaitVisite', label: 'Souhaitez-vous visiter le projet ?', type: 'radio', required: true, order: 1, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 },
        { value: 'Peut-être plus tard', label: 'Peut-être plus tard', order: 2 }
      ]},
      { name: 'disponibiliteVisite', label: 'Disponibilité pour visite', type: 'checkbox', order: 2, options: [
        { value: 'Lundi-Vendredi matin', label: 'Lundi-Vendredi matin', order: 0 },
        { value: 'Lundi-Vendredi après-midi', label: 'Lundi-Vendredi après-midi', order: 1 },
        { value: 'Samedi', label: 'Samedi', order: 2 },
        { value: 'Dimanche', label: 'Dimanche', order: 3 }
      ]},
      { name: 'modeContactPrefere', label: 'Mode de contact préféré', type: 'radio', order: 3, options: [
        { value: 'Téléphone', label: 'Téléphone', order: 0 },
        { value: 'Email', label: 'Email', order: 1 },
        { value: 'WhatsApp', label: 'WhatsApp', order: 2 },
        { value: 'Visite directe', label: 'Visite directe', order: 3 }
      ]},
      { name: 'autoriseContact', label: 'Autorise le suivi commercial', type: 'radio', order: 4, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 }
      ]},
      { name: 'commentaires', label: 'Commentaires ou questions', type: 'textarea', order: 5 },
      { name: 'newsletter', label: 'Inscription à la newsletter', type: 'radio', required: true, order: 6, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 }
      ]},
      { name: 'consentementDonnees', label: 'J\'accepte que mes données soient utilisées pour le traitement de ma demande', type: 'radio', required: true, order: 7, options: [
        { value: 'Oui', label: 'Oui', order: 0 },
        { value: 'Non', label: 'Non', order: 1 }
      ]}
    ]
  }
];

// Obtenir le contenu actif ou créer un nouveau
exports.getContent = async (req, res) => {
  try {
    let content = await QuestionnaireContent.findOne({ isActive: true });

    if (!content) {
      // Créer le contenu par défaut
      content = new QuestionnaireContent({
        title: 'Questionnaire Personnalisé',
        subtitle: 'Aidez-nous à trouver le logement idéal pour vous',
        steps: defaultSteps,
        isActive: true
      });
      await content.save();
    }

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur getContent:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour le contenu
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const content = await QuestionnaireContent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur updateContent:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ajouter une nouvelle étape
exports.addStep = async (req, res) => {
  try {
    const { id } = req.params;
    const newStep = req.body;

    const content = await QuestionnaireContent.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    // Définir l'ordre de la nouvelle étape
    newStep.order = content.steps.length;
    newStep.isActive = true;
    newStep.questions = newStep.questions || [];

    content.steps.push(newStep);
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur addStep:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une étape
exports.deleteStep = async (req, res) => {
  try {
    const { id, stepIndex } = req.params;

    const content = await QuestionnaireContent.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    content.steps.splice(parseInt(stepIndex), 1);

    // Réordonner les étapes
    content.steps.forEach((step, index) => {
      step.order = index;
    });

    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur deleteStep:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ajouter une question à une étape
exports.addQuestion = async (req, res) => {
  try {
    const { id, stepIndex } = req.params;
    const newQuestion = req.body;

    const content = await QuestionnaireContent.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    const step = content.steps[parseInt(stepIndex)];
    if (!step) {
      return res.status(404).json({ success: false, message: 'Étape non trouvée' });
    }

    // Définir l'ordre de la nouvelle question
    newQuestion.order = step.questions.length;
    newQuestion.isActive = true;

    step.questions.push(newQuestion);
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur addQuestion:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer une question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id, stepIndex, questionIndex } = req.params;

    const content = await QuestionnaireContent.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    const step = content.steps[parseInt(stepIndex)];
    if (!step) {
      return res.status(404).json({ success: false, message: 'Étape non trouvée' });
    }

    step.questions.splice(parseInt(questionIndex), 1);

    // Réordonner les questions
    step.questions.forEach((question, index) => {
      question.order = index;
    });

    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur deleteQuestion:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Réinitialiser le questionnaire aux valeurs par défaut
exports.resetToDefault = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await QuestionnaireContent.findByIdAndUpdate(
      id,
      {
        title: 'Questionnaire Personnalisé',
        subtitle: 'Aidez-nous à trouver le logement idéal pour vous',
        steps: defaultSteps,
        buttonTexts: {
          previous: 'Précédent',
          next: 'Suivant',
          submit: 'Soumettre le questionnaire'
        },
        messages: {
          success: 'Questionnaire soumis avec succès! Nous vous contacterons bientôt.',
          error: 'Erreur lors de la soumission. Veuillez réessayer.',
          requiredField: 'Veuillez remplir les champs obligatoires suivants:'
        }
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }

    res.json({ success: true, data: content, message: 'Questionnaire réinitialisé aux valeurs par défaut' });
  } catch (error) {
    console.error('Erreur resetToDefault:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
