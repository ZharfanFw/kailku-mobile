import React from "react";
import { router, Tabs } from "expo-router";
import { Platform } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/src/contexts/AuthContext";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const segments = useSegments();
    const hideTabBar = segments.some(
        (segment) =>
            segment?.includes("modal") ||
            segment?.includes("booking") ||
            segment?.includes("payment") ||
            segment?.includes("qris") ||
            segment?.includes("virtual-account") ||
            segment?.includes("login") ||
            segment?.includes("signup") ||
            segment?.includes("review-path") ||
            segment?.includes("review-respon"),
    );
    const { isAuthenticated } = useAuth();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#103568",
                tabBarInactiveTintColor: "#999999",
                tabBarStyle: {
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#E5E5E5",
                    height: 65 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: Platform.OS === "ios" ? 8 : 10,
                    display: hideTabBar ? "none" : "flex",
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                    marginTop: Platform.OS === "ios" ? 2 : 0,
                },
                tabBarIconStyle: {
                    marginBottom: Platform.OS === "ios" ? 0 : -2,
                },
                tabBarShowLabel: true,
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Animated.View
                            entering={FadeInUp.duration(200).springify()}
                            exiting={FadeOutDown.duration(200)}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconSymbol
                                size={24}
                                name="house.fill"
                                color={color}
                            />
                        </Animated.View>
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color, focused }) => (
                        <Animated.View
                            entering={FadeInUp.duration(200).springify()}
                            exiting={FadeOutDown.duration(200)}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconSymbol
                                size={24}
                                name="paperplane.fill"
                                color={color}
                            />
                        </Animated.View>
                    ),
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: "Events",
                    tabBarIcon: ({ color, focused }) => (
                        <Animated.View
                            entering={FadeInUp.duration(200).springify()}
                            exiting={FadeOutDown.duration(200)}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconSymbol
                                size={24}
                                name="calendar"
                                color={color}
                            />
                        </Animated.View>
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Notifications",
                    tabBarBadge: 3,
                    tabBarBadgeStyle: {
                        backgroundColor: "#FF3B30",
                        color: "#FFFFFF",
                        fontSize: 10,
                        fontWeight: "bold",
                    },
                    tabBarIcon: ({ color, focused }) => (
                        <Animated.View
                            entering={FadeInUp.duration(200).springify()}
                            exiting={FadeOutDown.duration(200)}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconSymbol size={24} name="bell" color={color} />
                        </Animated.View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Animated.View
                            entering={FadeInUp.duration(200).springify()}
                            exiting={FadeOutDown.duration(200)}
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconSymbol size={24} name="person" color={color} />
                        </Animated.View>
                    ),
                }}
            />
        </Tabs>
    );
}
