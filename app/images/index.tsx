import React from "react";
import { imageSlice } from "@/redux/image.slice";
import { useAuth } from "../context/auth_context";
import { useEffect, useState } from "react";
import { Image } from "@/redux/models/image.model";
import { useModals } from "../context/modalContext";
import { LayerPreview } from "@/components/canvas";
import { CellData, useCanvas } from "../context/canvas_context";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ImagesProps } from "../types/navigation";

export default function Images({ navigation }: ImagesProps) {
    const { token } = useAuth();
    const { setMessageModal, setConfirmModal } = useModals();
    const [getImages, getImagesResult] =
        imageSlice.endpoints.getUserImages.useLazyQuery();
    const [images, setImages] = useState<Image<CellData[][]>[] | undefined>(
        undefined
    );
    const { setEditImage } = useCanvas();

    useEffect(() => {
        if (token) {
            getImages(token).then((res) => {
                if (res.error) {
                    setMessageModal("You have no images yet");
                }
            });
        }
    }, [token]);

    useEffect(() => {
        if (getImagesResult.data) {
            setImages(getImagesResult.data);
        }
    }, [getImagesResult]);

    function handleEdit(image: Image<CellData[][]>) {
        setConfirmModal(`Edit ${image.name}?`, (confirm) => {
            if(confirm) {
                setEditImage(image);
                navigation.navigate('create')
            }
        })
    }

    return (
        <ScrollView style={styles.scrollview}>
            <View style={styles.contentContainer}>
                <View style={styles.imagesContainer}>
                    {images?.map((image, index) => (
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
