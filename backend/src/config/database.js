const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Utilise MONGODB_URI de .env ou l'URI locale par défaut
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sondage-immobilier';

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);

    // Création de l'admin par défaut si nécessaire
    await createDefaultAdmin();
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const Admin = require('../models/Admin');
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (!adminExists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        nom: 'Administrateur',
        prenom: 'Principal',
        role: 'super_admin'
      });
      console.log('Admin par défaut créé');
    }
  } catch (error) {
    console.error('Erreur création admin:', error.message);
  }
};

module.exports = connectDB;
