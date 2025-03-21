import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { removeItem } from "@/utils/asyncStorage";
import { useUser } from "@/contexts/UserContext";

export default function MoreScreen() {
  const theme = useAppTheme();
  const { signOut } = useUser();

  const resetOnboarding = async () => {
    try {
      Alert.alert(
        "Reset Onboarding",
        "This will reset the onboarding screens and sign you out. Continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await removeItem("@onboarding_completed");
              handleSignOut();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to reset onboarding status");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by the root layout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Account
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => router.push("/(modules)/profile" as any)}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.primary}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Profile
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => {
              /* Navigate to account settings */
            }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.primary}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Settings
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Help & Support
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => {
              /* Navigate to help center */
            }}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.info}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Help Center
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={() => {
              /* Navigate to contact support */
            }}
          >
            <Ionicons
              name="mail-outline"
              size={24}
              color={theme.info}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Contact Support
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App</Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={resetOnboarding}
          >
            <Ionicons
              name="refresh-outline"
              size={24}
              color={theme.warning}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Reset Onboarding
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.card }]}
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.error}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuText, { color: theme.text }]}>
              Sign Out
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
});
