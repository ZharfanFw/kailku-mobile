import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// JADI SEPERTI INI (Pilih salah satu sesuai cara run kamu):
const API_BASE_URL = "http://10.0.2.2:3000"; // Khusus Android Emulator Studio
// const API_BASE_URL = "http://192.168.1.4:3000"; // Jika pakai HP Fisik (Ganti x dengan IP laptop)

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("@token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error adding auth header:", error);
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("@token");
            await AsyncStorage.removeItem("@user");
            router.replace("/(auth)/Login");
        }
        return Promise.reject(error);
    },
);
