import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import API_URL from '../config';
import './Visite3D.css';

const Visite3D = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos/visite3d`);
        if (response.ok) {
          const data = await response.json();
          // Vérifier que data et data.url existent
          if (data && data.url) {
            // URL Cloudinary complète, pas besoin d'ajouter API_URL
            setVideoUrl(data.url);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/visite3d-content`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setContent(data.data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="visite3d-page">
      {/* Hero Section */}
      <section className="visite3d-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content?.hero?.title || "Visite Virtuelle 3D"}</h1>
            <p className="hero-subtitle">{content?.hero?.subtitle || "Découvrez la Cité KONGO comme si vous y étiez"}</p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="info-banner"
        >
          <FaInfoCircle className="info-icon" />
          <div className="info-text">
            <h3>{content?.infoBanner?.title || "Explorez votre futur logement en 3D"}</h3>
            <p>{content?.infoBanner?.description || "Visualisez chaque détail du projet immobilier CITÉ KONGO en haute définition"}</p>
          </div>
        </motion.div>

        {/* Video Player Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="video-section"
        >
          <div className="video-container">
            <div className="video-wrapper">
              {loading ? (
                <div className="video-loading">Chargement de la vidéo...</div>
              ) : videoUrl ? (
                <video
                  ref={videoRef}
                  className="video-player"
                  controls
                  preload="metadata"
                  poster="/assets/images/video-poster.jpg"
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
                  className="video-overlay"
                  onClick={() => videoRef.current?.play()}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="play-button">
                    <FaPlay />
                  </div>
                  <p className="overlay-text">Cliquez pour lancer la visite 3D</p>
                </div>
              )}
            </div>

            <div className="video-info">
              <h2>Visite 3D Complète de la Cité KONGO</h2>
              <p>
                Plongez dans l'univers de la Cité KONGO grâce à cette visite virtuelle immersive.
                Découvrez les espaces communs, les finitions de qualité et l'agencement des différents
                types de villas disponibles.
              </p>

              <div className="video-features">
                <div className="feature">
                  <div className="feature-icon">🏡</div>
                  <h4>Villas Duplex & Triplex</h4>
                  <p>Découvrez nos 3 modèles de villas</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🎨</div>
                  <h4>Finitions Premium</h4>
                  <p>Matériaux de qualité supérieure</p>
                </div>
                <div className="feature">
                  <div className="feature-icon">🌳</div>
                  <h4>Espaces Verts</h4>
                  <p>Jardins et terrasses aménagés</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Cards */}
        <div className="info-cards">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="info-card"
          >
            <div className="card-icon">📐</div>
            <h3>Plans Détaillés</h3>
            <p>Consultez les plans architecturaux de chaque type de villa</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="info-card"
          >
            <div className="card-icon">🎥</div>
            <h3>Visite Interactive</h3>
            <p>Naviguez librement dans les espaces en 360°</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="info-card"
          >
            <div className="card-icon">💎</div>
            <h3>Qualité HD</h3>
            <p>Vidéo haute définition pour une expérience immersive</p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-box"
        >
          <h2>Vous souhaitez visiter en personne ?</h2>
          <p>Prenez rendez-vous avec notre équipe pour une visite guidée sur site</p>
          <button className="btn btn-primary btn-large">
            Prendre rendez-vous
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Visite3D;
