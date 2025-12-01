const mongoose = require('mongoose');

const analyseEconomiqueContentSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      required: true,
      default: 'Analyse Économique'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Étude du contexte économique ivoirien et du marché immobilier d\'Abidjan'
    }
  },

  // Introduction Section
  introSection: {
    title: {
      type: String,
      required: true,
      default: 'Dynamisme de l\'Économie Ivoirienne'
    },
    paragraph1: {
      type: String,
      required: true,
      default: 'La Côte d\'Ivoire affiche depuis plus d\'une décennie une économie en forte croissance, figurant parmi les plus dynamiques d\'Afrique subsaharienne. Après la crise politique du début des années 2010, le pays a renoué avec la stabilité et engagé des réformes économiques ambitieuses. Ainsi, entre 2012 et 2019, le PIB réel a progressé en moyenne de +8,2 % par an, l\'un des taux les plus élevés de la région.'
    },
    paragraph2: {
      type: String,
      required: true,
      default: 'La pandémie de Covid-19 n\'a entraîné qu\'un ralentissement temporaire : la croissance est restée positive (+2 % en 2020) puis a rebondi à +7 % en 2021, illustrant la résilience de l\'économie ivoirienne. En 2023-2024, l\'économie maintient une dynamique soutenue avec une croissance estimée à +6,2 % en 2023 et +6,5 % en 2024, largement supérieure aux moyennes africaine et mondiale.'
    },
    highlightTitle: {
      type: String,
      required: true,
      default: 'Indicateurs macroéconomiques clés'
    },
    highlightItems: {
      type: [String],
      default: [
        'Croissance PIB 2023 : +6,2 %',
        'Croissance PIB 2024 : +6,5 % (estimé)',
        'Projection 2025 : +6,3 % (FMI, BAD, Banque mondiale)',
        'Inflation 2024 : 3,47 %',
        'Inflation 2025 : ~2,8 % (retour bande cible BCEAO 1-3 %)'
      ]
    },
    paragraph3: {
      type: String,
      required: true,
      default: 'Sur le plan macroéconomique, la Côte d\'Ivoire conserve des fondamentaux globalement sains malgré les chocs externes récents. L\'inflation connaît une tendance baissière après un pic à 4,4 % en 2023. Elle est estimée à 3,47 % en 2024 et devrait revenir dans la bande cible de la BCEAO (1 % à 3 %) en 2025, autour de 2,8 %, grâce à la politique monétaire restrictive de la BCEAO et aux mesures gouvernementales de soutien au pouvoir d\'achat.'
    },
    pndTitle: {
      type: String,
      required: true,
      default: 'Plan National de Développement (PND) 2021-2025'
    },
    pndDescription: {
      type: String,
      required: true,
      default: 'L\'État ivoirien déploie activement son PND, un programme d\'investissement de 59 000 milliards FCFA (environ 90-100 milliards USD) qui vise la transformation structurelle de l\'économie. Ce PND met l\'accent sur :'
    },
    pndItems: {
      type: [String],
      default: [
        'Les infrastructures de transport (ponts, routes, métro d\'Abidjan)',
        'L\'industrialisation et l\'énergie',
        'L\'éducation et la santé',
        'Le logement social avec l\'objectif d\'accroître fortement l\'offre de logements abordables'
      ]
    }
  },

  // Video Section
  videoSection: {
    title: {
      type: String,
      required: true,
      default: 'Analyse économique en vidéo'
    },
    subtitle: {
      type: String,
      required: true,
      default: 'Comprendre le contexte économique et le potentiel du marché immobilier'
    }
  },

  // Urbanisation Section
  urbanisationSection: {
    title: {
      type: String,
      required: true,
      default: 'Urbanisation d\'Abidjan et Marché Immobilier'
    },
    stat1Value: {
      type: String,
      required: true,
      default: '6,32 M'
    },
    stat1Label: {
      type: String,
      required: true,
      default: 'Habitants à Abidjan (2021)'
    },
    stat1Evolution: {
      type: String,
      required: true,
      default: '+3,5 à +4,5 % par an'
    },
    stat2Value: {
      type: String,
      required: true,
      default: '52,5%'
    },
    stat2Label: {
      type: String,
      required: true,
      default: 'Taux d\'urbanisation national'
    },
    stat2Evolution: {
      type: String,
      required: true,
      default: 'Pays majoritairement urbain depuis 2014'
    },
    stat3Value: {
      type: String,
      required: true,
      default: '800 000+'
    },
    stat3Label: {
      type: String,
      required: true,
      default: 'Déficit de logements'
    },
    stat3Evolution: {
      type: String,
      required: true,
      default: 'Besoin national fin 2023'
    },
    paragraph1: {
      type: String,
      required: true,
      default: 'Abidjan, capitale économique ivoirienne, connaît une urbanisation galopante, reflet de la transition démographique et économique du pays. La population abidjanaise a presque doublé en 20 ans : elle est passée d\'environ 3,13 millions d\'habitants en 1998 à 4,7 millions en 2014, puis a atteint 6,32 millions d\'habitants lors du recensement de 2021.'
    },
    deficitTitle: {
      type: String,
      required: true,
      default: 'Le déficit de logements : un défi majeur'
    },
    deficitParagraph: {
      type: String,
      required: true,
      default: 'Cette explosion démographique urbaine exerce une pression considérable sur le marché immobilier résidentiel. La demande de logements formels augmente bien plus vite que l\'offre disponible. Malgré un boom de la construction depuis une décennie, l\'offre de nouveaux logements n\'a pas suivi le rythme des besoins.'
    },
    deficitItems: {
      type: [String],
      default: [
        '2019 : Déficit national estimé à ~600 000 logements',
        '2023 : Déficit dépassant 800 000 logements',
        'Abidjan : Plus de 670 000 logements manquants',
        'Croissance annuelle du déficit : +50 000 unités/an'
      ]
    },
    deficitHighlight: {
      type: String,
      required: true,
      default: 'Pour stabiliser le déficit, il faudrait construire 40 à 50 000 nouveaux logements par an, contre seulement ~15 000 actuellement.'
    },
    paragraph2: {
      type: String,
      required: true,
      default: 'Le marché immobilier abidjanais est ainsi en pleine croissance, porté par l\'essor d\'une classe moyenne urbaine et la multiplication de programmes résidentiels privés. D\'après les analyses sectorielles, le marché immobilier en Côte d\'Ivoire a progressé d\'environ +18 % par an depuis 2011 en termes de volume d\'affaires.'
    }
  },

  // Port-Bouët Section
  portBouetSection: {
    title: {
      type: String,
      required: true,
      default: 'La Commune de Port-Bouët : Atouts et Dynamique'
    },
    leadParagraph: {
      type: String,
      required: true,
      default: 'Port-Bouët est l\'une des 10 communes d\'Abidjan, située à l\'extrême sud de la ville, bordée par l\'océan Atlantique au sud et la lagune Ébrié au nord. D\'une superficie d\'environ 73,7 km², elle occupe une position stratégique en abritant deux infrastructures cruciales : l\'Aéroport International Félix Houphouët-Boigny et l\'accès maritime via le canal de Vridi.'
    },
    demoTitle: {
      type: String,
      required: true,
      default: 'Évolution démographique fulgurante'
    },
    demo1Year: {
      type: String,
      required: true,
      default: '1998'
    },
    demo1Value: {
      type: String,
      required: true,
      default: '212 000 hab.'
    },
    demo2Year: {
      type: String,
      required: true,
      default: '2014'
    },
    demo2Value: {
      type: String,
      required: true,
      default: '419 000 hab.'
    },
    demo3Year: {
      type: String,
      required: true,
      default: '2021'
    },
    demo3Value: {
      type: String,
      required: true,
      default: '619 000 hab.'
    },
    demoGrowthRate: {
      type: String,
      required: true,
      default: 'Croissance annuelle moyenne : +4,2 % (2014-2021)\nSoit ~10 % de la population d\'Abidjan'
    },
    atoutsTitle: {
      type: String,
      required: true,
      default: 'Atouts stratégiques majeurs'
    },
    atout1Title: {
      type: String,
      required: true,
      default: '✈️ Plateforme aéroportuaire'
    },
    atout1Description: {
      type: String,
      required: true,
      default: 'L\'aéroport international a atteint 2,3 millions de passagers en 2019. Grands travaux d\'extension en cours (330 milliards FCFA) pour porter la capacité à 5 millions de passagers/an d\'ici 2026.'
    },
    atout2Title: {
      type: String,
      required: true,
      default: '🛣️ Échangeur Akwaba'
    },
    atout2Description: {
      type: String,
      required: true,
      default: 'Inauguré en mars 2025, cette infrastructure de 31,2 milliards FCFA comprend deux ponts et 5 km de voiries, réduisant drastiquement le temps de trajet vers le centre-ville (15-20 minutes du Plateau).'
    },
    atout3Title: {
      type: String,
      required: true,
      default: '🚇 Futur Métro d\'Abidjan'
    },
    atout3Description: {
      type: String,
      required: true,
      default: 'Port-Bouët sera le terminus sud de la Ligne 1 (37 km). Mise en service attendue en 2026, permettant de rallier le Plateau en 30 minutes.'
    },
    atout4Title: {
      type: String,
      required: true,
      default: '🚢 Infrastructure portuaire'
    },
    atout4Description: {
      type: String,
      required: true,
      default: 'Le Terminal à Conteneurs TC2 (596 milliards FCFA) double la capacité portuaire. Port d\'Abidjan : 28,3 millions de tonnes en 2022, premier hub de la sous-région.'
    },
    atout5Title: {
      type: String,
      required: true,
      default: '🏖️ Atouts naturels'
    },
    atout5Description: {
      type: String,
      required: true,
      default: 'Littoral océanique avec plages, proximité lagune, réserves foncières importantes. Prix foncier moyen : 56 000 FCFA/m² (contre >1 million au Plateau).'
    },
    atout6Title: {
      type: String,
      required: true,
      default: '📈 Dynamique économique'
    },
    atout6Description: {
      type: String,
      required: true,
      default: 'Zone industrielle de Vridi, raffinerie SIR, emplois aéroportuaires et portuaires. Mixité d\'activités assurant un vivier d\'emplois formels.'
    }
  },

  // Abékan Section
  abekanSection: {
    title: {
      type: String,
      required: true,
      default: 'Le Quartier Abékan Bernard : Un Potentiel Exceptionnel'
    },
    leadParagraph: {
      type: String,
      required: true,
      default: 'Abékan Bernard est un quartier en devenir de la commune de Port-Bouët, résultant d\'un lotissement récent de la zone d\'Abouabou. Situé au nord-est de Port-Bouët, dans la zone d\'extension vers Grand-Bassam, ce lotissement approuvé en 2009 est emblématique des nouveaux quartiers planifiés pour absorber la croissance urbaine.'
    },
    caracTitle: {
      type: String,
      required: true,
      default: 'Caractéristiques du lotissement'
    },
    caracItems: {
      type: [String],
      default: [
        '✓ Parcelles avec titres fonciers sécurisés (ACD)',
        '✓ Terrain viabilisé : eau et électricité disponibles',
        '✓ Voiries tracées et libérées des empiétements illégaux',
        '✓ Potentiel de valorisation : x2 à x3 à moyen terme'
      ]
    },
    positionTitle: {
      type: String,
      required: true,
      default: 'Position stratégique exceptionnelle'
    },
    position1Title: {
      type: String,
      required: true,
      default: 'Entre Abidjan et Grand-Bassam'
    },
    position1Description: {
      type: String,
      required: true,
      default: 'Situé entre la capitale économique (emplois, services) et la station balnéaire UNESCO (~20 km), offrant qualité de vie et accessibilité.'
    },
    position2Title: {
      type: String,
      required: true,
      default: 'Accès direct autoroute'
    },
    position2Description: {
      type: String,
      required: true,
      default: 'Connecté directement à l\'axe autoroutier Abidjan-Bassam. Temps de trajet : 20-30 min du Plateau hors congestion.'
    },
    position3Title: {
      type: String,
      required: true,
      default: 'Proximité mer et lagune'
    },
    position3Description: {
      type: String,
      required: true,
      default: 'Quelques kilomètres du littoral. Avantage climatique (brises marines) et qualité de vie recherchée (plages accessibles).'
    },
    position4Title: {
      type: String,
      required: true,
      default: 'Zone en développement urbain'
    },
    position4Description: {
      type: String,
      required: true,
      default: 'Nouveaux lotissements voisins, future "Ville Nouvelle" au sud. Pionnier dans une zone appelée à forte valorisation.'
    },
    demandeTitle: {
      type: String,
      required: true,
      default: 'Une demande locale immédiate et forte'
    },
    demandeParagraph: {
      type: String,
      required: true,
      default: 'Le niveau de demande en logement à Abékan Bernard est potentiellement très élevé compte tenu de plusieurs facteurs convergents :'
    },
    demandeItems: {
      type: [String],
      default: [
        'Déficit global : Chaque nouveau logement trouve aisément preneur dans la capitale économique',
        'Attrait de Port-Bouët : Manque de lotissements modernisés, demande locale non satisfaite',
        'Proximité emplois : Personnel aéroport, port, zone industrielle cherchant logements proches',
        'Valorisation attendue : Infrastructure métro + Ville Nouvelle = multiplication valeur foncière',
        'Diaspora intéressée : Ivoiriens de l\'étranger cherchant placements sécurisés'
      ]
    }
  },

  // PESTEL Section
  pestelSection: {
    title: {
      type: String,
      required: true,
      default: 'Analyse PESTEL du Projet'
    },
    politiqueItems: {
      type: [String],
      default: [
        'Stabilité retrouvée depuis 2011',
        'Engagement gouvernemental fort pour le logement',
        'Programme 150 000 logements sociaux',
        'Appui local (Mairie de Port-Bouët)',
        'Climat des affaires amélioré'
      ]
    },
    economiqueItems: {
      type: [String],
      default: [
        'Croissance soutenue (+6 % an)',
        'Inflation maîtrisée (~2 %)',
        'Crédit disponible, banques actives',
        'Marché immobilier +18 %/an',
        'Coûts construction stabilisés'
      ]
    },
    socioculturelItems: {
      type: [String],
      default: [
        'Population jeune en croissance',
        'Culture forte de la propriété',
        'Nucléarisation des familles urbaines',
        'Diaspora investisseuse active',
        'Valorisation des cités planifiées'
      ]
    },
    technologiqueItems: {
      type: [String],
      default: [
        'Digitalisation permis de construire',
        'BIM et outils modernes disponibles',
        'Solutions domotiques émergentes',
        'Énergies renouvelables (solaire)',
        'Matériaux de construction innovants'
      ]
    },
    environnementalItems: {
      type: [String],
      default: [
        'Gestion drainage et inondations',
        'Études d\'impact requises',
        'Protection écosystèmes lagunaires',
        'Adaptation climatique nécessaire',
        'Opportunités finance verte'
      ]
    },
    legalItems: {
      type: [String],
      default: [
        'Foncier sécurisé (titres ACD)',
        'Code Construction 2019 structurant',
        'Procédures administratives simplifiées',
        'Cadre juridique favorable aux PPP',
        'Normes urbanisme respectées'
      ]
    }
  },

  // Marché Section
  marcheSection: {
    title: {
      type: String,
      required: true,
      default: 'Données du Marché Immobilier'
    },
    coutsTitle: {
      type: String,
      required: true,
      default: 'Coûts de construction (FCFA/m²)'
    },
    cout1Title: {
      type: String,
      required: true,
      default: 'Logement économique'
    },
    cout1Value: {
      type: String,
      required: true,
      default: '~200 000'
    },
    cout1Description: {
      type: String,
      required: true,
      default: 'Finitions basiques'
    },
    cout2Title: {
      type: String,
      required: true,
      default: 'Logement moyen'
    },
    cout2Value: {
      type: String,
      required: true,
      default: '~250 000 - 300 000'
    },
    cout2Description: {
      type: String,
      required: true,
      default: 'Notre gamme de projet'
    },
    cout3Title: {
      type: String,
      required: true,
      default: 'Haut de gamme'
    },
    cout3Value: {
      type: String,
      required: true,
      default: '> 400 000'
    },
    cout3Description: {
      type: String,
      required: true,
      default: 'Finitions premium'
    }
  },

  // Conclusion Section
  conclusionSection: {
    title: {
      type: String,
      required: true,
      default: 'Conclusion'
    },
    leadParagraph: {
      type: String,
      required: true,
      default: 'L\'analyse exhaustive du contexte économique, urbain et stratégique autour du projet de 136 logements à Abékan Bernard (Port-Bouët) met en évidence sa pertinence multidimensionnelle.'
    },
    point1Title: {
      type: String,
      required: true,
      default: 'Sur le plan économique'
    },
    point1Description: {
      type: String,
      required: true,
      default: 'La Côte d\'Ivoire offre un cadre stable et en croissance : PIB +6 %+, inflation maîtrisée (~2 %), marché immobilier en essor avec demande largement excédentaire.'
    },
    point2Title: {
      type: String,
      required: true,
      default: 'Sur le plan stratégique'
    },
    point2Description: {
      type: String,
      required: true,
      default: 'Port-Bouët et Abékan Bernard : zone d\'expansion soutenue par infrastructures structurantes (échangeur Akwaba, futur métro, extension aéroport), combinant accessibilité et potentiel de valorisation.'
    },
    point3Title: {
      type: String,
      required: true,
      default: 'Sur le plan social'
    },
    point3Description: {
      type: String,
      required: true,
      default: 'L\'initiative répond au besoin criant de logement décent pour les classes moyennes, contribuant à réduire le déficit de 800 000+ logements tout en améliorant le cadre de vie.'
    },
    point4Title: {
      type: String,
      required: true,
      default: 'Pour les investisseurs'
    },
    point4Description: {
      type: String,
      required: true,
      default: 'Demande assurée, valorisation foncière attendue, cadre juridique sécurisé, potentiel de rentabilité locative brute de 8-10 % annuel.'
    },
    finalStatement1: {
      type: String,
      required: true,
      default: 'En synthèse, ce projet de construction de logements s\'imbrique parfaitement dans le dynamisme économique, urbain et social de la Côte d\'Ivoire en 2025. Il capitalise sur les tendances positives (croissance, urbanisation, investissements publics) tout en apportant une solution concrète à un problème structurel majeur.'
    },
    finalStatement2: {
      type: String,
      required: true,
      default: 'Tous les voyants sont au vert pour envisager une opération rentable, sûre et à fort impact socio-économique.'
    }
  },

  // Indique si c'est le contenu actif
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour récupérer rapidement le contenu actif
analyseEconomiqueContentSchema.index({ isActive: 1 });

// Middleware pour s'assurer qu'il n'y a qu'un seul contenu actif à la fois
analyseEconomiqueContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('AnalyseEconomiqueContent', analyseEconomiqueContentSchema);
