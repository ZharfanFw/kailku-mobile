import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/contexts/AuthContext";

export default function SignUpScreen() {
    const router = useRouter();
    const { signup, login, clearRedirect } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSignUp = async () => {
        // Validasi dasar
        if (!formData.firstName || !formData.email || !formData.password) {
            Alert.alert("Error", "Mohon lengkapi data diri Anda.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert(
                "Error",
                "Password dan Konfirmasi Password tidak cocok.",
            );
            return;
        }

        if (formData.password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter.");
            return;
        }

        setIsLoading(true);

        try {
            // A. Panggil API Signup Backend
            const username = formData.email.split("@")[0];

            await signup({
                username: username,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
            });

            Alert.alert(
                "Berhasil",
                "Akun berhasil dibuat! Memasuki aplikasi...",
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            try {
                                await login(formData.email, formData.password);
                            } catch (e: any) {
                                console.error("Auto-login error:", e);
                                clearRedirect();
                                router.push("../ProfileGuset");
                            }
                        },
                    },
                ],
            );
        } catch (error: any) {
            console.error("Register Error", error);

            if (error.response?.status === 409) {
                Alert.alert("Gagal", "Email sudah terdaftar. Silahkan login.");
            } else {
                Alert.alert(
                    "Registrasi Gagal",
                    error.response?.data?.message || "Coba lagi nanti.",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bagian Gambar Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: "https://cdn3d.iconscout.com/3d/premium/thumb/man-wearing-vr-headset-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--virtual-reality-metaverse-pack-avatars-icons-6296963.png",
                            }}
                            style={styles.avatar}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Bagian Form Input */}
                    <View style={styles.formContainer}>
                        <View style={styles.row}>
                            <View style={styles.halfInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nama Depan"
                                    placeholderTextColor="#999"
                                    value={formData.firstName}
                                    onChangeText={(text) =>
                                        setFormData({
                                            ...formData,
                                            firstName: text,
                                        })
                                    }
                                />
                            </View>
                            <View style={styles.halfInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nama Belakang"
                                    placeholderTextColor="#999"
                                    value={formData.lastName}
                                    onChangeText={(text) =>
                                        setFormData({
                                            ...formData,
                                            lastName: text,
                                        })
                                    }
                                />
                            </View>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) =>
                                setFormData({ ...formData, email: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) =>
                                setFormData({ ...formData, password: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={formData.confirmPassword}
                            onChangeText={(text) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: text,
                                })
                            }
                        />

                        <TouchableOpacity
                            style={[
                                styles.button,
                                isLoading && styles.buttonDisabled,
                            ]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.loginLink}>
                            <Text style={styles.loginText}>
                                Sudah punya akun?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push("/(auth)/Login")}
                            >
                                <Text
                                    style={[
                                        styles.loginText,
                                        {
                                            color: "#103568",
                                            fontWeight: "bold",
                                        },
                                    ]}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        paddingTop: 40,
    },
    avatarContainer: { alignItems: "center", marginBottom: 30 },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#DCEAF7",
    },
    formContainer: { width: "100%" },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
    },
    halfInputContainer: { width: "48%" },
    input: {
        backgroundColor: "#F0F0F0",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        fontSize: 14,
        color: "#333",
        width: "100%",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#103568",
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#103568",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: "#999",
        elevation: 0,
    },
    buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
    loginLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    loginText: {
        color: "#666",
    },
});
