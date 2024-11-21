import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Test() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Test</Text>
            </View>
        </SafeAreaView>
    );
}
