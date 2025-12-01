# 🏠 APPLICATION DE SONDAGE IMMOBILIER - PLATEFORME COMPLÈTE

Application web complète de présentation et de sondage pour projets immobiliers, avec interface utilisateur publique, interface d'administration sécurisée et analyse des réponses en temps réel.

---

## 🚀 Architecture

* **Backend**: Node.js + Express.js + MongoDB
* **Frontend Utilisateur**: React.js (Port 3000)
* **Frontend Admin**: React.js (Port 3001)
* **Authentification**: JWT (JSON Web Tokens)
* **Sécurité**: Bcryptjs pour le hachage des mots de passe
* **Upload**: Multer pour la gestion des médias
* **Visualisation**: Recharts pour les graphiques

---

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **MongoDB** installé et en cours d'exécution
3. **NPM** ou Yarn
4. Un navigateur web moderne (Chrome, Firefox, Safari, Edge)

---

## 🛠️ Installation

### 1. Installer MongoDB (si pas déjà installé)

**Sur macOS avec Homebrew:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Sur Windows:**
- Téléchargez MongoDB Community Server depuis [mongodb.com](https://www.mongodb.com/try/download/community)
- Suivez l'assistant d'installation
- Démarrez le service MongoDB

**Sur Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. Cloner ou télécharger le projet

```bash
cd ~/Desktop
# Le projet se trouve dans: APPLI SONDAGE IMMO/
```

### 3. Installer les dépendances

**Backend:**
```bash
cd "APPLI SONDAGE IMMO/backend"
npm install
```

**Frontend Utilisateur:**
```bash
cd "../frontend-user"
npm install
```

**Frontend Admin:**
```bash
cd "../frontend-admin"
npm install
```

### 4. Configuration des variables d'environnement

**Backend** - Créer le fichier `.env` dans le dossier `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/sondage-immo
JWT_SECRET=votre_secret_jwt_tres_securise_123456789
PORT=5001
NODE_ENV=development
```

**Frontend User** - Créer le fichier `.env` dans le dossier `frontend-user/`:
```env
REACT_APP_API_URL=http://localhost:5001
```

**Frontend Admin** - Créer le fichier `.env` dans le dossier `frontend-admin/`:
```env
REACT_APP_API_URL=http://localhost:5001
PORT=3001
```

---

## 🚀 Démarrage de l'Application

### Option 1: Démarrage séparé (recommandé pour le développement)

**Terminal 1 - MongoDB:**
```bash
# Assurez-vous que MongoDB est démarré
brew services start mongodb-community
# ou simplement
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
✅ Le serveur backend démarrera sur `http://localhost:5001`

**Terminal 3 - Frontend Utilisateur:**
```bash
cd frontend-user
npm start
```
✅ L'application utilisateur démarrera sur `http://localhost:3000`

**Terminal 4 - Frontend Admin:**
```bash
cd frontend-admin
PORT=3001 npm start
```
✅ L'application admin démarrera sur `http://localhost:3001`

---

## 📌 Accès à l'Application

### Interface Utilisateur (Public)
1. Ouvrez votre navigateur
2. Allez à: **http://localhost:3000**
3. Naviguez librement dans les différentes sections
4. Remplissez le questionnaire pour exprimer votre intérêt

### Interface Administration
1. Ouvrez votre navigateur
2. Allez à: **http://localhost:3001**
3. Connectez-vous avec les identifiants par défaut
4. Gérez le contenu et consultez les analyses

---

## 🔐 Informations de Connexion Admin

### Créer l'administrateur par défaut

Avant la première connexion, exécutez ce script:

```bash
cd backend
node src/scripts/createAdmin.js
```

### Identifiants par défaut:
* **Email:** `admin@citikongo.com`
* **Mot de passe:** `Admin123!`

⚠️ **IMPORTANT:** Changez ce mot de passe après la première connexion pour des raisons de sécurité!

---

## 📊 Fonctionnalités Principales

### 🌐 Interface Utilisateur (Frontend User - Port 3000)

#### 1. **Page d'Accueil**
* Hero section avec vidéo/image de fond
* Présentation des caractéristiques du projet
* Statistiques clés (nombre de logements, superficie)
* Témoignages clients

#### 2. **Présentation du Projet**
* Description détaillée du projet immobilier
* Galerie d'images et vidéos
* Points forts et avantages

#### 3. **Promoteur**
* Informations sur l'entreprise promotrice
* Portfolio des projets réalisés
* Certifications et agréments

#### 4. **Architecte**
* Profil et expérience de l'architecte
* Style architectural et philosophie
* Portfolio de réalisations

#### 5. **Catalogue Logements**
* Filtres par type (F2, F3, F4, Duplex)
* Filtres par prix et superficie
* Fiches détaillées avec caractéristiques
* Plans 2D et galerie photos

#### 6. **Visite 3D**
* Visites virtuelles immersives
* Navigation entre différents logements

#### 7. **Localisation**
* Carte interactive (Leaflet)
* Points d'intérêt à proximité
* Accès et transports

#### 8. **Analyse Économique**
* Tableau des coûts et prix de vente
* Graphiques de projection
* Informations fiscales

#### 9. **Options d'Achat**
* Paiement comptant / Crédit / Location-vente
* Simulateur de mensualités
* Étapes du processus d'achat

#### 10. **Questionnaire**
* Formulaire multi-étapes
* Collecte des préférences
* Budget et financement

### 🔧 Interface Administration (Frontend Admin - Port 3001)

#### 1. **Authentification Sécurisée**
* Page de connexion moderne (gradient bleu-violet)
* Validation des identifiants
* Protection par JWT

#### 2. **Tableau de Bord**
* Statistiques globales en temps réel
* Graphiques d'activité
* Réponses récentes
* Actions rapides

#### 3. **Gestion des Médias**
* Upload de vidéos et images
* Organisation par catégories
* Intégration vidéos YouTube

#### 4. **Analytics et Analyses**
* Statistiques par type, budget, financement
* Graphiques interactifs (camemberts, barres)
* Export CSV des données
* Gestion du statut des leads

#### 5. **Gestion de Contenu**
* Édition de toutes les pages
* Upload d'images et vidéos
* Configuration des logements
* Gestion du stock et prix

---

## 🗂️ Structure de la Base de Données

### Collections MongoDB

1. **admins** - Administrateurs de la plateforme
2. **homecontents** - Contenu de la page d'accueil
3. **presentations** - Présentation du projet
4. **promoteurs** - Informations promoteur
5. **architectes** - Informations architecte
6. **logements** - Catalogue des logements
7. **visite3ds** - Visites virtuelles 3D
8. **localisations** - Données de géolocalisation
9. **analyseeconomiques** - Données économiques
10. **optionachats** - Options de financement
11. **videos** - Médias (images/vidéos)
12. **reponses** - Réponses au questionnaire

---

## 🐛 Dépannage

### Problème: MongoDB ne démarre pas

```bash
# Vérifier le statut
brew services list

# Redémarrer MongoDB
brew services restart mongodb-community
```

### Problème: Port déjà utilisé

```bash
# Backend (5001)
lsof -i :5001
kill -9 <PID>

# Frontend User (3000)
lsof -i :3000
kill -9 <PID>

# Frontend Admin (3001)
lsof -i :3001
kill -9 <PID>
```

### Problème: Erreur JWT / Authentification

```javascript
// Dans la console du navigateur
localStorage.clear()
location.reload()
```

### Problème: Images ne s'affichent pas

```bash
# Vérifier les permissions
chmod -R 755 backend/uploads
```

---

## 📦 Technologies et Dépendances

### Backend
* express, mongoose, bcryptjs, jsonwebtoken, multer, cors, dotenv

### Frontend
* react, react-router-dom, axios, framer-motion, react-icons, recharts, leaflet

---

## 🔄 Flux de Données

**Création de Contenu (Admin):**
```
Admin → Login → Dashboard → Gestion Contenu →
API POST/PUT → MongoDB → Confirmation
```

**Consultation (Utilisateur):**
```
Utilisateur → Page → API GET → MongoDB → Affichage
```

**Soumission Questionnaire:**
```
Form → Validation → API POST → MongoDB (calcul score) → Admin Analytics
```

---

## 📝 Licence

Ce projet est sous licence privée. Tous droits réservés.

---

## 👥 Support

Pour toute question ou assistance:

* **Email:** support@votre-entreprise.com
* **Téléphone:** +243 XX XXX XXXX

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2025

🎉 **Bonne utilisation de votre application de sondage immobilier!**
