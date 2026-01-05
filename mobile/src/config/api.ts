import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const getAPIBaseURL = () => {
    if (Platform.OS === "android") {
        return "http://192.168.1.18:3000";
    }
    if (Platform.OS === "ios") {
        return "http://192.168.1.18:3000";
    }
    return "http://192.168.1.18:3000";
};

const API_BASE_URL = getAPIBaseURL();

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
