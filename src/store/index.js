import { flowerApi } from "../services/flowerApi";
import flowerReducer from "../slices/flower.slice";
import { productAPI } from "../services/productAPI";
import ProductReducer from "../slices/product.slice";
import UserReducer from "../slices/user.slice";
import { authApi } from "../services/authAPI";
import AuthReducer from "../slices/auth.slice";
import { orderApi } from "../services/orderApi";
import OrderReducer from "../slices/order.slice";
import { roleApi } from "../services/roleApi";
import RoleReducer from "../slices/role.slice";
import { chatApi } from "../services/chatApi";
import ChatReducer from "../slices/chat.slice";
import { userAPI } from "../services/userAPI";




import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import OrderReducer from "../slices/order.slice";
import { orderAPI } from "../services/orderApi";
const persistConfig = {
  key: "root",
  storage,
};
// Define the Reducers that will always be present in the application
const staticReducers = {
  theme: "theme",
};

const persistedReducer = persistReducer(persistConfig, flowerReducer);
const ProductPerisReducer = persistReducer(persistConfig, ProductReducer);
const UserPerisReducer = persistReducer(persistConfig, UserReducer);
const AuthPerisReducer = persistReducer(persistConfig, AuthReducer);
const rolePersistReducer = persistReducer(persistConfig, RoleReducer);
const chatPersistReducer = persistReducer(persistConfig, ChatReducer);
const OrderPerisReducer = persistReducer(persistConfig, OrderReducer);

export const store = configureStore({
  reducer: {
    [flowerApi.reducerPath]: flowerApi.reducer,
    flower: persistedReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    product: ProductPerisReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    user: UserPerisReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: AuthPerisReducer,
    [roleApi.reducerPath]: roleApi.reducer,
    role: rolePersistReducer,
    [chatApi.reducerPath]: chatApi.reducer,
    chat: chatPersistReducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    order: OrderPerisReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      flowerApi.middleware,
      productAPI.middleware,
      userAPI.middleware,
      authApi.middleware,
      roleApi.middleware,
      chatApi.middleware,
      orderAPI.middleware,

    ),
});

// Add a dictionary to keep track of the registered async reducers
store.asyncReducers = {};

// Create an inject reducer function
// This function adds the async reducer, and creates a new combined reducer
export const injectReducer = (key, asyncReducer) => {
  store.asyncReducers[key] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
  return asyncReducer;
};

function createReducer(asyncReducers = {}) {
  if (Object.keys(asyncReducers).length === 0) {
    return (state) => state;
  } else {
    return combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });
  }
}

export const Persister = persistStore(store);
