import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../styles/auth.styles";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";   // ✅ Header component import kiya

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phonenumber || !emailAddress || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://172.16.5.234:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: phonenumber,
          email: emailAddress,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        router.push("/auth/login");
      } else {
        setError(data.detail || "Signup failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
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
        {/* ✅ Header render kiya */}


        {/* 🔙 Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { marginBottom: 50 }]}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* 🔹 Heading */}
        <Text style={styles.title}>Create Account</Text>

        {/* 🔹 Input Fields */}
        <TextInput
          style={styles.input}
          value={name}
          placeholder="Enter your full name"
          placeholderTextColor="#9A8478"
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          value={phonenumber}
          placeholder="Enter your phone number"
          placeholderTextColor="#9A8478"
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          value={emailAddress}
          placeholder="Enter your email"
          placeholderTextColor="#9A8478"
          onChangeText={setEmailAddress}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter your password"
          placeholderTextColor="#9A8478"
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* 🔹 Error Message */}
        {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

        {/* 🔹 Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* 🔹 Footer */}
        <View style={[styles.footerContainer, { marginTop: 2 }]}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
