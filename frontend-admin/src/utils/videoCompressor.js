/**
 * Utilitaire pour compresser les vidéos avant upload
 * Utilise la conversion côté client pour réduire la taille
 */

export const compressVideo = async (file, maxSizeMB = 95) => {
  return new Promise((resolve, reject) => {
    // Vérifier si le fichier est déjà sous la limite
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
      console.log(`Fichier déjà sous ${maxSizeMB}MB, pas de compression nécessaire`);
      resolve(file);
      return;
    }

    // Créer un élément video pour obtenir les métadonnées
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      // Calculer le ratio de compression nécessaire
      const compressionRatio = maxSizeBytes / file.size;
      const targetQuality = Math.min(0.9, Math.max(0.3, compressionRatio));

      console.log(`Compression nécessaire: ${(compressionRatio * 100).toFixed(1)}%`);
      console.log(`Qualité cible: ${(targetQuality * 100).toFixed(1)}%`);

      // Pour une vraie compression, vous devriez utiliser une librairie comme FFmpeg.wasm
      // Ici on retourne le fichier original avec un avertissement
      console.warn('Compression vidéo non implémentée - nécessite FFmpeg.wasm ou service externe');

      // Option: Afficher un message à l'utilisateur
      alert(`La vidéo ${file.name} fait ${(file.size / (1024 * 1024)).toFixed(1)}MB.
             Sur le plan gratuit Cloudinary, la limite est de 100MB.
             Veuillez compresser la vidéo avant upload ou passer au plan Plus.`);

      URL.revokeObjectURL(video.src);
      resolve(file); // Retourne le fichier original
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Erreur lors du chargement de la vidéo'));
    };
  });
};

/**
 * Obtenir les informations sur la taille du fichier
 */
export const getFileSizeInfo = (file) => {
  const sizeMB = file.size / (1024 * 1024);
  const isOverLimit = sizeMB > 100;

  return {
    sizeMB: sizeMB.toFixed(2),
    isOverLimit,
    message: isOverLimit
      ? `⚠️ Fichier trop volumineux (${sizeMB.toFixed(1)}MB). Limite: 100MB sur plan gratuit.`
      : `✅ Taille acceptable (${sizeMB.toFixed(1)}MB)`
  };
};

/**
 * Suggestions de compression pour l'utilisateur
 */
export const getCompressionSuggestions = (sizeMB) => {
  if (sizeMB <= 100) return null;

  const reductionNeeded = ((sizeMB - 95) / sizeMB * 100).toFixed(0);

  return {
    reductionPercentage: reductionNeeded,
    suggestions: [
      '📹 Utiliser HandBrake (gratuit) pour compresser la vidéo',
      '🎬 Réduire la résolution (ex: 1080p → 720p)',
      '⚙️ Diminuer le bitrate vidéo',
      '✂️ Couper les parties inutiles',
      '🎯 Format recommandé: MP4 H.264 avec audio AAC'
    ],
    tools: [
      { name: 'HandBrake', url: 'https://handbrake.fr/', description: 'Outil gratuit de compression vidéo' },
      { name: 'CloudConvert', url: 'https://cloudconvert.com/', description: 'Service en ligne de conversion' },
      { name: 'FFmpeg', url: 'https://ffmpeg.org/', description: 'Outil en ligne de commande puissant' }
    ]
  };
};