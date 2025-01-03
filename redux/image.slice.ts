import type { Image } from "./models/image.model";
import { api } from "./api";

export const imageSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        postImage: builder.mutation<Image, Image>({
            query: (newImage: Image) => ({
                url: `/assets/player`,
                method: "POST",
                body: newImage,
            }),
        }),
    }),
});

export const { usePostImageMutation } = imageSlice;
