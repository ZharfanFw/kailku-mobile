import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Switch,
    Linking,
    StatusBar,
} from "react-native";
// Import dari safe-area-context
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
    useFocusEffect(
        React.useCallback(() => {
            // Tempat refresh data user
        }, []),
    );
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Ya, Keluar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                        router.replace("/(tabs)/profile");
                    } catch (error) {
                        console.error("Gagal logout:", error);
                    }
                },
            },
        ]);
    };

    const handleEditProfile = () => {
        router.push("/edit-profile");
    };

    // --- TAMPILAN GUEST (BELUM LOGIN) ---
    if (!isAuthenticated || !user) {
        return (
            <SafeAreaView
                style={styles.container}
                edges={["top", "left", "right"]}
            >
                <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
                <ScrollView
                    contentContainerStyle={[
                        styles.guestScrollContent,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Guest */}
                    <View style={styles.guestHeader}>
                        <View style={styles.guestIconCircle}>
                            <Ionicons name="person" size={40} color="#103568" />
                        </View>
                        <Text style={styles.guestTitle}>Masuk ke Kailku</Text>
                        <Text style={styles.guestSubtitle}>
                            Login untuk akses booking, review, dan pengalaman
                            memancing yang lebih baik.
                        </Text>
                    </View>

                    {/* Card Tombol Login/Register */}
                    <View style={styles.guestCard}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push("/(auth)/Login")}
                        >
                            <Text style={styles.primaryButtonText}>Masuk</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.push("/(auth)/SignUp")}
                        >
                            <Text style={styles.secondaryButtonText}>
                                Daftar Akun Baru
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Butuh Bantuan?</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Help Section - CENTERED & SINGLE ITEM */}
                    <View style={{ alignItems: "center" }}>
                        <TouchableOpacity
                            style={styles.centeredHelpButton}
                            onPress={() =>
                                Linking.openURL("tel:+6281234567890")
                            }
                        >
                            <Ionicons
                                name="call"
                                size={20}
                                color="#103568"
                                style={{ marginRight: 10 }}
                            />
                            <Text style={styles.centeredHelpText}>
                                Hubungi Kami
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // --- TAMPILAN USER (SUDAH LOGIN) ---
    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity>
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>

                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri:
                                    user.avatar_url ||
                                    "https://placehold.co/150x150/103568/FFF?text=User",
                            }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.editAvatarButton}
                            onPress={handleEditProfile}
                        >
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>
                        {user.full_name || user.username}
                    </Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.memberSince}>Member Aktif</Text>
                </View>

                {/* STATS CARD */}
                <View style={styles.statsCard}>
                    <TouchableOpacity
                        style={styles.statItem}
                        onPress={() => router.push("/(tabs)/notifications")}
                    >
                        <Text style={styles.statValue}>
                            {user.stats?.bookings || 0}
                        </Text>
                        <Text style={styles.statLabel}>Booking</Text>
                    </TouchableOpacity>

                    <View style={styles.statDivider} />

                    <TouchableOpacity style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {user.stats?.reviews || 0}
                        </Text>
                        <Text style={styles.statLabel}>Review</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Akun</Text>
                <View style={styles.menuSection}>
                    {/* Menu Edit Profil */}
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleEditProfile}
                    >
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="person-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Edit Profil</Text>
                            <Text style={styles.menuSubtitle}>
                                Ubah foto, nama, email
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>

                    
                </View>

                <Text style={styles.sectionTitle}>Preferensi</Text>
                <View style={styles.menuSection}>
                    {/* Notifikasi */}
                    <View style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="notifications-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Notifikasi</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: "#E5E5E5", true: "#103568" }}
                        />
                    </View>

                    
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={22}
                        color="#FF3B30"
                    />
                    <Text style={styles.logoutText}>Keluar dari Akun</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>Kailku v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    // Styles Guest Revised
    guestScrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
    },
    guestHeader: {
        alignItems: "center",
        marginBottom: 30,
    },
    guestIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#EBF8FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    guestTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#103568",
        marginBottom: 8,
    },
    guestSubtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    guestCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 20,
    },
    // Style Baru untuk Tombol Help Tengah
    centeredHelpButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    centeredHelpText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#103568",
    },

    // Styles Umum User
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#103568",
    },
    profileCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#eee",
    },
    editAvatarButton: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "#103568",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    memberSince: {
        fontSize: 12,
        color: "#999",
        backgroundColor: "#F0F0F0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statsCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        flexDirection: "row",
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#103568",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
    },
    statDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "#E5E5E5",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        marginTop: 10,
    },
    menuSection: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F5F5F5",
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#EBF8FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: "#999",
    },
    logoutButton: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#FF3B30",
        marginLeft: 10,
    },
    versionText: {
        fontSize: 12,
        color: "#999",
        textAlign: "center",
        marginBottom: 10,
    },
    primaryButton: {
        backgroundColor: "#103568",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#103568",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    secondaryButton: {
        backgroundColor: "#FFF",
        borderWidth: 1.5,
        borderColor: "#103568",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    secondaryButtonText: { color: "#103568", fontSize: 16, fontWeight: "bold" },
    divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
    dividerText: {
        marginHorizontal: 15,
        color: "#999",
        fontSize: 12,
        fontWeight: "600",
    },
});
