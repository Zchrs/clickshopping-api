import { types } from "../types/types";

export const setProperty = (pqrsInfo) => {
    return {
      type: types.pqrsView,
      payload: Array.isArray(pqrsInfo) ? pqrsInfo : [],
    };
  };