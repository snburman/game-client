import { useWindowDimensions } from "react-native";

const MAX_WIDTH = 700;

export function useDevice() {
    const { width } = useWindowDimensions();
    const isMobile = width < MAX_WIDTH;

    return {
        isMobile
    }
}