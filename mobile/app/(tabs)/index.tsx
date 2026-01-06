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
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api"; // API Service
import { useAuth } from "@/src/contexts/AuthContext";
import { Spot } from "../../src/types";

// Data Dummy Event untuk di Home (Preview)
const dummyEvent = {
    title: "Master Angler Open Cup",
    location: "Malang",
    date: "20 April 2025",
    prize: "Rp700.000",
    image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
};

export default function HomeScreen() {
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Fetch Spots dari API (Database)
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
      <View style={styles.ratingContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome
            key={`full-${i}`}
            name="star"
            size={12}
            color="#FFD700"
            style={{ marginRight: 2 }}
          />
        ))}
        {hasHalfStar && (
          <FontAwesome name="star-half-full" size={12} color="#FFD700" />
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

        {/* === SECTION 1: REKOMENDASI (DATA API) === */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => router.push("/(tabs)/explore")}
          >
            <Text style={styles.sectionTitle}>Rekomendasi Spot</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          {loading ? (
            <View style={{ height: 150, justifyContent: "center", alignItems: "center" }}>
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
                    // PERBAIKAN DI SINI:
                    onPress={() =>
                      router.push({
                        pathname: "/InformationPlace", // Hapus '/(booking)'
                        params: { id: spot.id },
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          spot.image_url && spot.image_url.startsWith("http")
                            ? spot.image_url
                            : `https://placehold.co/400x300/103568/FFF?text=${spot.nama}`,
                      }}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {spot.nama}
                      </Text>
                      {renderStars(spot.rating || 4.5)}
                      <Text style={styles.cardAddress} numberOfLines={2}>
                        {spot.lokasi}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: "#999", fontStyle: "italic", marginLeft: 5 }}>
                  Belum ada data tempat.
                </Text>
              )}
              <View style={{ width: 20 }} />
            </ScrollView>
          )}
        </View>

        {/* === SECTION 2: TIPS & TRICKS (DATA DUMMY) === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips & Tricks</Text>
          <View style={styles.tipsCard}>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.tipsContent}>
              <View style={styles.iconCircle}>
                <Ionicons name="fish-outline" size={32} color="#333" />
              </View>
              <Text style={styles.tipsTitle}>Rawat peralatan sederhana</Text>
              <Text style={styles.tipsDesc}>
                Bilas reel dan joran setelah dipakai, keringkan, simpan rapi.
              </Text>
            </View>

            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* === SECTION 3: EVENT (DATA DUMMY) === */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => router.push("/(tabs)/events")}>
            <Text style={styles.sectionTitle}>Event Mendatang</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.eventCard}
            onPress={() => router.push("/(tabs)/events")}
          >
            <Image
              source={{ uri: dummyEvent.image }}
              style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>“{dummyEvent.title}”</Text>
              <Text style={styles.eventText}>📍 {dummyEvent.location}</Text>
              <Text style={styles.eventText}>🗓 {dummyEvent.date}</Text>
              <Text style={[styles.eventText, { fontWeight: "bold", color: "#103568" }]}>
                Hadiah: {dummyEvent.prize}
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
  headerContainer: {
    position: "relative",
    marginBottom: 0,
  },
  headerImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  welcomeBanner: {
    backgroundColor: "#103568",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  welcomeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 0,
    paddingHorizontal: 20,
    marginBottom: 15,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
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
    fontSize: 14,
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
    borderRadius: 10,
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