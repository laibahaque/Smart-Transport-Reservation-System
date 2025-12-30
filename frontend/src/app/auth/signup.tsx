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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../styles/auth.styles";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../../components/Bottom";

export default function SignUpScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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

  const handleSignup = async () => {
    if (!name || !phone || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://172.16.5.234:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        router.push("/auth/login");
      } else {
        setError(data.detail || "Signup failed");
      }
    } catch {
      setLoading(false);
      setError("Network error.");
    }
  };

  return (
    <View style={{ flex: 1 }}>  {/* ⭐ WRAP WHOLE SCREEN LIKE LOGIN */}

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 120,   // ⭐ Scroll properly works
        }}
        enableOnAndroid={true}
        extraScrollHeight={80}  // ⭐ Keyboard fix
      >

        <Animated.View style={{ flex: 1, opacity: fade }}>

          <Header title="Sign Up" />

          <View style={styles.container}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.centerLogo}
            />

            <Text style={styles.authTitle}>Create Account</Text>
            <Text style={styles.authSubtitle}>Join us today!</Text>

            <View style={styles.formCard}>
              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TextInput
                style={[styles.input, focused === "name" && styles.inputFocused]}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={COLORS.textLight}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
              />

              <TextInput
                style={[styles.input, focused === "phone" && styles.inputFocused]}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
              />

              <TextInput
                style={[styles.input, focused === "email" && styles.inputFocused]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={COLORS.textLight}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
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
                onPress={handleSignup}
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
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                  <Text style={styles.footerLink}>Login</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

      {/* ⭐ SAME AS LOGIN — FIXED BOTTOM NAV */}
      <BottomNav active="profile" />

    </View>
  );
}
