import { CellData, LayerMap, useCanvas } from "@/app/context/canvas_context";
import React, { createRef, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export default function Canvas({width, height}: { width: number; height: number }) {
    const { setCoords, setIsPanning, setIsPointerDown, layers, setLayer, selectedLayer, currentColor } =
        useCanvas();

    function updateLayer(index: number, x: number, y: number) {
        if(!layers[index]) return;
        layers[index].set(`${x}-${y}`, currentColor);
        setLayer(index, layers[index]);
    }

    // Will be used to move layers around
    function moveLayer(from: number, to: number) {
        layers.splice(to, 0, layers.splice(from, 1)[0]);
    }

    const gesture = Gesture.Pan().onChange((event) => {
        const { x, y } = event;
        setCoords({ x, y });
        setIsPanning(true);
        setIsPointerDown(true);

        if (x < 0 || y < 0) return;
        if (x > width * 20 || y > height * 20) return;
        const _x = Math.floor(y / 20);
        const _y = Math.floor(x / 20);
        updateLayer(selectedLayer, _x, _y);
    });

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
    const { index, update, width, height } = props;
    const { cells, coords, isPanning, isPointerDown } =
        useCanvas();

    function handleDraw(x: number, y: number) {
        update(index, x, y);
    }

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
                        onPress={() => handleDraw(x, y)}
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
