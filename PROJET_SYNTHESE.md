# SYNTHESE PROJET - PLATEFORME SONDAGE IMMOBILIER CITE KONGO

**Derniere mise a jour**: 22 Decembre 2025
**Version**: 3.0
**Statut**: En production

---

## 1. PRESENTATION GENERALE

### Description du Projet
Plateforme web complete de **sondage et prospection immobiliere** pour le projet **CITE KONGO** a Port-Bouet, Abidjan (Cote d'Ivoire). Elle permet aux prospects de decouvrir le projet, visualiser les logements, et remplir un questionnaire de qualification. Les administrateurs gerent le contenu et analysent les leads. Un systeme d'**apporteurs d'affaires** permet le suivi des prospects referes avec commissions.

### Acteurs du Projet Immobilier
- **Promoteur**: KONGO IMMOBILIER
- **Architecte**: ARCHITECTES 21 (Ahissan Louis-Habib TANOH)
- **Localisation**: Port-Bouet, quartier ABEKAN-BERNARD, vue lagune Ebrie
- **Logements**: 115 villas

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
│   - Protection Media        │     - Dual Auth (Admin/Apport)│
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│   - Express.js 4.18.2                                        │
│   - Mongoose (MongoDB ODM)                                   │
│   - JWT (authentification Admin + Apporteur)                │
│   - Bcrypt (hachage mots de passe)                          │
│   - Multer + Cloudinary (upload fichiers)                   │
│   - Helmet, CORS (securite)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNEES                           │
│   - MongoDB Atlas (Cloud)                                    │
│   - 25+ Collections                                          │
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
│   │   ├── controllers/             # 27+ controleurs
│   │   │   ├── apporteurAuthController.js      # Auth apporteurs
│   │   │   ├── apporteurDashboardController.js # Dashboard API
│   │   │   ├── apporteursController.js         # CRUD apporteurs
│   │   │   ├── questionnairesController.js     # + etape dossier
│   │   │   └── ...
│   │   ├── models/                  # 24+ modeles MongoDB
│   │   │   ├── ApporteurAffaires.js # Apporteurs + stats
│   │   │   ├── Counter.js           # Sequences N° dossier
│   │   │   ├── Questionnaire.js     # + etapeDossier, commission
│   │   │   └── ...
│   │   ├── routes/                  # 28+ fichiers routes
│   │   │   ├── apporteurAuth.js
│   │   │   ├── apporteurDashboard.js
│   │   │   ├── apporteurs.js
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   └── auth.js              # Middleware JWT (Admin + Apporteur)
│   │   └── server.js                # Point d'entree
│   ├── package.json
│   └── .env
│
├── frontend-user/                    # App React publique
│   ├── src/
│   │   ├── pages/                   # 12 pages
│   │   │   ├── Questionnaire.js     # + code acces, modeFinancement
│   │   │   ├── OptionAchat.js       # + modal code acces
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── CodeApporteurModal.js # Modal code acces
│   │   │   ├── ProtectedImage.js     # Protection media
│   │   │   └── Navbar, Footer
│   │   ├── hooks/
│   │   │   └── useMediaProtection.js # Anti-copie media
│   │   ├── services/api.js
│   │   ├── config.js
│   │   └── App.js
│   └── package.json
│
├── frontend-admin/                   # App React admin
│   ├── src/
│   │   ├── pages/                   # 20+ pages admin
│   │   │   ├── ApporteursGestion.js  # CRUD apporteurs + etapes
│   │   │   ├── ApporteurDashboard.js # Dashboard + timeline
│   │   │   ├── Analytics.js          # Graphiques detailles
│   │   │   ├── Login.js              # Dual auth (Admin/Apporteur)
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── Navbar.js            # Menu selon role
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js       # Dual auth + impersonation
│   │   ├── config.js
│   │   └── App.js
│   └── package.json
│
├── PROJET_SYNTHESE.md               # CE FICHIER
└── README.md
```

---

## 3. SYSTEME D'APPORTEURS D'AFFAIRES (NOUVEAU)

### Vue d'ensemble
Systeme complet permettant a des partenaires (apporteurs d'affaires) de referer des prospects et de suivre leurs commissions.

### Fonctionnalites

#### Pour les Apporteurs
- **Connexion separee** avec email/mot de passe
- **Code unique** (5 caracteres) a partager avec les prospects
- **Dashboard personnel** avec:
  - Statistiques (prospects, conversions, commissions)
  - Liste des prospects referes
  - **Timeline de suivi des dossiers** (8 etapes)
  - Historique des commissions
- **Changement de mot de passe**

#### Pour les Administrateurs
- **Gestion complete des apporteurs** (CRUD)
- **Visualisation mot de passe initial**
- **Acces au dashboard apporteur** (impersonation)
- **Modification des etapes de dossier** pour chaque prospect
- **Suivi des commissions**

### Les 8 Etapes du Dossier
```
1. Dossier cree        → Questionnaire enregistre
2. Contact etabli      → Premier contact realise
3. Visite effectuee    → Visite du projet realisee
4. Reservation         → Reservation confirmee (→ statut converti)
5. Financement valide  → Financement approuve
6. Signature notaire   → Acte signe chez le notaire
7. Construction        → Construction en cours
8. Remise des cles     → Proprietaire !
```

### Timeline Visuelle
- **Etapes completees**: Vert avec icone check
- **Etape en cours**: Orange avec animation scintillante/pulse
- **Etapes a venir**: Gris
- **Maison au bout**: Icone violet avec bordure animee
- **Barre de progression** qui se remplit

### Format Numero de Dossier
- **Avec code apporteur**: `ABC12-2026-001`
- **Sans code (organique)**: `ORG-2026-001`

### Calcul Commission
- Taux configurable par apporteur (defaut: 2%)
- Declenchee quand statut → "converti" (etape 4+)
- Etats: non_applicable → en_attente → validee → payee

---

## 4. FONCTIONNALITES

### Frontend Utilisateur (12 pages)

| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Hero, statistiques, appels a action |
| Presentation | `/presentation` | Presentation detaillee du projet |
| Promoteur | `/promoteur` | Informations KONGO IMMOBILIER |
| Architecte | `/architecte` | Portfolio ARCHITECTES 21 + 4 projets + lightbox |
| Logements | `/logements` | Catalogue avec filtres (type, prix, surface) |
| Visite 3D | `/visite-3d` | Visite virtuelle interactive |
| Localisation | `/localisation` | Carte interactive + carrousel images (4 max) |
| Analyse Economique | `/analyse-economique` | Contexte economique Cote d'Ivoire |
| Options d'Achat | `/option-achat` | Options financement + **modal code acces** |
| Questionnaire | `/questionnaire/:logementId?` | Formulaire + **code acces obligatoire** |
| Banques Partenaires | `/banques-partenaires` | Partenaires financement |

### Frontend Admin (20+ pages)

| Page | Route | Description |
|------|-------|-------------|
| Connexion | `/login` | **Dual auth** (Admin OU Apporteur) |
| Dashboard | `/dashboard` | KPIs, statistiques, actions rapides |
| **Apporteurs** | `/apporteurs` | Gestion CRUD + etapes dossier |
| **Dashboard Apporteur** | `/apporteur-dashboard` | Vue apporteur + timeline |
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
| Videos | `/videos` | Upload videos + 4 images architecte |

### Systeme de Questionnaire

**10 Sections:**
1. Introduction - Type de bien interesse
2. Demographie - Age, situation, revenus
3. **Situation Professionnelle** - Categorie, secteur, **employeur (obligatoire)**, stabilite
4. Situation Actuelle - Logement actuel
5. Motivations - Raisons d'achat, timeline
6. Preferences - Type bien, caracteristiques
7. **Budget et Financement** - Budget, mode financement avec 3 options:
   - Paiement Comptant (reduction 5%)
   - Echelonnement Promoteur (30% apport, sans interet)
   - Financement Bancaire (jusqu'a 20 ans)
8. Criteres - Echelle 1-5 sur 10 criteres
9. Localisation - Zones preferees
10. Contact - Coordonnees, consentements

**Code d'Acces (ex Code Apporteur):**
- Modal obligatoire avant le questionnaire
- Libelle: "Code d'acces" / "Code de recommandation"
- Pas de mention "apporteur d'affaires" (confidentialite)

**Message de Succes:**
> "Merci pour votre interet ! Notre equipe vous contactera dans les meilleurs delais."

**Scoring Automatique (0-100 points):**
```
Budget compatible           +30 pts
Paiement cash avec remise   +20 pts
Pourcentage reservation 50%+ +15 pts
Timeline immediat/0-3 mois  +15 pts
Veut visiter               +10 pts
Opinion positive           +10 pts
Consentements              +5 pts
CDI/Fonctionnaire          +5 pts
```

**Qualification:**
- 70-100: CHAUD
- 40-69: TIEDE
- 0-39: FROID

---

## 5. API BACKEND

### Endpoints Principaux

```
AUTHENTIFICATION ADMIN
POST   /api/auth/login              # Connexion admin
GET    /api/auth/me                 # Profil admin connecte
PUT    /api/auth/update-password    # Changer mot de passe

AUTHENTIFICATION APPORTEUR
POST   /api/apporteur/login         # Connexion apporteur
POST   /api/apporteur/login-as      # Impersonation par admin
GET    /api/apporteur/me            # Profil apporteur connecte
PUT    /api/apporteur/update-password # Changer mot de passe

GESTION APPORTEURS (Admin)
GET    /api/apporteurs              # Liste apporteurs + stats
POST   /api/apporteurs              # Creer apporteur (genere code)
PUT    /api/apporteurs/:id          # Modifier apporteur
DELETE /api/apporteurs/:id          # Supprimer apporteur
PUT    /api/apporteurs/:id/regenerate-code  # Nouveau code
GET    /api/apporteurs/:id/prospects # Prospects d'un apporteur

DASHBOARD APPORTEUR
GET    /api/apporteur/dashboard/stats      # Statistiques
GET    /api/apporteur/dashboard/prospects  # Mes prospects
GET    /api/apporteur/dashboard/prospects/:id # Detail prospect
GET    /api/apporteur/dashboard/commissions # Mes commissions

QUESTIONNAIRES
POST   /api/questionnaires/submit   # Soumettre (+ codeApporteur)
GET    /api/questionnaires          # Liste questionnaires
GET    /api/questionnaires/:id      # Detail questionnaire
PUT    /api/questionnaires/:id      # Modifier questionnaire
DELETE /api/questionnaires/:id      # Supprimer questionnaire
PUT    /api/questionnaires/:id/etape # Mettre a jour etape dossier
PUT    /api/questionnaires/:id/statut # Mettre a jour statut

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

IMAGES ARCHITECTE (4 types)
POST   /api/architecte-images       # Upload image
GET    /api/architecte-images       # Liste toutes les images
GET    /api/architecte-images/:type # Image par type
DELETE /api/architecte-images/:type # Supprimer image

Types: projet-architecte-1, projet-architecte-2,
       projet-architecte-3, projet-architecte-4

LOCALISATION (images personnalisees)
POST   /api/localisation-content/:id/map-image           # Upload (max 4)
DELETE /api/localisation-content/:id/map-image/:index    # Supprimer
PUT    /api/localisation-content/:id/map-image/:index/caption  # Legende

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
| **ApporteurAffaires** | Code, profil, tauxCommission, statistiques, password |
| **Counter** | Sequences pour numeros de dossier |
| Questionnaire | Reponses + score + **etapeDossier** + **commission** + **codeApporteur** |
| Logement | Unites logement (nom, surface, prix, equipements) |
| HomeContent | Contenu page accueil |
| PresentationContent | Contenu presentation |
| PromoteurContent | Infos promoteur |
| ArchitecteContent | Infos architecte |
| ArchitecteImage | Images projets (4 types) |
| LocalisationContent | Carte + images (max 4) |
| OptionAchatContent | Options financement |
| Video/Image | Medias uploades |

---

## 6. SECURITE

### Mesures Implementees
- **JWT**: Tokens signes (Admin ET Apporteur)
- **Bcrypt**: Hachage mots de passe (10 salts)
- **CORS**: Whitelist stricte des origines
- **Helmet**: Protection headers HTTP
- **Validation**: Donnees entrantes validees
- **Roles**: super_admin, admin, editeur, apporteur
- **Protection Medias**: Watermark, clic droit desactive

### Identifiants Admin par Defaut
```
Email: admin@citikongo.com
Mot de passe: Admin123!
```

---

## 7. DEPLOIEMENT

### Production

**Backend (Render)**
- Service: Web Service
- Build: `npm install`
- Start: `npm start`
- Variables d'environnement configurees
- Auto-deploy sur push GitHub

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

## 8. VARIABLES D'ENVIRONNEMENT

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

## 9. HISTORIQUE DES MODIFICATIONS

### 22 Decembre 2025 (Session actuelle)
- [x] **Systeme de suivi des dossiers** (timeline 8 etapes)
  - Ajout `etapeDossier`, `dateEtape`, `historiqueEtapes` dans Questionnaire
  - API `PUT /api/questionnaires/:id/etape`
  - Timeline visuelle avec animation scintillante dans ApporteurDashboard
  - Selecteur d'etape dans ApporteursGestion (admin)
- [x] **Code d'acces obligatoire** (remplacement code apporteur visible)
  - Retrait mentions "apporteur d'affaires" (confidentialite)
  - Modal code obligatoire avant questionnaire
- [x] **Employeur obligatoire** dans section Situation Professionnelle
- [x] **Mode de financement** avec 3 options detaillees
- [x] **Message succes** en minuscules "meilleurs delais"
- [x] **Bordures formulaire visibles** dans modal creation apporteur

### 18-19 Decembre 2025
- [x] Systeme complet d'apporteurs d'affaires
- [x] Dashboard apporteur avec statistiques
- [x] Dual authentication (Admin + Apporteur)
- [x] Impersonation admin vers dashboard apporteur
- [x] Gestion mot de passe apporteur (visible/changeable)
- [x] Numeros de dossier automatiques (CODE-ANNEE-SEQ)

### 6 Decembre 2025
- [x] Agrandissement images section Architecte
- [x] Ajout 4eme image architecte
- [x] Lightbox modal pour images architecte

### 4 Decembre 2025
- [x] Augmentation images carte localisation (3 → 4)
- [x] Correction affichage description logements

---

## 10. FICHIERS CLES MODIFIES RECEMMENT

### Backend
| Fichier | Description |
|---------|-------------|
| `models/ApporteurAffaires.js` | Modele apporteur avec stats et password |
| `models/Counter.js` | Sequences numeros de dossier |
| `models/Questionnaire.js` | + etapeDossier, historiqueEtapes, commission |
| `controllers/apporteurAuthController.js` | Auth apporteur + impersonation |
| `controllers/apporteursController.js` | CRUD apporteurs |
| `controllers/apporteurDashboardController.js` | Stats et prospects |
| `controllers/questionnairesController.js` | + updateEtapeDossier |
| `middleware/auth.js` | + protectApporteur |
| `routes/apporteur*.js` | Routes apporteurs |

### Frontend Admin
| Fichier | Description |
|---------|-------------|
| `pages/ApporteursGestion.js` | CRUD apporteurs + selecteur etape |
| `pages/ApporteursGestion.css` | Styles + etape selector |
| `pages/ApporteurDashboard.js` | Dashboard + timeline 8 etapes |
| `pages/ApporteurDashboard.css` | Styles timeline + animations |
| `pages/Login.js` | Dual auth (admin/apporteur) |
| `pages/Analytics.js` | Graphiques avec colonnes N° dossier |
| `context/AuthContext.js` | Dual auth + loginAsApporteur |

### Frontend User
| Fichier | Description |
|---------|-------------|
| `components/CodeApporteurModal.js` | Modal code d'acces |
| `pages/OptionAchat.js` | + modal code obligatoire |
| `pages/Questionnaire.js` | + employeur requis, modeFinancement |
| `hooks/useMediaProtection.js` | Protection anti-copie |

---

## 11. POUR REPRENDRE LE PROJET

### IMPORTANT - Lire en premier
Ce fichier `PROJET_SYNTHESE.md` contient toute l'information necessaire pour reprendre le developpement. **Toujours le lire en debut de session.**

### Etapes pour reprendre

1. **Lire ce fichier** pour comprendre l'architecture et l'etat actuel
2. **Verifier le git status** pour voir les modifications en cours
3. **Consulter l'historique des commits** pour comprendre les derniers changements
4. **Installer les dependances** si necessaire (`npm install`)
5. **Demarrer en local** pour tester

### Points d'attention critiques

1. **Systeme Apporteurs d'Affaires**:
   - Dual auth: Admin (`/api/auth/login`) ET Apporteur (`/api/apporteur/login`)
   - Code 5 caracteres genere automatiquement
   - Dashboard separe pour apporteurs

2. **Suivi Dossiers (Timeline)**:
   - 8 etapes de `dossier_cree` a `remise_cles`
   - Animation scintillante sur etape en cours
   - Admin peut changer etape via ApporteursGestion

3. **Code d'Acces**:
   - Obligatoire avant questionnaire
   - NE PAS mentionner "apporteur d'affaires" (confidentialite)
   - Labels: "Code d'acces", "Code de recommandation"

4. **Questionnaire**:
   - Employeur obligatoire
   - 3 modes de financement avec details
   - Score automatique (0-100)

5. **Numeros de Dossier**:
   - Avec code: `ABC12-2026-001`
   - Sans code: `ORG-2026-001`

### Commandes Utiles
```bash
# Voir les logs backend
cd backend && npm run dev

# Lancer frontend user
cd frontend-user && npm start

# Lancer frontend admin
cd frontend-admin && PORT=3001 npm start

# Git status
git status

# Voir derniers commits
git log --oneline -10

# Build production
npm run build
```

### Tester le systeme apporteurs
```bash
# 1. Se connecter en tant qu'admin
POST /api/auth/login
{ "email": "admin@citikongo.com", "password": "Admin123!" }

# 2. Creer un apporteur
POST /api/apporteurs
{ "nom": "Dupont", "prenom": "Jean", "email": "jean@test.com", "password": "Pass123!" }

# 3. Se connecter en tant qu'apporteur
POST /api/apporteur/login
{ "email": "jean@test.com", "password": "Pass123!" }

# 4. Voir le dashboard apporteur
GET /api/apporteur/dashboard/stats
```

---

## 12. CHECKLIST AVANT DEPLOIEMENT

- [ ] Tester en local (frontend-user, frontend-admin, backend)
- [ ] Verifier les variables d'environnement
- [ ] Tester le flow complet apporteur
- [ ] Tester le questionnaire avec code
- [ ] Commit avec message clair
- [ ] Push sur GitHub (deploiement auto)
- [ ] Attendre deploiement Render (backend) ~2-5 min
- [ ] Attendre deploiement Vercel (frontends) ~1-2 min
- [ ] Tester en production
- [ ] Mettre a jour ce fichier si modification majeure

---

## 13. CONTACTS ET RESSOURCES

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

**CE DOCUMENT DOIT ETRE MIS A JOUR A CHAQUE MODIFICATION MAJEURE DU PROJET.**

**Derniere modification: 22 Decembre 2025**
- Systeme de suivi dossiers (timeline 8 etapes)
- Code d'acces obligatoire (confidentialite apporteurs)
- Mode de financement 3 options
- Employeur obligatoire
