import { types } from "../types/types";

const initialState = {
  wishlist: [],
};

const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_TO_WISHLIST:
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    case types.ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload.data], // Add new item to wishlist
      };
    case types.ADD_TO_WISHLIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case types.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.payload),
      };
    case types.CLEAR_WISHLIST:
      return {
        ...state,
        wishlist: [],
      };
    default:
      return state;
  }
};

export default wishlistReducer;
