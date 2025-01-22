import { useState } from "react";
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
import { StyleSheet, View } from "react-native";
import { DrawProps } from "../types/navigation";
import { DrawerButton } from "@/components/draw_drawer_content";

export default function Draw({ navigation }: DrawProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { canvasSize } = useCanvas();

    return (
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
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 40,
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
        top: 15,
        right: 15,
    },
});
