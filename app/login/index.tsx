import React, { useCallback, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { every } from "lodash";
import { Button, TextInput } from "react-native-paper";
import {
    AuthError,
    AuthResponse,
    PASSWORD_REQUIREMENTS,
    useLoginUserMutation,
    useRegisterUserMutation,
} from "@/redux/auth.slice";
import { useAuth } from "../context/auth_context";
import { useModals } from "../context/modal_context";
import { LoadingSpinner } from "@/components/loading";
import { Typography } from "@mui/joy";
import { theme } from "../_theme";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [register, setRegister] = useState(false);
    const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
    const [registerUser, { isLoading: registerLoading }] =
        useRegisterUserMutation();
    const { setToken, setRefreshTokenStorage } = useAuth();
    const { setMessageModal } = useModals();

    const requiredFields = useCallback(() => {
        const error_msg = "Please fill out all fields";
        if (
            register &&
            (username == "" || password == "" || confirmPassword == "")
        ) {
            setMessageModal(error_msg);
            return false;
        }
        if (!register && !every([username, password])) {
            setMessageModal(error_msg);
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
            return;
        }
        if (!requiredFields()) return;
        loginUser({ username, password }).then((res) => {
            if (res.error) {
                const err = res.error as { data: AuthResponse };
                switch (err.data?.error) {
                    case "user_banned":
                        setMessageModal("Account disabled");
                        break;
                    case "invalid_credentials":
                        setMessageModal("Invalid username / password");
                        break;
                    default:
                        setMessageModal("Error logging in");
                }
                return;
            }
            if (res.data) {
                setTokens(res.data);
            } else {
                setMessageModal("Error logging in");
            }
        });
    }

    function handleRegister() {
        if (!register) {
            setRegister(true);
            return;
        }
        if (!requiredFields()) return;
        if (password !== confirmPassword) {
            setMessageModal("Passwords do not match");
            return;
        }
        registerUser({
            username,
            password,
        }).then((res) => {
            if (res.error) {
                const err = res.error as { data: AuthResponse };
                if (err.data?.error)
                    switch (err.data?.error) {
                        case AuthError.UserExists:
                            setMessageModal("Username already exists");
                            break;
                        case AuthError.WeakPassword:
                            setMessageModal(PASSWORD_REQUIREMENTS);
                            break;
                        default:
                            setMessageModal("Error creating user");
                    }
            } else if (res.data) {
                setTokens(res.data);
            } else {
                setMessageModal("Error creating user");
            }
        });
    }

    function togglePasswordVisible() {
        setPasswordVisible(!passwordVisible);
    }

    if (loginLoading || registerLoading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>bitscrawler</Text>
            <Text style={styles.subtitle}>
                The multiplayer online pixel world created by players
            </Text>
            <View style={styles.loginContainer}>
                <View>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={(username) =>
                            setUsername(username.toLowerCase())
                        }
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
                                icon={passwordVisible ? "eye" : "eye-off"}
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
                                    icon={passwordVisible ? "eye" : "eye-off"}
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
            <View style={styles.guideButtonContainer}>
                <Text style={[styles.guideText, {fontSize: 24}]}>New to bitscrawler?</Text>
                <Text style={styles.guideText}>Read the player's guide!</Text>
                <Pressable
                    onPress={() => Linking.openURL("http://docs.bitscrawler.com")}
                    style={[styles.guideButton, { backgroundColor: "#EE6300" }]}
                >
                    <Typography style={styles.buttonText}>Player's Guide</Typography>
                </Pressable>
            </View>
            <View style={styles.footer}>
                <Typography style={styles.copy}>
                    &copy; 2025 bitscrawler
                </Typography>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#008E16",
    },
    loginContainer: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 25,
        borderRadius: 10,
        ...theme.shadow.small,
    },
    title: {
        fontFamily: "PixelifySans",
        fontSize: 55,
        color: "#000000",
    },
    subtitle: {
        fontFamily: "PixelifySans",
        fontSize: 20,
        color: "#FFFFFF",
        width: "100%",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        width: 250,
        borderWidth: 0,
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
        backgroundColor: "#FFFFFF",
        ...theme.shadow.small,
    },
    guideButtonContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginTop: 30,
    },
    guideText: {
        ...theme.typography.fonts.PixelifySans,
        color: "#000000",
        fontSize: 18,
    },
    guideButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        textAlign: "center",
        width: 250,
    },
    buttonText: {
        ...theme.typography.fonts.PixelifySans,
        color: "#FFFFFF",
        fontSize: 18,
    },
    message: {
        color: "red",
        textAlign: "center",
        paddingBottom: 10,
    },
    footer: {
        position: "absolute",
        bottom: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    copy: {
        color: "#D6D6D6",
        fontSize: 14,
    },
});
