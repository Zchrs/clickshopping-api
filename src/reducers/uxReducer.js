/* eslint-disable no-debugger */
import { types } from "../types/types";


const initialState = {
    lang: 'es', // Estado inicial predeterminado
  };

export const uxReducer = (state = initialState, action) => {
    // debugger
    switch (action.type) {
      case types.CHANGE_LANG:
        return {
          ...state,
          lang: action.payload.lang,
        };
      default:
        return state;
    }
  };