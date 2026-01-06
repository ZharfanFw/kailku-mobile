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
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 48) / COLUMN_COUNT;

// Tipe Data Produk
interface Product {
    id: string;
    name: string;
    price: number;
    discount: number;
    image: string;
}

// Tipe Data Item di Keranjang
interface CartItem extends Product {
    type: "sewa" | "beli";
}

export default function BuysAndRentFishingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchText, setSearchText] = useState("");
    const [cart, setCart] = useState<any[]>([]);

    // Ambil data booking dari halaman sebelumnya
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
      if (params.bookingData) {
          try {
              const parsed = JSON.parse(params.bookingData as string);
              setBookingData(parsed);
          } catch (e) {
              console.error("Gagal parse booking data", e);
          }
      }
  }, [params.bookingData]);

    // Dummy Data
    const products: Product[] = [
        {
            id: "1",
            name: "Joran Baitcasting",
            price: 152000,
            discount: 25,
            image: "https://via.placeholder.com/150/0000FF/808080?text=Joran",
        },
        {
            id: "2",
            name: "PE Braided Line",
            price: 53000,
            discount: 64,
            image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Line",
        },
        {
            id: "3",
            name: "Spoon Pancing",
            price: 25000,
            discount: 23,
            image: "https://via.placeholder.com/150/FFFF00/000000?text=Spoon",
        },
        {
            id: "4",
            name: "Tas Pancing",
            price: 152000,
            discount: 73,
            image: "https://via.placeholder.com/150/008000/FFFFFF?text=Tas",
        },
        {
            id: "5",
            name: "Tanggok Jaring",
            price: 152000,
            discount: 62,
            image: "https://via.placeholder.com/150/000000/FFFFFF?text=Jaring",
        },
        {
            id: "6",
            name: "Ember Pancing",
            price: 152000,
            discount: 43,
            image: "https://via.placeholder.com/150/800080/FFFFFF?text=Ember",
        },
    ];

    // Format Rupiah
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // --- LOGIC CART ---

    // 1. Tambah Item (Add)
    const addToCart = (product: Product, type: "sewa" | "beli") => {
        const newItem: CartItem = { ...product, type };
        setCart([...cart, newItem]);
    };

    // 2. Kurang Item (Remove)
    const removeFromCart = (productId: string, type: "sewa" | "beli") => {
        // Cari index item terakhir yang cocok dengan ID dan Tipe
        const index = cart.findIndex(
            (item) => item.id === productId && item.type === type,
        );

        if (index > -1) {
            const newCart = [...cart];
            newCart.splice(index, 1); // Hapus 1 item pada index tersebut
            setCart(newCart);
        }
    };

    // 3. Hitung Jumlah Item per Produk (Untuk UI Counter)
    const getItemCount = (productId: string, type: "sewa" | "beli") => {
        return cart.filter(
            (item) => item.id === productId && item.type === type,
        ).length;
    };

    // Hitung Total Harga Semua
    const totalCartPrice = cart.reduce((total, item) => total + item.price, 0);

    // --- RENDER COMPONENTS ---

    // Render Tombol Counter (Minus - Angka - Plus)
    const renderCounterButton = (
        item: Product,
        type: "sewa" | "beli",
        count: number,
    ) => {
        const isSewa = type === "sewa";
        const baseColor = isSewa ? "#FBBF24" : "#103568"; // Kuning vs Biru

        return (
            <View style={[styles.counterContainer, { borderColor: baseColor }]}>
                {/* Tombol Minus */}
                <TouchableOpacity
                    style={[styles.counterBtn, { backgroundColor: baseColor }]}
                    onPress={() => removeFromCart(item.id, type)}
                >
                    <Ionicons name="remove" size={12} color="#FFF" />
                </TouchableOpacity>

                {/* Angka Jumlah */}
                <Text style={[styles.counterText, { color: baseColor }]}>
                    {count}
                </Text>

                {/* Tombol Plus */}
                <TouchableOpacity
                    style={[styles.counterBtn, { backgroundColor: baseColor }]}
                    onPress={() => addToCart(item, type)}
                >
                    <Ionicons name="add" size={12} color="#FFF" />
                </TouchableOpacity>
            </View>
        );
    };

    // Hitung Total Harga (Alat + Sewa + Booking Spot)
  const cartTotal = cart.reduce((total, item) => total + item.price, 0);
  const spotTotal = bookingData ? bookingData.spotPriceTotal : 0;
  const grandTotal = cartTotal + spotTotal;

  const handleCheckout = () => {
      if (!bookingData) {
          Alert.alert("Error", "Data booking tidak ditemukan.");
          return;
      }

      // Gabungkan Data Booking + Data Keranjang Alat untuk dikirim ke Payment
      const finalPayload = {
          ...bookingData,
          cartItems: cart,
      };

      router.push({
          pathname: "/(payment)/Payment",
          params: {
              totalAmount: grandTotal, // Total yang harus dibayar user
              bookingData: JSON.stringify(finalPayload) // Data lengkap untuk disimpan ke DB nanti
          }
      });
  };

    const renderItem = ({ item }: { item: Product }) => {
        const sewaCount = getItemCount(item.id, "sewa");
        const beliCount = getItemCount(item.id, "beli");

        return (
            <View style={styles.card}>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}%</Text>
                </View>

                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                />

                <View style={styles.cardContent}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.productPrice}>
                        {formatRupiah(item.price)}
                    </Text>

                    {/* Action Row */}
                    <View style={styles.actionColumn}>
                        {/* --- BARIS SEWA --- */}
                        <View style={styles.buttonWrapper}>
                            {sewaCount === 0 ? (
                                <TouchableOpacity
                                    style={styles.rentButton}
                                    onPress={() => addToCart(item, "sewa")}
                                >
                                    <Text style={styles.rentButtonText}>
                                        Sewa
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                renderCounterButton(item, "sewa", sewaCount)
                            )}
                        </View>

                        {/* Spacer kecil antar tombol */}
                        <View style={{ height: 6 }} />

                        {/* --- BARIS BELI --- */}
                        <View style={styles.buttonWrapper}>
                            {beliCount === 0 ? (
                                <TouchableOpacity
                                    style={styles.buyButton}
                                    onPress={() => addToCart(item, "beli")}
                                >
                                    <Text style={styles.buyButtonText}>
                                        Beli
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                renderCounterButton(item, "beli", beliCount)
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };
    

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Alat pancing untuk pemula"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <Ionicons
                        name="search"
                        size={20}
                        color="#666"
                        style={styles.searchIcon}
                    />
                </View>
            </View>

            {/* GRID PRODUK */}
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: 150 },
                ]}
                showsVerticalScrollIndicator={false}
            />

            {/* FOOTER KERANJANG */}
            {cart.length > 0 && (
                <View style={styles.footerCard}>
                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>
                                Total ({cart.length} Item)
                            </Text>
                            <Text style={styles.totalPrice}>
                                {formatRupiah(totalCartPrice)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => router.push("/(payment)/Payment")}
                        >
                            <Text style={styles.checkoutButtonText}>
                                Bayar Sekarang
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color="#FFF"
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAFAFA" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFF",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },
    searchInput: { flex: 1, fontSize: 14, color: "#333" },
    searchIcon: { marginLeft: 5 },

    listContent: { padding: 16 },
    columnWrapper: { justifyContent: "space-between" },

    card: {
        width: CARD_WIDTH,
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 16,
        padding: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    discountBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#DC2626",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 8,
        zIndex: 1,
    },
    discountText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
    productImage: {
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#F5F5F5",
    },
    cardContent: { flex: 1 },
    productName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    productPrice: { fontSize: 12, color: "#555", marginBottom: 10 },

    // Layout Tombol
    actionColumn: { flexDirection: "column", width: "100%" },
    buttonWrapper: { width: "100%", height: 26 }, // Tinggi tetap agar rapi

    // Tombol Awal (Belum dipilih)
    rentButton: {
        flex: 1,
        backgroundColor: "#FBBF24",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    rentButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },

    buyButton: {
        flex: 1,
        backgroundColor: "#103568",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    buyButtonText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },

    // Tombol Counter (Sudah dipilih)
    counterContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 2,
        backgroundColor: "#FFF",
    },
    counterBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    counterText: { fontSize: 12, fontWeight: "bold", paddingHorizontal: 4 },

    // Footer
    footerCard: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFF",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 20,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: { fontSize: 12, color: "#666" },
    totalPrice: { fontSize: 18, fontWeight: "bold", color: "#103568" },
    checkoutButton: {
        backgroundColor: "#103568",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    checkoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});
