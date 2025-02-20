import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./login";
import Tabs from "./tabs";
import { useAuth } from "./context/auth_context";
import { RootStackParamList } from "./types/navigation";
import { useModals } from "./context/modal_context";
import './styles.css';

export default function Index() {
    const Stack = createStackNavigator<RootStackParamList>();
    const { user } = useAuth();
    const { messageModal, confirmModal, plainModal } = useModals();

    return (
        <>
            {messageModal}
            {confirmModal}
            {plainModal}
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
