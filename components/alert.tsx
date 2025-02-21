import { Pressable } from "react-native";
import { Alert } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useModals } from "@/app/context/modal_context";
import React, { ReactNode, useState } from "react";

export type AlertSeverity =
    | "primary"
    | "neutral"
    | "danger"
    | "success"
    | "warning";

export default function AlertMessage({
    children,
    severity,
}: {
    children: ReactNode;
    severity: AlertSeverity;
}) {
    const [visible, setVisible] = useState(true);
    return (
        <>
            {visible && (
                    <Alert
                        variant="soft"
                        color={severity}
                        endDecorator={
                            <Pressable onPress={() => setVisible(false)}>
                                <IconButton
                                    variant="plain"
                                    size="sm"
                                    color="neutral"
                                >
                                    <CloseRoundedIcon />
                                </IconButton>
                            </Pressable>
                        }
                        
                    >
                        <>{children}</>
                    </Alert>
            )}
        </>
    );
}
