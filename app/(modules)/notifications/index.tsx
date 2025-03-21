import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";
// import { format, formatDistanceToNow } from 'date-fns';

// Define Notification interface
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  courseId?: string | null;
  lessonId?: string;
  assignmentId?: string;
  achievementId?: string;
}

// Mock notification data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "course",
    title: "New lesson available",
    message:
      'The "Components and Props" lesson in "Introduction to React Native" is now available.',
    timestamp: "2025-03-20T14:30:00Z",
    isRead: false,
    courseId: "1",
    lessonId: "3",
  },
  {
    id: "2",
    type: "deadline",
    title: "Assignment due soon",
    message: 'Your assignment "JavaScript Promises" is due in 2 days.',
    timestamp: "2025-03-19T09:15:00Z",
    isRead: false,
    courseId: "2",
    assignmentId: "5",
  },
  {
    id: "3",
    type: "announcement",
    title: "New course available",
    message: 'We ve just added a new course: "Flutter Fundamentals".',
    timestamp: "2025-03-18T10:45:00Z",
    isRead: true,
    courseId: null,
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement unlocked",
    message: "Congratulations! You ve completed your first course.",
    timestamp: "2025-03-15T16:20:00Z",
    isRead: true,
    achievementId: "7",
  },
  {
    id: "5",
    type: "system",
    title: "System maintenance",
    message: "The app will be under maintenance on March 25th from 2-4 AM UTC.",
    timestamp: "2025-03-10T08:00:00Z",
    isRead: true,
  },
];

// Add a date formatting function since we removed date-fns
const formatDate = (dateString: string, format: string = "default"): string => {
  const date = new Date(dateString);
  if (format === "time") {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setRefreshing(false);
    }, 1500);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "course":
        if (notification.lessonId) {
          const path = `/(modules)/courses/${notification.courseId}/lessons/${notification.lessonId}`;
          router.push(path as any);
        } else {
          const path = `/(modules)/courses/${notification.courseId}`;
          router.push(path as any);
        }
        break;
      case "deadline":
        const assignmentsPath = `/(modules)/courses/${notification.courseId}/assignments/${notification.assignmentId}`;
        router.push(assignmentsPath as any);
        break;
      case "announcement":
        if (notification.courseId) {
          const announcementsPath = `/(modules)/courses/${notification.courseId}/announcements`;
          router.push(announcementsPath as any);
        }
        break;
      case "achievement":
        router.push("/(modules)/profile/achievements" as any);
        break;
      case "system":
        // Just mark as read
        break;
      default:
        break;
    }
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date("2025-03-21T07:23:55Z"); // Using current date/time

    // If it's today, show the time
    if (date.toDateString() === now.toDateString()) {
      return formatDate(timestamp, "time");
    }

    // If it's yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // If it's within 7 days, show the day name
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    if (date > sevenDaysAgo) {
      return date.toLocaleDateString(undefined, { weekday: "long" });
    }

    // Otherwise show the full date
    return formatDate(timestamp);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Ionicons name="book" size={24} color={theme.primary} />;
      case "deadline":
        return <Ionicons name="time" size={24} color={theme.warning} />;
      case "announcement":
        return <Ionicons name="megaphone" size={24} color={theme.info} />;
      case "achievement":
        return <Ionicons name="trophy" size={24} color={theme.success} />;
      case "system":
        return (
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.textSecondary}
          />
        );
      default:
        return (
          <Ionicons name="notifications" size={24} color={theme.primary} />
        );
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: item.isRead ? theme.card : theme.card + "80" },
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                item.type === "deadline"
                  ? theme.warning + "20"
                  : item.type === "achievement"
                  ? theme.success + "20"
                  : item.type === "announcement"
                  ? theme.info + "20"
                  : item.type === "system"
                  ? theme.textSecondary + "20"
                  : theme.primary + "20",
            },
          ]}
        >
          {getNotificationIcon(item.type)}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.notificationTitle,
                {
                  color: theme.text,
                  fontFamily: item.isRead ? "Inter-Regular" : "Inter-SemiBold",
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textTertiary }]}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>

          <Text
            style={[styles.notificationMessage, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {item.message}
          </Text>
        </View>
      </View>

      {!item.isRead && (
        <View
          style={[styles.unreadIndicator, { backgroundColor: theme.primary }]}
        />
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: theme.backgroundSecondary },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {section.title}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <View style={styles.headerActions}>
        {notifications.some((notification) => !notification.isRead) && (
          <TouchableOpacity
            style={[
              styles.markAllButton,
              { backgroundColor: theme.backgroundSecondary },
            ]}
            onPress={markAllAsRead}
          >
            <Text style={[styles.markAllText, { color: theme.primary }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={60}
              color={theme.textTertiary}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No notifications
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              You don't have any notifications yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 16,
    right: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});
