# 📦 GUIDE DE DÉPLOIEMENT - Application Sondage Immobilier

## ✅ Modifications effectuées pour rendre l'application agnostic

### 1. Backend (`/backend`)

#### ✅ Port dynamique
- **Fichier**: `src/server.js:100`
- **Configuration**: `process.env.PORT || 5001`
- ✓ Utilise la variable d'environnement PORT en priorité

#### ✅ MongoDB avec variable d'environnement
- **Fichier**: `src/config/database.js:5`
- **Configuration**: `process.env.MONGODB_URI`
- ✓ Utilise déjà la variable d'environnement MONGODB_URI

#### ✅ CORS flexible
- **Fichier**: `src/server.js:20-48`
- **Configuration**: Fonction dynamique avec fallback localhost
- ✓ Accepte les origines définies dans FRONTEND_USER_URL et FRONTEND_ADMIN_URL
- ✓ Fallback sur localhost en développement
- ✓ Bloque les origines non autorisées en production

#### ✅ Variables d'environnement complètes
- **Fichier**: `.env` (mis à jour)
- **Fichier**: `.env.example` (créé)
- ✓ Toutes les variables nécessaires sont documentées

### 2. Frontend User (`/frontend-user`)

#### ✅ Variable d'environnement API
- **Fichier**: `.env`
- **Configuration**: `REACT_APP_API_URL=http://localhost:5001`
- **Fichier**: `.env.example` (créé)
- **Fichier**: `src/config.js` (créé)

### 3. Frontend Admin (`/frontend-admin`)

#### ✅ Variable d'environnement API
- **Fichier**: `.env` (mis à jour)
- **Configuration**: `REACT_APP_API_URL=http://localhost:5001`
- **Fichier**: `.env.example` (créé)
- **Fichier**: `src/config.js` (créé)

### 4. .gitignore

#### ✅ Fichier racine créé
- **Fichier**: `/.gitignore`
- ✓ Ignore node_modules, .env, .DS_Store
- ✓ Ignore les uploads, logs, et fichiers temporaires

---

## ⚠️ ACTIONS RESTANTES À EFFECTUER

### 📝 Remplacer les URLs en dur dans les frontends

Plusieurs fichiers utilisent encore `http://localhost:5001` en dur. Vous devez les remplacer par l'import du fichier config.

**Fichiers à modifier dans frontend-user** (12 fichiers):
```
- src/pages/Questionnaire.js
- src/pages/OptionAchat.js
- src/pages/AnalyseEconomique.js
- src/pages/Localisation.js
- src/pages/Visite3D.js
- src/pages/Logements.js
- src/pages/Architecte.js
- src/pages/Promoteur.js
- src/pages/Presentation.js
- src/pages/Home.js
- etc.
```

**Fichiers à modifier dans frontend-admin** (14 fichiers):
```
- src/context/AuthContext.js
- src/pages/Dashboard.js
- src/pages/Analytics.js
- src/pages/Videos.js
- etc.
```

**Comment faire le remplacement**:

1. **Au début de chaque fichier, ajouter** :
```javascript
import API_URL from '../config';
```

2. **Remplacer toutes les occurrences de** :
```javascript
// AVANT
fetch('http://localhost:5001/api/...')

// APRÈS
fetch(`${API_URL}/api/...`)
```

### 🔧 Script de remplacement automatique

Vous pouvez utiliser ces commandes pour remplacer automatiquement :

**Pour frontend-user** :
```bash
cd "/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO/frontend-user/src"

# Remplacer dans tous les fichiers .js
find . -name "*.js" -type f -exec sed -i '' 's|http://localhost:5001|${API_URL}|g' {} +

# Ajouter l'import en haut de chaque fichier (nécessite manuel)
```

**Pour frontend-admin** :
```bash
cd "/Users/kamissokobabaidriss/Desktop/APPLI SONDAGE IMMO/frontend-admin/src"

# Remplacer dans tous les fichiers .js
find . -name "*.js" -type f -exec sed -i '' 's|http://localhost:5001|${API_URL}|g' {} +

# Ajouter l'import en haut de chaque fichier (nécessite manuel)
```

---

## 🚀 DÉPLOIEMENT EN PRODUCTION

### 1. Backend (Node.js)

#### Plateformes recommandées :
- **Heroku**
- **Railway.app**
- **Render.com**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

#### Variables d'environnement à configurer :
```env
NODE_ENV=production
PORT=<fourni par la plateforme>
MONGODB_URI=<URL MongoDB Atlas>
JWT_SECRET=<générer un secret sécurisé>
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@votre-domaine.com
ADMIN_PASSWORD=<mot de passe sécurisé>
FRONTEND_USER_URL=https://votre-domaine-user.com
FRONTEND_ADMIN_URL=https://votre-domaine-admin.com
```

### 2. MongoDB

#### Utiliser MongoDB Atlas (recommandé):
1. Créer un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Configurer un utilisateur de base de données
4. Whitelist les IPs (0.0.0.0/0 pour autoriser toutes les IPs)
5. Copier la connection string

**Format de connection string** :
```
mongodb+srv://username:password@cluster.mongodb.net/sondage-immobilier?retryWrites=true&w=majority
```

### 3. Frontend User (React)

#### Plateformes recommandées :
- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

#### Variables d'environnement :
```env
REACT_APP_API_URL=https://votre-api.herokuapp.com
```

#### Build command :
```bash
npm run build
```

### 4. Frontend Admin (React)

#### Même processus que Frontend User

#### Variables d'environnement :
```env
REACT_APP_API_URL=https://votre-api.herokuapp.com
PORT=3001
```

---

## 📋 CHECKLIST AVANT DÉPLOIEMENT

### Backend
- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas configuré et accessible
- [ ] JWT_SECRET changé (générer un secret fort)
- [ ] ADMIN_PASSWORD changé
- [ ] CORS configuré avec les bonnes URLs frontend
- [ ] Tests effectués localement

### Frontends
- [ ] REACT_APP_API_URL configuré
- [ ] Toutes les URLs en dur remplacées par ${API_URL}
- [ ] Build de production testé (`npm run build`)
- [ ] Tests effectués localement

### Sécurité
- [ ] Fichiers .env ajoutés au .gitignore
- [ ] Secrets changés (JWT_SECRET, ADMIN_PASSWORD)
- [ ] CORS restreint aux domaines autorisés
- [ ] HTTPS activé sur tous les services

---

## 🔒 SÉCURITÉ EN PRODUCTION

### Générer un JWT_SECRET fort :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Générer un mot de passe admin fort :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Restreindre CORS en production :
Dans `.env` de production du backend :
```env
FRONTEND_USER_URL=https://monsite.com
FRONTEND_ADMIN_URL=https://admin.monsite.com
```

---

## 📞 SUPPORT

Pour toute question sur le déploiement, consultez :
- [Documentation Heroku](https://devcenter.heroku.com/categories/nodejs-support)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)

---

**Version:** 1.0.0  
**Date:** 2025  
**Auteur:** Application Sondage Immobilier
