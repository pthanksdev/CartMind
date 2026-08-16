import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useMobileCurrency, CURRENCY_RATES, CurrencyCode } from "../context/CurrencyContext";

export const AccountScreen: React.FC<{
  onNavigateLogin: () => void;
  onNavigateOrders: () => void;
  onNavigateWallet: () => void;
  onNavigateSupport: () => void;
  onNavigateCoupons: () => void;
}> = ({
  onNavigateLogin,
  onNavigateOrders,
  onNavigateWallet,
  onNavigateSupport,
  onNavigateCoupons,
}) => {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useMobileCurrency();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          {user?.name ? (
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          ) : (
            <Ionicons name="person" size={24} color="#ffffff" />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || "Guest Customer"}</Text>
          <Text style={styles.userEmail}>{user?.email || "Sign in to save orders & wallet"}</Text>
        </View>
        {!user && (
          <TouchableOpacity style={styles.loginBtn} onPress={onNavigateLogin}>
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Currency Preference Selector */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="globe-outline" size={18} color="#38bdf8" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Display Currency</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyRow}>
          {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => {
            const isSelected = currency === code;
            return (
              <TouchableOpacity
                key={code}
                style={[styles.currencyPill, isSelected && styles.currencyPillActive]}
                onPress={() => setCurrency(code)}
              >
                <Text style={[styles.currencyText, isSelected && styles.currencyTextActive]}>
                  {code} ({CURRENCY_RATES[code].symbol})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Account Navigation Links */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="settings-outline" size={18} color="#38bdf8" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Customer Features</Text>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateOrders}>
          <View style={styles.navItemLeft}>
            <Feather name="package" size={18} color="#38bdf8" style={{ marginRight: 10 }} />
            <Text style={styles.navItemText}>My Orders & Tracking</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateWallet}>
          <View style={styles.navItemLeft}>
            <Ionicons name="wallet-outline" size={18} color="#38bdf8" style={{ marginRight: 10 }} />
            <Text style={styles.navItemText}>Store Refund Wallet & Payouts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateCoupons}>
          <View style={styles.navItemLeft}>
            <Ionicons name="pricetag-outline" size={18} color="#38bdf8" style={{ marginRight: 10 }} />
            <Text style={styles.navItemText}>Promo Coupons & Vouchers</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateSupport}>
          <View style={styles.navItemLeft}>
            <Ionicons name="headset-outline" size={18} color="#38bdf8" style={{ marginRight: 10 }} />
            <Text style={styles.navItemText}>Customer Support & Inquiries</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      {user && (
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sign Out of Account</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 20 },
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 20, padding: 16, marginBottom: 20 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center", marginRight: 12 },
  avatarText: { color: "#ffffff", fontSize: 22, fontWeight: "bold" },
  profileInfo: { flex: 1 },
  userName: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  userEmail: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  loginBtn: { backgroundColor: "#2563eb", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  loginBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
  sectionCard: { backgroundColor: "#1e293b", borderRadius: 20, padding: 16, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  currencyRow: { gap: 8, paddingVertical: 4 },
  currencyPill: { backgroundColor: "#0f172a", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#334155" },
  currencyPillActive: { backgroundColor: "#2563eb", borderColor: "#38bdf8" },
  currencyText: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  currencyTextActive: { color: "#ffffff" },
  navItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#334155" },
  navItemLeft: { flexDirection: "row", alignItems: "center" },
  navItemText: { color: "#e2e8f0", fontSize: 15, fontWeight: "500" },
  logoutBtn: { backgroundColor: "rgba(220, 38, 38, 0.15)", borderWidth: 1, borderColor: "#ef4444", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginTop: 8 },
  logoutBtnText: { color: "#ef4444", fontSize: 15, fontWeight: "bold" },
});
