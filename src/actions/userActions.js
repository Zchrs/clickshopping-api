/* eslint-disable no-debugger */
import { types } from "../types/types";



export const login = (name) => {
    return {
      type: types.login,
      payload: {
        name,
    },
    };
  };

  export const logout = () => ({
    type: types.logout,
  });



export const changeLang = (lang) => {
  
  return {
    type: types.CHANGE_LANG,
    payload: lang,
    
  };
};