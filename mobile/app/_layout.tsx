import "../global.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* 1. Main Tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* 2. Auth Screens */}
            <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />

            {/* 3. Booking Flow */}
            <Stack.Screen name="(booking)/InformationPlace" options={{ headerShown: false }} />
            <Stack.Screen name="(booking)/Booking" options={{ headerShown: false }} />
            <Stack.Screen 
                name="BuysAndRentFishing" 
                options={{ title: "Sewa & Beli Alat", headerBackTitle: "Kembali" }} 
            />

            {/* 4. Payment Flow */}
            <Stack.Screen name="(payment)/Payment" options={{ headerShown: false }} />
            <Stack.Screen name="(payment)/Qris" options={{ headerShown: false }} />
            <Stack.Screen name="(payment)/VirtualAccount" options={{ headerShown: false }} />

            {/* 5. Review Flow */}
            <Stack.Screen name="ReviewPath" options={{ title: "Tulis Ulasan" }} />
            <Stack.Screen name="ReviewSuccess" options={{ headerShown: false }} />

            {/* 6. Profile Features */}
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
            
            {/* 7. Misc */}
            <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
            <Stack.Screen name="RecommendationPlace" options={{ title: "Rekomendasi", headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}