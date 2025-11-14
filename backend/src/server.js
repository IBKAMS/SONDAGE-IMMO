require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(helmet());
app.use(compression());

// CORS - Configuration stricte avec whitelist
const allowedOrigins = [
  'https://sondage-immo-utilisateur.vercel.app',
  'https://sondage-immo-admin.vercel.app',
  'http://localhost:3000', // Frontend user en dev
  'http://localhost:3001'  // Frontend admin en dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (ex: Postman, apps mobiles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware CORS pour les fichiers statiques
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projets', require('./routes/projets'));
app.use('/api/questionnaires', require('./routes/questionnaires'));
// app.use('/api/reponses', require('./routes/reponses')); // TODO: Créer ce fichier
app.use('/api/contenus', require('./routes/contenus'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));
app.use('/api/home-content', require('./routes/homeContent'));
app.use('/api/presentation-content', require('./routes/presentationContent'));
app.use('/api/promoteur-content', require('./routes/promoteurContent'));
app.use('/api/architecte-content', require('./routes/architecteContent'));
app.use('/api/logements-content', require('./routes/logementsContent'));
app.use('/api/logements', require('./routes/logements'));
app.use('/api/visite3d-content', require('./routes/visite3dContent'));
app.use('/api/localisation-content', require('./routes/localisationContent'));
app.use('/api/analyse-economique-content', require('./routes/analyseEconomiqueContent'));
app.use('/api/option-achat-content', require('./routes/optionAchatContent'));
app.use('/api/dashboard-stats', require('./routes/dashboardStats'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Sondage Immobilier en ligne',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║   Serveur Backend - Sondage Immobilier        ║
  ║   Port: ${PORT}                                    ║
  ║   Environnement: ${process.env.NODE_ENV}          ║
  ║   URL: http://localhost:${PORT}                    ║
  ╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
