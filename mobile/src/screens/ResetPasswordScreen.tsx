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
import { resetPasswordApi } from "../api";

export const ResetPasswordScreen: React.FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPasswordApi({ password });
      Alert.alert("Password Updated 🎉", "Your password has been reset successfully. Please sign in.", [
        { text: "Sign In", onPress: onSuccess },
      ]);
    } catch {
      Alert.alert("Error", "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>⚡ CartMind AI</Text>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password below.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleResetPassword} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Update Password & Sign In</Text>
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
  logo: { fontSize: 24, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 32 },
  form: { width: "100%" },
  label: { color: "#cbd5e1", fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#1e293b", borderRadius: 12, height: 48, paddingHorizontal: 16, color: "#ffffff", marginBottom: 16, fontSize: 15 },
  submitBtn: { backgroundColor: "#2563eb", borderRadius: 12, height: 50, justifyContent: "center", alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
