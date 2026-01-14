import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaVideo, FaPlay, FaTimes, FaDraftingCompass, FaImage, FaHome, FaBuilding, FaFilePdf } from 'react-icons/fa';
import API_URL from '../config';
import { useCloudinaryWidget } from '../hooks/useCloudinaryWidget';
import './Videos.css';

const Videos = () => {
  const [videos, setVideos] = useState({
    visite3d: { file: null, name: '', url: '' },
    promoteur: { file: null, name: '', url: '' },
    analyseEconomique: { file: null, name: '', url: '' },
    architecte: { file: null, name: '', url: '' },
    presentation: { file: null, name: '', url: '' }
  });
  const [images, setImages] = useState({
    'villa-duplex-4p': { file: null, name: '', url: '' },
    'villa-duplex-5p': { file: null, name: '', url: '' },
    'villa-triplex-6p': { file: null, name: '', url: '' }
  });
  const [promoteurImages, setPromoteurImages] = useState({
    'residence-3k': { file: null, name: '', url: '' },
    'residence-ciel-jardin': { file: null, name: '', url: '' },
    'miensah-cite-lumiere': { file: null, name: '', url: '' }
  });
  const [architecteImages, setArchitecteImages] = useState({
    'projet-architecte-1': { file: null, name: '', url: '' },
    'projet-architecte-2': { file: null, name: '', url: '' },
    'projet-architecte-3': { file: null, name: '', url: '' },
    'projet-architecte-4': { file: null, name: '', url: '' }
  });
  const [plansArchitecturaux, setPlansArchitecturaux] = useState({
    'villa-duplex-4p': { file: null, name: '', url: '' },
    'villa-duplex-5p': { file: null, name: '', url: '' },
    'villa-triplex-8p': { file: null, name: '', url: '' },
    'plan-de-masse': { file: null, name: '', url: '' }
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingType, setUploadingType] = useState(null);
  const [uploadMode, setUploadMode] = useState({}); // 'simple' ou 'chunked'
  const [currentChunk, setCurrentChunk] = useState({});

  // Hook pour le widget Cloudinary
  const { openWidget } = useCloudinaryWidget();

  const fileInputRefs = {
    visite3d: useRef(null),
    promoteur: useRef(null),
    analyseEconomique: useRef(null),
    architecte: useRef(null),
    presentation: useRef(null)
  };

  const imageInputRefs = {
    'villa-duplex-4p': useRef(null),
    'villa-duplex-5p': useRef(null),
    'villa-triplex-6p': useRef(null)
  };

  const promoteurImageInputRefs = {
    'residence-3k': useRef(null),
    'residence-ciel-jardin': useRef(null),
    'miensah-cite-lumiere': useRef(null)
  };

  const architecteImageInputRefs = {
    'projet-architecte-1': useRef(null),
    'projet-architecte-2': useRef(null),
    'projet-architecte-3': useRef(null),
    'projet-architecte-4': useRef(null)
  };

  const planInputRefs = {
    'villa-duplex-4p': useRef(null),
    'villa-duplex-5p': useRef(null),
    'villa-triplex-8p': useRef(null),
    'plan-de-masse': useRef(null)
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
                // URL Cloudinary complète, pas besoin d'ajouter API_URL
                url: data[type].url
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
                // URL Cloudinary complète, pas besoin d'ajouter API_URL
                url: data[type].url
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

  // Charger les images promoteur existantes au montage du composant
  useEffect(() => {
    const fetchPromoteurImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/promoteur-images`);
        if (response.ok) {
          const data = await response.json();
          const updatedImages = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].originalName && data[type].url) {
              updatedImages[type] = {
                file: null,
                name: data[type].originalName,
                url: data[type].url
              };
            }
          });
          if (Object.keys(updatedImages).length > 0) {
            setPromoteurImages(prev => ({ ...prev, ...updatedImages }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images promoteur:', error);
      }
    };
    fetchPromoteurImages();
  }, []);

  // Charger les images architecte existantes au montage du composant
  useEffect(() => {
    const fetchArchitecteImages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/architecte-images`);
        if (response.ok) {
          const data = await response.json();
          const updatedImages = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].originalName && data[type].url) {
              updatedImages[type] = {
                file: null,
                name: data[type].originalName,
                url: data[type].url
              };
            }
          });
          if (Object.keys(updatedImages).length > 0) {
            setArchitecteImages(prev => ({ ...prev, ...updatedImages }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des images architecte:', error);
      }
    };
    fetchArchitecteImages();
  }, []);

  // Charger les plans architecturaux existants au montage du composant
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_URL}/api/plans-architecturaux`);
        if (response.ok) {
          const data = await response.json();
          const updatedPlans = {};
          Object.keys(data).forEach(type => {
            if (data[type] && data[type].originalName && data[type].url) {
              updatedPlans[type] = {
                file: null,
                name: data[type].originalName,
                url: data[type].url
              };
            }
          });
          if (Object.keys(updatedPlans).length > 0) {
            setPlansArchitecturaux(prev => ({ ...prev, ...updatedPlans }));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des plans architecturaux:', error);
      }
    };
    fetchPlans();
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
    // Utiliser le widget Cloudinary pour éviter les problèmes CORS avec les gros fichiers
    // ACTIVÉ : Widget Cloudinary pour tous les uploads (recommandé pour gros fichiers)
    return handleWidgetUpload(type);

    // Désactivé : input file standard (décommenter pour réactiver)
    // fileInputRefs[type].current.click();
  };

  // Fonction pour utiliser le widget Cloudinary (pour gros fichiers ou si CORS)
  const handleWidgetUpload = (type) => {
    openWidget(
      type,
      (result) => {
        // Succès : mettre à jour l'état avec l'URL Cloudinary
        setVideos(prev => ({
          ...prev,
          [type]: {
            file: null,
            name: result.name,
            url: result.url
          }
        }));
        setUploadProgress(prev => ({ ...prev, [type]: 100 }));
        console.log(`Vidéo ${type} uploadée via widget:`, result);
      },
      (error) => {
        // Erreur
        console.error(`Erreur upload ${type} via widget:`, error);
        alert(`Erreur lors de l'upload : ${error.message}`);
      }
    );
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
    // Vérifier si l'image provient du serveur (uploadée sur Cloudinary)
    // Les URLs Cloudinary commencent par https://, les prévisualisations locales par blob:
    const isUploadedImage = images[type].url && images[type].url.startsWith('http');

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

  const handlePromoteurImageSelect = (type) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setPromoteurImages(prev => ({
        ...prev,
        [type]: { file, name: file.name, url: imageUrl }
      }));
    } else {
      alert('Veuillez sélectionner un fichier image valide');
    }
  };

  const triggerPromoteurImageInput = (type) => {
    promoteurImageInputRefs[type].current.click();
  };

  const removePromoteurImage = async (type) => {
    // Vérifier si l'image provient du serveur (uploadée sur Cloudinary)
    const isUploadedImage = promoteurImages[type].url && promoteurImages[type].url.startsWith('http');

    if (isUploadedImage) {
      if (!window.confirm(`Voulez-vous vraiment supprimer cette image ? Elle ne sera plus visible dans la rubrique Promoteur du site utilisateur.`)) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/promoteur-images/${type}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log(`Image promoteur ${type} supprimée du serveur`);
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'image promoteur ${type}:`, error);
        alert('Erreur lors de la suppression de l\'image');
        return;
      }
    } else if (promoteurImages[type].url) {
      URL.revokeObjectURL(promoteurImages[type].url);
    }

    setPromoteurImages(prev => ({
      ...prev,
      [type]: { file: null, name: '', url: '' }
    }));
  };

  const handleArchitecteImageSelect = (type) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setArchitecteImages(prev => ({
        ...prev,
        [type]: { file, name: file.name, url: imageUrl }
      }));
    } else {
      alert('Veuillez sélectionner un fichier image valide');
    }
  };

  const triggerArchitecteImageInput = (type) => {
    architecteImageInputRefs[type].current.click();
  };

  const removeArchitecteImage = async (type) => {
    // Vérifier si l'image provient du serveur (uploadée sur Cloudinary)
    const isUploadedImage = architecteImages[type].url && architecteImages[type].url.startsWith('http');

    if (isUploadedImage) {
      if (!window.confirm(`Voulez-vous vraiment supprimer cette image ? Elle ne sera plus visible dans la rubrique Architecte du site utilisateur.`)) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/architecte-images/${type}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log(`Image architecte ${type} supprimée du serveur`);
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'image architecte ${type}:`, error);
        alert('Erreur lors de la suppression de l\'image');
        return;
      }
    } else if (architecteImages[type].url) {
      URL.revokeObjectURL(architecteImages[type].url);
    }

    setArchitecteImages(prev => ({
      ...prev,
      [type]: { file: null, name: '', url: '' }
    }));
  };

  // Fonctions pour les plans architecturaux PDF
  const handlePlanSelect = (type) => (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const planUrl = URL.createObjectURL(file);
      setPlansArchitecturaux(prev => ({
        ...prev,
        [type]: { file, name: file.name, url: planUrl }
      }));
    } else {
      alert('Veuillez sélectionner un fichier PDF valide');
    }
  };

  const triggerPlanInput = (type) => {
    planInputRefs[type].current.click();
  };

  const removePlan = async (type) => {
    const isUploadedPlan = plansArchitecturaux[type].url && plansArchitecturaux[type].url.startsWith('http');

    if (isUploadedPlan) {
      if (!window.confirm(`Voulez-vous vraiment supprimer ce plan ? Il ne sera plus visible dans la rubrique Logements du site utilisateur.`)) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/plans-architecturaux/${type}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log(`Plan ${type} supprimé du serveur`);
        } else {
          throw new Error('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error(`Erreur lors de la suppression du plan ${type}:`, error);
        alert('Erreur lors de la suppression du plan');
        return;
      }
    } else if (plansArchitecturaux[type].url) {
      URL.revokeObjectURL(plansArchitecturaux[type].url);
    }

    setPlansArchitecturaux(prev => ({
      ...prev,
      [type]: { file: null, name: '', url: '' }
    }));
  };

  /**
   * Upload direct vers Cloudinary avec progression
   * Gère le chunked upload pour les gros fichiers (>100MB)
   */
  const uploadToCloudinary = (file, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        setUploadingType(type);
        setUploadProgress(prev => ({ ...prev, [type]: 0 }));

        // 1. Obtenir la signature depuis le backend
        const signatureResponse = await fetch(`${API_URL}/api/upload/signature`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!signatureResponse.ok) {
          throw new Error('Erreur lors de la génération de la signature');
        }

        const signatureData = await signatureResponse.json();
        const { signature, timestamp, cloudName, apiKey, folder } = signatureData;

        // Définir les limites
        const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
        const CHUNK_SIZE = 20 * 1024 * 1024; // 20 MB par morceau
        const USE_CHUNKED = false; // Désactiver temporairement le chunked upload

        // Vérifier si on doit utiliser le chunked upload
        if (USE_CHUNKED && file.size > MAX_FILE_SIZE) {
          console.log(`Fichier de ${(file.size / (1024 * 1024)).toFixed(2)}MB - Utilisation du chunked upload`);
          setUploadMode(prev => ({ ...prev, [type]: 'chunked' }));

          // CHUNKED UPLOAD pour gros fichiers avec retry et meilleure gestion d'erreurs
          const uploadChunked = async () => {
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            let uploadedBytes = 0;
            let cloudinaryResponse = null;

            // Créer un identifiant unique pour ce chunked upload
            const uploadId = `${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

            // Fonction pour uploader un chunk avec retry
            const uploadChunkWithRetry = async (chunkIndex, maxRetries = 3) => {
              const start = chunkIndex * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, file.size);
              const chunk = file.slice(start, end);

              for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                  console.log(`Upload chunk ${chunkIndex + 1}/${totalChunks} (tentative ${attempt}/${maxRetries})`);
                  setCurrentChunk(prev => ({
                    ...prev,
                    [type]: `Chunk ${chunkIndex + 1}/${totalChunks}${attempt > 1 ? ` (tentative ${attempt})` : ''}`
                  }));

                  // Créer le FormData pour ce chunk
                  const chunkFormData = new FormData();
                  chunkFormData.append('file', chunk, file.name);
                  chunkFormData.append('api_key', apiKey);
                  chunkFormData.append('timestamp', timestamp);
                  chunkFormData.append('signature', signature);
                  chunkFormData.append('folder', folder);
                  // NE PAS inclure resource_type dans FormData car il n'est pas dans la signature
                  // Le type est déterminé par l'URL (/video/upload)

                  // Upload ce chunk avec XMLHttpRequest
                  const chunkResponse = await new Promise((chunkResolve, chunkReject) => {
                    const xhr = new XMLHttpRequest();
                    let timeoutId;

                    // Timeout après 60 secondes
                    timeoutId = setTimeout(() => {
                      xhr.abort();
                      chunkReject(new Error(`Timeout chunk ${chunkIndex + 1}`));
                    }, 60000);

                    xhr.upload.addEventListener('progress', (e) => {
                      if (e.lengthComputable) {
                        const chunkProgress = e.loaded;
                        const totalProgress = uploadedBytes + chunkProgress;
                        const percentComplete = (totalProgress / file.size) * 100;
                        setUploadProgress(prev => ({ ...prev, [type]: Math.round(percentComplete) }));
                      }
                    });

                    xhr.addEventListener('load', () => {
                      clearTimeout(timeoutId);
                      try {
                        const response = JSON.parse(xhr.responseText);
                        if (xhr.status === 200 || xhr.status === 201) {
                          chunkResolve(response);
                        } else {
                          console.error(`Erreur Cloudinary chunk ${chunkIndex + 1}:`, response);
                          console.error('Status:', xhr.status, 'StatusText:', xhr.statusText);
                          console.error('Response complète:', xhr.responseText);
                          const errorMsg = response.error?.message || response.message || `Erreur chunk ${chunkIndex + 1}: ${xhr.statusText}`;
                          chunkReject(new Error(errorMsg));
                        }
                      } catch (e) {
                        console.error(`Erreur parsing réponse chunk ${chunkIndex + 1}:`, xhr.responseText);
                        chunkReject(new Error(`Erreur parsing réponse chunk ${chunkIndex + 1}: ${e.message}`));
                      }
                    });

                    xhr.addEventListener('error', () => {
                      clearTimeout(timeoutId);
                      chunkReject(new Error(`Erreur réseau chunk ${chunkIndex + 1}`));
                    });

                    xhr.addEventListener('abort', () => {
                      clearTimeout(timeoutId);
                      chunkReject(new Error(`Upload annulé chunk ${chunkIndex + 1}`));
                    });

                    // Configuration de la requête
                    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
                    // Pour Cloudinary, le header X-Unique-Upload-Id et Content-Range sont importants
                    xhr.setRequestHeader('X-Unique-Upload-Id', uploadId);
                    xhr.setRequestHeader('Content-Range', `bytes ${start}-${end-1}/${file.size}`);

                    // Log pour debug
                    console.log(`Envoi chunk ${chunkIndex + 1}/${totalChunks}:`, {
                      range: `bytes ${start}-${end-1}/${file.size}`,
                      uploadId: uploadId,
                      chunkSize: chunk.size
                    });

                    xhr.send(chunkFormData);
                  });

                  uploadedBytes = end;

                  // Petit délai entre les chunks pour éviter le rate limiting (500ms)
                  if (chunkIndex < totalChunks - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }

                  return chunkResponse;

                } catch (error) {
                  console.error(`Erreur chunk ${chunkIndex + 1} tentative ${attempt}:`, error);

                  if (attempt === maxRetries) {
                    throw error;
                  }

                  // Attendre avant de réessayer (backoff exponentiel)
                  const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                  console.log(`Attente de ${waitTime}ms avant nouvelle tentative...`);
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                }
              }
            };

            // Uploader tous les chunks
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
              const chunkResponse = await uploadChunkWithRetry(chunkIndex);

              // Le dernier chunk contient la réponse finale avec l'URL
              if (chunkIndex === totalChunks - 1) {
                cloudinaryResponse = chunkResponse;
              }
            }

            return cloudinaryResponse;
          };

          const cloudinaryResponse = await uploadChunked();
          console.log(`Vidéo ${type} uploadée sur Cloudinary (chunked):`, cloudinaryResponse);

          // Sauvegarder dans MongoDB
          const saveResponse = await fetch(`${API_URL}/api/videos/save-direct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: type,
              cloudinaryUrl: cloudinaryResponse.secure_url,
              cloudinaryId: cloudinaryResponse.public_id,
              originalName: file.name,
              size: file.size
            })
          });

          if (saveResponse.ok) {
            const saveData = await saveResponse.json();
            setVideos(prev => ({
              ...prev,
              [type]: {
                file: null,
                name: file.name,
                url: cloudinaryResponse.secure_url
              }
            }));
            setUploadProgress(prev => ({ ...prev, [type]: 100 }));
            resolve(saveData);
          } else {
            throw new Error('Erreur lors de la sauvegarde dans MongoDB');
          }

        } else {
          console.log(`Fichier de ${(file.size / (1024 * 1024)).toFixed(2)}MB - Upload direct Cloudinary`);
          setUploadMode(prev => ({ ...prev, [type]: 'simple' }));

          // UPLOAD DIRECT pour tous les fichiers (optimisé pour gros fichiers)
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', apiKey);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);
          formData.append('folder', folder);
          // NE PAS inclure resource_type dans FormData car il n'est pas dans la signature
          // Le type est déterminé par l'URL (/video/upload)

          const xhr = new XMLHttpRequest();

          // Timeout plus long pour gros fichiers (10 minutes)
          const timeoutDuration = Math.max(600000, file.size / 1024); // Min 10min ou 1s par KB
          let timeoutId = setTimeout(() => {
            xhr.abort();
            console.error(`Upload timeout après ${timeoutDuration/1000} secondes`);
          }, timeoutDuration);

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              setUploadProgress(prev => ({ ...prev, [type]: Math.round(percentComplete) }));

              // Log de progression pour gros fichiers
              if (file.size > 50 * 1024 * 1024 && percentComplete % 10 === 0) {
                console.log(`Upload ${type}: ${percentComplete.toFixed(0)}% (${(e.loaded / (1024*1024)).toFixed(1)}MB / ${(e.total / (1024*1024)).toFixed(1)}MB)`);
              }
            }
          });

          xhr.addEventListener('load', async () => {
            clearTimeout(timeoutId); // Clear le timeout si succès

            if (xhr.status === 200) {
              const cloudinaryResponse = JSON.parse(xhr.responseText);
              console.log(`Vidéo ${type} uploadée sur Cloudinary (simple):`, cloudinaryResponse);

              // Sauvegarder dans MongoDB
              const saveResponse = await fetch(`${API_URL}/api/videos/save-direct`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: type,
                  cloudinaryUrl: cloudinaryResponse.secure_url,
                  cloudinaryId: cloudinaryResponse.public_id,
                  originalName: file.name,
                  size: file.size
                })
              });

              if (saveResponse.ok) {
                const saveData = await saveResponse.json();
                setVideos(prev => ({
                  ...prev,
                  [type]: {
                    file: null,
                    name: file.name,
                    url: cloudinaryResponse.secure_url
                  }
                }));
                setUploadProgress(prev => ({ ...prev, [type]: 100 }));
                resolve(saveData);
              } else {
                throw new Error('Erreur lors de la sauvegarde dans MongoDB');
              }
            } else {
              console.error('Erreur upload Cloudinary:', xhr.status, xhr.statusText);
              console.error('Réponse:', xhr.responseText);
              throw new Error(`Erreur Cloudinary (${xhr.status}): ${xhr.statusText}`);
            }
          });

          xhr.addEventListener('error', () => {
            clearTimeout(timeoutId);
            console.error('Erreur réseau lors de l\'upload');
            reject(new Error('Erreur réseau lors de l\'upload - vérifiez votre connexion'));
          });

          xhr.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new Error('Upload annulé ou timeout'));
          });

          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
          xhr.send(formData);
        }
      } catch (error) {
        console.error(`Erreur upload ${type}:`, error);
        setUploadProgress(prev => ({ ...prev, [type]: -1 })); // -1 indique une erreur
        setUploadMode(prev => ({ ...prev, [type]: undefined }));
        setCurrentChunk(prev => ({ ...prev, [type]: undefined }));
        reject(error);
      } finally {
        // Nettoyer les states après 3 secondes si succès
        setTimeout(() => {
          if (uploadProgress[type] === 100) {
            setUploadMode(prev => ({ ...prev, [type]: undefined }));
            setCurrentChunk(prev => ({ ...prev, [type]: undefined }));
          }
        }, 3000);
      }
    });
  };

  const saveVideos = async () => {
    setLoading(true);
    const uploadPromises = [];

    // Upload des vidéos vers Cloudinary directement
    for (const [type, video] of Object.entries(videos)) {
      if (video.file) {
        uploadPromises.push(uploadToCloudinary(video.file, type));
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

    // Upload des images promoteur
    for (const [type, image] of Object.entries(promoteurImages)) {
      if (image.file) {
        const formData = new FormData();
        formData.append('image', image.file);
        formData.append('type', type);

        const uploadPromise = fetch(`${API_URL}/api/promoteur-images/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log(`Image promoteur ${type} uploadée:`, data);
            if (data && data.image && data.image.originalName && data.image.url) {
              setPromoteurImages(prev => ({
                ...prev,
                [type]: {
                  file: null,
                  name: data.image.originalName,
                  url: data.image.url
                }
              }));
            }
          })
          .catch(error => {
            console.error(`Erreur upload promoteur ${type}:`, error);
            throw error;
          });

        uploadPromises.push(uploadPromise);
      }
    }

    // Upload des images architecte
    for (const [type, image] of Object.entries(architecteImages)) {
      if (image.file) {
        const formData = new FormData();
        formData.append('image', image.file);
        formData.append('type', type);

        const uploadPromise = fetch(`${API_URL}/api/architecte-images/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log(`Image architecte ${type} uploadée:`, data);
            if (data && data.image && data.image.originalName && data.image.url) {
              setArchitecteImages(prev => ({
                ...prev,
                [type]: {
                  file: null,
                  name: data.image.originalName,
                  url: data.image.url
                }
              }));
            }
          })
          .catch(error => {
            console.error(`Erreur upload architecte ${type}:`, error);
            throw error;
          });

        uploadPromises.push(uploadPromise);
      }
    }

    // Upload des plans architecturaux PDF
    // - Plan de masse: stockage direct base64 dans MongoDB (sans Cloudinary)
    // - Autres plans: via Cloudinary + stockage base64 dans MongoDB
    for (const [type, plan] of Object.entries(plansArchitecturaux)) {
      if (plan.file) {
        const uploadPlanPromise = (async () => {
          try {
            // Lire le fichier comme base64
            const fileBase64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Enlever le préfixe data:...
                resolve(base64);
              };
              reader.onerror = reject;
              reader.readAsDataURL(plan.file);
            });

            // Pour plan-de-masse: stockage direct base64 sans Cloudinary
            if (type === 'plan-de-masse') {
              console.log('Plan de masse: stockage direct en base64 sans Cloudinary');

              const saveResponse = await fetch(`${API_URL}/api/plans-architecturaux`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: type,
                  originalName: plan.file.name,
                  size: plan.file.size,
                  pdfBase64: fileBase64  // Stockage base64 direct sans URL Cloudinary
                })
              });

              const saveData = await saveResponse.json();
              console.log('MongoDB save response (plan-de-masse):', saveData);

              if (saveResponse.ok) {
                console.log('Plan de masse enregistré avec succès (base64 direct)');
                setPlansArchitecturaux(prev => ({
                  ...prev,
                  [type]: {
                    file: null,
                    name: plan.file.name,
                    url: `base64://${type}`
                  }
                }));
              } else {
                console.error('Erreur sauvegarde MongoDB (plan-de-masse):', saveData);
                throw new Error(saveData.error || 'Erreur sauvegarde plan de masse');
              }
            } else {
              // Pour les autres plans: via Cloudinary
              const signatureResponse = await fetch(`${API_URL}/api/upload/signature-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              const signatureData = await signatureResponse.json();
              const { signature, timestamp, cloudName, apiKey, folder, access_mode } = signatureData;

              // Upload vers Cloudinary (raw pour les PDF avec access_mode public)
              const formData = new FormData();
              formData.append('file', plan.file);
              formData.append('api_key', apiKey);
              formData.append('timestamp', timestamp);
              formData.append('signature', signature);
              formData.append('folder', folder);
              formData.append('access_mode', access_mode);

              const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
                { method: 'POST', body: formData }
              );
              const cloudinaryData = await cloudinaryResponse.json();

              console.log('Cloudinary response for plan:', cloudinaryData);

              if (cloudinaryData.secure_url) {
                // Sauvegarder dans MongoDB avec le base64
                const saveResponse = await fetch(`${API_URL}/api/plans-architecturaux`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: type,
                    url: cloudinaryData.secure_url,
                    originalName: plan.file.name,
                    size: plan.file.size,
                    cloudinaryId: cloudinaryData.public_id,
                    pdfBase64: fileBase64
                  })
                });

                const saveData = await saveResponse.json();
                console.log('MongoDB save response:', saveData);

                if (saveResponse.ok) {
                  console.log(`Plan ${type} uploadé avec succès (via Cloudinary)`);
                  setPlansArchitecturaux(prev => ({
                    ...prev,
                    [type]: {
                      file: null,
                      name: plan.file.name,
                      url: cloudinaryData.secure_url
                    }
                  }));
                } else {
                  console.error('Erreur sauvegarde MongoDB:', saveData);
                  throw new Error(saveData.error || 'Erreur sauvegarde');
                }
              } else {
                console.error('Erreur Cloudinary:', cloudinaryData);
                throw new Error(cloudinaryData.error?.message || 'Erreur upload Cloudinary');
              }
            }
          } catch (error) {
            console.error(`Erreur upload plan ${type}:`, error);
            throw error;
          }
        })();

        uploadPromises.push(uploadPlanPromise);
      }
    }

    try {
      await Promise.all(uploadPromises);
      alert('Vidéos, images et plans enregistrés avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des vidéos et images');
    } finally {
      setLoading(false);
    }
  };

  const videoCards = [
    {
      type: 'presentation',
      title: 'Vidéo Présentation',
      description: 'Chargez la vidéo de présentation du projet (affichée sur la page Présentation)',
      icon: <FaPlay />,
      color: '#E91E63'
    },
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

  const promoteurImageCards = [
    {
      type: 'residence-3k',
      title: 'Résidence 3K',
      description: 'Image du projet Résidence 3K - Nos Projets Emblématiques',
      icon: <FaBuilding />,
      color: '#DC2626'
    },
    {
      type: 'residence-ciel-jardin',
      title: 'Résidence Ciel & Jardin',
      description: 'Image du projet Résidence Ciel & Jardin - Nos Projets Emblématiques',
      icon: <FaBuilding />,
      color: '#EA580C'
    },
    {
      type: 'miensah-cite-lumiere',
      title: 'MIENSAH CITÉ LUMIÈRE',
      description: 'Image du projet MIENSAH CITÉ LUMIÈRE - Nos Projets Emblématiques',
      icon: <FaBuilding />,
      color: '#D97706'
    }
  ];

  const architecteImageCards = [
    {
      type: 'projet-architecte-1',
      title: 'Projet Architecte 1',
      description: 'Image du premier projet - Rubrique Architecte',
      icon: <FaDraftingCompass />,
      color: '#0891B2'
    },
    {
      type: 'projet-architecte-2',
      title: 'Projet Architecte 2',
      description: 'Image du deuxième projet - Rubrique Architecte',
      icon: <FaDraftingCompass />,
      color: '#0D9488'
    },
    {
      type: 'projet-architecte-3',
      title: 'Projet Architecte 3',
      description: 'Image du troisième projet - Rubrique Architecte',
      icon: <FaDraftingCompass />,
      color: '#059669'
    },
    {
      type: 'projet-architecte-4',
      title: 'Projet Architecte 4',
      description: 'Image du quatrième projet - Rubrique Architecte',
      icon: <FaDraftingCompass />,
      color: '#10B981'
    }
  ];

  const planCards = [
    {
      type: 'villa-duplex-4p',
      title: 'Plans Villa Duplex 4 Pièces',
      description: 'Plans architecturaux de la Villa Duplex 4 pièces',
      icon: <FaFilePdf />,
      color: '#DC2626'
    },
    {
      type: 'villa-duplex-5p',
      title: 'Plans Villa Duplex 5 Pièces',
      description: 'Plans architecturaux de la Villa Duplex 5 pièces',
      icon: <FaFilePdf />,
      color: '#EA580C'
    },
    {
      type: 'villa-triplex-8p',
      title: 'Plans Villa Triplex 8 Pièces',
      description: 'Plans architecturaux de la Villa Triplex 8 pièces',
      icon: <FaFilePdf />,
      color: '#7C3AED'
    },
    {
      type: 'plan-de-masse',
      title: 'Plan de Masse',
      description: 'Plan de masse des logements - Affiché dans la rubrique Logements',
      icon: <FaFilePdf />,
      color: '#0891B2'
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

              {/* Barre de progression pour l'upload */}
              {uploadProgress[card.type] !== undefined && uploadProgress[card.type] >= 0 && uploadProgress[card.type] < 100 && (
                <div className="upload-progress-container">
                  <div className="upload-progress-bar">
                    <div
                      className="upload-progress-fill"
                      style={{ width: `${uploadProgress[card.type]}%` }}
                    ></div>
                  </div>
                  <span className="upload-progress-text">
                    {uploadProgress[card.type]}% -
                    {uploadMode[card.type] === 'chunked'
                      ? ` Chunked upload (Morceau ${currentChunk[card.type] || '...'})`
                      : ' Upload vers Cloudinary...'}
                  </span>
                </div>
              )}

              {uploadProgress[card.type] === -1 && (
                <div className="upload-error">
                  ❌ Erreur lors de l'upload. Réessayez.
                </div>
              )}
            </div>

            <div className="video-card-footer">
              <button
                className="btn-upload-action"
                onClick={() => triggerFileInput(card.type)}
                disabled={!videos[card.type].url || uploadProgress[card.type] > 0}
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

      <div className="videos-header" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Images des Projets Promoteur</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Gérez les images affichées dans la rubrique "Nos Projets Emblématiques" du site utilisateur</p>
      </div>

      <div className="videos-container">
        {promoteurImageCards.map((card, index) => (
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
              {!promoteurImages[card.type].url ? (
                <div className="upload-zone" onClick={() => triggerPromoteurImageInput(card.type)}>
                  <FaUpload className="upload-icon" />
                  <p className="upload-text">Cliquez pour sélectionner une image</p>
                  <span className="upload-hint">ou glissez-déposez un fichier ici</span>
                  <input
                    ref={promoteurImageInputRefs[card.type]}
                    type="file"
                    accept="image/*"
                    onChange={handlePromoteurImageSelect(card.type)}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="video-preview">
                  <img
                    className="preview-player"
                    src={promoteurImages[card.type].url}
                    alt={card.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div className="video-info">
                    <FaCheckCircle className="check-icon" />
                    <span className="video-name">{promoteurImages[card.type].name}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removePromoteurImage(card.type)}
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
                onClick={() => triggerPromoteurImageInput(card.type)}
                disabled={!promoteurImages[card.type].url}
              >
                <FaUpload /> {promoteurImages[card.type].url ? 'Remplacer' : 'Charger'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="videos-header" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Images des Projets Architecte</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Gérez les images affichées dans la rubrique "Architecte" du site utilisateur</p>
      </div>

      <div className="videos-container">
        {architecteImageCards.map((card, index) => (
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
              {!architecteImages[card.type].url ? (
                <div className="upload-zone" onClick={() => triggerArchitecteImageInput(card.type)}>
                  <FaUpload className="upload-icon" />
                  <p className="upload-text">Cliquez pour sélectionner une image</p>
                  <span className="upload-hint">ou glissez-déposez un fichier ici</span>
                  <input
                    ref={architecteImageInputRefs[card.type]}
                    type="file"
                    accept="image/*"
                    onChange={handleArchitecteImageSelect(card.type)}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className="video-preview">
                  <img
                    className="preview-player"
                    src={architecteImages[card.type].url}
                    alt={card.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div className="video-info">
                    <FaCheckCircle className="check-icon" />
                    <span className="video-name">{architecteImages[card.type].name}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removeArchitecteImage(card.type)}
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
                onClick={() => triggerArchitecteImageInput(card.type)}
                disabled={!architecteImages[card.type].url}
              >
                <FaUpload /> {architecteImages[card.type].url ? 'Remplacer' : 'Charger'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="videos-header" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Plans Architecturaux des Villas</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Chargez les plans PDF de chaque type de villa - affichés dans la rubrique "Logements" du site utilisateur</p>
      </div>

      <div className="videos-container">
        {planCards.map((card, index) => (
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
              {/* Input toujours présent pour permettre le remplacement */}
              <input
                ref={planInputRefs[card.type]}
                type="file"
                accept="application/pdf"
                onChange={handlePlanSelect(card.type)}
                style={{ display: 'none' }}
              />
              {!plansArchitecturaux[card.type].url ? (
                <div className="upload-zone" onClick={() => triggerPlanInput(card.type)}>
                  <FaUpload className="upload-icon" />
                  <p className="upload-text">Cliquez pour sélectionner un fichier PDF</p>
                  <span className="upload-hint">Plans architecturaux au format PDF</span>
                </div>
              ) : (
                <div className="video-preview">
                  <div className="pdf-preview" style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <FaFilePdf style={{ fontSize: '48px', color: card.color }} />
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Fichier PDF chargé</span>
                  </div>
                  <div className="video-info">
                    <FaCheckCircle className="check-icon" />
                    <span className="video-name">{plansArchitecturaux[card.type].name}</span>
                    <button
                      className="btn-remove"
                      onClick={() => removePlan(card.type)}
                      title="Supprimer le plan"
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
                onClick={() => triggerPlanInput(card.type)}
              >
                <FaUpload /> {plansArchitecturaux[card.type].url ? 'Remplacer' : 'Charger'}
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
