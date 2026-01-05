import React from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Notification data interface
type NotificationData = {
    id: number;
    status: "pending" | "success" | "failed";
    statusLabel: string;
    timer?: string;
    title: string;
    address: string;
    date: string;
};

export default function NotificationsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Data Dummy Sesuai Gambar
    const notifications: NotificationData[] = [
        {
            id: 1,
            status: "pending",
            statusLabel: "Belum Dibayar",
            timer: "22:53:45",
            title: "Kolam Pemancingan Brigif 15",
            address:
                "4G4J+R9F, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40521",
            date: "05/11/2025",
        },
        {
            id: 2,
            status: "success",
            statusLabel: "Sudah Dibayar",
            title: "Kolam Pemancingan Pak Ade",
            address:
                "5FFJ+6V8, Bojongkoneng, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552",
            date: "07/10/2025",
        },
        {
            id: 3,
            status: "failed",
            statusLabel: "Gagal Bayar",
            title: "Kolam Pancing Galatama",
            address:
                "Jl. Karanglo Raya No.7, Gemah, Kec. Pedurungan, Kota Semarang, Jawa Tengah 50191",
            date: "07/10/2025",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "#BF0000";
            case "success":
                return "#22C55E";
            case "failed":
                return "#9CA3AF";
            default:
                return "#333";
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <ScrollView
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map((item, index) => (
                    <View key={item.id}>
                        <View style={styles.card}>
                            <View style={styles.statusRow}>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: getStatusColor(
                                                item.status,
                                            ),
                                        },
                                    ]}
                                >
                                    <Text style={styles.statusText}>
                                        {item.statusLabel}
                                    </Text>
                                </View>
                                {item.status === "pending" && item.timer && (
                                    <View style={styles.timerBadge}>
                                        <Text style={styles.timerText}>
                                            {item.timer}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.contentRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name="fish"
                                        size={30}
                                        color="#F59E0B"
                                    />
                                    <View style={styles.rodLine} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.cardAddress}>
                                        {item.address}
                                    </Text>
                                    <Text style={styles.cardDate}>
                                        {item.date}
                                    </Text>
                                </View>
                            </View>
                            {item.status === "success" && (
                                <View style={styles.actionButtonsContainer}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() =>
                                            router.push("/ReviewPath")
                                        }
                                    >
                                        <Text style={styles.actionButtonText}>
                                            Review
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => router.push("/explore")}
                                    >
                                        <Text style={styles.actionButtonText}>
                                            Rebooking
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {index < notifications.length - 1 && (
                            <View style={styles.divider} />
                        )}
                    </View>
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#FFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        padding: 20,
        backgroundColor: "#FFF",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        marginLeft: 80,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 10,
    },
    statusText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
    timerBadge: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    timerText: {
        color: "#DC2626",
        fontSize: 10,
        fontWeight: "bold",
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#5DD6E3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        position: "relative",
    },
    rodLine: {
        position: "absolute",
        width: 40,
        height: 2,
        backgroundColor: "#8B4513",
        transform: [{ rotate: "-45deg" }],
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 5,
    },
    cardAddress: {
        fontSize: 12,
        color: "#4B5563",
        lineHeight: 18,
        marginBottom: 8,
    },
    cardDate: {
        fontSize: 11,
        color: "#6B7280",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
    },
    actionButton: {
        backgroundColor: "#103568",
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 10,
    },
    actionButtonText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        width: "100%",
    },
});
