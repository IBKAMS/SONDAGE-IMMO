const PlanArchitectural = require('../models/PlanArchitectural');
const cloudinary = require('cloudinary').v2;

// Configuration Cloudinary avec secure activé
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Titres des plans par type
const planTitres = {
  'villa-duplex-4p': 'Plans architecturaux Villa Duplex 4 pièces',
  'villa-duplex-5p': 'Plans architecturaux Villa Duplex 5 pièces',
  'villa-triplex-8p': 'Plans architecturaux Villa Triplex 8 pièces',
  'plan-de-masse': 'Plan de Masse des Logements'
};

// Récupérer tous les plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await PlanArchitectural.find().sort({ type: 1 });

    // Créer un objet avec tous les types (même vides)
    const plansObject = {
      'villa-duplex-4p': null,
      'villa-duplex-5p': null,
      'villa-triplex-8p': null,
      'plan-de-masse': null
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

// Debug endpoint pour vérifier les données
exports.debugPlan = async (req, res) => {
  try {
    const { type } = req.params;
    console.log('DEBUG: debugPlan appelé pour type:', type);

    const plan = await PlanArchitectural.findOne({ type });

    if (!plan) {
      return res.json({
        status: 'not_found',
        message: 'Aucun plan trouvé pour ce type',
        type: type
      });
    }

    res.json({
      status: 'found',
      type: plan.type,
      url: plan.url,
      cloudinaryId: plan.cloudinaryId,
      originalName: plan.originalName,
      hasUrl: !!plan.url,
      hasCloudinaryId: !!plan.cloudinaryId
    });
  } catch (error) {
    console.error('Erreur debugPlan:', error);
    res.status(500).json({ error: error.message });
  }
};

// Proxy pour visualiser un PDF (contourne les restrictions Cloudinary)
exports.viewPlan = async (req, res) => {
  const https = require('https');

  try {
    const { type } = req.params;
    console.log('viewPlan appelé pour type:', type);

    const plan = await PlanArchitectural.findOne({ type });
    console.log('Plan trouvé:', plan ? {
      type: plan.type,
      cloudinaryId: plan.cloudinaryId,
      url: plan.url
    } : 'null');

    if (!plan || !plan.url) {
      return res.status(404).json({ error: 'Plan non trouvé' });
    }

    // Générer une URL signée avec le SDK Cloudinary
    let pdfUrl;
    if (plan.cloudinaryId) {
      // Utiliser le SDK pour générer une URL signée valide
      pdfUrl = cloudinary.url(plan.cloudinaryId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        secure: true
      });
      console.log('URL signée générée:', pdfUrl);
    } else {
      pdfUrl = plan.url;
      console.log('URL originale:', pdfUrl);
    }

    // Headers pour permettre l'affichage dans iframe
    res.setHeader('Content-Type', 'application/pdf');
    const safeFilename = encodeURIComponent(plan.originalName || 'plan.pdf').replace(/'/g, '%27');
    res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeFilename}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
    res.removeHeader('X-Content-Type-Options');

    // Fetch le PDF
    https.get(pdfUrl, (pdfResponse) => {
      console.log('Réponse Cloudinary:', pdfResponse.statusCode);

      if (pdfResponse.statusCode === 200) {
        console.log('Succès! Streaming du PDF...');
        pdfResponse.pipe(res);
      } else if (pdfResponse.statusCode >= 300 && pdfResponse.statusCode < 400 && pdfResponse.headers.location) {
        // Suivre la redirection
        console.log('Redirection vers:', pdfResponse.headers.location);
        https.get(pdfResponse.headers.location, (redirectResponse) => {
          if (redirectResponse.statusCode === 200) {
            redirectResponse.pipe(res);
          } else {
            console.error('Erreur après redirection:', redirectResponse.statusCode);
            res.status(redirectResponse.statusCode).json({ error: 'Erreur lors du téléchargement du PDF' });
          }
        });
      } else {
        console.error('Erreur Cloudinary:', pdfResponse.statusCode);
        // Essayer l'URL originale en fallback
        console.log('Tentative avec URL originale:', plan.url);
        https.get(plan.url, (fallbackResponse) => {
          console.log('Réponse fallback:', fallbackResponse.statusCode);
          if (fallbackResponse.statusCode === 200) {
            fallbackResponse.pipe(res);
          } else {
            res.status(fallbackResponse.statusCode).json({ error: 'PDF inaccessible' });
          }
        }).on('error', (err) => {
          res.status(500).json({ error: 'Erreur: ' + err.message });
        });
      }
    }).on('error', (err) => {
      console.error('Erreur fetch PDF:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erreur lors du téléchargement du PDF: ' + err.message });
      }
    });

  } catch (error) {
    console.error('Erreur viewPlan:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur lors de la visualisation du plan: ' + error.message });
    }
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
