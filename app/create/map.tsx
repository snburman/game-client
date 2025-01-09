import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import EntypoIcons from "react-native-vector-icons/Entypo";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import {
    CANVAS_SIZE,
    CELL_SIZE,
    CellData,
    useCanvas,
} from "../context/canvas_context";
import { Image, ImageType } from "@/redux/models/image.model";
import { LayerPreview } from "@/components/canvas";
import { cloneDeep } from "lodash";
import { theme } from "@/app/_theme";
import { useModals } from "../context/modalContext";
import { ImagesScrollView } from "./images";
import { DrawerButton } from "@/components/draw_drawer_content";
import { MapProps } from "../types/navigation";
import { Button } from "react-native-paper";
import { Radio, Typography } from "@mui/joy";
import { Slider } from "@react-native-assets/slider";
import PlainModal from "@/components/modal";
import { ScrollView } from "react-native-gesture-handler";
import { useDevice } from "../hooks/device";

const MAP_DIMENSIONS = 6;
const SCALE = 3;
const TILE_SIZE = 2.75;

type MapCoords = {
    images: Image<CellData[][]>[];
    x: number;
    y: number;
    mapX: number;
    mapY: number;
};

export default function Map({ navigation }: MapProps) {
    const [imageMap, setImageMap] = useState<MapCoords[][]>(createImageMap());
    const [selectedImage, setSelectedImage] = useState<
        Image<CellData[][]> | undefined
    >();
    const { setMessageModal } = useModals();
    const { isUsingCanvas } = useCanvas();
    const [imagesModalVisible, setImagesModalVisible] = useState(false);
    // indicates that pressing a tile will trigger editing of the contents
    const [editDetailsOn, setEditDetailsOn] = useState(false);
    const [editCoords, setEditCoords] = useState<
        { x: number; y: number } | undefined
    >();
    const { isMobile, width } = useDevice();

    function createImageMap() {
        const newMap: MapCoords[][] = [];
        for (let y = 0; y < MAP_DIMENSIONS; y++) {
            newMap.push([]);
            for (let x = 0; x < MAP_DIMENSIONS; x++) {
                newMap[y].push({
                    images: [],
                    x: x * CANVAS_SIZE * SCALE,
                    y: y * CANVAS_SIZE * SCALE,
                    mapX: x,
                    mapY: y,
                });
            }
        }
        return newMap;
    }

    function handleSelectImage(image: Image<CellData[][]>) {
        setImagesModalVisible(false);
        let _image = cloneDeep(image);
        _image.type = "tile";
        setSelectedImage(_image);
    }

    // places selected image at given coordinates on map
    function handlePressTile(x: number, y: number) {
        setEditCoords({ x, y });
        if (editDetailsOn) return;
        // if(editDetailsOn) return;
        // cannot place empty image
        if (!selectedImage) {
            setMessageModal("Select an image to place on the map", () =>
                setImagesModalVisible(true)
            );

            return;
        }
        // maximum two images per cell
        const coords = imageMap[y][x];
        if (coords.images.length === 2) {
            setMessageModal("This area already has two (2) images");
            return;
        }
        // disregard duplicate images
        if (
            coords.images[coords.images.length - 1] &&
            coords.images[coords.images.length - 1].name === selectedImage.name
        ) {
            return;
        }
        // set image
        const image = cloneDeep(selectedImage);
        image.x = x * image.width * SCALE;
        image.y = y * image.height * SCALE;
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images.push(image);
        setImageMap(_imageMap);
    }

    function handlePressEditDetailsButton() {
        setEditDetailsOn(!editDetailsOn);
    }

    function handleTypeRadioButton(
        x: number,
        y: number,
        index: number,
        type: ImageType
    ) {
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images[index].type = type;
        setImageMap(_imageMap);
    }

    function handleXSliderChange(
        x: number,
        y: number,
        index: number,
        value: number
    ) {
        const _imageMap = cloneDeep(imageMap);
        console.log(value, x, y);
        _imageMap[y][x].images[index].x = value;
        setImageMap(_imageMap);
    }

    function handleYSliderChange(
        x: number,
        y: number,
        index: number,
        value: number
    ) {
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images[index].y = value;
        setImageMap(_imageMap);
    }

    if (isUsingCanvas) return null;
    console.log(imageMap);
    return (
        <>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <View
                style={[
                    styles.container,
                    { justifyContent: isMobile ? "flex-end" : "center" },
                ]}
            >
                <View style={styles.mapContainer}>
                    <View style={[styles.mapCellContainer]}>
                        {imageMap?.map((row) =>
                            row.map((mc, i) => (
                                <Pressable
                                    onPress={() =>
                                        handlePressTile(mc.mapX, mc.mapY)
                                    }
                                    key={i}
                                >
                                    <View
                                        style={[
                                            styles.mapCell,
                                            {
                                                borderWidth: 0.5,
                                            },
                                        ]}
                                    >
                                        {mc.images &&
                                            mc.images.map((image, i) => (
                                                <View
                                                    style={{
                                                        position: "absolute",
                                                        top:
                                                            image.y -
                                                            mc.mapY *
                                                                image.height *
                                                                SCALE,
                                                        left:
                                                            image.x -
                                                            mc.mapX *
                                                                image.width *
                                                                SCALE,
                                                    }}
                                                    key={i}
                                                >
                                                    <LayerPreview
                                                        data={image.data}
                                                        cellSize={3.68}
                                                    />
                                                </View>
                                            ))}
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
                {/* tool button bar */}
                <View style={styles.toolButtonContainer}>
                    {/* image selection button */}
                    <Pressable
                        style={[
                            styles.toolButton,
                            { backgroundColor: "#DDDDDD" },
                        ]}
                        onPress={() => {
                            setEditDetailsOn(false);
                            setEditCoords(undefined);
                            setImagesModalVisible(true);
                        }}
                    >
                        {selectedImage ? (
                            <LayerPreview
                                data={selectedImage?.data}
                                cellSize={2.75}
                            />
                        ) : (
                            <EntypoIcons name="images" size={30} />
                        )}
                    </Pressable>
                    {/* Edit details button */}
                    <Pressable
                        style={[
                            styles.toolButton,
                            {
                                backgroundColor: editDetailsOn
                                    ? "#0000004D"
                                    : "#FFFFFF",
                            },
                        ]}
                        onPress={handlePressEditDetailsButton}
                    >
                        <FontAwesomeIcons name="hand-pointer-o" size={30} />
                    </Pressable>
                </View>
                {/* MODALS */}
                {/* image selection modal*/}
                <PlainModal
                    visible={imagesModalVisible}
                    setVisible={setImagesModalVisible}
                    style={{ padding: 0 }}
                >
                    <View style={styles.imagesModalContent}>
                        <ImagesScrollView
                            onPress={handleSelectImage}
                            navigateToCanvas={() => {
                                navigation.navigate("draw");
                                setImagesModalVisible(false);
                            }}
                        />
                    </View>
                    <Button
                        mode="outlined"
                        uppercase={false}
                        style={{
                            marginTop: 10,
                            backgroundColor: "#FFFFFF",
                            width: 115,
                        }}
                        onPress={() => setImagesModalVisible(false)}
                    >
                        <Typography>Close</Typography>
                    </Button>
                </PlainModal>
                {/* editor panel*/}
                <View
                    style={[
                        styles.editorPanel,
                        width > 520 && {
                            height: 200,
                        },
                        width > 1270 && {
                            ...styles.panelRight,
                            height: "100%",
                        },
                        width > 1074 && {
                            marginRight: (width - 1074) / 8,
                        },
                    ]}
                >
                    <ScrollView
                        contentContainerStyle={styles.editorPanelContent}
                    >
                        {editCoords &&
                            imageMap[editCoords.y][editCoords.x].images.map(
                                (image, i) => (
                                    <View
                                        key={i}
                                        style={styles.editDetailsItem}
                                    >
                                        <View style={{ ...theme.shadow.small }}>
                                            <LayerPreview
                                                data={image.data}
                                                cellSize={TILE_SIZE}
                                            />
                                        </View>
                                        <View>
                                            <View style={styles.rowContainer}>
                                                <Radio
                                                    checked={
                                                        image.type == "tile"
                                                    }
                                                    onChange={() =>
                                                        handleTypeRadioButton(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            "tile"
                                                        )
                                                    }
                                                />
                                                <Typography>Tile</Typography>
                                            </View>
                                            <View style={styles.rowContainer}>
                                                <Radio
                                                    checked={
                                                        image.type == "object"
                                                    }
                                                    onChange={() =>
                                                        handleTypeRadioButton(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            "object"
                                                        )
                                                    }
                                                />
                                                <Typography>Object</Typography>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={styles.rowContainer}>
                                                <Typography>X</Typography>
                                                <Slider
                                                    value={image.x}
                                                    step={1}
                                                    minimumValue={
                                                        editCoords.x *
                                                        (image.width * SCALE)
                                                    }
                                                    maximumValue={
                                                        editCoords.x *
                                                            (image.width *
                                                                SCALE) +
                                                        image.width * SCALE
                                                    }
                                                    style={styles.slider}
                                                    onValueChange={(value) =>
                                                        handleXSliderChange(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            value
                                                        )
                                                    }
                                                    thumbTintColor={"#019B0B"}
                                                />
                                            </View>
                                            <View style={styles.rowContainer}>
                                                <Typography>Y</Typography>
                                                <Slider
                                                    value={image.y}
                                                    step={1}
                                                    minimumValue={
                                                        editCoords.y *
                                                        (image.height * SCALE)
                                                    }
                                                    maximumValue={
                                                        editCoords.y *
                                                            (image.height * SCALE) +
                                                        image.height * SCALE
                                                    }
                                                    style={styles.slider}
                                                    onValueChange={(value) =>
                                                        handleYSliderChange(
                                                            editCoords.x,
                                                            editCoords.y,
                                                            i,
                                                            value
                                                        )
                                                    }
                                                    thumbTintColor={"#019B0B"}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )
                            )}
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    mapContainer: {
        // backgroundColor: "red",
    },
    mapCellContainer: {
        ...theme.shadow.small,
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 0.5,
        borderColor: "#757575",
        height: CELL_SIZE * SCALE * MAP_DIMENSIONS + 1,
        width: CELL_SIZE * SCALE * MAP_DIMENSIONS + 1,
    },
    mapCell: {
        width: CELL_SIZE * SCALE,
        height: CELL_SIZE * SCALE,
        borderColor: "#5F5F5F",
    },
    toolButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: "100%",
        paddingTop: 10,
    },
    toolButton: {
        ...theme.shadow.small,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
    },
    imagesModalContent: {
        height: 500,
        maxHeight: "80%",
        width: 600,
        maxWidth: "90%",
    },
    editorPanel: {
        width: 375,
        height: 125,
    },
    editorPanelContent: {
        height: "100%",
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    editDetailsItem: {
        flexDirection: "row",
        padding: 5,
        gap: 10,
    },
    panelRight: {
        position: "absolute",
        justifyContent: "center",
        top: 0,
        right: 0,
        width: 300,
        paddingBottom: 50,
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        gap: 5,
    },
    slider: {
        marginLeft: 10,
        paddingLeft: 10,
        width: 100,
        padding: 10,
    },
});
