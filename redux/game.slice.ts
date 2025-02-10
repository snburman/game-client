import { WS_ENDPOINT } from "@/env";
import { api } from "./api";

type ServerMessage = {
    data: any;
};

export const gameSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getMessages: build.query<ServerMessage[], string>({
            queryFn: async () => {
                return {
                    data: [],
                };
            },
            // FIXME: refactor websocket connection
            // async onCacheEntryAdded(
            //     token,
            //     { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            // ) {
            //     const ws = new WebSocket(
            //         WS_ENDPOINT + `/game/client/connect?token=${token}`
            //     );
            //     try {
            //         await cacheDataLoaded;

            //         const listener = (event: MessageEvent) => {
            //             const data = JSON.parse(event.data);
            //             updateCachedData((draft) => {
            //                 draft.pop();
            //                 draft.push(data);
            //             });
            //         };
            //         ws.addEventListener("message", listener);
            //     } catch {}

            //     await cacheEntryRemoved;
            //     ws.close();
            // },
        }),
    }),
});

export const { useLazyGetMessagesQuery } = gameSlice;
