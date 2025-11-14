# 🚀 Guide de Démarrage Rapide

## Étape 1: Installer MongoDB

Si MongoDB n'est pas installé sur votre système:

### macOS (avec Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Vérifier que MongoDB fonctionne
```bash
mongosh
# Vous devriez voir une connexion réussie
# Tapez 'exit' pour quitter
```

## Étape 2: Configurer et Démarrer le Backend

```bash
# Aller dans le dossier backend
cd "/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO/backend"

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos paramètres
nano .env

# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur **http://localhost:5000**

### Configuration minimale du .env

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sondage_immo
JWT_SECRET=votre_secret_super_securise_changez_moi
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@citekongo.ci
ADMIN_PASSWORD=Admin123!
FRONTEND_USER_URL=http://localhost:3000
FRONTEND_ADMIN_URL=http://localhost:3001
```

## Étape 3: Démarrer le Frontend Utilisateur

```bash
# Dans un nouveau terminal
cd "/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO/frontend-user"

# Copier le fichier d'environnement
cp .env.example .env

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

L'interface utilisateur sera accessible sur **http://localhost:3000**

## Étape 4: Démarrer le Frontend Admin

```bash
# Dans un nouveau terminal
cd "/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO/frontend-admin"

# Copier le fichier d'environnement
cp .env.example .env

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

L'interface admin sera accessible sur **http://localhost:3001**

## Étape 5: Se Connecter à l'Admin

1. Ouvrir http://localhost:3001
2. Utiliser les identifiants par défaut:
   - **Email**: admin@citekongo.ci
   - **Mot de passe**: Admin123!

⚠️ **Important**: Changez ce mot de passe immédiatement après la première connexion!

## Étape 6: Créer Votre Projet

1. Dans l'interface admin, aller dans "Projets"
2. Cliquer sur "Nouveau Projet"
3. Remplir les informations:
   - Nom: Cité Kongo
   - Description complète
   - Informations sur le promoteur
   - Informations sur l'architecte (voir ARCHITECTE 21 dans le README)
   - Localisation
   - Etc.

## Étape 7: Ajouter les Logements

1. Dans l'admin, aller dans "Logements"
2. Ajouter les différents types de logements disponibles
3. Ajouter les images, plans, prix, etc.

## Étape 8: Personnaliser les Contenus

1. Dans l'admin, aller dans "Contenus"
2. Modifier les textes de chaque section
3. Uploader les images et vidéos
4. Configurer la visite 3D

## 🎯 Vérifications

### Backend fonctionne?
```bash
curl http://localhost:5000/api/health
# Devrait retourner: {"status":"OK","message":"API Sondage Immobilier en ligne"}
```

### MongoDB fonctionne?
```bash
mongosh sondage_immo
# Puis dans mongosh:
db.admins.find()
# Devrait montrer l'admin créé
```

## 🐛 Résolution de Problèmes

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
brew services list | grep mongodb
# Si non démarré:
brew services start mongodb-community
```

### Port déjà utilisé
```bash
# Trouver le processus utilisant le port 5000
lsof -i :5000
# Tuer le processus
kill -9 <PID>
```

### Erreur CORS
Vérifier que les URLs dans le .env du backend correspondent aux ports des frontends.

## 📚 Prochaines Étapes

1. ✅ Personnaliser les couleurs dans les fichiers CSS
2. ✅ Ajouter vos propres images et vidéos
3. ✅ Configurer les informations du promoteur
4. ✅ Ajouter les réalisations de l'architecte
5. ✅ Créer les logements avec leurs détails
6. ✅ Tester le questionnaire complet
7. ✅ Analyser les premières réponses dans le dashboard

## 🎉 C'est Parti!

Votre application est maintenant prête à être utilisée. Les clients peuvent visiter le site et remplir le questionnaire de 42 questions, et vous pouvez analyser leurs réponses dans l'interface admin.

---

**Besoin d'aide?** Consultez le README.md principal pour plus de détails.
