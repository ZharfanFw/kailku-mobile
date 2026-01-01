import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const SEAT_SIZE = 35;
const PRICE_PER_HOUR = 25000;

export default function BookingScreen() {
  const router = useRouter();

  // --- STATE DATA ---
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const today = new Date();
  const defaultDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("--Pilih Jam--");
  const [duration, setDuration] = useState(1);

  const [modalVisible, setModalVisible] = useState<'none' | 'date' | 'time' | 'duration'>('none');

  const [seatStatus] = useState<{ [key: number]: 'filled' | 'empty' }>({
    2: 'filled', 5: 'filled', 18: 'filled'
  });

  // --- DATA OPSI ---
  const timeOptions = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00"
  ];

  const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  // Generate 365 hari
  const generateDates = () => {
    const dates = [];
    const start = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateString = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      dates.push(dateString);
    }
    return dates;
  };
  const dateOptions = generateDates();

  // --- LOGIC ---
  const toggleSeat = (id: number) => {
    if (seatStatus[id] === 'filled') return;
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(seatId => seatId !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const totalPrice = PRICE_PER_HOUR * duration * selectedSeats.length;

  const renderSeat = (id: number) => {
    const isSelected = selectedSeats.includes(id);
    const isFilled = seatStatus[id] === 'filled';

    let backgroundColor = '#FFFFFF';
    let borderColor = '#999';
    let textColor = '#999';

    if (isFilled) {
      backgroundColor = '#86EFAC';
      borderColor = '#4ADE80';
      textColor = '#166534';
    } else if (isSelected) {
      backgroundColor = '#FCD34D';
      borderColor = '#F59E0B';
      textColor = '#78350F';
    }

    return (
      <TouchableOpacity
        key={id}
        style={[styles.seatBox, { backgroundColor, borderColor }]}
        onPress={() => toggleSeat(id)}
        disabled={isFilled}
      >
        <Text style={[styles.seatText, { color: textColor }]}>{id}</Text>
      </TouchableOpacity>
    );
  };

  // --- HANDLE LANJUT ---
  const handleProceed = () => {
    // Navigasi ke halaman Buys_and_Rent_Fishing
    router.push('/Buys_and_Rent_Fishing');
  };

  // Komponen Modal
  const renderModal = () => {
    let data: any[] = [];
    let onSelect: (val: any) => void = () => {};
    let title = "";

    if (modalVisible === 'date') {
      data = dateOptions;
      title = "Pilih Tanggal";
      onSelect = (val) => setDate(val);
    } else if (modalVisible === 'time') {
      data = timeOptions;
      title = "Pilih Jam Mulai";
      onSelect = (val) => setTime(val);
    } else if (modalVisible === 'duration') {
      data = durationOptions;
      title = "Pilih Durasi";
      onSelect = (val) => setDuration(val);
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible !== 'none'}
        onRequestClose={() => setModalVisible('none')}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible('none')}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible('none')}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible('none');
                  }}
                >
                  <Text style={styles.modalItemText}>
                    {modalVisible === 'duration' ? `${item} Jam` : item}
                  </Text>
                  { (item === date || item === time || item === duration) &&
                    <Ionicons name="checkmark" size={20} color="#103568" />
                  }
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonTop}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Tempat</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Tanggal</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisible('date')}>
            <Text style={styles.inputText}>{date}</Text>
            <Ionicons name="calendar-outline" size={20} color="#333" />
          </TouchableOpacity>

          <Text style={styles.label}>Jam</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisible('time')}>
            <Text style={[styles.inputText, time === "--Pilih Jam--" && { color: '#999' }]}>{time}</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>

          <Text style={styles.label}>Durasi</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setModalVisible('duration')}>
            <Text style={styles.inputText}>{duration} Jam</Text>
            <Ionicons name="chevron-down" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.topRow}>{[1, 2, 3, 4, 5, 6, 7, 8].map(id => renderSeat(id))}</View>
          <View style={styles.middleRow}>
             <View style={styles.sideColumn}>{[28, 27, 26].map(id => renderSeat(id))}</View>
             <View style={styles.poolArea}><Text style={styles.poolText}>Kolam</Text></View>
             <View style={styles.sideColumn}>{[9, 10, 11].map(id => renderSeat(id))}</View>
          </View>
          <View style={styles.bottomRow}>{[22, 21, 20, 19, 18, 17, 16, 15].map(id => renderSeat(id))}</View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
             <View style={[styles.legendBox, { backgroundColor: '#86EFAC', borderColor: '#4ADE80' }]} />
             <Text style={styles.legendText}>Sudah Terisi</Text>
          </View>
          <View style={styles.legendItem}>
             <View style={[styles.legendBox, { backgroundColor: '#FFF', borderColor: '#999' }]} />
             <Text style={styles.legendText}>Kosong</Text>
          </View>
          <View style={styles.legendItem}>
             <View style={[styles.legendBox, { backgroundColor: '#FCD34D', borderColor: '#F59E0B' }]} />
             <Text style={styles.legendText}>Dipilih</Text>
          </View>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footerCard}>
        <View style={styles.footerHeader}>
          <View>
            <Text style={styles.footerTitle}>Daftar Pemesanan</Text>
            <Text style={styles.footerSubtitle}>{date} • {time} • {duration} Jam</Text>
          </View>
          <TouchableOpacity style={styles.footerBackButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total ({selectedSeats.length} Kursi)</Text>
          <Text style={styles.totalPrice}>{formatRupiah(totalPrice)}</Text>
        </View>

        {/* --- TOMBOL LANJUT KE SEWA ALAT --- */}
        <TouchableOpacity
          style={[styles.checkoutButton, (selectedSeats.length === 0 || time === "--Pilih Jam--") && styles.disabledButton]}
          disabled={selectedSeats.length === 0 || time === "--Pilih Jam--"}
          onPress={handleProceed}
        >
          <Text style={styles.checkoutButtonText}>Lanjut ke Sewa Alat</Text>
        </TouchableOpacity>
      </View>

      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  backButtonTop: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 220 },
  formSection: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '500' },
  inputBox: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CCC',
    borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 15,
  },
  inputText: { color: '#333', fontSize: 14 },
  mapContainer: { alignItems: 'center', marginVertical: 10 },
  seatBox: { width: SEAT_SIZE, height: SEAT_SIZE, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center', margin: 4 },
  seatText: { fontSize: 12, fontWeight: 'bold' },
  topRow: { flexDirection: 'row', marginBottom: 5 },
  middleRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: (SEAT_SIZE + 8) * 8 },
  sideColumn: { flexDirection: 'column', justifyContent: 'center' },
  poolArea: { flex: 1, backgroundColor: '#6B8EBB', marginHorizontal: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderColor: '#4A6FA5', borderWidth: 1 },
  poolText: { color: '#103568', fontWeight: 'bold', fontSize: 16 },
  bottomRow: { flexDirection: 'row', marginTop: 5 },
  legendContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 20, height: 20, borderWidth: 1, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 12, color: '#555' },
  footerCard: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  footerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  footerTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  footerSubtitle: { fontSize: 10, color: '#666', marginTop: 4 },
  footerBackButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  totalPrice: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  checkoutButton: { backgroundColor: '#103568', paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#CCC' },
  checkoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: height * 0.6 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontSize: 16, color: '#333' }
});
