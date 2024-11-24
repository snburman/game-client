import { configureStore } from "@reduxjs/toolkit";
import { imageSlice } from "./image.slice";

export const store = configureStore({
    reducer: {
        [imageSlice.reducerPath]: imageSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(imageSlice.middleware),
});
