import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchWallet, requestWithdrawalApi } from "../api";
import { Wallet } from "../types";
import { useMobileCurrency } from "../context/CurrencyContext";

export const WalletScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [wallet, setWallet] = useState<Wallet>({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useMobileCurrency();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await fetchWallet();
      if (data) {
        setWallet(data);
      }
    } catch (err) {
      console.error("Wallet load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async () => {
    if (wallet.balance <= 0) {
      Alert.alert("Insufficient Balance", "You have no store wallet refund balance to withdraw.");
      return;
    }
    try {
      await requestWithdrawalApi(wallet.balance);
      Alert.alert(
        "Payout Request Received",
        `Withdrawal request for ${formatPrice(wallet.balance)} has been submitted for processing.`
      );
      loadWalletData();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to submit withdrawal request.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back to Account</Text>
        </TouchableOpacity>
      )}

      {/* Wallet Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.tagRow}>
          <Ionicons name="card-outline" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.balanceTag}>CartMind Store Refund Wallet</Text>
        </View>
        <Text style={styles.balanceAmount}>{formatPrice(wallet.balance)}</Text>
        <Text style={styles.balanceDesc}>
          Refunds from returned orders are automatically deposited here for instant store purchases or bank payouts.
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleWithdrawRequest}>
            <Text style={styles.btnText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Transaction History</Text>

        {wallet.transactions && wallet.transactions.length > 0 ? (
          wallet.transactions.map((tx: any, index: number) => (
            <View key={tx.id || index} style={styles.txRow}>
              <View>
                <Text style={styles.txTitle}>{tx.description || tx.type}</Text>
                <Text style={styles.txDate}>{new Date(tx.createdAt || Date.now()).toLocaleDateString()}</Text>
              </View>
              <Text style={tx.type === "CREDIT" ? styles.creditText : styles.debitText}>
                {tx.type === "CREDIT" ? "+" : "-"}{formatPrice(tx.amount)}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No wallet transactions recorded yet.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  centered: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  balanceCard: { backgroundColor: "#1e293b", borderRadius: 20, padding: 20, marginBottom: 24 },
  tagRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  balanceTag: { color: "#38bdf8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
  balanceAmount: { color: "#ffffff", fontSize: 36, fontWeight: "bold", marginBottom: 8 },
  balanceDesc: { color: "#94a3b8", fontSize: 13, lineHeight: 18, marginBottom: 20 },
  btnRow: { flexDirection: "row", gap: 10 },
  primaryBtn: { flex: 1, backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
  historySection: { backgroundColor: "#1e293b", borderRadius: 20, padding: 20 },
  sectionTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  txRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#334155", paddingVertical: 12 },
  txTitle: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
  txDate: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  creditText: { color: "#4ade80", fontWeight: "bold", fontSize: 15 },
  debitText: { color: "#ef4444", fontWeight: "bold", fontSize: 15 },
  emptyBox: { paddingVertical: 20, alignItems: "center" },
  emptyText: { color: "#64748b", fontSize: 14 },
});
