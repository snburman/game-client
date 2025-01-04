import { theme } from "@/app/_theme";
import { Typography } from "@mui/joy";
import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onClose?: () => void;
    children?: ReactNode;
}

export default function PlainModal({
    visible,
    setVisible,
    onClose,
    children,
}: Props) {
    if (!visible) return null;

    function handleClose() {
        setVisible(false);
        if (onClose) {
            onClose();
        }
    }

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable style={modalStyles.modalContainer} onPress={handleClose}>
                <Pressable style={modalStyles.modalContent}>
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export function ConfirmModal({
    visible,
    setVisible,
    onConfirm,
    message,
}: Props & {
    onConfirm: (confirm: boolean) => void;
    message: string;
}) {
    return (
        <PlainModal visible={visible} setVisible={setVisible}>
            <Typography>{message}</Typography>
            <View style={modalStyles.modalButtonContainer}>
                <Button
                    onPress={() => onConfirm(true)}
                    style={[modalStyles.modalButton, { marginRight: 10 }]}
                >
                    <Text>Yes</Text>
                </Button>
                <Button
                    onPress={() => onConfirm(false)}
                    style={modalStyles.modalButton}
                >
                    <Text>No</Text>
                </Button>
            </View>
        </PlainModal>
    );
}

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 50,
        ...theme.shadow.small,
    },
    modalContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        cursor: "auto",
        zIndex: 100,
    },
    modalButtonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        ...theme.shadow.small,
    },
});
