import React, { useState, useRef } from 'react';
import { compressVideoWithFFmpeg, CompressionProgress } from '../utils/ffmpegCompressor';
import { useCloudinaryWidget } from '../hooks/useCloudinaryWidget';
import './VideoUploadWithCompression.css';

const VideoUploadWithCompression = ({ type, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionMessage, setCompressionMessage] = useState('');
  const [showCompressionOption, setShowCompressionOption] = useState(false);
  const fileInputRef = useRef(null);
  const { openWidget } = useCloudinaryWidget();

  // Vérifier la taille du fichier et proposer compression si nécessaire
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    console.log(`Fichier sélectionné: ${file.name} (${sizeMB.toFixed(1)}MB)`);

    setSelectedFile(file);

    // Si fichier > 95MB, proposer compression
    if (sizeMB > 95) {
      setShowCompressionOption(true);
    } else {
      // Upload direct si < 95MB
      uploadToCloudinary(file);
    }
  };

  // Compresser la vidéo
  const handleCompression = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    setCompressionProgress(0);
    setShowCompressionOption(false);

    try {
      console.log('Démarrage de la compression...');

      const compressedFile = await compressVideoWithFFmpeg(
        selectedFile,
        (progress, message) => {
          setCompressionProgress(progress);
          setCompressionMessage(message);
        }
      );

      console.log('Compression terminée, upload vers Cloudinary...');

      // Upload le fichier compressé
      await uploadToCloudinary(compressedFile);

      setIsCompressing(false);
      setCompressionProgress(0);
      setCompressionMessage('');

    } catch (error) {
      console.error('Erreur compression:', error);
      alert(`Erreur lors de la compression: ${error.message}`);
      setIsCompressing(false);
    }
  };

  // Upload vers Cloudinary (via widget ou direct)
  const uploadToCloudinary = (file) => {
    // Si le fichier est un File object (après compression), on doit le convertir pour le widget
    if (file instanceof File) {
      // Le widget Cloudinary ne peut pas recevoir directement un File compressé
      // On doit créer un data URL et l'uploader
      const reader = new FileReader();

      reader.onload = (e) => {
        // Utiliser le widget avec l'URL de données
        openWidget(
          type,
          (result) => {
            console.log('Upload réussi:', result);
            onUploadSuccess && onUploadSuccess(result);
            resetUpload();
          },
          (error) => {
            console.error('Erreur upload:', error);
            alert(`Erreur lors de l'upload: ${error.message}`);
          }
        );
      };

      reader.readAsDataURL(file);
    } else {
      // Upload direct via widget
      openWidget(
        type,
        (result) => {
          console.log('Upload réussi:', result);
          onUploadSuccess && onUploadSuccess(result);
          resetUpload();
        },
        (error) => {
          console.error('Erreur upload:', error);
          alert(`Erreur lors de l'upload: ${error.message}`);
        }
      );
    }
  };

  // Upload sans compression
  const handleDirectUpload = () => {
    if (!selectedFile) return;
    setShowCompressionOption(false);
    uploadToCloudinary(selectedFile);
  };

  // Réinitialiser l'upload
  const resetUpload = () => {
    setSelectedFile(null);
    setShowCompressionOption(false);
    setIsCompressing(false);
    setCompressionProgress(0);
    setCompressionMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="video-upload-compression">
      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Bouton principal d'upload */}
      {!isCompressing && !showCompressionOption && (
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📹 Sélectionner une vidéo
        </button>
      )}

      {/* Options de compression */}
      {showCompressionOption && (
        <div className="compression-options">
          <div className="file-info">
            <h3>⚠️ Fichier volumineux détecté</h3>
            <p>
              <strong>{selectedFile?.name}</strong><br />
              Taille: {(selectedFile?.size / (1024 * 1024)).toFixed(1)}MB
            </p>
            <p className="warning">
              Ce fichier dépasse la limite de 100MB du plan gratuit Cloudinary.
            </p>
          </div>

          <div className="compression-actions">
            <button
              className="btn-compress"
              onClick={handleCompression}
            >
              🗜️ Compresser automatiquement
              <small>Réduit à &lt;95MB, peut prendre quelques minutes</small>
            </button>

            <button
              className="btn-direct"
              onClick={handleDirectUpload}
            >
              ⚡ Essayer quand même
              <small>Risque d'échec si &gt;100MB</small>
            </button>

            <button
              className="btn-cancel"
              onClick={resetUpload}
            >
              ❌ Annuler
            </button>
          </div>

          <div className="compression-tips">
            <h4>💡 Alternatives:</h4>
            <ul>
              <li>Compresser manuellement avec HandBrake</li>
              <li>Réduire la résolution de la vidéo</li>
              <li>Couper les parties inutiles</li>
            </ul>
          </div>
        </div>
      )}

      {/* Barre de progression de compression */}
      {isCompressing && (
        <CompressionProgress
          progress={compressionProgress}
          message={compressionMessage}
        />
      )}
    </div>
  );
};

export default VideoUploadWithCompression;