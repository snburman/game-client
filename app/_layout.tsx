import { PaperProvider } from "react-native-paper";
import CanvasProvider from "./context/canvas_context";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { theme } from "./_theme";
import AuthProvider from "./context/auth_context";
import Index from "./index";
import ModalProvider from "./context/modal_context";

export default function RootLayout() {
    return (
        // global async store
        <ReduxProvider store={store}>
            {/* alerts, confirmation modals, etc. */}
            <ModalProvider>
                {/* authentication provision */}
                <AuthProvider>
                    {/* drawing canvas data */}
                    <CanvasProvider>
                        {/* component theme */}
                        <PaperProvider theme={theme}>
                            <Index />
                        </PaperProvider>
                    </CanvasProvider>
                </AuthProvider>
            </ModalProvider>
        </ReduxProvider>
    );
}
