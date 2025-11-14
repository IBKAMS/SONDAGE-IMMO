import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import API_URL from '../config';
import './AnalyseEconomique.css';

const AnalyseEconomique = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos/analyseEconomique`);
        if (response.ok) {
          const data = await response.json();
          // Vérifier que data et data.url existent
          if (data && data.url) {
            setVideoUrl(`${API_URL}${data.url}`);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analyse-economique-content`);
        if (response.ok) {
          const data = await response.json();
          // L'API retourne {success: true, data: {...}}, donc on extrait data.data
          if (data.success && data.data) {
            setContent(data.data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      }
    };

    fetchVideo();
    fetchContent();
  }, []);

  return (
    <div className="analyse-economique-page">
      {/* Hero Section */}
      <section className="analyse-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content?.hero?.title || "Analyse Économique"}</h1>
            <p className="hero-subtitle">
              {content?.hero?.subtitle || "Étude du contexte économique ivoirien et du marché immobilier d'Abidjan"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section intro-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.introSection?.title || "Dynamisme de l'Économie Ivoirienne"}</h2>

            <div className="content-text">
              <p>
                {content?.introSection?.paragraph1 || "La Côte d'Ivoire affiche depuis plus d'une décennie une économie en forte croissance, figurant parmi les plus dynamiques d'Afrique subsaharienne. Après la crise politique du début des années 2010, le pays a renoué avec la stabilité et engagé des réformes économiques ambitieuses. Ainsi, entre 2012 et 2019, le PIB réel a progressé en moyenne de +8,2 % par an, l'un des taux les plus élevés de la région."}
              </p>

              <p>
                {content?.introSection?.paragraph2 || "La pandémie de Covid-19 n'a entraîné qu'un ralentissement temporaire : la croissance est restée positive (+2 % en 2020) puis a rebondi à +7 % en 2021, illustrant la résilience de l'économie ivoirienne. En 2023-2024, l'économie maintient une dynamique soutenue avec une croissance estimée à +6,2 % en 2023 et +6,5 % en 2024, largement supérieure aux moyennes africaine et mondiale."}
              </p>

              <div className="highlight-box">
                <h3>{content?.introSection?.highlightTitle || "Indicateurs macroéconomiques clés"}</h3>
                <ul>
                  {content?.introSection?.highlightItems?.length > 0 ? (
                    content.introSection.highlightItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li><strong>Croissance PIB 2023 :</strong> +6,2 %</li>
                      <li><strong>Croissance PIB 2024 :</strong> +6,5 % (estimé)</li>
                      <li><strong>Projection 2025 :</strong> +6,3 % (FMI, BAD, Banque mondiale)</li>
                      <li><strong>Inflation 2024 :</strong> 3,47 %</li>
                      <li><strong>Inflation 2025 :</strong> ~2,8 % (retour bande cible BCEAO 1-3 %)</li>
                    </>
                  )}
                </ul>
              </div>

              <p>
                {content?.introSection?.paragraph3 || "Sur le plan macroéconomique, la Côte d'Ivoire conserve des fondamentaux globalement sains malgré les chocs externes récents. L'inflation connaît une tendance baissière après un pic à 4,4 % en 2023. Elle est estimée à 3,47 % en 2024 et devrait revenir dans la bande cible de la BCEAO (1 % à 3 %) en 2025, autour de 2,8 %, grâce à la politique monétaire restrictive de la BCEAO et aux mesures gouvernementales de soutien au pouvoir d'achat. Le climat des affaires s'est nettement renforcé au cours de la dernière décennie, ce qui favorise la confiance des investisseurs. Des réformes structurelles ont été menées pour moderniser l'administration et améliorer la gouvernance économique : création de guichets uniques pour la création d'entreprise, digitalisation de nombreux services publics, et adoption d'un nouveau Code de la Construction en 2019 qui encadre mieux les chantiers et l'urbanisme."}
              </p>

              <div className="pnd-box">
                <h3>{content?.introSection?.pndTitle || "Plan National de Développement (PND) 2021-2025"}</h3>
                <p>
                  {content?.introSection?.pndDescription || "L'État ivoirien déploie activement son PND, un programme d'investissement de 59 000 milliards FCFA (environ 90-100 milliards USD) qui vise la transformation structurelle de l'économie. Ce PND met l'accent sur :"}
                </p>
                <ul>
                  {content?.introSection?.pndItems?.length > 0 ? (
                    content.introSection.pndItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Les infrastructures de transport (ponts, routes, métro d'Abidjan)</li>
                      <li>L'industrialisation et l'énergie</li>
                      <li>L'éducation et la santé</li>
                      <li><strong>Le logement social</strong> avec l'objectif d'accroître fortement l'offre de logements abordables</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Analyse Economique Section */}
      <section className="section video-analyse-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="video-analyse-content"
          >
            <h2 className="section-title text-center">{content?.videoSection?.title || "Analyse économique en vidéo"}</h2>
            <p className="section-subtitle text-center">
              {content?.videoSection?.subtitle || "Comprendre le contexte économique et le potentiel du marché immobilier"}
            </p>

            <div className="video-analyse-container">
              <div className="video-analyse-wrapper">
                {loading ? (
                  <div className="video-loading">Chargement de la vidéo...</div>
                ) : videoUrl ? (
                  <video
                    ref={videoRef}
                    className="video-analyse-player"
                    controls
                    preload="metadata"
                    poster="/assets/images/analyse-poster.jpg"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                ) : (
                  <div className="video-error">Aucune vidéo disponible</div>
                )}

                {!loading && videoUrl && !isPlaying && (
                  <div
                    className="video-analyse-overlay"
                    onClick={() => videoRef.current?.play()}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="play-button-analyse">
                      <FaPlay />
                    </div>
                    <p className="overlay-text-analyse">Voir l'analyse complète</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urbanisation d'Abidjan */}
      <section className="section urbanisation-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.urbanisationSection?.title || "Urbanisation d'Abidjan et Marché Immobilier"}</h2>

            <div className="stats-cards">
              <motion.div
                className="stat-card-eco"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3>{content?.urbanisationSection?.stat1Value || "6,32 M"}</h3>
                <p>{content?.urbanisationSection?.stat1Label || "Habitants à Abidjan (2021)"}</p>
                <span className="evolution">{content?.urbanisationSection?.stat1Evolution || "+3,5 à +4,5 % par an"}</span>
              </motion.div>

              <motion.div
                className="stat-card-eco"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h3>{content?.urbanisationSection?.stat2Value || "52,5%"}</h3>
                <p>{content?.urbanisationSection?.stat2Label || "Taux d'urbanisation national"}</p>
                <span className="evolution">{content?.urbanisationSection?.stat2Evolution || "Pays majoritairement urbain depuis 2014"}</span>
              </motion.div>

              <motion.div
                className="stat-card-eco"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h3>{content?.urbanisationSection?.stat3Value || "800 000+"}</h3>
                <p>{content?.urbanisationSection?.stat3Label || "Déficit de logements"}</p>
                <span className="evolution">{content?.urbanisationSection?.stat3Evolution || "Besoin national fin 2023"}</span>
              </motion.div>
            </div>

            <div className="content-text">
              <p>
                {content?.urbanisationSection?.paragraph1 || "Abidjan, capitale économique ivoirienne, connaît une urbanisation galopante, reflet de la transition démographique et économique du pays. La population abidjanaise a presque doublé en 20 ans : elle est passée d'environ 3,13 millions d'habitants en 1998 à 4,7 millions en 2014, puis a atteint 6,32 millions d'habitants lors du recensement de 2021."}
              </p>

              <div className="deficit-box">
                <h3>{content?.urbanisationSection?.deficitTitle || "Le déficit de logements : un défi majeur"}</h3>
                <p>
                  {content?.urbanisationSection?.deficitParagraph || "Cette explosion démographique urbaine exerce une pression considérable sur le marché immobilier résidentiel. La demande de logements formels augmente bien plus vite que l'offre disponible. Malgré un boom de la construction depuis une décennie, l'offre de nouveaux logements n'a pas suivi le rythme des besoins."}
                </p>
                <ul>
                  {content?.urbanisationSection?.deficitItems?.length > 0 ? (
                    content.urbanisationSection.deficitItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li><strong>2019 :</strong> Déficit national estimé à ~600 000 logements</li>
                      <li><strong>2023 :</strong> Déficit dépassant 800 000 logements</li>
                      <li><strong>Abidjan :</strong> Plus de 670 000 logements manquants</li>
                      <li><strong>Croissance annuelle du déficit :</strong> +50 000 unités/an</li>
                    </>
                  )}
                </ul>
                <p className="highlight-text">
                  {content?.urbanisationSection?.deficitHighlight || "Pour stabiliser le déficit, il faudrait construire 40 à 50 000 nouveaux logements par an, contre seulement ~15 000 actuellement."}
                </p>
              </div>

              <p>
                {content?.urbanisationSection?.paragraph2 || "Le marché immobilier abidjanais est ainsi en pleine croissance, porté par l'essor d'une classe moyenne urbaine et la multiplication de programmes résidentiels privés. D'après les analyses sectorielles, le marché immobilier en Côte d'Ivoire a progressé d'environ +18 % par an depuis 2011 en termes de volume d'affaires."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Port-Bouët */}
      <section className="section port-bouet-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.portBouetSection?.title || "La Commune de Port-Bouët : Atouts et Dynamique"}</h2>

            <div className="content-text">
              <p className="lead">
                {content?.portBouetSection?.leadParagraph || "Port-Bouët est l'une des 10 communes d'Abidjan, située à l'extrême sud de la ville, bordée par l'océan Atlantique au sud et la lagune Ébrié au nord. D'une superficie d'environ 73,7 km², elle occupe une position stratégique en abritant deux infrastructures cruciales : l'Aéroport International Félix Houphouët-Boigny et l'accès maritime via le canal de Vridi."}
              </p>

              <div className="demo-evolution">
                <h3>{content?.portBouetSection?.demoTitle || "Évolution démographique fulgurante"}</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <span className="year">{content?.portBouetSection?.demo1Year || "1998"}</span>
                    <span className="value">{content?.portBouetSection?.demo1Value || "212 000 hab."}</span>
                  </div>
                  <div className="timeline-item">
                    <span className="year">{content?.portBouetSection?.demo2Year || "2014"}</span>
                    <span className="value">{content?.portBouetSection?.demo2Value || "419 000 hab."}</span>
                  </div>
                  <div className="timeline-item highlighted">
                    <span className="year">{content?.portBouetSection?.demo3Year || "2021"}</span>
                    <span className="value">{content?.portBouetSection?.demo3Value || "619 000 hab."}</span>
                  </div>
                </div>
                <p className="growth-rate" dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.demoGrowthRate || "Croissance annuelle moyenne : <strong>+4,2 %</strong> (2014-2021)<br/>Soit <strong>~10 % de la population d'Abidjan</strong>" }}>
                </p>
              </div>

              <h3>{content?.portBouetSection?.atoutsTitle || "Atouts stratégiques majeurs"}</h3>

              <div className="atouts-grid">
                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout1Title || "✈️ Plateforme aéroportuaire"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout1Description || "L'aéroport international a atteint <strong>2,3 millions de passagers en 2019</strong>. Grands travaux d'extension en cours (330 milliards FCFA) pour porter la capacité à <strong>5 millions de passagers/an d'ici 2026</strong>." }}></p>
                </div>

                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout2Title || "🛣️ Échangeur Akwaba"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout2Description || "Inauguré en <strong>mars 2025</strong>, cette infrastructure de 31,2 milliards FCFA comprend deux ponts et 5 km de voiries, réduisant drastiquement le temps de trajet vers le centre-ville (<strong>15-20 minutes du Plateau</strong>)." }}></p>
                </div>

                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout3Title || "🚇 Futur Métro d'Abidjan"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout3Description || "Port-Bouët sera le <strong>terminus sud de la Ligne 1</strong> (37 km). Mise en service attendue en 2026, permettant de rallier le Plateau en 30 minutes." }}></p>
                </div>

                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout4Title || "🚢 Infrastructure portuaire"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout4Description || "Le <strong>Terminal à Conteneurs TC2</strong> (596 milliards FCFA) double la capacité portuaire. Port d'Abidjan : <strong>28,3 millions de tonnes en 2022</strong>, premier hub de la sous-région." }}></p>
                </div>

                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout5Title || "🏖️ Atouts naturels"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout5Description || "Littoral océanique avec plages, proximité lagune, réserves foncières importantes. <strong>Prix foncier moyen : 56 000 FCFA/m²</strong> (contre >1 million au Plateau)." }}></p>
                </div>

                <div className="atout-card">
                  <h4>{content?.portBouetSection?.atout6Title || "📈 Dynamique économique"}</h4>
                  <p dangerouslySetInnerHTML={{ __html: content?.portBouetSection?.atout6Description || "Zone industrielle de Vridi, raffinerie SIR, emplois aéroportuaires et portuaires. Mixité d'activités assurant un vivier d'emplois formels." }}></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quartier Abékan Bernard */}
      <section className="section abekan-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.abekanSection?.title || "Le Quartier Abékan Bernard : Un Potentiel Exceptionnel"}</h2>

            <div className="content-text">
              <p className="lead">
                {content?.abekanSection?.leadParagraph || "Abékan Bernard est un quartier en devenir de la commune de Port-Bouët, résultant d'un lotissement récent de la zone d'Abouabou. Situé au nord-est de Port-Bouët, dans la zone d'extension vers Grand-Bassam, ce lotissement approuvé en 2009 est emblématique des nouveaux quartiers planifiés pour absorber la croissance urbaine."}
              </p>

              <div className="caracteristiques-box">
                <h3>{content?.abekanSection?.caracTitle || "Caractéristiques du lotissement"}</h3>
                <ul className="check-list">
                  {content?.abekanSection?.caracItems?.length > 0 ? (
                    content.abekanSection.caracItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>✓ Parcelles avec <strong>titres fonciers sécurisés (ACD)</strong></li>
                      <li>✓ <strong>Terrain viabilisé</strong> : eau et électricité disponibles</li>
                      <li>✓ Voiries tracées et libérées des empiétements illégaux</li>
                      <li>✓ Potentiel de valorisation : <strong>x2 à x3 à moyen terme</strong></li>
                    </>
                  )}
                </ul>
              </div>

              <h3>{content?.abekanSection?.positionTitle || "Position stratégique exceptionnelle"}</h3>

              <div className="position-highlights">
                <div className="position-item">
                  <span className="icon">🎯</span>
                  <div className="position-content">
                    <h4>{content?.abekanSection?.position1Title || "Entre Abidjan et Grand-Bassam"}</h4>
                    <p>{content?.abekanSection?.position1Description || "Situé entre la capitale économique (emplois, services) et la station balnéaire UNESCO (~20 km), offrant qualité de vie et accessibilité."}</p>
                  </div>
                </div>

                <div className="position-item">
                  <span className="icon">🛣️</span>
                  <div className="position-content">
                    <h4>{content?.abekanSection?.position2Title || "Accès direct autoroute"}</h4>
                    <p dangerouslySetInnerHTML={{ __html: content?.abekanSection?.position2Description || "Connecté directement à l'axe autoroutier Abidjan-Bassam. Temps de trajet : <strong>20-30 min du Plateau</strong> hors congestion." }}></p>
                  </div>
                </div>

                <div className="position-item">
                  <span className="icon">🏖️</span>
                  <div className="position-content">
                    <h4>{content?.abekanSection?.position3Title || "Proximité mer et lagune"}</h4>
                    <p>{content?.abekanSection?.position3Description || "Quelques kilomètres du littoral. Avantage climatique (brises marines) et qualité de vie recherchée (plages accessibles)."}</p>
                  </div>
                </div>

                <div className="position-item">
                  <span className="icon">🏗️</span>
                  <div className="position-content">
                    <h4>{content?.abekanSection?.position4Title || "Zone en développement urbain"}</h4>
                    <p>{content?.abekanSection?.position4Description || "Nouveaux lotissements voisins, future \"Ville Nouvelle\" au sud. Pionnier dans une zone appelée à forte valorisation."}</p>
                  </div>
                </div>
              </div>

              <div className="demande-box">
                <h3>{content?.abekanSection?.demandeTitle || "Une demande locale immédiate et forte"}</h3>
                <p>
                  {content?.abekanSection?.demandeParagraph || "Le niveau de demande en logement à Abékan Bernard est potentiellement très élevé compte tenu de plusieurs facteurs convergents :"}
                </p>
                <ul>
                  {content?.abekanSection?.demandeItems?.length > 0 ? (
                    content.abekanSection.demandeItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li><strong>Déficit global :</strong> Chaque nouveau logement trouve aisément preneur dans la capitale économique</li>
                      <li><strong>Attrait de Port-Bouët :</strong> Manque de lotissements modernisés, demande locale non satisfaite</li>
                      <li><strong>Proximité emplois :</strong> Personnel aéroport, port, zone industrielle cherchant logements proches</li>
                      <li><strong>Valorisation attendue :</strong> Infrastructure métro + Ville Nouvelle = multiplication valeur foncière</li>
                      <li><strong>Diaspora intéressée :</strong> Ivoiriens de l'étranger cherchant placements sécurisés</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PESTEL */}
      <section className="section pestel-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.pestelSection?.title || "Analyse PESTEL du Projet"}</h2>

            <div className="pestel-grid">
              <div className="pestel-card">
                <h3>🏛️ Politique</h3>
                <ul>
                  {content?.pestelSection?.politiqueItems?.length > 0 ? (
                    content.pestelSection.politiqueItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li><strong>Stabilité</strong> retrouvée depuis 2011</li>
                      <li><strong>Engagement gouvernemental</strong> fort pour le logement</li>
                      <li>Programme 150 000 logements sociaux</li>
                      <li>Appui local (Mairie de Port-Bouët)</li>
                      <li>Climat des affaires amélioré</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pestel-card">
                <h3>💰 Économique</h3>
                <ul>
                  {content?.pestelSection?.economiqueItems?.length > 0 ? (
                    content.pestelSection.economiqueItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Croissance soutenue <strong>(+6 % an)</strong></li>
                      <li>Inflation maîtrisée <strong>(~2 %)</strong></li>
                      <li>Crédit disponible, banques actives</li>
                      <li>Marché immobilier <strong>+18 %/an</strong></li>
                      <li>Coûts construction stabilisés</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pestel-card">
                <h3>👥 Socioculturel</h3>
                <ul>
                  {content?.pestelSection?.socioculturelItems?.length > 0 ? (
                    content.pestelSection.socioculturelItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Population jeune en croissance</li>
                      <li>Culture forte de la <strong>propriété</strong></li>
                      <li>Nucléarisation des familles urbaines</li>
                      <li>Diaspora investisseuse active</li>
                      <li>Valorisation des cités planifiées</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pestel-card">
                <h3>💻 Technologique</h3>
                <ul>
                  {content?.pestelSection?.technologiqueItems?.length > 0 ? (
                    content.pestelSection.technologiqueItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Digitalisation permis de construire</li>
                      <li>BIM et outils modernes disponibles</li>
                      <li>Solutions domotiques émergentes</li>
                      <li>Énergies renouvelables (solaire)</li>
                      <li>Matériaux de construction innovants</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pestel-card">
                <h3>🌍 Environnemental</h3>
                <ul>
                  {content?.pestelSection?.environnementalItems?.length > 0 ? (
                    content.pestelSection.environnementalItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Gestion drainage et inondations</li>
                      <li>Études d'impact requises</li>
                      <li>Protection écosystèmes lagunaires</li>
                      <li>Adaptation climatique nécessaire</li>
                      <li>Opportunités finance verte</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pestel-card">
                <h3>⚖️ Légal</h3>
                <ul>
                  {content?.pestelSection?.legalItems?.length > 0 ? (
                    content.pestelSection.legalItems.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                    ))
                  ) : (
                    <>
                      <li>Foncier sécurisé <strong>(titres ACD)</strong></li>
                      <li>Code Construction 2019 structurant</li>
                      <li>Procédures administratives simplifiées</li>
                      <li>Cadre juridique favorable aux PPP</li>
                      <li>Normes urbanisme respectées</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marché */}
      <section className="section marche-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.marcheSection?.title || "Données du Marché Immobilier"}</h2>

            <div className="couts-construction">
              <h3>{content?.marcheSection?.coutsTitle || "Coûts de construction (FCFA/m²)"}</h3>
              <div className="couts-cards">
                <div className="cout-card">
                  <h4>{content?.marcheSection?.cout1Title || "Logement économique"}</h4>
                  <div className="cout-price">{content?.marcheSection?.cout1Value || "~200 000"}</div>
                  <p>{content?.marcheSection?.cout1Description || "Finitions basiques"}</p>
                </div>
                <div className="cout-card highlighted">
                  <h4>{content?.marcheSection?.cout2Title || "Logement moyen"}</h4>
                  <div className="cout-price">{content?.marcheSection?.cout2Value || "~250 000 - 300 000"}</div>
                  <p>{content?.marcheSection?.cout2Description || "Notre gamme de projet"}</p>
                </div>
                <div className="cout-card">
                  <h4>{content?.marcheSection?.cout3Title || "Haut de gamme"}</h4>
                  <div className="cout-price">{content?.marcheSection?.cout3Value || "> 400 000"}</div>
                  <p>{content?.marcheSection?.cout3Description || "Finitions premium"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="section conclusion-section">
        <div className="container">
          <div className="content-wrapper">
            <h2 className="section-title">{content?.conclusionSection?.title || "Conclusion"}</h2>

            <div className="conclusion-text">
              <p className="lead">
                {content?.conclusionSection?.leadParagraph || "L'analyse exhaustive du contexte économique, urbain et stratégique autour du projet de 136 logements à Abékan Bernard (Port-Bouët) met en évidence sa pertinence multidimensionnelle."}
              </p>

              <div className="conclusion-points">
                <div className="conclusion-point">
                  <span className="point-icon">📊</span>
                  <div className="point-content">
                    <h4>{content?.conclusionSection?.point1Title || "Sur le plan économique"}</h4>
                    <p>{content?.conclusionSection?.point1Description || "La Côte d'Ivoire offre un cadre stable et en croissance : PIB +6 %+, inflation maîtrisée (~2 %), marché immobilier en essor avec demande largement excédentaire."}</p>
                  </div>
                </div>

                <div className="conclusion-point">
                  <span className="point-icon">🎯</span>
                  <div className="point-content">
                    <h4>{content?.conclusionSection?.point2Title || "Sur le plan stratégique"}</h4>
                    <p>{content?.conclusionSection?.point2Description || "Port-Bouët et Abékan Bernard : zone d'expansion soutenue par infrastructures structurantes (échangeur Akwaba, futur métro, extension aéroport), combinant accessibilité et potentiel de valorisation."}</p>
                  </div>
                </div>

                <div className="conclusion-point">
                  <span className="point-icon">👥</span>
                  <div className="point-content">
                    <h4>{content?.conclusionSection?.point3Title || "Sur le plan social"}</h4>
                    <p>{content?.conclusionSection?.point3Description || "L'initiative répond au besoin criant de logement décent pour les classes moyennes, contribuant à réduire le déficit de 800 000+ logements tout en améliorant le cadre de vie."}</p>
                  </div>
                </div>

                <div className="conclusion-point">
                  <span className="point-icon">💼</span>
                  <div className="point-content">
                    <h4>{content?.conclusionSection?.point4Title || "Pour les investisseurs"}</h4>
                    <p>{content?.conclusionSection?.point4Description || "Demande assurée, valorisation foncière attendue, cadre juridique sécurisé, potentiel de rentabilité locative brute de 8-10 % annuel."}</p>
                  </div>
                </div>
              </div>

              <div className="final-statement">
                <p>
                  {content?.conclusionSection?.finalStatement1 || "En synthèse, ce projet de construction de logements s'imbrique parfaitement dans le dynamisme économique, urbain et social de la Côte d'Ivoire en 2025. Il capitalise sur les tendances positives (croissance, urbanisation, investissements publics) tout en apportant une solution concrète à un problème structurel majeur."}
                </p>
                <p className="highlight-conclusion">
                  {content?.conclusionSection?.finalStatement2 || "Tous les voyants sont au vert pour envisager une opération rentable, sûre et à fort impact socio-économique."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalyseEconomique;
