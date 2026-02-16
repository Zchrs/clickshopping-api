
/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import styled from "styled-components";
import { IKUpload } from "imagekitio-react";

export const MultiDropZoneImageKit = ({ id, setImages, name }) => {
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const isProduction = import.meta.env.PROD;

  const MAX_FILES = 6;
  const MAX_FILE_SIZE = 30 * 1024 * 1024;

  /* ─────────────── Drag & Drop ─────────────── */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActive(false);
    validateFiles(Array.from(e.dataTransfer.files));
  };

  const handleChange = (e) => {
    validateFiles(Array.from(e.target.files));
  };

  /* ─────────────── Validación ─────────────── */
  const validateFiles = (files) => {
    const valid = files
      .slice(0, MAX_FILES)
      .filter(
        f =>
          f.type.startsWith("image/") &&
          f.size <= MAX_FILE_SIZE
      );

    if (!valid.length) {
      setError("Imágenes inválidas (máx 30MB)");
      return;
    }

    setError("");
    setFiles(valid);
    setStatus("uploading");

    if (!isProduction) {
      uploadLocal(valid);
    }
  };

  /* ─────────────── LOCAL UPLOAD ─────────────── */
  const uploadLocal = async (files) => {
    const formData = new FormData();
    files.forEach(f => formData.append("img_url", f));

    const res = await fetch(
      import.meta.env.VITE_APP_API_UPLOAD_IMAGES_PRODUCTS_URL,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setImages(data.imageUrls);
    setStatus("success");
  };

  /* ─────────────── ImageKit SUCCESS ─────────────── */
  const handleSuccess = (res) => {
    setImages(prev => [...(prev || []), res.url]);
    setStatus("success");
  };

  const handleError = () => {
    setError("Error subiendo imagen");
    setStatus("error");
  };

  return (
    <MultiDropzone>
      <div
        className={`multi-dropzone-area ${active ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept="image/*"
          id={id}
          name={name}
          onChange={handleChange}
        />

        {files.length === 0 ? (
          <p>Arrastra hasta {MAX_FILES} imágenes o haz clic</p>
        ) : (
          <div className="preview-grid">
            {files.map((f, i) => (
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt="preview"
                className="preview-image"
              />
            ))}
          </div>
        )}

        {status === "uploading" && (
          <div className="progress-bar">
            Subiendo… {progress}%
          </div>
        )}

        {status === "success" && (
          <div className="success">✔ Imágenes subidas</div>
        )}

        {error && <div className="error">{error}</div>}

        {/* ───── ImageKit Uploads ───── */}
        {isProduction &&
          files.map((file, i) => (
            <IKUpload
              key={i}
              file={file}
              fileName={`${Date.now()}-${file.name}`}
              folder="/uploads"
              useUniqueFileName
              isPrivateFile={false}
              onSuccess={handleSuccess}
              onError={handleError}
              onUploadProgress={(p) =>
                setProgress(Math.round((p.loaded / p.total) * 100))
              }
            />
          ))}
      </div>
    </MultiDropzone>
  );
};

 


  
  const MultiDropzone = styled.div`
  display: grid;
    .multidropzone {
    background-color: white;
    border-radius: 8px;
    border: 1px dashed var(--bg-secondary);
    
    &:not(:last-child) {
      margin-bottom: 24px;
    }
    &-group{
    position: relative;
    display: grid;
    width: 70%;
    gap: 10px;
    text-align  : center;
    place-items: center;
    margin: auto;

    p{
      color: green;
    }
  }
    &__drag {
      display: block;
      margin: 0 auto;
      padding: 16px;
      width: 100%;
  
      @media (max-width: 460px) {
        width: 90%;
      }
    }
    &__input {
      display: none;
      visibility: hidden;
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
  .image-preview{
    display: grid;
    position: relative;
    align-items: center;
    place-items: center;
    width: 100%;
    img{
      width: 100%;
    }
  }

  .flex-l{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    align-items: center;
    place-items: center;
    position: relative;
  }

  .remove-button{
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

  // estilo de nuevo diseño

  .multi-dropzone-container {
    display: grid;
  width: 100%;
  margin: 20px 0;
}

.multi-dropzone-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.multi-dropzone-area.active {
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

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  gap: 15px;
  width: 100%;
}

.image-preview-container {
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview {
  position: relative;
  padding-top: 100%; /* Aspect ratio 1:1 */
  background: #f5f5f5;
}

.preview-image {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 5px;
  right: 5px;
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

.file-info {
  padding: 8px;
  background: #f9f9f9;
  font-size: 12px;
}

.file-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
}

.file-size {
  color: #666;
}

.progress-container {
  width: 100%;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-bar {
  color: white;
  padding: 5px 0;
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
  margin-top: 15px;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.success {
  background: #e8f5e9;
  padding: 5px 0;
  color: #2e7d32;
    font-size: 16px;
  svg{
    margin: auto;
  }
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 5px 0;
  font-size: 16px;
}
  `