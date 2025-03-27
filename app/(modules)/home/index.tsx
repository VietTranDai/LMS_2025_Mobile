import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Mocked data for development
const COURSES_DATA = [
  {
    id: "1",
    title: "Introduction to React Native",
    progress: 75,
    thumbnail: "https://reactnative.dev/img/tiny_logo.png",
    instructor: "John Smith",
    nextLesson: "Components and Props",
    dueDays: 2,
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    progress: 30,
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    instructor: "Sarah Johnson",
    nextLesson: "Promises and Async/Await",
    dueDays: 5,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    progress: 10,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    instructor: "Mike Chen",
    nextLesson: "Color Theory",
    dueDays: 7,
  },
];

const ANNOUNCEMENTS_DATA = [
  {
    id: "1",
    title: "New Course Available: Flutter Fundamentals",
    date: "2025-03-20T09:00:00Z",
    isRead: false,
  },
  {
    id: "2",
    title: "System Maintenance: March 25th",
    date: "2025-03-19T14:30:00Z",
    isRead: true,
  },
];

// Define Course and Announcement interfaces
interface Course {
  id: string;
  title: string;
  progress: number;
  thumbnail: string;
  instructor: string;
  nextLesson: string;
  dueDays: number;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  isRead: boolean;
}

export default function HomeScreen() {
  const theme = useAppTheme();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState(COURSES_DATA);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_DATA);

  // Format greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date("2025-03-21T07:27:16Z").getHours(); // Using current date/time
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setCourses(COURSES_DATA);
      setAnnouncements(ANNOUNCEMENTS_DATA);
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: theme.card }]}
      onPress={() => {
        const path = `/(modules)/courses/${item.id}`;
        router.push(path as any);
      }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.courseThumbnail}
        resizeMode="cover"
      />
      <View style={styles.courseContent}>
        <Text
          style={[styles.courseTitle, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.courseInstructor, { color: theme.textSecondary }]}>
          {item.instructor}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${item.progress}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {item.progress}%
          </Text>
        </View>
        <View style={styles.nextLessonContainer}>
          <Text style={[styles.nextLessonLabel, { color: theme.textTertiary }]}>
            Next: {item.nextLesson}
          </Text>
          <View style={styles.dueContainer}>
            <Ionicons
              name="time-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text style={[styles.dueText, { color: theme.textSecondary }]}>
              {item.dueDays} days left
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
    <TouchableOpacity
      style={[styles.announcementCard, { backgroundColor: theme.card }]}
    >
      <View style={styles.announcementHeader}>
        <View style={styles.announcementIconContainer}>
          <Ionicons name="megaphone" size={18} color={theme.primary} />
          {!item.isRead && (
            <View
              style={[styles.unreadDot, { backgroundColor: theme.primary }]}
            />
          )}
        </View>
        <Text style={[styles.announcementDate, { color: theme.textSecondary }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text
        style={[
          styles.announcementTitle,
          {
            color: theme.text,
            fontFamily: item.isRead ? "Inter-Regular" : "Inter-Medium",
          },
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {getGreeting()},
            </Text>
            <Text style={[styles.username, { color: theme.text }]}>
              {user?.name || "Tran Dai Viet"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: theme.card }]}
            onPress={() => {
              router.push("/(modules)/courses/search" as any);
            }}
          >
            <Ionicons name="search" size={22} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* My Learning Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              My Learning
            </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                router.push("/(modules)/courses" as any);
              }}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>
                View All
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          {courses.length > 0 ? (
            <FlatList
              data={courses}
              renderItem={renderCourseItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesList}
              style={styles.coursesContainer}
            />
          ) : (
            <View
              style={[styles.emptyCourses, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="book-outline"
                size={40}
                color={theme.textTertiary}
              />
              <Text
                style={[
                  styles.emptyCoursesText,
                  { color: theme.textSecondary },
                ]}
              >
                You don't have any courses yet
              </Text>
              <TouchableOpacity
                style={[
                  styles.exploreCourseButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => {
                  router.push("/(modules)/courses/explore" as any);
                }}
              >
                <Text style={styles.exploreCourseButtonText}>
                  Explore Courses
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Announcements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Announcements
            </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                router.push("/(modules)/notifications" as any);
              }}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>
                View All
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>

          {announcements.map((item) => (
            <React.Fragment key={item.id}>
              {renderAnnouncementItem({ item })}
            </React.Fragment>
          ))}
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
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  username: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginRight: 4,
  },
  coursesContainer: {
    marginLeft: -8,
  },
  coursesList: {
    paddingLeft: 8,
    paddingRight: 16,
  },
  courseCard: {
    width: 240,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseThumbnail: {
    width: "100%",
    height: 130,
  },
  courseContent: {
    padding: 16,
    paddingBottom: 20,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginBottom: 6,
  },
  courseInstructor: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 14,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  nextLessonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  nextLessonLabel: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    flex: 1,
  },
  dueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    marginLeft: 4,
  },
  emptyCourses: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyCoursesText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  exploreCourseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exploreCourseButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
  announcementCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  announcementIconContainer: {
    position: "relative",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: -2,
    right: -2,
  },
  announcementDate: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
  announcementTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
