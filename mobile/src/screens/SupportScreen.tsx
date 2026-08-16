import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { submitInquiryApi } from "../api";

export const SupportScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitInquiry = async () => {
    if (!subject || !message) {
      Alert.alert("Missing Fields", "Please enter both a subject and message.");
      return;
    }
    setSubmitting(true);
    try {
      await submitInquiryApi({ subject, message });
      Alert.alert(
        "Inquiry Sent",
        "Your message has been submitted to CartMind Support. We will respond via email shortly!"
      );
      setSubject("");
      setMessage("");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CartMind Support</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="headset" size={32} color="#38bdf8" />
        </View>

        <Text style={styles.cardTitle}>How can we help you today?</Text>
        <Text style={styles.cardDesc}>
          Submit your question, order issue, or feedback below. Our support team will get back to you immediately.
        </Text>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Order #ORD-8921 Delivery Status"
          placeholderTextColor="#64748b"
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={styles.label}>Message / Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your inquiry or issue..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.btnDisabled]}
          onPress={handleSubmitInquiry}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? "Sending..." : "Submit Inquiry"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 20 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  title: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
  card: { backgroundColor: "#1e293b", borderRadius: 20, padding: 20, alignItems: "center" },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  cardTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  cardDesc: { color: "#94a3b8", fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 20 },
  label: { color: "#e2e8f0", fontSize: 13, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 6 },
  input: { width: "100%", backgroundColor: "#0f172a", borderRadius: 12, borderWidth: 1, borderColor: "#334155", color: "#ffffff", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: "top" },
  submitBtn: { width: "100%", backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
});
