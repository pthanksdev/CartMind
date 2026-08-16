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
import { useAuth } from "../context/AuthContext";

export const LoginScreen: React.FC<{
  onNavigateRegister: () => void;
  onSuccess: () => void;
}> = ({ onNavigateRegister, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      Alert.alert("Login Failed", err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>⚡ CartMind AI</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your customer account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.footerLink} onPress={onNavigateRegister}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.linkBold}>Register Now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  logo: { fontSize: 24, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 32 },
  form: { width: "100%" },
  label: { color: "#cbd5e1", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#1e293b", borderRadius: 12, height: 48, paddingHorizontal: 16, color: "#ffffff", marginBottom: 16, fontSize: 15 },
  submitBtn: { backgroundColor: "#2563eb", borderRadius: 12, height: 50, justifyContent: "center", alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  footerLink: { marginTop: 24, alignItems: "center" },
  footerText: { color: "#94a3b8", fontSize: 14 },
  linkBold: { color: "#38bdf8", fontWeight: "bold" },
});
