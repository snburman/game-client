import { extendTheme } from "@mui/joy";
import { configureFonts, MD2LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
        primary: "#000000",
        secondary: "#00000036"
    },
    typography: {
        fonts: {
            PixelifySans: {
                fontFamily: "PixelifySans",
            },
        },
        button: {
            fontFamily: "PixelifySans",
            textTransform: "none",
            color: "#000000",
        },
        text: {
            fontFamily: "PixelifySans",
            color: "#000000",
            fontSize: 32,
        },
    },
    shadow: {
        input: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2.5,
        },
        small: {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
    },
};