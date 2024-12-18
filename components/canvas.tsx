import React, { useCallback, useMemo, useState } from "react";
import { useCanvas } from "@/app/context/canvas_context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { theme } from "@/app/_theme";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PlainModal, { ConfirmModal, modalStyles } from "./modal";
import { Input, Typography } from "@mui/joy";

// Canvas component represents the drawing area containing width * height pixels
export default function Canvas({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const { update, fill, fillColor, layers, cellSize, setIsPressed } =
        useCanvas();

    const longPress = Gesture.LongPress()
        .minDuration(0)
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        })
        .onEnd(() => {
            setIsPressed(false);
        });

    const pan = Gesture.Pan()
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        })
        .onEnd(() => {
            setIsPressed(false);
        })
        .onChange((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        });

    const tap = Gesture.Tap()
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        })
        .onEnd(() => {
            setIsPressed(false);
        });

    const gesture = Gesture.Simultaneous(tap, pan, longPress);

    function handleGesture(x: number, y: number) {
        if (x < 0 || y < 0) return;
        if (x > width * cellSize || y > height * cellSize) return;
        const _x = Math.floor(y / cellSize);
        const _y = Math.floor(x / cellSize);
        if (fill) {
            fillColor(_x, _y);
            return;
        }
        update(_x, _y);
    }

    return (
        <GestureDetector gesture={gesture}>
            <View style={styles.allLayersContainer}>
                {layers.map((_, index) => (
                    <Layer
                        key={index}
                        index={index}
                        width={width}
                        height={height}
                    />
                ))}
            </View>
        </GestureDetector>
    );
}

// Layer component represents a single layer of the canvas
// Multiple layers are currently slated for future development
const Layer = (props: { index: number; width: number; height: number }) => {
    const { index, width, height } = props;
    const { cells, getCells, cellSize } = useCanvas();

    const _cells = useCallback(() => {
        return getCells(index);
    }, [cells[index], index])();

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

// Cell component represents a single pixel on the canvas of dimensions width * height
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
            style={{
                backgroundColor: color,
                width,
                height,
                borderTopWidth: x === 0 && grid ? 1 : 0,
                borderRightWidth: grid ? 1 : 0,
                borderLeftWidth: y === 0 && grid ? 1 : 0,
                borderBottomWidth: grid ? 1 : 0,
                borderColor: "#000000",
            }}
        />
    );
};

///////////////////////////////////////////////////////////////////////////
// Tool Buttons
// Buttons used to control the canvas, displayed in the toolbar
///////////////////////////////////////////////////////////////////////////

// Grid button controls the visibility of the canvas grid
export const GridButton = () => {
    const { grid, setGrid } = useCanvas();
    const gridOn = (
        <MaterialCommunityIcons name="grid" style={styles.toolIcon} />
    );
    const gridOff = (
        <MaterialCommunityIcons name="grid-off" style={styles.toolIcon} />
    );
    return (
        <Pressable onPress={() => setGrid(!grid)} style={styles.toolButton}>
            {grid ? gridOn : gridOff}
        </Pressable>
    );
};

// Eraser button toggles between eraser and previous color
export const EraserButton = () => {
    const { currentColor, setCurrentColor, previousColor, setPreviousColor, setFill } =
        useCanvas();

    function handlePress() {
        if (currentColor !== "transparent") {
            setPreviousColor(currentColor);
            setCurrentColor("transparent");
            setFill(false);
        } else {
            setCurrentColor(previousColor);
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={[
                styles.toolButton,
                {
                    backgroundColor:
                        currentColor === "transparent"
                            ? "rgba(0,0,0,0.2)"
                            : "#FFFFFF",
                },
            ]}
        >
            <MaterialCommunityIcons
                name="eraser"
                style={[styles.toolIcon, { color: "#E771AB" }]}
            />
        </Pressable>
    );
};

// Clear button erases the canvas
export const ClearButton = () => {
    const { clearLayer, selectedLayerIndex } = useCanvas();
    const [modalVisible, setModalVisible] = useState(false);

    function handlePress() {
        setModalVisible(true);
    }

    function handleConfirm(confirm: boolean) {
        if (confirm) {
            clearLayer(selectedLayerIndex);
        }
        setModalVisible(false);
    }

    return (
        <>
            <ConfirmModal
                visible={modalVisible}
                setVisible={setModalVisible}
                onConfirm={handleConfirm}
                message="Erase drawing?"
            />
            <Pressable onPress={handlePress} style={styles.toolButton}>
                <MaterialCommunityIcons
                    name="delete"
                    style={[styles.toolIcon, { color: "#D2042D" }]}
                />
            </Pressable>
        </>
    );
};

export const SaveButton = () => {
    const { save, name, setName } = useCanvas();
    const [modalVisible, setModalVisible] = useState(false);

    function handleSave() {
        save();
        setModalVisible(false);
    }

    return (
        <>
            <PlainModal visible={modalVisible} setVisible={setModalVisible}>
                <Typography
                    style={{ alignSelf: "flex-start", paddingBottom: 5 }}
                >
                    Title
                </Typography>
                <Input
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    value={name === "untitled" ? "" : name}
                    placeholder={name}
                    size="lg"
                />
                <View style={modalStyles.modalButtonContainer}>
                    <Button
                        onPress={handleSave}
                        style={modalStyles.modalButton}
                    >
                        <Text>Save</Text>
                    </Button>
                    <Button
                        onPress={() => setModalVisible(false)}
                        style={modalStyles.modalButton}
                    >
                        <Text>Cancel</Text>
                    </Button>
                </View>
            </PlainModal>
            <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.toolButton}
            >
                <MaterialCommunityIcons
                    name="content-save"
                    style={[styles.toolIcon, { color: "#138007" }]}
                />
            </Pressable>
        </>
    );
};

// Fill button toggles the bucket fill tool
export const FillButton = () => {
    const { fill, setFill } = useCanvas();

    return (
        <Pressable
            onPress={() => setFill(!fill)}
            style={[
                styles.toolButton,
                {
                    backgroundColor: fill ? "rgba(0,0,0,0.4)" : "#FFFFFF",
                },
            ]}
        >
            <MaterialCommunityIcons
                name="format-color-fill"
                style={[styles.toolIcon, { paddingTop: 5, color: "#000000" }]}
            />
        </Pressable>
    );
};

export const UndoButton = () => {
    const { canUndo, undo } = useCanvas();

    return (
        <Pressable onPress={undo} style={styles.toolButton} disabled={!canUndo}>
            <MaterialCommunityIcons
                name="undo"
                style={[
                    styles.toolIcon,
                    { color: "#0E4DC4", opacity: !canUndo ? 0.5 : 1 },
                ]}
            />
        </Pressable>
    );
};

export const RedoButton = () => {
    const { canRedo, redo } = useCanvas();

    return (
        <Pressable onPress={redo} style={styles.toolButton} disabled={!canRedo}>
            <MaterialCommunityIcons
                name="redo"
                style={[
                    styles.toolIcon,
                    { color: "#0E4DC4", opacity: !canRedo ? 0.5 : 1 },
                ]}
            />
        </Pressable>
    );
};

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        marginBottom: 5,
        ...theme.shadow.small,
    },
    toolIcon: {
        fontSize: 35,
        color: "rgba(0, 0, 0, 0.7)",
        padding: 0,
    },
});
