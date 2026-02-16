/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
import axios from "axios";
import { types } from "../types/types";
import { io } from "socket.io-client";

export const setOrder = (orderInfo) => {
  return {
    type: types.orderView,
    payload: Array.isArray(orderInfo) ? orderInfo : [],
  };
};

export const selectedOrder = (orderInfo) => ({
  type: types.SELECTED_ORDER,
  payload: orderInfo,
});

export const updateOrder = (orderInfo) => ({
  type: types.UPDATE_ORDER,
  payload: Array.isArray(orderInfo) ? orderInfo : [],
});

  export const startPayment = (orderInfo) => {
    return {
      type: types.startPayment,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };

  export const paymentSuccess = (orderInfo) => {
    return {
      type: types.paymentSuccess,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };

  export const errorPayment = (orderInfo) => {
    return {
      type: types.errorPayment,
      payload: Array.isArray(orderInfo) ? orderInfo : [],
    };
  };


export const fetchOrders = () => async (dispatch) => {
  try {
    const { data } = await axios.get(import.meta.env.VITE_APP_API_GET_ORDERS_URL, {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    });

    const orders = data.orders || [];

    localStorage.setItem("orders", JSON.stringify(orders));
    dispatch(setOrder(orders));
    return orders;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    dispatch(setOrder([]));
    throw error;
  }
};

export const fetchUserOrders = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_APP_API_GET_USER_ORDERS_URL,
      {
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const orders = (data.orders || []).map(order => ({
      ...order,
      items: (order.items || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
      })),
    }));

    localStorage.setItem("orders", JSON.stringify(orders));
    dispatch(setOrder(orders));
    return orders;
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    dispatch(setOrder([]));
    throw error;
  }
};


