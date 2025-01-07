import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomTabBar from "@/components/bottom_tab_bar";
import HeaderBar from "@/components/header_bar";
import { HomeStackProps, HomeTabsParamList} from "../types/navigation";
import Create from "../create";
import Game from "../game";
import Settings from "../settings";
import Images from "../create/images";
import Map from "../create/map";

export default function Tabs(props: HomeStackProps) {
    const Tabs = createBottomTabNavigator<HomeTabsParamList>();
    return (
        <Tabs.Navigator
            tabBar={BottomTabBar}
            screenOptions={{
                header(props) {
                    return <HeaderBar {...props} />;
                },
            }}
        >
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
            <Tabs.Screen
                name="images"
                component={Images}
                options={{ title: "Images" }}
            />
            <Tabs.Screen
                name="map"
                component={Map}
                options={{ title: "Map" }}
            />
        </Tabs.Navigator>
    );
}
