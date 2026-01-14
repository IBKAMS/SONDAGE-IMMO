const Lot = require('../models/Lot');
const PlanMasseConfig = require('../models/PlanMasseConfig');

// ==================== LOTS ====================

// Récupérer tous les lots
exports.getAllLots = async (req, res) => {
  try {
    const lots = await Lot.find().sort({ numero: 1 });
    res.json(lots);
  } catch (error) {
    console.error('Erreur getAllLots:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lots' });
  }
};

// Récupérer les lots par type
exports.getLotsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const lots = await Lot.find({ type }).sort({ numero: 1 });
    res.json(lots);
  } catch (error) {
    console.error('Erreur getLotsByType:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lots' });
  }
};

// Récupérer les lots disponibles (pour le frontend user)
exports.getLotsDisponibles = async (req, res) => {
  try {
    const lots = await Lot.find({ statut: 'disponible' }).sort({ numero: 1 });
    res.json(lots);
  } catch (error) {
    console.error('Erreur getLotsDisponibles:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des lots disponibles' });
  }
};

// Récupérer un lot par numéro
exports.getLotByNumero = async (req, res) => {
  try {
    const { numero } = req.params;
    const lot = await Lot.findOne({ numero });

    if (!lot) {
      return res.status(404).json({ error: 'Lot non trouvé' });
    }

    res.json(lot);
  } catch (error) {
    console.error('Erreur getLotByNumero:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du lot' });
  }
};

// Créer un nouveau lot
exports.createLot = async (req, res) => {
  try {
    const { numero, type, prix, superficie, position, description } = req.body;

    if (!numero || !type || !position) {
      return res.status(400).json({ error: 'Numéro, type et position requis' });
    }

    // Vérifier si le lot existe déjà
    const existingLot = await Lot.findOne({ numero });
    if (existingLot) {
      return res.status(400).json({ error: 'Un lot avec ce numéro existe déjà' });
    }

    const newLot = new Lot({
      numero,
      type,
      prix: prix || 0,
      superficie: superficie || 0,
      position,
      description: description || '',
      statut: 'disponible'
    });

    await newLot.save();
    res.status(201).json({ success: true, lot: newLot });
  } catch (error) {
    console.error('Erreur createLot:', error);
    res.status(500).json({ error: 'Erreur lors de la création du lot' });
  }
};

// Créer plusieurs lots en une fois (bulk)
exports.createLotsEnMasse = async (req, res) => {
  try {
    const { lots } = req.body;

    if (!lots || !Array.isArray(lots)) {
      return res.status(400).json({ error: 'Tableau de lots requis' });
    }

    // Supprimer tous les lots existants et les remplacer
    await Lot.deleteMany({});

    // Insérer les nouveaux lots
    const insertedLots = await Lot.insertMany(lots);

    res.json({
      success: true,
      message: `${insertedLots.length} lots créés avec succès`,
      lots: insertedLots
    });
  } catch (error) {
    console.error('Erreur createLotsEnMasse:', error);
    res.status(500).json({ error: 'Erreur lors de la création des lots: ' + error.message });
  }
};

// Mettre à jour un lot
exports.updateLot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lot = await Lot.findByIdAndUpdate(id, updates, { new: true });

    if (!lot) {
      return res.status(404).json({ error: 'Lot non trouvé' });
    }

    res.json({ success: true, lot });
  } catch (error) {
    console.error('Erreur updateLot:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du lot' });
  }
};

// Mettre à jour le statut d'un lot
exports.updateLotStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, reservation } = req.body;

    const updateData = { statut };
    if (reservation) {
      updateData.reservation = reservation;
    }

    const lot = await Lot.findByIdAndUpdate(id, updateData, { new: true });

    if (!lot) {
      return res.status(404).json({ error: 'Lot non trouvé' });
    }

    res.json({ success: true, lot });
  } catch (error) {
    console.error('Erreur updateLotStatut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

// Réserver un lot (depuis le frontend user)
exports.reserverLot = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientNom, clientEmail, clientTelephone, notes } = req.body;

    const lot = await Lot.findById(id);

    if (!lot) {
      return res.status(404).json({ error: 'Lot non trouvé' });
    }

    if (lot.statut !== 'disponible') {
      return res.status(400).json({ error: 'Ce lot n\'est plus disponible' });
    }

    lot.statut = 'reserve';
    lot.reservation = {
      clientNom,
      clientEmail,
      clientTelephone,
      dateReservation: new Date(),
      notes
    };

    await lot.save();

    res.json({ success: true, message: 'Lot réservé avec succès', lot });
  } catch (error) {
    console.error('Erreur reserverLot:', error);
    res.status(500).json({ error: 'Erreur lors de la réservation du lot' });
  }
};

// Supprimer un lot
exports.deleteLot = async (req, res) => {
  try {
    const { id } = req.params;

    const lot = await Lot.findByIdAndDelete(id);

    if (!lot) {
      return res.status(404).json({ error: 'Lot non trouvé' });
    }

    res.json({ success: true, message: 'Lot supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteLot:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du lot' });
  }
};

// Supprimer tous les lots
exports.deleteAllLots = async (req, res) => {
  try {
    await Lot.deleteMany({});
    res.json({ success: true, message: 'Tous les lots ont été supprimés' });
  } catch (error) {
    console.error('Erreur deleteAllLots:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression des lots' });
  }
};

// Statistiques des lots
exports.getLotsStats = async (req, res) => {
  try {
    const stats = await Lot.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          disponibles: {
            $sum: { $cond: [{ $eq: ['$statut', 'disponible'] }, 1, 0] }
          },
          reserves: {
            $sum: { $cond: [{ $eq: ['$statut', 'reserve'] }, 1, 0] }
          },
          vendus: {
            $sum: { $cond: [{ $eq: ['$statut', 'vendu'] }, 1, 0] }
          }
        }
      }
    ]);

    const totalLots = await Lot.countDocuments();
    const totalDisponibles = await Lot.countDocuments({ statut: 'disponible' });
    const totalReserves = await Lot.countDocuments({ statut: 'reserve' });
    const totalVendus = await Lot.countDocuments({ statut: 'vendu' });

    res.json({
      parType: stats,
      totaux: {
        total: totalLots,
        disponibles: totalDisponibles,
        reserves: totalReserves,
        vendus: totalVendus
      }
    });
  } catch (error) {
    console.error('Erreur getLotsStats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// ==================== PLAN DE MASSE CONFIG ====================

// Récupérer la configuration du plan de masse
exports.getPlanMasseConfig = async (req, res) => {
  try {
    let config = await PlanMasseConfig.findOne();

    if (!config) {
      // Créer une configuration par défaut
      config = new PlanMasseConfig();
      await config.save();
    }

    res.json(config);
  } catch (error) {
    console.error('Erreur getPlanMasseConfig:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la configuration' });
  }
};

// Mettre à jour la configuration du plan de masse
exports.updatePlanMasseConfig = async (req, res) => {
  try {
    const updates = req.body;

    let config = await PlanMasseConfig.findOne();

    if (!config) {
      config = new PlanMasseConfig(updates);
    } else {
      Object.assign(config, updates);
    }

    await config.save();
    res.json({ success: true, config });
  } catch (error) {
    console.error('Erreur updatePlanMasseConfig:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la configuration' });
  }
};

// Uploader l'image du plan de masse (en base64)
exports.uploadPlanMasseImage = async (req, res) => {
  try {
    const { imageBase64, imageName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 requise' });
    }

    let config = await PlanMasseConfig.findOne();

    if (!config) {
      config = new PlanMasseConfig();
    }

    config.imageBase64 = imageBase64;
    config.imageName = imageName || 'plan-de-masse.png';

    await config.save();

    res.json({ success: true, message: 'Image du plan de masse uploadée avec succès' });
  } catch (error) {
    console.error('Erreur uploadPlanMasseImage:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de l\'image' });
  }
};

// Récupérer l'image du plan de masse
exports.getPlanMasseImage = async (req, res) => {
  try {
    const config = await PlanMasseConfig.findOne();

    if (!config || !config.imageBase64) {
      return res.status(404).json({ error: 'Image du plan de masse non trouvée' });
    }

    // Retourner l'image en base64 comme fichier
    const imageBuffer = Buffer.from(config.imageBase64, 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="${config.imageName}"`);
    res.send(imageBuffer);
  } catch (error) {
    console.error('Erreur getPlanMasseImage:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
  }
};
