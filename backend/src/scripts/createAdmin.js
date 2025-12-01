require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    await connectDB();

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ email: 'admin@citikongo.com' });

    if (existingAdmin) {
      console.log('ℹ️  Un administrateur avec cet email existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.prenom, existingAdmin.nom);
      process.exit(0);
    }

    // Créer l'admin par défaut
    const admin = await Admin.create({
      email: 'admin@citikongo.com',
      password: 'Admin123!',
      nom: 'Administrateur',
      prenom: 'Super',
      role: 'super_admin',
      actif: true
    });

    console.log('\n✅ Administrateur créé avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@citikongo.com');
    console.log('🔑 Password: Admin123!');
    console.log('👤 Nom:      Super Administrateur');
    console.log('🎭 Rôle:     super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();
