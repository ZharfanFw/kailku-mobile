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
    SafeAreaView,
    TextInput,
    Dimensions,
    Platform,
    StatusBar,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api";
import { useAuth } from "../../src/contexts/AuthContext";

const { width } = Dimensions.get("window");

interface Spot {
    id: string;
    nama: string;
    lokasi: string;
    harga_per_jam: number;
    image_url?: string;
    rating?: number;
}

export default function HomeScreen() {
    const router = useRouter();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    // Auth context tidak terlalu dipakai di tampilan ini berdasarkan gambar, tapi kita keep
    const { user } = useAuth();

    const fetchSpots = async () => {
        try {
            const spotsData = await api.spots.getAll();
            if (Array.isArray(spotsData)) {
                setSpots(spotsData);
            }
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSpots();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSpots();
    }, []);

    const renderStars = (rating: number = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#103568"]}
          />
        }
      >
        {/* === HEADER SECTION === */}
        <View style={styles.headerContainer}>
          {/* Gambar Lokal Asset */}
          <Image
            // source={require("../../../backend/public/uploads/tempat1.avif")}
            style={styles.headerImage}
          />
        </View>

        {/* WELCOME / AUTH BUTTONS */}
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          {isAuthenticated && user ? (
            <View style={styles.welcomeBanner}>
              <Text style={styles.welcomeText}>
                Hai, {user.first_name || user.username}! Siap memancing hari ini?
              </Text>
            </View>
          ) : (
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/(auth)/Login")}
              >
                <Text style={styles.loginButtonText}>Masuk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push("/(auth)/SignUp")}
              >
                <Text style={styles.signupButtonText}>Daftar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

    return (
        <View style={styles.container}>
            {/* Set StatusBar transparan agar gambar header bisa tembus ke atas */}
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#103568"]}
                        progressViewOffset={250} // Supaya loading muncul di bawah header
                    />
                }
            >
                {/* === HEADER SECTION (Gambar + Search Bar) === */}
                <View style={styles.headerContainer}>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop",
                        }}
                        style={styles.headerImage}
                    />

                    {/* Overlay Search Bar */}
                    <View style={styles.searchOverlay}>
                        <View style={styles.searchBar}>
                            <TextInput
                                placeholder="Tempat mancing terdekat"
                                placeholderTextColor="#999"
                                style={styles.searchInput}
                            />
                            <Ionicons name="search" size={24} color="#333" />
                        </View>
                    </View>
                </View>

                {/* === MAIN CONTENT === */}
                <View style={styles.mainContent}>
                    {/* === SECTION 1: RECOMMENDATIONS === */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => router.push("/(tabs)/explore")}
                        >
                            <Text style={styles.sectionTitle}>
                                Recommendations {">"}
                            </Text>
                        </TouchableOpacity>

                        {loading ? (
                            <View style={styles.loadingView}>
                                <ActivityIndicator
                                    size="small"
                                    color="#103568"
                                />
                            </View>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.horizontalScroll}
                                contentContainerStyle={{ paddingRight: 20 }}
                            >
                                {spots.length > 0 ? (
                                    spots.map((spot) => (
                                        <TouchableOpacity
                                            key={spot.id}
                                            style={styles.card}
                                            activeOpacity={0.9}
                                            onPress={() =>
                                                router.push({
                                                    pathname:
                                                        "/(booking)/InformationPlace",
                                                    params: { id: spot.id },
                                                })
                                            }
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        spot.image_url ||
                                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg",
                                                }}
                                                style={styles.cardImage}
                                            />
                                            <View style={styles.cardContent}>
                                                <Text
                                                    style={styles.cardTitle}
                                                    numberOfLines={2}
                                                >
                                                    {spot.nama}
                                                </Text>
                                                {renderStars(
                                                    spot.rating || 4.5,
                                                )}
                                                <Text
                                                    style={styles.cardAddress}
                                                    numberOfLines={3}
                                                >
                                                    {spot.lokasi}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>
                                        Belum ada rekomendasi.
                                    </Text>
                                )}
                            </ScrollView>
                        )}
                    </View>

                    {/* === SECTION 2: TIPS & TRICKS === */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tips & Tricks</Text>
                        <View style={styles.tipsContainer}>
                            {/* Tombol Panah Kiri */}
                            <TouchableOpacity style={styles.arrowButton}>
                                <Ionicons
                                    name="arrow-back"
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>

                            {/* Card Tips */}
                            <View style={styles.tipsCard}>
                                <View style={styles.iconCircle}>
                                    <Ionicons
                                        name="fish-outline"
                                        size={32}
                                        color="#333"
                                    />
                                    {/* Ikon pancing bisa diganti dengan custom image jika perlu */}
                                </View>
                                <Text style={styles.tipsTitle}>
                                    Rawat peralatan sederhana
                                </Text>
                                <Text style={styles.tipsDesc}>
                                    Bilas reel dan joran setelah dipakai,
                                    keringkan, simpan rapi. Peralatan murah pun
                                    awet kalau dirawat.
                                </Text>
                            </View>

                            {/* Tombol Panah Kanan */}
                            <TouchableOpacity style={styles.arrowButton}>
                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* === SECTION 3: EVENT === */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Event {">"}</Text>
                        <TouchableOpacity
                            style={styles.eventCard}
                            activeOpacity={0.9}
                            onPress={() => router.push("/events")}
                        >
                            <Image
                                source={{
                                    uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
                                }}
                                style={styles.eventImage}
                            />
                            <View style={styles.eventDetails}>
                                <Text style={styles.eventTitle}>
                                    "Master Angler Open Cup"
                                </Text>
                                <Text style={styles.eventText}>
                                    Kota: Malang
                                </Text>
                                <Text style={styles.eventText}>
                                    Tanggal: 20 April 2025
                                </Text>
                                <Text style={styles.eventText}>
                                    Total hadiah: Rp700.000
                                </Text>
                                <Text style={styles.eventText}>
                                    Biaya pendaftaran: Rp60.000/orang
                                </Text>
                                <Text style={styles.eventText}>
                                    Penilaian berdasarkan: Ikan terberat
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Spacer di bawah agar tidak ketutup bottom bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    scrollContent: {
        flexGrow: 1,
    },
    // === HEADER STYLES ===
    headerContainer: {
        position: "relative",
        height: 260, // Tinggi gambar header
        width: "100%",
        marginBottom: 20, // Memberi ruang untuk search bar yang overlap
    },
    headerImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    searchOverlay: {
        position: "absolute",
        bottom: -20, // Membuat search bar overlap setengah ke bawah
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 10,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        width: "85%",
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        // Shadow kuat seperti di gambar
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        marginRight: 10,
    },

    // === CONTENT STYLES ===
    mainContent: {
        paddingTop: 16,
        paddingHorizontal: 20,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    loadingView: {
        height: 150,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#999",
        fontStyle: "italic",
    },

    // === RECOMMENDATIONS STYLES ===
    horizontalScroll: {
        marginHorizontal: -20, // Agar scroll mentok pinggir layar
        paddingLeft: 20,
        paddingBottom: 20,
    },
    card: {
        width: 200,
        backgroundColor: "#FFF",
        borderRadius: 16,
        marginRight: 12,
        paddingBottom: 15,
        minHeight: 240,

        // Shadow lembut
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,

        borderWidth: 1,
        borderColor: "#F0F0F0",

        flexDirection: "column",
    },
    cardImage: {
        width: "100%",
        height: 130,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: "#eee",
    },
    cardContent: {
        padding: 14,
        flex: 1,
        justifyContent: "flex-start",
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#333",
        lineHeight: 20,
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 8,
    },
    cardAddress: {
        fontSize: 11,
        color: "#666",
        lineHeight: 16,
    },

    // === TIPS & TRICKS STYLES ===
    tipsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    arrowButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tipsCard: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    tipsTitle: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
        textAlign: "center",
    },
    tipsDesc: {
        fontSize: 11,
        textAlign: "center",
        color: "#555",
        lineHeight: 16,
    },

    // === EVENT STYLES ===
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 15,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: "center", // Center vertical
    },50

    eventImage: {
        width: 90,
        height: 90,
        borderRadius: 45, // Bulat penuh
        marginRight: 15,
        backgroundColor: "#eee",
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#333",
        marginBottom: 6,
    },
    eventText: {
        fontSize: 11,
        color: "#555",
        marginBottom: 3,
        lineHeight: 16,
    },
});
