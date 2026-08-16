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
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export const RegisterScreen: React.FC<{
  onNavigateLogin: () => void;
  onSuccess: () => void;
}> = ({ onNavigateLogin, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in required fields.");
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, phone, password });
      Alert.alert("Success", "Account created successfully!");
      onSuccess();
    } catch (err: any) {
      Alert.alert("Registration Failed", err.response?.data?.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>⚡ CartMind AI</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CartMind for smart voice shopping</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+1 555-0199"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Register Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.footerLink} onPress={onNavigateLogin}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 24, justifyContent: "center" },
  logo: { fontSize: 24, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 8, marginTop: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 28 },
  form: { width: "100%" },
  label: { color: "#cbd5e1", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#1e293b", borderRadius: 12, height: 48, paddingHorizontal: 16, color: "#ffffff", marginBottom: 14, fontSize: 15 },
  submitBtn: { backgroundColor: "#2563eb", borderRadius: 12, height: 50, justifyContent: "center", alignItems: "center", marginTop: 12 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  footerLink: { marginTop: 24, alignItems: "center", marginBottom: 20 },
  footerText: { color: "#94a3b8", fontSize: 14 },
  linkBold: { color: "#38bdf8", fontWeight: "bold" },
});
