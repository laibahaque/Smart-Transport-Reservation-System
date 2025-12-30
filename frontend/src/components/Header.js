import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";

const { width } = Dimensions.get("window");
const scale = width / 375;

export default function Header({ title = "Smart Transport" }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            setIsLoggedIn(false);
            router.replace("/auth/login");
          },
        },
      ]
    );
  };
  return (
    <View style={styles.header}>
      {/* Home Button */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home")}
        style={styles.iconButton}
      >
        <Ionicons name="home-outline" size={26} color={COLORS.white} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.appTitle}>{title}</Text>

      {/* Logout Button */}
      {isLoggedIn && (
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={26} color={COLORS.white} />
        </TouchableOpacity>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 15 : 20,
    paddingBottom: 10,
    width: "100%",
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  iconButton: {
    padding: 8,
    width: 40,
    alignItems: "center",
  },


appTitle: {
  position: "absolute",
  left: 0,
  right: 0,
  textAlign: "center",
  fontSize: 18 * scale,
  fontWeight: "700",
  color: COLORS.white,
},

});
