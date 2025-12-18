const ApporteurAffaires = require('../models/ApporteurAffaires');
const { generateToken } = require('../middleware/auth');

// @desc    Connexion apporteur d'affaires
// @route   POST /api/apporteur/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier si l'apporteur existe
    const apporteur = await ApporteurAffaires.findOne({ email }).select('+password');

    if (!apporteur) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier si le compte est actif
    if (!apporteur.actif) {
      return res.status(401).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await apporteur.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Mettre à jour la dernière connexion
    apporteur.derniere_connexion = new Date();
    await apporteur.save({ validateBeforeSave: false });

    // Générer le token avec type 'apporteur'
    const token = generateToken(apporteur._id, 'apporteur');

    res.status(200).json({
      success: true,
      token,
      userType: 'apporteur',
      apporteur: {
        id: apporteur._id,
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone,
        pays: apporteur.pays,
        tauxCommission: apporteur.tauxCommission,
        statistiques: apporteur.statistiques
      }
    });
  } catch (error) {
    console.error('Erreur login apporteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Obtenir le profil de l'apporteur connecté
// @route   GET /api/apporteur/me
// @access  Private (Apporteur)
exports.getMe = async (req, res) => {
  try {
    const apporteur = await ApporteurAffaires.findById(req.apporteur.id);

    res.status(200).json({
      success: true,
      data: {
        id: apporteur._id,
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone,
        pays: apporteur.pays,
        tauxCommission: apporteur.tauxCommission,
        statistiques: apporteur.statistiques,
        derniere_connexion: apporteur.derniere_connexion,
        createdAt: apporteur.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le mot de passe de l'apporteur
// @route   PUT /api/apporteur/update-password
// @access  Private (Apporteur)
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const apporteur = await ApporteurAffaires.findById(req.apporteur.id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await apporteur.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    apporteur.password = newPassword;
    await apporteur.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le profil de l'apporteur
// @route   PUT /api/apporteur/update-profile
// @access  Private (Apporteur)
exports.updateProfile = async (req, res) => {
  try {
    const { telephone, pays } = req.body;

    const updateData = {};
    if (telephone) updateData.telephone = telephone;
    if (pays) updateData.pays = pays;

    const apporteur = await ApporteurAffaires.findByIdAndUpdate(
      req.apporteur.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        id: apporteur._id,
        code: apporteur.code,
        nom: apporteur.nom,
        prenom: apporteur.prenom,
        email: apporteur.email,
        telephone: apporteur.telephone,
        pays: apporteur.pays
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};
