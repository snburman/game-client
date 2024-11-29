import { PaperProvider } from "react-native-paper";
import CanvasProvider from "./context/canvas_context";
import { Provider as ReduxProvider } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Index from ".";
import Create from "./create";
import Game from "./game";
import { store } from "@/redux/store";
import { View } from "react-native";
import { Text } from "react-native";
import { theme } from "./_theme";
function _Index() {
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}
const Tabs = createBottomTabNavigator();
export default function RootLayout() {
    return (
        <ReduxProvider store={store}>
            <CanvasProvider>
                <PaperProvider theme={theme}>
                    <Tabs.Navigator>
                        <Tabs.Screen name="index" component={_Index} />
                        <Tabs.Screen name="create" component={Create} />
                        <Tabs.Screen name="game" component={Game} />
                    </Tabs.Navigator>
                </PaperProvider>
            </CanvasProvider>
        </ReduxProvider>
    );
}
