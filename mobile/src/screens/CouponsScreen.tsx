import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchCoupons } from "../api";
import { Coupon } from "../types";

export const CouponsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Coupon load error:", err);
      setCoupons([]);
    }
  };

  const copyCoupon = (code: string) => {
    Alert.alert("Coupon Copied!", `Code "${code}" copied to clipboard. You can paste it during checkout.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Coupons & Promo Vouchers</Text>
      </View>

      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.couponCard}>
            <View style={styles.badgeBox}>
              <Text style={styles.discountNum}>{item.discountPercent}% OFF</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.codeText}>{item.code}</Text>
              <Text style={styles.descText}>
                {item.minOrderAmount ? `Min order $${item.minOrderAmount}` : "No min spend"}
              </Text>
            </View>

            <TouchableOpacity style={styles.copyBtn} onPress={() => copyCoupon(item.code)}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, gap: 14, borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  title: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
  list: { padding: 16 },
  couponCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#334155" },
  badgeBox: { backgroundColor: "#2563eb", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginRight: 12 },
  discountNum: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
  infoBox: { flex: 1 },
  codeText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  descText: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  copyBtn: { backgroundColor: "#16a34a", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  copyBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
});
