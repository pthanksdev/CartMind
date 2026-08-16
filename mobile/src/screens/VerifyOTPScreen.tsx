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
import { verifyOtpApi } from "../api";

export const VerifyOTPScreen: React.FC<{
  email: string;
  onNavigateReset: () => void;
  onBack: () => void;
}> = ({ email, onNavigateReset, onBack }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert("Error", "Please enter the complete PIN.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtpApi(email, otp);
      onNavigateReset();
    } catch {
      Alert.alert("Error", "Invalid verification PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>⚡ CartMind AI</Text>
        <Text style={styles.title}>Enter 6-Digit PIN</Text>
        <Text style={styles.subtitle}>We've sent a 6-digit verification PIN to {email}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.otpInput}
            placeholder="• • • • • •"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleVerify} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Verify PIN & Continue</Text>
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
  otpInput: { backgroundColor: "#1e293b", borderRadius: 12, height: 56, color: "#4ade80", fontSize: 24, fontWeight: "bold", textAlign: "center", letterSpacing: 8, marginBottom: 20 },
  submitBtn: { backgroundColor: "#2563eb", borderRadius: 12, height: 50, justifyContent: "center", alignItems: "center" },
  submitBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
