import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";
import { Spot } from "../../src/types";

// URL Backend (Ensure this matches your backend address)
const API_BASE_URL = "http://10.0.2.2:3000";

export default function ExploreScreen() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper function to construct the full image URL
  const getImageUrl = (imageName?: string) => {
    if (!imageName) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL}/public/uploads/${imageName}`;
  };

  const fetchSpots = async () => {
    try {
      const data = await api.spots.getAll();
      setSpots(data);
      setFilteredSpots(data);
    } catch (error) {
      console.error("Gagal mengambil data spot:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const newData = spots.filter((item) => {
        const itemData = item.nama ? item.nama.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredSpots(newData);
    } else {
      setFilteredSpots(spots);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSpots();
  };

  const renderItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/InformationPlace",
          params: { id: item.id },
        });
      }}
    >
      <Image
        // Use the helper function here
        source={{ uri: getImageUrl(item.image_url) }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.nama}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.lokasi || "Lokasi belum tersedia"}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>
            Rp{" "}
            {item.harga_per_jam
              ? item.harga_per_jam.toLocaleString("id-ID")
              : "0"}
            <Text style={styles.priceUnit}> /jam</Text>
          </Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Lihat</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={styles.greeting}>Mau mancing di mana?</Text>
          <Text style={styles.subGreeting}>Temukan spot terbaik hari ini</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="person-circle-outline" size={40} color="#103568" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama kolam..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#103568" />
          <Text style={{ marginTop: 10, color: "#666" }}>Memuat lokasi...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpots}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#103568"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
              <Text style={{ marginTop: 10, color: "#999" }}>
                Tidak ada tempat yang cocok.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#F8F9FA",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#103568",
  },
  subGreeting: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#F8F9FA",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  listContent: {
    padding: 20,
    paddingTop: 5,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#EEE",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B48B00",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#103568",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#103568",
    fontWeight: "600",
    fontSize: 14,
  },
});