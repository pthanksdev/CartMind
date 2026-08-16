import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useMobileCurrency } from "../context/CurrencyContext";

export const OrderConfirmationScreen: React.FC<{
  order: any;
  onNavigateOrders: () => void;
  onNavigateHome: () => void;
}> = ({ order, onNavigateOrders, onNavigateHome }) => {
  const { formatPrice } = useMobileCurrency();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={80} color="#4ade80" />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with <Text style={styles.brandBold}>CartMind AI</Text>.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Order Reference Number</Text>
          <Text style={styles.orderNum}>{order.orderNumber || "ORD-8921"}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total Amount Paid:</Text>
            <Text style={styles.rowVal}>{formatPrice(order.totalAmount || 0)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Estimated Delivery:</Text>
            <Text style={styles.rowVal}>30-45 Minutes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onNavigateOrders}>
          <Feather name="package" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Track Order Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onNavigateHome}>
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center", padding: 24 },
  content: { width: "100%", alignItems: "center" },
  iconCircle: { marginBottom: 12 },
  title: { color: "#ffffff", fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#94a3b8", fontSize: 14, textAlign: "center", marginBottom: 24 },
  brandBold: { color: "#38bdf8", fontWeight: "bold" },
  card: { width: "100%", backgroundColor: "#1e293b", borderRadius: 16, padding: 20, marginBottom: 24, alignItems: "center" },
  cardLabel: { color: "#94a3b8", fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
  orderNum: { color: "#4ade80", fontSize: 24, fontWeight: "bold", marginVertical: 6 },
  divider: { width: "100%", height: 1, backgroundColor: "#334155", marginVertical: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 6 },
  rowLabel: { color: "#94a3b8", fontSize: 14 },
  rowVal: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
  primaryBtn: { flexDirection: "row", justifyContent: "center", width: "100%", backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  primaryBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  secondaryBtn: { width: "100%", backgroundColor: "#334155", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  secondaryBtnText: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
});
