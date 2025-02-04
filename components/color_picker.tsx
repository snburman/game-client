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

const colors = [
    "#FFD6D6",
    "#FFC4C4",
    "#FF9D9D",
    "#FF6666",
    "#FF3333",
    "#CC0000",
    "#990000",
    "#FFE0CC",
    "#FFD1A6",
    "#FFB366",
    "#FF9933",
    "#FF8000",
    "#CC6600",
    "#994C00",
    "#FFF5CC",
    "#FFEB99",
    "#FFEA80",
    "#FFE066",
    "#FFD633",
    "#CCAA00",
    "#997F00",
    "#CCF2D9",
    "#B3EFC6",
    "#80E6A1",
    "#4DCC7A",
    "#1AB34D",
    "#00802F",
    "#00591F",
    "#CCE6FF",
    "#B3D9FF",
    "#80C0FF",
    "#4DA6FF",
    "#1A8CFF",
    "#0066CC",
    "#004C99",
    "#D9CCFF",
    "#CCB3FF",
    "#AA80FF",
    "#884DFF",
    "#661AFF",
    "#4D00CC",
    "#330099",
    "#F2CCFF",
    "#EEB3FF",
    "#E180FF",
    "#D64DFF",
    "#CC1AFF",
    "#9900CC",
    "#660099",
    "#000000",
    "#404040",
    "#808080",
    "#BFBFBF",
    "#FFFFFF",
];

// const colors = [
//     "#616161",
//     "#000088",
//     "#1F0E99",
//     "#371379",
//     "#561360",
//     "#5D0110",
//     "#520E00",
//     "#3A2308",
//     "#21340C",
//     "#0E410F",
//     "#184417",
//     "#003A1E",
//     "#012F57",
//     "#000000",
//     "#AAAAAA",
//     "#0E4DC4",
//     "#4B24DD",
//     "#6912CF",
//     "#9014AD",
//     "#9D1C47",
//     "#923305",
//     "#505050",
//     "#5C6912",
//     "#157A11",
//     "#138007",
//     "#117649",
//     "#1B6690",
//     "#000000",
//     "#FCFCFC",
//     "#629AFC",
//     "#8A7DFC",
//     "#B06AFC",
//     "#DD6DF2",
//     "#E771AB",
//     "#E38558",
//     "#CC9E22",
//     "#A8B100",
//     "#72C100",
//     "#59CC4D",
//     "#35C28E",
//     "#4FBECE",
//     "#424242",
//     "#FCFCFC",
//     "#BED3FB",
//     "#CACAFC",
//     "#D9C4FC",
//     "#ECC1FC",
//     "#F9C3E7",
//     "#F6CEC3",
//     "#E2CDA6",
//     "#DADB9C",
//     "#C8E39E",
//     "#BEE5B8",
//     "#B2EAC7",
//     "#B6E5EB",
//     "#ACACAC",
// ];
