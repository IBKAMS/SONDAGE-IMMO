const AnalyseEconomiqueContent = require('../models/AnalyseEconomiqueContent');

// @desc    Récupérer le contenu actif de la page Analyse Économique
// @route   GET /api/analyse-economique-content
// @access  Public
exports.getAnalyseEconomiqueContent = async (req, res) => {
  try {
    let content = await AnalyseEconomiqueContent.findOne({ isActive: true });

    // Si aucun contenu n'existe, créer le contenu par défaut
    if (!content) {
      content = await AnalyseEconomiqueContent.create({
        hero: {
          title: 'Analyse Économique',
          subtitle: 'Étude du contexte économique ivoirien et du marché immobilier d\'Abidjan'
        },
        introSection: {
          title: 'Dynamisme de l\'Économie Ivoirienne',
          paragraph1: 'La Côte d\'Ivoire affiche depuis plus d\'une décennie une économie en forte croissance, figurant parmi les plus dynamiques d\'Afrique subsaharienne. Après la crise politique du début des années 2010, le pays a renoué avec la stabilité et engagé des réformes économiques ambitieuses. Ainsi, entre 2012 et 2019, le PIB réel a progressé en moyenne de +8,2 % par an, l\'un des taux les plus élevés de la région.',
          paragraph2: 'La pandémie de Covid-19 n\'a entraîné qu\'un ralentissement temporaire : la croissance est restée positive (+2 % en 2020) puis a rebondi à +7 % en 2021, illustrant la résilience de l\'économie ivoirienne. En 2023-2024, l\'économie maintient une dynamique soutenue avec une croissance estimée à +6,2 % en 2023 et +6,5 % en 2024, largement supérieure aux moyennes africaine et mondiale.',
          highlightTitle: 'Indicateurs macroéconomiques clés',
          highlightItems: [
            'Croissance PIB 2023 : +6,2 %',
            'Croissance PIB 2024 : +6,5 % (estimé)',
            'Projection 2025 : +6,3 % (FMI, BAD, Banque mondiale)',
            'Inflation 2024 : 3,47 %',
            'Inflation 2025 : ~2,8 % (retour bande cible BCEAO 1-3 %)'
          ],
          paragraph3: 'Sur le plan macroéconomique, la Côte d\'Ivoire conserve des fondamentaux globalement sains malgré les chocs externes récents. L\'inflation connaît une tendance baissière après un pic à 4,4 % en 2023. Elle est estimée à 3,47 % en 2024 et devrait revenir dans la bande cible de la BCEAO (1 % à 3 %) en 2025, autour de 2,8 %, grâce à la politique monétaire restrictive de la BCEAO et aux mesures gouvernementales de soutien au pouvoir d\'achat.',
          pndTitle: 'Plan National de Développement (PND) 2021-2025',
          pndDescription: 'L\'État ivoirien déploie activement son PND, un programme d\'investissement de 59 000 milliards FCFA (environ 90-100 milliards USD) qui vise la transformation structurelle de l\'économie. Ce PND met l\'accent sur :',
          pndItems: [
            'Les infrastructures de transport (ponts, routes, métro d\'Abidjan)',
            'L\'industrialisation et l\'énergie',
            'L\'éducation et la santé',
            'Le logement social avec l\'objectif d\'accroître fortement l\'offre de logements abordables'
          ]
        },
        videoSection: {
          title: 'Analyse économique en vidéo',
          subtitle: 'Comprendre le contexte économique et le potentiel du marché immobilier'
        },
        urbanisationSection: {
          title: 'Urbanisation d\'Abidjan et Marché Immobilier',
          stat1Value: '6,32 M',
          stat1Label: 'Habitants à Abidjan (2021)',
          stat1Evolution: '+3,5 à +4,5 % par an',
          stat2Value: '52,5%',
          stat2Label: 'Taux d\'urbanisation national',
          stat2Evolution: 'Pays majoritairement urbain depuis 2014',
          stat3Value: '800 000+',
          stat3Label: 'Déficit de logements',
          stat3Evolution: 'Besoin national fin 2023',
          paragraph1: 'Abidjan, capitale économique ivoirienne, connaît une urbanisation galopante, reflet de la transition démographique et économique du pays. La population abidjanaise a presque doublé en 20 ans : elle est passée d\'environ 3,13 millions d\'habitants en 1998 à 4,7 millions en 2014, puis a atteint 6,32 millions d\'habitants lors du recensement de 2021.',
          deficitTitle: 'Le déficit de logements : un défi majeur',
          deficitParagraph: 'Cette explosion démographique urbaine exerce une pression considérable sur le marché immobilier résidentiel. La demande de logements formels augmente bien plus vite que l\'offre disponible. Malgré un boom de la construction depuis une décennie, l\'offre de nouveaux logements n\'a pas suivi le rythme des besoins.',
          deficitItems: [
            '2019 : Déficit national estimé à ~600 000 logements',
            '2023 : Déficit dépassant 800 000 logements',
            'Abidjan : Plus de 670 000 logements manquants',
            'Croissance annuelle du déficit : +50 000 unités/an'
          ],
          deficitHighlight: 'Pour stabiliser le déficit, il faudrait construire 40 à 50 000 nouveaux logements par an, contre seulement ~15 000 actuellement.',
          paragraph2: 'Le marché immobilier abidjanais est ainsi en pleine croissance, porté par l\'essor d\'une classe moyenne urbaine et la multiplication de programmes résidentiels privés. D\'après les analyses sectorielles, le marché immobilier en Côte d\'Ivoire a progressé d\'environ +18 % par an depuis 2011 en termes de volume d\'affaires.'
        },
        portBouetSection: {
          title: 'La Commune de Port-Bouët : Atouts et Dynamique',
          leadParagraph: 'Port-Bouët est l\'une des 10 communes d\'Abidjan, située à l\'extrême sud de la ville, bordée par l\'océan Atlantique au sud et la lagune Ébrié au nord. D\'une superficie d\'environ 73,7 km², elle occupe une position stratégique en abritant deux infrastructures cruciales : l\'Aéroport International Félix Houphouët-Boigny et l\'accès maritime via le canal de Vridi.',
          demoTitle: 'Évolution démographique fulgurante',
          demo1Year: '1998',
          demo1Value: '212 000 hab.',
          demo2Year: '2014',
          demo2Value: '419 000 hab.',
          demo3Year: '2021',
          demo3Value: '619 000 hab.',
          demoGrowthRate: 'Croissance annuelle moyenne : +4,2 % (2014-2021)\nSoit ~10 % de la population d\'Abidjan',
          atoutsTitle: 'Atouts stratégiques majeurs',
          atout1Title: '✈️ Plateforme aéroportuaire',
          atout1Description: 'L\'aéroport international a atteint 2,3 millions de passagers en 2019. Grands travaux d\'extension en cours (330 milliards FCFA) pour porter la capacité à 5 millions de passagers/an d\'ici 2026.',
          atout2Title: '🛣️ Échangeur Akwaba',
          atout2Description: 'Inauguré en mars 2025, cette infrastructure de 31,2 milliards FCFA comprend deux ponts et 5 km de voiries, réduisant drastiquement le temps de trajet vers le centre-ville (15-20 minutes du Plateau).',
          atout3Title: '🚇 Futur Métro d\'Abidjan',
          atout3Description: 'Port-Bouët sera le terminus sud de la Ligne 1 (37 km). Mise en service attendue en 2026, permettant de rallier le Plateau en 30 minutes.',
          atout4Title: '🚢 Infrastructure portuaire',
          atout4Description: 'Le Terminal à Conteneurs TC2 (596 milliards FCFA) double la capacité portuaire. Port d\'Abidjan : 28,3 millions de tonnes en 2022, premier hub de la sous-région.',
          atout5Title: '🏖️ Atouts naturels',
          atout5Description: 'Littoral océanique avec plages, proximité lagune, réserves foncières importantes. Prix foncier moyen : 56 000 FCFA/m² (contre >1 million au Plateau).',
          atout6Title: '📈 Dynamique économique',
          atout6Description: 'Zone industrielle de Vridi, raffinerie SIR, emplois aéroportuaires et portuaires. Mixité d\'activités assurant un vivier d\'emplois formels.'
        },
        abekanSection: {
          title: 'Le Quartier Abékan Bernard : Un Potentiel Exceptionnel',
          leadParagraph: 'Abékan Bernard est un quartier en devenir de la commune de Port-Bouët, résultant d\'un lotissement récent de la zone d\'Abouabou. Situé au nord-est de Port-Bouët, dans la zone d\'extension vers Grand-Bassam, ce lotissement approuvé en 2009 est emblématique des nouveaux quartiers planifiés pour absorber la croissance urbaine.',
          caracTitle: 'Caractéristiques du lotissement',
          caracItems: [
            '✓ Parcelles avec titres fonciers sécurisés (ACD)',
            '✓ Terrain viabilisé : eau et électricité disponibles',
            '✓ Voiries tracées et libérées des empiétements illégaux',
            '✓ Potentiel de valorisation : x2 à x3 à moyen terme'
          ],
          positionTitle: 'Position stratégique exceptionnelle',
          position1Title: 'Entre Abidjan et Grand-Bassam',
          position1Description: 'Situé entre la capitale économique (emplois, services) et la station balnéaire UNESCO (~20 km), offrant qualité de vie et accessibilité.',
          position2Title: 'Accès direct autoroute',
          position2Description: 'Connecté directement à l\'axe autoroutier Abidjan-Bassam. Temps de trajet : 20-30 min du Plateau hors congestion.',
          position3Title: 'Proximité mer et lagune',
          position3Description: 'Quelques kilomètres du littoral. Avantage climatique (brises marines) et qualité de vie recherchée (plages accessibles).',
          position4Title: 'Zone en développement urbain',
          position4Description: 'Nouveaux lotissements voisins, future "Ville Nouvelle" au sud. Pionnier dans une zone appelée à forte valorisation.',
          demandeTitle: 'Une demande locale immédiate et forte',
          demandeParagraph: 'Le niveau de demande en logement à Abékan Bernard est potentiellement très élevé compte tenu de plusieurs facteurs convergents :',
          demandeItems: [
            'Déficit global : Chaque nouveau logement trouve aisément preneur dans la capitale économique',
            'Attrait de Port-Bouët : Manque de lotissements modernisés, demande locale non satisfaite',
            'Proximité emplois : Personnel aéroport, port, zone industrielle cherchant logements proches',
            'Valorisation attendue : Infrastructure métro + Ville Nouvelle = multiplication valeur foncière',
            'Diaspora intéressée : Ivoiriens de l\'étranger cherchant placements sécurisés'
          ]
        },
        pestelSection: {
          title: 'Analyse PESTEL du Projet',
          politiqueItems: [
            'Stabilité retrouvée depuis 2011',
            'Engagement gouvernemental fort pour le logement',
            'Programme 150 000 logements sociaux',
            'Appui local (Mairie de Port-Bouët)',
            'Climat des affaires amélioré'
          ],
          economiqueItems: [
            'Croissance soutenue (+6 % an)',
            'Inflation maîtrisée (~2 %)',
            'Crédit disponible, banques actives',
            'Marché immobilier +18 %/an',
            'Coûts construction stabilisés'
          ],
          socioculturelItems: [
            'Population jeune en croissance',
            'Culture forte de la propriété',
            'Nucléarisation des familles urbaines',
            'Diaspora investisseuse active',
            'Valorisation des cités planifiées'
          ],
          technologiqueItems: [
            'Digitalisation permis de construire',
            'BIM et outils modernes disponibles',
            'Solutions domotiques émergentes',
            'Énergies renouvelables (solaire)',
            'Matériaux de construction innovants'
          ],
          environnementalItems: [
            'Gestion drainage et inondations',
            'Études d\'impact requises',
            'Protection écosystèmes lagunaires',
            'Adaptation climatique nécessaire',
            'Opportunités finance verte'
          ],
          legalItems: [
            'Foncier sécurisé (titres ACD)',
            'Code Construction 2019 structurant',
            'Procédures administratives simplifiées',
            'Cadre juridique favorable aux PPP',
            'Normes urbanisme respectées'
          ]
        },
        marcheSection: {
          title: 'Données du Marché Immobilier',
          coutsTitle: 'Coûts de construction (FCFA/m²)',
          cout1Title: 'Logement économique',
          cout1Value: '~200 000',
          cout1Description: 'Finitions basiques',
          cout2Title: 'Logement moyen',
          cout2Value: '~250 000 - 300 000',
          cout2Description: 'Notre gamme de projet',
          cout3Title: 'Haut de gamme',
          cout3Value: '> 400 000',
          cout3Description: 'Finitions premium'
        },
        conclusionSection: {
          title: 'Conclusion',
          leadParagraph: 'L\'analyse exhaustive du contexte économique, urbain et stratégique autour du projet de 136 logements à Abékan Bernard (Port-Bouët) met en évidence sa pertinence multidimensionnelle.',
          point1Title: 'Sur le plan économique',
          point1Description: 'La Côte d\'Ivoire offre un cadre stable et en croissance : PIB +6 %+, inflation maîtrisée (~2 %), marché immobilier en essor avec demande largement excédentaire.',
          point2Title: 'Sur le plan stratégique',
          point2Description: 'Port-Bouët et Abékan Bernard : zone d\'expansion soutenue par infrastructures structurantes (échangeur Akwaba, futur métro, extension aéroport), combinant accessibilité et potentiel de valorisation.',
          point3Title: 'Sur le plan social',
          point3Description: 'L\'initiative répond au besoin criant de logement décent pour les classes moyennes, contribuant à réduire le déficit de 800 000+ logements tout en améliorant le cadre de vie.',
          point4Title: 'Pour les investisseurs',
          point4Description: 'Demande assurée, valorisation foncière attendue, cadre juridique sécurisé, potentiel de rentabilité locative brute de 8-10 % annuel.',
          finalStatement1: 'En synthèse, ce projet de construction de logements s\'imbrique parfaitement dans le dynamisme économique, urbain et social de la Côte d\'Ivoire en 2025. Il capitalise sur les tendances positives (croissance, urbanisation, investissements publics) tout en apportant une solution concrète à un problème structurel majeur.',
          finalStatement2: 'Tous les voyants sont au vert pour envisager une opération rentable, sûre et à fort impact socio-économique.'
        },
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur récupération contenu Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu'
    });
  }
};

// @desc    Récupérer tous les contenus (pour historique/versions)
// @route   GET /api/analyse-economique-content/all
// @access  Public (À PROTÉGER PLUS TARD)
exports.getAllAnalyseEconomiqueContents = async (req, res) => {
  try {
    const contents = await AnalyseEconomiqueContent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur récupération tous les contenus Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus'
    });
  }
};

// @desc    Créer un nouveau contenu (version alternative)
// @route   POST /api/analyse-economique-content
// @access  Public (À PROTÉGER PLUS TARD)
exports.createAnalyseEconomiqueContent = async (req, res) => {
  try {
    const content = await AnalyseEconomiqueContent.create(req.body);

    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur création contenu Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contenu'
    });
  }
};

// @desc    Mettre à jour le contenu de la page Analyse Économique
// @route   PUT /api/analyse-economique-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.updateAnalyseEconomiqueContent = async (req, res) => {
  try {
    const content = await AnalyseEconomiqueContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur mise à jour contenu Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu'
    });
  }
};

// @desc    Supprimer un contenu
// @route   DELETE /api/analyse-economique-content/:id
// @access  Public (À PROTÉGER PLUS TARD)
exports.deleteAnalyseEconomiqueContent = async (req, res) => {
  try {
    const content = await AnalyseEconomiqueContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Ne pas supprimer le contenu actif si c'est le seul
    if (content.isActive) {
      const count = await AnalyseEconomiqueContent.countDocuments();
      if (count === 1) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de supprimer le seul contenu actif'
        });
      }
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression contenu Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu'
    });
  }
};

// @desc    Activer un contenu spécifique
// @route   PUT /api/analyse-economique-content/:id/activate
// @access  Public (À PROTÉGER PLUS TARD)
exports.activateAnalyseEconomiqueContent = async (req, res) => {
  try {
    // Désactiver tous les autres contenus
    await AnalyseEconomiqueContent.updateMany({}, { isActive: false });

    // Activer le contenu sélectionné
    const content = await AnalyseEconomiqueContent.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur activation contenu Analyse Économique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'activation du contenu'
    });
  }
};
