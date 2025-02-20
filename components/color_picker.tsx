import React from "react";
import { theme } from "@/app/_theme";
import { useCanvas } from "@/app/context/canvas_context";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function ColorSelector({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}) {
    const { currentColor, setCurrentColor, previousColor } = useCanvas();

    function handlePressColorIndicator() {
        if (currentColor === "transparent" && previousColor !== "transparent") {
            setCurrentColor(previousColor);
        }
        setVisible(true);
    }

    function handleSelectColor(color: string) {
        setCurrentColor(color);
        setVisible(false);
    }

    return (
        <>
            <Pressable onPress={handlePressColorIndicator}>
                <View
                    style={[styles.preview, { backgroundColor: currentColor }]}
                />
            </Pressable>
            <Modal transparent animationType="fade" visible={visible}>
                <Pressable
                    style={styles.modalContainer}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.swatchContainer}>
                            {colors.map((color, i) => {
                                const isCurrent = color === currentColor;
                                return (
                                    <Pressable
                                        key={i}
                                        onPress={() => handleSelectColor(color)}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: isCurrent ? 24 : 25,
                                                    height: 25,
                                                    borderWidth: isCurrent
                                                        ? 1
                                                        : 0,
                                                    borderColor: "red",
                                                },
                                                { backgroundColor: color },
                                            ]}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>
                        <Button
                            style={styles.button}
                            onPress={() => setVisible(false)}
                        >
                            <Text>Close</Text>
                        </Button>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    preview: {
        width: 50,
        height: 50,
        borderRadius: 5,
        ...theme.shadow.small,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 35,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 100,
        ...theme.shadow.small,
    },
    modalContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        cursor: "auto",
    },
    swatchContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 100,
    },
    swatchItem: {
        width: 25,
        height: 25,
    },
    button: {
        marginTop: 10,
        width: 100,
        borderWidth: 1,
        borderRadius: 5,
        ...theme.shadow.small,
    },
});

// const colors = [
//     "#FFD6D6",
//     "#FFC4C4",
//     "#FF9D9D",
//     "#FF6666",
//     "#FF3333",
//     "#CC0000",
//     "#990000",
//     "#FFE0CC",
//     "#FFD1A6",
//     "#FFB366",
//     "#FF9933",
//     "#FF8000",
//     "#CC6600",
//     "#994C00",
//     "#FFF5CC",
//     "#FFEB99",
//     "#FFEA80",
//     "#FFE066",
//     "#FFD633",
//     "#CCAA00",
//     "#997F00",
//     "#CCF2D9",
//     "#B3EFC6",
//     "#80E6A1",
//     "#4DCC7A",
//     "#1AB34D",
//     "#00802F",
//     "#00591F",
//     "#CCE6FF",
//     "#B3D9FF",
//     "#80C0FF",
//     "#4DA6FF",
//     "#1A8CFF",
//     "#0066CC",
//     "#004C99",
//     "#D9CCFF",
//     "#CCB3FF",
//     "#AA80FF",
//     "#884DFF",
//     "#661AFF",
//     "#4D00CC",
//     "#330099",
//     "#F2CCFF",
//     "#EEB3FF",
//     "#E180FF",
//     "#D64DFF",
//     "#CC1AFF",
//     "#9900CC",
//     "#660099",
//     "#000000",
//     "#404040",
//     "#808080",
//     "#BFBFBF",
//     "#FFFFFF",
// ];

const colors = [
    "#FFB3B3",
    "#FF9999",
    "#FF6666",
    "#FF3333",
    "#FF0000",
    "#CC0000",
    "#990000",
    "#FFD1B3",
    "#FFB366",
    "#FF8000",
    "#FF6600",
    "#CC5200",
    "#993D00",
    "#662200",
    "#FFFFB3",
    "#FFFF66",
    "#FFFF00",
    "#CCCC00",
    "#999900",
    "#666600",
    "#4D4D00",
    "#B3FFB3",
    "#66FF66",
    "#00FF00",
    "#00CC00",
    "#009900",
    "#006600",
    "#004D00",
    "#B3D9FF",
    "#66B2FF",
    "#007FFF",
    "#005FCC",
    "#004099",
    "#002266",
    "#001A66",
    "#D1B3FF",
    "#A366FF",
    "#6600FF",
    "#4D00CC",
    "#330099",
    "#1A0066",
    "#000033",
    "#F2B3FF",
    "#E066FF",
    "#CC00FF",
    "#9900CC",
    "#660099",
    "#330066",
    "#1A0033",
    "#FFFFFF",
    "#E0E0E0",
    "#BFBFBF",
    "#808080",
    "#404040",
    "#1A1A1A",
    "#000000",
];
