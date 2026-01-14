const express = require('express');
const router = express.Router();
const lotController = require('../controllers/lotController');

// ==================== ROUTES LOTS ====================

// GET - Récupérer tous les lots
router.get('/', lotController.getAllLots);

// GET - Statistiques des lots
router.get('/stats', lotController.getLotsStats);

// GET - Lots disponibles (pour frontend user)
router.get('/disponibles', lotController.getLotsDisponibles);

// GET - Lots par type
router.get('/type/:type', lotController.getLotsByType);

// GET - Lot par numéro
router.get('/numero/:numero', lotController.getLotByNumero);

// POST - Créer un lot
router.post('/', lotController.createLot);

// POST - Créer plusieurs lots en masse
router.post('/bulk', lotController.createLotsEnMasse);

// PUT - Mettre à jour un lot
router.put('/:id', lotController.updateLot);

// PATCH - Mettre à jour le statut d'un lot
router.patch('/:id/statut', lotController.updateLotStatut);

// POST - Réserver un lot (frontend user)
router.post('/:id/reserver', lotController.reserverLot);

// DELETE - Supprimer un lot
router.delete('/:id', lotController.deleteLot);

// DELETE - Supprimer tous les lots
router.delete('/all/delete', lotController.deleteAllLots);

// ==================== ROUTES PLAN DE MASSE CONFIG ====================

// GET - Configuration du plan de masse
router.get('/plan-masse/config', lotController.getPlanMasseConfig);

// PUT - Mettre à jour la configuration
router.put('/plan-masse/config', lotController.updatePlanMasseConfig);

// POST - Uploader l'image du plan de masse
router.post('/plan-masse/image', lotController.uploadPlanMasseImage);

// GET - Récupérer l'image du plan de masse
router.get('/plan-masse/image', lotController.getPlanMasseImage);

module.exports = router;
