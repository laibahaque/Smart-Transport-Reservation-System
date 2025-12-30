import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { homeStyles as styles } from "../../styles/home.style";
import { COLORS } from "../../constants/colors";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import BottomNav from "../../components/Bottom";

import AsyncStorage from "@react-native-async-storage/async-storage";



const heroImages = [
  require("../../assets/images/bus.jpg"),
  require("../../assets/images/airplane.jpg"),
  require("../../assets/images/train.jpg"),
  require("../../assets/images/car.jpg"),
];

const categories = [
  { id: 1, name: "Bus", icon: "bus" },
  { id: 2, name: "Flight", icon: "airplane" },
  { id: 3, name: "Train", icon: "train" },
  { id: 4, name: "Car Rental", icon: "car" },
];

export default function Home() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();
  const handleBookNow = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      router.push("/(tabs)/profile");
    } else {
      router.replace("/auth/login");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
      ]).start(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="RaastaGo" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <Animated.Image
            source={heroImages[currentImage]}
            style={[styles.heroImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Find Your Perfect Ride</Text>
          </View>
        </View>

        {/* CATEGORIES */}
        <Text style={styles.sectionTitle}>Travel Modes</Text>
        <View style={styles.categoryContainer}>
          {categories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.categoryBox}>
              <Ionicons name={item.icon} size={25} color={COLORS.primary} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* POPULAR ROUTES */}
        <Text style={styles.sectionTitle}>Popular Routes</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Karachi → Lahore", "Islamabad → Multan", "Quetta → Karachi"].map(
            (route, index) => (
              <View key={index} style={styles.routeCard}>
                <Text style={styles.routeText}>{route}</Text>
              </View>
            )
          )}
        </ScrollView>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookText}>Book Now</Text>
        </TouchableOpacity>



        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <BottomNav active="home" />

    </View>
  );
}
