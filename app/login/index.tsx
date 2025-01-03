import {
    useLoginUserMutation,
    useRegisterUserMutation,
} from "@/redux/auth.slice";
import { every } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { router } from 'expo-router';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [loginUser, { isError: isLoginError, error: loginError }] =
        useLoginUserMutation();
    const [registerUser, { error: registerError }] = useRegisterUserMutation();
    const { setToken, setRefreshTokenStorage } = useAuth();

    useEffect(() => {
        if (isLoginError) {
            console.log(loginError);
            setMessage("Incorrect email / password");
        }
        if (registerError) {
            //TODO: set registration message
        }
    }, [isLoginError, registerError]);

    const requiredFields = useCallback(() => {
        const error_msg = "Please fill out all fields";
        if (register && !every([username, password, confirmPassword])) {
            setMessage(error_msg);
            return false;
        }
        if (!register && !every([username, password])) {
            setMessage(error_msg);
            return false;
        }
        return true;
    }, [username, password, confirmPassword]);

    function handleLogin() {
        if (register) {
            setRegister(false);
            setMessage("");
            return;
        }
        if (!requiredFields()) return;
        setMessage("");
        loginUser({ username, password }).then((res) => {
            if (res.data) {
                if (res.data.token && res.data.refresh_token) {
                    setToken(res.data.token);
                    setRefreshTokenStorage(res.data.refresh_token);
                }
            } else {
                setMessage("Error logging in");
            }
        });
    }

    function handleRegister() {
        if (!register) {
            setRegister(true);
            setMessage("");
            return;
        }
        if (!requiredFields()) return;
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setMessage("");
        registerUser({
            username,
            password,
        });
    }

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <View>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    mode="outlined"
                    style={styles.input}
                />
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
                {register && (
                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        secureTextEntry={!passwordVisible}
                        onChangeText={(password) =>
                            setConfirmPassword(password)
                        }
                        mode="outlined"
                        style={styles.input}
                        right={
                            <TextInput.Icon
                                icon="eye"
                                onPress={togglePasswordVisible}
                            />
                        }
                    />
                )}
                <View style={styles.buttonContainer}>
                    <Button
                        uppercase={false}
                        mode={register ? "text" : "outlined"}
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text>{register ? "< Login" : "Login"}</Text>
                    </Button>
                    <Button
                        uppercase={false}
                        mode="outlined"
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text>Register</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    input: {
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        width: 250,
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 15,
        gap: 5,
        width: "auto",
    },
    button: {
        flex: 1,
    },
    message: {
        color: "red",
    },
});
