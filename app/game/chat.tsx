import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { useDispatch } from "../context/dispatch_context";
import { useModals } from "../context/modal_context";

export default function Chat() {
    const { setMessageModal } = useModals();
    const { initWebSocket, connected, chatMessages, sendChatMessage } =
        useDispatch();
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        initWebSocket();
    }, []);

    function handleSubmit() {
        // if (!connected) {
        //     setMessageModal("Chat server disconnected");
        //     return;
        // }
        if (inputText.length > 0) {
            sendChatMessage(inputText);
        }
        setInputText("");
    }

    return (
        <View style={styles.container}>
            {/* chat messages */}
            <ScrollView
                style={styles.messagesContainer}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
                ref={scrollViewRef}
            >
                {chatMessages.map((message, index) => (
                    <View key={index}>
                        <Text style={styles.messageText}>{message}</Text>
                    </View>
                ))}
            </ScrollView>
            {/* chat input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    mode="flat"
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={(text) => setInputText(text)}
                    right={
                        <TextInput.Icon icon={"send"} onPress={handleSubmit} />
                    }
                    onKeyPress={(e) => {
                        if (e.nativeEvent.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 500,
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "rgb(255 255 255)",
    },
    messagesContainer: {
        width: "100%",
        height: 70,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 1,
        backgroundColor: "#FFF",
    },
    messageText: {
        color: "black",
        fontSize: 16,
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        height: 50,
        backgroundColor: "white",
        borderColor: "black",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: 1,
    },
});
