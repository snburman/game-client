import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { PaperProvider } from "react-native-paper";
import CanvasProvider from "./context/canvas_context";
import { theme } from "./_theme";
import { useFonts } from 'expo-font';
import AuthProvider from "./context/auth_context";
import Index from "./index";
import ModalProvider from "./context/modal_context";
import ImagesProvider from "./context/images_context";
import MapsProvider from "./context/map_context";
import GameProvider from "./context/game_context";
import { LoadingSpinner } from "@/components/loading";
import { API_ENDPOINT } from "@/env";

export default function RootLayout() {
    const [loaded] = useFonts({
        'PixelifySans': `${API_ENDPOINT}/assets/fonts/PixelifySans.ttf`,
      });

    if (!loaded) {
        return <LoadingSpinner />
    }

    return (
        // global async store
        <ReduxProvider store={store}>
            {/* alerts, confirmation modals, etc. */}
            <ModalProvider>
                {/* authentication provision */}
                <AuthProvider>
                    {/* drawing canvas data */}
                    <CanvasProvider>
                        {/* image data */}
                        <ImagesProvider>
                            {/* maps data */}
                            <MapsProvider>
                                {/* game data */}
                                <GameProvider>
                                    {/* component theme */}
                                    <PaperProvider theme={theme}>
                                        <Index />
                                    </PaperProvider>
                                </GameProvider>
                            </MapsProvider>
                        </ImagesProvider>
                    </CanvasProvider>
                </AuthProvider>
            </ModalProvider>
        </ReduxProvider>
    );
}
