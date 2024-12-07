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
        },
        text: {
            color: "#000000",
            fontSize: 32,
        }
    },
    shadow: {
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
