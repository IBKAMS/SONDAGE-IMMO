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
  const http = require('http');

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

    // Si on a le PDF en base64, le servir directement
    if (plan.pdfBase64) {
      console.log('Serving PDF from base64 storage');
      res.setHeader('Content-Type', 'application/pdf');
      const safeFilename = encodeURIComponent(plan.originalName || 'plan.pdf').replace(/'/g, '%27');
      res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeFilename}`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', "frame-ancestors *");

      const pdfBuffer = Buffer.from(plan.pdfBase64, 'base64');
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    }

    // Sinon, utiliser l'URL Cloudinary avec authentification Basic
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Essayer de télécharger via l'Admin API avec Basic Auth
    if (plan.cloudinaryId) {
      console.log('Tentative via Admin API avec Basic Auth...');

      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
      const options = {
        hostname: 'api.cloudinary.com',
        path: `/v1_1/${cloudName}/resources/raw/upload/${encodeURIComponent(plan.cloudinaryId)}`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      };

      const apiReq = https.request(options, (apiRes) => {
        console.log('Admin API status:', apiRes.statusCode);

        if (apiRes.statusCode === 200) {
          // Lire la réponse JSON pour obtenir l'URL sécurisée
          let data = '';
          apiRes.on('data', chunk => { data += chunk; });
          apiRes.on('end', () => {
            try {
              const resourceInfo = JSON.parse(data);
              console.log('Resource info:', resourceInfo.secure_url);

              // Maintenant télécharger le fichier avec l'URL secure
              fetchAndStreamPdf(resourceInfo.secure_url, plan, res);
            } catch (e) {
              console.error('Erreur parsing Admin API:', e);
              fetchAndStreamPdf(plan.url, plan, res);
            }
          });
        } else {
          console.log('Admin API failed, trying direct URL');
          fetchAndStreamPdf(plan.url, plan, res);
        }
      });

      apiReq.on('error', (err) => {
        console.error('Admin API error:', err.message);
        fetchAndStreamPdf(plan.url, plan, res);
      });

      apiReq.end();
    } else {
      fetchAndStreamPdf(plan.url, plan, res);
    }

  } catch (error) {
    console.error('Erreur viewPlan:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur lors de la visualisation du plan: ' + error.message });
    }
  }
};

// Fonction helper pour télécharger et streamer le PDF
function fetchAndStreamPdf(url, plan, res) {
  const https = require('https');

  // Headers pour permettre l'affichage dans iframe
  res.setHeader('Content-Type', 'application/pdf');
  const safeFilename = encodeURIComponent(plan.originalName || 'plan.pdf').replace(/'/g, '%27');
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${safeFilename}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  res.removeHeader('X-Content-Type-Options');

  console.log('Fetching PDF from:', url.substring(0, 80) + '...');

  https.get(url, (pdfResponse) => {
    console.log('PDF fetch status:', pdfResponse.statusCode);

    if (pdfResponse.statusCode === 200) {
      console.log('Streaming PDF...');
      pdfResponse.pipe(res);
    } else if (pdfResponse.statusCode >= 300 && pdfResponse.statusCode < 400 && pdfResponse.headers.location) {
      console.log('Following redirect to:', pdfResponse.headers.location);
      fetchAndStreamPdf(pdfResponse.headers.location, plan, res);
    } else {
      console.error('PDF fetch failed:', pdfResponse.statusCode);
      if (!res.headersSent) {
        res.status(pdfResponse.statusCode).json({ error: 'PDF inaccessible depuis Cloudinary' });
      }
    }
  }).on('error', (err) => {
    console.error('PDF fetch error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur: ' + err.message });
    }
  });
}

// Upload ou mise à jour d'un plan
exports.uploadPlan = async (req, res) => {
  try {
    const { type, url, originalName, size, cloudinaryId, pdfBase64 } = req.body;

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
      existingPlan.pdfBase64 = pdfBase64 || null;  // Stocker le base64 pour contourner Cloudinary
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
      pdfBase64: pdfBase64 || null,  // Stocker le base64 pour contourner Cloudinary
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
