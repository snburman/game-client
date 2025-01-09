import { useState } from "react";
import { useCanvas } from "../context/canvas_context";
import Canvas, { ClearButton, EraserButton, FillButton, GridButton, RedoButton, SaveButton, UndoButton,  } from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { StyleSheet, View } from "react-native";
import { DrawProps } from "../types/navigation";
import { DrawerButton } from "@/components/draw_drawer_content";

export default function Draw({ navigation }: DrawProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { canvasSize, setCanvasSize, cellSize } = useCanvas();

    // TODO: Open dialogue box for new canvas, user can enter name, type, and dimensions of
    // image or use provided defaults.

    return (
        <View style={styles.container}>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <Canvas width={canvasSize} height={canvasSize} />
            <View
                style={[
                    styles.toolContainer,
                    // { width: cellSize * canvasSize },
                ]}
            >
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
        width: '100%',
        flexDirection: "row",
        gap: 5,
    },
});