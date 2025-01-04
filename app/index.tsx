import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import Tabs from "./tabs";
import { useAuth } from "./context/auth_context";
import { RootStackParamList, TabsProps } from "./types/navigation";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const Stack = createStackNavigator<RootStackParamList>();
    const { user } = useAuth();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {!user ? (
                <Stack.Screen name="login" component={Login} />
            ) : (
                <Stack.Screen name="tabs" component={Tabs} />
            )}
        </Stack.Navigator>
    );
}
