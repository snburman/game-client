import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CANVAS_SIZE, CELL_SIZE, CellData } from "../context/canvas_context";
import { ImagesScrollView } from "../images";
import { MapProps } from "../types/navigation";
import { Image } from "@/redux/models/image.model";
import { LayerPreview } from "@/components/canvas";
import { cloneDeep } from "lodash";
import { theme } from "@/app/_theme";

const MAP_DIMENSIONS = 6;
const SCALE = 3;

type MapCoords = {
    image: Image<CellData[][]> | undefined;
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

    function createImageMap() {
        const newMap: MapCoords[][] = [];
        for (let y = 0; y < MAP_DIMENSIONS; y++) {
            newMap.push([]);
            for (let x = 0; x < MAP_DIMENSIONS; x++) {
                newMap[y].push({
                    image: undefined,
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
        console.log(x, y);
        const _imageMap = cloneDeep(imageMap);
        _imageMap[y][x].image = selectedImage;
        setImageMap(_imageMap);
    }

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
                                                // borderBottomWidth: mc.y == (MAP_DIMENSIONS -1) ? 144 : 0,
                                            },
                                        ]}
                                    >
                                        {mc.image?.data && (
                                            <LayerPreview
                                                data={mc.image.data}
                                                cellSize={3.7}
                                            />
                                        )}
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
                        navigateToCanvas={() => navigation.navigate("create")}
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
        height: 135,
        width: "100%",
        borderWidth: 1,
        borderColor: "#000000",
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
