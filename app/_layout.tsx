import { PaperProvider } from "react-native-paper";
import CanvasProvider from "./context/canvas_context";
import { Provider as ReduxProvider } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Create from "./create";
import Game from "./game";
import { store } from "@/redux/store";
import { View } from "react-native";
import { Text } from "react-native";
import { theme } from "./_theme";
import BottomTabBar from "@/components/bottom_tab_bar";
import { HomeTabsParamList } from "./types/navigation";

function Index() {
    return (
        <View>
            <Text>Home</Text>
        </View>
    );
}

const Tabs = createBottomTabNavigator<HomeTabsParamList>();
export default function RootLayout() {
    return (
        <ReduxProvider store={store}>
            <CanvasProvider>
                <PaperProvider theme={theme}>
                    <Tabs.Navigator
                        tabBar={BottomTabBar}
                    >
                        <Tabs.Screen name="index" component={Index} options={{title: 'Home'}} />
                        <Tabs.Screen name="create" component={Create} options={{title: 'Create'}}/>
                        <Tabs.Screen name="game" component={Game} options={{title: 'Play'}}/>
                    </Tabs.Navigator>
                </PaperProvider>
            </CanvasProvider>
        </ReduxProvider>
    );
}
