import React, { useEffect, useState } from "react";
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
import { StyleSheet, Text, View } from "react-native";
import { CANVAS_SIZE, useCanvas } from "../context/canvas_context";
import { Button } from "react-native-paper";
import { CreateProps } from "../types/navigation";

export default function Create({ navigation }: CreateProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { cellSize, setIsUsingCanvas } = useCanvas();

    function handlePressImages() {
        setIsUsingCanvas(false);
        navigation.navigate("images");
    }

    return (
        <View style={styles.container}>
            <Canvas width={CANVAS_SIZE} height={CANVAS_SIZE} />
            <View
                style={[
                    styles.toolContainer,
                    { width: cellSize * CANVAS_SIZE },
                ]}
            >
                <View style={styles.toolButtonCompartment}>
                    <SaveButton />
                    <ClearButton />
                    <EraserButton />
                    <ColorPicker
                        visible={modalVisible}
                        setVisible={setModalVisible}
                    />
                </View>
                <View style={styles.toolButtonCompartment}>
                    <UndoButton />
                    <RedoButton />
                    <FillButton />
                    <GridButton />
                </View>
            </View>
            <Button onPress={handlePressImages}>
                <Text>Images</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    toolContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        marginTop: 15,
    },
    toolButtonCompartment: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 5,
        flexWrap: "wrap",
    },
});
