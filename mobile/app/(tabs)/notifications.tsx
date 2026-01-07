import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

const { width } = Dimensions.get("window");

// Tipe data Booking dari Backend
// Sesuaikan dengan response JSON dari backend
type BookingData = {
  id: number;
  status: "pending" | "paid" | "cancelled" | "completed";
  tanggal_booking: string;
  start_time: string;
  end_time: string;
  total_harga: number;
  tempat_nama: string; // Pastikan backend join table tempat_mancing
  tempat_lokasi: string;
  tempat_image: string;
  no_kursi: number;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi Fetch Data dari Backend
  const fetchMyBookings = async () => {
    try {
      if (!isAuthenticated) return;
      // Memanggil endpoint: GET /bookings/my
      // Pastikan backend sudah menyediakan endpoint ini dan melakukan JOIN ke tabel tempat_mancing
      const data = await api.bookings.myBookings();
      setBookings(data);
    } catch (error) {
      console.error("Gagal mengambil riwayat booking:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [isAuthenticated]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#BF0000"; // Merah
      case "paid":
      case "completed":
        return "#22C55E"; // Hijau
      case "cancelled":
      case "failed":
        return "#9CA3AF"; // Abu-abu
      default:
        return "#333";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Belum Dibayar";
      case "paid":
        return "Lunas";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  // Format tanggal agar lebih cantik (Opsional)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={{ marginTop: 10, color: "#666" }}>Silahkan login untuk melihat riwayat.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Booking</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#103568" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#103568"]} />
          }
        >
          {bookings.length > 0 ? (
            bookings.map((item, index) => (
              <View key={item.id}>
                <View style={styles.card}>
                  {/* STATUS ROW */}
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                    {item.status === "pending" && (
                      <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>Segera Bayar</Text>
                      </View>
                    )}
                  </View>

                  {/* CONTENT ROW */}
                  <View style={styles.contentRow}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="fish" size={30} color="#F59E0B" />
                      <View style={styles.rodLine} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.cardTitle}>{item.tempat_nama || `Booking #${item.id}`}</Text>
                      <Text style={styles.cardAddress} numberOfLines={2}>
                        {item.tempat_lokasi || "Lokasi tidak tersedia"}
                      </Text>
                      <Text style={styles.cardDate}>
                        {formatDate(item.tanggal_booking)} • {item.start_time} - {item.end_time}
                      </Text>
                      <Text style={[styles.cardDate, {fontWeight: 'bold', color: '#103568', marginTop: 4}]}>
                         Kursi No: {item.no_kursi}
                      </Text>
                    </View>
                  </View>

                  {/* ACTION BUTTONS */}
                  {(item.status === "paid" || item.status === "completed") && (
                    <View style={styles.actionButtonsContainer}>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                          router.push({
                            pathname: "/(booking)/InformationPlace",
                            params: { id: 1 }, // Idealnya kirim ID tempat asli
                          })
                        }
                      >
                        <Text style={styles.actionButtonText}>Rebooking</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {index < bookings.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          ) : (
            <View style={styles.center}>
              <Text style={{ color: "#999", marginTop: 20 }}>Belum ada riwayat booking.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  listContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  card: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 80, // Offset agar sejajar dengan teks konten
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  timerBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "bold",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5DD6E3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  rodLine: {
    position: "absolute",
    width: 40,
    height: 2,
    backgroundColor: "#8B4513",
    transform: [{ rotate: "-45deg" }],
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 11,
    color: "#6B7280",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: "#103568",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
  },
});