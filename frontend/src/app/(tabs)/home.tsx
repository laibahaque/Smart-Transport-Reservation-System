import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeStyles as styles } from "../../styles/home.style";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import Header from "../../components/Header";   // ✅ Header component import kiya

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/bus.jpg"),
  require("../../assets/images/airplane.jpg"),
  require("../../assets/images/train.jpg"),
  require("../../assets/images/car.jpg"),
];

const feedbacks = [
  { text: "Super easy to use and very reliable! Booking is smooth and fast.", user: "Sarah K." },
  { text: "The app design is amazing, I can book my ride in seconds!", user: "Ali R." },
  { text: "Great for both local and international transport booking.", user: "Emma W." },
  { text: "Simple, clean, and efficient — highly recommended!", user: "Zeeshan A." },
  { text: "Perfect app for frequent travelers. Everything in one place.", user: "Hina M." },
];

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentImage, setCurrentImage] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(0);
  const router = useRouter();

  // 🔄 Smooth image fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => setCurrentFeedback((prev) => (prev + 1) % feedbacks.length);
  const handlePrev = () =>
    setCurrentFeedback((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));

  return (
    <View style={styles.container}>
      {/* ✅ Reusable Header Component */}
      <Header title="Smart Transport" />

      {/* WELCOME */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subTitle}>Smart Transport Reservations</Text>
      </View>

      {/* HERO */}
      <View style={styles.heroSection}>
        <Animated.Image
          source={images[currentImage]}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.heroTitle}>All Your Journeys, Just One Tap Away.</Text>
        </View>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.description}>
          Book your ticket in just seconds.{"\n"}Your ultimate travel companion is here.
        </Text>
      </View>

      {/* FEEDBACK */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackMainTitle}>What Our Users Say!</Text>
        <View style={styles.feedbackBox}>
          <TouchableOpacity onPress={handlePrev} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackText}>
              “{feedbacks[currentFeedback].text}”
            </Text>
            <Text style={styles.feedbackUser}>
              — {feedbacks[currentFeedback].user}
            </Text>
          </View>
          <TouchableOpacity onPress={handleNext} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push("/auth/login")} // ✅ Login page
      >
        <Text style={styles.bookText}>Book Yours</Text>
      </TouchableOpacity>
    </View>
  );
}
