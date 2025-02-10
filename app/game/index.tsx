import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, ScrollView, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../context/auth_context";
import { API_ENDPOINT } from "@/env";
import { useLazyGetMessagesQuery } from "@/redux/game.slice";
import { LoadingSpinner } from "@/components/loading";
import { useModals } from "../context/modal_context";
import { useGame } from "../context/game_context";
import { useMaps } from "../context/map_context";
import { GameProps } from "../types/navigation";
import { useLazyGetUserMapsQuery } from "@/redux/map.slice";

export default function Game({ navigation }: GameProps) {
    const { token } = useAuth();
    const { isPlaying } = useGame();
    const { setMessageModal } = useModals();
    const { allMaps } = useMaps();
    const [getMaps] = useLazyGetUserMapsQuery();
    const [getMessages] = useLazyGetMessagesQuery();
    const [authenticated, setAuthenticated] = useState(false);
    const uri = `${API_ENDPOINT}/game/client?token=${token}`;

    useEffect(() => {
        if (token) {
            getMessages(token).then((res) => {
                if (res.error) {
                    setMessageModal("Error connecting to server");
                    return;
                }
                setAuthenticated(true);
            });
        } else {
            throw new Error("No token found");
        }
    }, []);

    useEffect(() => {
        console.log("isPlaying", isPlaying);
        token &&
            getMaps(token).then((res) => {
                if (res.error) {
                    setMessageModal("Error connecting to server");
                    return;
                } else if (res.data?.length === 0) {
                    setMessageModal("Create a map to start playing", () =>
                        navigation.navigate("create")
                    );
                    return;
                }
            });
    }, [isPlaying, allMaps]);

    if (!isPlaying) {
        return null;
    }

    if (!authenticated) {
        return <LoadingSpinner />;
    }

    if (authenticated)
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    {Platform.OS === "web" ? (
                        <iframe src={uri} style={styles.frame} scrolling="no" />
                    ) : (
                        <WebView
                            containerStyle={styles.frame}
                            source={{ uri }}
                        />
                    )}
                </ScrollView>
                {/* TODO: chat / command toolbar */}
                <View style={styles.toolPanel}></View>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-start",
    },
    scrollView: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "rgb(0 0 0)",
    },
    frame: {
        alignSelf: "center",
        width: "95%",
        height: 500,
        borderWidth: 0,
        overflow: "hidden",
    },
    toolPanel: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 85,
    },
});
