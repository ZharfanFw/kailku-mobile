import "../global.css";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ← ADD THIS
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/src/contexts/AuthContext";

export const unstable_settings = {
    anchor: "(tabs)",
};
export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)/SignUp"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(auth)/Login"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="modal"
                            options={{ presentation: "modal", title: "Modal" }}
                        />
                        <Stack.Screen
                            name="booking/Booking"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="payment/Payment"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="ProfileGuest"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
