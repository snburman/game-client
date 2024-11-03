import { MD2LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
        primary: "#000000",
        accent: "#000000",
    },
    typography: {
        button: {
            textTransform: "none",
            color: "#000000",
        }
    },
    shadow: {
        small: {
            shadowColor: "black",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: {
                width: 0,
                height: 0,
            },
        }
    }
}