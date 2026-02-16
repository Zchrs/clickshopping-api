import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux";
// import createSocketIoMiddleware from 'redux-socket.io';
// import io from 'socket.io-client';
import { productReducer} from "../reducers/productReducer";


import { authReducer, authReducerAdmin  } from "../reducers/authReducer";
import { uxReducer } from "../reducers/uxReducer";
import i18n from "../translates/i18n";
import cartReducer from "../reducers/cartReducer";
import orderReducer from "../reducers/orderReducer";
import {thunk} from "redux-thunk";
// import userReducer from "../reducers/userReducer";
// const socket = io(import.meta.env.VITE_APP_WEBSOCKET_URL);
// const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

// import { rootReducer } from "../reducers/rootReducer";



const reducers = combineReducers({
  cart: cartReducer,
  product: productReducer,
  langUI: uxReducer,
  auth: authReducer,
  authAdmin: authReducerAdmin,
  order: orderReducer,
});

// Combina los enhancers en una sola función utilizando compose
const enhancers = compose(
  applyMiddleware(thunk),
  // applyMiddleware(socketIoMiddleware)
);

// Crea la tienda utilizando createStore y los enhancers combinados
export const store = createStore(
  reducers,
  enhancers
);

export { i18n }

