import React, { useEffect, useState } from "react";
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
import { Spot } from "../../src/types"; // Import tipe yang sudah diperbaiki

export default function InformationPlaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [spot, setSpot] = useState<Spot | null>(null); // Gunakan tipe Spot
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpotDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const spotId = Array.isArray(id) ? id[0] : id;
        
        // Panggil API backend
        const response = await api.spots.getById(spotId);
        
        // Log untuk debug jika masih error, cek di terminal Metro
        console.log("Data Detail Spot:", response); 

        // Pastikan response adalah object data langsung
        setSpot(response); 
      } catch (error) {
        console.error("Error fetching spot:", error);
        Alert.alert("Gagal Memuat", "Tidak dapat mengambil detail tempat mancing.");
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              // Fallback jika image_url null
              uri: spot.image_url && spot.image_url.startsWith("http")
                ? spot.image_url
                : `https://placehold.co/600x400/103568/FFF?text=${spot.nama}`,
            }}
            style={styles.headerImage}
          />
          <View style={styles.imageOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            {/* PERBAIKAN: Gunakan spot.nama */}
            <Text style={styles.placeTitle}>{spot.nama}</Text> 
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={{ color: "#FFF", fontWeight: "bold", marginLeft: 4 }}>
                {spot.rating || "4.5"}
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.contentContainer}>
          <View style={styles.locationCard}>
            <View style={styles.locationTextContainer}>
              <Text style={styles.cardHeader}>Lokasi Pemancingan</Text>
              
              {/* PERBAIKAN: Gunakan spot.lokasi */}
              <Text style={styles.addressText}>{spot.lokasi}</Text>
              
              {/* PERBAIKAN: Gunakan spot.deskripsi */}
              {spot.deskripsi && (
                <Text style={[styles.addressText, { marginTop: 8, fontStyle: "italic" }]}>
                  {spot.deskripsi}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={() => Alert.alert("Info", "Maps segera hadir!")}>
              <View style={styles.mapIconContainer}>
                <Ionicons name="location-outline" size={24} color="#666" />
                <Text style={styles.mapText}>Maps</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* FASILITAS (Opsional, tampilkan jika ada) */}
          {spot.fasilitas && (
             <View style={[styles.locationCard, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={styles.cardHeader}>Fasilitas</Text>
                <Text style={styles.addressText}>{spot.fasilitas}</Text>
             </View>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Biaya per-Jam</Text>
          {/* PERBAIKAN: Gunakan spot.harga_per_jam */}
          <Text style={styles.priceValue}>{formatRupiah(spot.harga_per_jam)}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            router.push({
              pathname: "/(booking)/Booking",
              params: {
                spotId: spot.id,
                spotName: spot.nama, // Fix
                price: spot.harga_per_jam, // Fix
              },
            });
          }}
        >
          <Text style={styles.bookButtonText}>Booking Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Gunakan styles yang sama seperti sebelumnya (tidak perlu diubah)
const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8F8F8" },
    container: { flex: 1, backgroundColor: "#F8F8F8" },
    imageContainer: { position: "relative", height: 300, width: "100%" },
    headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
    backButton: { position: "absolute", top: 50, left: 20, backgroundColor: "#FFF", padding: 8, borderRadius: 20, elevation: 5 },
    titleContainer: { position: "absolute", bottom: 40, left: 20, right: 20 },
    placeTitle: { color: "#FFF", fontSize: 26, fontWeight: "bold", textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
    contentContainer: { flex: 1, marginTop: -30, paddingHorizontal: 20 },
    locationCard: { backgroundColor: "#FFF", borderRadius: 15, padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, marginBottom: 25 },
    locationTextContainer: { flex: 1, paddingRight: 10 },
    cardHeader: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
    addressText: { fontSize: 12, color: "#555", lineHeight: 18 },
    mapButton: { width: 60, height: 60, backgroundColor: "#EEEEEE", borderRadius: 10, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E0E0E0" },
    mapIconContainer: { alignItems: "center" },
    mapText: { fontSize: 10, color: "#666", marginTop: 2, fontWeight: "600" },
    footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: "#EEEEEE", elevation: 10 },
    priceLabel: { fontSize: 12, color: "#333", fontWeight: "600" },
    priceValue: { fontSize: 20, color: "#FF3B30", fontWeight: "bold" },
    bookButton: { backgroundColor: "#103568", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    bookButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});