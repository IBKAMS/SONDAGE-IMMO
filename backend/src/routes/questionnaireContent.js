const express = require('express');
const router = express.Router();
const questionnaireContentController = require('../controllers/questionnaireContentController');

// Obtenir le contenu du questionnaire
router.get('/', questionnaireContentController.getContent);

// Mettre à jour le contenu complet
router.put('/:id', questionnaireContentController.updateContent);

// Ajouter une nouvelle étape
router.post('/:id/steps', questionnaireContentController.addStep);

// Supprimer une étape
router.delete('/:id/steps/:stepIndex', questionnaireContentController.deleteStep);

// Ajouter une question à une étape
router.post('/:id/steps/:stepIndex/questions', questionnaireContentController.addQuestion);

// Supprimer une question
router.delete('/:id/steps/:stepIndex/questions/:questionIndex', questionnaireContentController.deleteQuestion);

// Réinitialiser aux valeurs par défaut
router.post('/:id/reset', questionnaireContentController.resetToDefault);

module.exports = router;
