import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function ReviewPathScreen() {
    const router = useRouter();

    // State untuk menyimpan nilai rating (1-5) dan teks ulasan
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    // Fungsi saat tombol bintang ditekan
    const handleStarPress = (starIndex: number) => {
        setRating(starIndex);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert(
                "Peringatan",
                "Mohon berikan rating bintang terlebih dahulu.",
            );
            return;
        }

        // Logika simpan review bisa ditambahkan di sini
        console.log("Review Submitted:", { rating, reviewText });

        // Kembali ke halaman sebelumnya setelah submit
        Alert.alert("Sukses", "Ulasan Anda berhasil dikirim!", [
            { text: "OK", onPress: () => router.back() },
        ]);
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea}>
                {/* HEADER SECTION (Dark Blue Background) */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Review</Text>
                </View>

                {/* CONTENT SECTION (White Rounded Sheet) */}
                <View style={styles.contentContainer}>
                    <View style={styles.contentInner}>
                        {/* Nama Tempat */}
                        <Text style={styles.placeName}>
                            Kolam Pemancingan Pak Ade
                        </Text>

                        {/* Text Input Area */}
                        <TextInput
                            style={styles.textInput}
                            placeholder="tulis ulasan anda..."
                            placeholderTextColor="#999"
                            multiline={true}
                            textAlignVertical="top"
                            value={reviewText}
                            onChangeText={setReviewText}
                        />

                        {/* Star Rating Interactive */}
                        <View style={styles.starContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => handleStarPress(star)}
                                    activeOpacity={0.7}
                                >
                                    <FontAwesome
                                        name={
                                            star <= rating ? "star" : "star-o"
                                        }
                                        size={40}
                                        color={
                                            star <= rating ? "#FFC107" : "#000"
                                        } // Kuning jika aktif, Hitam outline jika tidak
                                        style={styles.starIcon}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            {/* Cancel Button */}
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#103568", // Warna Biru Tua Background Header
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 25,
        paddingTop: 40, // Sesuaikan dengan notch HP
        paddingBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#FFF",
        letterSpacing: 0.5,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
    },
    contentInner: {
        padding: 25,
        flex: 1,
    },
    placeName: {
        fontSize: 18,
        color: "#000",
        marginBottom: 20,
        fontWeight: "400",
    },
    textInput: {
        width: "100%",
        height: 180,
        backgroundColor: "#F2F2F2", // Abu-abu muda background input
        borderRadius: 15,
        padding: 15,
        fontSize: 14,
        color: "#333",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 30,
    },
    starContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 40,
    },
    starIcon: {
        marginHorizontal: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#808080", // Warna Abu-abu tombol Cancel
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: "#FFC107", // Warna Kuning/Orange tombol Submit
        marginLeft: 10,
    },
    cancelButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
