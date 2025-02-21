import AlertMessage, { AlertSeverity } from "@/components/alert";
import PlainModal, { MessageModal, ConfirmModal } from "@/components/modal";
import React, { ReactNode, useContext, useState } from "react";
import { createContext } from "react";
import { StyleProp, ViewStyle } from "react-native";

type ModalData = {
    messageModal: React.JSX.Element | undefined;
    setMessageModal: (message: string, callback?: () => void) => void;
    confirmModal: React.JSX.Element | undefined;
    setConfirmModal: (
        message: string,
        callback: (confirm: boolean) => void
    ) => void;
    plainModal: React.JSX.Element | undefined;
    setPlainModal: (children: ReactNode, style?: StyleProp<ViewStyle>) => void;
    alert: React.JSX.Element | undefined;
    setAlert: (severity: AlertSeverity, children: ReactNode) => void;
};

const ModalContext = createContext<ModalData | undefined>(undefined);

export default function ModalProvider({ children }: React.PropsWithChildren) {
    const [messageModal, _setMessageModal] = useState<
        React.JSX.Element | undefined
    >();
    const [confirmModal, _setConfirmModal] = useState<
        React.JSX.Element | undefined
    >();
    const [plainModal, _setPlainModal] = useState<
        React.JSX.Element | undefined
    >();
    const [alert, _setAlert] = useState<React.JSX.Element | undefined>();

    const setMessageModal = (message: string, callback?: () => void) => {
        _setMessageModal(
            <MessageModal
                visible={message != ""}
                message={message}
                onClose={() => {
                    _setMessageModal(undefined);
                    callback && callback();
                }}
            />
        );
    };

    const setConfirmModal = (
        message: string,
        callback: (confirm: boolean) => void
    ) => {
        _setConfirmModal(
            <ConfirmModal
                visible={message != ""}
                message={message}
                onConfirm={(confirm) => {
                    _setConfirmModal(undefined);
                    callback(confirm);
                }}
            />
        );
    };

    const setPlainModal = (
        children: ReactNode,
        style?: StyleProp<ViewStyle>
    ) => {
        _setPlainModal(
            <PlainModal
                visible={children != null}
                children={children}
                onClose={() => setPlainModal(undefined)}
                style={style}
            />
        );
    };

    const setAlert = (
        severity: AlertSeverity = "neutral",
        children: ReactNode
    ) => {
        setTimeout(() => {
            _setAlert(undefined);
        }, 5000);
        _setAlert(<AlertMessage severity={severity}>{children}</AlertMessage>);
    };

    const initialValue: ModalData = {
        messageModal,
        setMessageModal,
        confirmModal,
        setConfirmModal,
        plainModal,
        setPlainModal,
        alert,
        setAlert,
    };

    return (
        <ModalContext.Provider value={initialValue}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModals() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModals must be used with a ModalProvider");
    }
    return context;
}
