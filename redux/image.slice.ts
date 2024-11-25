import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Image } from "./models/image.model";

export const imageSlice = createApi({
    reducerPath: "imageApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:9191/game" }),
    endpoints: (builder) => ({
        postImage: builder.mutation<Image, Image>({
            query: (newImage: Image) => ({
                url: `/player/assets`,
                method: "POST",
                body: newImage,
            }),
        }),
    }),
});

export const { usePostImageMutation } = imageSlice;
