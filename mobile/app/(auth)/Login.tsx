import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Mohon isi email dan password");
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            Alert.alert("Berhasil", "Login berhasil!", [{ text: "OK" }]);
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert(
                "Login Gagal",
                error.message || "Email atau password sala",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="fish" size={40} color="#103568" />
                    </View>
                    <Text style={styles.title}>Selamat Datang!</Text>
                    <Text style={styles.subtitle}>
                        Masuk untuk mulai memancing
                    </Text>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    {/* Email Input */}
                    <View style={styles.inputLabelContainer}>
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#666"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Masukan email anda"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputLabelContainer}>
                        <Text style={styles.label}>Password</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#666"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Masukan password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={
                                    showPassword
                                        ? "eye-off-outline"
                                        : "eye-outline"
                                }
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() =>
                            Alert.alert(
                                "Info",
                                "Fitur ini akan segera tersedia!",
                            )
                        }
                    >
                        <Text style={styles.forgotPasswordText}>
                            Lupa Password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (isSubmitting || isLoading) &&
                                styles.buttonDisabled,
                        ]}
                        onPress={handleLogin}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Masuk</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Belum punya akun?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/SignUp")}
                        >
                            <Text style={styles.link}>Daftar Sekarang</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: "#EBF8FF",
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#103568",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
    form: {
        gap: 16,
    },
    inputLabelContainer: {
        marginBottom: -10, // Rapatkan label dengan input
        marginLeft: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: "#FAFAFA",
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    forgotPassword: {
        alignSelf: "flex-end",
    },
    forgotPasswordText: {
        color: "#103568",
        fontSize: 14,
        fontWeight: "500",
    },
    button: {
        backgroundColor: "#103568",
        height: 56,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#103568",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: "#999",
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    footerText: {
        color: "#666",
        fontSize: 14,
    },
    link: {
        color: "#103568",
        fontWeight: "bold",
        fontSize: 14,
    },
});
