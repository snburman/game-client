import React, { useState } from "react";
import Canvas, {
    ClearButton,
    EraserButton,
    FillButton,
    GridButton,
    RedoButton,
    SaveButton,
    UndoButton,
} from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { StyleSheet, View } from "react-native";
import { CANVAS_SIZE, useCanvas } from "../context/canvas_context";

export default function Create() {
    const [modalVisible, setModalVisible] = useState(false);
    const { cellSize } = useCanvas();
    return (
        <View style={styles.wrapper}>
                <Canvas width={CANVAS_SIZE} height={CANVAS_SIZE} />
                <View style={[styles.toolContainer, {width: cellSize * CANVAS_SIZE}]}>
                    <SaveButton />
                    <ClearButton />
                    <GridButton />
                    <EraserButton />
                    <ColorPicker
                        visible={modalVisible}
                        setVisible={setModalVisible}
                    />
                    <FillButton />
                    <UndoButton />
                    <RedoButton />
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    toolContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
        flexWrap: "wrap",
        width: "100%",
        marginTop: 15,
    },
});
