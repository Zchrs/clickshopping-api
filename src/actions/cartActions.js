/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import { types } from '../types/types';

export const addToCart = (product, quantity) => async (dispatch, getState) => {
  try {
    const { auth } = getState(); // Get auth state
    const token = auth.token; // Assuming you store the token in auth state

    dispatch({ type: types.ADD_TO_CART });

    const response = await axios.post(import.meta.env.VITE_APP_API_POST_CART_URL, {
      productId: product.id,
      quantity,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: types.ADD_TO_CART_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.ADD_TO_CART_FAIL,
      payload: error.response ? error.response.data : { message: 'Server Error' },
    });
  }
};

export const fetchCartUser = async (user_id) => {
  try {
    // Validar que user_id sea una cadena no vacía
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      throw new Error('Invalid user_id');
    }

    // Realizar la solicitud GET al servidor backend
    const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_CART_URL}/${user_id}`, {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    });

    // Asumir que la respuesta tiene una estructura { data: { cartItems: [...] } }
    const cartItems = response.data;
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Acción para eliminar un producto del carrito
export const removeFromCart = (productId) => async (dispatch, getState) => {
  const { id: userId } = getState().auth.user;
 
  try {
    // Llamada a la API para eliminar el producto del carrito
    await axios.delete(`${import.meta.env.VITE_APP_API_DELETE_CART_URL}/${productId}`, {
      data: { user_id: userId, product_id: productId }
    });

    // Despachar la acción para actualizar el estado en Redux
    dispatch({
      type: types.REMOVE_FROM_CART,
      payload: productId,
    });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
};

export const moveFromCartToWishlist = (productId) => async (dispatch, getState) => {
  const { id: userId } = getState().auth.user;

  try {
    // Llamada a la API para mover el producto del carrito a la lista de deseos
    await axios.post(`${import.meta.env.VITE_APP_API_MOVE_TO_WISHLIST_URL}/${productId}`, {
      user_id: userId,
      product_id: productId
    });

    // Despachar la acción para actualizar el estado en Redux
    dispatch({
      type: types.MOVE_FROM_WISHLIST_TO_CART,
      payload: productId,
    });
  } catch (error) {
    console.error('Error al mover el producto a la lista de deseos:', error);
  }
};


export const clearCart = () => ({
  type: types.CLEAR_CART,
});