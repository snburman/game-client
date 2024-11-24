import { Tabs } from "expo-router";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import { theme } from "../_theme";
import CanvasProvider from "../context/canvas_context";

export default function DrawLayout() {
    return (
        <CanvasProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#000000",
                    tabBarStyle: {
                        height: 60,
                        ...theme.shadow.small,
                    },
                    
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Draw",
                        tabBarIcon: ({ color, size }) => (
                            <Entypo name="pencil" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        tabBarIcon: ({ color, size }) => (
                            <Fontisto
                                name="player-settings"
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
            </Tabs>
        </CanvasProvider>
    );
}
