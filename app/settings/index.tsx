import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SettingsProps } from "../types/navigation";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { useState } from "react";
import { Typography } from "@mui/joy";
import { cloneDeep } from "lodash";
import { ConfirmModal } from "@/components/modal";
import { useUpdateUserMutation } from "@/redux/auth.slice";

export default function Settings(props: SettingsProps) {
    const { user, logOut } = useAuth();
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [updateUser] = useUpdateUserMutation();

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    function handleLogout(confirm: boolean) {
        setLogoutModalVisible(false);
        if(confirm) {
            logOut();
        }
    }

    function handleUpdateUser(confirm: boolean) {
        setUpdateModalVisible(false);
        if(!confirm) return;
        const _user = cloneDeep(user);
        if (!_user) return;
        _user.password = password;
    }

    function handleDeleteUser(confirm: boolean) {
        setDeleteAccountModalVisible(false);
        if(!confirm) return;

    }

    return (
        <>
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
                    onPress={() =>  setLogoutModalVisible(true)}
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
