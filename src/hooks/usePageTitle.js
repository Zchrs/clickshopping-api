import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    switch (path) {
      case "/":
        document.title = "Inicio | Mi App";
        break;
      case "/contacto":
        document.title = "Contacto | Mi App";
        break;
      default:
        document.title = "Mi App";
    }
  }, [location]);
};