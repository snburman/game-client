import React from "react";
import { useCanvas } from "@/app/context/canvas_context";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

export default function Canvas({
    width,
    height,
}: {
    width: number;
    height: number;
}) {
    const { update } = useCanvas();

    const longPress = Gesture.LongPress()
        .minDuration(0)
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        });

    const pan = Gesture.Pan()
        .onStart((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        })
        .onChange((event) => {
            const { x, y } = event;
            handleGesture(x, y);
        });

    const tap = Gesture.Tap().onStart((event) => {
        const { x, y } = event;
        handleGesture(x, y);
    });

    const gesture = Gesture.Simultaneous(tap, pan, longPress);

    function handleGesture(x: number, y: number) {
        if (x < 0 || y < 0) return;
        if (x > width * 20 || y > height * 20) return;
        const _x = Math.floor(y / 20);
        const _y = Math.floor(x / 20);
        update(_x, _y);
    }

    return (
        <GestureDetector gesture={gesture}>
            <View>
                <Layer
                    index={0}
                    width={width}
                    height={height}
                />
            </View>
        </GestureDetector>
    );
}

const Layer = (props: {
    index: number;
    width: number;
    height: number;
}) => {
    const { index, width, height } = props;
    const { cells } = useCanvas();

    if (!cells[index]) return null;
    return (
        <View
            style={[
                styles.layerContainer,
                { width: 20 * width, height: 20 * height },
            ]}
        >
            {cells[index].map((row, x) =>
                row.map((cell, y) => (
                    <Pressable
                        style={{ zIndex: index }}
                        key={`${x}-${y}`}
                    >
                        <Cell color={cell.color} />
                    </Pressable>
                ))
            )}
        </View>
    );
};

const Cell = ({ color }: { color: string }) => {
    return <View style={[styles.cell, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
    layerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cell: {
        width: 20,
        height: 20,
        borderColor: "#000000",
        borderWidth: 1,
    },
});
