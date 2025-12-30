import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useRouter } from "expo-router";
import { homeStyles as styles } from "../styles/home.style";

export default function BottomNav({ active }) {
    const router = useRouter();

    return (
        <View style={styles.bottomNav}>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/home")}
            >
                <Ionicons
                    name="home"
                    size={26}
                    color={active === "home" ? COLORS.primary : COLORS.textLight}
                />
                <Text style={active === "home" ? styles.navTextActive : styles.navText}>
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/search")}
            >
                <Ionicons
                    name="search"
                    size={24}
                    color={active === "search" ? COLORS.primary : COLORS.textLight}
                />
                <Text style={active === "search" ? styles.navTextActive : styles.navText}>
                    Search
                </Text>
            </TouchableOpacity>



            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/profile")}
            >
                <Ionicons
                    name="person"
                    size={24}
                    color={active === "profile" ? COLORS.primary : COLORS.textLight}
                />
                <Text style={active === "profile" ? styles.navTextActive : styles.navText}>
                    Profile
                </Text>
            </TouchableOpacity>

        </View>
    );
}
