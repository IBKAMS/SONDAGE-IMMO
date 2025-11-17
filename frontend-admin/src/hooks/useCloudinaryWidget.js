import { useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const useCloudinaryWidget = () => {
  const openWidget = useCallback((type, onSuccess, onError) => {
    // Vérifier que le widget est disponible
    if (!window.cloudinary) {
      console.error('Widget Cloudinary non chargé');
      onError && onError(new Error('Widget Cloudinary non disponible'));
      return;
    }

    // Obtenir la signature du backend
    fetch(`${API_URL}/api/upload/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(signatureData => {
      const { signature, timestamp, apiKey, folder, source } = signatureData;

      // Configuration du widget
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dsmxeiwzq',
          apiKey: apiKey,
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder: folder,
          resourceType: 'video',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 1000000000, // 1GB max
          clientAllowedFormats: ['video', 'image'],
          maxChunkSize: 20000000, // 20MB chunks
          showPoweredBy: false,
          showAdvancedOptions: false,
          showCompletedButton: true,
          showUploadMoreButton: false,
          singleUploadAutoClose: true,
          language: 'fr',
          text: {
            fr: {
              or: 'Ou',
              back: 'Retour',
              advanced: 'Avancé',
              close: 'Fermer',
              no_results: 'Aucun résultat',
              search_placeholder: 'Rechercher des fichiers',
              about_uw: 'À propos du widget',
              menu: {
                files: 'Mes fichiers',
                web: 'Adresse web',
                camera: 'Caméra',
                gsearch: 'Recherche',
                gdrive: 'Google Drive',
                dropbox: 'Dropbox',
                facebook: 'Facebook',
                instagram: 'Instagram'
              },
              selection_counter: {
                selected: 'Sélectionné'
              },
              actions: {
                upload: 'Téléverser',
                clear_all: 'Tout effacer',
                log_out: 'Déconnexion'
              },
              notifications: {
                general_error: 'Une erreur s\'est produite.',
                general_prompt: 'Êtes-vous sûr?',
                limit_reached: 'Plus aucun fichier ne peut être sélectionné.',
                invalid_add_url: 'L\'URL doit être valide.',
                invalid_public_id: 'L\'ID public ne peut pas contenir \\,,&,#,%,<,>.',
                no_new_files: 'Les fichiers ont déjà été téléversés.',
                image_purchased: 'Image achetée',
                video_purchased: 'Vidéo achetée',
                purchase_failed: 'Échec de l\'achat. Veuillez réessayer.',
                service_logged_out: 'Service déconnecté en raison de l\'inactivité',
                great: 'Super',
                image_acquired: 'Image acquise',
                video_acquired: 'Vidéo acquise',
                acquisition_failed: 'Échec de l\'acquisition. Veuillez réessayer.'
              },
              uploader: {
                filesize: {
                  na: 'N/A',
                  b: '{{size}} octets',
                  k: '{{size}} Ko',
                  m: '{{size}} Mo',
                  g: '{{size}} Go',
                  t: '{{size}} To'
                },
                errors: {
                  file_too_large: 'La taille du fichier ({{size}}) dépasse le maximum autorisé ({{allowed}})',
                  max_dimensions_validation: 'Les dimensions de l\'image ({{width}}x{{height}}) dépassent le maximum autorisé',
                  min_dimensions_validation: 'Les dimensions de l\'image ({{width}}x{{height}}) sont inférieures au minimum requis',
                  unavailable: 'NA',
                  max_number_of_files: 'Nombre maximum de fichiers dépassé',
                  allowed_formats: 'Format de fichier non autorisé',
                  max_file_size: 'Le fichier est trop volumineux',
                  min_file_size: 'Le fichier est trop petit'
                },
                close_mid_upload: 'Il y a des téléversements en cours. Êtes-vous sûr de vouloir fermer?',
                plus: {
                  title: 'Sélectionnez les fichiers à téléverser',
                  main_title: 'Glissez les fichiers ici ou',
                  main_subtitle: 'sélectionnez sur votre ordinateur',
                  footer_title: 'Taille totale: {{size}}'
                },
                uploading: {
                  title: 'Téléversement en cours...',
                  title_uploading_with_counter: 'Téléversement {{current}} sur {{total}}...',
                  title_processing: 'Traitement {{current}} sur {{total}}...',
                  title_uploading_processing: '{{processing}} traité, {{uploading}} en téléversement...',
                  title_processing_with_counter: 'Traitement {{current}} sur {{total}}...',
                  title_uploading: 'Téléversement en cours...',
                  in_parallel: 'fichiers en parallèle'
                },
                uploaded: {
                  title: 'Téléversement terminé',
                  subtitle: 'Pour continuer, cliquez sur Terminé'
                },
                failed: {
                  title: 'Téléversement échoué'
                },
                errors_dialog: {
                  title: 'Erreurs de téléversement'
                }
              }
            }
          },
          styles: {
            palette: {
              window: '#FFF',
              windowBorder: '#90A0B3',
              tabIcon: '#4F46E5',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#4F46E5',
              action: '#4F46E5',
              inactiveTabIcon: '#90A0B3',
              error: '#F44235',
              inProgress: '#4F46E5',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          }
        },
        (error, result) => {
          if (error) {
            console.error('Erreur widget:', error);
            onError && onError(error);
          } else if (result && result.event === 'success') {
            console.log('Upload réussi via widget:', result.info);

            // Sauvegarder dans MongoDB
            fetch(`${API_URL}/api/videos/save-direct`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: type,
                cloudinaryUrl: result.info.secure_url,
                cloudinaryId: result.info.public_id,
                originalName: result.info.original_filename,
                size: result.info.bytes
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                onSuccess && onSuccess({
                  url: result.info.secure_url,
                  name: result.info.original_filename
                });
              } else {
                throw new Error(data.message || 'Erreur de sauvegarde');
              }
            })
            .catch(err => {
              console.error('Erreur sauvegarde MongoDB:', err);
              onError && onError(err);
            });
          } else if (result && result.event === 'close') {
            console.log('Widget fermé');
          }
        }
      );

      // Ouvrir le widget
      widget.open();
    })
    .catch(err => {
      console.error('Erreur obtention signature:', err);
      onError && onError(err);
    });
  }, []);

  return { openWidget };
};

export default useCloudinaryWidget;