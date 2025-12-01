const express = require('express');
const router = express.Router();
const questionnaireContentController = require('../controllers/questionnaireContentController');

// GET - Récupérer le contenu
router.get('/', questionnaireContentController.getContent);

// PUT - Mettre à jour le contenu
router.put('/:id', questionnaireContentController.updateContent);

// POST - Réinitialiser aux valeurs par défaut
router.post('/:id/reset', questionnaireContentController.resetToDefault);

// POST - Forcer réinitialisation complète (supprimer et recréer)
router.post('/force-reset', questionnaireContentController.forceReset);

module.exports = router;
