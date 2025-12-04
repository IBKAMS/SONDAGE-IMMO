import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaRoad,
  FaPlane,
  FaShoppingCart,
  FaHospital,
  FaBus,
  FaWater,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt
} from 'react-icons/fa';
import API_URL from '../config';
import './Localisation.css';

const Localisation = () => {
  const [content, setContent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_URL}/api/localisation-content`);
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

  const avantages = [
    {
      icon: <FaWater />,
      titre: "Vue sur la Lagune",
      description: "Site donnant sur la lagune Ébrié, offrant un cadre de vie exceptionnel"
    },
    {
      icon: <FaPlane />,
      titre: "Proximité Aéroport",
      description: "À quelques minutes de l'aéroport international Félix Houphouët-Boigny"
    },
    {
      icon: <FaRoad />,
      titre: "Accès Rapide",
      description: "Axes routiers majeurs et voies bitumées directes"
    },
    {
      icon: <FaShoppingCart />,
      titre: "Commerces",
      description: "Supermarchés, marchés et centres commerciaux à proximité"
    },
    {
      icon: <FaHospital />,
      titre: "Santé",
      description: "Hôpitaux et centres de santé facilement accessibles"
    },
    {
      icon: <FaBus />,
      titre: "Transport",
      description: "Réseau de transport public bien desservi"
    }
  ];

  return (
    <div className="localisation-page">
      {/* Hero Section */}
      <section className="localisation-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <FaMapMarkerAlt className="hero-icon" />
            <h1>{content?.hero?.title || "Localisation"}</h1>
            <p className="hero-subtitle">{content?.hero?.subtitle || "CITÉ KONGO - Abekan Bernard, Port-Bouët"}</p>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Informations Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section localisation-info"
        >
          <div className="info-card-main">
            <div className="info-icon-large">
              <FaMapMarkerAlt />
            </div>
            <h2>{content?.infoSection?.title || "Une localisation stratégique"}</h2>
            <p className="lead">
              {content?.infoSection?.leadText || "La CITÉ KONGO est idéalement située dans le quartier Abekan Bernard à Port-Bouët, l'une des communes les plus dynamiques d'Abidjan."}
            </p>
            <p>
              {content?.infoSection?.description || "Cette localisation privilégiée vous offre un accès facile à tous les services essentiels tout en bénéficiant du calme d'un quartier résidentiel en développement."}
            </p>
          </div>
        </motion.section>

        {/* Google Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section map-section"
        >
          <h2 className="section-title text-center">{content?.mapSection?.title || "Découvrez notre emplacement"}</h2>
          <p className="section-subtitle text-center">
            {content?.mapSection?.subtitle || "Abekan Bernard, Port-Bouët - Abidjan, Côte d'Ivoire"}
          </p>

          <div className="map-container map-container-clean">
            <div className="map-wrapper">
              {/* Afficher les images personnalisées ou l'iframe Google Maps */}
              {content?.mapSection?.useCustomImage && content?.mapSection?.mapImages && content?.mapSection?.mapImages.length > 0 ? (
                <div className="custom-map-carousel">
                  {/* Image principale */}
                  <div className="carousel-main-image">
                    <img
                      src={content.mapSection.mapImages[currentImageIndex]?.url}
                      alt={content.mapSection.mapImages[currentImageIndex]?.caption || `Vue de la localisation ${currentImageIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Légende si présente */}
                    {content.mapSection.mapImages[currentImageIndex]?.caption && (
                      <div className="carousel-caption">
                        {content.mapSection.mapImages[currentImageIndex].caption}
                      </div>
                    )}

                    {/* Flèches de navigation si plus d'une image */}
                    {content.mapSection.mapImages.length > 1 && (
                      <>
                        <button
                          className="carousel-nav carousel-prev"
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? content.mapSection.mapImages.length - 1 : prev - 1)}
                          aria-label="Image précédente"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          className="carousel-nav carousel-next"
                          onClick={() => setCurrentImageIndex(prev => prev === content.mapSection.mapImages.length - 1 ? 0 : prev + 1)}
                          aria-label="Image suivante"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniatures si plusieurs images */}
                  {content.mapSection.mapImages.length > 1 && (
                    <div className="carousel-thumbnails">
                      {content.mapSection.mapImages.map((image, index) => (
                        <button
                          key={index}
                          className={`carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Vue ${index + 1}`}
                        >
                          <img src={image.url} alt={`Miniature ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Lien Google Maps discret en bas */}
                  <div className="map-link-bottom">
                    <a
                      href={content?.mapSection?.mapDirectUrl || "https://www.google.com/maps/search/Abekan+Bernard+Port-Bouet+Abidjan"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link-btn"
                    >
                      <FaExternalLinkAlt /> Voir sur Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* Carte Google Maps avec marqueur sur Abekan Bernard */}
                  <iframe
                    src={content?.mapSection?.mapEmbedUrl || "https://maps.google.com/maps?q=5.2447,-3.9317+(CITÉ+KONGO+-+Abekan+Bernard)&hl=fr&z=16&output=embed"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation CITÉ KONGO - Abekan Bernard, Port-Bouët"
                  ></iframe>

                  {/* Indicateur visuel sur la carte (seulement pour iframe) */}
                  <div className="map-indicator">
                    <div className="indicator-badge">
                      <FaMapMarkerAlt className="indicator-icon" />
                      <span>{content?.mapSection?.indicatorText || "Site du Projet"}</span>
                    </div>
                    <p className="indicator-text">{content?.mapSection?.indicatorLocation || "Abekan Bernard"}</p>
                  </div>

                  {/* Lien pour ouvrir dans Google Maps */}
                  <div className="map-search-link">
                    <a
                      href={content?.mapSection?.mapSearchUrl || "https://www.google.com/maps/search/Abekan+Bernard,+Port-Bouet,+Abidjan/@5.2447,-3.9317,16z"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      📍 {content?.mapSection?.linkText || "Ouvrir dans Google Maps (Vue détaillée)"}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.section>

        {/* Avantages de la localisation */}
        <section className="section avantages-section">
          <h2 className="section-title text-center">
            {content?.avantagesSection?.title || "Les avantages de notre localisation"}
          </h2>
          <p className="section-subtitle text-center">
            {content?.avantagesSection?.subtitle || "Un emplacement qui facilite votre quotidien"}
          </p>

          <div className="avantages-grid">
            {content?.avantagesSection ? (
              <>
                {['avantage1', 'avantage2', 'avantage3', 'avantage4', 'avantage5', 'avantage6'].map((key, index) => {
                  const avantage = content.avantagesSection[key];
                  const defaultAvantage = avantages[index];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="avantage-card"
                    >
                      <div className="avantage-icon">{defaultAvantage.icon}</div>
                      <h3>{avantage?.titre || defaultAvantage.titre}</h3>
                      <p>{avantage?.description || defaultAvantage.description}</p>
                    </motion.div>
                  );
                })}
              </>
            ) : (
              avantages.map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="avantage-card"
                >
                  <div className="avantage-icon">{avantage.icon}</div>
                  <h3>{avantage.titre}</h3>
                  <p>{avantage.description}</p>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Accessibilité Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section accessibilite-section"
        >
          <div className="accessibilite-content">
            <h2 className="section-title">{content?.accessibiliteSection?.title || "Comment nous rejoindre ?"}</h2>

            <div className="acces-grid">
              <div className="acces-card">
                <div className="acces-icon">
                  <FaBus />
                </div>
                <h3>{content?.accessibiliteSection?.acces1?.titre || "En transport public"}</h3>
                <p>
                  {content?.accessibiliteSection?.acces1?.description || "Lignes de bus régulières desservant Port-Bouët depuis le Plateau et Treichville. Arrêt à proximité du quartier Abekan Bernard."}
                </p>
              </div>

              <div className="acces-card">
                <div className="acces-icon">
                  <FaRoad />
                </div>
                <h3>{content?.accessibiliteSection?.acces2?.titre || "En voiture"}</h3>
                <p>
                  {content?.accessibiliteSection?.acces2?.description || "Depuis le Plateau : Direction Port-Bouët via le Boulevard VGE (environ 20 min)."}
                </p>
              </div>

              <div className="acces-card">
                <div className="acces-icon">
                  <FaPlane />
                </div>
                <h3>{content?.accessibiliteSection?.acces3?.titre || "Depuis l'aéroport"}</h3>
                <p>
                  {content?.accessibiliteSection?.acces3?.description || "À seulement 10 minutes en voiture de l'aéroport international Félix Houphouët-Boigny. Accès direct et rapide."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section cta-localisation"
        >
          <div className="cta-box">
            <h2>{content?.cta?.title || "Intéressé par ce projet ?"}</h2>
            <p>
              {content?.cta?.description || "Découvrez nos différentes options d'achat et les modalités de financement disponibles pour concrétiser votre investissement dans la CITÉ KONGO."}
            </p>
            <a href="/option-achat" className="btn btn-primary btn-large">
              {content?.cta?.buttonText || "Découvrir les options d'achat"}
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Localisation;
