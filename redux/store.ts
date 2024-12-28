import { configureStore } from "@reduxjs/toolkit";
import { imageSlice } from "./image.slice";
import { userSlice } from "./user.slice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [imageSlice.reducerPath]: imageSlice.reducer,
        [userSlice.reducerPath]: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            imageSlice.middleware,
            userSlice.middleware
        ),
});

setupListeners(store.dispatch);
