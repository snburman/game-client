import React, { useState } from "react";
import Canvas, {
    ClearButton,
    EraserButton,
    FillButton,
    GridButton,
    SaveButton,
} from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { CANVAS_SIZE, useCanvas } from "../context/canvas_context";

export default function Draw() {
    const [modalVisible, setModalVisible] = useState(false);
    const { cellSize } = useCanvas();
    return (
        <SafeAreaView style={styles.wrapper}>
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
                </View>
        </SafeAreaView>
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
