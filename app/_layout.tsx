import React, { useEffect } from "react";
import {
  Stack,
  router,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen"; // Fixed import
import { getItem } from "@/utils/asyncStorage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Internal component to handle protected routes
function RootLayoutNavigator() {
  const segments = useSegments();
  const { user, isLoading } = useUser();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === ("onboarding" as any);

    if (isLoading) return;

    async function checkOnboarding() {
      try {
        const onboardingCompleted = await getItem("@onboarding_completed");

        if (user && onboardingCompleted === "true") {
          // User is signed in and has completed onboarding
          if (inAuthGroup || inOnboardingGroup) {
            router.replace("/(modules)/home" as any);
          }
        } else if (user && onboardingCompleted !== "true") {
          // User is signed in but hasn't completed onboarding
          if (!inOnboardingGroup) {
            router.replace("/onboarding" as any);
          }
        } else {
          // User is not signed in
          if (!inAuthGroup) {
            router.replace("/auth");
          }
        }

        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Failed to check app state", error);
        SplashScreen.hideAsync();
        router.replace("/auth");
      }
    }

    checkOnboarding();
  }, [user, segments, navigationState?.key, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen
        name="onboarding/index"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="auth/index" options={{ animation: "fade" }} />
      <Stack.Screen name="(modules)" options={{ animation: "fade" }} />
      <Stack.Screen name="[...unmatched]" options={{ title: "Not Found" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  // Handle font loading error
  if (fontError) {
    console.error("Error loading fonts:", fontError);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <UserProvider>
          <SafeAreaProvider>
            <RootLayoutNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
