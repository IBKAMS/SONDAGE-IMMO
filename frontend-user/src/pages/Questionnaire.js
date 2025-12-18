import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaFileAlt, FaCopy, FaHome } from 'react-icons/fa';
import API_URL from '../config';
import './Questionnaire.css';

const Questionnaire = () => {
  const { logementId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [formData, setFormData] = useState({
    logementId: logementId || '',
    // Étape 1: Informations personnelles
    nom: '',
    prenom: '',
    email: '',
    paysResidence: '',
    nationalite: '',
    telephone: '',
    age: '',
    situationFamiliale: '',

    // Étape 2: Situation professionnelle
    categorieProfessionnelle: '',
    profession: '',
    secteurActivite: '',
    revenuMensuel: 2000000,
    stabiliteEmploi: '',
    employeur: '',
    anciennete: '',

    // Étape 3: Budget et financement
    budgetTotal: 120000000,
    apportPersonnel: 30000000,
    capaciteMensuelle: 500000,
    besoinFinancement: '',
    pourcentageReservation: '',
    pretPayerCashAvecReduction: '',
    delaiObtentionPret: '',
    banquePreferee: '',

    // Étape 4: Préférences de logement
    typeLogement: '',
    quantiteLogements: 1,
    nombrePieces: 4,
    superficieMin: 150,
    nombreChambres: 3,
    nombreSallesBain: 2,
    etagePreference: '',

    // Étape 5: Équipements et commodités
    equipementsEssentiels: [],
    proximiteServices: [],
    styleArchitectural: '',
    orientationPreferee: '',
    importanceVue: 5,
    besoinExterieur: [],

    // Étape 6: Localisation
    quartierPrefere: '',
    distanceTravail: 10,
    proximiteEcoles: '',
    acceTransports: '',
    environnementSouhaite: '',
    securiteImportance: 8,

    // Étape 7: Calendrier et disponibilité
    delaiAchat: '',
    dateEmmenagement: '',
    logementActuel: '',
    delaLiberation: '',
    urgenceAchat: 5,
    flexibiliteDelai: '',

    // Étape 8: Besoins spécifiques
    handicapAdaptation: '',
    espaceVoiture: '',
    nombreVehicules: 1,
    besoinStockage: '',
    animauxCompagnie: '',
    bureauTeletravail: '',

    // Étape 9: Motivations et priorités
    raisonAchat: '',
    prioritePrincipale: '',
    critereDecisif: '',
    preoccupationsPrincipales: [],
    informationsSup: '',
    evolutionFamiliale: '',

    // Étape 10: Engagement et suivi
    niveauInteret: 7,
    disponibiliteVisite: [],
    modeContactPrefere: '',
    autoriseContact: '',
    commentaires: '',
    newsletter: ''
  });

  useEffect(() => {
    if (logementId) {
      setFormData(prev => ({ ...prev, logementId }));
    }
  }, [logementId]);

  // Charger la configuration du questionnaire depuis l'API
  useEffect(() => {
    const fetchQuestionnaireConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/api/questionnaire-content`);
        const result = await response.json();

        if (result.success && result.data && result.data.steps) {
          // Transformer les steps de l'API vers le format attendu par le composant
          const transformedSteps = result.data.steps
            .filter(step => step.isActive)
            .sort((a, b) => a.stepNumber - b.stepNumber)
            .map(step => ({
              title: step.title,
              icon: step.icon,
              questions: step.questions
                .filter(q => q.isActive)
                .sort((a, b) => a.order - b.order)
                .map(q => ({
                  name: q.name,
                  label: q.label,
                  type: q.type,
                  required: q.required,
                  tooltip: q.tooltip || undefined,
                  placeholder: q.placeholder || undefined,
                  min: q.min,
                  max: q.max,
                  step: q.step,
                  maxSelections: q.maxSelections,
                  // Transformer les options de [{label, value}] vers [string]
                  options: q.options && q.options.length > 0
                    ? q.options.map(opt => opt.value || opt.label)
                    : undefined
                }))
            }));

          setSteps(transformedSteps);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration du questionnaire:', error);
        // Utiliser les steps par défaut en cas d'erreur (fallback)
        setSteps(defaultSteps);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaireConfig();
  }, []);

  // Liste des pays avec préfixes téléphoniques
  const paysAvecPrefixes = {
    'Côte d\'Ivoire': '+225',
    'France': '+33',
    'Sénégal': '+221',
    'Mali': '+223',
    'Burkina Faso': '+226',
    'Niger': '+227',
    'Togo': '+228',
    'Bénin': '+229',
    'Guinée': '+224',
    'Cameroun': '+237',
    'Congo': '+242',
    'Gabon': '+241',
    'République Démocratique du Congo': '+243',
    'Maroc': '+212',
    'Algérie': '+213',
    'Tunisie': '+216',
    'Égypte': '+20',
    'Nigeria': '+234',
    'Ghana': '+233',
    'Belgique': '+32',
    'Suisse': '+41',
    'Italie': '+39',
    'Allemagne': '+49',
    'Canada': '+1',
    'États-Unis': '+1',
    'Royaume-Uni': '+44',
    'Autre': ''
  };

  // Fallback steps utilisés si l'API échoue
  const defaultSteps = [
    {
      title: "Informations Personnelles",
      icon: "👤",
      questions: [
        { name: 'nom', label: 'Nom', type: 'text', required: true },
        { name: 'prenom', label: 'Prénom', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'paysResidence',
          label: 'Pays de résidence',
          type: 'select',
          options: Object.keys(paysAvecPrefixes),
          required: true
        },
        {
          name: 'nationalite',
          label: 'Nationalité',
          type: 'select',
          options: Object.keys(paysAvecPrefixes),
          required: true
        },
        {
          name: 'telephone',
          label: 'Téléphone (avec préfixe du pays)',
          type: 'tel',
          required: true,
          tooltip: 'Veuillez inclure le préfixe international de votre pays (ex: +225 pour la Côte d\'Ivoire)'
        },
        {
          name: 'age',
          label: 'Tranche d\'âge',
          type: 'select',
          options: ['18-25 ans', '26-35 ans', '36-45 ans', '46-55 ans', '56-65 ans', '65+ ans']
        },
        {
          name: 'situationFamiliale',
          label: 'Situation familiale',
          type: 'select',
          options: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'Union libre']
        }
      ]
    },
    {
      title: "Situation Professionnelle",
      icon: "💼",
      questions: [
        {
          name: 'categorieProfessionnelle',
          label: 'Catégorie professionnelle',
          type: 'select',
          options: [
            'Cadre supérieur',
            'Cadre moyen',
            'Agent de maîtrise',
            'Employé',
            'Autres'
          ]
        },
        {
          name: 'profession',
          label: 'Profession',
          type: 'select',
          options: [
            'Enseignant',
            'Médecin',
            'Infirmier(ère)',
            'Ingénieur',
            'Architecte',
            'Avocat',
            'Commerçant',
            'Chef d\'entreprise',
            'Entrepreneur',
            'Artisan',
            'Agent immobilier',
            'Banquier',
            'Consultant',
            'Informaticien',
            'Agriculteur',
            'Retraité',
            'Étudiant',
            'Sans emploi',
            'Autre'
          ],
          required: true
        },
        {
          name: 'secteurActivite',
          label: 'Secteur d\'activité',
          type: 'select',
          options: ['Public', 'Privé', 'Entrepreneur', 'Libéral', 'Autre'],
          required: true
        },
        {
          name: 'revenuMensuel',
          label: 'Revenu mensuel (FCFA)',
          type: 'range',
          min: 0,
          max: 10000000,
          step: 500000
        },
        {
          name: 'stabiliteEmploi',
          label: 'Stabilité de l\'emploi',
          type: 'radio',
          options: ['CDI', 'CDD', 'Temporaire', 'Entrepreneur'],
          required: true
        },
        { name: 'employeur', label: 'Employeur', type: 'text' },
        {
          name: 'anciennete',
          label: 'Ancienneté (années)',
          type: 'select',
          options: ['Moins de 1 an', '1-3 ans', '3-5 ans', '5-10 ans', 'Plus de 10 ans']
        }
      ]
    },
    {
      title: "Préférences de Logement",
      icon: "🏠",
      questions: [
        {
          name: 'typeLogement',
          label: 'Type de logement souhaité',
          type: 'radio',
          options: [
            'Villa Duplex 4 pièces (150 m²) - 120 millions FCFA',
            'Villa Duplex 5 pièces (250 m²) - 150 millions FCFA',
            'Villa Triplex 6 pièces (300 m²) - 250 millions FCFA',
            'Indécis'
          ],
          tooltip: 'Sélectionnez le type de logement qui correspond à vos besoins et votre budget',
          required: true
        },
        {
          name: 'quantiteLogements',
          label: 'Quantité de logements souhaités',
          type: 'range',
          min: 1,
          max: 10,
          step: 1,
          tooltip: 'Si vous souhaitez acquérir plusieurs logements (investissement ou usage familial), précisez la quantité',
          required: true
        },
        {
          name: 'nombrePieces',
          label: 'Nombre de pièces souhaité',
          type: 'range',
          min: 2,
          max: 8,
          step: 1
        },
        {
          name: 'superficieMin',
          label: 'Superficie minimale (m²)',
          type: 'range',
          min: 50,
          max: 500,
          step: 10
        },
        {
          name: 'nombreChambres',
          label: 'Nombre de chambres',
          type: 'range',
          min: 1,
          max: 8,
          step: 1
        },
        {
          name: 'nombreSallesBain',
          label: 'Nombre de salles d\'eau',
          type: 'range',
          min: 1,
          max: 8,
          step: 1
        },
        {
          name: 'etagePreference',
          label: 'Préférence d\'étage',
          type: 'select',
          options: ['Rez-de-chaussée', 'Étage supérieur', 'Dernier étage', 'Pas de préférence'],
          tooltip: 'Indiquez si vous avez une préférence concernant la position de votre logement dans l\'immeuble ou la résidence'
        }
      ]
    },
    {
      title: "Budget et Financement",
      icon: "💰",
      questions: [
        {
          name: 'budgetTotal',
          label: 'Budget total (FCFA)',
          type: 'range',
          min: 50000000,
          max: 300000000,
          step: 5000000,
          tooltip: 'Le montant total que vous êtes prêt à investir dans l\'achat de votre logement, incluant tous les frais (notaire, enregistrement, etc.)',
          required: true
        },
        {
          name: 'apportPersonnel',
          label: 'Apport personnel (FCFA)',
          type: 'range',
          min: 0,
          max: 100000000,
          step: 1000000,
          tooltip: 'La somme d\'argent dont vous disposez immédiatement pour financer l\'achat (épargne, vente d\'un bien, aide familiale, etc.). Généralement entre 20% et 30% du prix.',
          required: true
        },
        {
          name: 'capaciteMensuelle',
          label: 'Capacité de remboursement mensuelle (FCFA)',
          type: 'range',
          min: 100000,
          max: 3000000,
          step: 50000,
          tooltip: 'Le montant maximum que vous pouvez consacrer chaque mois au remboursement de votre prêt immobilier. En général, il ne doit pas dépasser 33% de vos revenus mensuels.',
          required: true
        },
        {
          name: 'besoinFinancement',
          label: 'Besoin de financement',
          type: 'radio',
          options: ['Oui, déjà approuvé', 'Oui, en cours', 'Oui, à démarrer', 'Non, paiement comptant'],
          tooltip: 'Indiquez si vous avez besoin d\'un crédit immobilier pour financer votre achat et à quel stade en est votre demande.'
        },
        {
          name: 'pourcentageReservation',
          label: 'Pourcentage pour la réservation',
          type: 'select',
          options: ['20%', '25%', '30%', '35%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
          tooltip: 'Quel pourcentage du prix total êtes-vous prêt à verser pour réserver votre logement ? Ce montant servira d\'acompte et sera déduit du prix final.',
          required: true
        },
        {
          name: 'pretPayerCashAvecReduction',
          label: 'Avec une réduction de 5%, seriez-vous prêt à payer comptant (cash) ?',
          type: 'radio',
          options: ['Oui', 'Non', 'À étudier'],
          tooltip: 'Nous proposons une réduction de 5% sur le prix total pour tout paiement comptant. Cette offre vous intéresse-t-elle ?',
          required: true
        },
        {
          name: 'delaiObtentionPret',
          label: 'Délai d\'obtention du prêt',
          type: 'select',
          options: ['Déjà obtenu', '1-3 mois', '3-6 mois', '6-12 mois', 'Non concerné'],
          tooltip: 'Le temps estimé avant d\'obtenir l\'accord de financement de votre banque. Cela nous aide à planifier votre projet d\'achat.'
        },
        {
          name: 'banquePreferee',
          label: 'Banque partenaire préférée',
          type: 'text',
          tooltip: 'Si vous avez déjà une banque en tête ou avec laquelle vous travaillez habituellement (SGCI, BICICI, Ecobank, BOA, etc.)'
        }
      ]
    },
    {
      title: "Équipements et Commodités",
      icon: "⚡",
      questions: [
        {
          name: 'equipementsEssentiels',
          label: 'Équipements essentiels',
          type: 'checkbox',
          options: ['Climatisation', 'Cuisine équipée', 'Placards intégrés', 'Système de sécurité', 'Panneaux solaires', 'Groupe électrogène']
        },
        {
          name: 'proximiteServices',
          label: 'Proximité des services',
          type: 'checkbox',
          options: ['Écoles', 'Hôpitaux', 'Commerces', 'Transports', 'Loisirs', 'Mosquées/Églises'],
          required: true
        },
        {
          name: 'styleArchitectural',
          label: 'Style architectural préféré',
          type: 'radio',
          options: ['Moderne', 'Classique', 'Contemporain', 'Mixte']
        },
        {
          name: 'orientationPreferee',
          label: 'Orientation préférée',
          type: 'select',
          options: ['Nord', 'Sud', 'Est', 'Ouest', 'Pas de préférence']
        },
        {
          name: 'importanceVue',
          label: 'Importance de la vue',
          type: 'range',
          min: 0,
          max: 10,
          step: 1
        },
        {
          name: 'besoinExterieur',
          label: 'Espaces extérieurs souhaités',
          type: 'checkbox',
          options: ['Jardin', 'Terrasse', 'Balcon', 'Garage', 'Piscine', 'Espace barbecue'],
          required: true
        }
      ]
    },
    {
      title: "Localisation",
      icon: "📍",
      questions: [
        {
          name: 'distanceTravail',
          label: 'Distance maximale du travail (km)',
          type: 'range',
          min: 0,
          max: 50,
          step: 1,
          tooltip: 'La distance maximale que vous êtes prêt à parcourir entre votre domicile et votre lieu de travail. Cela nous aide à évaluer si l\'emplacement de la CITÉ KONGO correspond à vos contraintes de déplacement quotidien.'
        },
        {
          name: 'proximiteEcoles',
          label: 'Proximité des écoles',
          type: 'radio',
          options: ['Très importante', 'Importante', 'Peu importante', 'Non concerné']
        },
        {
          name: 'acceTransports',
          label: 'Accès aux transports',
          type: 'radio',
          options: ['Indispensable', 'Souhaitable', 'Pas important']
        },
        {
          name: 'environnementSouhaite',
          label: 'Environnement souhaité',
          type: 'select',
          options: ['Calme et résidentiel', 'Animé', 'Mixte', 'Pas de préférence']
        },
        {
          name: 'securiteImportance',
          label: 'Importance de la sécurité',
          type: 'range',
          min: 0,
          max: 10,
          step: 1
        }
      ]
    },
    {
      title: "Calendrier et Disponibilité",
      icon: "📅",
      questions: [
        {
          name: 'delaiAchat',
          label: 'Délai d\'achat souhaité',
          type: 'select',
          options: ['Immédiat', '1-3 mois', '3-6 mois', '6-12 mois', 'Plus de 12 mois'],
          required: true
        },
        { name: 'dateEmmenagement', label: 'Date d\'emménagement souhaitée', type: 'date' },
        {
          name: 'logementActuel',
          label: 'Situation de logement actuelle',
          type: 'radio',
          options: ['Locataire', 'Propriétaire', 'Hébergé', 'Autre'],
          required: true
        },
        {
          name: 'delaLiberation',
          label: 'Délai de libération du logement actuel',
          type: 'select',
          options: ['Immédiat', '1 mois', '3 mois', '6 mois', 'Non concerné']
        },
        {
          name: 'urgenceAchat',
          label: 'Niveau d\'urgence de l\'achat',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          required: true
        },
        {
          name: 'flexibiliteDelai',
          label: 'Flexibilité sur les délais',
          type: 'radio',
          options: ['Très flexible', 'Moyennement flexible', 'Peu flexible', 'Pas flexible'],
          required: true
        }
      ]
    },
    {
      title: "Besoins Spécifiques",
      icon: "🎯",
      questions: [
        {
          name: 'handicapAdaptation',
          label: 'Besoin d\'adaptation handicap',
          type: 'radio',
          options: ['Oui', 'Non', 'À prévoir']
        },
        {
          name: 'espaceVoiture',
          label: 'Espace de stationnement',
          type: 'radio',
          options: ['Garage fermé', 'Place couverte', 'Place extérieure', 'Non nécessaire']
        },
        {
          name: 'nombreVehicules',
          label: 'Nombre de véhicules',
          type: 'range',
          min: 0,
          max: 5,
          step: 1
        },
        {
          name: 'besoinStockage',
          label: 'Besoin de stockage supplémentaire',
          type: 'radio',
          options: ['Oui, important', 'Souhaitable', 'Non nécessaire']
        },
        {
          name: 'animauxCompagnie',
          label: 'Animaux de compagnie',
          type: 'select',
          options: ['Aucun', 'Chat', 'Chien petit', 'Chien grand', 'Autres']
        },
        {
          name: 'bureauTeletravail',
          label: 'Bureau pour télétravail',
          type: 'radio',
          options: ['Indispensable', 'Souhaitable', 'Non nécessaire']
        }
      ]
    },
    {
      title: "Motivations et Priorités",
      icon: "🎖️",
      questions: [
        {
          name: 'raisonAchat',
          label: 'Raison principale de l\'achat',
          type: 'select',
          options: ['Résidence principale', 'Investissement locatif', 'Résidence secondaire', 'Revente', 'Autre'],
          required: true
        },
        {
          name: 'prioritesPrincipales',
          label: 'Classez vos 3 priorités principales (Premier, Second, Troisième)',
          type: 'ranking',
          options: [
            'Prix abordable',
            'Localisation stratégique',
            'Superficie adaptée',
            'Qualité de construction',
            'Design moderne',
            'Sécurité du quartier',
            'Proximité services',
            'Facilités de financement',
            'Délai de livraison',
            'Budget maîtrisé',
            'Potentiel de revente',
            'Équipements modernes'
          ],
          required: true,
          maxSelections: 3
        },
        {
          name: 'informationsSup',
          label: 'Informations supplémentaires souhaitées',
          type: 'textarea'
        },
        {
          name: 'evolutionFamiliale',
          label: 'Évolution familiale prévue (5 ans)',
          type: 'select',
          options: ['Aucune', 'Agrandissement', 'Réduction', 'Incertain']
        }
      ]
    },
    {
      title: "Engagement et Suivi",
      icon: "✅",
      questions: [
        {
          name: 'niveauInteret',
          label: 'Niveau d\'intérêt pour Cité KONGO',
          type: 'range',
          min: 0,
          max: 10,
          step: 1
        },
        {
          name: 'souhaitVisite',
          label: 'Souhaitez-vous visiter le projet ?',
          type: 'radio',
          options: ['Oui', 'Non', 'Peut-être plus tard'],
          required: true,
          tooltip: 'Voulez-vous programmer une visite pour découvrir notre projet immobilier ?'
        },
        {
          name: 'avisSurProjet',
          label: 'Votre opinion sur notre projet',
          type: 'select',
          options: ['Très intéressé', 'Intéressé', 'Moyennement intéressé', 'Peu intéressé', 'Pas encore décidé'],
          required: true,
          tooltip: 'Quel est votre niveau d\'intérêt pour le projet Cité KONGO ?'
        },
        {
          name: 'disponibiliteVisite',
          label: 'Disponibilité pour visite',
          type: 'checkbox',
          options: ['Lundi-Vendredi matin', 'Lundi-Vendredi après-midi', 'Samedi', 'Dimanche', 'Tous les jours']
        },
        {
          name: 'modeContactPrefere',
          label: 'Mode de contact préféré',
          type: 'radio',
          options: ['Téléphone', 'Email', 'WhatsApp', 'Visite directe']
        },
        {
          name: 'autoriseContact',
          label: 'Autorise le suivi commercial',
          type: 'radio',
          options: ['Oui', 'Non']
        },
        {
          name: 'commentaires',
          label: 'Commentaires ou questions',
          type: 'textarea'
        },
        {
          name: 'newsletter',
          label: 'Inscription à la newsletter',
          type: 'radio',
          options: ['Oui', 'Non'],
          required: true,
          tooltip: 'Souhaitez-vous recevoir nos actualités et offres spéciales ?'
        },
        {
          name: 'consentementDonnees',
          label: 'J\'accepte que mes données soient utilisées pour le traitement de ma demande',
          type: 'radio',
          options: ['Oui', 'Non'],
          required: true,
          tooltip: 'Vos données seront utilisées uniquement dans le cadre de votre projet immobilier et ne seront pas partagées avec des tiers.'
        }
      ]
    }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  // Fonction de validation des champs obligatoires
  const validateCurrentStep = () => {
    const currentStepData = steps[currentStep];
    const requiredQuestions = currentStepData.questions.filter(q => q.required);

    const missingFields = [];

    for (const question of requiredQuestions) {
      const value = formData[question.name];

      // Vérifier si le champ est vide
      if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(question.label);
      }
    }

    if (missingFields.length > 0) {
      alert(`Veuillez remplir les champs obligatoires suivants:\n\n${missingFields.map(f => `• ${f}`).join('\n')}`);
      return false;
    }

    // Validation spécifique du format d'email
    if (formData.email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        alert('Veuillez entrer une adresse email valide (exemple: utilisateur@domaine.com)');
        return false;
      }
    }

    return true;
  };

  const handleNext = (e) => {
    // Empêcher la soumission du formulaire
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Valider les champs obligatoires avant de continuer
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fonction de transformation des données pour correspondre au modèle backend
  const transformDataForBackend = (data) => {
    // ID projet CITÉ KONGO (à remplacer par l'ID réel depuis la base de données)
    const CITE_KONGO_PROJECT_ID = '673ad67a2b3c4d5e6f7890ab';

    return {
      // Champs requis de base
      projet_id: CITE_KONGO_PROJECT_ID,
      logement_id: data.logementId || null,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email,

      // Type de bien recherché
      type_bien_interesse: data.typeLogement || '',

      // DÉMOGRAPHIE
      demographics: {
        gender: data.genre || '',
        age: parseInt(data.age) || null,
        familyStatus: data.situationFamiliale || '',
        childrenCount: parseInt(data.nombreEnfants) || 0,
        professionalCategory: data.categorieProfessionnelle || '',
        csp: data.profession || '',
        activitySector: data.secteurActivite || '',
        monthlyIncome: data.revenuMensuel ? data.revenuMensuel.toString() : '',
        jobStability: data.stabiliteEmploi || '',
        countryOfResidence: data.paysResidence || '',
        nationality: data.nationalite || ''
      },

      // SITUATION ACTUELLE
      currentSituation: {
        housingStatus: data.logementActuel || '',
        currentRent: parseInt(data.loyerActuel) || 0,
        city: data.villeActuelle || '',
        housingType: data.typeLogementActuel || '',
        roomCount: parseInt(data.nombrePiecesActuelles) || 0
      },

      // MOTIVATIONS
      motivations: {
        purchaseReason: data.raisonAchat || '',
        timeline: data.delaiAchat || '',
        isFirstPurchase: data.premierAchat === 'oui'
      },

      // PRÉFÉRENCES
      preferences: {
        propertyType: data.typeLogement || '',
        quantityDesired: parseInt(data.quantiteLogements) || 1,
        roomsDesired: parseInt(data.nombrePieces) || 0,
        priorityFeatures: Array.isArray(data.equipementsEssentiels) ? data.equipementsEssentiels : []
      },

      // BUDGET
      budget: {
        globalBudget: parseInt(data.budgetTotal) || 0,
        monthlyCapacity: parseInt(data.capaciteMensuelle) || 0,
        financingMode: data.besoinFinancement || '',
        downPaymentAvailable: parseInt(data.apportPersonnel) || 0,
        reservationPercentage: data.pourcentageReservation || '',
        willingToPayCashWithDiscount: data.pretPayerCashAvecReduction || ''
      },

      // CRITÈRES D'IMPORTANCE (sur échelle 1-10 dans le frontend, convertir en 1-5)
      criteria: {
        security: Math.ceil((parseInt(data.securiteImportance) || 5) / 2),
        quality: Math.ceil((parseInt(data.qualiteImportance) || 5) / 2),
        accessibility: Math.ceil((parseInt(data.accessibiliteImportance) || 5) / 2),
        greenSpaces: Math.ceil((parseInt(data.espacesVertsImportance) || 5) / 2),
        services: Math.ceil((parseInt(data.servicesImportance) || 5) / 2),
        quietness: Math.ceil((parseInt(data.calmeImportance) || 5) / 2),
        investment: Math.ceil((parseInt(data.investissementImportance) || 5) / 2),
        modernity: Math.ceil((parseInt(data.moderniteImportance) || 5) / 2),
        proximity: Math.ceil((parseInt(data.proximiteImportance) || 5) / 2),
        standing: Math.ceil((parseInt(data.standingImportance) || 5) / 2)
      },

      // LOCALISATION
      location: {
        preferredZones: Array.isArray(data.quartiersPreferences) ? data.quartiersPreferences :
                        (data.quartierPrefere ? [data.quartierPrefere] : []),
        proximityImportance: data.proximiteEcoles || '',
        maxDistanceWork: data.distanceTravail ? `${data.distanceTravail} km` : ''
      },

      // CONNAISSANCE DU PROJET
      projectKnowledge: {
        howKnown: data.commentConnu || '',
        projectOpinion: data.avisSurProjet || '',
        wantVisit: data.souhaitVisite === 'Oui',
        visitAvailability: Array.isArray(data.disponibiliteVisite) ?
                          data.disponibiliteVisite.join(', ') : '',
        specificQuestions: data.questionsPrecises || '',
        concernsOrDoubts: data.preoccupationsPrincipales ?
                         (Array.isArray(data.preoccupationsPrincipales) ?
                          data.preoccupationsPrincipales.join(', ') :
                          data.preoccupationsPrincipales) : '',
        decisionCriteria: Array.isArray(data.criteresDecision) ?
                         data.criteresDecision :
                         (data.critereDecisif ? [data.critereDecisif] : [])
      },

      // CONTACT FINAL
      finalContact: {
        confirmName: `${data.prenom} ${data.nom}`,
        confirmPhone: data.telephone,
        confirmEmail: data.email,
        preferredContactMethod: data.modeContactPrefere || '',
        bestContactTime: data.meilleureHeure || '',
        newsletterConsent: data.newsletter === 'Oui',
        dataUsageConsent: data.consentementDonnees === 'Oui'
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Transformer les données avant l'envoi
      const transformedData = transformDataForBackend(formData);

      // Récupérer le code apporteur du sessionStorage
      const codeApporteur = sessionStorage.getItem('codeApporteur');
      if (codeApporteur) {
        transformedData.codeApporteur = codeApporteur;
      }

      const response = await fetch(`${API_URL}/api/questionnaires/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });

      const responseData = await response.json();

      if (response.ok) {
        // Nettoyer le sessionStorage
        sessionStorage.removeItem('codeApporteur');
        sessionStorage.removeItem('apporteurInfo');

        // Stocker le résultat et afficher le modal de succès
        setSubmissionResult({
          numeroDossier: responseData.data?.numeroDossier || responseData.numeroDossier,
          scoreInteret: responseData.data?.score_interet || responseData.score_interet,
          qualification: responseData.data?.qualification || responseData.qualification
        });
        setShowSuccessModal(true);
      } else {
        console.error('Erreur backend:', responseData);

        // Afficher le message spécifique du backend (notamment pour les doublons)
        if (responseData.duplicate) {
          alert(responseData.message || 'Vous avez déjà rempli ce questionnaire. Merci pour votre intérêt !');
        } else {
          alert(responseData.message || 'Erreur lors de la soumission. Veuillez réessayer.');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Copier le numéro de dossier
  const handleCopyDossier = () => {
    if (submissionResult?.numeroDossier) {
      navigator.clipboard.writeText(submissionResult.numeroDossier);
      setCopiedDossier(true);
      setTimeout(() => setCopiedDossier(false), 2000);
    }
  };

  // Fermer le modal de succès et naviguer
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/option-achat');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const formatValue = (value, type, min, max) => {
    if (type === 'range') {
      if (max >= 1000000) {
        const millions = value / 1000000;
        // Si c'est un nombre entier de millions
        if (millions % 1 === 0) {
          return `${millions} M`;
        }
        // Sinon afficher avec une décimale (pour 0,5M, 1,5M, etc.)
        return `${millions.toFixed(1).replace('.', ',')} M`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  // Afficher un loading pendant le chargement
  if (loading || steps.length === 0) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Questionnaire Personnalisé</h1>
            <p className="hero-subtitle">Chargement...</p>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
          <div className="loading-spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #2c5aa0',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Chargement du questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Questionnaire Personnalisé</h1>
          <p className="hero-subtitle">
            Aidez-nous à trouver le logement idéal pour vous
          </p>
        </div>
      </div>

      <div className="container">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="progress-info">
            <span className="progress-text">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="progress-percent">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="steps-indicators">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            // Empêcher la soumission du formulaire avec Entrée sauf si on est sur le dernier step
            if (e.key === 'Enter' && currentStep < steps.length - 1) {
              e.preventDefault();
            }
          }}
          className="questionnaire-form"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="step-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-header">
                <span className="step-icon-large">{currentStepData.icon}</span>
                <h2>{currentStepData.title}</h2>
                <p>Veuillez remplir les informations suivantes</p>
              </div>

              <div className="questions-grid">
                {currentStepData.questions.map((question, index) => (
                  <div key={question.name} className="question-group">
                    <label htmlFor={question.name}>
                      {question.label}
                      {question.required && <span className="required">*</span>}
                      {question.tooltip && (
                        <span className="tooltip-wrapper">
                          <span className="tooltip-icon">ℹ️</span>
                          <span className="tooltip-text">{question.tooltip}</span>
                        </span>
                      )}
                    </label>

                    {question.type === 'text' && (
                      <input
                        type="text"
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                        required={question.required}
                        placeholder={`Entrez votre ${question.label.toLowerCase()}`}
                      />
                    )}

                    {question.type === 'email' && (
                      <input
                        type="email"
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                        required={question.required}
                        placeholder="exemple@email.com"
                      />
                    )}

                    {question.type === 'tel' && (
                      <input
                        type="tel"
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                        required={question.required}
                        placeholder={
                          formData.paysResidence && paysAvecPrefixes[formData.paysResidence]
                            ? `${paysAvecPrefixes[formData.paysResidence]} XX XX XX XX XX`
                            : "+XXX XX XX XX XX XX"
                        }
                      />
                    )}

                    {question.type === 'date' && (
                      <input
                        type="date"
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                      />
                    )}

                    {question.type === 'select' && (
                      <select
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                      >
                        <option value="">Sélectionnez une option</option>
                        {question.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {question.type === 'range' && (
                      <div className="range-input">
                        <input
                          type="range"
                          id={question.name}
                          min={question.min}
                          max={question.max}
                          step={question.step}
                          value={formData[question.name]}
                          onChange={(e) => handleChange(question.name, parseInt(e.target.value))}
                        />
                        <div className="range-value">
                          {formatValue(formData[question.name], 'range', question.min, question.max)}
                          {question.name.includes('budget') || question.name.includes('apport') || question.name.includes('capacite') || question.name.includes('revenu') ? ' FCFA' : ''}
                          {question.name.includes('distance') ? ' km' : ''}
                          {question.name.includes('importance') || question.name.includes('niveau') || question.name.includes('urgence') || question.name.includes('securite') ? '/10' : ''}
                        </div>
                      </div>
                    )}

                    {question.type === 'radio' && (
                      <div className="radio-group">
                        {question.options.map(option => (
                          <label key={option} className="radio-label">
                            <input
                              type="radio"
                              name={question.name}
                              value={option}
                              checked={formData[question.name] === option}
                              onChange={(e) => handleChange(question.name, e.target.value)}
                            />
                            <span className="radio-custom"></span>
                            <span className="radio-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'checkbox' && (
                      <div className="checkbox-group">
                        {question.options.map(option => (
                          <label key={option} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={(formData[question.name] || []).includes(option)}
                              onChange={() => handleCheckboxChange(question.name, option)}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'ranking' && (
                      <div className="ranking-group">
                        {['Premier', 'Second', 'Troisième'].map((rang, index) => (
                          <div key={rang} className="ranking-item">
                            <label>{rang} choix :</label>
                            <select
                              value={(formData[question.name] || [])[index] || ''}
                              onChange={(e) => {
                                const currentRankings = formData[question.name] || [];
                                const newRankings = [...currentRankings];
                                newRankings[index] = e.target.value;
                                // Vérifier qu'il n'y a pas de doublons
                                const filtered = newRankings.filter((item, idx) =>
                                  !item || idx === index || item !== e.target.value
                                );
                                if (filtered.length === newRankings.length) {
                                  handleChange(question.name, newRankings);
                                } else {
                                  alert('Cette priorité a déjà été sélectionnée');
                                }
                              }}
                              required={question.required && index === 0}
                            >
                              <option value="">Sélectionnez une priorité</option>
                              {question.options.map(option => {
                                const isDisabled = formData[question.name] &&
                                  formData[question.name].includes(option) &&
                                  formData[question.name][index] !== option;
                                return (
                                  <option
                                    key={option}
                                    value={option}
                                    disabled={isDisabled}
                                  >
                                    {option}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'textarea' && (
                      <textarea
                        id={question.name}
                        value={formData[question.name]}
                        onChange={(e) => handleChange(question.name, e.target.value)}
                        rows="4"
                        placeholder="Partagez vos pensées..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="btn btn-secondary"
            >
              Précédent
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={(e) => handleNext(e)}
                className="btn btn-primary"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary btn-submit"
              >
                Soumettre le questionnaire
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal de Succès avec Numéro de Dossier */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="success-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="success-modal-icon">
                <FaCheckCircle />
              </div>

              <h2>Questionnaire Soumis avec Succès !</h2>

              <p className="success-message">
                Merci pour votre intérêt. Notre équipe vous contactera dans les 24h.
              </p>

              {submissionResult?.numeroDossier && (
                <div className="dossier-section">
                  <p className="dossier-label">
                    <FaFileAlt /> Votre Numéro de Dossier
                  </p>
                  <div className="dossier-number-container">
                    <span className="dossier-number">
                      {submissionResult.numeroDossier}
                    </span>
                    <button
                      className="copy-btn"
                      onClick={handleCopyDossier}
                      title="Copier"
                    >
                      <FaCopy />
                      {copiedDossier && <span className="copied-text">Copié !</span>}
                    </button>
                  </div>
                  <p className="dossier-info">
                    Conservez ce numéro précieusement. Il vous sera demandé
                    pour le suivi de votre dossier.
                  </p>
                </div>
              )}

              <button
                className="btn btn-primary btn-large"
                onClick={handleCloseSuccessModal}
              >
                <FaHome /> Retour à l'accueil
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Questionnaire;
