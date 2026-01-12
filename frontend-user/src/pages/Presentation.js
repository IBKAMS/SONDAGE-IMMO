import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import API_URL from '../config';
import './Presentation.css';

const Presentation = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchPresentationContent();
    fetchPresentationVideo();
  }, []);

  const fetchPresentationContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/presentation-content`);
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresentationVideo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/videos/presentation`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.url) {
          let url = data.url;
          if (url.includes('cloudinary.com') && url.includes('/upload/')) {
            url = url.replace('/upload/', '/upload/vc_h264/');
          }
          setVideoUrl(url);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la vidéo:', error);
    } finally {
      setVideoLoading(false);
    }
  };

  if (loading) {
    return <div className="presentation-page"><div className="loading">Chargement...</div></div>;
  }

  if (!content) {
    return <div className="presentation-page"><div className="error">Erreur de chargement du contenu</div></div>;
  }

  return (
    <div className="presentation-page">
      <section className="presentation-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content.hero.title}</h1>
            <p className="hero-subtitle">{content.hero.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="content-section"
          >
            <h2 className="section-title">{content.project.title}</h2>
            <p className="lead">
              {content.project.leadParagraph}
            </p>
            <p>
              {content.project.description}
            </p>
          </motion.div>

          {/* Section Vidéo de Présentation */}
          {!videoLoading && videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="video-presentation-section"
            >
              <div className="video-container">
                <div className="video-wrapper">
                  <video
                    ref={videoRef}
                    className="video-player"
                    controls
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>

                  {!isPlaying && (
                    <div
                      className="video-overlay"
                      onClick={() => videoRef.current?.play()}
                    >
                      <div className="play-button">
                        <FaPlay />
                      </div>
                      <p className="overlay-text">Regarder la vidéo de présentation</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Presentation;
