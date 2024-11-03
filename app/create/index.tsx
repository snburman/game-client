import React, { useState } from "react";
import Canvas from "@/components/canvas";
import ColorPicker from "@/components/color_picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

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
                <Canvas width={16} height={16} />
                <View style={styles.colorPickerContainer}>
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
    colorPickerContainer: {
        display: "flex",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 15,
    }
});