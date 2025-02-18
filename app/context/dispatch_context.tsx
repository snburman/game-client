import { CLIENT_ID, CLIENT_SECRET, WS_ENDPOINT } from "@/env";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useAuth } from "./auth_context";

export enum DispatchFunction {
    Authenticate = "authenticate",
    Chat = "chat",
    RemoveOnlinePlayer = "remove_online_player",
}

export type Dispatch<T> = {
    id: string;
    function: DispatchFunction;
    data: T;
};

export type AuthPayload = {
    CLIENT_ID: string[];
    CLIENT_SECRET: string[];
};

export type ChatPayload = {
    user_id: string;
    username: string;
    message: string;
};

export type RemoveOnlinePlayerPayload = string;

type DispatchData = {
    initWebSocket(): void;
    connected: boolean;
    chatMessages: string[];
    sendChatMessage(message: string): void;
};

const DispatchContext = createContext<DispatchData | undefined>(undefined);

export default function DispatchProvider({
    children,
}: React.PropsWithChildren) {
    const { user } = useAuth();
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const webSocket = useRef<WebSocket | undefined>(undefined);

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const connected = useMemo(() => {
        return webSocket.current?.readyState === WebSocket.OPEN;
    }, [webSocket.current]);

    function initWebSocket() {
        // create new websocket connection
        webSocket.current = new WebSocket(
            WS_ENDPOINT + "/game/ws/" + "chat::" + user?._id
        );
        // set up event listeners
        webSocket.current.onopen = () => {
            pushChatMessage("Connected to chat server...");
            // authenticate with server
            const auth = JSON.stringify({
                CLIENT_ID: [CLIENT_ID],
                CLIENT_SECRET: [CLIENT_SECRET],
            });
            const uint8Array = encoder.encode(auth);
            const encodedPayload = btoa(String.fromCharCode(...uint8Array));
            const dispatch = JSON.stringify({
                id: "chat::" + user?._id,
                function: DispatchFunction.Authenticate,
                data: encodedPayload,
            })
            webSocket.current?.send(dispatch);
        };
        webSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data) as Dispatch<
                Uint8Array<ArrayBufferLike>
            >;
            incomingDispatch(data);
        };
    }

    function sendChatMessage(message: string) {
        const msgPayload: ChatPayload = {
            user_id: user?._id!,
            username: user?.username!,
            message: message,
        };
        console.log("message payload", msgPayload);
        const uint8Array = encoder.encode(JSON.stringify(msgPayload));
        const encodedPayload = btoa(String.fromCharCode(...uint8Array));
        webSocket.current?.send(
            JSON.stringify({
                id: user?._id,
                function: DispatchFunction.Chat,
                data: encodedPayload,
            })
        );
    }

    const pushChatMessage = useCallback((message: string) => {
        setChatMessages((prev) => [...prev, message]);
    }, [chatMessages]);

    const incomingDispatch = useCallback((dispatch: Dispatch<any>) => {
        switch (dispatch.function) {
            case DispatchFunction.Chat:
                const uint8Array = base64ToUint8Array(dispatch.data);
                const decoded = decoder.decode(uint8Array);
                const msgPayload = JSON.parse(decoded) as ChatPayload;
                const message = `${msgPayload.username}: ${msgPayload.message}`;
                pushChatMessage(message);
                break;
            default:
                break;
        }
    }, [pushChatMessage]);

    const initialValue = {
        initWebSocket,
        connected,
        chatMessages,
        sendChatMessage,
    };

    return (
        <DispatchContext.Provider value={initialValue}>
            {children}
        </DispatchContext.Provider>
    );
}

export function useDispatch() {
    const context = useContext(DispatchContext);
    if (!context) {
        throw new Error("useDispatch must be used within a DispatchProvider");
    }
    return context;
}


function base64ToUint8Array(base64String: string) {
    // Decode Base64 to a binary string
    const binaryString = atob(base64String);
    
    // Convert binary string to Uint8Array
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
}
