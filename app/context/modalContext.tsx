import { MessageModal, ConfirmModal } from "@/components/modal";
import React, { useCallback, useContext, useRef, useState } from "react";
import { createContext } from "react";

type ModalData = {
    messageModal: React.JSX.Element | undefined;
    setMessageModal: (message: string, callback?: () => void) => void;
    confirmModal: React.JSX.Element | undefined;
    setConfirmModal: (message: string, callback: (confirm: boolean) => void) => void;
};

const ModalContext = createContext<ModalData | undefined>(undefined);

export default function ModalProvider({ children }: React.PropsWithChildren) {
    const [messageModal, _setMessageModal] = useState<
        React.JSX.Element | undefined
    >();
    const [confirmModal, _setConfirmModal] = useState<
        React.JSX.Element | undefined
    >();

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

    const initialValue: ModalData = {
        messageModal,
        setMessageModal,
        confirmModal,
        setConfirmModal,
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
