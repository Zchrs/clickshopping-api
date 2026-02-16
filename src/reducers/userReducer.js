/* eslint-disable no-unused-vars */

import { types } from "../types/types";



const initialState = {
    logged: false,
    name: '',
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          name: action.payload,
          logged: true
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  