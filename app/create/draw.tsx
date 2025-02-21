import { useEffect, useState } from "react";
import { useCanvas } from "../context/canvas_context";
import Canvas, {
    ClearButton,
    EraserButton,
    FillButton,
    GridButton,
    NewCanvasButton,
    RedoButton,
    SaveButton,
    UndoButton,
} from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { DrawProps } from "../types/navigation";
import { DrawerButton } from "@/components/draw_drawer_content";
import { useModals } from "../context/modal_context";
import { Text } from "react-native";

export default function Draw({ navigation }: DrawProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { setAlert } = useModals();
    const { canvasSize } = useCanvas();

    useEffect(() => {
        setAlert(
            "warning",
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    flex: 1,
                }}
            >
                <Text>Need some help? </Text>
                <Pressable
                    style={{
                        backgroundColor: "#EE6300",
                        padding: 5,
                        borderRadius: 5,
                        width: 150,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() =>
                        Linking.openURL(
                            "https://docs.bitscrawler.com/docs/guide-drawing/create-drawing"
                        )
                    }
                >
                    <Text style={{ color: "#fff" }}>Player's Guide</Text>
                </Pressable>
            </View>
        );
    }, []);

    return (
        <>
            <View style={styles.container}>
                <DrawerButton onPress={() => navigation.openDrawer()} />
                <Canvas {...canvasSize} />
                <View style={styles.toolContainer}>
                    <View style={styles.toolButtons}>
                        <SaveButton />
                        <ClearButton />
                        <EraserButton />
                        <ColorPicker
                            visible={modalVisible}
                            setVisible={setModalVisible}
                        />
                    </View>
                    <View style={styles.toolButtons}>
                        <UndoButton />
                        <RedoButton />
                        <FillButton />
                        <GridButton />
                    </View>
                </View>
                <View style={styles.newCanvasButton}>
                    <NewCanvasButton />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
    },
    toolContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 15,
    },
    toolButtons: {
        width: "100%",
        flexDirection: "row",
        gap: 5,
    },
    newCanvasButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
});
