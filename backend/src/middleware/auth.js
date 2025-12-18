const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ApporteurAffaires = require('../models/ApporteurAffaires');

// Protection des routes admin - vérification du token JWT
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'admin
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin non trouvé'
      });
    }

    if (!req.admin.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

// Vérification des rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle ${req.admin.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};

// Générer le token JWT avec type d'utilisateur
exports.generateToken = (id, userType = 'admin') => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Protection des routes apporteur d'affaires
exports.protectApporteur = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que c'est bien un apporteur
    if (decoded.userType !== 'apporteur') {
      return res.status(403).json({
        success: false,
        message: 'Accès réservé aux apporteurs d\'affaires'
      });
    }

    // Récupérer l'apporteur
    req.apporteur = await ApporteurAffaires.findById(decoded.id).select('-password');

    if (!req.apporteur) {
      return res.status(401).json({
        success: false,
        message: 'Apporteur non trouvé'
      });
    }

    if (!req.apporteur.actif) {
      return res.status(401).json({
        success: false,
        message: 'Compte apporteur désactivé'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

// Middleware flexible - accepte admin ou apporteur
exports.protectAny = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userType === 'apporteur') {
      req.apporteur = await ApporteurAffaires.findById(decoded.id).select('-password');
      req.userType = 'apporteur';
      if (!req.apporteur || !req.apporteur.actif) {
        return res.status(401).json({
          success: false,
          message: 'Compte apporteur non trouvé ou désactivé'
        });
      }
    } else {
      req.admin = await Admin.findById(decoded.id).select('-password');
      req.userType = 'admin';
      if (!req.admin || !req.admin.actif) {
        return res.status(401).json({
          success: false,
          message: 'Compte admin non trouvé ou désactivé'
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};
