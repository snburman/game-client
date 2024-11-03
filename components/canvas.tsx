import React from "react";
import { CellData, useCanvas } from "@/app/context/canvas_context";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export default function Canvas({width, height}: { width: number; height: number }) {
    const { setCoords, setIsPanning, setIsPointerDown, getLayer, setLayer, selectedLayer, currentColor } =
        useCanvas();

    function updateLayer(index: number, x: number, y: number) {
        const layer = getLayer(index);
        if(!layer) {
            throw new Error(`Layer ${index} not found`);
        };
        layer.set(`${x}-${y}`, currentColor);
        setLayer(index, layer);
    }

    const gesture = Gesture.Pan()
    .onStart((event) => {
        const { x, y } = event;
        handleGesture(x, y);
    })
    .onChange((event) => {
        const { x, y } = event;
        handleGesture(x, y);
    });

    function handleGesture(x: number, y: number) {
        setCoords({ x, y });
        setIsPanning(true);
        setIsPointerDown(true);

        if (x < 0 || y < 0) return;
        if (x > width * 20 || y > height * 20) return;
        const _x = Math.floor(y / 20);
        const _y = Math.floor(x / 20);
        updateLayer(selectedLayer, _x, _y);
    }

    return (
        <GestureDetector gesture={gesture}>
            <View>
                <Layer
                    index={0}
                    width={width}
                    height={height}
                    update={updateLayer}
                />
            </View>
        </GestureDetector>
    );
}

const Layer = (props: {
    index: number;
    width: number;
    height: number;
    update(index: number, x: number, y: number): void;
}) => {
    const { index,  width, height, update } = props;
    const { cells } = useCanvas();

    if (!cells[index]) return null;
    return (
        <View
            style={[
                styles.layerContainer,
                { width: 20 * width, height: 20 * height },
            ]}
        >
            {cells[index].map((row, x) =>
                row.map((cell, y) => (
                    <Pressable
                        style={{ zIndex: index }}
                        key={`${x}-${y}`}
                        onPress={() => update(index, x, y)}
                    >
                        <Cell color={cell.color} />
                    </Pressable>
                ))
            )}
        </View>
    );
};

const Cell = ({ color }: { color: string }) => {
    return <View style={[styles.cell, { backgroundColor: color }]} />;
};

function generateCells(width: number, height: number): CellData[][] {
    const cells: CellData[][] = [];
    for (let x = 0; x < width; x++) {
        cells.push([]);
        for (let y = 0; y < height; y++) {
            cells[x].push({ x, y, color: "transparent" });
        }
    }
    return cells;
}

function generateLayer(width: number, height: number): Map<string, string> {
    const layer = new Map();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            layer.set(`${x}-${y}`, "transparent");
        }
    }
    return layer;
}

const styles = StyleSheet.create({
    layerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cell: {
        width: 20,
        height: 20,
        borderColor: "#000000",
        borderWidth: 1,
    },
});
