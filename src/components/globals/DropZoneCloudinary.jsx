/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BaseButton } from "./BaseButton";

export const DropZoneCloudinary = ({ id, setImage, name, paymentProof }) => {
  const [active, setActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 30 * 1024 * 1024;

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActive(false);
    if (e.dataTransfer.files?.length) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      validateFile(e.target.files[0]);
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setUploadStatus("error");
      setErrorMessage("Formato inválido (JPEG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadStatus("error");
      setErrorMessage("El archivo supera los 30MB");
      return;
    }

    setFile(file);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  const uploadToCloudinary = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          },
        }
      );

      const imageData = {
        url: res.data.secure_url,
        public_id: res.data.public_id,
      };

      setImage(imageData);
      setUploadStatus("success");
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      setErrorMessage("Error al subir imagen");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    setImage(null);
    setUploadStatus("idle");
    setUploadProgress(0);
  };

  return (
    <DropzoneWrapper>
      <div className={`dropzone ${active ? "active" : ""}`}>
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
            style={{ display: "none" }}
          />

          {!file ? (
            <div className="dropzone-content">
              <div className="upload-icon">⬆️</div>
              <p className="dropzone-text">
                Arrastra una imagen aquí o haz clic para seleccionarla
              </p>
              <p className="dropzone-hint">
                JPEG, PNG, GIF, WEBP (máx. 30MB)
              </p>
            </div>
          ) : (
            <div className="preview-container">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="preview-image"
              />
              <button
                type="button"
                className="remove-button"
                onClick={handleRemove}
              >
                ×
              </button>
            </div>
          )}

          {uploadStatus === "uploading" && (
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="error-message">
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="success-message">
              <span>¡Imagen subida correctamente!</span>
            </div>
          )}
        </div>

        {/* ✅ BOTÓN FUERA DEL DROPZONE */}
{  paymentProof &&      <BaseButton
          textLabel
          label="Enviar comprobante de pago"
          icon="check"
          disabled={!file || uploadStatus === "uploading"}
          onClick={uploadToCloudinary}
          classs={"button primary"}
          colorbtn={"var(--primary)"}
          colortextbtnprimary={"var(--light)"}
          colorbtnhoverprimary={"var(--primary-semi)"}
          colortextbtnhoverprimary={"white"}
        />}
      </div>
    </DropzoneWrapper>
  );
};


const DropzoneWrapper = styled.div`

  width: 100%;

  .dropzone {
    display: grid;
gap: 10px;
    width: 100%;
  }

  .dropzone-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 25px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .dropzone-area.active {
    border-color: var(--primary);
    background-color: #f9f9f9;
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
    font-size: 15px;
  }

  .dropzone-hint {
    margin: 0;
    color: #777;
    font-size: 13px;
  }

  .preview-container {
    position: relative;
    width: 140px;
    height: 140px;
    margin: auto;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #eee;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 14px;
    cursor: pointer;
    display: grid;
    place-items: center;
  }

  .progress-container {
    width: 100%;
    background: #eee;
    border-radius: 4px;
    margin-top: 12px;
    overflow: hidden;
  }

  .progress-bar {
    height: 6px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .progress-text {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: #666;
  }

  .success-message {
    margin-top: 10px;
    font-size: 13px;
    color: #2e7d32;
  }

  .error-message {
    margin-top: 10px;
    font-size: 13px;
    color: #c62828;
  }
`;