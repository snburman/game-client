import React, { useState } from "react";
import Canvas, { ClearButton, EraserButton, GridButton } from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { CANVAS_SIZE } from "../context/canvas_context";

export default function Draw() {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View>
                <Canvas width={CANVAS_SIZE} height={CANVAS_SIZE} />
                <View style={styles.toolContainer}>
                    <ClearButton />
                    <GridButton />
                    <EraserButton />
                    <ColorPicker
                        visible={modalVisible}
                        setVisible={setModalVisible}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    toolContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        // gap: 15,
        width: "100%",
        marginTop: 15,
    }
});
