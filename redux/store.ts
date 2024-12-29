import { configureStore } from "@reduxjs/toolkit";
import { imageSlice } from "./image.slice";
import { authSlice } from "./auth.slice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [imageSlice.reducerPath]: imageSlice.reducer,
        [authSlice.reducerPath]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            imageSlice.middleware,
            authSlice.middleware
        ),
});

setupListeners(store.dispatch);
