import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SettingsProps } from "../types/navigation";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { useState } from "react";
import { Typography } from "@mui/joy";
import { cloneDeep } from "lodash";
import {
    PASSWORD_REQUIREMENTS,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "@/redux/auth.slice";
import { useModals } from "../context/modal_context";

export default function Settings(_: SettingsProps) {
    const { user, logOut, token } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const { setMessageModal, setConfirmModal } = useModals();

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    function handleLogout() {
        setConfirmModal("Log out?", (confirm) => {
            confirm && logOut();
        });
    }

    function handleUpdateUser() {
        // currently only passwords are updated in settings
        if(password == "" || confirmPassword == "") {
            setMessageModal("Please fill out all fields");
            return;
        }
        if(password !== confirmPassword) {
            setMessageModal("Passwords do not match");
            return;
        }
        setConfirmModal("Change password?", (confirm) => {
            if(!confirm || !token) return;
            const _user = cloneDeep(user);
            if (!_user) return;
            _user.password = password;
            updateUser({ user: _user, token: token }).then((res) => {
                if (res.error) {
                    const err = res.error as { data: { error: string } };
                    if (err.data.error === "weak_password") {
                        setMessageModal(PASSWORD_REQUIREMENTS);
                    }
                } else {
                    setMessageModal("Password changed successfully");
                }
            });
        })
    }

    function handleDeleteUser() {
        setConfirmModal("Delete account?", (confirm) => {
            if (!confirm || !token) return;
            deleteUser(token).then((res) => {
                if (res.error) {
                    const err = res.error as { data: { error: string } };
                    if (err.data.error) {
                        setMessageModal("Error deleting account");
                    }
                } else {
                    setMessageModal("Account deleted successfully", logOut);
                }
            });
        })
    }

    return (
        <>
            <View style={styles.container}>
                <Typography fontSize={20}>User Settings</Typography>
                <Button
                    uppercase={false}
                    mode={"outlined"}
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={handleLogout}
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
                            icon={passwordVisible ? "eye" : "eye-off"}
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
                            icon={passwordVisible ? "eye" : "eye-off"}
                            onPress={togglePasswordVisible}
                        />
                    }
                />
                <Button
                    uppercase={false}
                    mode={"outlined"}
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={handleUpdateUser}
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
                    onPress={handleDeleteUser}
                >
                    <Text style={{ color: "red" }}>Delete Account</Text>
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
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
