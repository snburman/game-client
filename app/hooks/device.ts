import { useWindowDimensions } from "react-native";

const MAX_WIDTH = 700;

export function useDevice() {
    const { width, height } = useWindowDimensions();
    const isMobile = width < MAX_WIDTH;
    const isIpadLandscape = width < 1000 && !isMobile;

    return {
        isMobile,
        isIpadLandscape,
        width,
        height,
    }
}