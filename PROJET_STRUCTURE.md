# 📁 Structure Complète du Projet

## Vue d'Ensemble

Ce projet est une **application complète de sondage immobilier** comprenant:

1. **Backend API** - Node.js + Express + MongoDB
2. **Frontend Utilisateur** - Interface pour les clients potentiels (React)
3. **Frontend Administrateur** - Interface de gestion et d'analyse (React)

---

## 🗂️ Structure Détaillée

```
APPLI SONDAGE IMMO/
│
├── 📄 README.md                    # Documentation principale
├── 📄 DEMARRAGE_RAPIDE.md          # Guide de démarrage rapide
├── 📄 PROJET_STRUCTURE.md          # Ce fichier
├── 🔧 install.sh                   # Script d'installation automatique
│
├── 📁 backend/                     # API REST
│   ├── 📁 src/
│   │   ├── 📁 models/              # Modèles MongoDB
│   │   │   ├── Admin.js            # Modèle Administrateur
│   │   │   ├── Projet.js           # Modèle Projet immobilier
│   │   │   ├── Logement.js         # Modèle Logement
│   │   │   ├── Questionnaire.js    # Modèle Questionnaire (42 questions)
│   │   │   └── Contenu.js          # Modèle Contenu dynamique
│   │   │
│   │   ├── 📁 routes/              # Routes API
│   │   │   ├── auth.js             # Routes d'authentification
│   │   │   ├── projets.js          # Routes projets
│   │   │   ├── questionnaires.js   # Routes questionnaires
│   │   │   ├── contenus.js         # Routes contenus
│   │   │   ├── uploads.js          # Routes upload fichiers
│   │   │   └── analytics.js        # Routes analytics
│   │   │
│   │   ├── 📁 controllers/         # Contrôleurs
│   │   │   ├── authController.js
│   │   │   ├── projetsController.js
│   │   │   ├── questionnairesController.js
│   │   │   ├── contenusController.js
│   │   │   ├── uploadsController.js
│   │   │   └── analyticsController.js
│   │   │
│   │   ├── 📁 middleware/          # Middlewares
│   │   │   ├── auth.js             # Authentification JWT
│   │   │   └── upload.js           # Gestion uploads Multer
│   │   │
│   │   ├── 📁 config/              # Configuration
│   │   │   └── database.js         # Configuration MongoDB
│   │   │
│   │   └── server.js               # Point d'entrée serveur
│   │
│   ├── 📁 public/
│   │   └── 📁 uploads/             # Fichiers uploadés
│   │       ├── 📁 images/
│   │       ├── 📁 videos/
│   │       └── 📁 documents/
│   │
│   ├── 📄 package.json
│   ├── 📄 .env.example
│   └── 📄 .gitignore
│
├── 📁 frontend-user/               # Interface Utilisateur (Clients)
│   ├── 📁 public/
│   │   └── index.html
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/          # Composants réutilisables
│   │   │   ├── Navbar.js           # Navigation principale
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.js           # Pied de page
│   │   │   └── Footer.css
│   │   │
│   │   ├── 📁 pages/               # Pages de l'application
│   │   │   ├── Home.js             # Page d'accueil
│   │   │   ├── Presentation.js     # Présentation du projet
│   │   │   ├── Promoteur.js        # Page promoteur
│   │   │   ├── Architecte.js       # Page architecte
│   │   │   ├── Logements.js        # Catalogue logements
│   │   │   ├── Visite3D.js         # Visite virtuelle
│   │   │   ├── Localisation.js     # Carte et localisation
│   │   │   ├── AnalyseEconomique.js # Analyse économique
│   │   │   ├── BanquesPartenaires.js # Partenaires bancaires
│   │   │   ├── Documents.js        # Documents téléchargeables
│   │   │   ├── OptionAchat.js      # Choix de logement
│   │   │   └── Questionnaire.js    # Questionnaire 42 questions
│   │   │
│   │   ├── 📁 services/            # Services API
│   │   │   └── api.js              # Configuration Axios
│   │   │
│   │   ├── 📁 assets/              # Ressources
│   │   │   ├── 📁 images/
│   │   │   ├── 📁 videos/
│   │   │   └── 📁 styles/
│   │   │
│   │   ├── App.js                  # Composant principal
│   │   ├── index.js                # Point d'entrée React
│   │   └── index.css               # Styles globaux
│   │
│   ├── 📄 package.json
│   ├── 📄 .env.example
│   └── 📄 .gitignore
│
└── 📁 frontend-admin/              # Interface Administrateur
    ├── 📁 public/
    │   └── index.html
    │
    ├── 📁 src/
    │   ├── 📁 components/          # Composants admin
    │   │   ├── Sidebar.js          # Barre latérale navigation
    │   │   ├── Header.js           # En-tête admin
    │   │   ├── StatsCard.js        # Carte statistique
    │   │   └── Charts/             # Composants graphiques
    │   │
    │   ├── 📁 pages/               # Pages admin
    │   │   ├── Login.js            # Connexion admin
    │   │   ├── Dashboard.js        # Tableau de bord
    │   │   ├── Questionnaires.js   # Gestion questionnaires
    │   │   ├── Analytics.js        # Analyses détaillées
    │   │   ├── Contenus.js         # Gestion contenus
    │   │   ├── Projets.js          # Gestion projets
    │   │   ├── Logements.js        # Gestion logements
    │   │   └── Settings.js         # Paramètres
    │   │
    │   ├── 📁 services/            # Services API
    │   │   └── api.js              # Configuration Axios + Auth
    │   │
    │   ├── 📁 utils/               # Utilitaires
    │   │   └── helpers.js          # Fonctions helpers
    │   │
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    │
    ├── 📄 package.json
    ├── 📄 .env.example
    └── 📄 .gitignore
```

---

## 🎯 Fonctionnalités par Module

### Backend API

#### Modèles de Données

1. **Admin** - Gestion des administrateurs
   - Email, mot de passe hashé
   - Rôles (super_admin, admin, editeur)
   - Dernière connexion

2. **Projet** - Informations projet immobilier
   - Nom, description, statut
   - Promoteur (nom, description, contact)
   - Architecte (nom, portfolio, réalisations)
   - Localisation (coordonnées GPS, proximités)
   - Analyse économique
   - Médias (images, vidéos, visite 3D)
   - Documents
   - Banques partenaires

3. **Logement** - Unités de logement
   - Type (F2, F3, F4, villa, etc.)
   - Superficie, nombre de pièces
   - Prix, prix au m²
   - Équipements
   - Statut (disponible, réservé, vendu)

4. **Questionnaire** - 42 questions
   - Introduction (2)
   - Démographie (8)
   - Situation actuelle (5)
   - Motivations (3)
   - Préférences (3)
   - Budget (4)
   - Critères d'importance (10)
   - Localisation (3)
   - Connaissance projet (7)
   - Contact final (7)
   - Score d'intérêt automatique (0-100)
   - Qualification (chaud/tiède/froid)

5. **Contenu** - Gestion dynamique
   - Par section (accueil, présentation, etc.)
   - Multi-types (texte, HTML, image, vidéo, JSON)
   - Historique des versions

#### Routes API

- `/api/auth` - Authentification admin
- `/api/projets` - CRUD projets
- `/api/questionnaires` - Soumission et gestion
- `/api/contenus` - Gestion contenus dynamiques
- `/api/uploads` - Upload de fichiers
- `/api/analytics` - Statistiques et analyses

### Frontend Utilisateur

#### Pages Publiques

1. **Accueil** - Vue d'ensemble du projet
2. **Présentation** - Détails complets
3. **Promoteur** - Info promoteur
4. **Architecte** - Portfolio Architectes 21
5. **Logements** - Catalogue avec filtres
6. **Visite 3D** - Visite virtuelle interactive
7. **Localisation** - Carte Leaflet + proximités
8. **Analyse Économique** - Contexte Côte d'Ivoire
9. **Banques Partenaires** - Options de financement
10. **Documents** - Brochures, plans, etc.
11. **Option d'Achat** - Sélection logement
12. **Questionnaire** - 42 questions interactives

#### Caractéristiques

- Design responsive (mobile-first)
- Animations fluides (Framer Motion)
- Carrousels d'images (Swiper)
- Cartes interactives (Leaflet)
- Formulaires validés (React Hook Form)
- Notifications (React Toastify)

### Frontend Admin

#### Pages Privées (Authentification requise)

1. **Login** - Connexion sécurisée JWT
2. **Dashboard** - KPIs et métriques temps réel
3. **Questionnaires** - Liste, filtres, détails
4. **Analytics** - Graphiques détaillés
   - Démographie
   - Budget
   - Préférences
   - Timeline
   - Qualité des leads
5. **Contenus** - Éditeur WYSIWYG
6. **Projets** - CRUD projets
7. **Logements** - CRUD logements
8. **Uploads** - Gestion médias
9. **Settings** - Configuration

#### Caractéristiques

- Authentification JWT
- Tableaux de données (React Table)
- Graphiques (Recharts)
- Éditeur riche (React Quill)
- Upload de fichiers
- Export de données (CSV, Excel)
- Filtres avancés

---

## 🔒 Sécurité

- **JWT** - Tokens sécurisés
- **Bcrypt** - Hash des mots de passe
- **Helmet** - Protection headers HTTP
- **CORS** - Origines contrôlées
- **Validation** - Données entrantes
- **Upload sécurisé** - Types et tailles limités

---

## 📊 Scoring Automatique

Le système calcule automatiquement un score d'intérêt (0-100) basé sur:

- Budget déclaré (30 points)
- Timeline d'achat (20 points)
- Volonté de visite (15 points)
- Opinion sur le projet (15 points)
- Consentements (10 points)
- Stabilité emploi (10 points)

**Qualification automatique:**
- 70-100 points = Lead CHAUD 🔥
- 40-69 points = Lead TIÈDE 🌡️
- 0-39 points = Lead FROID ❄️

---

## 🎨 Design & Couleurs

### Palette de Couleurs

```css
--primary-color: #1a5490;    /* Bleu principal */
--secondary-color: #f39c12;  /* Orange accent */
--accent-color: #27ae60;     /* Vert succès */
--dark-color: #2c3e50;       /* Texte sombre */
--light-color: #ecf0f1;      /* Fond clair */
```

### Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

---

## 📦 Technologies

### Stack Technique

**Backend:**
- Node.js v18+
- Express v4
- MongoDB v6+
- Mongoose
- JWT + Bcrypt
- Multer

**Frontend:**
- React 18
- React Router v6
- Axios
- React Hook Form
- Recharts
- Leaflet
- Swiper
- Framer Motion

---

## 🚀 Commandes Utiles

### Backend
```bash
npm run dev      # Mode développement
npm start        # Mode production
```

### Frontends
```bash
npm start        # Démarrage développement
npm run build    # Build production
npm test         # Tests
```

---

## 📞 Support & Contact

**Architectes 21**
- 46 Rue du Commerce, Immeuble L'Ebrien, Etage 5B
- Plateau, Abidjan, Côte d'Ivoire
- Tel: +225 27 20 23 09 55
- Cel: +225 07 78 46 52 88
- Email: info@architectes21s.com
- Web: www.architectes21s.com

---

**📅 Date de création:** Novembre 2025
**🤖 Développé avec:** Claude Code
