import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function InformationPlaceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Mengatur StatusBar agar transparan/menyatu dengan gambar */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ScrollView untuk konten utama */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* === HEADER IMAGE SECTION === */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1594917631627-7f0d01b13170?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.headerImage}
          />

          {/* Overlay Gelap sedikit agar tulisan terbaca */}
          <View style={styles.imageOverlay} />

          {/* Tombol Back */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Judul di atas gambar */}
          <View style={styles.titleContainer}>
            <Text style={styles.placeTitle}>Kolam Pancing</Text>
            <Text style={styles.placeTitle}>Pak Sukardi</Text>
          </View>
        </View>

        {/* === LOCATION CARD === */}
        <View style={styles.contentContainer}>
          <View style={styles.locationCard}>
            <View style={styles.locationTextContainer}>
              <Text style={styles.cardHeader}>Lokasi Pemancingan</Text>
              <Text style={styles.addressText}>
                Jl. Raya Banjarejo No.245, Banjarsari, Banjarejo, Kec. Pakis, Kabupaten Malang, Jawa Timur 65154
              </Text>
            </View>

            {/* Ikon Maps */}
            <TouchableOpacity style={styles.mapButton}>
               <View style={styles.mapIconContainer}>
                 <Ionicons name="location-outline" size={24} color="#666" />
                 <Text style={styles.mapText}>Maps</Text>
               </View>
            </TouchableOpacity>
          </View>

          {/* === REVIEW SECTION === */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Review</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewScroll}>

              {/* Review Card 1 */}
              <View style={styles.reviewCard}>
                <Text style={styles.reviewText}>
                  “Tempatnya tenang, ikannya banyak dan kolamnya bersih. Cocok buat yang mau mancing sambil nyantai. Pelayanan juga sigap.”
                </Text>
                <Text style={styles.reviewName}>Rama Putra</Text>
              </View>

              {/* Review Card 2 */}
              <View style={styles.reviewCard}>
                <Text style={styles.reviewText}>
                  “Lumayan luas dan spotnya enak. Cuma kadang agak ramai di weekend, jadi harus datang lebih awal. Tapi pengalaman mancing tetap oke.”
                </Text>
                <Text style={styles.reviewName}>Dimas Arfiansyah</Text>
              </View>

              <View style={{ width: 20 }} />
            </ScrollView>
          </View>
        </View>

      </ScrollView>

      {/* === STICKY FOOTER (Booking) === */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Biaya per-Jam</Text>
          <Text style={styles.priceValue}>Rp 25.000</Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Booking Now</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  // Header Image Styles
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)', // Sedikit gelap agar teks putih terbaca jika ada
  },
  backButton: {
    position: 'absolute',
    top: 50, // Sesuaikan dengan notch HP
    left: 20,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 40, // Memberi ruang agar tidak tertutup card lokasi
    left: 20,
  },
  placeTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  // Main Content Styles
  contentContainer: {
    flex: 1,
    marginTop: -30, // Efek menumpuk (Overlap) ke atas gambar
    paddingHorizontal: 20,
  },

  // Location Card
  locationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 25,
  },
  locationTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 18,
  },
  mapButton: {
    width: 60,
    height: 60,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mapIconContainer: {
    alignItems: 'center',
  },
  mapText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontWeight: '600',
  },

  // Review Styles
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reviewScroll: {
    marginHorizontal: -20, // Agar scroll mentok pinggir layar
    paddingHorizontal: 20,
  },
  reviewCard: {
    width: 280,
    backgroundColor: '#EBF8FF', // Warna biru muda seperti di gambar
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  reviewText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  reviewName: {
    marginTop: 15,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },

  // Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    elevation: 10, // Shadow untuk Android
  },
  priceLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 20,
    color: '#FF3B30', // Merah harga
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#103568', // Biru tua tombol
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
