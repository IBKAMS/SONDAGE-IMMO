#!/bin/bash

echo "🔧 Nettoyage des imports en double..."

# Fonction pour nettoyer les imports en double dans un fichier
cleanup_file() {
    local file=$1
    
    # Créer un fichier temporaire
    local tmpfile=$(mktemp)
    
    # Utiliser awk pour supprimer les lignes d'import en double consécutives
    awk '
    /^import API_URL from/ {
        if (!seen) {
            print
            seen = 1
        }
        next
    }
    {
        seen = 0
        print
    }
    ' "$file" > "$tmpfile"
    
    # Remplacer le fichier original
    mv "$tmpfile" "$file"
    
    echo "   ✅ $file nettoyé"
}

# Nettoyer tous les fichiers .js dans les pages
find frontend-user/src/pages -name "*.js" -type f -exec bash -c 'cleanup_file "$0"' {} \;
find frontend-admin/src/pages -name "*.js" -type f -exec bash -c 'cleanup_file "$0"' {} \;
find frontend-admin/src/context -name "*.js" -type f -exec bash -c 'cleanup_file "$0"' {} \;

export -f cleanup_file

find frontend-user/src/pages -name "*.js" -type f | while read file; do
    cleanup_file "$file"
done

find frontend-admin/src/pages -name "*.js" -type f | while read file; do
    cleanup_file "$file"
done

find frontend-admin/src/context -name "*.js" -type f | while read file; do
    cleanup_file "$file"
done

echo ""
echo "✅ Nettoyage terminé!"
