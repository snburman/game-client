import { useMobile } from "@/hooks/useMobile";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "@/components/drawer_content";
import { PaperProvider } from "react-native-paper";
import { theme } from "./_theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export default function RootLayout() {
    const isMobile = useMobile();

    return (
        <ReduxProvider store={store}>
            <PaperProvider theme={theme}>
                <SafeAreaProvider>
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
                        <Drawer.Screen name="index" options={{headerTitle: "Home"}}/>
                        <Drawer.Screen name="create" options={{headerTitle: "Create"}}/>
                        <Drawer.Screen name="game" options={{headerTitle: "Play"}}/>
                    </Drawer>
                </SafeAreaProvider>
            </PaperProvider>
        </ReduxProvider>
    );
}
