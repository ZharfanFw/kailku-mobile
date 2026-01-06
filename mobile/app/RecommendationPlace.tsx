import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { api } from "../src/services/api"; // Import API
import { Spot } from "../src/types"; // Import Tipe Data Spot

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function RecommendationPlaceScreen() {
  const router = useRouter();
  
  // Menggunakan State Spot[] agar sesuai dengan tipe data API
  const [places, setPlaces] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA DARI API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await api.spots.getAll();
        setPlaces(data);
      } catch (error) {
        console.error("Gagal mengambil data rekomendasi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const renderStars = (rating: number = 4.5) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={10}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const renderItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(booking)/InformationPlace",
          params: { id: item.id },
        })
      }
    >
      <Image
        source={{
          // Logika Gambar: Gunakan URL dari API jika ada, jika tidak pakai placeholder
          uri:
            item.image_url && item.image_url.startsWith("http")
              ? item.image_url
              : `https://placehold.co/400x300/103568/FFF?text=${item.nama}`,
        }}
        style={styles.cardImage}
      />

      <View style={styles.cardContent}>
        {/* PERHATIKAN: Gunakan 'nama' bukan 'name' */}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.nama}
        </Text>

        <View style={styles.ratingContainer}>
          {renderStars(item.rating || 4.5)}
        </View>

        {/* PERHATIKAN: Gunakan 'lokasi' bukan 'address' */}
        <Text style={styles.cardAddress} numberOfLines={3}>
          {item.lokasi}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Text style={styles.placeholderText}>Rekomendasi Tempat</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#103568" />
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={renderItem}
          // PERBAIKAN ERROR: Tambahkan .toString() karena keyExtractor butuh string
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              Tidak ada data tempat.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 15,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 25,
    height: 45,
    paddingHorizontal: 20,
    elevation: 2,
  },
  placeholderText: { color: "#333", fontSize: 16, fontWeight: "bold" },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: "space-between" },
  card: {
    width: cardWidth,
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 120, resizeMode: "cover" },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    height: 32,
  },
  ratingContainer: { flexDirection: "row", marginBottom: 6 },
  cardAddress: { fontSize: 10, color: "#666", lineHeight: 14 },
});