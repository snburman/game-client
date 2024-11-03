import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function DrawerContent(props: DrawerContentComponentProps) {
    const { navigation } = props;

    function handlePress(route: string) {
        navigation.navigate(route);
    }

    return (
        <View style={styles.buttonContainer}>
            <DrawerButton text="Home" onPress={() => handlePress("index")}/>
            <DrawerButton text="Create" onPress={() => handlePress("create")}/>
            <DrawerButton text="Play" onPress={() => handlePress("game")}/>
        </View>
    );
}

const DrawerButton = (props: {
    onPress: () => void;
    text: string;
}) => {
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");

    function handleHover() {
        setBackgroundColor("rgba(0, 0, 0, 0.1)");
    }

    function handleLeave() {
        setBackgroundColor("#ffffff");
    }

    return (
        <Pressable onPress={props.onPress}>
            <View
                style={[styles.button, { backgroundColor: backgroundColor }]}
                onPointerEnter={handleHover}
                onPointerLeave={handleLeave}
            >
                <Text>{props.text}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        padding: 5,
    },
    button: {
        width: "100%",
        padding: 10,
        textAlign: "left",
        borderRadius: 5,
    },
});
