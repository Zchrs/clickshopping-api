import axios from 'axios';
import { types } from '../types/types';

export const addToWishList = (product) => async (dispatch, getState) => {
  try {
    const { auth } = getState(); // Get auth state
    const token = auth.token; // Assuming you store the token in auth state

    dispatch({ type: types.ADD_TO_WISHLIST });

    const response = await axios.post(import.meta.env.VITE_APP_API_POST_CART_URL, {
      productId: product.id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: types.ADD_TO_WISHLIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.ADD_TO_WISHLIST_FAIL,
      payload: error.response ? error.response.data : { message: 'Server Error' },
    });
  }
};

export const fetchWishlistUser = async (user_id) => {
  try {
    // Validar que user_id sea una cadena no vacía
    if (typeof user_id !== 'string' || user_id.trim() === '') {
      throw new Error('Invalid user_id');
    }

    // Realizar la solicitud GET al servidor backend
    const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_WISHLIST_URL}/${user_id}`, {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    });

    // Asumir que la respuesta tiene una estructura { data: { cartItems: [...] } }
    const wishlistItems = response.data;
    return wishlistItems;
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw error;
  }
};

export const moveFromWishlistToCart = (productId) => async (dispatch, getState) => {
  const { id: userId } = getState().auth.user;

  try {
    // Llamada a la API para mover el producto de la lista de deseos al carrito
    await axios.post(`${import.meta.env.VITE_APP_API_MOVE_TO_CART_URL}/${userId}`, {
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

// export const removeFromWishlist = (productId) => ({
//   type: types.REMOVE_FROM_WISHLIST,
//   payload: productId,
// });
export const removeFromWishlist = (productId) => async (dispatch, getState) => {
  const { id: userId } = getState().auth.user;
 
  try {
    // Llamada a la API para eliminar el producto del carrito
    await axios.delete(`${import.meta.env.VITE_APP_API_DELETE_WISHLIST_URL}/${productId}`, {
      data: { user_id: userId, product_id: productId }
    });

    // Despachar la acción para actualizar el estado en Redux
    dispatch({
      type: types.REMOVE_FROM_WISHLIST,
      payload: productId,
    });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
};

export const clearWishlist = () => ({
  type: types.CLEAR_WISHLIST,
});