import React, { useState } from 'react';
import { useCloudinaryWidget } from '../hooks/useCloudinaryWidget';
import './TestCompression.css';

const TestCompressionSimple = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const { openWidget } = useCloudinaryWidget();

  const handleUpload = () => {
    openWidget(
      'presentation',
      (result) => {
        console.log('Upload réussi:', result);
        const newVideo = {
          id: Date.now(),
          url: result.url,
          name: result.name || 'Vidéo uploadée',
          uploadedAt: new Date().toLocaleString('fr-FR')
        };
        setUploadedVideos(prev => [newVideo, ...prev]);
      },
      (error) => {
        console.error('Erreur upload:', error);
        alert(`Erreur lors de l'upload: ${error.message}`);
      }
    );
  };

  return (
    <div className="test-compression-page">
      <div className="header">
        <h1>📹 Test Upload Vidéo (Version Simple)</h1>
        <p>Upload direct vers Cloudinary - Limite 100MB</p>
      </div>

      <div className="upload-section">
        <h2>Upload Vidéo</h2>
        <div className="upload-info">
          <ul>
            <li>⚠️ Limite : 100MB (plan gratuit Cloudinary)</li>
            <li>📝 Pour des fichiers plus gros, compressez d'abord avec HandBrake</li>
            <li>✅ Formats supportés : MP4, MOV, AVI, etc.</li>
          </ul>
        </div>

        <button
          onClick={handleUpload}
          className="upload-btn"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          📤 Sélectionner et uploader une vidéo
        </button>
      </div>

      {uploadedVideos.length > 0 && (
        <div className="videos-list">
          <h2>Vidéos uploadées</h2>
          <div className="videos-grid">
            {uploadedVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-preview">
                  <video
                    src={video.url}
                    controls
                    width="100%"
                    height="200"
                  />
                </div>
                <div className="video-info">
                  <h3>{video.name}</h3>
                  <p className="upload-time">Uploadé le {video.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="instructions">
        <h2>💡 Compression manuelle recommandée</h2>
        <p>Pour les vidéos de plus de 100MB, utilisez ces outils avant l'upload :</p>
        <ul>
          <li><strong>HandBrake</strong> (https://handbrake.fr/) - Gratuit et efficace</li>
          <li><strong>FFmpeg</strong> : <code>ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 28 output.mp4</code></li>
          <li><strong>CloudConvert</strong> (https://cloudconvert.com/) - En ligne</li>
        </ul>

        <h3>Paramètres recommandés pour compression :</h3>
        <ul>
          <li>Format : MP4 (H.264 + AAC)</li>
          <li>Résolution : 720p maximum</li>
          <li>Bitrate : 2-3 Mbps pour 720p</li>
          <li>CRF : 25-30 (plus élevé = plus de compression)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestCompressionSimple;