import React from "react";
import { imageSlice } from "@/redux/image.slice";
import { useAuth } from "../context/auth_context";
import { useEffect } from "react";
import { Image } from "@/redux/models/image.model";
import { useModals } from "../context/modalContext";
import { LayerPreview } from "@/components/canvas";
import { CellData, useCanvas } from "../context/canvas_context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ImagesProps } from "../types/navigation";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "react-native-paper";
import { DrawerButton } from "@/components/draw_drawer_content";
import { Typography } from "@mui/joy";
import { theme } from "../_theme";

export default function Images({ navigation }: ImagesProps) {
    const { setConfirmModal } = useModals();
    const { setEditImage } = useCanvas();

    function handleEdit(image: Image<CellData[][]>) {
        setConfirmModal(`Edit ${image.name}?`, (confirm) => {
            if (confirm) {
                setEditImage(image);
                navigation.navigate("draw");
            }
        });
    }

    return (
        <>
            <DrawerButton onPress={() => navigation.openDrawer()} />
            <View style={styles.header}>
                <Typography fontSize={16}>Saved Images</Typography>
            </View>
            <ImagesScrollView
                onPress={(image) => handleEdit(image)}
                navigateToCanvas={() => navigation.navigate("draw")}
            />
        </>
    );
}

export const ImagesScrollView = ({
    onPress,
    navigateToCanvas,
}: {
    onPress: (image: Image<CellData[][]>) => void;
    navigateToCanvas: () => void;
}) => {
    const { token } = useAuth();
    const [getImages, images] =
        imageSlice.endpoints.getUserImages.useLazyQuery();
    const { isUsingCanvas } = useCanvas();
    const { setMessageModal } = useModals();

    useEffect(() => {
        if (token && !images.data) {
            getImages(token).then((res) => {
                if (res.error) {
                    setMessageModal("Error getting images");
                }
            });
        }
    }, [token]);

    if (images.isLoading || images.isFetching) {
        return <LoadingSpinner />;
    }

    if (!images.data || (images.data && images.data.length === 0)) {
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

    if (isUsingCanvas) return null;
    return (
        <ScrollView style={styles.scrollview}>
            <View style={styles.contentContainer}>
                <View style={styles.imagesContainer}>
                    {images.data?.map((image, index) => (
                        <Pressable key={index} onPress={() => onPress(image)}>
                            <View style={styles.previewContainer}>
                                <LayerPreview
                                    data={image.data}
                                    cellSize={6}
                                    style={{ backgroundColor: "#DDDDDD" }}
                                />
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
        justifyContent: 'center',
        flexWrap: "wrap",
        gap: 20,
    },
    previewContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
