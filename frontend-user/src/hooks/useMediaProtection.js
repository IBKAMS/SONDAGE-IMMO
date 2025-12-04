import { useEffect } from 'react';

/**
 * Hook personnalisé pour protéger les médias (images et vidéos) contre le téléchargement
 *
 * Fonctionnalités :
 * - Désactive le clic droit sur les images et vidéos
 * - Empêche le glisser-déposer (drag & drop)
 * - Ajoute les attributs de protection aux vidéos
 */
const useMediaProtection = () => {
  useEffect(() => {
    // Fonction pour désactiver le menu contextuel
    const handleContextMenu = (e) => {
      const target = e.target;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'VIDEO' ||
        target.closest('.protected-media') ||
        target.closest('.media-overlay')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Fonction pour empêcher le drag & drop
    const handleDragStart = (e) => {
      const target = e.target;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    // Fonction pour configurer les vidéos
    const configureVideos = () => {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        // Ajouter controlsList pour retirer le bouton de téléchargement
        video.setAttribute('controlsList', 'nodownload noplaybackrate');
        // Désactiver Picture-in-Picture
        video.setAttribute('disablePictureInPicture', 'true');
        // Empêcher le clic droit sur la vidéo
        video.oncontextmenu = (e) => {
          e.preventDefault();
          return false;
        };
      });
    };

    // Ajouter les event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    // Configurer les vidéos existantes
    configureVideos();

    // Observer pour les nouvelles vidéos ajoutées dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          configureVideos();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      observer.disconnect();
    };
  }, []);
};

export default useMediaProtection;
