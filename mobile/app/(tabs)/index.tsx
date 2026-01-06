import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api"; // API Service
import { useAuth } from "@/src/contexts/AuthContext";
import { Spot, Lomba } from "../../src/types"; // Import tipe Lomba
import { SafeAreaView } from "react-native-safe-area-context";

// KONFIGURASI URL SERVER
const API_BASE_URL = "http://10.0.2.2:3000"; 

const { width } = Dimensions.get("window");

// --- DATA DUMMY TIPS (3 Item) ---
const TIPS_DATA = [
  {
    id: 1,
    title: "Rawat Joran",
    desc: "Bilas joran dengan air tawar dan keringkan setelah dipakai di laut.",
    icon: "construct-outline"
  },
  {
    id: 2,
    title: "Waktu Terbaik",
    desc: "Pagi (06-09) dan Sore (16-18) adalah waktu ikan paling aktif makan.",
    icon: "time-outline"
  },
  {
    id: 3,
    title: "Simpul Kuat",
    desc: "Gunakan simpul FG Knot untuk menyambung PE ke Leader agar kuat.",
    icon: "infinite-outline" // Ikon simpul
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [events, setEvents] = useState<Lomba[]>([]); // State untuk Event
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // --- HELPER UNTUK URL GAMBAR ---
  const getImageUrl = (imageName?: string) => {
    if (!imageName) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL}/public/uploads/${imageName}`;
  };

  // Helper Format Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  };

  // Helper Format Tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Fetch Data (Spots & Events)
  const fetchData = async () => {
    try {
      // 1. Ambil Spots
      const spotsData = await api.spots.getAll();
      if (Array.isArray(spotsData)) {
        setSpots(spotsData);
      }

      // 2. Ambil Events (Lomba)
      const eventsData = await api.events.getAll();
      if (Array.isArray(eventsData)) {
        setEvents(eventsData);
      }

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderStars = (rating: number = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome key={`full-${i}`} name="star" size={12} color="#FFD700" style={{ marginRight: 2 }} />
        ))}
        {hasHalfStar && <FontAwesome name="star-half-full" size={12} color="#FFD700" />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#103568"]}
            progressViewOffset={Platform.OS === 'android' ? 0 : 0}
          />
        }
      >
        {/* === HEADER SECTION === */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              // Gunakan variable API_BASE_URL agar dinamis
              uri: `${API_BASE_URL}/public/uploads/tempat1.avif`,
            }}
            style={styles.headerImage}
            // Tambahkan resizeMode agar gambar proporsional
            resizeMode="cover" 
          />
          
          {/* Overlay & Content (Opsional jika kode sebelumnya ada ini) */}
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
              <Text style={styles.appTitle}>Kailku</Text>
              <Text style={styles.appSubtitle}>Temukan Spot Mancing Terbaik</Text>
          </View>
        </View>
        {/* WELCOME / AUTH BUTTONS */}
        <View style={styles.authSection}>
          {isAuthenticated && user ? (
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeText}>
                Hai, {user.first_name || user.username || "Pemancing"}! Siap strike hari ini? 🎣
              </Text>
            </View>
          ) : (
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/(auth)/Login")}>
                <Text style={styles.loginButtonText}>Masuk</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signupButton} onPress={() => router.push("/(auth)/SignUp")}>
                <Text style={styles.signupButtonText}>Daftar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* === SECTION 1: REKOMENDASI (LIMIT 3) === */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => router.push("/(tabs)/explore")}>
            <Text style={styles.sectionTitle}>Rekomendasi Spot</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          {loading ? (
            <View style={{ height: 150, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#103568" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {spots.length > 0 ? (
                // --- LIMIT HANYA 3 SPOT ---
                spots.slice(0, 3).map((spot) => (
                  <TouchableOpacity
                    key={spot.id}
                    style={styles.card}
                    onPress={() => router.push({
                        pathname: "/InformationPlace",
                        params: { id: spot.id }
                    })}
                  >
                    <Image
                      source={{ uri: getImageUrl(spot.image_url) }}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{spot.nama}</Text>
                      {renderStars(spot.rating || 4.5)}
                      <Text style={styles.cardAddress} numberOfLines={1}>{spot.lokasi}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: "#999", fontStyle: "italic", marginLeft: 5 }}>Belum ada data tempat.</Text>
              )}
              <View style={{ width: 20 }} />
            </ScrollView>
          )}
        </View>

        {/* === SECTION 2: TIPS & TRICKS (3 ITEM DUMMY) === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips & Tricks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {TIPS_DATA.map((tip) => (
                <View key={tip.id} style={styles.tipsCard}>
                    <View style={styles.tipsHeader}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={tip.icon as any} size={24} color="#103568" />
                        </View>
                        <Text style={styles.tipsTitle}>{tip.title}</Text>
                    </View>
                    <Text style={styles.tipsDesc} numberOfLines={3}>{tip.desc}</Text>
                </View>
            ))}
            <View style={{ width: 20 }} />
          </ScrollView>
        </View>

        {/* === SECTION 3: EVENT MENDATANG (DATABASE - LIMIT 2) === */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => router.push("/(tabs)/events")}>
            <Text style={styles.sectionTitle}>Event Mendatang</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          {events.length > 0 ? (
             // --- LIMIT HANYA 2 EVENT ---
             events.slice(0, 2).map((event) => (
                <TouchableOpacity 
                    key={event.id}
                    style={styles.eventCard} 
                    onPress={() => router.push("/(tabs)/events")}
                >
                    <Image source={{ uri: getImageUrl(event.image_url) }} style={styles.eventImage} />
                    <View style={styles.eventDetails}>
                        <Text style={styles.eventTitle} numberOfLines={1}>{event.nama_lomba}</Text>
                        <Text style={styles.eventText}>📍 {event.lokasi}</Text>
                        <Text style={styles.eventText}>🗓 {formatDate(event.tanggal_pelaksanaan)}</Text>
                        <Text style={[styles.eventText, { fontWeight: "bold", color: "#103568", marginTop: 4 }]}>
                            Hadiah: {event.hadiah_utama}
                        </Text>
                    </View>
                </TouchableOpacity>
             ))
          ) : (
             <Text style={{ color: "#999", fontStyle: "italic" }}>Belum ada event mendatang.</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  headerContainer: { position: "relative", marginBottom: 0, height: 240 },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  headerContent: { position: 'absolute', bottom: 30, left: 20 },
  appTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  appSubtitle: { fontSize: 14, color: '#EEE', fontWeight: '500' },
  
  // Auth Section
  authSection: { marginTop: -25, marginHorizontal: 20, marginBottom: 20 },
  welcomeBanner: { backgroundColor: "#FFF", padding: 15, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderLeftWidth: 5, borderLeftColor: '#103568' },
  welcomeText: { color: "#333", fontSize: 14, fontWeight: "600" },
  authButtonsContainer: { flexDirection: "row", gap: 12, backgroundColor: '#FFF', padding: 15, borderRadius: 12, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  loginButton: { backgroundColor: "#103568", paddingVertical: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  loginButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  signupButton: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#103568", paddingVertical: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  signupButtonText: { color: "#103568", fontSize: 14, fontWeight: "bold" },

  // General Section
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  horizontalScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  
  // Card Styles
  card: { width: 200, backgroundColor: "#FFF", borderRadius: 15, marginRight: 15, paddingBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3, overflow: "hidden", borderWidth: 1, borderColor: '#F0F0F0' },
  cardImage: { width: "100%", height: 120, backgroundColor: "#eee" },
  cardContent: { padding: 10 },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "#333" },
  ratingContainer: { flexDirection: "row", marginBottom: 5 },
  cardAddress: { fontSize: 10, color: "#666", lineHeight: 14 },

  // Tips Card Style
  tipsCard: { width: 220, backgroundColor: "#FFF", borderRadius: 15, padding: 16, marginRight: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, borderWidth: 1, borderColor: '#EFEFEF' },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#EBF8FF", justifyContent: "center", alignItems: "center", marginRight: 10 },
  tipsTitle: { fontWeight: "bold", fontSize: 14, color: "#333", flex: 1 },
  tipsDesc: { fontSize: 11, color: "#555", lineHeight: 16 },
  
  // Event Card Style
  eventCard: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 15, padding: 12, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3, borderWidth: 1, borderColor: '#F0F0F0' },
  eventImage: { width: 90, height: 90, borderRadius: 10, marginRight: 15, backgroundColor: "#eee" },
  eventDetails: { flex: 1, justifyContent: "center" },
  eventTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 4, color: "#333" },
  eventText: { fontSize: 11, color: "#666", marginBottom: 2 },
});