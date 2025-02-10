import { update } from "lodash";
import { api, AuthToken } from "./api";
import { CellData, Image } from "./models/image.model";
import { MapDTO } from "./models/map.model";

export enum MapError {
    MapExists = "map_exists",
    MapNotFound = "map_not_found",
    ErrorCreatingMap = "error_creating_map",
    ErrorUpdatingMap = "error_updating_map",
    ErrorPrimaryMapExists = "primary_map_exists",
}

export const mapSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllMaps: builder.query<MapDTO<Image<CellData[][]>[]>, string>({
            query: (token) => ({
                url: "/maps",
                method: "GET",
                headers: {
                    ...AuthToken(token),
                },
            }),
        }),
        getMapByID: builder.query<
            MapDTO<Image<CellData[][]>[]>,
            { token: string; id: string }
        >({
            query: (args) => ({
                url: `/maps/${args.id}`,
                method: "GET",
                headers: {
                    ...AuthToken(args.token),
                },
            }),
        }),
        // returns maps by user id contained in token
        getUserMaps: builder.query<MapDTO<Image<CellData[][]>[]>[], string>({
            query: (token) => ({
                url: "/maps/player",
                method: "GET",
                headers: {
                    ...AuthToken(token),
                },
            }),
        }),
        postMap: builder.mutation<
            { inserted_id: string },
            { token: string; map: MapDTO<string> }
        >({
            query: (args) => ({
                url: "/maps",
                method: "POST",
                headers: {
                    ...AuthToken(args.token),
                },
                body: args.map,
            }),
        }),
        updateMap: builder.mutation<
            void,
            { token: string; map: MapDTO<string> }
        >({
            query: (args) => ({
                url: "/maps",
                method: "PATCH",
                headers: {
                    ...AuthToken(args.token),
                },
                body: args.map,
            }),
        }),
        deleteMap: builder.mutation<void, { token: string; id: string }>({
            query: (args) => ({
                url: `/maps/${args.id}`,
                method: "DELETE",
                headers: {
                    ...AuthToken(args.token),
                },
            }),
        }),
    }),
});

export const {
    useLazyGetAllMapsQuery,
    useLazyGetMapByIDQuery,
    useLazyGetUserMapsQuery,
    usePostMapMutation,
    useUpdateMapMutation,
    useDeleteMapMutation,
} = mapSlice;
