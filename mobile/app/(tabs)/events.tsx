import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// DATA DUMMY EVENT (Masih dipakai sesuai permintaan)
const events = [
  {
    id: "1",
    title: "Master Angler Open Cup",
    date: "20 April 2025",
    location: "Kota: Malang",
    totalPrize: "Rp700.000",
    registrationFee: "Rp60.000/orang",
    criteria: "Ikan terberat",
    image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
  },
  {
    id: "2",
    title: "Pemancingan Galatama",
    date: "15 Mei 2025",
    location: "Kota: Bandung",
    totalPrize: "Rp500.000",
    registrationFee: "Rp50.000/orang",
    criteria: "Ikan terbanyak",
    image: "https://cdn.pixabay.com/photo/2019/07/22/10/42/fishing-4354673_1280.jpg",
  },
  {
    id: "3",
    title: "Fishing Competition",
    date: "10 Juni 2025",
    location: "Kota: Jakarta",
    totalPrize: "Rp1.000.000",
    registrationFee: "Rp80.000/orang",
    criteria: "Ikan terbesar",
    image: "https://cdn.pixabay.com/photo/2017/06/04/23/17/lighthouse-2372461_1280.jpg",
  },
];

export default function EventScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderEventCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventText}>{item.location}</Text>
        <Text style={styles.eventText}>{item.date}</Text>
        <Text style={[styles.eventText, { fontWeight: "bold", color: "#103568" }]}>
          Hadiah: {item.totalPrize}
        </Text>
        <Text style={styles.eventText}>Biaya: {item.registrationFee}</Text>
        <Text style={styles.eventText}>Kriteria: {item.criteria}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Scroll dihandle oleh ScrollView induk
        />
      </ScrollView>
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#103568",
  },
  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  eventDetails: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  eventText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
});