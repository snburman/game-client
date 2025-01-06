import { StyleSheet, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export function LoadingSpinner() {
    return (
        <View style={styles.container}>
            <ActivityIndicator
                animating={true}
                color={MD2Colors.green400}
                size={100}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#FFFFFF",
    },
});
