const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

// @desc    Connexion admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier l'admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier si le compte est actif
    if (!admin.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    // Mettre à jour la dernière connexion
    admin.derniere_connexion = new Date();
    await admin.save();

    // Générer le token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// @desc    Obtenir l'admin connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        nom: req.admin.nom,
        prenom: req.admin.prenom,
        role: req.admin.role,
        derniere_connexion: req.admin.derniere_connexion
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// @desc    Modifier le mot de passe
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mots de passe requis'
      });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe'
    });
  }
};

// @desc    Modifier le profil
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom } = req.body;

    const admin = await Admin.findById(req.admin._id);

    if (nom) admin.nom = nom;
    if (prenom) admin.prenom = prenom;

    await admin.save();

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      admin: {
        id: admin._id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};
