import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { useDevice } from "../hooks/device";

export default function Chat() {
    const { user } = useAuth();
    const { isMobile } = useDevice();
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    function handleSubmit() {
        setMessages([...messages, user?.username + ": " + inputText]);
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
                {messages.map((message, index) => (
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
        backgroundColor: "rgb(255 255 255)"
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
