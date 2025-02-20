import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Filter } from "bad-words";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { useDispatch } from "../context/dispatch_context";
import { useModals } from "../context/modal_context";

const filter = new Filter();

const commands = new Map<string, string>();
commands.set(
    "help",
    `
Commands:
/help - show this message
`
);

export default function Chat() {
    const { setMessageModal } = useModals();
    const { initWebSocket, chatMessages, pushChatMessage, sendChatMessage } =
        useDispatch();
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const [chatFocused, setChatFocused] = useState(false);

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
        }

        // chat input commands
        if (inputText.startsWith("/")) {
            const command = inputText.slice(1);
            if (commands.has(command)) {
                const msg = commands.get(command);
                msg && pushChatMessage(msg);
            } else {
                pushChatMessage(
                    "Command not found. Type /help for a list of commands"
                );
            }
            setInputText("");
            return;
        }

        sendChatMessage(inputText);
        setInputText("");
    }

    function formatMessage(message: string) {
        const parts = message.split(":");
        let name = parts[0];
        let text = parts.slice(1).join();
        text = text.length > 0 ? ":" + text : "";
        return (
            <Text>
                <Text style={{ fontWeight: "bold" }}>{name}</Text>
                {text}
            </Text>
        );
    }

    function handleFocus() {
        setChatFocused(!chatFocused);
    }

    return (
        <>
            <View style={styles.container} />
            <View
                style={[
                    styles.container,
                    { position: "absolute" },
                    chatFocused && { height: "50%" },
                ]}
            >
                <View style={styles.wrapper}>
                    {/* chat messages */}
                    <ScrollView
                        style={styles.messagesContainer}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd()
                        }
                        ref={scrollViewRef}
                    >
                        {chatMessages.map((message, index) => (
                            <View key={index}>{formatMessage(message)}</View>
                        ))}
                    </ScrollView>
                    {/* chat input */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons
                            name={chatFocused ? "expand-more" : "expand-less"}
                            size={30}
                            color="black"
                            onPress={handleFocus}
                            style={{
                                position: "absolute",
                                zIndex: 200,
                                right: 10,
                            }}
                        />
                        <TextInput
                            style={styles.textInput}
                            mode="flat"
                            placeholder="Type a message..."
                            value={inputText}
                            maxLength={50}
                            onChangeText={(text) => setInputText(text)}
                            right={
                                <TextInput.Icon
                                    icon={"send"}
                                    onPress={handleSubmit}
                                    style={{ marginRight: 70 }}
                                />
                            }
                            onKeyPress={(e) => {
                                if (e.nativeEvent.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                        />
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 125,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
    },
    wrapper: {
        width: "100%",
        height: "100%",
        maxWidth: 500,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    messagesContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: "100%",
        height: "100%",
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
