// hooks/useClipboard.js
import { useState } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error al copiar:', error);
      
      // Fallback para navegadores antiguos
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return true;
      } catch (fallbackError) {
        console.error('Error con fallback:', fallbackError);
        return false;
      }
    }
  };

  return { copied, copyToClipboard };
};