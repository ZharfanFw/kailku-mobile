import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Mengambil lebar layar untuk menghitung ukuran kartu agar pas 2 kolom
const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 48 adalah total margin kiri-kanan-tengah

// Data Dummy sesuai gambar yang kamu upload
const places = [
    {
        id: "1",
        name: "Kolam Pancing Pak Sukardi",
        image: "https://images.unsplash.com/photo-1594917631627-7f0d01b13170?q=80&w=2070&auto=format&fit=crop",
        rating: 4,
        address:
            "Jl. Raya Banjarejo No.245, Banjarsari, Banjarejo, Kec. Pakis, Kabupaten Malang, Jawa Timur 65154",
    },
    {
        id: "2",
        name: "Pemancingan Alam Endah",
        image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        rating: 3,
        address: "Jl. Raya Purwakarta No.12, Cempakamekar, Kec. Padalarang",
    },
    {
        id: "3",
        name: "Kolam Retensi Cieunteung",
        image: "https://water.europa.eu/freshwater/europe-freshwater/items/files/lakes/image_preview",
        rating: 5,
        address: "2J5H+54H, Baleendah, Kec. Baleendah, Kabupaten Bandung",
    },
    {
        id: "4",
        name: "De Ragil New Semar",
        image: "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/123/2023/10/06/Kolam-Pemancingan-Ratu-Mas-Ayu-2292780720.jpg",
        rating: 4,
        address: "Lesanpuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65138",
    },
    {
        id: "5",
        name: 'Kolam Pemancingan "ALAM INDAH"',
        image: "https://asset.kompas.com/crops/OqgNqC4Xy7I57uXw5X3n0bX5v5s=/0x0:1000x667/750x500/data/photo/2020/02/10/5e4125b44675e.jpg",
        rating: 3,
        address:
            "2M72+C77, Lesanpuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65137",
    },
    {
        id: "6",
        name: "Kolam Pemancingan Telaga Kencana",
        image: "https://awsimages.detik.net.id/community/media/visual/2022/06/18/tempat-pemancingan-di-bogor_169.jpeg?w=700&q=90",
        rating: 5,
        address:
            "3M29+Q6M, Krajan, Mangliawan, Kec. Pakis, Kabupaten Malang, Jawa Timur 65154",
    },
];

export default function RecommendationPlaceScreen() {
    const router = useRouter();

    // Fungsi untuk menampilkan bintang rating
    const renderStars = (rating: number) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= rating ? "star" : "star-o"}
                    size={10}
                    color="#333"
                    style={{ marginRight: 2 }}
                />,
            );
        }
        return stars;
    };

    // Komponen Kartu (Card)
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: "/(booking)/InformationPlace", // Pastikan path ini benar sesuai struktur folder
                params: { id: item.id }
            })}
        >
            {/* ... isi card sama ... */}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            {/* HEADER SECTION */}
            <View style={styles.header}>
                {/* Tombol Back */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.placeholderText}>
                        Tempat mancing terdekat
                    </Text>
                    <Ionicons name="search" size={20} color="#666" />
                </View>
            </View>

            {/* LIST GRID SECTION */}
            <FlatList
                data={places}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Membuat 2 kolom
                columnWrapperStyle={styles.columnWrapper} // Style untuk jarak antar kolom
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 10,
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        marginRight: 15,
        // Shadow tipis
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 25,
        height: 45,
        paddingHorizontal: 20,
        // Shadow tipis
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    placeholderText: {
        color: "#888",
        fontSize: 14,
    },

    // List Styles
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: "space-between", // Memberi jarak rata antara kiri dan kanan
    },

    // Card Styles
    card: {
        width: cardWidth,
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#EFEFEF",
        // Shadow Card
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: 120,
        resizeMode: "cover",
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
        height: 32, // Menjaga tinggi judul agar kartu rata
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 6,
    },
    cardAddress: {
        fontSize: 10,
        color: "#666",
        lineHeight: 14,
    },
});
