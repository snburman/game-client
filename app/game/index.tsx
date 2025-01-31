import { StyleSheet, View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../context/auth_context";
import { useState } from "react";
import { useModals } from "../context/modal_context";
import { API_ENDPOINT } from "@/env";

export default function Game() {
    const { token } = useAuth();
    const [connectionID, setConnectionID] = useState<string | undefined>();
    const [html, setHtml] = useState<string | undefined>();
    const { setMessageModal } = useModals();

    const map_id = "6794a98e48815ec0dd9c19d0"
    const uri = `${API_ENDPOINT}/game/client/map/${map_id}?token=${token}`;
    return (
        <View style={styles.wrapper}>
            {Platform.OS === "web" ? (
                <iframe src={uri} style={styles.frame}/>
            ) : (
                <WebView
                    containerStyle={styles.frame}
                    source={{
                        uri,
                    }}
                    style={styles.frame}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    frame: {
        flex: 1,
        width: '100%',
        borderWidth: 0,
        overflow: 'hidden',
    }
});
