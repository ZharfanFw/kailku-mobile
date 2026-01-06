// mobile/app/(tabs)/explore.tsx

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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/services/api";
import { Spot } from "../../src/types"; // Pastikan import ini benar

export default function ExploreScreen() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSpots = async () => {
    try {
      const data = await api.spots.getAll();
      setSpots(data);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchSpots();
  };

  const renderItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
            pathname: "/(booking)/InformationPlace",
            params: { id: item.id } 
        });
      }}
    >
      {/* GAMBAR */}
      <Image
        // Backend kamu menyimpan nama file saja (misal: 'telagaindah.jpg'), 
        // jadi harus digabung dengan URL base folder gambar di backend jika perlu.
        // Untuk sementara kita pakai placeholder jika URL tidak lengkap.
        source={{ 
            uri: item.image_url && item.image_url.startsWith('http') 
              ? item.image_url 
              : `https://placehold.co/600x400/103568/FFF?text=${item.nama.replace(/ /g, '+')}`
        }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          {/* PERBAIKAN 1: item.name -> item.nama */}
          <Text style={styles.cardTitle}>{item.nama}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            {/* PERBAIKAN 2: Rating tidak ada di tabel utama, jadi kita pakai default dulu */}
            <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          {/* PERBAIKAN 3: item.address -> item.lokasi */}
          <Text style={styles.locationText} numberOfLines={1}>
            {item.lokasi || "Lokasi belum tersedia"}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          {/* PERBAIKAN 4: item.price -> item.harga_per_jam */}
          <Text style={styles.priceText}>
            Rp {item.harga_per_jam ? item.harga_per_jam.toLocaleString("id-ID") : "0"}
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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Mau mancing di mana?</Text>
          <Text style={styles.subGreeting}>Temukan spot terbaik hari ini</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/(tabs)/profile")}>
           <Ionicons name="person-circle-outline" size={40} color="#103568" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#103568" />
          <Text style={{ marginTop: 10, color: "#666" }}>Memuat lokasi...</Text>
        </View>
      ) : (
        <FlatList
          data={spots}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#103568"]} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
              <Text style={{ marginTop: 10, color: "#999" }}>Belum ada tempat mancing tersedia.</Text>
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
    paddingVertical: 15,
    backgroundColor: "#fff",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  listContent: {
    padding: 20,
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