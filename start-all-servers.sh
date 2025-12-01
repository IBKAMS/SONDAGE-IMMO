#!/bin/bash

# Script pour démarrer tous les serveurs de l'application

echo "🚀 Démarrage de tous les serveurs..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Répertoire racine
ROOT_DIR="/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO"

# Fonction pour ouvrir un nouveau terminal et exécuter une commande
open_terminal() {
    local title=$1
    local command=$2
    local color=$3

    echo -e "${color}▶ Lancement de ${title}...${NC}"

    # Ouvrir un nouveau terminal macOS
    osascript -e "tell application \"Terminal\"
        do script \"cd '$ROOT_DIR/$command' && ${command}\"
        set custom title of front window to \"$title\"
    end tell" > /dev/null 2>&1
}

# Démarrer le backend
echo -e "${GREEN}1. Backend (Port 5001)${NC}"
open_terminal "Backend - Port 5001" "backend && npm run dev" "$GREEN"
sleep 2

# Démarrer le frontend utilisateur
echo -e "${BLUE}2. Frontend Utilisateur (Port 3000)${NC}"
open_terminal "Frontend Utilisateur - Port 3000" "frontend-user && npm start" "$BLUE"
sleep 2

# Démarrer le frontend admin
echo -e "${YELLOW}3. Frontend Admin (Port 3001)${NC}"
open_terminal "Frontend Admin - Port 3001" "frontend-admin && PORT=3001 npm start" "$YELLOW"

echo ""
echo "✅ Tous les serveurs sont en cours de démarrage !"
echo ""
echo "📍 URLs d'accès :"
echo "   • Backend API:           http://localhost:5001"
echo "   • Frontend Utilisateur:  http://localhost:3000"
echo "   • Frontend Admin:        http://localhost:3001"
echo ""
echo "ℹ️  Les serveurs s'ouvrent dans des terminaux séparés."
echo "   Fermez les terminaux pour arrêter les serveurs."
