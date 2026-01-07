import React, { useEffect, useState, useCallback } from "react"; // Tambah useCallback
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";
import { Spot } from "../../src/types";
import { useAuth } from "@/src/contexts/AuthContext";

const API_URL = "http://192.168.1.4:3000";

export default function InformationPlaceScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Ambil status login dari Context
    const { isAuthenticated } = useAuth();

    const [spot, setSpot] = useState<Spot | null>(null);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) {
            // Return gambar placeholder jika null
            return `https://placehold.co/600x400/103568/FFF?text=${encodeURIComponent(spot?.nama || "No Image")}`;
        }

        // KASUS 1: Jika di database sudah Full URL (https://...)
        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        // KASUS 2: Jika di database cuma nama file (misal: "uploads/foto1.jpg")
        // Gabungkan URL Server + Path Gambar
        // Pastikan tidak ada double slash (//)
        const baseUrl = API_URL.replace(/\/$/, ""); // Hapus slash di akhir jika ada
        const path = imagePath.replace(/^\//, ""); // Hapus slash di awal jika ada

        return `${baseUrl}/public/uploads/${path}`;
    };

    useEffect(() => {
        const fetchSpotDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const spotId = Array.isArray(id) ? id[0] : id;
                const response = await api.spots.getById(spotId);
                setSpot(response);
            } catch (error) {
                console.error("Error fetching spot:", error);
                Alert.alert(
                    "Gagal Memuat",
                    "Tidak dapat mengambil detail tempat mancing.",
                );
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchSpotDetail();
    }, [id]);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // --- FUNGSI PROTEKSI BOOKING ---
    const handleBookingPress = useCallback(() => {
        if (!isAuthenticated) {
            Alert.alert(
                "Login Diperlukan",
                "Silakan masuk ke akun Anda terlebih dahulu.",
                [
                    { text: "Nanti Saja", style: "cancel" },
                    {
                        text: "Login Sekarang",
                        onPress: () =>
                            router.push({
                                pathname: "/(auth)/Login",
                                // Pastikan key parameter di sini SAMA dengan yang dibaca di Login.tsx
                                params: {
                                    returnTo: "/(booking)/InformationPlace",
                                    spotId: id, // Gunakan spotId agar sinkron dengan Login.tsx
                                    price: spot?.harga_per_jam,
                                },
                            }),
                    },
                ],
            );
        } else {
            // Navigasi langsung jika sudah login
            router.push({
                pathname: "/(booking)/Booking",
                params: {
                    spotId: spot?.id,
                    spotName: spot?.nama,
                    price: spot?.harga_per_jam,
                },
            });
        }
    }, [isAuthenticated, spot, id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#103568" />
            </View>
        );
    }

    if (!spot) return null;

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* HEADER IMAGE */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            // Panggil fungsi helper di sini.
                            // Ganti 'spot.image_url' dengan nama kolom asli di databasemu (misal: spot.image atau spot.gambar)
                            uri: getImageUrl(spot.image_url || null),
                        }}
                        style={styles.headerImage}
                        // Tambahkan ini untuk handling jika gambar error/rusak link-nya
                        onError={(e) =>
                            console.log(
                                "Gagal memuat gambar:",
                                e.nativeEvent.error,
                            )
                        }
                    />
                    <View style={styles.imageOverlay} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.placeTitle}>{spot.nama}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 4,
                            }}
                        >
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text
                                style={{
                                    color: "#FFF",
                                    fontWeight: "bold",
                                    marginLeft: 4,
                                }}
                            >
                                {spot.rating || "4.5"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* CONTENT */}
                <View style={styles.contentContainer}>
                    <View style={styles.locationCard}>
                        <View style={styles.locationTextContainer}>
                            <Text style={styles.cardHeader}>
                                Lokasi Pemancingan
                            </Text>
                            <Text style={styles.addressText}>
                                {spot.lokasi}
                            </Text>
                            {spot.deskripsi && (
                                <Text
                                    style={[
                                        styles.addressText,
                                        { marginTop: 8, fontStyle: "italic" },
                                    ]}
                                >
                                    {spot.deskripsi}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() =>
                                Alert.alert("Info", "Maps segera hadir!")
                            }
                        >
                            <View style={styles.mapIconContainer}>
                                <Ionicons
                                    name="location-outline"
                                    size={24}
                                    color="#666"
                                />
                                <Text style={styles.mapText}>Maps</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {spot.fasilitas && (
                        <View
                            style={[
                                styles.locationCard,
                                {
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                },
                            ]}
                        >
                            <Text style={styles.cardHeader}>Fasilitas</Text>
                            <Text style={styles.addressText}>
                                {spot.fasilitas}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Biaya per-Jam</Text>
                    <Text style={styles.priceValue}>
                        {formatRupiah(spot.harga_per_jam)}
                    </Text>
                </View>

                {/* GUNAKAN FUNGSI HANDLER DI SINI */}
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBookingPress}
                >
                    <Text style={styles.bookButtonText}>
                        {isAuthenticated ? "Booking Now" : "Login to Book"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles tetap sama...
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
    },
    container: { flex: 1, backgroundColor: "#F8F8F8" },
    imageContainer: { position: "relative", height: 300, width: "100%" },
    headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "#FFF",
        padding: 8,
        borderRadius: 20,
        elevation: 5,
    },
    titleContainer: { position: "absolute", bottom: 40, left: 20, right: 20 },
    placeTitle: {
        color: "#FFF",
        fontSize: 26,
        fontWeight: "bold",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    contentContainer: { flex: 1, marginTop: -30, paddingHorizontal: 20 },
    locationCard: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 25,
    },
    locationTextContainer: { flex: 1, paddingRight: 10 },
    cardHeader: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    addressText: { fontSize: 12, color: "#555", lineHeight: 18 },
    mapButton: {
        width: 60,
        height: 60,
        backgroundColor: "#EEEEEE",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    mapIconContainer: { alignItems: "center" },
    mapText: { fontSize: 10, color: "#666", marginTop: 2, fontWeight: "600" },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        elevation: 10,
    },
    priceLabel: { fontSize: 12, color: "#333", fontWeight: "600" },
    priceValue: { fontSize: 20, color: "#FF3B30", fontWeight: "bold" },
    bookButton: {
        backgroundColor: "#103568",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    bookButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});
