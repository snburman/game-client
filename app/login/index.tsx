import { validateEmail } from "@/validate/email";
import { every } from "lodash";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Login() {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState("");

    const validEmail = useCallback(() => {
        if(!validateEmail(email)) {
            setMessage("Please enter a valid email address");
            return false;
        }
        return true;
    },[email, confirmEmail])

    const requiredFields = useCallback(() => {
        const error_msg = "Please fill out all fields"
        if(register && !every([email, confirmEmail, password, confirmPassword])) {
            setMessage(error_msg);
            return false;
        }
        if(!register && !every([email, password])) {
            setMessage(error_msg);
            return false;
        }
        return true;
    },[email, confirmEmail, password, confirmPassword])

    function handleLogin() {
        if (register) {
            setRegister(false);
            return;
        }
        if(!requiredFields()) return;
        if(!validEmail()) return;
        setMessage("")
    }

    function handleRegister() {
        if (!register) {
            setRegister(true);
            return;
        }
        if(!requiredFields()) return;
        if(!validEmail()) return;
        if(email !== confirmEmail) {
            setMessage("Emails do not match");
            return;
        }
        if(password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setMessage("");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <View>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    mode="outlined"
                    style={styles.input}
                />
                {register && (
                    <TextInput
                        label="Confirm Email"
                        value={confirmEmail}
                        onChangeText={(email) => setConfirmEmail(email)}
                        mode="outlined"
                        style={styles.input}
                    />
                )}
                <TextInput
                    label="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={(password) => setPassword(password)}
                    mode="outlined"
                    style={styles.input}
                />
                {register && (
                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={(password) => setConfirmPassword(password)}
                        mode="outlined"
                        style={styles.input}
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

function Register() {
    return <></>;
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
        color: "red"
    }
});
