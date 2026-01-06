// mobile/app/BuysAndRentFishing.tsx

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../src/services/api";
import { Tool } from "../src/types"; // Pastikan ini tidak merah lagi

// Pastikan IP ini sama dengan di config/api.ts
const API_BASE_URL = "http://10.0.2.2:3000"; 

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 48) / COLUMN_COUNT;

// CartItem mewarisi Tool, jadi otomatis punya 'id', 'nama_alat', dll
interface CartItem extends Tool {
  type: "sewa" | "beli";
  transaksi_price: number;
}

export default function BuysAndRentFishingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // 1. Ambil Data Booking
    if (params.bookingData) {
      try {
        setBookingData(JSON.parse(params.bookingData as string));
      } catch (e) {
        console.error("Gagal parse booking data", e);
      }
    }

    // 2. Fetch Alat
    const fetchTools = async () => {
      try {
        const data = await api.products.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Gagal ambil alat:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getImageUrl = (url?: string) => {
      if (!url) return "https://placehold.co/150x150/EEE/333?text=No+Image";
      if (url.startsWith("http")) return url;
      return `${API_BASE_URL}/public/uploads/${url}`;
  }

  // --- CART LOGIC ---
  const addToCart = (item: Tool, type: "sewa" | "beli") => {
    const price = type === "sewa" ? item.harga_sewa : item.harga_beli;
    const newItem: CartItem = { ...item, type, transaksi_price: price };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (itemId: number, type: "sewa" | "beli") => {
    // Error c.id harusnya hilang karena Tool sekarang punya id: number
    const index = cart.findIndex((c) => c.id === itemId && c.type === type);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const getItemCount = (itemId: number, type: "sewa" | "beli") => {
    // Error c.id harusnya hilang
    return cart.filter((c) => c.id === itemId && c.type === type).length;
  };

  const cartTotal = cart.reduce((total, item) => total + Number(item.transaksi_price), 0);
  const spotTotal = bookingData ? Number(bookingData.spotPriceTotal) : 0;
  const grandTotal = cartTotal + spotTotal;

  const handleCheckout = () => {
    if (!bookingData) {
      Alert.alert("Error", "Data booking hilang. Mohon ulangi proses dari awal.");
      router.push("/(tabs)/explore");
      return;
    }

    const finalPayload = {
      ...bookingData,
      cartItems: cart,
      cartTotal: cartTotal,
      grandTotal: grandTotal 
    };

    router.push({
      pathname: "/(payment)/Payment",
      params: {
        totalAmount: grandTotal.toString(),
        bookingData: JSON.stringify(finalPayload),
      },
    });
  };

  const renderCounterButton = (item: Tool, type: "sewa" | "beli", count: number) => {
    const isSewa = type === "sewa";
    const baseColor = isSewa ? "#FBBF24" : "#103568";

    return (
      <View style={[styles.counterContainer, { borderColor: baseColor }]}>
        <TouchableOpacity
          style={[styles.counterBtn, { backgroundColor: baseColor }]}
          onPress={() => removeFromCart(item.id, type)}
        >
          <Ionicons name="remove" size={12} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.counterText, { color: baseColor }]}>{count}</Text>
        <TouchableOpacity
          style={[styles.counterBtn, { backgroundColor: baseColor }]}
          onPress={() => addToCart(item, type)}
        >
          <Ionicons name="add" size={12} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Tool }) => {
    const sewaCount = getItemCount(item.id, "sewa");
    const beliCount = getItemCount(item.id, "beli");

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: getImageUrl(item.foto_url) }}
          style={styles.productImage}
          resizeMode="contain"
        />

        <View style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.nama_alat}
          </Text>
          
          <Text style={styles.productPrice}>{formatRupiah(item.harga_beli)} (Beli)</Text>
          <Text style={[styles.productPrice, {fontSize: 10, color: '#F59E0B'}]}>{formatRupiah(item.harga_sewa)} (Sewa/jam)</Text>

          <View style={styles.actionColumn}>
             <View style={styles.buttonWrapper}>
              {sewaCount === 0 ? (
                <TouchableOpacity style={styles.rentButton} onPress={() => addToCart(item, "sewa")}>
                  <Text style={styles.rentButtonText}>Sewa</Text>
                </TouchableOpacity>
              ) : ( renderCounterButton(item, "sewa", sewaCount) )}
            </View>
            <View style={{ height: 6 }} />
            <View style={styles.buttonWrapper}>
              {beliCount === 0 ? (
                <TouchableOpacity style={styles.buyButton} onPress={() => addToCart(item, "beli")}>
                  <Text style={styles.buyButtonText}>Beli</Text>
                </TouchableOpacity>
              ) : ( renderCounterButton(item, "beli", beliCount) )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Cari alat..." 
              value={searchText} 
              onChangeText={setSearchText}
            />
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>
      </View>

      <FlatList
        data={products.filter(p => p.nama_alat.toLowerCase().includes(searchText.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20}}>Tidak ada data alat pancing.</Text>
        }
      />

      <View style={styles.footerCard}>
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>
              Total ({cart.length} Alat + Tiket)
            </Text>
            <Text style={styles.totalPrice}>
                {formatRupiah(grandTotal)}
            </Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>
                {cart.length > 0 ? "Bayar Sekarang" : "Lewati & Bayar Tiket"}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#FFF" },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginRight: 10, borderWidth: 1, borderColor: "#F0F0F0" },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: "#E5E5E5" },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  searchIcon: { marginLeft: 5 },
  listContent: { padding: 16 },
  columnWrapper: { justifyContent: "space-between" },
  card: { width: CARD_WIDTH, backgroundColor: "#FFF", borderRadius: 12, marginBottom: 16, padding: 10, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  productImage: { width: "100%", height: 100, marginBottom: 10, borderRadius: 8, backgroundColor: "#F5F5F5" },
  cardContent: { flex: 1 },
  productName: { fontSize: 12, fontWeight: "600", color: "#333", marginBottom: 2 },
  productPrice: { fontSize: 12, color: "#555", marginBottom: 2 },
  actionColumn: { flexDirection: "column", width: "100%", marginTop: 5 },
  buttonWrapper: { width: "100%", height: 26 },
  rentButton: { flex: 1, backgroundColor: "#FBBF24", borderRadius: 15, justifyContent: "center", alignItems: "center" },
  rentButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  buyButton: { flex: 1, backgroundColor: "#103568", borderRadius: 15, justifyContent: "center", alignItems: "center" },
  buyButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  counterContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 15, paddingHorizontal: 2, backgroundColor: "#FFF" },
  counterBtn: { width: 20, height: 20, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  counterText: { fontSize: 12, fontWeight: "bold", paddingHorizontal: 4 },
  footerCard: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 20 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 12, color: "#666" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
  checkoutButton: { backgroundColor: "#103568", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flexDirection: "row", alignItems: "center" },
  checkoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});