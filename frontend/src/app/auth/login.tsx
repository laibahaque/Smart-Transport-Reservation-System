import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../styles/auth.styles";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";

export default function LoginPage() {
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!emailAddress || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://172.16.5.234:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailAddress,
          password,
        }),
      });

      const data = await response.json(); // ✅ First parse response
      setLoading(false);

      console.log("📩 Server Response:", data); // 👈 Debug output

      if (response.ok) {
        // ✅ Your backend returns "session_token"
        if (data.session_token) {
          await AsyncStorage.setItem("token", data.session_token);
          console.log("✅ Token saved:", data.session_token);
        } else {
          console.log("⚠️ No token found in response!");
        }

        router.replace("/profile"); // ✅ Redirect on success
      } else {
        setError(data.detail || "Invalid email or password.");
        console.log("❌ Login failed:", data);
      }
    } catch (err) {
      setLoading(false);
      console.log("🚨 Network or other error:", err);
      setError("Network error. Please check your connection.");
    }
  };


  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      enableAutomaticScroll
      extraScrollHeight={30}
    >
      <Header title="Smart Transport" />
      <View style={styles.container}>


        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>For any type of booking you need to login first!</Text>

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          autoCapitalize="none"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* 👇 Added Section: Don't have an account */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
