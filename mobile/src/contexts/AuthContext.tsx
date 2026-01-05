import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Href } from "expo-router";
import { api } from "../services/api";
import { User } from "../types";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    redirectUrl: string | null;
    redirectParams: object | null;
    setBookingRedirect: (spotId: string) => void;
    clearRedirect: () => void;
}

interface SignupData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isLoading: false,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
    isAuthenticated: false,
    redirectUrl: null,
    redirectParams: null,
    setBookingRedirect: () => {},
    clearRedirect: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [redirectParams, setRedirectParams] = useState<object | null>(null);

    const setBookingRedirect = (spotId: string) => {
        setRedirectUrl("/booking/Booking");
        setRedirectParams({ id: spotId });
    };

    const clearRedirect = () => {
        setRedirectUrl(null);
        setRedirectParams(null);
    };

    useEffect(() => {
        loadAuthData();
    }, []);

    const loadAuthData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem("@token");
            const storedUser = await AsyncStorage.getItem("@user");

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading auth data:", error);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.auth.login(email, password);
            const { token: newToken, user: newUser } = response;

            await AsyncStorage.setItem("@token", newToken);
            await AsyncStorage.setItem("@user", JSON.stringify(newUser));

            setToken(newToken);
            setUser(newUser);

            if (redirectUrl) {
                const url = redirectUrl;
                const params = redirectParams;
                clearRedirect();
                router.replace({
                    pathname: url,
                    params: params,
                } as any);
            } else {
                router.replace("/(tabs)/profile" as any);
            }

            router.replace("/");
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (data: SignupData) => {
        setIsLoading(true);
        try {
            await api.auth.signup(data);
            await login(data.email, data.password);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem("@token");
            await AsyncStorage.removeItem("@user");
            setToken(null);
            setUser(null);
            router.replace("/");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                signup,
                logout,
                isAuthenticated,
                redirectUrl,
                redirectParams,
                setBookingRedirect,
                clearRedirect,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
