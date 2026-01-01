import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* === HEADER SECTION === */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          {/* Search Bar Overlay */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput
                placeholder="Tempat mancing terdekat"
                style={styles.searchInput}
              />
              <Ionicons name="search" size={24} color="#666" />
            </View>
          </View>
        </View>

        {/* === SECTION 1: RECOMMENDATIONS === */}
        <View style={styles.section}>

          {/* Navigasi ke Recommendation_Place.tsx */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => router.push('/Recommendation_Place')}
          >
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {/* Card 1 */}
            <View style={styles.card}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Landscape_of_Samosir_Island_and_Lake_Toba.jpg/800px-Landscape_of_Samosir_Island_and_Lake_Toba.jpg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Pemancingan Kaung Semangi</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4].map((_, i) => <FontAwesome key={i} name="star" size={12} color="#333" />)}
                  <FontAwesome name="star-o" size={12} color="#333" />
                </View>
                <Text style={styles.cardAddress}>Jl. Cipaku Indah X No.2, RW.4, Ledeng, Bandung</Text>
              </View>
            </View>

            {/* Card 2 */}
            <View style={styles.card}>
              <Image
                source={{ uri: 'https://cdn0-production-images-kly.akamaized.net/8lJ7X4y4l8y4l8y4l8y4l8y4l8=/640x360/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3246733/original/0324673300_1600833333-Pemancingan_1.jpg' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Pemancingan Alam Endah</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3].map((_, i) => <FontAwesome key={i} name="star" size={12} color="#333" />)}
                  <FontAwesome name="star-half-full" size={12} color="#333" />
                </View>
                <Text style={styles.cardAddress}>Jl. Raya Purwakarta No.12, Padalarang</Text>
              </View>
            </View>

            <View style={{ width: 20 }} />
          </ScrollView>
        </View>

        {/* === SECTION 2: TIPS & TRICKS === */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips & Tricks</Text>
          <View style={styles.tipsCard}>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.tipsContent}>
              <View style={styles.iconCircle}>
                <Ionicons name="fish-outline" size={32} color="#333" />
              </View>
              <Text style={styles.tipsTitle}>Rawat peralatan sederhana</Text>
              <Text style={styles.tipsDesc}>
                Bilas reel dan joran setelah dipakai, keringkan, simpan rapi. Peralatan murah pun awet kalau dirawat.
              </Text>
            </View>

            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* === SECTION 3: EVENT === */}
        <View style={styles.section}>

          {/* UPDATED: Header Event sekarang bisa diklik */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => router.push('/Event_Page')}
          >
             <Text style={styles.sectionTitle}>Event</Text>
             <Ionicons name="chevron-forward" size={20} color="#333" />
          </TouchableOpacity>

          {/* Card Event tetap statis di Home, hanya header yang navigasi */}
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => router.push('/Event_Page')} // Opsional: Klik card juga pindah
          >
            <Image
              source={{ uri: 'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' }}
              style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>“Master Angler Open Cup”</Text>
              <Text style={styles.eventText}>Kota: Malang</Text>
              <Text style={styles.eventText}>Tanggal: 20 April 2025</Text>
              <Text style={styles.eventText}>Total hadiah: Rp700.000</Text>
              <Text style={styles.eventText}>Biaya pendaftaran: Rp60.000/orang</Text>
              <Text style={styles.eventText}>Penilaian berdasarkan: Ikan terberat</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  // Header Styles
  headerContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  headerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  searchContainer: {
    position: 'absolute',
    bottom: -25,
    width: '100%',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '85%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    color: '#333',
  },

  // General Section Styles
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5, // Tambahan area sentuh
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },

  // Recommendations Horizontal Scroll
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  card: {
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginRight: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
  },

  // Tips Card Styles
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  arrowButton: {
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  tipsContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  tipsDesc: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },

  // Event Card Styles
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  eventText: {
    fontSize: 10,
    color: '#555',
    marginBottom: 2,
  },
});
