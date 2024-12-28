import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Image } from "./models/image.model";
import { API_ENDPOINT } from "@/env";

export const imageSlice = createApi({
    reducerPath: "imageApi",
    baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT + "/assets" }),
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
