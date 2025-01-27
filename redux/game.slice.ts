import { api, AuthToken } from "./api";

export const gameSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getGame: build.query<{html: string, connection_id: string}, {token: string, map_id: string}>({
            query: (args) => ({
                url: `/game/client/${args.map_id}`,
                method: "GET",
                headers: {
                    ...AuthToken(args.token),
                },
                responseHandler: (res) => res.text(),
            }),
            transformResponse: async (response, meta) => {
                const connection_id = meta?.response?.headers.get("Connection")
                if(!connection_id) {
                    throw new Error("No connection id in headers")
                }
                const html = await response as string
                if(!html) {
                    throw new Error("Error loading html from game server")
                }
                return {html: html as string, connection_id}
            }
        })
    })
})

export const {
     useLazyGetGameQuery,
} = gameSlice;