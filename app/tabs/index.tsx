import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HeaderBar from "@/components/header_bar";
import { HomeTabsParamList } from "../types/navigation";
import Create from "../create";
import Game from "../game";
import Settings from "../settings";
import Home from "../home";

export default function Tabs() {
    const Tabs = createBottomTabNavigator<HomeTabsParamList>();
    return (
        <Tabs.Navigator
            screenOptions={{
                header(props) {
                    return <HeaderBar {...props} />;
                },
                tabBarStyle: { display: "none" },
            }}
        >
            <Tabs.Screen
                name="home"
                component={Home}
                options={{ title: "Home" }}
            />
            <Tabs.Screen
                name="create"
                component={Create}
                options={{ title: "Create" }}
            />
            <Tabs.Screen
                name="game"
                component={Game}
                options={{ title: "Play" }}
            />
            <Tabs.Screen
                name="settings"
                component={Settings}
                options={{ title: "Settings" }}
            />
        </Tabs.Navigator>
    );
}
