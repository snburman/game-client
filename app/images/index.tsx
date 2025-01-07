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

export default function Images({ navigation }: ImagesProps) {
    const { setConfirmModal } = useModals();
    const { setEditImage } = useCanvas();

    // TODO: Provide Edit, Delete, Cancel button options
    function handleEdit(image: Image<CellData[][]>) {
        setConfirmModal(`Edit ${image.name}?`, (confirm) => {
            if (confirm) {
                // imageSlice.util.resetApiState();
                setEditImage(image);
                navigation.navigate("create");
            }
        });
    }

    return (
        <ImagesScrollView
            onPress={(image) => handleEdit(image)}
            navigateToCanvas={() => navigation.navigate("create")}
        />
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
                                <LayerPreview data={image.data} cellSize={6}/>
                                <Text>{image.name}</Text>
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
    scrollview: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ECECEC",
    },
    contentContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
    },
    imagesContainer: {
        width: "90%",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        // backgroundColor: 'red'
    },
    previewContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
