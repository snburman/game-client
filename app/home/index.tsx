import { Typography } from "@mui/joy";
import { Pressable, StyleSheet, View } from "react-native";
import { HomeProps } from "../types/navigation";
import { theme } from "../_theme";
import { useGame } from "../context/game_context";

export default function Home({navigation}: HomeProps) {
    const {setIsPlaying} = useGame();
    return (
        <View style={styles.container}>
            <Typography style={styles.title}>Welcome to Bitscrawler</Typography>
            <Typography style={{...theme.typography.fonts.PixelifySans, fontSize: 24}}>
                HOW TO PLAY
            </Typography>
            <View style={{gap: 10}}>
                <Typography style={styles.listItem}>
                    1. Draw some images
                </Typography>
                <Typography style={styles.listItem}>
                    2. Create a map
                </Typography>
                <Typography style={styles.listItem}>
                    3. Explore your world
                </Typography>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("create")
                    }}
                >
                    <Typography style={styles.buttonText}>Create World</Typography>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        setIsPlaying(true);
                        navigation.navigate("game")
                    }}
                >
                    <Typography style={styles.buttonText}>Play</Typography>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    title: {
        ...theme.typography.fonts.PixelifySans,
        fontSize: 28,
        fontWeight: "bold",
    },
    listItem: {
        ...theme.typography.fonts.PixelifySans,
        fontSize: 18,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        gap: 10,
    },
    button: {
        backgroundColor: "#009D17",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        ...theme.typography.fonts.PixelifySans,
        color: "#FFFFFF",
    },
});