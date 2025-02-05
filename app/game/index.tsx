import { StyleSheet, View, Platform, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../context/auth_context";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "@/env";
import { useLazyGetMessagesQuery } from "@/redux/game.slice";
import { LoadingSpinner } from "@/components/loading";
import { useModals } from "../context/modal_context";

export default function Game() {
    const { token } = useAuth();
    const { setMessageModal } = useModals();
    const [getMessages, messages] = useLazyGetMessagesQuery();
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

    if (!authenticated) {
        return <LoadingSpinner />;
    }

    if (authenticated)
        return (
            <ScrollView contentContainerStyle={styles.wrapper} bounces={false} showsVerticalScrollIndicator={false}>
                {Platform.OS === "web" ? (
                    <iframe src={uri} style={styles.frame} scrolling="no"/>
                ) : (
                    <WebView
                        containerStyle={styles.frame}
                        source={{ uri }}
                    />
                )}
            </ScrollView>
        );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#FFF"
    },
    frame: {
        width: "100%",
        height: "100%",
        borderWidth: 0,
        overflow: "hidden",
    },
});
