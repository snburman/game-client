import Canvas from "@/components/canvas";
import React, { useRef, useState } from "react";
import { PanResponder, Text, View } from "react-native";
import { useCanvas } from "../context/canvas_context";

export default function Draw() {
    const { setIsPointerDown, setIsPanning } = useCanvas();

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderStart: () => {
                setIsPanning(true);
            },
            onPanResponderEnd(e, gestureState) {
                setIsPanning(false);
            },
        })
    );
    return (
        <View
            {...panResponder.current.panHandlers}
            onPointerDown={() => setIsPointerDown(true)}
            onPointerUp={() => setIsPointerDown(false)}
            onTouchStart={() => setIsPointerDown(true)}
            onTouchEnd={() => setIsPointerDown(false)}
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
