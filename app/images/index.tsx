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
    const { token } = useAuth();
    const { setMessageModal, setConfirmModal } = useModals();
    const [getImages, images] =
        imageSlice.endpoints.getUserImages.useLazyQuery();
    const { setEditImage, isUsingCanvas, setIsUsingCanvas } = useCanvas();

    useEffect(() => {
        if (token && !images.data) {
            getImages(token).then((res) => {
                if (res.error) {
                    setMessageModal("You have no images yet");
                }
            });
        }
    }, [token]);

    function handleUseCanvas() {
        setIsUsingCanvas(true);
        navigation.navigate("create");
    }

    function handleEdit(image: Image<CellData[][]>) {
        setConfirmModal(`Edit ${image.name}?`, (confirm) => {
            if (confirm) {
                // imageSlice.util.resetApiState();
                setEditImage(image);
                handleUseCanvas();
            }
        });
    }

    // reduces memory overhead
    if (isUsingCanvas) {
        return null;
    }

    
    if(images.isLoading) {
        return <LoadingSpinner />
    }

    if(!images.data || (images.data && images.data.length === 0)) {
        return(
            <View style={styles.noDataContainer}>
                <Text>No saved images</Text>
                <Button uppercase={false} mode="outlined" onPress={handleUseCanvas}>
                    <Text>Start Drawing</Text>
                </Button>
            </View>
        )
    }

    return (
        <ScrollView style={styles.scrollview}>
            <View style={styles.contentContainer}>
                <View style={styles.imagesContainer}>
                    {images.data?.map((image, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleEdit(image)}
                        >
                            <View style={styles.previewContainer}>
                                <LayerPreview data={image.data} cellSize={8} />
                                <Text>{image.name}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
        gap: 20,
    },
    scrollview: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#FFFFFF",
    },
    contentContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
    },
    imagesContainer: {
        width: "75%",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        // padding: 6,
    },
    previewContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
});
