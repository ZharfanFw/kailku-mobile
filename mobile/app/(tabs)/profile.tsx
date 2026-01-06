import React, { useEffect, useState } from "react";
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
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // State untuk Toggle
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Ambil data user dan fungsi logout dari Context
  const { user, isAuthenticated, logout } = useAuth();

  // EFEK PENTING: Pantau status login
  useEffect(() => {
    // Jika state berubah menjadi tidak login, otomatis lempar ke Login
    if (!isAuthenticated) {
        // Gunakan replace agar user tidak bisa tekan tombol Back ke profile
        router.replace("/(auth)/Login");
    }
  }, [isAuthenticated]);

  // Handle Logout yang sebenarnya
  const handleLogout = () => {
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya, Keluar",
        style: "destructive",
        onPress: async () => {
          try {
              // HANYA panggil fungsi ini. 
              // Biarkan useEffect di atas yang mengurus navigasinya.
              await logout(); 
          } catch (error) {
              console.error("Gagal logout:", error);
              Alert.alert("Error", "Gagal keluar akun. Coba lagi.");
          }
        },
      },
    ]);
  };

  // Navigasi ke Edit Profile (Sudah diperbaiki path-nya)
  const handleEditProfile = () => {
      router.push("/edit-profile"); 
  };

  if (!isAuthenticated || !user) {
    // Tampilan jika user belum login (Fallback UI)
    return (
        <SafeAreaView style={styles.container}>
             <View style={[styles.scrollContent, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                <Ionicons name="person-circle-outline" size={80} color="#ccc" />
                <Text style={{ marginTop: 20, fontSize: 18, color: '#666' }}>Anda belum login.</Text>
                <TouchableOpacity 
                    style={[styles.logoutButton, { backgroundColor: '#103568', marginTop: 20 }]}
                    onPress={() => router.push("/(auth)/Login")}
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
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    backgroundColor: '#eee',
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
});