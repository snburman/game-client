import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeTabsParamList } from "./types/navigation";
import BottomTabBar from "@/components/bottom_tab_bar";
import Create from "./create";
import Game from "./game";
import { useAuth } from "./context/auth_context";
import Login from "./login";

export default function Index() {
    const Tabs = createBottomTabNavigator<HomeTabsParamList>();
    const { user } = useAuth();

    if (!user) {
        return <Login />
    }

    return (
        <>
            <Tabs.Navigator tabBar={BottomTabBar}>
                {/* <Tabs.Screen
                    name="index"
                    component={Index}
                    options={{ title: "Home" }}
                /> */}
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
            </Tabs.Navigator>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
