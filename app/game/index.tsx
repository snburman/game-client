import React, { useEffect, useRef } from "react";
import { StyleSheet, Platform, ScrollView, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../context/auth_context";
import { API_ENDPOINT } from "@/env";
import { useModals } from "../context/modal_context";
import { useGame } from "../context/game_context";
import { GameProps } from "../types/navigation";
import { useLazyGetUserMapsQuery } from "@/redux/map.slice";
import Chat from "./chat";
import DispatchProvider from "../context/dispatch_context";

export default function Game({ navigation }: GameProps) {
    const { token } = useAuth();
    const { isPlaying, setIsPlaying } = useGame();
    const { setMessageModal } = useModals();
    const [getMaps] = useLazyGetUserMapsQuery();
    const ref = useRef();

    const uri = `${API_ENDPOINT}/game/client?token=${token}`;

    useEffect(() => {
        if(!isPlaying) return;
        token &&
            getMaps(token).then((res) => {
                if (res.error) {
                    setMessageModal("Error connecting to server");
                    return;
                } else if (!res.data || res.data?.length === 0) {
                    setMessageModal("Create a map to start playing", () => {
                        setIsPlaying(false);
                        navigation.navigate("create");
                    });
                    return;
                }
            });
    }, [isPlaying]);

    if (!isPlaying) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {Platform.OS === "web" ? (
                    <iframe src={uri} style={styles.frame} scrolling="no"/>
                ) : (
                    <WebView containerStyle={styles.frame} source={{ uri }} />
                )}
                <DispatchProvider>
                    <Chat />
                </DispatchProvider>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        height: "100%",
        width: "100%",
        justifyContent: "flex-start",
    },
    scrollView: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "rgb(0 0 0)",
        paddingTop: 15,
    },
    frame: {
        width: "100%",
        height: "100%",
        borderWidth: 0,
        overflow: "hidden",
    },
    toolPanel: {
        justifyContent: "center",
        alignItems: "center",
    },
});
