import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { router } from "expo-router";

// Mock course data
const MOCK_COURSES = [
  {
    id: "1",
    title: "Introduction to React Native",
    progress: 75,
    thumbnail: "https://reactnative.dev/img/tiny_logo.png",
    instructor: "John Smith",
    status: "In Progress",
    lastAccessed: "2025-03-20T14:30:00Z",
    totalLessons: 12,
    completedLessons: 9,
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    progress: 30,
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    instructor: "Sarah Johnson",
    status: "In Progress",
    lastAccessed: "2025-03-18T10:15:00Z",
    totalLessons: 20,
    completedLessons: 6,
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    progress: 10,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    instructor: "Mike Chen",
    status: "Just Started",
    lastAccessed: "2025-03-15T09:45:00Z",
    totalLessons: 15,
    completedLessons: 1,
  },
  {
    id: "4",
    title: "Flutter App Development",
    progress: 0,
    thumbnail:
      "https://storage.googleapis.com/cms-storage-bucket/4fd5520fe28ebf839174.svg",
    instructor: "Emma Wilson",
    status: "Not Started",
    lastAccessed: null,
    totalLessons: 18,
    completedLessons: 0,
  },
  {
    id: "5",
    title: "Swift Programming for iOS",
    progress: 100,
    thumbnail: "https://developer.apple.com/swift/images/swift-og.png",
    instructor: "David Lee",
    status: "Completed",
    lastAccessed: "2025-02-28T16:20:00Z",
    totalLessons: 15,
    completedLessons: 15,
  },
];

// Filter types for courses
const FILTERS = {
  ALL: "All",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  NOT_STARTED: "Not Started",
};

// Define a Course type
interface Course {
  id: string;
  title: string;
  progress: number;
  thumbnail: string;
  instructor: string;
  status: string;
  lastAccessed: string | null;
  totalLessons: number;
  completedLessons: number;
}

export default function CoursesScreen() {
  const theme = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [filteredCourses, setFilteredCourses] = useState(MOCK_COURSES);
  const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);

  // Filter courses based on search query and selected filter
  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== FILTERS.ALL) {
      if (activeFilter === FILTERS.IN_PROGRESS) {
        filtered = filtered.filter(
          (course) => course.progress > 0 && course.progress < 100
        );
      } else if (activeFilter === FILTERS.COMPLETED) {
        filtered = filtered.filter((course) => course.progress === 100);
      } else if (activeFilter === FILTERS.NOT_STARTED) {
        filtered = filtered.filter((course) => course.progress === 0);
      }
    }

    setFilteredCourses(filtered);
  }, [searchQuery, activeFilter, courses]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setCourses(MOCK_COURSES);
      setRefreshing(false);
    }, 1500);
  }, []);

  const formatLastAccessed = (dateString: string | null) => {
    if (!dateString) return "Never accessed";

    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: theme.card }]}
      onPress={() => {
        // Using a direct string for the path to avoid type issues
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
        <View style={styles.courseHeader}>
          <Text
            style={[styles.courseTitle, { color: theme.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.progress === 100
                    ? theme.success + "20"
                    : item.progress > 0
                    ? theme.primary + "20"
                    : theme.textTertiary + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.progress === 100
                      ? theme.success
                      : item.progress > 0
                      ? theme.primary
                      : theme.textTertiary,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={[styles.courseInstructor, { color: theme.textSecondary }]}>
          {item.instructor}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.progress}%`,
                  backgroundColor:
                    item.progress === 100 ? theme.success : theme.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {item.progress}%
          </Text>
        </View>

        <View style={styles.courseFooter}>
          <View style={styles.lessonStatus}>
            <Ionicons
              name="document-text-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text
              style={[styles.lessonStatusText, { color: theme.textSecondary }]}
            >
              {item.completedLessons}/{item.totalLessons} lessons
            </Text>
          </View>

          <View style={styles.lastAccessed}>
            <Ionicons
              name="time-outline"
              size={14}
              color={theme.textSecondary}
            />
            <Text
              style={[styles.lastAccessedText, { color: theme.textSecondary }]}
            >
              {formatLastAccessed(item.lastAccessed)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterOption = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterOption,
        activeFilter === filter && { backgroundColor: theme.primary + "20" },
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          {
            color:
              activeFilter === filter ? theme.primary : theme.textSecondary,
          },
          activeFilter === filter && { fontFamily: "Inter-SemiBold" },
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      edges={["bottom"]}
    >
      <View
        style={[styles.searchContainer, { backgroundColor: theme.background }]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search courses"
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {Object.values(FILTERS).map((filter) => renderFilterOption(filter))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="school-outline"
              size={60}
              color={theme.textTertiary}
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No courses found
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {searchQuery
                ? "Try searching with different keywords"
                : "You don't have any courses in this category"}
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  filtersContainer: {
    marginTop: 12,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  coursesList: {
    padding: 16,
  },
  courseCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseThumbnail: {
    width: "100%",
    height: 160,
  },
  courseContent: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
  },
  courseInstructor: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginBottom: 16,
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
    width: 36,
    textAlign: "right",
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lessonStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonStatusText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginLeft: 4,
  },
  lastAccessed: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastAccessedText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
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
    maxWidth: "80%",
  },
});
