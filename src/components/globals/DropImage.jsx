import { useState } from 'react';

export const DropImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Aquí puedes enviar la imagen al servidor o realizar otras acciones
    if (selectedFile) {
      console.log('Subiendo archivo:', selectedFile);
      // Aquí puedes usar fetch o Axios para enviar la imagen al servidor
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir imagen</button>
      {selectedFile && (
        <div>
          <p>Nombre del archivo: {selectedFile.name}</p>
          <p>Tamaño del archivo: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
        </div>
      )}
    </div>
  );
};