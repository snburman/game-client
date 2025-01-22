import React, { useCallback, useState } from "react";
import { useCanvas } from "@/app/context/canvas_context";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { theme } from "@/app/_theme";
import { Button, TextInput } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PlainModal, { modalStyles } from "./modal";
import { Input } from "@mui/joy";
import { useModals } from "@/app/context/modal_context";
import { Modal } from "react-native";
import { ImageType, CellData } from "@/redux/models/image.model";
import { useImages } from "@/app/context/images_context";

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
            <View
                style={[
                    styles.allLayersContainer,
                    { backgroundColor: "#DDDDDD" },
                ]}
            >
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

export const LayerPreview = ({
    data,
    cellSize,
    width = 16,
    height = 16,
    style,
}: {
    data: CellData[][];
    cellSize: number;
    width?: number;
    height?: number;
    style?: StyleProp<ViewStyle>;
}) => {
    return (
        <View
            style={[
                style,
                styles.layerContainer,
                { width: cellSize * width, height: cellSize * height },
            ]}
        >
            {data.map((row, x) =>
                row.map((cell, i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: cell.color,
                            width: cellSize,
                            height: cellSize,
                        }}
                    />
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
    const {
        currentColor,
        setCurrentColor,
        previousColor,
        setPreviousColor,
        setFill,
    } = useCanvas();

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
                            ? "#00000033"
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
    const { setConfirmModal } = useModals();

    function handlePress() {
        setConfirmModal("Erase drawing?", (confirm) => {
            confirm && clearLayer(selectedLayerIndex);
        });
    }

    return (
        <>
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
    const { name, setName, imageType, setImageType } = useCanvas();
    const { saveImage } = useImages();
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [options, setOptions] = useState<
        { label: string; value: ImageType }[]
    >([
        { label: "Tile", value: "tile" },
        { label: "Object", value: "object" },
        { label: "Player Up", value: "player_up" },
        { label: "Player Down", value: "player_down" },
        { label: "Player Left", value: "player_left" },
        { label: "Player Right", value: "player_right" },
    ]);

    function handleSave() {
        saveImage(name, imageType);
        setModalVisible(false);
    }

    return (
        <>
            <PlainModal visible={modalVisible} setVisible={setModalVisible}>
                <View style={{ gap: 10, zIndex: 200 }}>
                    <Input
                        variant="outlined"
                        onChange={(e) => setName(e.target.value)}
                        value={name === "untitled" ? "" : name}
                        placeholder={"Untitled"}
                        size="lg"
                    />
                    <DropDownPicker
                        placeholder="Select a type"
                        open={dropdownOpen}
                        setOpen={setDropdownOpen}
                        value={imageType}
                        setValue={(t) =>
                            setImageType(t as unknown as ImageType)
                        }
                        items={options}
                        setItems={setOptions}
                        style={{
                            borderColor: "#D4D5D6",
                            backgroundColor: "#FBFCFE",
                            ...theme.shadow.input,
                        }}
                        labelStyle={{
                            borderColor: "FFF",
                            marginLeft: 8,
                        }}
                        textStyle={{
                            fontWeight: "400",
                            fontSize: 18,
                            color: "#6D6E6F",
                        }}
                        zIndex={1000}
                        zIndexInverse={1000}
                    />
                </View>
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

export const NewCanvasButton = () => {
    const { newCanvas } = useCanvas();
    const { setMessageModal } = useModals();
    const [modalVisible, setModalVisible] = useState(false);
    const [width, setWidth] = useState(16);
    const [height, setHeight] = useState(16);

    function handleToggle() {
        setModalVisible(!modalVisible);
    }

    function handleSubmit() {
        if (width > 16 || height > 16) {
            setMessageModal("Values must be 16 or less");
            return;
        }
        if (width < 4 || height < 4) {
            setMessageModal("Values must be 4 or greater");
            return;
        }
        newCanvas(width, height);
        setModalVisible(false);
    }

    function aToI(s: string) {
        if (s === "") return 0;
        s = s.replace(/[^0-9]/g, "");
        return parseInt(s);
    }

    function ItoA(n: number) {
        const s = n.toString();
        if (s == "") return "0";
        return s;
    }

    return (
        <>
            <Modal transparent animationType="fade" visible={modalVisible}>
                <Pressable
                    style={modalStyles.modalContainer}
                    onPress={handleToggle}
                >
                    <Pressable style={[modalStyles.modalContent, { gap: 10 }]}>
                        <View style={styles.row}>
                            <TextInput
                                label={"Width (min: 4, max: 16)"}
                                value={ItoA(width)}
                                mode="outlined"
                                style={{ backgroundColor: "white" }}
                                onChangeText={(w) => setWidth(aToI(w))}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                label={"Height (min: 4, max: 16)"}
                                value={ItoA(height)}
                                mode="outlined"
                                style={{ backgroundColor: "white" }}
                                onChangeText={(h) => setHeight(aToI(h))}
                            />
                        </View>
                        <Button
                            mode="outlined"
                            uppercase={false}
                            onPress={handleSubmit}
                            style={{ width: "100%" }}
                        >
                            <Text>Start Drawing</Text>
                        </Button>
                        <Button
                            mode="outlined"
                            uppercase={false}
                            onPress={() => setModalVisible(false)}
                            style={{ width: "100%" }}
                        >
                            <Text>Cancel</Text>
                        </Button>
                    </Pressable>
                </Pressable>
            </Modal>
            <Pressable onPress={handleToggle} style={styles.toolButton}>
                <MaterialCommunityIcons
                    name="file-plus-outline"
                    style={styles.toolIcon}
                />
            </Pressable>
        </>
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
    row: {
        flexDirection: "row",
    },
});
