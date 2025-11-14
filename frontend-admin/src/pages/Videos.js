import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaVideo, FaPlay, FaTimes, FaDraftingCompass, FaImage, FaHome } from 'react-icons/fa';
import API_URL from '../config';
import './Videos.css';

const Videos = () => {
  const [videos, setVideos] = useState({
    visite3d: { file: null, name: '', url: '' },
    promoteur: { file: null, name: '', url: '' },
    analyseEconomique: { file: null, name: '', url: '' },
    architecte: { file: null, name: '', url: '' }
  });
  const [images, setImages] = useState({
    'villa-duplex-4p': { file: null, name: '', url: '' },
    'villa-duplex-5p': { file: null, name: '', url: '' },
    'villa-triplex-6p': { file: null, name: '', url: '' }
  });
  const [loading, setLoading] = useState(false);

  const fileInputRefs = {
    visite3d: useRef(null),
    promoteur: useRef(null),
    analyseEconomique: useRef(null),
    architecte: useRef(null)
  };

  const imageInputRefs = {
    'villa-duplex-4p': useRef(null),
    'villa-duplex-5p': useRef(null),
    'villa-triplex-6p': useRef(null)
  };

  // Charger les vidéos existantes au montage du composant
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos`);
        if (response.ok) {
          const data = await response.json();
          const updatedVideos = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].originalName && data[type].url) {
              updatedVideos[type] = {
                file: null,
                name: data[type].originalName,
                url: `${API_URL}${data[type].url}`
              };
            }
          });
          if (Object.keys(updatedVideos).length > 0) {
            setVideos(prev => ({ ...prev, ...updatedVideos }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos:', error);
      }
    };
    fetchVideos();
  }, []);

  // Charger les images existantes au montage du composant
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/images`);
        if (response.ok) {
          const data = await response.json();
          const updatedImages = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].originalName && data[type].url) {
              updatedImages[type] = {
                file: null,
                name: data[type].originalName,
                url: `${API_URL}${data[type].url}`
              };
            }
          });
          if (Object.keys(updatedImages).length > 0) {
            setImages(prev => ({ ...prev, ...updatedImages }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      }
    };
    fetchImages();
  }, []);

  const handleFileSelect = (type) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setVideos(prev => ({
        ...prev,
        [type]: { file, name: file.name, url: videoUrl }
      }));
    } else {
      alert('Veuillez sélectionner un fichier vidéo valide');
    }
  };

  const triggerFileInput = (type) => {
    fileInputRefs[type].current.click();
  };

  const removeVideo = (type) => {
    if (videos[type].url) {
      URL.revokeObjectURL(videos[type].url);
    }
    setVideos(prev => ({
      ...prev,
      [type]: { file: null, name: '', url: '' }
    }));
  };

  const handleImageSelect = (type) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => ({
        ...prev,
        [type]: { file, name: file.name, url: imageUrl }
      }));
    } else {
      alert('Veuillez sélectionner un fichier image valide');
    }
  };

  const triggerImageInput = (type) => {
    imageInputRefs[type].current.click();
  };

  const removeImage = async (type) => {
    // Vérifier si l'image provient du serveur (uploadée)
    const isUploadedImage = images[type].url && images[type].url.startsWith(API_URL);

    if (isUploadedImage) {
      // Confirmer la suppression
      if (!window.confirm(`Voulez-vous vraiment supprimer cette image ? Elle ne sera plus visible dans la rubrique Logements du site utilisateur.`)) {
        return;
      }

      try {
        // Supprimer du serveur
        const response = await fetch(`${API_URL}/api/images/${type}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log(`Image ${type} supprimée du serveur`);
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'image ${type}:`, error);
        alert('Erreur lors de la suppression de l\'image');
        return;
      }
    } else if (images[type].url) {
      // Si c'est une URL locale (blob), la révoquer
      URL.revokeObjectURL(images[type].url);
    }

    // Mettre à jour le state
    setImages(prev => ({
      ...prev,
      [type]: { file: null, name: '', url: '' }
    }));
  };

  const saveVideos = async () => {
    setLoading(true);
    const uploadPromises = [];

    // Upload des vidéos
    for (const [type, video] of Object.entries(videos)) {
      if (video.file) {
        const formData = new FormData();
        formData.append('video', video.file);
        formData.append('type', type);

        const uploadPromise = fetch(`${API_URL}/api/videos/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log(`Vidéo ${type} uploadée:`, data);
            if (data && data.video && data.video.originalName && data.video.url) {
              setVideos(prev => ({
                ...prev,
                [type]: {
                  file: null,
                  name: data.video.originalName,
                  url: `${API_URL}${data.video.url}`
                }
              }));
            }
          })
          .catch(error => {
            console.error(`Erreur upload ${type}:`, error);
            throw error;
          });

        uploadPromises.push(uploadPromise);
      }
    }

    // Upload des images
    for (const [type, image] of Object.entries(images)) {
      if (image.file) {
        const formData = new FormData();
        formData.append('image', image.file);
        formData.append('type', type);

        const uploadPromise = fetch(`${API_URL}/api/images/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log(`Image ${type} uploadée:`, data);
            if (data && data.image && data.image.originalName && data.image.url) {
              setImages(prev => ({
                ...prev,
                [type]: {
                  file: null,
                  name: data.image.originalName,
                  url: `${API_URL}${data.image.url}`
                }
              }));
            }
          })
          .catch(error => {
            console.error(`Erreur upload ${type}:`, error);
            throw error;
          });

        uploadPromises.push(uploadPromise);
      }
    }

    try {
      await Promise.all(uploadPromises);
      alert('Vidéos et images enregistrées avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des vidéos et images');
    } finally {
      setLoading(false);
    }
  };

  const videoCards = [
    {
      type: 'visite3d',
      title: 'Vidéo 3D du Projet',
      description: 'Chargez la visite virtuelle 3D de la Cité KONGO',
      icon: <FaVideo />,
      color: '#4F46E5'
    },
    {
      type: 'promoteur',
      title: 'Vidéo Promoteur',
      description: 'Chargez la vidéo de présentation du promoteur',
      icon: <FaPlay />,
      color: '#7C3AED'
    },
    {
      type: 'analyseEconomique',
      title: 'Vidéo Analyse Économique',
      description: 'Chargez la vidéo d\'analyse économique du projet',
      icon: <FaVideo />,
      color: '#C850C0'
    },
    {
      type: 'architecte',
      title: 'Vidéo Architecte',
      description: 'Chargez la vidéo de présentation de l\'architecte',
      icon: <FaDraftingCompass />,
      color: '#27AE60'
    }
  ];

  const imageCards = [
    {
      type: 'villa-duplex-4p',
      title: 'Villa Duplex 4 Pièces',
      description: 'Image affichée dans la rubrique Logements pour ce type',
      icon: <FaHome />,
      color: '#2563eb'
    },
    {
      type: 'villa-duplex-5p',
      title: 'Villa Duplex 5 Pièces',
      description: 'Image affichée dans la rubrique Logements pour ce type',
      icon: <FaHome />,
      color: '#7C3AED'
    },
    {
      type: 'villa-triplex-6p',
      title: 'Villa Triplex 6 Pièces',
      description: 'Image affichée dans la rubrique Logements pour ce type',
      icon: <FaHome />,
      color: '#059669'
    }
  ];

  return (
    <div className="videos-page">
      <div className="videos-header">
        <h1>Gestion des Vidéos et Images</h1>
        <p>Gérez les vidéos et images affichées sur le site utilisateur</p>
      </div>

      <div className="videos-container">
        {videoCards.map((card, index) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="video-card"
            style={{ '--card-color': card.color }}
          >
            <div className="video-card-header">
              <div className="video-card-icon">{card.icon}</div>
              <div className="video-card-title">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>

            <div className="video-card-body">
              {!videos[card.type].url ? (
                <div className="upload-zone" onClick={() => triggerFileInput(card.type)}>
                  <FaUpload className="upload-icon" />
                  <p className="upload-text">Cliquez pour sélectionner une vidéo</p>
                  <span className="upload-hint">ou glissez-déposez un fichier ici</span>
                  <input
                    ref={fileInputRefs[card.type]}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect(card.type)}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="video-preview">
                  <video
                    className="preview-player"
                    controls
                    src={videos[card.type].url}
                  >
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                  <div className="video-info">
                    <FaCheckCircle className="check-icon" />
                    <span className="video-name">{videos[card.type].name}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removeVideo(card.type)}
                      title="Supprimer la vidéo"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="video-card-footer">
              <button
                className="btn-upload-action"
                onClick={() => triggerFileInput(card.type)}
                disabled={!videos[card.type].url}
              >
                <FaUpload /> {videos[card.type].url ? 'Remplacer' : 'Charger'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="videos-header" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Gestion des Images des Logements</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Gérez les images affichées dans la rubrique "Logements" du site utilisateur</p>
      </div>

      <div className="videos-container">
        {imageCards.map((card, index) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="video-card"
            style={{ '--card-color': card.color }}
          >
            <div className="video-card-header">
              <div className="video-card-icon">{card.icon}</div>
              <div className="video-card-title">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>

            <div className="video-card-body">
              {!images[card.type].url ? (
                <div className="upload-zone" onClick={() => triggerImageInput(card.type)}>
                  <FaUpload className="upload-icon" />
                  <p className="upload-text">Cliquez pour sélectionner une image</p>
                  <span className="upload-hint">ou glissez-déposez un fichier ici</span>
                  <input
                    ref={imageInputRefs[card.type]}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect(card.type)}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="video-preview">
                  <img
                    className="preview-player"
                    src={images[card.type].url}
                    alt={card.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div className="video-info">
                    <FaCheckCircle className="check-icon" />
                    <span className="video-name">{images[card.type].name}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removeImage(card.type)}
                      title="Supprimer l'image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="video-card-footer">
              <button
                className="btn-upload-action"
                onClick={() => triggerImageInput(card.type)}
                disabled={!images[card.type].url}
              >
                <FaUpload /> {images[card.type].url ? 'Remplacer' : 'Charger'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="videos-actions">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="btn-save"
          onClick={saveVideos}
          disabled={loading}
        >
          {loading ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}
        </motion.button>
      </div>
    </div>
  );
};

export default Videos;
