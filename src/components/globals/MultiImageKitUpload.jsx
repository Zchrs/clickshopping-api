/* eslint-disable react/prop-types */
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";
import { useRef, useState } from "react";

const MAX_FILES = 6;

const MultiImageKitUpload = ({ onUploaded }) => {
  const fileInputRef = useRef(null);
  const abortController = new AbortController();

  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  /* 🔐 Auth desde backend */
  const authenticator = async () => {
    const response = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
    if (!response.ok) {
      throw new Error("Error autenticando con ImageKit");
    }
    return response.json(); // { signature, expire, token, publicKey }
  };

  /* 📂 Selección de archivos */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} imágenes permitidas`);
      return;
    }

    setError("");
    setFiles(selectedFiles);
  };

  /* 🚀 Subida */
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Selecciona al menos una imagen");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const { signature, expire, token, publicKey } =
        await authenticator();

      const uploadedUrls = [];
      let completed = 0;

      for (const file of files) {
        const response = await upload({
          file,
          fileName: `${Date.now()}-${file.name}`,
          folder: "/uploads",
          signature,
          expire,
          token,
          publicKey,
          abortSignal: abortController.signal,
          onProgress: (evt) => {
            const percent =
              ((completed + evt.loaded / evt.total) / files.length) * 100;
            setProgress(Math.round(percent));
          },
        });

        uploadedUrls.push(response.url);
        completed++;
      }

      onUploaded?.(uploadedUrls);
      setFiles([]);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        setError("Subida cancelada");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError(error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError("Error de red");
      } else if (error instanceof ImageKitServerError) {
        setError("Error del servidor");
      } else {
        setError("Error inesperado al subir imágenes");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ border: "2px dashed #ccc", padding: 16 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{ width: "100%", height: 100, objectFit: "cover" }}
            />
          ))}
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: 10 }}>
          <progress value={progress} max={100} />
          <span> {progress}%</span>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: 12 }}
      >
        {uploading ? "Subiendo..." : "Subir imágenes"}
      </button>
    </div>
  );
};

export default MultiImageKitUpload  
