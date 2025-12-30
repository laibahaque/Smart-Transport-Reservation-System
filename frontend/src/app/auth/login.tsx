import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../styles/auth.styles";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";

// ⭐ BOTTOM NAV IMPORT HERE
import BottomNav from "../../components/Bottom";

export default function LoginPage() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://172.16.5.234:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        if (data.session_token) {
          await AsyncStorage.setItem("token", data.session_token);
        }
        router.replace("/(tabs)/profile");
      } else {
        setError(data.detail || "Invalid email or password.");
      }
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.View style={{ flex: 1, opacity: fade }}>
          
          <Header title="Login" />

          <View style={styles.container}>

            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.centerLogo}
            />

            <Text style={styles.authTitle}>Welcome Back</Text>
            <Text style={styles.authSubtitle}>Login to continue</Text>

            <View style={styles.formCard}>
              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TextInput
                style={[styles.input, focused === "email" && styles.inputFocused]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={COLORS.textLight}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View>
                <TextInput
                  style={[
                    styles.input,
                    focused === "password" && styles.inputFocused,
                    { paddingRight: 40 },
                  ]}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor={COLORS.textLight}
                  secureTextEntry={!visible}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
                <Pressable
                  onPress={() => setVisible(!visible)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={visible ? "eye" : "eye-off"}
                    size={20}
                    color={COLORS.textLight}
                  />
                </Pressable>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{ marginTop: 22 }}
              >
                <LinearGradient
                  colors={[COLORS.primaryDark, COLORS.primary]}
                  style={styles.button}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

      {/* ⭐ FIXED BOTTOM NAV */}
      <BottomNav active="profile" />

    </View>
  );
}
