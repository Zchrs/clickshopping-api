/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import axios from "axios";
import { types } from "../types/types";
import { io } from "socket.io-client";


export const setProduct = (productInfo) => {
    return {
      type: types.productView,
      payload: Array.isArray(productInfo) ? productInfo : [],
    };
  };

export const clearProduct = (productInfo) => {
    return {
      type: types.REMOVE_PRODUCT,
      payload: Array.isArray(productInfo) ? productInfo : [],
    };
  };

  export const storagedProduct = (productInfo) => ({
    type: types.STORAGED_PRODUCT,
    payload: Array.isArray(productInfo) ? productInfo : [],
  });
  
  export const selectedProduct = (productInfo) => ({
    type: types.SELECTED_PRODUCT,
    payload: productInfo,
  });
  
  export const updateProduct = (productInfo) => ({
    type: types.UPDATE_PRODUCT,
    payload: Array.isArray(productInfo) ? productInfo : [],
  });

  export const setRatings = (ratings) => ({
    type: types.SET_RATINGS,
    payload: ratings,
  });




  export const fetchSoldProducts = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_APP_API_GET_SOLD_PRODUCTS_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos vendidos:', error);
      throw error;
    }
  };

  export const fetchProducts = () => async (dispatch) => {
    try {

        // Consultar la base de datos si no hay productos en localStorage o si el array está vacío
        const response = await axios.get(import.meta.env.VITE_APP_API_GET_PRODUCTS_URL);
        const productsComplete = await Promise.all(response.data.map(async (productInfo) => {
            const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGE_PRODUCTS_URL}/${productInfo.id}`);
            return {
                ...productInfo,
                images: imagesRes.data.images || [],
            };
        }));

        // Guardar los productos en localStorage después de la consulta
        localStorage.setItem('products', JSON.stringify(productsComplete));
        dispatch(setProduct(productsComplete));
        return productsComplete;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        dispatch(setProduct([])); // Asegurarse de despachar un array vacío en caso de error
        throw error;
    }
};

  // Función para escuchar actualizaciones de productos y actualizar localStorage
  export const listenForProductUpdates = () => (dispatch) => {
    const socket = io(import.meta.env.VITE_APP_API_WEBSOCKET_URL, {
      cors: true,
    });
  
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });
  
    socket.on('updateProducts', (updatedProducts) => {
      console.log('Productos actualizados:', updatedProducts);
      // Actualizar productos en el estado y localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      dispatch(setProduct(updatedProducts));
    });
  
    return () => {
      socket.disconnect();
    };
  };
  
export const fetchProductsCategory = (category) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_GET_PRODUCTS_CATEGORY}?category=${category}`
    );

    const productsComplete = await Promise.all(
      response.data.map(async (productInfo) => {
        try {
          const imagesRes = await axios.get(
            `${import.meta.env.VITE_APP_API_GET_IMAGE_PRODUCTS_URL}/${productInfo.id}`
          );
          return {
            ...productInfo,
            images: imagesRes.data.images || [],
          };
        } catch (error) {
          return { ...productInfo, images: [] };
        }
      })
    );

    dispatch(setProduct(productsComplete));

    // 👇 RETORNAR LOS PRODUCTOS
    return productsComplete;

  } catch (error) {
    console.error(error);
    dispatch(setProduct([]));
    return [];
  }
};

  

  export const fetchProductsById = (id) => async (dispatch) => {
    try {
      // Fetch product details by ID
      const response = await axios.get(`${import.meta.env.VITE_APP_API_GET_PRODUCTS_URL}/${id}`);
      const productInfo = response.data;
  
      try {
        // Fetch product images by ID
        const imagesRes = await axios.get(`${import.meta.env.VITE_APP_API_GET_IMAGE_PRODUCTS_URL}/${id}`);
        const productWithImages = {
          ...productInfo,
          images: imagesRes.data.images || [],
        };
  
        // Dispatch action to update product in Redux store
        dispatch(setProduct([productWithImages]));
      } catch (error) {
        console.error(`Error al obtener las imágenes para el producto ${id}:`, error);
  
        // Dispatch action to update product without images in case of error
        const productWithoutImages = {
          ...productInfo,
          images: [],
        };
        dispatch(setProduct([productWithoutImages]));
      }
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      dispatch(setProduct([])); // Asegurarse de despachar un array vacío en caso de error
    }
  };

  export const addRating = async (productId, userId, rating) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_ADD_RATING_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, user_id: userId, rating }), // Aquí asegúrate de enviar product_id y user_id
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data.message);
      return data;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  };
  
  export const fetchProductRatings = (productIds) => async (dispatch) => {
    try {
      const responses = await Promise.all(
        productIds.map((id) => axios.get(`${import.meta.env.VITE_APP_API_GET_RATING_URL}/${id}`))
      );
  
      const ratings = responses.reduce((acc, response, index) => {
        const productId = productIds[index];
        acc[productId] = response.data;
        return acc;
      }, {});
  
      dispatch(setRatings(ratings));
    } catch (error) {
      console.error('Error fetching product ratings:', error);
    }
  };