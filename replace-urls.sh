#!/bin/bash

# Script pour remplacer les URLs en dur par l'utilisation de la variable d'environnement

echo "🔧 Remplacement des URLs en dur dans les frontends..."
echo ""

# Fonction pour remplacer dans un fichier
replace_in_file() {
    local file=$1
    local config_path=$2
    
    # Vérifier si le fichier contient localhost:5001
    if grep -q "localhost:5001" "$file"; then
        echo "📝 Traitement: $file"
        
        # Vérifier si l'import existe déjà
        if ! grep -q "import API_URL from" "$file"; then
            # Ajouter l'import après les autres imports
            sed -i '' "/^import.*from/a\\
import API_URL from '$config_path';\\
" "$file"
        fi
        
        # Remplacer les URLs
        sed -i '' "s|'http://localhost:5001|\`\${API_URL}|g" "$file"
        sed -i '' 's|"http://localhost:5001|`${API_URL}|g' "$file"
        sed -i '' "s|http://localhost:5001|\${API_URL}|g" "$file"
        
        echo "   ✅ Modifié"
    fi
}

# Frontend User
echo "🎯 Frontend User:"
for file in frontend-user/src/pages/*.js; do
    if [ -f "$file" ]; then
        replace_in_file "$file" "../config"
    fi
done

echo ""
echo "🎯 Frontend Admin:"
# Frontend Admin
for file in frontend-admin/src/pages/*.js; do
    if [ -f "$file" ]; then
        replace_in_file "$file" "../config"
    fi
done

# Context files
for file in frontend-admin/src/context/*.js; do
    if [ -f "$file" ]; then
        replace_in_file "$file" "../config"
    fi
done

echo ""
echo "✅ Remplacement terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifier que les applications compilent: npm start"
echo "2. Tester les fonctionnalités principales"
echo "3. Consulter DEPLOIEMENT.md pour déployer"
