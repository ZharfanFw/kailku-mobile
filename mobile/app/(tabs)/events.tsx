import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl // Tambahkan ini
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api";
import { Lomba } from "../../src/types";

// URL Backend
const API_BASE_URL = "http://10.0.2.2:3000";

export default function EventScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Helper
  const getImageUrl = (imageName?: string) => {
    if (!imageName) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL}/public/uploads/${imageName}`;
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const fetchEvents = async () => {
    try {
      const data = await api.events.getAll(); // Pastikan endpoint ini me-return array Lomba
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal ambil event:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  }

  const renderEventCard = ({ item }: { item: Lomba }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.9}>
      <Image source={{ uri: getImageUrl(item.image_url) }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.nama_lomba}</Text>
        
        <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.eventText}>{item.lokasi}</Text>
        </View>
        <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.eventText}>{formatDate(item.tanggal_pelaksanaan)}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.prizeText}>
          🎁 Hadiah Utama: <Text style={{fontWeight:'bold', color:'#E67E22'}}>{item.hadiah_utama}</Text>
        </Text>
        <Text style={styles.feeText}>
           Biaya: {formatRupiah(item.biaya_pendaftaran)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Lomba</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#103568" /></View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#103568"]} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={{ marginTop: 20, color: "#999" }}>Belum ada lomba tersedia.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#E5E5E5" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#103568" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 20, paddingBottom: 50 },
  
  eventCard: { backgroundColor: "#FFF", borderRadius: 16, marginBottom: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#F0F0F0' },
  eventImage: { width: "100%", height: 180, resizeMode: "cover", backgroundColor: "#eee" },
  eventDetails: { padding: 16 },
  eventTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  eventText: { fontSize: 13, color: "#666" },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  prizeText: { fontSize: 13, color: "#333", marginBottom: 4 },
  feeText: { fontSize: 14, color: "#103568", fontWeight: "bold" },
});