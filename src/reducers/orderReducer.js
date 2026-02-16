import { types } from "../types/types";

const initialState = {
  orderInfo: [],
  loading: false,
  error: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.orderView:
      return {
        ...state,
        orderInfo: action.payload,
      };

    case types.startPayment:
      return {
        ...state,
        loading: true,
      };

    case types.paymentSuccess:
      return {
        ...state,
        loading: false,
      };

    case types.errorPayment:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CLEAR_CART:
      return {
        ...state,
        orderInfo: [],
      };

    default:
      return state;
  }
};

export default ordersReducer;
