/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { getFile } from '../../reducers/globalReducer';

const AddToCart = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_POST_CART_URL}${ productId, quantity }`);
      console.log(response.data); // Manejar la respuesta según sea necesario
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      // Manejar el error
    }
  };

  const handleChangeQuantity = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <div>
      <input type="number" value={quantity} onChange={handleChangeQuantity} />
      <button onClick={addToCart}>
      <img
            loading="lazy"
            src={getFile("svg", `addcart-red`, "svg")}
            alt=""
          />
        <p>Agregar al carrito</p>
        </button>
    </div>
  );
};

export default AddToCart;
