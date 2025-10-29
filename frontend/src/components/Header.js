import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";

const { width } = Dimensions.get("window");
const scale = width / 375;

export default function Header({ title = "Smart Transport" }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Menu Button */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={30} color={COLORS.white} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.appTitle}>{title}</Text>

      {/* Placeholder space to balance layout */}
      <View style={{ width: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // ✅ typo fixed (was "lexDirection")
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 15 : 20, // ✅ better spacing for iOS status bar
    paddingBottom: 10,
    width: "100%",
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  menuButton: {
    padding: 8,
  },
  appTitle: {
    fontSize: 18 * scale,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },
});
