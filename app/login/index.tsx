import {
    AuthResponse,
    useLoginUserMutation,
    useRegisterUserMutation,
} from "@/redux/auth.slice";
import { every } from "lodash";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../context/auth_context";
import { HomeStackProps } from "../types/navigation";

export default function Login(props: HomeStackProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [loginUser] = useLoginUserMutation();
    const [registerUser] = useRegisterUserMutation();
    const { setToken, setRefreshTokenStorage } = useAuth();

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

    function setTokens(auth: AuthResponse) {
        if (auth.token && auth.refresh_token) {
            setToken(auth.token);
            setRefreshTokenStorage(auth.refresh_token);
        }
    }

    function handleLogin() {
        if (register) {
            setRegister(false);
            setMessage("");
            return;
        }
        if (!requiredFields()) return;
        setMessage("");
        loginUser({ username, password }).then((res) => {
            if (res.error) {
                const err = res.error as { data: AuthResponse };
                switch (err.data.error) {
                    case "user_banned":
                        setMessage("Account disabled");
                        break;
                    case "invalid_credentials":
                        setMessage("Invalid username / password");
                }
                return;
            }
            if (res.data) {
                setTokens(res.data);
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
        }).then((res) => {
            if (res.error) {
                const err = res.error as { data: AuthResponse };
                switch (err.data.error) {
                    case "user_exists":
                        setMessage("Username already exists");
                        break;
                    case "weak_password":
                        setMessage(
                            "Password must contain at least:\none uppercase letter, one lowercase letter,\none symbol, and one number"
                        );
                        break;
                    default:
                        setMessage("Error creating user");
                }
            } else if (res.data) {
                setTokens(res.data);
            } else {
                setMessage("Error creating user");
            }
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
        backgroundColor: "#FFFFFF"
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
        textAlign: "center",
        paddingBottom: 10,
    },
});
