import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../src/services/api";
import { Tool } from "../src/types";

// URL Backend untuk gambar alat
const API_BASE_URL = "http://10.0.2.2:3000";

export default function BuysAndRentFishing() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  // 1. Tangkap data booking dari halaman sebelumnya
  // Data ini berisi spotId, tanggal, jam, kursi, dan harga tiket
  const rawBookingData = params.bookingData ? JSON.parse(params.bookingData as string) : null;
  const spotId = rawBookingData?.spotId;

  const [products, setProducts] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Keranjang { id_alat: jumlah }
  const [cart, setCart] = useState<{ [key: number]: number }>({}); 

  // Helper Gambar
  const getImageUrl = (imageName?: string) => {
    if (!imageName) return "https://via.placeholder.com/150";
    if (imageName.startsWith("http")) return imageName;
    return `${API_BASE_URL}/public/uploads/${imageName}`;
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Fetch Alat Berdasarkan ID Tempat
  useEffect(() => {
    const fetchTools = async () => {
      try {
        if (spotId) {
          const data = await api.products.getAll(spotId);
          setProducts(data);
        }
      } catch (error) {
        console.error("Gagal ambil alat:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, [spotId]);

  // Logika Tambah/Kurang Keranjang
  const handleAddToCart = (item: Tool) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const handleRemoveFromCart = (item: Tool) => {
    setCart((prev) => {
      const newState = { ...prev };
      if (newState[item.id] > 1) {
        newState[item.id] -= 1;
      } else {
        delete newState[item.id];
      }
      return newState;
    });
  };

  // Hitung Total Item & Harga ALAT SAJA
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  const totalToolPrice = products.reduce((sum, item) => {
    const qty = cart[item.id] || 0;
    const price = item.harga_sewa || item.harga_beli || 0; 
    return sum + price * qty;
  }, 0);

  // --- LOGIKA LANJUT KE PAYMENT ---
  const handleContinue = () => {
    if (!rawBookingData) {
        Alert.alert("Error", "Data booking hilang, silakan ulangi dari awal.");
        router.back();
        return;
    }

    // 1. Siapkan array item alat yang dipilih (bisa kosong)
    const selectedItems = products
      .filter((p) => cart[p.id] > 0)
      .map((p) => ({
        id: p.id,
        name: p.nama,
        price: p.harga_sewa || p.harga_beli,
        image: p.image_url,
        type: p.harga_sewa ? 'sewa' : 'beli', 
        qty: cart[p.id],
        transaksi_price: (p.harga_sewa || p.harga_beli) * cart[p.id] 
      }));

    // 2. Gabungkan Data Booking + Data Alat
    // Hitung Grand Total (Tiket Mancing + Sewa Alat)
    const grandTotal = rawBookingData.spotPriceTotal + totalToolPrice;

    const finalBookingData = {
        ...rawBookingData,          // Data tiket (kursi, jam, tanggal)
        cartItems: selectedItems,   // Data alat tambahan
        totalAmount: grandTotal     // Harga keseluruhan
    };

    // 3. Navigasi ke Payment
    router.push({
        pathname: "/(payment)/Payment",
        params: { 
            bookingData: JSON.stringify(finalBookingData),
            totalAmount: grandTotal.toString() // Payment screen butuh ini untuk display
        }
    });
  };

  const renderItem = ({ item }: { item: Tool }) => {
    const qty = cart[item.id] || 0;
    const price = item.harga_sewa || item.harga_beli;
    const typeLabel = item.harga_sewa ? "/sewa" : "/beli";

    return (
      <View style={styles.card}>
        <Image source={{ uri: getImageUrl(item.image_url) }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.nama}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.deskripsi}</Text>
          <Text style={styles.price}>
            {formatRupiah(price)} <Text style={styles.typeLabel}>{typeLabel}</Text>
          </Text>
        </View>
        
        <View style={styles.actionContainer}>
          {qty > 0 ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => handleRemoveFromCart(item)} style={styles.iconBtn}>
                <Ionicons name="remove" size={20} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.iconBtn}>
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Tambah</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sewa & Beli Alat (Opsional)</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#103568" /></View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={{textAlign:'center', marginTop: 20, color: '#666'}}>
                    Tidak ada alat yang tersedia di tempat ini.
                </Text>
            </View>
          }
        />
      )}

      {/* FOOTER SELALU MUNCUL (Bahkan jika 0 item) */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
             {totalItems > 0 ? `${totalItems} Alat Dipilih` : "Tidak ada alat dipilih"}
          </Text>
          <Text style={styles.footerPrice}>
             + {formatRupiah(totalToolPrice)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleContinue}>
          <Text style={styles.checkoutText}>
             {totalItems > 0 ? "Lanjut Bayar" : "Lewati & Bayar"}
          </Text>
          <Ionicons name="arrow-forward-circle" size={24} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF", alignItems: "center", borderBottomWidth: 1, borderColor: "#EEE", marginTop: 25 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#103568" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: "#000", elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#EEE" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  desc: { fontSize: 12, color: "#777", marginVertical: 4 },
  price: { fontSize: 14, fontWeight: "bold", color: "#103568" },
  typeLabel: { fontSize: 10, color: "#999", fontWeight: "normal" },
  actionContainer: { justifyContent: "center", alignItems: "flex-end" },
  addBtn: { backgroundColor: "#103568", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  addBtnText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  counterContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0E0E0", borderRadius: 6 },
  iconBtn: { backgroundColor: "#103568", padding: 4, borderRadius: 6 },
  qtyText: { marginHorizontal: 10, fontWeight: "bold", fontSize: 14 },
  
  // Footer Style Updated
  footer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: "#FFF", 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: "#EEE", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  footerText: { fontSize: 12, color: "#666" },
  footerPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
  checkoutBtn: { 
    backgroundColor: "#103568", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 12 
  },
  checkoutText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});