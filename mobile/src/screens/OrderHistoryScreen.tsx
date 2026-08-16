import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchOrders } from "../api";
import { Order } from "../types";
import { useMobileCurrency } from "../context/CurrencyContext";

export const OrderHistoryScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useMobileCurrency();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Order load error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Orders & Receipts</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderNum}>{item.orderNumber}</Text>
              <View style={[styles.statusBadge, item.status === "DELIVERED" ? styles.badgeGreen : styles.badgeBlue]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.val}>{item.paymentMethod}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Amount:</Text>
              <Text style={styles.totalVal}>{formatPrice(item.totalAmount)}</Text>
            </View>

            <TouchableOpacity style={styles.trackBtn}>
              <Ionicons name="receipt-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.trackBtnText}>View Receipt & Track Driver</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  centered: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, gap: 14, borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  title: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
  list: { padding: 16 },
  orderCard: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  orderNum: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreen: { backgroundColor: "rgba(22, 163, 74, 0.2)" },
  badgeBlue: { backgroundColor: "rgba(37, 99, 235, 0.2)" },
  statusText: { color: "#38bdf8", fontSize: 11, fontWeight: "bold" },
  dateText: { color: "#94a3b8", fontSize: 12, marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#94a3b8", fontSize: 13 },
  val: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
  totalVal: { color: "#4ade80", fontSize: 15, fontWeight: "bold" },
  trackBtn: { flexDirection: "row", backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 10, justifyContent: "center", alignItems: "center", marginTop: 12 },
  trackBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
});
