import { useState, useEffect } from 'react';

export const ScreenResolution = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
  
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);
  
      // Limpia el listener del evento al desmontar el componente
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []); // Este efecto se ejecutará solo al montar y desmontar el componente
  
    return (
      <div>
        <h3 style={{color: "black"}}>Resolución de pantalla:</h3>
        <p style={{color: "black"}}>Ancho: {width}px</p>
        <p style={{color: "black"}}>Alto: {height}px</p>
      </div>
    );
  };
  
