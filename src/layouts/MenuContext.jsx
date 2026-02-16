/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

// Creamos un contexto
const MenuContext = createContext();

// Un componente proveedor que contendrá el estado del menú y la función showMenu
export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState(false);

  const showMenu = () => {
    setMenu(!menu);
  };

  // Proporcionamos el estado y la función como valor del contexto
  return (
    <MenuContext.Provider value={{ menu, showMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Un hook personalizado para consumir el contexto
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu debe ser utilizado dentro de un MenuProvider');
  }
  return context;
};