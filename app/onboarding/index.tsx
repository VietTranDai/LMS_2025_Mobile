import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Image,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { DotsIndicator } from "@/modules/onboarding/components/DotsIndicator";
import { getItem, removeItem, setItem } from "@/utils/asyncStorage";
import { onboardingData } from "@/modules/onboarding/data/onboardingData";
import { OnboardingButton } from "@/modules/onboarding/components/OnboardingButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await setItem("@onboarding_completed", "true");

        // Fade out animation before navigating
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          router.replace("/(modules)/home" as any);
        });
      } catch (err) {
        console.log("Error setting onboarding completed: ", err);
      }
    }
  };

  const skip = async () => {
    try {
      await setItem("@onboarding_completed", "true");

      // Fade out animation before navigating
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/(modules)/home" as any);
      });
    } catch (err) {
      console.log("Error setting onboarding completed: ", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <Animated.View
        style={[
          styles.content,
          { opacity: animatedOpacity, paddingTop: insets.top },
        ]}
      >
        <View style={styles.skipContainer}>
          {currentIndex !== onboardingData.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={skip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.slidesContainer}>
          <FlatList
            data={onboardingData}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
            decelerationRate="fast"
          />
        </View>

        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <DotsIndicator data={onboardingData} scrollX={scrollX} />
          <OnboardingButton
            scrollTo={scrollTo}
            percentage={(currentIndex + 1) / onboardingData.length}
            isLastSlide={currentIndex === onboardingData.length - 1}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function OnboardingItem({ item }: { item: (typeof onboardingData)[0] }) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
  },
  skipContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 0, 0.1)",
  },
  skipText: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
  slidesContainer: {
    flex: 3,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
    paddingHorizontal: 30,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
    fontFamily: "Inter-Bold",
  },
  description: {
    fontWeight: "400",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter-Regular",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
});
