import { api, AuthToken } from "./api";
import { CellData, Image } from "./models/image.model";
import { MapDTO } from "./models/map.model";

export enum MapError {
    MapExists = "map_exists",
    MapNotFound = "map_not_found",
    ErrorCreatingMap = "error_creating_map",
}

export const mapSlice = api.injectEndpoints({
    endpoints: (builder) => ({
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
    }),
});

export const {
    usePostMapMutation,
    useLazyGetMapByIDQuery,
    useLazyGetUserMapsQuery,
} = mapSlice;
