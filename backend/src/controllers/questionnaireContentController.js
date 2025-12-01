const QuestionnaireContent = require('../models/QuestionnaireContent');

// Valeurs par défaut
const defaultContent = {
  title: 'Questionnaire',
  subtitle: 'Répondez à quelques questions pour personnaliser votre projet immobilier',
  steps: [
    {
      stepNumber: 1,
      title: 'Informations Personnelles',
      icon: 'FaUser',
      description: 'Vos coordonnées de contact',
      isActive: true,
      questions: [
        { name: 'nom', label: 'Votre Nom', type: 'text', required: true, placeholder: 'Entrez votre nom', isActive: true, order: 1 },
        { name: 'prenom', label: 'Votre Prénom', type: 'text', required: true, placeholder: 'Entrez votre prénom', isActive: true, order: 2 },
        { name: 'email', label: 'Votre Email', type: 'email', required: true, placeholder: 'exemple@email.com', isActive: true, order: 3 },
        { name: 'telephone', label: 'Votre Téléphone', type: 'tel', required: true, placeholder: '+225 XX XX XX XX XX', isActive: true, order: 4 }
      ]
    },
    {
      stepNumber: 2,
      title: 'Situation Professionnelle',
      icon: 'FaBriefcase',
      description: 'Votre activité professionnelle',
      isActive: true,
      questions: [
        {
          name: 'profession',
          label: 'Votre Profession',
          type: 'select',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Salarié du secteur privé', value: 'salarie_prive' },
            { label: 'Fonctionnaire', value: 'fonctionnaire' },
            { label: 'Chef d\'entreprise', value: 'chef_entreprise' },
            { label: 'Profession libérale', value: 'liberal' },
            { label: 'Retraité', value: 'retraite' },
            { label: 'Autre', value: 'autre' }
          ]
        },
        {
          name: 'anciennete',
          label: 'Ancienneté dans votre poste',
          type: 'select',
          required: true,
          isActive: true,
          order: 2,
          options: [
            { label: 'Moins d\'1 an', value: 'moins_1an' },
            { label: '1 à 3 ans', value: '1_3ans' },
            { label: '3 à 5 ans', value: '3_5ans' },
            { label: 'Plus de 5 ans', value: 'plus_5ans' }
          ]
        }
      ]
    },
    {
      stepNumber: 3,
      title: 'Situation Familiale',
      icon: 'FaUsers',
      description: 'Votre composition familiale',
      isActive: true,
      questions: [
        {
          name: 'situationFamiliale',
          label: 'Votre situation familiale',
          type: 'radio',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Célibataire', value: 'celibataire' },
            { label: 'Marié(e)', value: 'marie' },
            { label: 'En couple', value: 'couple' },
            { label: 'Divorcé(e)', value: 'divorce' },
            { label: 'Veuf/Veuve', value: 'veuf' }
          ]
        },
        {
          name: 'nombreEnfants',
          label: 'Nombre d\'enfants',
          type: 'select',
          required: true,
          isActive: true,
          order: 2,
          options: [
            { label: '0', value: '0' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4 ou plus', value: '4+' }
          ]
        }
      ]
    },
    {
      stepNumber: 4,
      title: 'Budget',
      icon: 'FaMoneyBillWave',
      description: 'Votre capacité financière',
      isActive: true,
      questions: [
        {
          name: 'revenuMensuel',
          label: 'Revenu mensuel net (FCFA)',
          type: 'range',
          required: true,
          isActive: true,
          order: 1,
          min: 100000,
          max: 5000000,
          step: 100000,
          minLabel: '100K',
          maxLabel: '5M+'
        },
        {
          name: 'apportPersonnel',
          label: 'Apport personnel disponible (FCFA)',
          type: 'range',
          required: true,
          isActive: true,
          order: 2,
          min: 0,
          max: 50000000,
          step: 1000000,
          minLabel: '0',
          maxLabel: '50M+'
        }
      ]
    },
    {
      stepNumber: 5,
      title: 'Type de Logement',
      icon: 'FaHome',
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
          options: [
            { label: 'Appartement', value: 'appartement' },
            { label: 'Maison individuelle', value: 'maison' },
            { label: 'Duplex', value: 'duplex' },
            { label: 'Villa', value: 'villa' }
          ]
        },
        {
          name: 'nombreChambres',
          label: 'Nombre de chambres',
          type: 'radio',
          required: true,
          isActive: true,
          order: 2,
          options: [
            { label: '1 chambre', value: '1' },
            { label: '2 chambres', value: '2' },
            { label: '3 chambres', value: '3' },
            { label: '4+ chambres', value: '4+' }
          ]
        }
      ]
    },
    {
      stepNumber: 6,
      title: 'Localisation',
      icon: 'FaMapMarkerAlt',
      description: 'Vos préférences de quartier',
      isActive: true,
      questions: [
        {
          name: 'quartierPrefere',
          label: 'Quartier préféré',
          type: 'select',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Cocody', value: 'cocody' },
            { label: 'Marcory', value: 'marcory' },
            { label: 'Plateau', value: 'plateau' },
            { label: 'Riviera', value: 'riviera' },
            { label: 'Angré', value: 'angre' },
            { label: 'Autre', value: 'autre' }
          ]
        },
        {
          name: 'distanceMaxTravail',
          label: 'Distance max du lieu de travail',
          type: 'radio',
          required: false,
          isActive: true,
          order: 2,
          options: [
            { label: 'Moins de 15 min', value: '15min' },
            { label: '15-30 min', value: '30min' },
            { label: '30-45 min', value: '45min' },
            { label: 'Plus de 45 min', value: '45min+' }
          ]
        }
      ]
    },
    {
      stepNumber: 7,
      title: 'Financement',
      icon: 'FaCreditCard',
      description: 'Mode de financement souhaité',
      isActive: true,
      questions: [
        {
          name: 'modeFinancement',
          label: 'Mode de financement préféré',
          type: 'radio',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Paiement comptant', value: 'comptant' },
            { label: 'Crédit bancaire', value: 'credit' },
            { label: 'Échelonnement promoteur', value: 'echelonnement' },
            { label: 'À déterminer', value: 'indetermine' }
          ]
        },
        {
          name: 'dureePret',
          label: 'Durée de prêt souhaitée',
          type: 'radio',
          required: false,
          isActive: true,
          order: 2,
          options: [
            { label: '5 ans', value: '5ans' },
            { label: '10 ans', value: '10ans' },
            { label: '15 ans', value: '15ans' },
            { label: '20 ans', value: '20ans' }
          ]
        }
      ]
    },
    {
      stepNumber: 8,
      title: 'Priorités',
      icon: 'FaStar',
      description: 'Vos critères prioritaires',
      isActive: true,
      questions: [
        {
          name: 'priorites',
          label: 'Vos 3 critères prioritaires',
          type: 'checkbox',
          required: true,
          isActive: true,
          order: 1,
          maxSelections: 3,
          options: [
            { label: 'Prix abordable', value: 'prix' },
            { label: 'Emplacement', value: 'emplacement' },
            { label: 'Surface', value: 'surface' },
            { label: 'Standing', value: 'standing' },
            { label: 'Sécurité', value: 'securite' },
            { label: 'Parking', value: 'parking' },
            { label: 'Espaces verts', value: 'espaces_verts' }
          ]
        }
      ]
    },
    {
      stepNumber: 9,
      title: 'Délai',
      icon: 'FaClock',
      description: 'Votre projet dans le temps',
      isActive: true,
      questions: [
        {
          name: 'delaiAchat',
          label: 'Quand souhaitez-vous acheter ?',
          type: 'radio',
          required: true,
          isActive: true,
          order: 1,
          options: [
            { label: 'Immédiatement', value: 'immediat' },
            { label: 'Dans 3 mois', value: '3mois' },
            { label: 'Dans 6 mois', value: '6mois' },
            { label: 'Dans 1 an', value: '1an' },
            { label: 'Plus tard', value: 'plus_tard' }
          ]
        }
      ]
    },
    {
      stepNumber: 10,
      title: 'Commentaires',
      icon: 'FaComment',
      description: 'Informations complémentaires',
      isActive: true,
      questions: [
        {
          name: 'commentaires',
          label: 'Avez-vous des questions ou commentaires ?',
          type: 'textarea',
          required: false,
          placeholder: 'Partagez vos attentes, questions ou remarques...',
          isActive: true,
          order: 1
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
