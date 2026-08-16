import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { forgotPasswordApi } from "../api";

export const ForgotPasswordScreen: React.FC<{
  onNavigateVerify: (email: string) => void;
  onNavigateLogin: () => void;
}> = ({ onNavigateVerify, onNavigateLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      Alert.alert("PIN Sent 📩", `Verification PIN sent to ${email}`);
      onNavigateVerify(email);
    } catch {
      Alert.alert("Error", "Failed to send reset PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={onNavigateLogin}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>⚡ CartMind AI</Text>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>Enter your email address to receive a 6-digit recovery PIN.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Registered Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleRequestOtp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Send Verification PIN</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  backBtn: { position: "absolute", top: 40, left: 24 },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  logo: { fontSize: 24, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 32, lineHeight: 20 },
  form: { width: "100%" },
  label: { color: "#cbd5e1", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#1e293b", borderRadius: 12, height: 48, paddingHorizontal: 16, color: "#ffffff", marginBottom: 16, fontSize: 15 },
  submitBtn: { backgroundColor: "#2563eb", borderRadius: 12, height: 50, justifyContent: "center", alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
