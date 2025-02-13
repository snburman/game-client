import { theme } from "@/app/_theme";
import { useCanvas } from "@/app/context/canvas_context";
import { useDevice } from "@/app/hooks/device";
import { Typography } from "@mui/joy";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import EntypoIcons from "react-native-vector-icons/Entypo";

export default function DrawDrawerContent({
    navigation,
}: DrawerContentComponentProps) {
    const { setIsUsingCanvas } = useCanvas();

    const routes: { path: "draw" | "images" | "map"; label: string, icon: string }[] = [
        { path: "draw", label: "Draw", icon: "pencil" },
        { path: "images", label: "Images", icon: "image" },
        { path: "map", label: "Maps", icon: "map" },
    ];

    function handlePress(path: "draw" | "images" | "map") {
        if (path == "draw") {
            setIsUsingCanvas(true);
        } else {
            setIsUsingCanvas(false);
        }
        navigation.closeDrawer();
        navigation.navigate(path);
    }

    return (
        <View style={styles.container}>
            {routes.map((route, i) => (
                <Pressable
                    onPress={() => handlePress(route.path)}
                    style={styles.menuButton}
                    key={i}
                >
                    <EntypoIcons name={route.icon} style={styles.icon} />
                    <Typography style={styles.routeLabel}>{route.label}</Typography>
                </Pressable>
            ))}
        </View>
    );
}

export const DrawerButton = ({
    onPress,
    style,
}: {
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
}) => {
    const { isMobile } = useDevice();

    if (!isMobile) return null;
    return (
        <Pressable onPress={onPress} style={[styles.drawerButton, style]}>
            <IonIcons name="menu-outline" size={30} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
    },
    menuButton: {
        flexDirection: "row",
        padding: 15,
        paddingLeft: 20,
    },
    drawerButton: {
        ...theme.shadow.small,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomRightRadius: 6,
        zIndex: 100,
    },
    routeLabel: {
        ...theme.typography.fonts.PixelifySans,
        fontSize: 18,
    },
    icon: {
        fontSize: 20,
        marginRight: 15,
    },
});
