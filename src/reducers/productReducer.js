import { types } from "../types/types";


 const productInitiaState = {
    productInfo: [],
    selectedProduct: [],
    ratings: {}
}




export const productReducer = (state = productInitiaState, action) =>{
    switch (action.type) {
        case types.productView:
          return {
            ...state,
            ... action.payload,
            productInfo: action.payload
          };
          case types.productViewedFinish:
            return {
                ... state,
                productInfo: action.payload,
                state: null
            };
            case types.REMOVE_PRODUCT:
              return {
                ...state,
                removeProduct: action.payload,
                state: null
              };
            case types.SELECTED_PRODUCT:
              return {
                ...state,
                selectedProduct: action.payload,
              };
              case types.SET_RATINGS:
                return {
                  ...state,
                  ratings: {
                    ...state.ratings,
                    ...action.payload,
                  },
                };
        default:
          return state;
      }
}

