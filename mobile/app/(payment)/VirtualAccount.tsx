import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

export default function VirtualAccountScreen() {
  const router = useRouter();

  // Menerima data yang dikirim dari Payment.tsx
  const params = useLocalSearchParams();
  const bankName = params.bankName || 'BNI'; // Default jika kosong
  const bankImage = params.bankImage || 'https://via.placeholder.com/50x50/F15A23/FFFFFF?text=BNI';

  // Data Dummy
  const vaNumber = "8029 2512 3125 5206";
  const totalAmount = 11000;

  // Format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Fungsi Salin Nomor VA
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(vaNumber);
    Alert.alert("Disalin", "Nomor Virtual Account berhasil disalin.");
  };

  const handleConfirm = () => {
    Alert.alert("Pembayaran Selesai", "Terima kasih telah melakukan pembayaran.", [
        { text: "OK", onPress: () => router.push('/') } // Kembali ke Home
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

      <ScrollView contentContainerStyle={styles.content}>

        {/* STATUS ICON & TEXT */}
        <View style={styles.statusContainer}>
          <Ionicons name="time" size={48} color="#F97316" style={{ marginBottom: 10 }} />
          <Text style={styles.statusText}>Menunggu Pembayaran</Text>
        </View>

        {/* TIMER SECTION */}
        <View style={styles.timerCard}>
            <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Selesaikan pembayaran dalam</Text>
                <Text style={styles.timerValue}>00:29:58</Text>
            </View>

            <View style={styles.warningBox}>
                <Ionicons name="information-circle-outline" size={20} color="#F97316" style={{ marginRight: 8 }} />
                <Text style={styles.warningText}>Selesaikan pembayaran sebelum waktu habis</Text>
            </View>
        </View>

        {/* VA DETAILS CARD */}
        <View style={styles.detailsCard}>
            {/* Header Bank */}
            <View style={styles.bankHeader}>
                <Image
                    source={{ uri: bankImage as string }}
                    style={styles.bankLogo}
                    resizeMode="contain"
                />
                <View>
                    <Text style={styles.vaLabelSmall}>Virtual Account (VA)</Text>
                    <Text style={styles.bankNameText}>{bankName}</Text>
                </View>
            </View>

            <View style={styles.separator} />

            {/* Nomor VA */}
            <View style={styles.vaRow}>
                <View>
                    <Text style={styles.vaLabelSmall}>Nomor Virtual Account</Text>
                    <Text style={styles.vaNumber}>{vaNumber}</Text>
                </View>
                <TouchableOpacity onPress={copyToClipboard}>
                    <Text style={styles.copyButton}>Salin</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            {/* Total */}
            <View style={styles.totalRowInternal}>
                <Text style={styles.totalLabelInternal}>Total Pembayaran</Text>
                <Text style={styles.totalValueInternal}>{formatRupiah(totalAmount)}</Text>
            </View>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Total Bayar</Text>
          <Text style={styles.footerPrice}>{formatRupiah(totalAmount)}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handleConfirm}>
          <Text style={styles.payButtonText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '500', color: '#103568' },
  backButton: { padding: 5 },

  content: { paddingBottom: 120 },

  // Status
  statusContainer: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#F8F9FA' },
  statusText: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  // Timer
  timerCard: { backgroundColor: '#FFF', padding: 20, marginBottom: 10 },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timerLabel: { fontSize: 14, color: '#666' },
  timerValue: { fontSize: 14, fontWeight: 'bold', color: '#F97316' },
  warningBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7E6', padding: 12, borderRadius: 8 },
  warningText: { fontSize: 12, color: '#333', flex: 1 },

  // Details
  detailsCard: { backgroundColor: '#FFF', padding: 20, marginBottom: 20 },
  bankHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  bankLogo: { width: 50, height: 30, marginRight: 15, backgroundColor: '#f0f0f0' },
  vaLabelSmall: { fontSize: 12, color: '#888', marginBottom: 2 },
  bankNameText: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  separator: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },

  vaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vaNumber: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 5 },
  copyButton: { color: '#108EE9', fontWeight: 'bold', fontSize: 14 },

  totalRowInternal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabelInternal: { fontSize: 14, color: '#333' },
  totalValueInternal: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#E5E7EB', padding: 20, borderTopWidth: 1, borderTopColor: '#DDD' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  footerLabel: { fontSize: 16, color: '#333' },
  footerPrice: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  payButton: { backgroundColor: '#103568', paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  payButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
