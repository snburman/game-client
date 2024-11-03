import React from "react";
import Canvas from "@/components/canvas";
import { View } from "react-native";

export default function Draw() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Canvas width={16} height={16} />
        </View>
    );
}
