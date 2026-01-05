import React from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QrisScreen() {
  const router = useRouter();

  // URL Dummy QR Code (Bisa diganti dengan API generate QR sesungguhnya nanti)
  // Menggunakan API publik untuk contoh visual
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PembayaranFishingApp";

  const handleFinish = () => {
    Alert.alert("Pembayaran Selesai", "Terima kasih, pembayaran Anda sedang diproses.", [
      { text: "OK", onPress: () => router.push('/') }
    ]);
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

        {/* KOTAK INSTRUKSI */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Kode QR</Text>
          <Text style={styles.instructionText}>
            Pindai atau unggah kode QR ini menggunakan aplikasi perbankan/dompet digital QRIS Anda untuk menyelesaikan pembayaran Anda.
          </Text>
        </View>

        {/* CONTAINER QR CODE */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <Image
              source={{ uri: qrCodeUrl }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* LABEL BAWAH */}
        <View style={styles.bottomLabel}>
           <Text style={styles.bottomLabelText}>Kode QR</Text>
        </View>

        {/* TOMBOL KONFIRMASI (Opsional: Agar user bisa keluar) */}
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
           <Text style={styles.finishButtonText}>Cek Status Pembayaran</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Background putih sesuai gambar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F3F4F6', // Sedikit abu-abu untuk header
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#103568',
  },
  content: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
  },

  // Instruksi
  instructionBox: {
    backgroundColor: '#E0E0E0', // Abu-abu
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 40,
  },
  instructionTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    color: '#000',
  },
  instructionText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },

  // QR Section
  qrContainer: {
    backgroundColor: '#E0E0E0', // Abu-abu border luar
    borderRadius: 25,
    padding: 25,
    width: width * 0.8, // 80% lebar layar
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  qrWrapper: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
  },
  qrImage: {
    width: 200,
    height: 200,
  },

  // Label Bawah
  bottomLabel: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomLabelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },

  // Tombol Finish (Tambahan UX)
  finishButton: {
    marginTop: 10,
    padding: 10,
  },
  finishButtonText: {
    color: '#103568',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
