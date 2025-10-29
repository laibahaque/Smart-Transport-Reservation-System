import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { splashStyles as styles } from "../styles/splash.style";

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -60, // ✅ Move only slightly up
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace("/home");
      }, 500);
    });
  }, []);

  return (
    <LinearGradient
      colors={["#D8CCC1", "#FAF9F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Animated.Image
        source={require("../assets/images/logo.png")}
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }, { translateY: translateY }] },
        ]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}
