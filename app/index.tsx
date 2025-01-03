import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeTabsParamList } from "./types/navigation";
import BottomTabBar from "@/components/bottom_tab_bar";
import Create from "./create";
import Game from "./game";
import { useAuth } from "./context/auth_context";
import Login from "./login";
import HeaderBar from "@/components/header_bar";

export default function Index() {
    const Tabs = createBottomTabNavigator<HomeTabsParamList>();
    const { user } = useAuth();

    if (!user) {
        return <Login />;
    }

    return (
        <Tabs.Navigator
            tabBar={user ? BottomTabBar : () => <></>}
            screenOptions={{
                header(props) {
                    return <HeaderBar {...props} />;
                },
            }}
        >
            <Tabs.Screen
                name="login"
                component={Login}
                options={{
                    title: "Login",
                    header(props) {
                        return null;
                    },
                }}
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
        </Tabs.Navigator>
    );
}
