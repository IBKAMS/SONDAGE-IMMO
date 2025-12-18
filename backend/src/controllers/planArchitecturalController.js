const PlanArchitectural = require('../models/PlanArchitectural');
const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Titres des plans par type
const planTitres = {
  'villa-duplex-4p': 'Plans architecturaux Villa Duplex 4 pièces',
  'villa-duplex-5p': 'Plans architecturaux Villa Duplex 5 pièces',
  'villa-triplex-8p': 'Plans architecturaux Villa Triplex 8 pièces'
};

// Récupérer tous les plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await PlanArchitectural.find().sort({ type: 1 });

    // Créer un objet avec tous les types (même vides)
    const plansObject = {
      'villa-duplex-4p': null,
      'villa-duplex-5p': null,
      'villa-triplex-8p': null
    };

    plans.forEach(plan => {
      plansObject[plan.type] = {
        url: plan.url,
        titre: plan.titre,
        originalName: plan.originalName,
        size: plan.size,
        uploadedAt: plan.uploadedAt
      };
    });

    res.json(plansObject);
  } catch (error) {
    console.error('Erreur getAllPlans:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des plans' });
  }
};

// Récupérer un plan par type
exports.getPlanByType = async (req, res) => {
  try {
    const { type } = req.params;
    const plan = await PlanArchitectural.findOne({ type });

    if (!plan) {
      return res.status(404).json({ error: 'Plan non trouvé' });
    }

    res.json({
      url: plan.url,
      titre: plan.titre,
      originalName: plan.originalName,
      size: plan.size,
      uploadedAt: plan.uploadedAt
    });
  } catch (error) {
    console.error('Erreur getPlanByType:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du plan' });
  }
};

// Proxy pour visualiser un PDF (contourne les restrictions Cloudinary)
exports.viewPlan = async (req, res) => {
  const https = require('https');

  try {
    const { type } = req.params;
    const plan = await PlanArchitectural.findOne({ type });

    if (!plan || !plan.cloudinaryId) {
      return res.status(404).json({ error: 'Plan non trouvé' });
    }

    // Utiliser l'API Admin de Cloudinary pour obtenir le fichier
    const result = await cloudinary.api.resource(plan.cloudinaryId, {
      resource_type: 'raw'
    });

    if (result && result.secure_url) {
      // Headers pour permettre l'affichage dans iframe
      res.setHeader('Content-Type', 'application/pdf');
      // Encoder le nom de fichier pour éviter les erreurs avec les caractères spéciaux (accents, etc.)
      const safeFilename = encodeURIComponent(plan.originalName).replace(/'/g, '%27');
      res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeFilename}`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', "frame-ancestors *");
      res.removeHeader('X-Content-Type-Options');

      // Proxy le fichier
      https.get(result.secure_url, (pdfResponse) => {
        pdfResponse.pipe(res);
      }).on('error', (err) => {
        console.error('Erreur téléchargement PDF:', err);
        res.status(500).json({ error: 'Erreur lors du téléchargement du PDF' });
      });
    } else {
      res.status(404).json({ error: 'Fichier non trouvé sur Cloudinary' });
    }
  } catch (error) {
    console.error('Erreur viewPlan:', error);
    res.status(500).json({ error: 'Erreur lors de la visualisation du plan' });
  }
};

// Upload ou mise à jour d'un plan
exports.uploadPlan = async (req, res) => {
  try {
    const { type, url, originalName, size, cloudinaryId } = req.body;

    if (!type || !url || !originalName) {
      return res.status(400).json({ error: 'Type, URL et nom original requis' });
    }

    if (!planTitres[type]) {
      return res.status(400).json({ error: 'Type de plan invalide' });
    }

    // Vérifier si un plan existe déjà pour ce type
    const existingPlan = await PlanArchitectural.findOne({ type });

    if (existingPlan) {
      // Supprimer l'ancien fichier de Cloudinary si possible
      if (existingPlan.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(existingPlan.cloudinaryId, { resource_type: 'raw' });
        } catch (cloudinaryError) {
          console.log('Erreur suppression Cloudinary:', cloudinaryError.message);
        }
      }

      // Mettre à jour le plan existant
      existingPlan.url = url;
      existingPlan.originalName = originalName;
      existingPlan.size = size || 0;
      existingPlan.cloudinaryId = cloudinaryId || null;
      existingPlan.filename = originalName;
      existingPlan.uploadedAt = new Date();

      await existingPlan.save();

      return res.json({
        success: true,
        message: 'Plan mis à jour avec succès',
        plan: existingPlan
      });
    }

    // Créer un nouveau plan
    const newPlan = new PlanArchitectural({
      type,
      titre: planTitres[type],
      filename: originalName,
      originalName,
      url,
      cloudinaryId: cloudinaryId || null,
      size: size || 0
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: 'Plan uploadé avec succès',
      plan: newPlan
    });
  } catch (error) {
    console.error('Erreur uploadPlan:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload du plan' });
  }
};

// Supprimer un plan
exports.deletePlan = async (req, res) => {
  try {
    const { type } = req.params;

    const plan = await PlanArchitectural.findOne({ type });

    if (!plan) {
      return res.status(404).json({ error: 'Plan non trouvé' });
    }

    // Supprimer de Cloudinary si possible
    if (plan.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(plan.cloudinaryId, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.log('Erreur suppression Cloudinary:', cloudinaryError.message);
      }
    }

    await PlanArchitectural.deleteOne({ type });

    res.json({
      success: true,
      message: 'Plan supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deletePlan:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du plan' });
  }
};
