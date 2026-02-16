/* eslint-disable no-debugger */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import{ useRef, useState } from 'react';
import axios from "axios";
import styled from 'styled-components';

export const DropZone = ({ name, type, id, setImage }) => {
  const [active, setActive] = useState(false);
  const [dropzoneFile, setDropzoneFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Configuración para Hostinger
  const HOSTINGER_UPLOAD_URL = 'https://gavicinmobiliaria.com/upload.php';
  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setErrorMessage('Formato no válido. Use JPEG, PNG, GIF o WEBP.');
      return;
    }

    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus('error');
      setErrorMessage(`Archivo demasiado grande. Máximo permitido: ${MAX_FILE_SIZE/1024/1024}MB`);
      return;
    }

    setDropzoneFile(file);
    setUploadStatus('idle');
    setErrorMessage('');
    uploadToHostinger(file);
  };

  const uploadToHostinger = async (file) => {

      // Detectar entorno
  const isProduction = import.meta.env.MODE === 'production';

  // URLs según entorno
  const UPLOAD_URL = isProduction
    ? import.meta.env.VITE_APP_API_HOSTINGER_UPLOAD_URL // producción
    : import.meta.env.VITE_APP_API_UPLOAD_IMAGE_PROPERTIES_URL; // desarrollo

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadStatus('uploading');
      setUploadProgress(0);

      const response = await axios.post(
        UPLOAD_URL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data && response.data.success && response.data.imageUrl) {
        setImage(response.data.imageUrl);
        console.log(response.data.imageUrl);
        setUploadStatus('success');
      } else {
        throw new Error(response.data.error || 'Error en la subida');
      }
    } catch (error) {
      console.error('Error al subir a Hostinger:', error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.error || error.message || 'Error al subir la imagen');
      setDropzoneFile(null);
    }
  };

  const handleRemoveImage = () => {
    setDropzoneFile(null);
    setImage(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <ZoneDrop>
      <div className={`dropzone-container ${active ? 'active' : ''}`}>
        <div
          className="dropzone-area"
          onDragEnter={handleDragEvents}
          onDragLeave={handleDragEvents}
          onDragOver={handleDragEvents}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            name={name}
            className="file-input"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {!dropzoneFile ? (
            <div className="dropzone-content">
              <div className="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="dropzone-text">
                Arrastra y suelta tu imagen aquí o haz clic para seleccionarla
              </p>
              <p className="dropzone-hint">
                Formatos soportados: JPEG, PNG, GIF, WEBP (hasta 30MB)
              </p>
            </div>
          ) : (
            <div className="preview-container">
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(dropzoneFile)}
                  alt="Vista previa"
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {uploadStatus === 'uploading' && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          {uploadStatus === 'success' && (
            <div className="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>¡Imagen subida correctamente!</span>
            </div>
          )}
        </div>
      </div>
    </ZoneDrop>
  );
};

  const ZoneDrop = styled.div`
  .card-profile {
    display: grid;
    background-color: white;
    border-radius: 8px;
    &:not(:last-child) {
      margin-bottom: 24px;
    }
    &__border {
      display: grid;
      
      width: 100%;
      border: 1px dashed var(--bg-secondary);
      border-radius: 4px;
    }
    &__drag {
      display: grid;
      place-items: center;
      padding: 8px;
      width: 100%;
      
  
      @media (max-width: 460px) {
        width: 90%;
      }
    }
    &__input {
      display: none;
    }
    &__title {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      text-align: center;
    }
    &__upload {
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: center;
      color: black;

      strong{
        font-weight: 700;
      }
    }
  }
  
  .active-dropzone {
    background-color: rgba(51, 106, 179, 0.05);
  }
  
  .file-info {
    gap: 4px;
    display: grid;
    text-align: center;
    margin-top: 6px;
    color: black;
  }
  .selected-image{
    position: relative;
    width: 15%;
    margin: auto;
    img{
      width: 100%;
    }
  }
  .group{
    display: grid;
    position: relative;
    width: 100%;
    text-align  : center;
    gap: 10px;

    p{
      color: green;
    }
  }
  .remove-btn{
    width: fit-content;
    height: fit-content;
    display: grid;
    z-index: 100a;
    position: absolute;
    place-content: center;
    border: 1px solid red;
    background-color: white;
    padding: 2px 5px;
    font-size: 10px;
    font-weight: 300;
    color: red;
    pad: 0;
    top: 5px;
    right: 5px;
  }
  .error-message{
    color: red;
  }

  // nuevo estilo 
  .dropzone-container {
  width: 100%;
  margin: 20px 0;
}

.dropzone-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropzone-area.active {
  border-color: #4CAF50;
  background-color: #f8f8f8;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  color: #666;
  margin-bottom: 10px;
}

.dropzone-text {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.dropzone-hint {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.preview-container {
  width: 50%;
  margin: 0 auto;
}

.image-preview {
  position: relative;
}

.preview-image {
  max-width: 100%;
  max-height: 150px;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-container {
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-bar {
  height: 6px;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.success-message, .error-message {
  margin: auto;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  svg{
    margin: auto;
  }
}
  `