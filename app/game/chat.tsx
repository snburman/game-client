import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Filter } from "bad-words";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { useDispatch } from "../context/dispatch_context";
import { useModals } from "../context/modal_context";

const filter = new Filter();

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
        if (inputText.length > 0) {
            const filtered = filter.clean(inputText);
            if (filtered !== inputText) {
                setMessageModal("Please avoid using bad words");
                return;
            }
            sendChatMessage(inputText);
        }
        setInputText("");
    }

    function formatMessage(message: string) {
        const parts = message.split(":");
        let name = parts[0];
        let text = parts.slice(1).join();
        text = text.length > 0 ? ":" + text : "";
        return (
            <Text>
                <Text style={{ fontWeight: "bold" }}>{name}</Text>{text}
            </Text>
        );
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
                        {formatMessage(message)}
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
                    maxLength={50}
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
