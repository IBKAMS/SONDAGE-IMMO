const Logement = require('../models/Logement');

// Données initiales des 3 logements
const logementsInitiaux = [
  {
    id: "LOG-001",
    reference: "VD4P-01",
    type: "Villa Duplex",
    nom: "Villa Duplex 4 Pièces",
    superficie: 150,
    nombrePieces: 4,
    nombreChambres: 3,
    nombreSallesBain: 3,
    nombreWC: 3,
    etage: "R+1",
    prix: 120000000,
    prixM2: 800000,
    description: "Magnifique villa duplex sur deux niveaux offrant 150m² d'espace de vie. RDC: grand séjour avec coin salle à manger, cuisine moderne équipée, toilettes invités. Étage: 3 chambres spacieuses dont une suite parentale avec salle de bain privative, seconde salle de bain commune. Finitions de qualité et espaces optimisés pour le confort familial.",
    equipements: [
      "Suite parentale avec dressing",
      "Cuisine moderne",
      "Grand séjour avec salle à manger",
      "Terrasse au rez-de-chaussée",
      "Balcon à l'étage",
      "Garage 2 véhicules"
    ],
    balcon: true,
    terrasse: true,
    jardin: false,
    parking: {
      inclus: true,
      nombrePlaces: 2
    },
    orientation: "sud",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-duplex-4p-1.png"
    ],
    planUrl: "/assets/plans/villa-duplex-4p.pdf",
    actif: true
  },
  {
    id: "LOG-002",
    reference: "VD5P-01",
    type: "Villa Duplex",
    nom: "Villa Duplex 5 Pièces",
    superficie: 250,
    nombrePieces: 5,
    nombreChambres: 4,
    nombreSallesBain: 4,
    nombreWC: 4,
    etage: "R+1",
    prix: 150000000,
    prixM2: 600000,
    description: "Spacieuse villa duplex de 250m² conçue pour les familles recherchant confort et élégance. RDC: double séjour lumineux, salle à manger, cuisine équipée avec coin repas, chambre d'invités avec salle d'eau, toilettes invités. Étage: suite parentale luxueuse avec dressing et salle de bain privative, 2 grandes chambres, salle de bain commune, bureau/espace multimédia. Finitions premium et nombreux rangements.",
    equipements: [
      "Suite parentale avec grand dressing",
      "Grande terrasse couverte",
      "Double séjour spacieux",
      "4 chambres dont 1 au RDC",
      "Cuisine moderne avec coin repas",
      "Garage 2 véhicules",
      "2 Balcons à l'étage"
    ],
    balcon: true,
    terrasse: true,
    jardin: false,
    parking: {
      inclus: true,
      nombrePlaces: 2
    },
    orientation: "sud-ouest",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-duplex-5p-1.png"
    ],
    planUrl: "/assets/plans/villa-duplex-5p.pdf",
    actif: true
  },
  {
    id: "LOG-003",
    reference: "VT6P-01",
    type: "Villa Triplex",
    nom: "Villa Triplex 6 Pièces",
    superficie: 300,
    nombrePieces: 6,
    nombreChambres: 5,
    nombreSallesBain: 5,
    nombreWC: 5,
    etage: "R+2",
    prix: 250000000,
    prixM2: 833333,
    description: "Villa d'exception sur trois niveaux offrant 300m² d'espace de vie luxueux. RDC: hall d'entrée, double séjour cathédrale, salle à manger, cuisine américaine équipée premium, chambre d'invités avec salle d'eau, toilettes invités, cellier. 1er étage: suite parentale royale avec dressing et salle de bain spa, 2 chambres avec salles d'eau attenantes, bureau. 2ème étage: 2 chambres supplémentaires, salle de bain, espace détente/home cinema, terrasse panoramique. Le summum du confort et du standing.",
    equipements: [
      "Suite parentale avec grand dressing",
      "Double séjour spacieux",
      "Cuisine moderne",
      "5 chambres sur 3 niveaux",
      "Seule chambre parentale au 2e étage",
      "Chambre d'invités au RDC",
      "Espace détente/home cinema",
      "Terrasse panoramique",
      "Balcons à chaque étage",
      "Cellier",
      "Garage 3 places"
    ],
    balcon: true,
    terrasse: true,
    jardin: true,
    parking: {
      inclus: true,
      nombrePlaces: 3
    },
    orientation: "sud",
    statut: "disponible",
    images: [
      "/assets/images/logements/villa-triplex-6p-1.png"
    ],
    planUrl: "/assets/plans/villa-triplex-6p.pdf",
    actif: true
  }
];

// @desc    Initialiser les logements de base
// @route   POST /api/logements/init
// @access  Private
const initLogements = async () => {
  try {
    const count = await Logement.countDocuments();
    if (count === 0) {
      await Logement.insertMany(logementsInitiaux);
      console.log('Logements initiaux créés avec succès');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des logements:', error);
    return false;
  }
};

// @desc    Obtenir tous les logements actifs (public)
// @route   GET /api/logements
// @access  Public
exports.getLogements = async (req, res) => {
  try {
    // Initialiser les logements si la base est vide
    await initLogements();

    const logements = await Logement.find({ actif: true })
      .select('-__v')
      .sort({ type: 1, prix: 1 });

    res.json({
      success: true,
      count: logements.length,
      data: logements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logements',
      error: error.message
    });
  }
};

// @desc    Obtenir tous les logements (admin)
// @route   GET /api/logements/all
// @access  Private
exports.getAllLogements = async (req, res) => {
  try {
    const logements = await Logement.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logements.length,
      data: logements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logements',
      error: error.message
    });
  }
};

// @desc    Obtenir un logement par ID
// @route   GET /api/logements/:id
// @access  Public
exports.getLogement = async (req, res) => {
  try {
    const logement = await Logement.findById(req.params.id);

    if (!logement) {
      return res.status(404).json({
        success: false,
        message: 'Logement non trouvé'
      });
    }

    res.json({
      success: true,
      data: logement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du logement',
      error: error.message
    });
  }
};

// @desc    Créer un logement
// @route   POST /api/logements
// @access  Private
exports.createLogement = async (req, res) => {
  try {
    const logement = await Logement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Logement créé avec succès',
      data: logement
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un logement avec cette référence existe déjà'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du logement',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un logement
// @route   PUT /api/logements/:id
// @access  Private
exports.updateLogement = async (req, res) => {
  try {
    const logement = await Logement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!logement) {
      return res.status(404).json({
        success: false,
        message: 'Logement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Logement mis à jour avec succès',
      data: logement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du logement',
      error: error.message
    });
  }
};

// @desc    Supprimer un logement
// @route   DELETE /api/logements/:id
// @access  Private
exports.deleteLogement = async (req, res) => {
  try {
    const logement = await Logement.findByIdAndDelete(req.params.id);

    if (!logement) {
      return res.status(404).json({
        success: false,
        message: 'Logement non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Logement supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du logement',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques des logements
// @route   GET /api/logements/stats/all
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const logements = await Logement.find({ actif: true });

    const disponibles = logements.filter(log => log.statut === 'disponible');
    const reserves = logements.filter(log => log.statut === 'réservé');
    const vendus = logements.filter(log => log.statut === 'vendu');

    const prix = logements.map(log => log.prix);

    const stats = {
      total: logements.length,
      disponibles: disponibles.length,
      reserves: reserves.length,
      vendus: vendus.length,
      prixMin: prix.length > 0 ? Math.min(...prix) : 0,
      prixMax: prix.length > 0 ? Math.max(...prix) : 0,
      prixMoyen: prix.length > 0 ? Math.round(prix.reduce((a, b) => a + b, 0) / prix.length) : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques',
      error: error.message
    });
  }
};
