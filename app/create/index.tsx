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
import { StyleSheet, Text, View } from "react-native";
import { CANVAS_SIZE, useCanvas } from "../context/canvas_context";
import { Button } from "react-native-paper";
import { CreateProps } from "../types/navigation";

export default function Create({ navigation }: CreateProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const { cellSize, setIsUsingCanvas } = useCanvas();

    function handlePress(path: "images" | "map" ) {
        setIsUsingCanvas(false);
        navigation.navigate(path);
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
            <View style={styles.navButtonContainer}>
                <Button
                    onPress={() => handlePress("images")}
                    uppercase={false}
                    mode="outlined"
                    style={styles.navButton}
                >
                    <Text>Images</Text>
                </Button>
                <Button
                    onPress={() => handlePress("map")}
                    uppercase={false}
                    mode="outlined"
                    style={styles.navButton}
                >
                    <Text>Map</Text>
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
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
    toolButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        gap: 5,
        flexWrap: "wrap",
    },
    navButtonContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 15
    },
    navButton: {
        width: 150,
        backgroundColor: "#FFFFFF"
    }
});
