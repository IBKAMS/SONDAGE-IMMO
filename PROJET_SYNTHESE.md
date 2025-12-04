# SYNTHESE PROJET - PLATEFORME SONDAGE IMMOBILIER CITE KONGO

**Derniere mise a jour**: 4 Decembre 2024
**Version**: 1.0
**Statut**: En production

---

## 1. PRESENTATION GENERALE

### Description du Projet
Plateforme web complete de **sondage et prospection immobiliere** pour le projet **CITE KONGO** a Port-Bouet, Abidjan (Cote d'Ivoire). Elle permet aux prospects de decouvrir le projet, visualiser les logements, et remplir un questionnaire de qualification. Les administrateurs gerent le contenu et analysent les leads.

### Acteurs du Projet Immobilier
- **Promoteur**: KONGO IMMOBILIER
- **Architecte**: ARCHITECTES 21 (Ahissan Louis-Habib TANOH)
- **Localisation**: Port-Bouet, quartier ABEKAN-BERNARD, vue lagune Ebrie

### URLs de Production
| Application | URL | Hebergement |
|-------------|-----|-------------|
| Frontend Utilisateur | https://sondage.simulateur-immo.com | Vercel |
| Frontend Admin | https://admin-sondage.simulateur-immo.com | Vercel |
| Backend API | https://sondage-immo-backend.onrender.com | Render |

### URLs de Developpement
| Application | URL | Port |
|-------------|-----|------|
| Frontend Utilisateur | http://localhost:3000 | 3000 |
| Frontend Admin | http://localhost:3001 | 3001 |
| Backend API | http://localhost:5001 | 5001 |

---

## 2. ARCHITECTURE TECHNIQUE

### Stack Technologique (MERN)
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18)                       │
├─────────────────────────────┬───────────────────────────────┤
│   Frontend Utilisateur      │     Frontend Admin            │
│   - React 18.2.0            │     - React 18.2.0            │
│   - React Router DOM 6      │     - React Router DOM 6      │
│   - Framer Motion           │     - Framer Motion           │
│   - Leaflet (cartes)        │     - Recharts (graphiques)   │
│   - React Hook Form         │     - React Quill (editeur)   │
│   - Axios                   │     - FFmpeg.wasm (compress.) │
│   - React Toastify          │     - Context API (auth)      │
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│   - Express.js 4.18.2                                        │
│   - Mongoose (MongoDB ODM)                                   │
│   - JWT (authentification)                                   │
│   - Bcrypt (hachage mots de passe)                          │
│   - Multer + Cloudinary (upload fichiers)                   │
│   - Helmet, CORS (securite)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNEES                           │
│   - MongoDB Atlas (Cloud)                                    │
│   - 20+ Collections                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STOCKAGE FICHIERS                         │
│   - Cloudinary (images et videos)                           │
│   - Dossier: sondage-immo/                                  │
└─────────────────────────────────────────────────────────────┘
```

### Structure des Dossiers
```
/APPLI SONDAGE IMMO/
│
├── backend/                          # API Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Connexion MongoDB
│   │   │   └── cloudinary.js        # Config Cloudinary
│   │   ├── controllers/             # 23+ controleurs
│   │   ├── models/                  # 20+ modeles MongoDB
│   │   ├── routes/                  # 23+ fichiers routes
│   │   ├── middleware/
│   │   │   └── auth.js              # Middleware JWT
│   │   └── server.js                # Point d'entree
│   ├── package.json
│   └── .env
│
├── frontend-user/                    # App React publique
│   ├── src/
│   │   ├── pages/                   # 11 pages
│   │   ├── components/              # Navbar, Footer
│   │   ├── services/api.js          # Appels API
│   │   ├── hooks/                   # useMediaProtection
│   │   ├── config.js                # URL API
│   │   └── App.js                   # Routeur
│   └── package.json
│
├── frontend-admin/                   # App React admin
│   ├── src/
│   │   ├── pages/                   # 18 pages admin
│   │   ├── components/              # Navbar, ProtectedRoute
│   │   ├── context/AuthContext.js   # Authentification
│   │   ├── utils/                   # Compression video
│   │   ├── config.js                # URL API
│   │   └── App.js                   # Routeur protege
│   └── package.json
│
└── PROJET_SYNTHESE.md               # Ce fichier
```

---

## 3. FONCTIONNALITES

### Frontend Utilisateur (11 pages)

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Hero, statistiques, appels a action |
| Presentation | `/presentation` | Presentation detaillee du projet |
| Promoteur | `/promoteur` | Informations KONGO IMMOBILIER |
| Architecte | `/architecte` | Portfolio ARCHITECTES 21 |
| Logements | `/logements` | Catalogue avec filtres (type, prix, surface) |
| Visite 3D | `/visite-3d` | Visite virtuelle interactive |
| Localisation | `/localisation` | Carte interactive + carrousel images (4 max) |
| Analyse Economique | `/analyse-economique` | Contexte economique Cote d'Ivoire |
| Options d'Achat | `/option-achat` | Options financement + selection logement |
| Questionnaire | `/questionnaire/:logementId?` | Formulaire 42 questions |
| Banques Partenaires | `/banques-partenaires` | Partenaires financement |

### Frontend Admin (18 pages)

| Page | Route | Description |
|------|-------|-------------|
| Connexion | `/login` | Authentification JWT |
| Dashboard | `/dashboard` | KPIs, statistiques, actions rapides |
| Questionnaires | `/questionnaire` | Gestion reponses, qualification leads |
| Analytics | `/analytics` | Graphiques detailles (Recharts) |
| Accueil | `/accueil` | Edition contenu page accueil |
| Presentation | `/presentation` | Edition presentation projet |
| Promoteur | `/promoteur` | Gestion infos promoteur |
| Architecte | `/architecte` | Gestion infos architecte |
| Logements | `/logements` | Gestion catalogue logements |
| Logements Gestion | `/logements-gestion` | CRUD complet logements |
| Visite 3D | `/visite3d` | Configuration visite virtuelle |
| Localisation | `/localisation` | Carte, images personnalisees (4 max) |
| Analyse Economique | `/analyse-economique` | Edition donnees economiques |
| Options d'Achat | `/option-achat` | Edition options financement |
| Videos | `/videos` | Upload et gestion videos |

### Systeme de Questionnaire (42 questions)

**Sections:**
1. Introduction (2Q) - Type de bien interesse
2. Demographie (8Q) - Age, situation, revenus
3. Situation Actuelle (5Q) - Logement actuel
4. Motivations (3Q) - Raisons d'achat, timeline
5. Preferences (3Q) - Type bien, caracteristiques
6. Budget (4Q) - Capacite, mode financement
7. Criteres (10Q) - Echelle 1-5 sur 10 criteres
8. Localisation (3Q) - Zones preferees
9. Connaissance Projet (7Q) - Opinion, visite
10. Contact (7Q) - Coordonnees, consentements

**Scoring Automatique (0-100 points):**
```
Budget compatible           +30 pts
Timeline immediat           +20 pts
Timeline 0-3 mois          +15 pts
Veut visiter               +15 pts
Opinion positive           +15 pts
Paiement cash              +20 pts
Reservation >= 50%         +15 pts
Consentements              +5 pts
CDI                        +5 pts
```

**Qualification:**
- 70-100: CHAUD (Lead tres interesse)
- 40-69: TIEDE (Lead moderement interesse)
- 0-39: FROID (Lead peu interesse)

---

## 4. API BACKEND

### Endpoints Principaux

```
AUTHENTIFICATION
POST   /api/auth/login              # Connexion admin
GET    /api/auth/me                 # Profil admin connecte
PUT    /api/auth/update-password    # Changer mot de passe

QUESTIONNAIRES
POST   /api/questionnaires/submit   # Soumettre questionnaire
GET    /api/questionnaires          # Liste questionnaires
GET    /api/questionnaires/:id      # Detail questionnaire

LOGEMENTS
GET    /api/logements               # Liste logements
POST   /api/logements               # Creer logement
PUT    /api/logements/:id           # Modifier logement
DELETE /api/logements/:id           # Supprimer logement

CONTENUS (pour chaque section)
GET    /api/[section]-content       # Recuperer contenu
PUT    /api/[section]-content/:id   # Modifier contenu

Sections: home, presentation, promoteur, architecte,
          logements, visite3d, localisation,
          analyse-economique, option-achat, footer

LOCALISATION (images personnalisees)
POST   /api/localisation-content/:id/map-image           # Upload image (max 4)
DELETE /api/localisation-content/:id/map-image/:index    # Supprimer image
PUT    /api/localisation-content/:id/map-image/:index/caption  # Modifier legende

MEDIAS
POST   /api/videos                  # Upload video
GET    /api/videos                  # Liste videos
DELETE /api/videos/:id              # Supprimer video

STATISTIQUES
GET    /api/analytics               # Statistiques detaillees
GET    /api/dashboard-stats         # Stats dashboard
```

### Modeles MongoDB Principaux

| Modele | Description |
|--------|-------------|
| Admin | Administrateurs (email, password hashe, role) |
| Questionnaire | Reponses questionnaire + score + qualification |
| Logement | Unites logement (nom, surface, prix, equipements) |
| HomeContent | Contenu page accueil |
| PresentationContent | Contenu presentation |
| PromoteurContent | Infos promoteur |
| ArchitecteContent | Infos architecte |
| LocalisationContent | Carte + images (mapImages array, max 4) |
| OptionAchatContent | Options financement |
| Video/Image | Medias uploades |

---

## 5. SECURITE

### Mesures Implementees
- **JWT**: Tokens signes pour authentification admin
- **Bcrypt**: Hachage mots de passe (10 salts)
- **CORS**: Whitelist stricte des origines autorisees
- **Helmet**: Protection headers HTTP
- **Validation**: Donnees entrantes validees
- **Roles**: super_admin, admin, editeur
- **Protection Medias**: Watermark, clic droit desactive

### Identifiants Admin par Defaut
```
Email: admin@citikongo.com
Mot de passe: Admin123!
```

---

## 6. DEPLOIEMENT

### Production

**Backend (Render)**
- Service: Web Service
- Build: `npm install`
- Start: `npm start`
- Variables d'environnement configurees

**Frontend User (Vercel)**
- Framework: Create React App
- Root Directory: `frontend-user`
- Variable: `REACT_APP_API_URL=https://sondage-immo-backend.onrender.com`

**Frontend Admin (Vercel)**
- Framework: Create React App
- Root Directory: `frontend-admin`
- Variable: `REACT_APP_API_URL=https://sondage-immo-backend.onrender.com`

### Developpement Local

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend User
cd frontend-user
npm install
npm start

# Terminal 3: Frontend Admin
cd frontend-admin
npm install
PORT=3001 npm start
```

---

## 7. VARIABLES D'ENVIRONNEMENT

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://[user]:[password]@cluster0.mongodb.net/sondage-immo
JWT_SECRET=[secret_securise]
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dsmxeiwzq
CLOUDINARY_API_KEY=531126836319942
CLOUDINARY_API_SECRET=[secret]
```

### Frontends (.env ou Vercel)
```env
REACT_APP_API_URL=https://sondage-immo-backend.onrender.com
```

---

## 8. HISTORIQUE DES MODIFICATIONS RECENTES

### 4 Decembre 2024
- [x] Augmentation nombre images carte localisation de 3 a 4
- [x] Correction affichage description complete logements (page Option Achat)
- [x] Creation fichier synthese projet

### Modifications Anterieures
- Implementation carrousel images localisation (evite CORS Google Maps)
- Upload images via Cloudinary
- Systeme de legendes pour images carte
- Compression video FFmpeg cote client

---

## 9. PROBLEMES CONNUS ET SOLUTIONS

### Upload images en production (Vercel)
**Probleme**: Les images ne s'uploadent pas depuis admin en production
**Solution**:
1. Verifier variable `REACT_APP_API_URL` sur Vercel
2. Verifier Root Directory = `frontend-admin`
3. Redeploy sans cache (decocher "Use existing Build Cache")

### Images Google Maps bloquees (CORS)
**Probleme**: Les images Google Maps ne s'affichent pas
**Solution**: Utiliser des images personnalisees uploadees sur Cloudinary (carrousel 4 images max)

---

## 10. CONTACTS ET RESSOURCES

### Repository
- GitHub: https://github.com/IBKAMS/SONDAGE-IMMO

### Hebergement
- Frontend: Vercel (https://vercel.com)
- Backend: Render (https://render.com)
- Base de donnees: MongoDB Atlas
- Medias: Cloudinary

### Documentation
- Ce fichier: `PROJET_SYNTHESE.md`
- README du projet

---

## 11. POUR REPRENDRE LE PROJET

### Etapes pour un nouveau developpeur ou Claude

1. **Lire ce fichier** pour comprendre l'architecture
2. **Cloner le repository** depuis GitHub
3. **Configurer les variables d'environnement** (.env)
4. **Installer les dependances** (`npm install` dans chaque dossier)
5. **Demarrer en local** pour tester
6. **Consulter les issues GitHub** pour les taches en cours

### Points d'attention
- Le scoring questionnaire est automatique (voir backend controller)
- Les images localisation passent par Cloudinary (max 4)
- L'authentification admin utilise JWT stocke dans localStorage
- Chaque section de contenu a son propre endpoint API

### Commandes Utiles
```bash
# Voir les logs backend
npm run dev

# Linter frontend
npm run lint

# Build production
npm run build

# Tests (si configures)
npm test
```

---

**Ce document doit etre mis a jour a chaque modification majeure du projet.**
