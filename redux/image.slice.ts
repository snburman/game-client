import type { Image } from "./models/image.model";
import { api } from "./api";
import { CellData } from "@/app/context/canvas_context";

export enum ImageError {
    ImageExists = "image_exists",
    ErrorCreatingImage = "error_creating_image",
}

export const imageSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserImages: builder.query<Image<CellData[][]>[], string>({
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
            { token: string; image: Image<string> }
        >({
            query: (args: { token: string; image: Image<string> }) => ({
                url: "/assets/player",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${args.token}`,
                },
                body: args.image,
            }),
        }),
        updateImage: builder.mutation<
            void,
            { token: string; image: Image<string> }
        >({
            query: (args: { token: string; image: Image<string> }) => ({
                url: "/assets/player",
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${args.token}`,
                },
                body: args.image,
            }),
        }),
        deleteImage: builder.mutation<
            { error: string } | { deleted: number },
            { token: string; id: string }
        >({
            query: (args: { token: string; id: string }) => ({
                url: `/assets/player?id=${args.id}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${args.token}`,
                },
            }),
        }),
    }),
});

export const {
    useGetUserImagesQuery,
    useLazyGetUserImagesQuery,
    usePostImageMutation,
    useUpdateImageMutation,
    useDeleteImageMutation
} = imageSlice;
