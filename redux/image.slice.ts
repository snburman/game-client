import type { Image } from "./models/image.model";
import { api } from "./api";

export enum AssetError {
    ImageExists = "image_exists",
    ErrorCreatingImage = "error_creating_image",
}

export const imageSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserImages: builder.query<Image[], string>({
            query: (token: string) => ({
                url: "/assets/player",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
        postImage: builder.mutation<
            { inserted_id: string },
            { token: string; image: Image }
        >({
            query: (args: { token: string; image: Image }) => ({
                url: "/assets/player",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${args.token}`,
                },
                body: args.image,
            }),
        }),
        updateImage: builder.mutation<void, { token: string; image: Image }>({
            query: (args: { token: string; image: Image }) => ({
                url: "/assets/player",
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${args.token}`,
                },
                body: args.image,
            }),
        }),
    }),
});

export const {
    useGetUserImagesQuery,
    usePostImageMutation,
    useUpdateImageMutation,
} = imageSlice;
