import React, { useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api"; // Import API
import { useAuth } from "@/src/contexts/AuthContext";

// Tipe data untuk Spot
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
    const [tips, setTips] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { user, isAuthenticated } = useAuth();

    const fetchSpots = async () => {
        try {
            const spots = await api.spots.getAll();
            if (Array.isArray(spots)) {
                setSpots(spots);
            }
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchContent = async () => {
        try {
            const tipsData = await api.get<any[]>("/content/tips");
            const eventsData = await api.get<any[]>("/content/lomba");
            setTips(tipsData);
            setEvents(eventsData);
        } catch (error) {
            console.error("Failed to fetch spots:", error);
        }
    };

    useEffect(() => {
        fetchSpots();
        fetchContent();
    }, []);

    // Fungsi refresh saat layar ditarik ke bawah
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSpots();
    }, []);

    // Helper untuk render bintang rating secara visual
    const renderStars = (rating: number = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        return (
            <View style={styles.ratingContainer}>
                {[...Array(fullStars)].map((_, i) => (
                    <FontAwesome
                        key={`full-${i}`}
                        name="star"
                        size={12}
                        color="#333"
                        style={{ marginRight: 2 }}
                    />
                ))}
                {hasHalfStar && (
                    <FontAwesome name="star-half-full" size={12} color="#333" />
                )}
            </View>
        );
    };

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
                {isAuthenticated && user && (
                    <View style={styles.welcomeBanner}>
                        <Text style={styles.welcomeText}>
                            Welcome back, {user.full_name || user.username}!
                        </Text>
                    </View>
                )}

                {/* === SECTION 1: RECOMMENDATIONS (DYNAMIC DATA) === */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => router.push("/(tabs)/explore")} // Diarahkan ke Explore tab
                    >
                        <Text style={styles.sectionTitle}>Recommendations</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>

                    {loading ? (
                        <View
                            style={{
                                height: 150,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <ActivityIndicator size="small" color="#103568" />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        >
                            {spots.length > 0 ? (
                                spots.map((spot) => (
                                    <TouchableOpacity
                                        key={spot.id}
                                        style={styles.card}
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/(booking)/InformationPlace",
                                                params: { id: spot.id }, // Kirim ID ke detail
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
                                                numberOfLines={1}
                                            >
                                                {spot.nama}
                                            </Text>

                                            {renderStars(spot.rating || 4.5)}

                                            <Text
                                                style={styles.cardAddress}
                                                numberOfLines={2}
                                            >
                                                {spot.lokasi}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text
                                    style={{
                                        color: "#999",
                                        fontStyle: "italic",
                                        marginLeft: 5,
                                    }}
                                >
                                    Belum ada rekomendasi tempat.
                                </Text>
                            )}

                            <View style={{ width: 20 }} />
                        </ScrollView>
                    )}
                </View>

                {/* === SECTION 2: TIPS & TRICKS (STATIC) === */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tips & Tricks</Text>
                    <View style={styles.tipsCard}>
                        <TouchableOpacity style={styles.arrowButton}>
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>

                        <View style={styles.tipsContent}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name="fish-outline"
                                    size={32}
                                    color="#333"
                                />
                            </View>
                            <Text style={styles.tipsTitle}>
                                Rawat peralatan sederhana
                            </Text>
                            <Text style={styles.tipsDesc}>
                                Bilas reel dan joran setelah dipakai, keringkan,
                                simpan rapi. Peralatan murah pun awet kalau
                                dirawat.
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.arrowButton}>
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* === SECTION 3: EVENT (STATIC) === */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => router.push("/events")} // Pastikan route ini benar
                    >
                        <Text style={styles.sectionTitle}>Event</Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.eventCard}
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
                                “Master Angler Open Cup”
                            </Text>
                            <Text style={styles.eventText}>Kota: Malang</Text>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    // Header Styles
    headerContainer: {
        position: "relative",
        marginBottom: 30,
    },
    headerImage: {
        width: "100%",
        height: 220,
        resizeMode: "cover",
    },

    // Welcome Banner
    welcomeBanner: {
        backgroundColor: "#103568",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 15,
    },
    welcomeText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },

    // Search Bar Container
    searchContainer: {
        position: "absolute",
        bottom: -25,
        width: "100%",
        alignItems: "center",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        width: "85%",
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
        color: "#333",
    },

    // Auth Buttons Styles
    authButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginTop: 15,
        paddingHorizontal: 20,
    },
    loginButton: {
        backgroundColor: "#103568",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
    },
    loginButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },
    signupButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#103568",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
    },
    signupButtonText: {
        color: "#103568",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
    },

    // General Section Styles
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 5,
        alignSelf: "flex-start", // Agar area sentuh sesuai teks
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginRight: 5,
    },

    // Recommendations Horizontal Scroll
    horizontalScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    card: {
        width: 200,
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginRight: 15,
        paddingBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 120,
        backgroundColor: "#eee",
    },
    cardContent: {
        padding: 10,
    },
    cardTitle: {
        fontSize: 14, // Sedikit diperbesar agar lebih jelas
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    cardAddress: {
        fontSize: 10,
        color: "#666",
        lineHeight: 14,
    },

    // Tips Card Styles
    tipsCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    arrowButton: {
        padding: 5,
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
    },
    tipsContent: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    tipsTitle: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    tipsDesc: {
        fontSize: 10,
        textAlign: "center",
        color: "#666",
    },

    // Event Card Styles
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    eventImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        backgroundColor: "#eee",
    },
    eventDetails: {
        flex: 1,
        justifyContent: "center",
    },
    eventTitle: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    eventText: {
        fontSize: 10,
        color: "#555",
        marginBottom: 2,
    },
});
