import { theme } from "@/app/_theme";
import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    children: ReactNode;
}

export default function PlainModal({ visible, setVisible, children }: Props) {
    if(!visible) return null;
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                style={styles.modalContainer}
                onPress={() => setVisible(false)}
            >
                <Pressable style={styles.modalContent}>{children}</Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 35,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 50,
        ...theme.shadow.small,
    },
    modalContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        cursor: "auto",
        zIndex: 100,
    }
});