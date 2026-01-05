import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileGuestScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={50} color="#103568" />
                    </View>
                    <Text style={styles.title}>Masuk ke Kailku</Text>
                    <Text style={styles.subtitle}>
                        Login untuk pengalaman memancing yang lebih baik
                    </Text>
                </View>
                {/* Login Button */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push("/(auth)/Login")}
                >
                    <Text style={styles.primaryButtonText}>Masuk</Text>
                </TouchableOpacity>
                {/* Signup Button */}
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push("/(auth)/SignUp")}
                >
                    <Text style={styles.secondaryButtonText}>Daftar</Text>
                </TouchableOpacity>
                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>atau</Text>
                    <View style={styles.dividerLine} />
                </View>
                {/* Help Section (Dummy) */}
                <View style={styles.helpSection}>
                    <Text style={styles.helpTitle}>Bantuan</Text>

                    <TouchableOpacity
                        style={styles.helpItem}
                        onPress={() => Linking.openURL("tel:+6281234567890")}
                    >
                        <Ionicons name="call-outline" size={20} color="#333" />
                        <Text style={styles.helpText}>Hubungi Kami</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#CCC"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpItem}>
                        <Ionicons name="mail-outline" size={20} color="#333" />
                        <Text style={styles.helpText}>Email Kami</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#CCC"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpItem}>
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={20}
                            color="#333"
                        />
                        <Text style={styles.helpText}>FAQ</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#CCC"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpItem}>
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color="#333"
                        />
                        <Text style={styles.helpText}>Tentang Kailku</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#CCC"
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    scrollContent: { padding: 20 },
    header: { alignItems: "center", marginBottom: 30, marginTop: 20 },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#EBF8FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#103568",
        marginBottom: 5,
    },
    subtitle: { fontSize: 14, color: "#666", textAlign: "center" },
    primaryButton: {
        backgroundColor: "#103568",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#103568",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    secondaryButtonText: { color: "#103568", fontSize: 16, fontWeight: "bold" },
    divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E5E5" },
    dividerText: { marginHorizontal: 15, color: "#999" },
    helpSection: { marginTop: 10 },
    helpTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    helpItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    helpText: { flex: 1, marginLeft: 15, fontSize: 14, color: "#333" },
});
