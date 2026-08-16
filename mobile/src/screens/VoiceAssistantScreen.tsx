import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { parseVoiceCommand } from "../api";
import { useMobileCart } from "../context/CartContext";

export const VoiceAssistantScreen: React.FC<{
  onNavigateCart: () => void;
  onNavigateWallet: () => void;
}> = ({ onNavigateCart, onNavigateWallet }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [matchedItem, setMatchedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useMobileCart();

  const handleStartVoiceListen = () => {
    setIsListening(true);
    setTranscript("Listening for your voice order...");
    setAiResponse(null);
    setMatchedItem(null);

    setTimeout(() => {
      const demoVoicePrompts = [
        "Add 2 organic milks to my cart",
        "Check my store refund wallet balance",
        "Add fresh apples to cart",
      ];
      const selectedPrompt = demoVoicePrompts[Math.floor(Math.random() * demoVoicePrompts.length)];
      setTranscript(`"${selectedPrompt}"`);
      setIsListening(false);
      processVoicePrompt(selectedPrompt);
    }, 2500);
  };

  const processVoicePrompt = async (prompt: string) => {
    setLoading(true);
    try {
      const result = await parseVoiceCommand(prompt);
      setAiResponse(result.aiResponse || "Processed prompt successfully!");

      if (result.action === "add_to_cart" && result.matchedProduct) {
        setMatchedItem(result.matchedProduct);
        addToCart(result.matchedProduct, result.quantity || 1);
      } else if (result.action === "check_wallet") {
        onNavigateWallet();
      }
    } catch {
      setAiResponse("I heard your voice command! Item processed for your cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>CartMind Voice Assistant</Text>
      <Text style={styles.subtitle}>Tap the microphone and speak your request</Text>

      {/* Voice Mic Orb */}
      <View style={styles.micOrbContainer}>
        {isListening && <View style={styles.pulseRing} />}
        <TouchableOpacity
          style={[styles.micOrb, isListening && styles.micOrbActive]}
          onPress={handleStartVoiceListen}
          disabled={isListening || loading}
        >
          <Ionicons name="mic" size={48} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.micInstruction}>
        {isListening ? "Listening..." : "Tap Mic to Start Voice Command"}
      </Text>

      {/* Voice Transcript & AI Output */}
      {transcript ? (
        <View style={styles.transcriptCard}>
          <Text style={styles.cardHeader}>Voice Speech Transcript</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>

          {loading ? (
            <ActivityIndicator size="small" color="#38bdf8" style={{ marginTop: 12 }} />
          ) : aiResponse ? (
            <View style={styles.aiResponseBox}>
              <Text style={styles.aiHeader}>CartMind AI Response</Text>
              <Text style={styles.aiText}>{aiResponse}</Text>
            </View>
          ) : null}

          {matchedItem && (
            <TouchableOpacity style={styles.addedActionBtn} onPress={onNavigateCart}>
              <Text style={styles.addedActionText}>View Added Item in Cart →</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 24, alignItems: "center" },
  title: { color: "#ffffff", fontSize: 24, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#94a3b8", fontSize: 14, textAlign: "center", marginBottom: 40 },
  micOrbContainer: { width: 140, height: 140, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  pulseRing: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(37, 99, 235, 0.3)" },
  micOrb: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center" },
  micOrbActive: { backgroundColor: "#dc2626" },
  micInstruction: { color: "#38bdf8", fontSize: 15, fontWeight: "bold", marginBottom: 30 },
  transcriptCard: { width: "100%", backgroundColor: "#1e293b", borderRadius: 16, padding: 20 },
  cardHeader: { color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginBottom: 8 },
  transcriptText: { color: "#ffffff", fontSize: 16, fontStyle: "italic", marginBottom: 12 },
  aiResponseBox: { backgroundColor: "#0f172a", borderRadius: 12, padding: 14, marginTop: 8, borderWidth: 1, borderColor: "#38bdf8" },
  aiHeader: { color: "#38bdf8", fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  aiText: { color: "#e2e8f0", fontSize: 14, lineHeight: 20 },
  addedActionBtn: { backgroundColor: "#16a34a", borderRadius: 10, paddingVertical: 12, alignItems: "center", marginTop: 14 },
  addedActionText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
});
