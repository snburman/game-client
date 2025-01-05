import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import Tabs from "./tabs";
import { useAuth } from "./context/auth_context";
import { RootStackParamList } from "./types/navigation";
import { useModals } from "./context/modalContext";

export default function Index() {
    const Stack = createStackNavigator<RootStackParamList>();
    const { user } = useAuth();
    const { messageModal, confirmModal } = useModals();

    return (
        <>
            {messageModal}
            {confirmModal}
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
        </>
    );
}
