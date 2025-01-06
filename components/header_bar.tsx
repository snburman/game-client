import { Pressable, StyleSheet, Text, View } from "react-native";
import { type BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/app/context/auth_context";
import FeatherIcons from "react-native-vector-icons/Feather";

export default function HeaderBar({ navigation }: BottomTabHeaderProps) {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.profileContainer}
                onPress={() => navigation.navigate("settings")}
            >
                <Text style={styles.userName}>{user?.username}</Text>
                <FeatherIcons name="user" size={16}/>
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
        backgroundColor: "#FFFFFF",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
        cursor: "pointer",
    },
    userName: {
        marginRight: 5,
    },
});
