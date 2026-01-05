import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ReviewResponScreen() {
    const router = useRouter();

    const handleBackToHome = () => {
        // Mengarahkan pengguna kembali ke Home Page
        // Menggunakan 'replace' agar pengguna tidak bisa menekan 'Back' ke halaman sukses ini
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* ICON PAPER PLANE */}
                {/* Menggunakan icon outline yang mirip dengan desain */}
                <Ionicons
                    name="paper-plane-outline"
                    size={100}
                    color="#1A1A1A"
                    style={styles.icon}
                />

                {/* TITLE TEXT */}
                <Text style={styles.title}>Review{"\n"}Submitted</Text>

                {/* SPACER (Memberi jarak antara teks dan tombol) */}
                <View style={{ height: 100 }} />

                {/* BUTTON BACK TO HOMEPAGE */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleBackToHome}
                >
                    <Text style={styles.buttonText}>Back to Homepage</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF", // Background Putih
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30, // Padding kiri kanan agar tombol tidak mepet
    },
    icon: {
        marginBottom: 20,
        // Icon pesawat kertas hitam garis tipis
    },
    title: {
        fontSize: 32,
        fontWeight: "400", // Font tidak terlalu tebal (Regular/Medium)
        color: "#000000",
        textAlign: "center",
        lineHeight: 40, // Jarak antar baris
        letterSpacing: 1, // Jarak antar huruf sedikit renggang
    },
    button: {
        backgroundColor: "#103568", // Warna Biru Tua
        width: "100%", // Lebar tombol menyesuaikan padding container
        height: 55,
        borderRadius: 12, // Sudut tombol agak kotak (squircle)
        justifyContent: "center",
        alignItems: "center",
        // Shadow opsional untuk kedalaman
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
    },
});
