import React, { useCallback } from "react";
import { useCanvas } from "@/app/context/canvas_context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { theme } from "@/app/_theme";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Canvas({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const { update } = useCanvas();

    const longPress = Gesture.LongPress()
        .minDuration(0)
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        });

    const pan = Gesture.Pan()
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        })
        .onChange((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        });

    const tap = Gesture.Tap().onStart((event) => {
        const { x, y } = event;
        handleGesture(x, y);
    });

    const gesture = Gesture.Simultaneous(tap, pan, longPress);

    function handleGesture(x: number, y: number) {
        if (x < 0 || y < 0) return;
        if (x > width * 20 || y > height * 20) return;
        const _x = Math.floor(y / 20);
        const _y = Math.floor(x / 20);
        update(_x, _y);
    }

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.allLayersContainer}>
                <Layer index={0} width={width} height={height} />
            </View>
        </GestureDetector>
    );
}

const Layer = (props: { index: number; width: number; height: number }) => {
    const { index, width, height } = props;
    const { cells, getCells, cellSize } = useCanvas();

    const _cells = useCallback(() => getCells(index), [cells[index], index])();

    if (!_cells) return null;
    return (
        <View
            style={[
                styles.layerContainer,
                { width: cellSize * width, height: cellSize * height },
            ]}
        >
            {_cells.map((row, x) =>
                row.map((cell, y) => (
                    <Pressable style={{ zIndex: index }} key={`${x}-${y}`}>
                        <Cell
                            x={cell.x}
                            y={cell.y}
                            color={cell.color}
                            width={cellSize}
                            height={cellSize}
                        />
                    </Pressable>
                ))
            )}
        </View>
    );
};

const Cell = ({
    x,
    y,
    color,
    width,
    height,
}: {
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
}) => {
    const { grid } = useCanvas();
    return (
        <View
            style={{ backgroundColor: color, width, height,
                borderTopWidth: x === 0 && grid ? 1 : 0,
                borderRightWidth: grid ? 1 : 0,
                borderLeftWidth: y === 0 && grid ? 1 : 0,
                borderBottomWidth: grid ? 1 : 0,
                borderColor: "#000000",
            }}
        />
    );
};

// Grid button controls the visibility of the canvas grid
export const GridButton = () => {
    const { grid, setGrid } = useCanvas();
    const gridOn = <MaterialCommunityIcons name="grid" style={styles.toolIcon}/>;
    const gridOff = <MaterialCommunityIcons name="grid-off" style={styles.toolIcon}/>;
    return (
        <Button onPress={() => setGrid(!grid)} style={styles.toolButton}>
                {grid ? gridOn : gridOff }
        </Button>
    );
}

export const EraserButton = () => {
    const { currentColor, setCurrentColor } = useCanvas();
    return (
        <Button onPress={() => setCurrentColor("transparent")} style={[styles.toolButton, {
            backgroundColor: currentColor === "transparent" ? "rgba(0,0,0,0.2)" : "#FFFFFF",
        }]}>
            <MaterialCommunityIcons name="eraser" style={styles.toolIcon}/>
        </Button>
    );
}

const styles = StyleSheet.create({
    allLayersContainer: {
        ...theme.shadow.small,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
    },
    layerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    toolButton: {
        height: 50,
        width: 50,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        ...theme.shadow.small,
    },
    toolIcon: {
        fontSize: 35,
        fontWeight: "light",
        color: "rgba(0, 0, 0, 0.7)",
        padding: 0,
    },
});
