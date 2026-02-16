import { types } from "../types/types";

const initialState = {
  cart: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case types.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload.data], // Add new item to cart
      };
    case types.ADD_TO_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case types.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};

export default cartReducer;
