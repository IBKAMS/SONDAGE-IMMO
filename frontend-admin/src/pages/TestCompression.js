import React, { useState, lazy, Suspense } from 'react';
import './TestCompression.css';

// Lazy loading du composant pour éviter les erreurs de build
const VideoUploadWithCompression = lazy(() => import('../components/VideoUploadWithCompression'));

const TestCompression = () => {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalCompressed: 0,
    totalSaved: 0
  });

  const handleUploadSuccess = (result) => {
    console.log('Upload réussi:', result);

    const newVideo = {
      id: Date.now(),
      url: result.url,
      name: result.name || 'Vidéo sans nom',
      uploadedAt: new Date().toLocaleString('fr-FR'),
      compressed: result.compressed || false,
      originalSize: result.originalSize || 0,
      compressedSize: result.compressedSize || 0
    };

    setUploadedVideos(prev => [newVideo, ...prev]);

    // Mettre à jour les statistiques
    setStats(prev => ({
      totalUploads: prev.totalUploads + 1,
      totalCompressed: prev.totalCompressed + (newVideo.compressed ? 1 : 0),
      totalSaved: prev.totalSaved + (newVideo.compressed ?
        (newVideo.originalSize - newVideo.compressedSize) : 0)
    }));
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="test-compression-page">
      <div className="header">
        <h1>🎬 Test de Compression Vidéo</h1>
        <p>Testez la compression automatique des vidéos avant upload vers Cloudinary</p>
      </div>

      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUploads}</div>
          <div className="stat-label">Vidéos uploadées</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCompressed}</div>
          <div className="stat-label">Vidéos compressées</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatSize(stats.totalSaved)}</div>
          <div className="stat-label">Espace économisé</div>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="upload-section">
        <h2>📤 Uploader une vidéo</h2>
        <div className="upload-info">
          <ul>
            <li>✅ Fichiers &lt; 95MB : Upload direct</li>
            <li>🗜️ Fichiers &gt; 95MB : Compression automatique proposée</li>
            <li>🎯 Compression optimisée : H.264, 720p, CRF adaptatif</li>
          </ul>
        </div>
        <Suspense fallback={<div>Chargement du module de compression...</div>}>
          <VideoUploadWithCompression
            type="presentation"
            onUploadSuccess={handleUploadSuccess}
          />
        </Suspense>
      </div>

      {/* Liste des vidéos uploadées */}
      {uploadedVideos.length > 0 && (
        <div className="videos-list">
          <h2>📹 Vidéos uploadées pendant cette session</h2>
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
                  {video.compressed && (
                    <div className="compression-badge">
                      🗜️ Compressé
                      <span className="size-info">
                        {formatSize(video.originalSize)} → {formatSize(video.compressedSize)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <h2>📖 Comment utiliser</h2>
        <ol>
          <li>Cliquez sur "Sélectionner une vidéo"</li>
          <li>Si le fichier fait plus de 95MB, vous verrez les options de compression</li>
          <li>Choisissez "Compresser automatiquement" pour réduire la taille</li>
          <li>La compression utilise FFmpeg.wasm directement dans votre navigateur</li>
          <li>Une fois compressé, le fichier est automatiquement uploadé vers Cloudinary</li>
        </ol>

        <h3>⚙️ Paramètres de compression</h3>
        <table className="compression-params">
          <thead>
            <tr>
              <th>Taille originale</th>
              <th>Résolution cible</th>
              <th>CRF</th>
              <th>Réduction estimée</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>100-150 MB</td>
              <td>720p</td>
              <td>25</td>
              <td>~30-40%</td>
            </tr>
            <tr>
              <td>150-250 MB</td>
              <td>720p</td>
              <td>27</td>
              <td>~40-50%</td>
            </tr>
            <tr>
              <td>250-500 MB</td>
              <td>540p</td>
              <td>30</td>
              <td>~50-70%</td>
            </tr>
            <tr>
              <td>&gt; 500 MB</td>
              <td>480p</td>
              <td>35</td>
              <td>~70-85%</td>
            </tr>
          </tbody>
        </table>

        <div className="warning-box">
          <h3>⚠️ Important</h3>
          <ul>
            <li>La compression peut prendre plusieurs minutes selon la taille du fichier</li>
            <li>Ne fermez pas la fenêtre pendant la compression</li>
            <li>La compression utilise les ressources de votre ordinateur</li>
            <li>Pour de meilleures performances, utilisez Chrome ou Firefox récent</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestCompression;