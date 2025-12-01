const QuestionnaireContent = require('../models/QuestionnaireContent');

// Liste des pays avec préfixes téléphoniques
const paysAvecPrefixes = [
  'Côte d\'Ivoire', 'France', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Togo', 'Bénin',
  'Guinée', 'Cameroun', 'Congo', 'Gabon', 'République Démocratique du Congo', 'Maroc',
  'Algérie', 'Tunisie', 'Égypte', 'Nigeria', 'Ghana', 'Belgique', 'Suisse', 'Italie',
  'Allemagne', 'Canada', 'États-Unis', 'Royaume-Uni', 'Autre'
];

// Valeurs par défaut - Structure exacte du frontend-user
const defaultContent = {
  title: 'Questionnaire Personnalisé',
  subtitle: 'Aidez-nous à trouver le logement idéal pour vous',
  steps: [
    {
      stepNumber: 1,
      title: 'Informations Personnelles',
      icon: '👤',
      description: 'Vos coordonnées de contact',
      isActive: true,
      questions: [
        { name: 'nom', label: 'Nom', type: 'text', required: true, isActive: true, order: 1 },
        { name: 'prenom', label: 'Prénom', type: 'text', required: true, isActive: true, order: 2 },
        { name: 'email', label: 'Email', type: 'email', required: true, isActive: true, order: 3 },
        {
          name: 'paysResidence',
          label: 'Pays de résidence',
          type: 'select',
          required: true,
          isActive: true,
          order: 4,
          options: paysAvecPrefixes.map(p => ({ label: p, value: p }))
        },
        {
          name: 'nationalite',
          label: 'Nationalité',
          type: 'select',
          required: true,
          isActive: true,
          order: 5,
          options: paysAvecPrefixes.map(p => ({ label: p, value: p }))
        },
        {
          name: 'telephone',
          label: 'Téléphone (avec préfixe du pays)',
          type: 'tel',
          required: true,
          isActive: true,
          order: 6,
          tooltip: 'Veuillez inclure le préfixe international de votre pays (ex: +225 pour la Côte d\'Ivoire)'
        },
        {
          name: 'age',
          label: 'Tranche d\'âge',
          type: 'select',
          required: false,
          isActive: true,
          order: 7,
          options: [
            { label: '18-25 ans', value: '18-25 ans' },
            { label: '26-35 ans', value: '26-35 ans' },
            { label: '36-45 ans', value: '36-45 ans' },
            { label: '46-55 ans', value: '46-55 ans' },
            { label: '56-65 ans', value: '56-65 ans' },
            { label: '65+ ans', value: '65+ ans' }
          ]
        },
        {
          name: 'situationFamiliale',
          label: 'Situation familiale',
          type: 'select',
          required: false,
          isActive: true,
          order: 8,
          options: [
            { label: 'Célibataire', value: 'Célibataire' },
            { label: 'Marié(e)', value: 'Marié(e)' },
            { label: 'Divorcé(e)', value: 'Divorcé(e)' },
            { label: 'Veuf(ve)', value: 'Veuf(ve)' },
            { label: 'Union libre', value: 'Union libre' }
          ]
        }
      ]
    },
    {
      stepNumber: 2,
      title: 'Situation Professionnelle',
      icon: '💼',
      description: 'Votre activité professionnelle',
      isActive: true,
      questions: [
        {
          name: 'categorieProfessionnelle',
          label: 'Catégorie professionnelle',
          type: 'select',
          required: false,
          isActive: true,
          order: 1,
          options: [
            { label: 'Cadre supérieur', value: 'Cadre supérieur' },
            { label: 'Cadre moyen', value: 'Cadre moyen' },
            { label: 'Agent de maîtrise', value: 'Agent de maîtrise' },
            { label: 'Employé', value: 'Employé' },
            { label: 'Autres', value: 'Autres' }
          ]
        },
        {
          name: 'profession',
          label: 'Profession',
          type: 'select',
          required: true,
          isActive: true,
          order: 2,
          options: [
            { label: 'Enseignant', value: 'Enseignant' },
            { label: 'Médecin', value: 'Médecin' },
            { label: 'Infirmier(ère)', value: 'Infirmier(ère)' },
            { label: 'Ingénieur', value: 'Ingénieur' },
            { label: 'Architecte', value: 'Architecte' },
            { label: 'Avocat', value: 'Avocat' },
            { label: 'Commerçant', value: 'Commerçant' },
            { label: 'Chef d\'entreprise', value: 'Chef d\'entreprise' },
            { label: 'Entrepreneur', value: 'Entrepreneur' },
            { label: 'Artisan', value: 'Artisan' },
            { label: 'Agent immobilier', value: 'Agent immobilier' },
            { label: 'Banquier', value: 'Banquier' },
            { label: 'Consultant', value: 'Consultant' },
            { label: 'Informaticien', value: 'Informaticien' },
            { label: 'Agriculteur', value: 'Agriculteur' },
            { label: 'Retraité', value: 'Retraité' },
            { label: 'Étudiant', value: 'Étudiant' },
            { label: 'Sans emploi', value: 'Sans emploi' },
            { label: 'Autre', value: 'Autre' }
          ]
        },
        {
          name: 'secteurActivite',
          label: 'Secteur d\'activité',
          type: 'select',
          required: true,
          isActive: true,
          order: 3,
          options: [
            { label: 'Public', value: 'Public' },
            { label: 'Privé', value: 'Privé' },
            { label: 'Entrepreneur', value: 'Entrepreneur' },
            { label: 'Libéral', value: 'Libéral' },
            { label: 'Autre', value: 'Autre' }
          ]
        },
        {
          name: 'revenuMensuel',
          label: 'Revenu mensuel (FCFA)',
          type: 'range',
          required: false,
          isActive: true,
          order: 4,
          min: 0,
          max: 10000000,
          step: 500000,
          minLabel: '0',
          maxLabel: '10M+'
        },
        {
          name: 'stabiliteEmploi',
          label: 'Stabilité de l\'emploi',
          type: 'radio',
          required: true,
          isActive: true,
          order: 5,
          options: [
            { label: 'CDI', value: 'CDI' },
            { label: 'CDD', value: 'CDD' },
            { label: 'Temporaire', value: 'Temporaire' },
            { label: 'Entrepreneur', value: 'Entrepreneur' }
          ]
        },
        { name: 'employeur', label: 'Employeur', type: 'text', required: false, isActive: true, order: 6 },
        {
          name: 'anciennete',
          label: 'Ancienneté (années)',
          type: 'select',
          required: false,
          isActive: true,
          order: 7,
          options: [
            { label: 'Moins de 1 an', value: 'Moins de 1 an' },
            { label: '1-3 ans', value: '1-3 ans' },
            { label: '3-5 ans', value: '3-5 ans' },
            { label: '5-10 ans', value: '5-10 ans' },
            { label: 'Plus de 10 ans', value: 'Plus de 10 ans' }
          ]
        }
      ]
    },
    {
      stepNumber: 3,
      title: 'Préférences de Logement',
      icon: '🏠',
      description: 'Vos préférences de logement',
      isActive: true,
      questions: [
        {
          name: 'typeLogement',
          label: 'Type de logement souhaité',
          type: 'radio',
          required: true,
          isActive: true,
          order: 1,
          tooltip: 'Sélectionnez le type de logement qui correspond à vos besoins et votre budget',
          options: [
            { label: 'Villa Duplex 4 pièces (150 m²) - 120 millions FCFA', value: 'Villa Duplex 4 pièces (150 m²) - 120 millions FCFA' },
            { label: 'Villa Duplex 5 pièces (250 m²) - 150 millions FCFA', value: 'Villa Duplex 5 pièces (250 m²) - 150 millions FCFA' },
            { label: 'Villa Triplex 6 pièces (300 m²) - 250 millions FCFA', value: 'Villa Triplex 6 pièces (300 m²) - 250 millions FCFA' },
            { label: 'Indécis', value: 'Indécis' }
          ]
        },
        {
          name: 'quantiteLogements',
          label: 'Quantité de logements souhaités',
          type: 'range',
          required: true,
          isActive: true,
          order: 2,
          tooltip: 'Si vous souhaitez acquérir plusieurs logements (investissement ou usage familial), précisez la quantité',
          min: 1,
          max: 10,
          step: 1,
          minLabel: '1',
          maxLabel: '10'
        },
        {
          name: 'nombrePieces',
          label: 'Nombre de pièces souhaité',
          type: 'range',
          required: false,
          isActive: true,
          order: 3,
          min: 2,
          max: 8,
          step: 1,
          minLabel: '2',
          maxLabel: '8'
        },
        {
          name: 'superficieMin',
          label: 'Superficie minimale (m²)',
          type: 'range',
          required: false,
          isActive: true,
          order: 4,
          min: 50,
          max: 500,
          step: 10,
          minLabel: '50',
          maxLabel: '500'
        },
        {
          name: 'nombreChambres',
          label: 'Nombre de chambres',
          type: 'range',
          required: false,
          isActive: true,
          order: 5,
          min: 1,
          max: 8,
          step: 1,
          minLabel: '1',
          maxLabel: '8'
        },
        {
          name: 'nombreSallesBain',
          label: 'Nombre de salles d\'eau',
          type: 'range',
          required: false,
          isActive: true,
          order: 6,
          min: 1,
          max: 8,
          step: 1,
          minLabel: '1',
          maxLabel: '8'
        },
        {
          name: 'etagePreference',
          label: 'Préférence d\'étage',
          type: 'select',
          required: false,
          isActive: true,
          order: 7,
          tooltip: 'Indiquez si vous avez une préférence concernant la position de votre logement dans l\'immeuble ou la résidence',
          options: [
            { label: 'Rez-de-chaussée', value: 'Rez-de-chaussée' },
            { label: 'Étage supérieur', value: 'Étage supérieur' },
            { label: 'Dernier étage', value: 'Dernier étage' },
            { label: 'Pas de préférence', value: 'Pas de préférence' }
          ]
        }
      ]
    },
    {
      stepNumber: 4,
      title: 'Budget et Financement',
      icon: '💰',
      description: 'Votre capacité financière',
      isActive: true,
      questions: [
        {
          name: 'budgetTotal',
          label: 'Budget total (FCFA)',
          type: 'range',
          required: true,
          isActive: true,
          order: 1,
          tooltip: 'Le montant total que vous êtes prêt à investir dans l\'achat de votre logement, incluant tous les frais (notaire, enregistrement, etc.)',
          min: 50000000,
          max: 300000000,
          step: 5000000,
          minLabel: '50M',
          maxLabel: '300M'
        },
        {
          name: 'apportPersonnel',
          label: 'Apport personnel (FCFA)',
          type: 'range',
          required: true,
          isActive: true,
          order: 2,
          tooltip: 'La somme d\'argent dont vous disposez immédiatement pour financer l\'achat (épargne, vente d\'un bien, aide familiale, etc.). Généralement entre 20% et 30% du prix.',
          min: 0,
          max: 100000000,
          step: 1000000,
          minLabel: '0',
          maxLabel: '100M'
        },
        {
          name: 'capaciteMensuelle',
          label: 'Capacité de remboursement mensuelle (FCFA)',
          type: 'range',
          required: true,
          isActive: true,
          order: 3,
          tooltip: 'Le montant maximum que vous pouvez consacrer chaque mois au remboursement de votre prêt immobilier. En général, il ne doit pas dépasser 33% de vos revenus mensuels.',
          min: 100000,
          max: 3000000,
          step: 50000,
          minLabel: '100K',
          maxLabel: '3M'
        },
        {
          name: 'besoinFinancement',
          label: 'Besoin de financement',
          type: 'radio',
          required: false,
          isActive: true,
          order: 4,
          tooltip: 'Indiquez si vous avez besoin d\'un crédit immobilier pour financer votre achat et à quel stade en est votre demande.',
          options: [
            { label: 'Oui, déjà approuvé', value: 'Oui, déjà approuvé' },
            { label: 'Oui, en cours', value: 'Oui, en cours' },
            { label: 'Oui, à démarrer', value: 'Oui, à démarrer' },
            { label: 'Non, paiement comptant', value: 'Non, paiement comptant' }
          ]
        },
        {
          name: 'pourcentageReservation',
          label: 'Pourcentage pour la réservation',
          type: 'select',
          required: true,
          isActive: true,
          order: 5,
          tooltip: 'Quel pourcentage du prix total êtes-vous prêt à verser pour réserver votre logement ? Ce montant servira d\'acompte et sera déduit du prix final.',
          options: [
            { label: '20%', value: '20%' },
            { label: '25%', value: '25%' },
            { label: '30%', value: '30%' },
            { label: '35%', value: '35%' },
            { label: '40%', value: '40%' },
            { label: '50%', value: '50%' },
            { label: '60%', value: '60%' },
            { label: '70%', value: '70%' },
            { label: '80%', value: '80%' },
            { label: '90%', value: '90%' },
            { label: '100%', value: '100%' }
          ]
        },
        {
          name: 'pretPayerCashAvecReduction',
          label: 'Avec une réduction de 5%, seriez-vous prêt à payer comptant (cash) ?',
          type: 'radio',
          required: true,
          isActive: true,
          order: 6,
          tooltip: 'Nous proposons une réduction de 5% sur le prix total pour tout paiement comptant. Cette offre vous intéresse-t-elle ?',
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' },
            { label: 'À étudier', value: 'À étudier' }
          ]
        },
        {
          name: 'delaiObtentionPret',
          label: 'Délai d\'obtention du prêt',
          type: 'select',
          required: false,
          isActive: true,
          order: 7,
          tooltip: 'Le temps estimé avant d\'obtenir l\'accord de financement de votre banque. Cela nous aide à planifier votre projet d\'achat.',
          options: [
            { label: 'Déjà obtenu', value: 'Déjà obtenu' },
            { label: '1-3 mois', value: '1-3 mois' },
            { label: '3-6 mois', value: '3-6 mois' },
            { label: '6-12 mois', value: '6-12 mois' },
            { label: 'Non concerné', value: 'Non concerné' }
          ]
        },
        {
          name: 'banquePreferee',
          label: 'Banque partenaire préférée',
          type: 'text',
          required: false,
          isActive: true,
          order: 8,
          tooltip: 'Si vous avez déjà une banque en tête ou avec laquelle vous travaillez habituellement (SGCI, BICICI, Ecobank, BOA, etc.)'
        }
      ]
    },
    {
      stepNumber: 5,
      title: 'Équipements et Commodités',
      icon: '⚡',
      description: 'Vos besoins en équipements',
      isActive: true,
      questions: [
        {
          name: 'equipementsEssentiels',
          label: 'Équipements essentiels',
          type: 'checkbox',
          required: false,
          isActive: true,
          order: 1,
          options: [
            { label: 'Climatisation', value: 'Climatisation' },
            { label: 'Cuisine équipée', value: 'Cuisine équipée' },
            { label: 'Placards intégrés', value: 'Placards intégrés' },
            { label: 'Système de sécurité', value: 'Système de sécurité' },
            { label: 'Panneaux solaires', value: 'Panneaux solaires' },
            { label: 'Groupe électrogène', value: 'Groupe électrogène' }
          ]
        },
        {
          name: 'proximiteServices',
          label: 'Proximité des services',
          type: 'checkbox',
          required: true,
          isActive: true,
          order: 2,
          options: [
            { label: 'Écoles', value: 'Écoles' },
            { label: 'Hôpitaux', value: 'Hôpitaux' },
            { label: 'Commerces', value: 'Commerces' },
            { label: 'Transports', value: 'Transports' },
            { label: 'Loisirs', value: 'Loisirs' },
            { label: 'Mosquées/Églises', value: 'Mosquées/Églises' }
          ]
        },
        {
          name: 'styleArchitectural',
          label: 'Style architectural préféré',
          type: 'radio',
          required: false,
          isActive: true,
          order: 3,
          options: [
            { label: 'Moderne', value: 'Moderne' },
            { label: 'Classique', value: 'Classique' },
            { label: 'Contemporain', value: 'Contemporain' },
            { label: 'Mixte', value: 'Mixte' }
          ]
        },
        {
          name: 'orientationPreferee',
          label: 'Orientation préférée',
          type: 'select',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Nord', value: 'Nord' },
            { label: 'Sud', value: 'Sud' },
            { label: 'Est', value: 'Est' },
            { label: 'Ouest', value: 'Ouest' },
            { label: 'Pas de préférence', value: 'Pas de préférence' }
          ]
        },
        {
          name: 'importanceVue',
          label: 'Importance de la vue',
          type: 'range',
          required: false,
          isActive: true,
          order: 5,
          min: 0,
          max: 10,
          step: 1,
          minLabel: '0',
          maxLabel: '10'
        },
        {
          name: 'besoinExterieur',
          label: 'Espaces extérieurs souhaités',
          type: 'checkbox',
          required: true,
          isActive: true,
          order: 6,
          options: [
            { label: 'Jardin', value: 'Jardin' },
            { label: 'Terrasse', value: 'Terrasse' },
            { label: 'Balcon', value: 'Balcon' },
            { label: 'Garage', value: 'Garage' },
            { label: 'Piscine', value: 'Piscine' },
            { label: 'Espace barbecue', value: 'Espace barbecue' }
          ]
        }
      ]
    },
    {
      stepNumber: 6,
      title: 'Localisation',
      icon: '📍',
      description: 'Vos préférences de localisation',
      isActive: true,
      questions: [
        {
          name: 'distanceTravail',
          label: 'Distance maximale du travail (km)',
          type: 'range',
          required: false,
          isActive: true,
          order: 1,
          tooltip: 'La distance maximale que vous êtes prêt à parcourir entre votre domicile et votre lieu de travail. Cela nous aide à évaluer si l\'emplacement de la CITÉ KONGO correspond à vos contraintes de déplacement quotidien.',
          min: 0,
          max: 50,
          step: 1,
          minLabel: '0',
          maxLabel: '50'
        },
        {
          name: 'proximiteEcoles',
          label: 'Proximité des écoles',
          type: 'radio',
          required: false,
          isActive: true,
          order: 2,
          options: [
            { label: 'Très importante', value: 'Très importante' },
            { label: 'Importante', value: 'Importante' },
            { label: 'Peu importante', value: 'Peu importante' },
            { label: 'Non concerné', value: 'Non concerné' }
          ]
        },
        {
          name: 'acceTransports',
          label: 'Accès aux transports',
          type: 'radio',
          required: false,
          isActive: true,
          order: 3,
          options: [
            { label: 'Indispensable', value: 'Indispensable' },
            { label: 'Souhaitable', value: 'Souhaitable' },
            { label: 'Pas important', value: 'Pas important' }
          ]
        },
        {
          name: 'environnementSouhaite',
          label: 'Environnement souhaité',
          type: 'select',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Calme et résidentiel', value: 'Calme et résidentiel' },
            { label: 'Animé', value: 'Animé' },
            { label: 'Mixte', value: 'Mixte' },
            { label: 'Pas de préférence', value: 'Pas de préférence' }
          ]
        },
        {
          name: 'securiteImportance',
          label: 'Importance de la sécurité',
          type: 'range',
          required: false,
          isActive: true,
          order: 5,
          min: 0,
          max: 10,
          step: 1,
          minLabel: '0',
          maxLabel: '10'
        }
      ]
    },
    {
      stepNumber: 7,
      title: 'Calendrier et Disponibilité',
      icon: '📅',
      description: 'Votre projet dans le temps',
      isActive: true,
      questions: [
        {
          name: 'delaiAchat',
          label: 'Délai d\'achat souhaité',
          type: 'select',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Immédiat', value: 'Immédiat' },
            { label: '1-3 mois', value: '1-3 mois' },
            { label: '3-6 mois', value: '3-6 mois' },
            { label: '6-12 mois', value: '6-12 mois' },
            { label: 'Plus de 12 mois', value: 'Plus de 12 mois' }
          ]
        },
        { name: 'dateEmmenagement', label: 'Date d\'emménagement souhaitée', type: 'date', required: false, isActive: true, order: 2 },
        {
          name: 'logementActuel',
          label: 'Situation de logement actuelle',
          type: 'radio',
          required: true,
          isActive: true,
          order: 3,
          options: [
            { label: 'Locataire', value: 'Locataire' },
            { label: 'Propriétaire', value: 'Propriétaire' },
            { label: 'Hébergé', value: 'Hébergé' },
            { label: 'Autre', value: 'Autre' }
          ]
        },
        {
          name: 'delaLiberation',
          label: 'Délai de libération du logement actuel',
          type: 'select',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Immédiat', value: 'Immédiat' },
            { label: '1 mois', value: '1 mois' },
            { label: '3 mois', value: '3 mois' },
            { label: '6 mois', value: '6 mois' },
            { label: 'Non concerné', value: 'Non concerné' }
          ]
        },
        {
          name: 'urgenceAchat',
          label: 'Niveau d\'urgence de l\'achat',
          type: 'range',
          required: true,
          isActive: true,
          order: 5,
          min: 0,
          max: 10,
          step: 1,
          minLabel: '0',
          maxLabel: '10'
        },
        {
          name: 'flexibiliteDelai',
          label: 'Flexibilité sur les délais',
          type: 'radio',
          required: true,
          isActive: true,
          order: 6,
          options: [
            { label: 'Très flexible', value: 'Très flexible' },
            { label: 'Moyennement flexible', value: 'Moyennement flexible' },
            { label: 'Peu flexible', value: 'Peu flexible' },
            { label: 'Pas flexible', value: 'Pas flexible' }
          ]
        }
      ]
    },
    {
      stepNumber: 8,
      title: 'Besoins Spécifiques',
      icon: '🎯',
      description: 'Vos besoins particuliers',
      isActive: true,
      questions: [
        {
          name: 'handicapAdaptation',
          label: 'Besoin d\'adaptation handicap',
          type: 'radio',
          required: false,
          isActive: true,
          order: 1,
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' },
            { label: 'À prévoir', value: 'À prévoir' }
          ]
        },
        {
          name: 'espaceVoiture',
          label: 'Espace de stationnement',
          type: 'radio',
          required: false,
          isActive: true,
          order: 2,
          options: [
            { label: 'Garage fermé', value: 'Garage fermé' },
            { label: 'Place couverte', value: 'Place couverte' },
            { label: 'Place extérieure', value: 'Place extérieure' },
            { label: 'Non nécessaire', value: 'Non nécessaire' }
          ]
        },
        {
          name: 'nombreVehicules',
          label: 'Nombre de véhicules',
          type: 'range',
          required: false,
          isActive: true,
          order: 3,
          min: 0,
          max: 5,
          step: 1,
          minLabel: '0',
          maxLabel: '5'
        },
        {
          name: 'besoinStockage',
          label: 'Besoin de stockage supplémentaire',
          type: 'radio',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Oui, important', value: 'Oui, important' },
            { label: 'Souhaitable', value: 'Souhaitable' },
            { label: 'Non nécessaire', value: 'Non nécessaire' }
          ]
        },
        {
          name: 'animauxCompagnie',
          label: 'Animaux de compagnie',
          type: 'select',
          required: false,
          isActive: true,
          order: 5,
          options: [
            { label: 'Aucun', value: 'Aucun' },
            { label: 'Chat', value: 'Chat' },
            { label: 'Chien petit', value: 'Chien petit' },
            { label: 'Chien grand', value: 'Chien grand' },
            { label: 'Autres', value: 'Autres' }
          ]
        },
        {
          name: 'bureauTeletravail',
          label: 'Bureau pour télétravail',
          type: 'radio',
          required: false,
          isActive: true,
          order: 6,
          options: [
            { label: 'Indispensable', value: 'Indispensable' },
            { label: 'Souhaitable', value: 'Souhaitable' },
            { label: 'Non nécessaire', value: 'Non nécessaire' }
          ]
        }
      ]
    },
    {
      stepNumber: 9,
      title: 'Motivations et Priorités',
      icon: '🎖️',
      description: 'Vos motivations d\'achat',
      isActive: true,
      questions: [
        {
          name: 'raisonAchat',
          label: 'Raison principale de l\'achat',
          type: 'select',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Résidence principale', value: 'Résidence principale' },
            { label: 'Investissement locatif', value: 'Investissement locatif' },
            { label: 'Résidence secondaire', value: 'Résidence secondaire' },
            { label: 'Revente', value: 'Revente' },
            { label: 'Autre', value: 'Autre' }
          ]
        },
        {
          name: 'prioritesPrincipales',
          label: 'Classez vos 3 priorités principales (Premier, Second, Troisième)',
          type: 'ranking',
          required: true,
          isActive: true,
          order: 2,
          maxSelections: 3,
          options: [
            { label: 'Prix abordable', value: 'Prix abordable' },
            { label: 'Localisation stratégique', value: 'Localisation stratégique' },
            { label: 'Superficie adaptée', value: 'Superficie adaptée' },
            { label: 'Qualité de construction', value: 'Qualité de construction' },
            { label: 'Design moderne', value: 'Design moderne' },
            { label: 'Sécurité du quartier', value: 'Sécurité du quartier' },
            { label: 'Proximité services', value: 'Proximité services' },
            { label: 'Facilités de financement', value: 'Facilités de financement' },
            { label: 'Délai de livraison', value: 'Délai de livraison' },
            { label: 'Budget maîtrisé', value: 'Budget maîtrisé' },
            { label: 'Potentiel de revente', value: 'Potentiel de revente' },
            { label: 'Équipements modernes', value: 'Équipements modernes' }
          ]
        },
        {
          name: 'informationsSup',
          label: 'Informations supplémentaires souhaitées',
          type: 'textarea',
          required: false,
          isActive: true,
          order: 3
        },
        {
          name: 'evolutionFamiliale',
          label: 'Évolution familiale prévue (5 ans)',
          type: 'select',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Aucune', value: 'Aucune' },
            { label: 'Agrandissement', value: 'Agrandissement' },
            { label: 'Réduction', value: 'Réduction' },
            { label: 'Incertain', value: 'Incertain' }
          ]
        }
      ]
    },
    {
      stepNumber: 10,
      title: 'Engagement et Suivi',
      icon: '✅',
      description: 'Finalisation et contact',
      isActive: true,
      questions: [
        {
          name: 'niveauInteret',
          label: 'Niveau d\'intérêt pour Cité KONGO',
          type: 'range',
          required: false,
          isActive: true,
          order: 1,
          min: 0,
          max: 10,
          step: 1,
          minLabel: '0',
          maxLabel: '10'
        },
        {
          name: 'souhaitVisite',
          label: 'Souhaitez-vous visiter le projet ?',
          type: 'radio',
          required: true,
          isActive: true,
          order: 2,
          tooltip: 'Voulez-vous programmer une visite pour découvrir notre projet immobilier ?',
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' },
            { label: 'Peut-être plus tard', value: 'Peut-être plus tard' }
          ]
        },
        {
          name: 'avisSurProjet',
          label: 'Votre opinion sur notre projet',
          type: 'select',
          required: true,
          isActive: true,
          order: 3,
          tooltip: 'Quel est votre niveau d\'intérêt pour le projet Cité KONGO ?',
          options: [
            { label: 'Très intéressé', value: 'Très intéressé' },
            { label: 'Intéressé', value: 'Intéressé' },
            { label: 'Moyennement intéressé', value: 'Moyennement intéressé' },
            { label: 'Peu intéressé', value: 'Peu intéressé' },
            { label: 'Pas encore décidé', value: 'Pas encore décidé' }
          ]
        },
        {
          name: 'disponibiliteVisite',
          label: 'Disponibilité pour visite',
          type: 'checkbox',
          required: false,
          isActive: true,
          order: 4,
          options: [
            { label: 'Lundi-Vendredi matin', value: 'Lundi-Vendredi matin' },
            { label: 'Lundi-Vendredi après-midi', value: 'Lundi-Vendredi après-midi' },
            { label: 'Samedi', value: 'Samedi' },
            { label: 'Dimanche', value: 'Dimanche' },
            { label: 'Tous les jours', value: 'Tous les jours' }
          ]
        },
        {
          name: 'modeContactPrefere',
          label: 'Mode de contact préféré',
          type: 'radio',
          required: false,
          isActive: true,
          order: 5,
          options: [
            { label: 'Téléphone', value: 'Téléphone' },
            { label: 'Email', value: 'Email' },
            { label: 'WhatsApp', value: 'WhatsApp' },
            { label: 'Visite directe', value: 'Visite directe' }
          ]
        },
        {
          name: 'autoriseContact',
          label: 'Autorise le suivi commercial',
          type: 'radio',
          required: false,
          isActive: true,
          order: 6,
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' }
          ]
        },
        {
          name: 'commentaires',
          label: 'Commentaires ou questions',
          type: 'textarea',
          required: false,
          isActive: true,
          order: 7
        },
        {
          name: 'newsletter',
          label: 'Inscription à la newsletter',
          type: 'radio',
          required: true,
          isActive: true,
          order: 8,
          tooltip: 'Souhaitez-vous recevoir nos actualités et offres spéciales ?',
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' }
          ]
        },
        {
          name: 'consentementDonnees',
          label: 'J\'accepte que mes données soient utilisées pour le traitement de ma demande',
          type: 'radio',
          required: true,
          isActive: true,
          order: 9,
          tooltip: 'Vos données seront utilisées uniquement dans le cadre de votre projet immobilier et ne seront pas partagées avec des tiers.',
          options: [
            { label: 'Oui', value: 'Oui' },
            { label: 'Non', value: 'Non' }
          ]
        }
      ]
    }
  ]
};

// Récupérer le contenu
exports.getContent = async (req, res) => {
  try {
    let content = await QuestionnaireContent.findOne();

    if (!content) {
      content = new QuestionnaireContent(defaultContent);
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
    const content = await QuestionnaireContent.findByIdAndUpdate(
      req.params.id,
      req.body,
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

// Réinitialiser aux valeurs par défaut
exports.resetToDefault = async (req, res) => {
  try {
    let content = await QuestionnaireContent.findById(req.params.id);

    if (!content) {
      content = new QuestionnaireContent(defaultContent);
    } else {
      content.title = defaultContent.title;
      content.subtitle = defaultContent.subtitle;
      content.steps = defaultContent.steps;
    }

    await content.save();
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Erreur resetToDefault:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
