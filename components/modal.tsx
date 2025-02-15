import { theme } from "@/app/_theme";
import { Typography } from "@mui/joy";
import { ReactNode } from "react";
import { Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

interface Props {
    visible: boolean;
    setVisible?: (visible: boolean) => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>,
    children?: ReactNode;
}

export default function PlainModal({
    visible,
    setVisible,
    onClose,
    style,
    children,
}: Props) {
    if (!visible) return null;

    function handleClose() {
        setVisible && setVisible(false);
        onClose && onClose();
    }

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable style={modalStyles.modalContainer} onPress={handleClose}>
                <Pressable style={[modalStyles.modalContent, style]}>
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export function ConfirmModal({
    visible,
    message,
    onConfirm,
}: Props & {
    message: string;
    onConfirm: (confirm: boolean) => void;
}) {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable
                style={modalStyles.modalContainer}
                onPress={() => onConfirm(false)}
            >
                <Pressable style={modalStyles.modalContent}>
                    <Typography style={{textAlign: "center"}}>{message}</Typography>
                    <View style={modalStyles.modalButtonContainer}>
                        <Button
                            onPress={() => onConfirm(true)}
                            style={[
                                modalStyles.modalButton,
                                { marginRight: 10 },
                            ]}
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
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export function MessageModal({
    visible,
    message,
    onClose,
}: {
    visible: boolean;
    onClose?: () => void;
    message: string;
}) {
    function handlePress() {
        onClose && onClose();
    }

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <Pressable style={modalStyles.modalContainer} onPress={handlePress}>
                <Pressable style={modalStyles.modalContent}>
                    <Typography style={{ marginBottom: 15 }}>{message}</Typography>
                    <Button
                        onPress={handlePress}
                        uppercase={false}
                        mode="outlined"
                    >
                        <Text>Close</Text>
                    </Button>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export const modalStyles = StyleSheet.create({
    modalContainer: {
        ...theme.shadow.small,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 50,
    },
    modalContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: '90%',
        maxWidth: '90%',
        padding: 30,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        cursor: "auto",
        zIndex: 1,
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
