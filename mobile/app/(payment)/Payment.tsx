import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Tipe data untuk metode pembayaran
type PaymentMethod = {
    id: string;
    name: string;
    image: string;
};

type PaymentCategory = {
    id: string;
    title: string;
    data: PaymentMethod[];
};

export default function PaymentScreen() {
    const router = useRouter();

    // Default accordion yang terbuka (Virtual Account)
    const [expandedSection, setExpandedSection] = useState<string | null>(
        "virtual_account",
    );

    // State untuk metode pembayaran yang dipilih
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    // --- DATA METODE PEMBAYARAN ---
    const paymentMethods: PaymentCategory[] = [
        {
            id: "qris",
            title: "Qris",
            data: [
                {
                    id: "qris_code",
                    name: "Qris",
                    image: "https://via.placeholder.com/50x50/000000/FFFFFF?text=QRIS",
                },
            ],
        },
        {
            id: "virtual_account",
            title: "Virtual Account(VA)",
            data: [
                {
                    id: "bca",
                    name: "BCA",
                    image: "https://via.placeholder.com/50x50/005596/FFFFFF?text=BCA",
                },
                {
                    id: "bni",
                    name: "BNI",
                    image: "https://via.placeholder.com/50x50/F15A23/FFFFFF?text=BNI",
                },
                {
                    id: "mandiri",
                    name: "Mandiri",
                    image: "https://via.placeholder.com/50x50/003D79/FFFFFF?text=M",
                },
                {
                    id: "bsi",
                    name: "BSI",
                    image: "https://via.placeholder.com/50x50/00A39D/FFFFFF?text=BSI",
                },
            ],
        },
    ];

    const totalPayment = 10000; // Contoh total bayar

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    // --- FUNGSI NAVIGASI PEMBAYARAN ---
    const handlePay = () => {
        // 1. Validasi apakah user sudah memilih metode
        if (!selectedMethod) {
            Alert.alert(
                "Pilih Metode",
                "Silakan pilih metode pembayaran terlebih dahulu.",
            );
            return;
        }

        // 2. Logika untuk Qris
        if (selectedMethod === "Qris") {
            router.push("/(payment)/Qris"); // Pindah ke file Qris.tsx
            return;
        }

        // 3. Logika untuk Virtual Account (VA)
        // Cari URL gambar dari bank yang dipilih
        let selectedBankImage = "";

        // Loop untuk menemukan gambar bank
        paymentMethods.forEach((category) => {
            const foundItem = category.data.find(
                (item) => item.name === selectedMethod,
            );
            if (foundItem) {
                selectedBankImage = foundItem.image;
            }
        });

        // Pindah ke file Virtual_Account.tsx dengan membawa data
        router.push({
            pathname: "/(payment)/VirtualAccount",
            params: {
                bankName: selectedMethod,
                bankImage: selectedBankImage,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Metode Pembayaran</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {paymentMethods.map((category, index) => {
                    const isOpen = expandedSection === category.id;

                    return (
                        <View key={category.id} style={styles.sectionContainer}>
                            {/* Header Kategori (Accordion) */}
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => toggleSection(category.id)}
                            >
                                <Text style={styles.sectionTitle}>
                                    {category.title}
                                </Text>
                                <Ionicons
                                    name={
                                        isOpen ? "chevron-up" : "chevron-down"
                                    }
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>

                            {/* List Metode Pembayaran */}
                            {isOpen && (
                                <View style={styles.sectionBody}>
                                    {category.data.map(
                                        (method, methodIndex) => {
                                            const isSelected =
                                                selectedMethod === method.name;
                                            // Cek apakah ini item terakhir untuk styling border
                                            const isLast =
                                                methodIndex ===
                                                category.data.length - 1;

                                            return (
                                                <TouchableOpacity
                                                    key={method.id}
                                                    style={[
                                                        styles.paymentItem,
                                                        isLast && {
                                                            borderBottomWidth: 0,
                                                        },
                                                    ]}
                                                    onPress={() =>
                                                        setSelectedMethod(
                                                            method.name,
                                                        )
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            styles.paymentInfo
                                                        }
                                                    >
                                                        {/* Placeholder Logo Bank */}
                                                        <Image
                                                            source={{
                                                                uri: method.image,
                                                            }}
                                                            style={
                                                                styles.paymentLogo
                                                            }
                                                            resizeMode="contain"
                                                        />
                                                        <Text
                                                            style={
                                                                styles.paymentName
                                                            }
                                                        >
                                                            {method.name}
                                                        </Text>
                                                    </View>

                                                    {/* Radio Button */}
                                                    <View
                                                        style={
                                                            styles.radioOuter
                                                        }
                                                    >
                                                        {isSelected && (
                                                            <View
                                                                style={
                                                                    styles.radioInner
                                                                }
                                                            />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        },
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <Text style={styles.footerLabel}>Total Bayar</Text>
                    <Text style={styles.footerPrice}>
                        {formatRupiah(totalPayment)}
                    </Text>
                </View>
                <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                    <Text style={styles.payButtonText}>Bayar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F3F4F6",
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: "#103568",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 120, // Padding bawah agar tidak tertutup footer
    },

    // Accordion Styles
    sectionContainer: {
        marginBottom: 15,
        backgroundColor: "#FFF",
        borderRadius: 12,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#E5E7EB",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    sectionBody: {
        backgroundColor: "#FFF",
    },

    // Payment Item Styles
    paymentItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    paymentInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    paymentLogo: {
        width: 40,
        height: 25,
        backgroundColor: "#FFF",
    },
    paymentName: {
        fontSize: 16,
        color: "#333",
    },

    // Radio Button Styles
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#333",
    },

    // Footer Styles
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#E5E7EB",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#DDD",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    footerLabel: {
        fontSize: 16,
        color: "#333",
    },
    footerPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    payButton: {
        backgroundColor: "#103568", // Biru Tua
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: "center",
    },
    payButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
