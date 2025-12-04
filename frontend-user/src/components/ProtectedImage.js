import React from 'react';
import './ProtectedImage.css';

/**
 * Composant d'image protégée avec overlay transparent et filigrane optionnel
 *
 * Utilisation :
 * <ProtectedImage src={imageUrl} alt="Description" className="my-class" />
 * <ProtectedImage src={imageUrl} alt="Description" watermark={true} />
 * <ProtectedImage src={imageUrl} alt="Description" watermark="pattern" />
 * <ProtectedImage src={imageUrl} alt="Description" watermark="subtle" />
 *
 * Props :
 * - src: URL de l'image
 * - alt: Texte alternatif
 * - className: Classes CSS additionnelles
 * - watermark: boolean ou string ('pattern', 'subtle') pour afficher le filigrane
 * - onError: Fonction appelée en cas d'erreur de chargement
 * - ...rest: Autres props passées à l'image
 */
const ProtectedImage = ({
  src,
  alt,
  className = '',
  watermark = false,
  onError,
  style,
  ...rest
}) => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  // Déterminer la classe de filigrane
  const getWatermarkClass = () => {
    if (!watermark) return '';
    if (watermark === 'pattern') return 'watermarked-pattern';
    if (watermark === 'subtle') return 'watermarked-subtle';
    return 'watermarked';
  };

  return (
    <div className={`protected-media ${getWatermarkClass()} ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        draggable={false}
        onError={onError}
        {...rest}
      />
      <div
        className="media-overlay"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />
    </div>
  );
};

export default ProtectedImage;
