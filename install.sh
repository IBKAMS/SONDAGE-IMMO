#!/bin/bash

# Script d'installation automatique pour l'application de sondage immobilier

echo "=========================================="
echo "  Installation Application Sondage Immo  "
echo "=========================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "   Installez Node.js depuis https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js installé: $(node -v)"
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
else
    echo "✅ npm installé: $(npm -v)"
fi

# Vérifier MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé ou non démarré"
    echo "   Sur macOS, installez avec: brew install mongodb-community"
    echo "   Puis démarrez avec: brew services start mongodb-community"
else
    echo "✅ MongoDB installé"
fi

echo ""
echo "=========================================="
echo "  Installation du Backend                "
echo "=========================================="
cd backend

if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  N'oubliez pas de configurer le fichier .env"
else
    echo "✅ Fichier .env existe déjà"
fi

echo "📦 Installation des dépendances backend..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend installé avec succès"
else
    echo "❌ Erreur lors de l'installation du backend"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "  Installation du Frontend Utilisateur   "
echo "=========================================="
cd frontend-user

if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
else
    echo "✅ Fichier .env existe déjà"
fi

echo "📦 Installation des dépendances frontend utilisateur..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend utilisateur installé avec succès"
else
    echo "❌ Erreur lors de l'installation du frontend utilisateur"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "  Installation du Frontend Admin         "
echo "=========================================="
cd frontend-admin

if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
else
    echo "✅ Fichier .env existe déjà"
fi

echo "📦 Installation des dépendances frontend admin..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend admin installé avec succès"
else
    echo "❌ Erreur lors de l'installation du frontend admin"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "  ✅ Installation Terminée !              "
echo "=========================================="
echo ""
echo "📚 Pour démarrer l'application:"
echo ""
echo "1. Backend:"
echo "   cd backend && npm run dev"
echo "   URL: http://localhost:5000"
echo ""
echo "2. Frontend Utilisateur:"
echo "   cd frontend-user && npm start"
echo "   URL: http://localhost:3000"
echo ""
echo "3. Frontend Admin:"
echo "   cd frontend-admin && npm start"
echo "   URL: http://localhost:3001"
echo ""
echo "🔑 Identifiants admin par défaut:"
echo "   Email: admin@citekongo.ci"
echo "   Mot de passe: Admin123!"
echo ""
echo "⚠️  N'oubliez pas de:"
echo "   - Configurer les fichiers .env"
echo "   - Changer le mot de passe admin"
echo "   - Démarrer MongoDB"
echo ""
echo "📖 Consultez DEMARRAGE_RAPIDE.md pour plus de détails"
echo ""
