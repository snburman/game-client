import { StyleSheet, Text, View } from "react-native";

export default function Game() {
    return (
        <View style={styles.wrapper}>
            <Text>Game</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
