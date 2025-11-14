const HomeContent = require('../models/HomeContent');
const Video = require('../models/Video');
const Logement = require('../models/Logement');

// Récupérer les statistiques pour le dashboard admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Récupérer le nom du projet depuis HomeContent
    const homeContent = await HomeContent.findOne({ isActive: true });
    const projectName = homeContent?.hero?.title || 'Projet Immobilier';

    // Compter le nombre total de vidéos
    const videosCount = await Video.countDocuments();

    // Compter le nombre de logements
    const logementsCount = await Logement.countDocuments();

    // Récupérer la liste des vidéos pour les descriptions
    const videos = await Video.find();
    const videoTypes = videos.map(v => {
      const typeLabels = {
        'visite3d': 'Visite 3D',
        'promoteur': 'Promoteur',
        'analyseEconomique': 'Analyse Économique',
        'architecte': 'Architecte'
      };
      return typeLabels[v.type] || v.type;
    });

    res.json({
      success: true,
      data: {
        projectName,
        stats: {
          videosCount,
          videoTypes: videoTypes.join(', ') || 'Aucune vidéo',
          logementsCount,
          analysisStatus: 'En cours',
          clientsStatus: 'Actif'
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats du dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
