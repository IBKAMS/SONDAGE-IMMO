import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaHome, FaUsers, FaAward, FaCheckCircle, FaPlay, FaChevronLeft, FaChevronRight, FaImage, FaVideo } from 'react-icons/fa';
import API_URL from '../config';
import './Promoteur.css';

const Promoteur = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState({});
  const [promoteurImages, setPromoteurImages] = useState({});
  const videoRef = React.useRef(null);
  const [stats, setStats] = useState({
    projets: 0,
    logements: 0,
    clients: 0,
    experience: 0
  });

  // Icons mapping for valeurs
  const iconMap = {
    0: <FaBuilding />,
    1: <FaUsers />,
    2: <FaHome />,
    3: <FaAward />
  };

  // Mapping des noms de projets vers les types d'images promoteur
  const getPromoteurImageType = (projetNom) => {
    const nomLower = projetNom?.toLowerCase() || '';
    if (nomLower.includes('3k') || nomLower.includes('résidence 3k')) {
      return 'residence-3k';
    }
    if (nomLower.includes('ciel') || nomLower.includes('jardin') || nomLower.includes('ciel & jardin') || nomLower.includes('ciel et jardin')) {
      return 'residence-ciel-jardin';
    }
    if (nomLower.includes('miensah') || nomLower.includes('lumière') || nomLower.includes('lumiere') || nomLower.includes('cité lumière')) {
      return 'miensah-cite-lumiere';
    }
    return null;
  };

  // Fonction pour obtenir l'URL de l'image promoteur uploadée
  const getPromoteurImageUrl = (projetNom) => {
    const imageType = getPromoteurImageType(projetNom);
    if (imageType && promoteurImages[imageType]) {
      return promoteurImages[imageType].url;
    }
    return null;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Charger le contenu depuis le backend
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/promoteur-content`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setContent(data.data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();

    // Charger la vidéo depuis le backend
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos/promoteur`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.url) {
            // URL Cloudinary complète, pas besoin d'ajouter API_URL
            setVideoUrl(data.url);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error);
      } finally {
        setLoadingVideo(false);
      }
    };
    fetchVideo();

    // Charger les images des projets promoteur depuis le backend
    const fetchPromoteurImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/promoteur-images`);
        if (response.ok) {
          const data = await response.json();
          setPromoteurImages(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images promoteur:', error);
      }
    };
    fetchPromoteurImages();
  }, []);

  // Animation des statistiques - déclenché quand le contenu est chargé
  useEffect(() => {
    if (!content || !content.stats || content.stats.length === 0) return;

    // Créer un objet targetStats à partir des stats du contenu
    const targetStats = {};
    content.stats.forEach(stat => {
      const key = stat.label.toLowerCase().replace(/\s+/g, '_');
      targetStats[key] = stat.value;
    });

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      const newStats = {};
      Object.keys(targetStats).forEach(key => {
        newStats[key] = Math.floor(targetStats[key] * progress);
      });

      setStats(newStats);

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [content]);

  if (loading) {
    return (
      <div className="promoteur-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="promoteur-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p>Contenu non disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promoteur-page">
      {/* Hero Section */}
      <section className="promoteur-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content.hero?.title || 'KONGO IMMOBILIER'}</h1>
            <p className="hero-subtitle">{content.hero?.subtitle || 'Le partenaire de confiance pour votre projet de vie'}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section mission-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mission-content"
          >
            <h2 className="section-title">{content.mission?.title || 'Notre Mission'}</h2>
            <div className="mission-text">
              <p className="lead">
                {content.mission?.leadParagraph || "Dans le paysage dynamique d'Abidjan, KONGO IMMOBILIER se distingue par sa vision et la qualité de ses réalisations."}
              </p>
              <p className="mission-highlight">
                {content.mission?.highlightParagraph || "Notre mission est simple : bâtir plus que des murs, créer des cadres de vie où chaque Ivoirien peut s'épanouir."}
              </p>
              <p>
                {content.mission?.descriptionParagraph || "Nous ne nous contentons pas de construire des bâtiments, nous bâtissons votre avenir. Chaque projet est conçu avec soin pour offrir un environnement de vie harmonieux, moderne et accessible."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Promoteur Section */}
      <section className="section video-promoteur-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="video-promoteur-content"
          >
            <h2 className="section-title text-center">{content.videoSection?.title || 'Découvrez KONGO IMMOBILIER en vidéo'}</h2>
            <p className="section-subtitle text-center">
              {content.videoSection?.subtitle || 'Notre vision, nos projets et notre engagement envers vous'}
            </p>

            <div className="video-promoteur-container">
              <div className="video-promoteur-wrapper">
                {loadingVideo ? (
                  <div className="video-loading">Chargement de la vidéo...</div>
                ) : videoUrl ? (
                  <video
                    ref={videoRef}
                    className="video-promoteur-player"
                    controls
                    preload="metadata"
                    poster="/assets/images/promoteur-poster.jpg"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                ) : (
                  <div className="video-error">Aucune vidéo disponible</div>
                )}

                {!loadingVideo && videoUrl && !isPlaying && (
                  <div
                    className="video-promoteur-overlay"
                    onClick={() => videoRef.current?.play()}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="play-button-promoteur">
                      <FaPlay />
                    </div>
                    <p className="overlay-text-promoteur">{content.videoSection?.overlayText || 'Découvrir notre histoire'}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {content.stats && content.stats.sort((a, b) => a.order - b.order).map((stat, index) => {
              const statKey = stat.label.toLowerCase().replace(/\s+/g, '_');
              const statValue = stats[statKey] || 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="stat-card"
                >
                  <div className="stat-number">{statValue}+</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="section valeurs-section">
        <div className="container">
          <h2 className="section-title text-center">Nos Valeurs</h2>
          <div className="valeurs-grid">
            {content.valeurs && content.valeurs.sort((a, b) => a.order - b.order).map((valeur, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="valeur-card"
              >
                <div className="valeur-icon">{iconMap[index] || <FaBuilding />}</div>
                <h3>{valeur.titre}</h3>
                <p>{valeur.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projets Réalisés */}
      <section className="section projets-section">
        <div className="container">
          <h2 className="section-title text-center">{content.projetsSection?.title || 'Nos Projets Emblématiques'}</h2>
          <p className="section-subtitle text-center">
            {content.projetsSection?.subtitle || "Notre expertise s'illustre à travers plusieurs réalisations qui ont transformé le quotidien de nombreux habitants"}
          </p>

          <div className="projets-list">
            {content.projetsSection?.projets && content.projetsSection.projets.sort((a, b) => a.order - b.order).map((projet, index) => {
              const hasMedias = projet.medias && projet.medias.length > 0;
              const currentIndex = currentMediaIndex[index] || 0;
              const currentMedia = hasMedias ? projet.medias[currentIndex] : null;

              const goToPreviousMedia = (e) => {
                e.stopPropagation();
                setCurrentMediaIndex(prev => ({
                  ...prev,
                  [index]: currentIndex > 0 ? currentIndex - 1 : projet.medias.length - 1
                }));
              };

              const goToNextMedia = (e) => {
                e.stopPropagation();
                setCurrentMediaIndex(prev => ({
                  ...prev,
                  [index]: currentIndex < projet.medias.length - 1 ? currentIndex + 1 : 0
                }));
              };

              const isYoutubeUrl = (url) => {
                return url && (url.includes('youtube.com') || url.includes('youtu.be'));
              };

              const getYoutubeEmbedUrl = (url) => {
                if (!url) return null;
                let videoId = null;
                if (url.includes('youtu.be/')) {
                  videoId = url.split('youtu.be/')[1]?.split('?')[0];
                } else if (url.includes('youtube.com/watch?v=')) {
                  videoId = url.split('v=')[1]?.split('&')[0];
                }
                return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
              };

              // Vérifier si une image promoteur uploadée existe pour ce projet
              const promoteurImageUrl = getPromoteurImageUrl(projet.nom);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`projet-card ${index % 2 === 0 ? 'reverse' : ''}`}
                >
                  <div className="projet-media">
                    {/* Priorité 1: Image promoteur uploadée via l'admin */}
                    {promoteurImageUrl ? (
                      <img
                        src={promoteurImageUrl}
                        alt={projet.nom}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/600x400/1a5490/ffffff?text=${encodeURIComponent(projet.nom)}`;
                        }}
                      />
                    ) : hasMedias ? (
                      /* Priorité 2: Medias du contenu */
                      <div className="media-carousel">
                        {currentMedia.type === 'video' ? (
                          isYoutubeUrl(currentMedia.url) ? (
                            <div className="video-container youtube-container">
                              <iframe
                                src={getYoutubeEmbedUrl(currentMedia.url)}
                                title={`${projet.nom} - Vidéo ${currentIndex + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div className="video-container">
                              <video
                                src={currentMedia.url}
                                controls
                                poster={currentMedia.thumbnail}
                              />
                            </div>
                          )
                        ) : (
                          <img
                            src={currentMedia.url}
                            alt={`${projet.nom} - Image ${currentIndex + 1}`}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/600x400/1a5490/ffffff?text=${encodeURIComponent(projet.nom)}`;
                            }}
                          />
                        )}

                        {/* Navigation arrows */}
                        {projet.medias.length > 1 && (
                          <>
                            <button className="carousel-nav prev" onClick={goToPreviousMedia}>
                              <FaChevronLeft />
                            </button>
                            <button className="carousel-nav next" onClick={goToNextMedia}>
                              <FaChevronRight />
                            </button>
                          </>
                        )}

                        {/* Media type indicator */}
                        <div className="media-type-indicator">
                          {currentMedia.type === 'video' ? <FaVideo /> : <FaImage />}
                        </div>

                        {/* Dots indicator */}
                        {projet.medias.length > 1 && (
                          <div className="carousel-dots">
                            {projet.medias.map((_, dotIndex) => (
                              <button
                                key={dotIndex}
                                className={`dot ${dotIndex === currentIndex ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentMediaIndex(prev => ({ ...prev, [index]: dotIndex }));
                                }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Media counter */}
                        {projet.medias.length > 1 && (
                          <div className="media-counter">
                            {currentIndex + 1} / {projet.medias.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Priorité 3: Placeholder */
                      <img
                        src={`https://via.placeholder.com/600x400/1a5490/ffffff?text=${encodeURIComponent(projet.nom)}`}
                        alt={projet.nom}
                      />
                    )}
                  </div>

                  <div className="projet-content">
                    <h3>{projet.nom}</h3>
                    <div className="projet-location">
                      <span className="location-badge">{projet.localisation}</span>
                    </div>
                    {projet.partenariat && (
                      <p className="partenariat">{projet.partenariat}</p>
                    )}
                    <p className="projet-description">{projet.description}</p>

                    <div className="caracteristiques">
                      <h4>Caractéristiques :</h4>
                      <ul>
                        {projet.caracteristiques && projet.caracteristiques.map((carac, idx) => (
                          <li key={idx}>
                            <FaCheckCircle className="check-icon" />
                            {carac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nouveau Projet */}
      <section className="section nouveau-projet-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="nouveau-projet-content"
          >
            <h2 className="section-title text-center">{content.nouveauProjet?.sectionTitle || 'Notre Nouveau Projet'}</h2>
            <div className="nouveau-projet-card">
              <h3>{content.nouveauProjet?.nom || 'La Cité KONGO'}</h3>
              <p className="location">
                {content.nouveauProjet?.localisation || 'Port-Bouët, quartier ABEKAN-BERNARD'}
              </p>
              <p className="description">
                {content.nouveauProjet?.description || "Forts de nos succès, nous sommes aujourd'hui fiers de vous annoncer le lancement de la Cité KONGO. Idéalement située dans la commune de Port-Bouët, au cœur du quartier ABEKAN-BERNARD, la Cité KONGO incarne notre vision de l'habitat de demain : accessible, moderne et parfaitement intégré à son environnement."}
              </p>
              <div className="cta-buttons">
                <a href="/presentation" className="btn btn-primary">
                  Découvrir le Projet
                </a>
                <a href="/logements" className="btn btn-secondary">
                  Voir les Logements
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact-promoteur-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-promoteur-card"
          >
            <h2>{content.contact?.title || 'Contactez KONGO IMMOBILIER'}</h2>
            <p>{content.contact?.description || 'Nous sommes à votre écoute pour réaliser votre projet immobilier'}</p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Téléphone :</strong>
                <span>{content.contact?.telephone || '+225 XX XX XX XX XX'}</span>
              </div>
              <div className="contact-item">
                <strong>Email :</strong>
                <span>{content.contact?.email || 'contact@kongoimmobilier.ci'}</span>
              </div>
              <div className="contact-item">
                <strong>Adresse :</strong>
                <span>{content.contact?.adresse || "Abidjan, Côte d'Ivoire"}</span>
              </div>
            </div>
            <a href="/option-achat" className="btn btn-primary btn-large">
              Commencer Mon Projet
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Promoteur;
