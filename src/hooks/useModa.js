import { useState } from "react"

useState
export const useModal = () =>{
    const [modal, setModal] = useState(false);
    const handleOpenModal = () => {
      
        setModal(true);
      };
  
      const handleCloseModal = () => {
        setModal(false);
      };
    return{
        modal
    }
}