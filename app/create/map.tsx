import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CANVAS_SIZE, CELL_SIZE, CellData, useCanvas } from "../context/canvas_context";
import { ImagesScrollView } from "./images";
import { MapProps } from "../types/navigation";
import { Image } from "@/redux/models/image.model";
import { LayerPreview } from "@/components/canvas";
import { cloneDeep } from "lodash";
import { theme } from "@/app/_theme";
import { useModals } from "../context/modalContext";

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

export default function Map() {
    const [imageMap, setImageMap] = useState<MapCoords[][]>(createImageMap());
    const [selectedImage, setSelectedImage] = useState<
        Image<CellData[][]> | undefined
    >();
    const { setMessageModal } = useModals();
    const { isUsingCanvas } = useCanvas();

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

    console.log(imageMap);
    function handleSelectImage(image: Image<CellData[][]>) {
        setSelectedImage(image);
    }

    function handlePlaceImage(x: number, y: number) {
        if (!selectedImage) {
            setMessageModal("Select an image to place on the map");
            return;
        }
        if (imageMap[y][x].images.length === 2) {
            setMessageModal("This area already has two (2) images");
            return;
        }
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].images.push(selectedImage);
        setImageMap(_imageMap);
    }

    if(isUsingCanvas) return null;
    return (
        <>
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
                                                <View
                                                    style={{ zIndex: i * 100, position: 'absolute', top: 0, left: 0}}
                                                    key={i}
                                                >
                                                    <LayerPreview
                                                        data={image.data}
                                                        cellSize={3.7}
                                                    />
                                                </View>
                                            ))}
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
                <Pressable style={{}}>
                    {selectedImage ? (
                        <LayerPreview data={selectedImage?.data} cellSize={2} />
                    ) : (
                        <></>
                    )}
                </Pressable>
                <View style={styles.imagesContainer}>
                    <ImagesScrollView
                        onPress={handleSelectImage}
                        // TODO: use drawer navigation
                        // navigateToCanvas={() => navigation.navigate("create")}
                        navigateToCanvas={() => {}}
                    />
                </View>
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
    imagesContainer: {
        ...theme.shadow.small,
        height: "100%",
        maxWidth: "80%",
        width: 400,
        // borderWidth: 1,
        // borderColor: "#000000",
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 100,
    },
    mapContainer: {
        flex: 1,
        alignItems: "center",
    },
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
