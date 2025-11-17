/**
 * Module de compression vidéo utilisant FFmpeg.wasm
 * Compresse automatiquement les vidéos > 100MB pour respecter la limite Cloudinary gratuite
 */

// Lazy loading pour éviter les erreurs de build sur Vercel
let FFmpeg = null;
let fetchFile = null;
let toBlobURL = null;

// Instance FFmpeg singleton
let ffmpegInstance = null;
let ffmpegLoaded = false;

/**
 * Initialise FFmpeg (une seule fois)
 */
const initFFmpeg = async () => {
  if (ffmpegLoaded && ffmpegInstance) {
    return ffmpegInstance;
  }

  try {
    // Chargement dynamique des modules FFmpeg
    if (!FFmpeg) {
      const ffmpegModule = await import('@ffmpeg/ffmpeg');
      const utilModule = await import('@ffmpeg/util');
      FFmpeg = ffmpegModule.FFmpeg;
      fetchFile = utilModule.fetchFile;
      toBlobURL = utilModule.toBlobURL;
    }

    ffmpegInstance = new FFmpeg();

    // Configuration pour éviter les problèmes CORS
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    });

    ffmpegLoaded = true;
    console.log('FFmpeg chargé avec succès');
    return ffmpegInstance;
  } catch (error) {
    console.error('Erreur lors du chargement de FFmpeg:', error);
    throw new Error('Impossible de charger le compresseur vidéo');
  }
};

/**
 * Calcule les paramètres de compression optimaux
 */
const calculateCompressionParams = (originalSizeMB, targetSizeMB = 95) => {
  const ratio = targetSizeMB / originalSizeMB;

  // CRF (Constant Rate Factor) - Plus élevé = plus de compression
  // Valeurs: 18 (excellente qualité) à 51 (qualité minimale)
  let crf = 23; // Qualité par défaut

  if (ratio < 0.3) {
    crf = 35; // Forte compression nécessaire
  } else if (ratio < 0.5) {
    crf = 30; // Compression moyenne
  } else if (ratio < 0.7) {
    crf = 27; // Compression légère
  } else if (ratio < 0.9) {
    crf = 25; // Compression très légère
  }

  // Résolution cible
  let scale = '-1:720'; // 720p par défaut
  if (ratio < 0.4) {
    scale = '-1:480'; // 480p pour forte compression
  } else if (ratio < 0.6) {
    scale = '-1:540'; // 540p pour compression moyenne
  }

  return { crf, scale };
};

/**
 * Compresse une vidéo en utilisant FFmpeg.wasm
 */
export const compressVideoWithFFmpeg = async (file, onProgress = null) => {
  const startTime = Date.now();
  const originalSizeMB = file.size / (1024 * 1024);

  console.log(`Début compression: ${file.name} (${originalSizeMB.toFixed(1)}MB)`);

  // Vérifier si compression nécessaire
  if (originalSizeMB <= 95) {
    console.log('Fichier déjà sous 95MB, pas de compression nécessaire');
    return file;
  }

  try {
    // Initialiser FFmpeg
    const ffmpeg = await initFFmpeg();

    // Paramètres de compression
    const { crf, scale } = calculateCompressionParams(originalSizeMB);
    console.log(`Paramètres compression: CRF=${crf}, Scale=${scale}`);

    // Nom des fichiers temporaires
    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    // Écrire le fichier d'entrée dans le système de fichiers virtuel FFmpeg
    if (onProgress) onProgress(10, 'Chargement de la vidéo...');
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Configurer la progression
    ffmpeg.on('progress', ({ progress }) => {
      const percent = Math.round(10 + (progress * 80)); // 10-90%
      if (onProgress) {
        onProgress(percent, `Compression en cours... ${percent}%`);
      }
      console.log(`Progression: ${percent}%`);
    });

    // Commande FFmpeg pour compression
    // -i input.mp4 : fichier d'entrée
    // -vf scale : redimensionner la vidéo
    // -c:v libx264 : codec vidéo H.264
    // -crf : facteur de qualité constant
    // -preset : vitesse de compression (ultrafast, veryfast, fast, medium, slow)
    // -c:a aac : codec audio AAC
    // -b:a : bitrate audio
    // -movflags : optimisation pour streaming
    await ffmpeg.exec([
      '-i', inputName,
      '-vf', `scale=${scale}`,
      '-c:v', 'libx264',
      '-crf', String(crf),
      '-preset', 'fast',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      outputName
    ]);

    // Lire le fichier compressé
    if (onProgress) onProgress(90, 'Finalisation...');
    const data = await ffmpeg.readFile(outputName);

    // Créer un nouveau Blob/File
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, '_compressed.mp4'),
      { type: 'video/mp4' }
    );

    // Nettoyer les fichiers temporaires
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);

    const compressedSizeMB = compressedFile.size / (1024 * 1024);
    const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ Compression terminée:`);
    console.log(`   Taille originale: ${originalSizeMB.toFixed(1)}MB`);
    console.log(`   Taille compressée: ${compressedSizeMB.toFixed(1)}MB`);
    console.log(`   Réduction: ${compressionRatio}%`);
    console.log(`   Durée: ${duration}s`);

    if (onProgress) {
      onProgress(100, `Compression terminée! ${originalSizeMB.toFixed(1)}MB → ${compressedSizeMB.toFixed(1)}MB`);
    }

    return compressedFile;

  } catch (error) {
    console.error('Erreur lors de la compression:', error);
    throw new Error(`Échec de la compression: ${error.message}`);
  }
};

/**
 * Composant React pour afficher la progression de la compression
 */
export const CompressionProgress = ({ progress, message }) => {
  return (
    <div style={{
      padding: '20px',
      background: '#f0f0f0',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3>Compression vidéo en cours</h3>
      <p>{message}</p>
      <div style={{
        width: '100%',
        height: '20px',
        background: '#ddd',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4CAF50, #45a049)',
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {progress > 10 && `${progress}%`}
        </div>
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        ⚠️ Ne fermez pas cette fenêtre pendant la compression
      </p>
    </div>
  );
};

/**
 * Hook React pour gérer la compression
 */
export const useVideoCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const compressVideo = async (file) => {
    setIsCompressing(true);
    setProgress(0);
    setMessage('Initialisation...');
    setError(null);

    try {
      const compressedFile = await compressVideoWithFFmpeg(
        file,
        (percent, msg) => {
          setProgress(percent);
          setMessage(msg);
        }
      );

      setIsCompressing(false);
      return compressedFile;

    } catch (err) {
      setError(err.message);
      setIsCompressing(false);
      throw err;
    }
  };

  return {
    compressVideo,
    isCompressing,
    progress,
    message,
    error
  };
};

// Pour React
import { useState } from 'react';

export default {
  compressVideoWithFFmpeg,
  CompressionProgress,
  useVideoCompression
};