import React, { useState } from 'react'; // Tambah useState
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Tambah useLocalSearchParams
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/services/api'; // Import API

const { width } = Dimensions.get('window');

export default function QrisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Tangkap data booking
  const [isProcessing, setIsProcessing] = useState(false);

  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PembayaranFishingApp";

  const handleFinish = async () => {
    if (isProcessing) return;
    
    Alert.alert(
        "Konfirmasi Pembayaran",
        "Apakah Anda sudah melakukan pembayaran via QRIS?",
        [
            { text: "Belum", style: "cancel" },
            { 
                text: "Sudah", 
                onPress: async () => {
                    setIsProcessing(true);
                    try {
                        if (!params.bookingData) {
                            Alert.alert("Error", "Data booking hilang");
                            return;
                        }

                        const rawData = JSON.parse(params.bookingData as string);

                        const payload = {
                            tempat_id: rawData.spotId,
                            tanggal_booking: rawData.date, // Perhatikan Key ini
                            start_time: rawData.time,
                            duration: rawData.duration,
                            no_kursi_list: rawData.seats,
                            total_harga_spot: rawData.spotPriceTotal,
                            cart_items: rawData.cartItems || []
                        };

                        await api.bookings.create(payload);

                        Alert.alert("Sukses", "Pembayaran terverifikasi & Booking tersimpan!", [
                            { text: "OK", onPress: () => router.push('/') }
                        ]);

                    } catch (error: any) {
                        console.error("QRIS Error:", error);
                        Alert.alert("Gagal", "Gagal memverifikasi pembayaran.");
                    } finally {
                        setIsProcessing(false);
                    }
                }
            }
        ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* ... (Tampilan QR Code sama seperti sebelumnya) ... */}
        
        {/* GUNAKAN KOMPONEN GAMBAR ANDA SEBELUMNYA DI SINI */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Kode QR</Text>
          <Text style={styles.instructionText}>
            Pindai kode QR ini untuk membayar.
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <Image
              source={{ uri: qrCodeUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* TOMBOL KONFIRMASI (YANG DIPERBAIKI) */}
        <TouchableOpacity 
            style={[styles.finishButton, isProcessing && { opacity: 0.5 }]} 
            onPress={handleFinish}
            disabled={isProcessing}
        >
           <Text style={styles.finishButtonText}>
               {isProcessing ? "Memproses..." : "Saya Sudah Membayar"}
           </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// ... (Styles sama, tambahkan style finishButton agar terlihat seperti tombol aksi utama)
const styles = StyleSheet.create({
    // ... styles lama
    finishButton: {
        marginTop: 20,
        backgroundColor: '#103568',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    finishButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // ...
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#F3F4F6' },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: '500', color: '#103568' },
    content: { flex: 1, padding: 25, alignItems: 'center' },
    instructionBox: { backgroundColor: '#E0E0E0', borderRadius: 15, padding: 20, width: '100%', marginBottom: 40 },
    instructionTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 8, color: '#000' },
    instructionText: { fontSize: 12, color: '#444', lineHeight: 18 },
    qrContainer: { backgroundColor: '#E0E0E0', borderRadius: 25, padding: 25, width: width * 0.8, height: width * 0.8, justifyContent: 'center', alignItems: 'center', marginBottom: 60 },
    qrWrapper: { backgroundColor: '#FFF', padding: 10, borderRadius: 10 },
    qrImage: { width: 200, height: 200 },
});