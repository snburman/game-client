import React from "react";
import {
    imageSlice,
    useDeleteImageMutation,
    useLazyGetUserImagesQuery,
} from "@/redux/image.slice";
import { useAuth } from "../context/auth_context";
import { useEffect } from "react";
import { Image } from "@/redux/models/image.model";
import { useModals } from "../context/modal_context";
import { LayerPreview } from "@/components/canvas";
import { CellData, useCanvas } from "../context/canvas_context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ImagesProps } from "../types/navigation";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "react-native-paper";
import { DrawerButton } from "@/components/draw_drawer_content";
import { Typography } from "@mui/joy";
import { theme } from "../_theme";
import Svg, { Rect } from "react-native-svg";

export default function Images({ navigation }: ImagesProps) {
    const { setMessageModal, setConfirmModal, setPlainModal } = useModals();
    const { setEditImage, isUsingCanvas } = useCanvas();
    const [deleteImage] = useDeleteImageMutation();
    const [getImages, images] = useLazyGetUserImagesQuery();
    const { token } = useAuth();

    useEffect(() => {
        if (!images.data && token) {
            getImages(token);
        }
    }, [images, token]);

    function handleEdit(image: Image<CellData[][]>) {
        const options: { label: string; fn: () => void }[] = [
            {
                label: "Edit",
                fn: () => {
                    setEditImage(image);
                    navigation.navigate("draw");
                },
            },
            {
                label: "Delete",
                fn: () => {
                    setConfirmModal(`Delete ${image.name}?`, (confirm) => {
                        if (confirm && image._id && token) {
                            deleteImage({ token, id: image._id }).then(
                                (res) => {
                                    if (!res.error) {
                                        setMessageModal(
                                            "Image deleted successfully"
                                        );
                                        getImages(token);
                                    }
                                }
                            );
                        }
                    });
                },
            },
        ];
        setPlainModal(
            <View style={{ alignItems: "center", gap: 15 }}>
                <LayerPreview
                    {...image}
                    cellSize={6}
                    style={{ backgroundColor: "#DDDDDD" }}
                />
                <Typography>{image.name}</Typography>
                <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: "row", gap: 10, width: 200 }}>
                        {options.map((opt, i) => (
                            <Button
                                mode="outlined"
                                uppercase={false}
                                key={i}
                                onPress={() => {
                                    opt.fn();
                                    setPlainModal(undefined);
                                }}
                                style={{ flex: 1 }}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </View>
                    <View>
                        <Button
                            mode="outlined"
                            uppercase={false}
                            onPress={() => setPlainModal(undefined)}
                        >
                            Close
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    if (isUsingCanvas) return null;
    return (
        <>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <View style={styles.header}>
                {/* TODO: Add guide button to open modal */}
            </View>
            <ImagesScrollView
                images={images.data}
                isLoading={images.isLoading && images.isFetching}
                onPress={(image) => handleEdit(image)}
                navigateToCanvas={() => navigation.navigate("draw")}
            />
        </>
    );
}

export const ImagesScrollView = ({
    images,
    isLoading,
    onPress,
    navigateToCanvas,
}: {
    images: Image<CellData[][]>[] | undefined;
    isLoading: boolean;
    onPress: (image: Image<CellData[][]>) => void;
    navigateToCanvas: () => void;
}) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if ((!images && !isLoading) || (images && images.length === 0)) {
        return (
            <View style={styles.noDataContainer}>
                <Text>No saved images</Text>
                <Button
                    uppercase={false}
                    mode="outlined"
                    onPress={navigateToCanvas}
                >
                    <Text>Start Drawing</Text>
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollview}>
            <View style={styles.contentContainer}>
                <View style={styles.imagesContainer}>
                    {images?.map((image, index) => (
                        <Pressable key={index} onPress={() => onPress(image)}>
                            <View style={styles.previewContainer}>
                                <LayerPreview
                                    {...image}
                                    cellSize={6}
                                    style={{ backgroundColor: "#DDDDDD" }}
                                />
                            </View>
                            <View style={styles.detailsContainer}>
                                <Typography fontSize={16}>
                                    {image.name}
                                </Typography>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export function ImageDataToSVG({ height, width, data }: Image<CellData[][]>) {
    const SCALE = 3.5;
    return (
        <Svg
            height={height * SCALE}
            width={width * SCALE}
            viewBox="0 0 16 16"
            style={{ backgroundColor: "transparent" }}
            fill={"transparent"}
        >
            {data.map((row) =>
                row.map((cell, i) => (
                    <Rect
                        x={cell.y}
                        y={cell.x}
                        width={1}
                        height={1}
                        fill={cell.color}
                        key={i}
                    />
                ))
            )}
        </Svg>
    );
}

const styles = StyleSheet.create({
    noDataContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        gap: 20,
    },
    header: {
        ...theme.shadow.small,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    scrollview: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF",
    },
    contentContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
    },
    imagesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 20,
    },
    previewContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 125,
        gap: 5,
    },
    detailsContainer: {
        alignItems: "center",
    },
});
