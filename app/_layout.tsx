import { useMobile } from "@/hooks/useMobile";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContent from "@/components/drawer_content";
import { PaperProvider } from "react-native-paper";
import { theme } from "./_theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const isMobile = useMobile();

    return (
        <PaperProvider theme={theme}>
            <Drawer
                initialRouteName="create"
                screenOptions={{
                    drawerType: isMobile ? "slide" : "permanent",
                    drawerPosition: "left",
                    drawerStyle: {
                        borderRightWidth: 0,
                        ...theme.shadow.small,
                    },
                    headerShown: isMobile,
                }}
                drawerContent={(props) => DrawerContent(props)}
            >
                    <Drawer.Screen name="index" />
                    <Drawer.Screen name="create" />
                    <Drawer.Screen name="game" />
            </Drawer>
        </PaperProvider>
    );
}
