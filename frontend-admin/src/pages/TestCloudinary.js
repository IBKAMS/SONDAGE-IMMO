import React, { useState } from 'react';
import './TestCloudinary.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function TestCloudinary() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setStatus(`Fichier sélectionné: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`);
    setError('');
    setResult(null);
  };

  const testUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setStatus('Obtention de la signature...');
    setError('');
    setProgress(0);

    try {
      // 1. Obtenir la signature du backend
      const signatureResponse = await fetch(`${API_URL}/api/upload/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!signatureResponse.ok) {
        throw new Error(`Erreur signature: ${signatureResponse.statusText}`);
      }

      const signatureData = await signatureResponse.json();
      console.log('Signature reçue:', signatureData);

      const { signature, timestamp, cloudName, apiKey, folder } = signatureData;

      setStatus('Upload vers Cloudinary...');

      // 2. Upload vers Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);
      // resource_type n'est PAS inclus dans la signature, donc on ne l'envoie pas

      // Log tous les paramètres
      console.log('Paramètres upload:', {
        fileName: file.name,
        fileSize: file.size,
        apiKey,
        timestamp,
        signature,
        folder,
        cloudName
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
          setStatus(`Upload en cours: ${Math.round(percentComplete)}%`);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Réponse brute:', xhr.responseText);
        console.log('Status:', xhr.status);

        try {
          const response = JSON.parse(xhr.responseText);

          if (xhr.status === 200 || xhr.status === 201) {
            setStatus('✅ Upload réussi!');
            setResult(response);
            console.log('Upload réussi:', response);
          } else {
            setError(`Erreur Cloudinary (${xhr.status}): ${JSON.stringify(response)}`);
            console.error('Erreur Cloudinary:', response);
          }
        } catch (e) {
          setError(`Erreur parsing: ${xhr.responseText}`);
          console.error('Erreur parsing:', e);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Erreur réseau lors de l\'upload');
        console.error('Erreur réseau');
      });

      // URL Cloudinary pour upload
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      console.log('URL upload:', uploadUrl);

      xhr.open('POST', uploadUrl);
      xhr.send(formData);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setStatus('❌ Échec de l\'upload');
    }
  };

  const testSimpleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setStatus('Test upload sans signature...');
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Preset non signé par défaut

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
          setStatus(`Upload en cours: ${Math.round(percentComplete)}%`);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('Réponse brute (non signé):', xhr.responseText);
        console.log('Status:', xhr.status);

        try {
          const response = JSON.parse(xhr.responseText);

          if (xhr.status === 200 || xhr.status === 201) {
            setStatus('✅ Upload non signé réussi!');
            setResult(response);
            console.log('Upload non signé réussi:', response);
          } else {
            setError(`Erreur Cloudinary non signé (${xhr.status}): ${JSON.stringify(response)}`);
            console.error('Erreur Cloudinary non signé:', response);
          }
        } catch (e) {
          setError(`Erreur parsing: ${xhr.responseText}`);
          console.error('Erreur parsing:', e);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Erreur réseau lors de l\'upload non signé');
        console.error('Erreur réseau');
      });

      // URL Cloudinary pour upload non signé
      const uploadUrl = `https://api.cloudinary.com/v1_1/dsmxeiwzq/video/upload`;
      console.log('URL upload non signé:', uploadUrl);

      xhr.open('POST', uploadUrl);
      xhr.send(formData);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setStatus('❌ Échec de l\'upload non signé');
    }
  };

  return (
    <div className="test-cloudinary">
      <h1>Test Upload Cloudinary</h1>

      <div className="test-section">
        <h2>1. Sélectionner un fichier</h2>
        <input
          type="file"
          accept="video/*,image/*"
          onChange={handleFileSelect}
        />
      </div>

      {file && (
        <>
          <div className="test-section">
            <h2>2. Tester l'upload</h2>
            <button onClick={testUpload} className="btn-test">
              Test Upload Signé
            </button>
            <button onClick={testSimpleUpload} className="btn-test btn-secondary">
              Test Upload Non Signé
            </button>
          </div>

          {progress > 0 && (
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          )}

          {status && (
            <div className="status-section">
              <h3>Status:</h3>
              <p>{status}</p>
            </div>
          )}

          {error && (
            <div className="error-section">
              <h3>Erreur:</h3>
              <pre>{error}</pre>
            </div>
          )}

          {result && (
            <div className="result-section">
              <h3>Résultat:</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre>
              {result.secure_url && (
                <div>
                  <h4>URL:</h4>
                  <a href={result.secure_url} target="_blank" rel="noopener noreferrer">
                    {result.secure_url}
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="info-section">
        <h3>Informations de configuration:</h3>
        <ul>
          <li>Cloud Name: dsmxeiwzq</li>
          <li>API Key: 531126836319942</li>
          <li>Backend URL: {API_URL}</li>
        </ul>
        <p>Ouvrez la console du navigateur pour voir les logs détaillés.</p>
      </div>
    </div>
  );
}

export default TestCloudinary;