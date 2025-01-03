import { StyleSheet, Text, View } from "react-native";
import { type BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { useAuth } from "@/app/context/auth_context";
import { Button } from "react-native-paper";
import { theme } from "@/app/_theme";

export default function HeaderBar({ navigation }: BottomTabHeaderProps) {
    const { user, logOut } = useAuth();
    async function handleLogout() {
        await logOut()
    }

    return (
        <View style={styles.container}>
            <Text>{user?.username}</Text>
            <Button uppercase={false} onPress={handleLogout}>
                <Text>Logout</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        ...theme.shadow.small
    },
});
