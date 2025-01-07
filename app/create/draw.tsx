import { useState } from "react";
import { CANVAS_SIZE, useCanvas } from "../context/canvas_context";
import Canvas, { ClearButton, EraserButton, FillButton, GridButton, RedoButton, SaveButton, UndoButton,  } from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { StyleSheet, View } from "react-native";
import { DrawProps } from "../types/navigation";
import { DrawerButton } from "@/components/draw_drawer_content";

export default function Draw({ navigation }: DrawProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { cellSize } = useCanvas();

    return (
        <View style={styles.container}>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <Canvas width={CANVAS_SIZE} height={CANVAS_SIZE} />
            <View
                style={[
                    styles.toolContainer,
                    { width: cellSize * CANVAS_SIZE },
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
        paddingTop: 40
    },
    toolContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        marginTop: 15,
    },
    toolButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 5,
        flexWrap: "wrap",
    },
    navButton: {
        width: 150,
        backgroundColor: "#FFFFFF"
    }
});