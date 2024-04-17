import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const presistedUser = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: presistedUser,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
