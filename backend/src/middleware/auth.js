const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protection des routes - vérification du token JWT
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

// Générer le token JWT
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};
