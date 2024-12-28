import { PaperProvider } from "react-native-paper";
import CanvasProvider from "./context/canvas_context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { theme } from "./_theme";
import AuthProvider from "./context/auth_context";
import Index from "./index";

export default function RootLayout() {
    return (
        <ReduxProvider store={store}>
            <AuthProvider>
                <CanvasProvider>
                    <PaperProvider theme={theme}>
                        <Index />
                    </PaperProvider>
                </CanvasProvider>
            </AuthProvider>
        </ReduxProvider>
    );
}
