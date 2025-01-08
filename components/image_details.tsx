import React from "react";
import { CellData } from "@/app/context/canvas_context";
import { Image } from "@/redux/models/image.model";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Typography } from "@mui/joy";

export default function ImageDetails({
    image,
}: {
    image: Image<CellData[][]>;
}) {
    if (!image) return null;

    return (
        <View style={styles.container}>
            <Typography>{image.name}</Typography>
            <TextInput
                label="Name"
                value={image.name}
                onChangeText={(name) => {}}
                mode="outlined"
                style={styles.input}
            />
            Test
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    input: {
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        width: 250,
    },
});
