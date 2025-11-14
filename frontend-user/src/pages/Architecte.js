import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaUsers, FaAward, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaPlay } from 'react-icons/fa';
import API_URL from '../config';
import './Architecte.css';

const Architecte = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const videoRef = React.useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Charger le contenu et la vidéo depuis le backend
    const fetchData = async () => {
      try {
        // Charger le contenu
        const contentResponse = await fetch(`${API_URL}/api/architecte-content`);
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContent(contentData.data);
        }

        // Charger la vidéo
        const videoResponse = await fetch(`${API_URL}/api/videos/architecte`);
        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          if (videoData && videoData.url) {
            setVideoUrl(`${API_URL}${videoData.url}`);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Préparer les données de l'équipe avec tri par order
  const equipe = content?.equipeSection?.membres
    ? [...content.equipeSection.membres].sort((a, b) => a.order - b.order)
    : [
        "Architectes",
        "Architectes d'intérieur",
        "Urbanistes",
        "Ingénieurs",
        "Économistes en bâtiments",
        "Techniciens",
        "Juristes",
        "Communicants",
        "Artisans"
      ].map((metier) => ({ metier }));

  // Préparer les données des valeurs avec tri par order
  const valeurs = content?.valeursSection?.valeurs
    ? [...content.valeursSection.valeurs].sort((a, b) => a.order - b.order)
    : [
        {
          titre: "Expertise Technique",
          description: "Une équipe pluridisciplinaire maîtrisant tous les aspects du bâtiment"
        },
        {
          titre: "Jeunesse & Dynamisme",
          description: "Une équipe jeune et dynamique qui capitalise son expertise"
        },
        {
          titre: "Précision",
          description: "Le devoir d'atteindre la précision dans chacune de nos réalisations"
        }
      ];

  // Mapping des icônes pour les valeurs
  const iconMap = {
    "Expertise Technique": <FaBuilding />,
    "Jeunesse & Dynamisme": <FaUsers />,
    "Précision": <FaAward />
  };

  // Afficher un message de chargement pendant le chargement initial
  if (loading) {
    return (
      <div className="architecte-page">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="architecte-page">
      {/* Hero Section */}
      <section className="architecte-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>{content?.hero?.title || "ARCHITECTES 21"}</h1>
            <p className="hero-subtitle">{content?.hero?.subtitle || "Excellence architecturale depuis 2015"}</p>
          </motion.div>
        </div>
      </section>

      {/* Présentation */}
      <section className="section presentation-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="presentation-content"
          >
            <h2 className="section-title">{content?.presentation?.title || "Notre Agence"}</h2>
            <div className="presentation-text">
              <p className="lead">
                {content?.presentation?.paragraph1 || "Notre agence a été fondée en 2015 par Ahissan Louis-Habib TANOH, architecte DESA."}
              </p>
              <p>
                {content?.presentation?.paragraph2 || "Il dirige une équipe pluridisciplinaire qui se compose d'architectes, d'architectes d'intérieur, d'urbanistes, d'ingénieurs, d'économistes en bâtiments, de techniciens, de juristes, de communicants et d'artisans."}
              </p>
              <p className="highlight-text">
                {content?.presentation?.paragraph3 || "Cet aspect pluridisciplinaire permet de gérer tout type de projet."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Architecte Section */}
      <section className="section video-architecte-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="video-architecte-content"
          >
            <h2 className="section-title text-center">{content?.videoSection?.title || "Découvrez ARCHITECTES 21 en vidéo"}</h2>
            <p className="section-subtitle text-center">
              {content?.videoSection?.subtitle || "Notre vision, nos réalisations et notre approche architecturale"}
            </p>

            <div className="video-architecte-container">
              <div className="video-architecte-wrapper">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    className="video-architecte-player"
                    controls
                    preload="metadata"
                    poster="/assets/images/architecte-poster.jpg"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                ) : (
                  <div className="video-error">Aucune vidéo disponible</div>
                )}

                {videoUrl && !isPlaying && (
                  <div
                    className="video-architecte-overlay"
                    onClick={() => videoRef.current?.play()}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="play-button-architecte">
                      <FaPlay />
                    </div>
                    <p className="overlay-text-architecte">{content?.videoSection?.overlayText || "Découvrir notre univers"}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Équipe */}
      <section className="section equipe-section">
        <div className="container">
          <h2 className="section-title text-center">{content?.equipeSection?.title || "Notre Équipe Pluridisciplinaire"}</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="equipe-grid"
          >
            {equipe.map((membre, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="equipe-item"
              >
                <div className="equipe-icon">
                  <FaUsers />
                </div>
                <span>{membre.metier}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section valeurs-section">
        <div className="container">
          <h2 className="section-title text-center">{content?.valeursSection?.title || "Nos Engagements"}</h2>
          <div className="valeurs-grid">
            {valeurs.map((valeur, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="valeur-card"
              >
                <div className="valeur-icon">{iconMap[valeur.titre] || <FaAward />}</div>
                <h3>{valeur.titre}</h3>
                <p>{valeur.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="engagement-text"
          >
            <p>
              {content?.engagement?.paragraph1 || "Tout en restant fidèle à la commande initiale, l'agence se doit d'assurer le suivi architectural et administratif en vue d'une prestation conforme aux intérêts du client."}
            </p>
            <p className="highlight-text">
              {content?.engagement?.paragraph2 || "Nous valorisons et capitalisons notre expertise à travers une équipe jeune et dynamique. Nous insufflons en chaque collaborateur, le devoir d'atteindre la précision dans chacune de nos réalisations, par l'emploi d'un processus participatif."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecte en Chef */}
      <section className="section architecte-chef-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="architecte-chef-card"
          >
            <h2>{content?.architecteChef?.title || "Architecte en Chef"}</h2>
            <h3>{content?.architecteChef?.nom || "Ahissan Louis-Habib TANOH"}</h3>
            <p className="titre">{content?.architecteChef?.titre || "Architecte DESA"}</p>
            <p className="description">
              {content?.architecteChef?.description || "Fondateur d'ARCHITECTES 21 en 2015, Louis-Habib TANOH dirige avec excellence une équipe pluridisciplinaire dédiée à la réalisation de projets d'envergure à travers la Côte d'Ivoire."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact-architecte-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-architecte-card"
          >
            <h2>{content?.contact?.title || "Contactez ARCHITECTES 21"}</h2>
            <p>{content?.contact?.subtitle || "Pour vos projets architecturaux et d'urbanisme"}</p>

            <div className="contact-info-grid">
              <div className="contact-info-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div className="contact-text">
                  <strong>Adresse</strong>
                  <span>{content?.contact?.adresse1 || "46 Rue du Commerce, Immeuble L'Ebrien, Etage 5B"}</span>
                  <span>{content?.contact?.adresse2 || "Plateau, Abidjan"}</span>
                  <span>{content?.contact?.adresse3 || "10 BP 2877"}</span>
                </div>
              </div>

              <div className="contact-info-item">
                <FaPhone className="contact-icon" />
                <div className="contact-text">
                  <strong>Téléphone</strong>
                  <span>{content?.contact?.telephone1 || "+225 27 20 23 09 55"}</span>
                  <span>{content?.contact?.telephone2 || "+225 07 78 46 52 88"}</span>
                </div>
              </div>

              <div className="contact-info-item">
                <FaEnvelope className="contact-icon" />
                <div className="contact-text">
                  <strong>Email</strong>
                  <span>{content?.contact?.email || "info@architectes21s.com"}</span>
                </div>
              </div>

              <div className="contact-info-item">
                <FaGlobe className="contact-icon" />
                <div className="contact-text">
                  <strong>Site Web</strong>
                  <a href={content?.contact?.siteWeb || "http://www.architectes21s.com"} target="_blank" rel="noopener noreferrer">
                    {content?.contact?.siteWeb?.replace(/^https?:\/\/(www\.)?/, '') || "www.architectes21s.com"}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Architecte;
