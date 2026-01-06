import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert,
    Switch,
    Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // State untuk Toggle UI (Visual saja untuk saat ini)
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

    const { user, isAuthenticated, logout } = useAuth();

    const userData = user
        ? {
              name: user.full_name || user.username,
              email: user.email,
              memberSince: "Januari 2025",
              totalBookings: 0,
              totalReviews: 0,
          }
        : null;

    const handleLogout = () => {
        Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Ya, Keluar",
                style: "destructive",
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    if (!isAuthenticated) {
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
                            onPress={() =>
                                Linking.openURL("tel:+6281234567890")
                            }
                        >
                            <Ionicons
                                name="call-outline"
                                size={20}
                                color="#333"
                            />
                            <Text style={styles.helpText}>Hubungi Kami</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#CCC"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.helpItem}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#333"
                            />
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

    return (
        <SafeAreaView style={styles.container}>
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
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: "https://cdn3d.iconscout.com/3d/premium/thumb/man-wearing-vr-headset-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--virtual-reality-metaverse-pack-avatars-icons-6296963.png",
                            }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{userData?.name || "-"}</Text>
                    <Text style={styles.userEmail}>
                        {userData?.email || "-"}
                    </Text>
                    <Text style={styles.memberSince}>
                        Anggota sejak {userData?.memberSince || "-"}
                    </Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userData?.totalBookings}
                        </Text>
                        <Text style={styles.statLabel}>Booking</Text>
                    </View>
                    <View
                        style={[
                            styles.statDivider,
                            { backgroundColor: "#E5E5E5" },
                        ]}
                    />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {userData?.totalReviews}
                        </Text>
                        <Text style={styles.statLabel}>Review</Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Akun</Text>
                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
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
                                Ubah foto, nama, email, dll
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Ubah Password</Text>
                            <Text style={styles.menuSubtitle}>
                                Perbarui password akun
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="card-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>
                                Metode Pembayaran
                            </Text>
                            <Text style={styles.menuSubtitle}>
                                Kelola kartu dan e-wallet
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
                    <TouchableOpacity style={styles.menuItem}>
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
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="moon-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Mode Gelap</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: "#E5E5E5", true: "#103568" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="language-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Bahasa</Text>
                            <Text style={styles.menuSubtitle}>
                                Bahasa Indonesia
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>Bantuan</Text>
                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="help-circle-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Pusat Bantuan</Text>
                            <Text style={styles.menuSubtitle}>
                                FAQ dan panduan
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Hubungi Kami</Text>
                            <Text style={styles.menuSubtitle}>
                                Chat dengan support
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="document-text-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>
                                Kebijakan Privasi
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons
                                name="information-circle-outline"
                                size={22}
                                color="#103568"
                            />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>
                                Tentang Aplikasi
                            </Text>
                            <Text style={styles.menuSubtitle}>Versi 1.0.0</Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={[styles.logoutText, { color: '#FFF' }]}>Masuk ke Akun</Text>
                </TouchableOpacity>
             </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
                uri: user.avatar_url || "https://cdn3d.iconscout.com/3d/premium/thumb/man-wearing-vr-headset-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--virtual-reality-metaverse-pack-avatars-icons-6296963.png",
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user.full_name || user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Member Aktif
          </Text>
        </View>

        {/* STATS CARD */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Booking</Text>
          </View>
          <View
            style={[
              styles.statDivider,
              { backgroundColor: "#E5E5E5" },
            ]}
          />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Review</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Akun</Text>
        <View style={styles.menuSection}>
          {/* Menu Item: Edit Profil */}
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
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
                Ubah foto, nama, email, dll
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
          
          {/* Menu Item: Ubah Password */}
          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Info", "Fitur Ubah Password segera hadir!")}>
             <View style={styles.menuIconContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#103568" />
             </View>
             <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Ubah Password</Text>
                <Text style={styles.menuSubtitle}>Perbarui kata sandi akun</Text>
             </View>
             <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Preferensi</Text>
        <View style={styles.menuSection}>
            {/* Menu Notifikasi */}
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
                  onValueChange={(value) => setNotifications(value)}
                  trackColor={{ false: "#E5E5E5", true: "#103568" }}
                />
            </View>

            {/* Menu Mode Gelap */}
            <View style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name="moon-outline"
                    size={22}
                    color="#103568"
                  />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>Mode Gelap</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={(value) => setDarkMode(value)}
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
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#EBF8FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
});
