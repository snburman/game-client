import { Pressable, StyleSheet, View } from "react-native";
import { type BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/app/context/auth_context";
import FeatherIcons from "react-native-vector-icons/Feather";
import EntypoIcons from "react-native-vector-icons/Entypo";
import { Typography } from "@mui/joy";
import { useGame } from "@/app/context/game_context";

export default function HeaderBar({ navigation }: BottomTabHeaderProps) {
    const { user } = useAuth();
    const { setIsPlaying } = useGame();

    function handleNavigation(route: string) {
        setIsPlaying(route === "game");
        navigation.navigate(route);
    }

    return (
        <View style={styles.container}>
            <View style={styles.menuButtonContainer}>
                <Pressable
                    onPress={() => handleNavigation("home")}
                    style={styles.menuButton}
                >
                    <EntypoIcons name="home" style={styles.icon} />
                </Pressable>
                <Pressable
                    onPress={() => handleNavigation("create")}
                    style={styles.menuButton}
                >
                    <EntypoIcons name="pencil" style={styles.icon} />
                </Pressable>
                <Pressable
                    onPress={() => handleNavigation("game")}
                    style={styles.menuButton}
                >
                    <EntypoIcons name="game-controller" style={styles.icon} />
                </Pressable>
            </View>
            <Pressable
                style={styles.profileContainer}
                onPress={() => handleNavigation("settings")}
            >
                <Typography style={styles.userName} fontSize={16}>
                    {user?.username}
                </Typography>
                <FeatherIcons name="user" size={18} color={"#FFFFFF"} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#009D17",
    },
    menuButtonContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft: 18,
        height: "100%",
        gap: 15,
        // backgroundColor: 'red'
    },
    menuButton: {
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 100,
    },
    icon: {
        fontSize: 20,
        color: "#3F3F3F",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        cursor: "pointer",
    },
    userName: {
        marginRight: 5,
        color: "#FFFFFF",
    },
});
