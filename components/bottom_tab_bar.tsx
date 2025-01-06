import { theme } from "@/app/_theme";
import { useCanvas } from "@/app/context/canvas_context";
import { Typography } from "@mui/joy";
import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Link } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import EntypoIcons from "react-native-vector-icons/Entypo";

export default function BottomTabBar(props: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <Link to={'/'}>
                <View style={styles.iconWrapper}>
                    <EntypoIcons name="home" style={[styles.icon, {color: '#CC7722'}]} />
                    <Typography style={styles.iconText}>Home</Typography>
                </View>
            </Link>
            <Link to={'/create'}>
                <View style={styles.iconWrapper}>
                    <EntypoIcons name="pencil" style={[styles.icon, {color: '#FFC000'}]} />
                    <Typography style={styles.iconText}>Create</Typography>
                </View>
            </Link>
            <Link to={'/game'}>
                <View style={styles.iconWrapper}>
                    <EntypoIcons name="game-controller" style={[styles.icon, {color: '#138007'}]} />
                    <Typography style={styles.iconText}>Play</Typography>
                </View>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...theme.shadow.small,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF"
    },
    icon: {
        fontSize: 35,
    },
    iconWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25
    },
    iconText: {
        fontWeight: 'bold'
    }
});
