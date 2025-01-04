import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SettingsProps } from "../types/navigation";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { useState } from "react";
import { Typography } from "@mui/joy";
import { cloneDeep } from "lodash";
import PlainModal, { ConfirmModal, MessageModal } from "@/components/modal";
import {
    PASSWORD_REQUIREMENTS,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "@/redux/auth.slice";

export default function Settings(props: SettingsProps) {
    const { user, logOut, token } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
        useState(false);
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    function handleLogout(confirm: boolean) {
        setLogoutModalVisible(false);
        if (confirm) {
            logOut();
        }
    }

    function handleUpdateUser(confirm: boolean) {
        setUpdateModalVisible(false);
        if (!confirm || !token) return;
        const _user = cloneDeep(user);
        if (!_user) return;
        _user.password = password;
        updateUser({ user: _user, token: token }).then((res) => {
            if (res.error) {
                const err = res.error as { data: { error: string } };
                if (err.data.error === "weak_password") {
                    handleMessageModal(PASSWORD_REQUIREMENTS);
                }
            } else {
                handleMessageModal("Password changed successfully");
            }
        });
    }

    function handleDeleteUser(confirm: boolean) {
        setDeleteAccountModalVisible(false);
        if (!confirm || !token) return;
        deleteUser(token).then((res) => {
            if (res.error) {
                const err = res.error as { data: { error: string } };
                if (err.data.error) {
                    handleMessageModal("Error deleting account");
                }
            } else {
                handleMessageModal("Account deleted successfully");
            }
        });
    }

    function handleMessageModal(message: string) {
        setMessage(message);
        setMessageModalVisible(true);
    }

    function handleUpdateSuccess() {
        setPassword("");
        setConfirmPassword("");
        setMessageModalVisible(false);
    }

    return (
        <>
        {/* TODO: Make message modal dynamic */}
        {/* Account deletion should trigger log out */}
            <MessageModal
                visible={messageModalVisible}
                setVisible={setMessageModalVisible}
                onClose={handleUpdateSuccess}
                message=""
            />
            <PlainModal
                visible={messageModalVisible}
                setVisible={setMessageModalVisible}
                onClose={handleUpdateSuccess}
            >
                <Text style={{ marginBottom: 15 }}>{message}</Text>
                <Button
                    onPress={handleUpdateSuccess}
                    uppercase={false}
                    mode="outlined"
                >
                    <Text>Close</Text>
                </Button>
            </PlainModal>
            <ConfirmModal
                visible={logoutModalVisible}
                setVisible={setLogoutModalVisible}
                onConfirm={handleLogout}
                message="Log out?"
            />
            <ConfirmModal
                visible={updateModalVisible}
                setVisible={setUpdateModalVisible}
                onConfirm={handleUpdateUser}
                message="Change password?"
            />
            <ConfirmModal
                visible={deleteAccountModalVisible}
                setVisible={setDeleteAccountModalVisible}
                onConfirm={handleDeleteUser}
                message="Delete Account?"
            />
            <View style={styles.wrapper}>
                <Typography fontSize={20}>User Settings</Typography>
                <Button
                    uppercase={false}
                    mode={"outlined"}
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={() => setLogoutModalVisible(true)}
                >
                    <Text>Log Out</Text>
                </Button>
                <Typography>Change Password</Typography>
                <TextInput
                    label="Password"
                    value={password}
                    secureTextEntry={!passwordVisible}
                    onChangeText={(password) => setPassword(password)}
                    mode="outlined"
                    style={styles.input}
                    right={
                        <TextInput.Icon
                            icon="eye"
                            onPress={togglePasswordVisible}
                        />
                    }
                />
                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    secureTextEntry={!passwordVisible}
                    onChangeText={(password) => setConfirmPassword(password)}
                    mode="outlined"
                    style={styles.input}
                    right={
                        <TextInput.Icon
                            icon="eye"
                            onPress={togglePasswordVisible}
                        />
                    }
                />
                <Button
                    uppercase={false}
                    mode={"outlined"}
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={() => setUpdateModalVisible(true)}
                >
                    <Text>Change Password</Text>
                </Button>
                <Typography>Delete Account</Typography>
                <Typography style={{ color: "red", marginTop: 10 }}>
                    Warning: this action cannot be undone
                </Typography>
                <Button
                    uppercase={false}
                    mode={"outlined"}
                    style={[
                        styles.button,
                        { marginBottom: 30, borderColor: "red" },
                    ]}
                    onPress={() => setDeleteAccountModalVisible(true)}
                >
                    <Text style={{ color: "red" }}>Delete Account</Text>
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    input: {
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        width: 250,
    },
    button: {
        width: 250,
        marginTop: 15,
    },
});
