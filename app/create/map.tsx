import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import EntypoIcons from "react-native-vector-icons/Entypo";
import {
    CANVAS_SIZE,
    CELL_SIZE,
    CellData,
    useCanvas,
} from "../context/canvas_context";
import { Image } from "@/redux/models/image.model";
import { LayerPreview } from "@/components/canvas";
import { cloneDeep } from "lodash";
import { theme } from "@/app/_theme";
import { useModals } from "../context/modalContext";
import { ImagesScrollView } from "./images";
import { DrawerButton } from "@/components/draw_drawer_content";
import { MapProps } from "../types/navigation";
import { Button } from "react-native-paper";
import { Typography } from "@mui/joy";

const MAP_DIMENSIONS = 6;
const SCALE = 3;

type MapCoords = {
    images: Image<CellData[][]>[];
    preview: React.JSX.Element | undefined;
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

    function createImageMap() {
        const newMap: MapCoords[][] = [];
        for (let y = 0; y < MAP_DIMENSIONS; y++) {
            newMap.push([]);
            for (let x = 0; x < MAP_DIMENSIONS; x++) {
                newMap[y].push({
                    images: [],
                    preview: undefined,
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
        setSelectedImage(image);
    }

    // places selected image at given coordinates on map
    function handlePlaceImage(x: number, y: number) {
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
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images.push(selectedImage);
        setImageMap(_imageMap);
    }

    if (isUsingCanvas) return null;
    return (
        <>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <View
                        style={[
                            styles.mapCellContainer,
                            {
                                borderBottomWidth: 1,
                            },
                        ]}
                    >
                        {imageMap?.map((row) =>
                            row.map((mc, i) => (
                                <Pressable
                                    onPress={() =>
                                        handlePlaceImage(mc.mapX, mc.mapY)
                                    }
                                    key={i}
                                >
                                    <View
                                        style={[
                                            styles.mapCell,
                                            {
                                                borderTopWidth: 1,
                                                borderRightWidth: 1,
                                                borderLeftWidth:
                                                    mc.x < MAP_DIMENSIONS - 1
                                                        ? 1
                                                        : 0,
                                            },
                                        ]}
                                    >
                                        {mc.images &&
                                            mc.images.map((image, i) => (
                                                // TODO: adjust coordinates relative to
                                                // image.x,y and map placement
                                                <View
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
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
                    <Pressable
                        style={[styles.toolButton, { backgroundColor: "#DDDDDD" }]}
                        onPress={() => setImagesModalVisible(true)}
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
                </View>
                {/* image selection modal*/}
                <Modal
                    transparent
                    animationType="fade"
                    visible={imagesModalVisible}
                >
                    <Pressable
                        style={styles.modalContainer}
                        onPress={() => setImagesModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <ImagesScrollView
                                onPress={handleSelectImage}
                                navigateToCanvas={() =>
                                    navigation.navigate("draw")
                                }
                            />
                        </View>
                        <View style={{ marginTop: 0, zIndex: 100 }}>
                            <Button
                                mode="outlined"
                                uppercase={false}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: "white",
                                    width: 115,
                                }}
                                onPress={() => setImagesModalVisible(false)}
                            >
                                <Typography>Close</Typography>
                            </Button>
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
        ...theme.shadow.small,
        margin: 5,
        padding: 20,
        maxHeight: "80%",
        backgroundColor: "#FFFFFF",
        borderRadius: 6,
    },
    toolButtonContainer: {
        // backgroundColor: "red",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15
    },
    toolButton: {
        ...theme.shadow.small,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
    },
    mapContainer: {},
    mapCellContainer: {
        ...theme.shadow.small,
        flexDirection: "row",
        flexWrap: "wrap",
        height: CELL_SIZE * SCALE * MAP_DIMENSIONS,
        width: CELL_SIZE * SCALE * MAP_DIMENSIONS,
    },
    mapRow: {},
    mapCell: {
        width: CELL_SIZE * SCALE,
        height: CELL_SIZE * SCALE,
        borderColor: "#000000",
    },
});
