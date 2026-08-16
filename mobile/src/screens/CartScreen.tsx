import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useMobileCart } from "../context/CartContext";
import { useMobileCurrency } from "../context/CurrencyContext";
import { fetchWallet } from "../api";

export const CartScreen: React.FC<{
  onNavigateHome: () => void;
  onProceedCheckout?: () => void;
}> = ({ onNavigateHome, onProceedCheckout }) => {
  const { cart, updateQuantity, removeFromCart, subtotal, useWalletDiscount, setUseWalletDiscount } = useMobileCart();
  const { formatPrice } = useMobileCurrency();
  const [walletBalance, setWalletBalance] = React.useState(0);

  React.useEffect(() => {
    fetchWallet()
      .then((w) => {
        if (w && typeof w.balance === "number") setWalletBalance(w.balance);
      })
      .catch(() => setWalletBalance(0));
  }, []);

  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.085;
  const rawTotal = subtotal + deliveryFee + tax;
  const walletDiscount = useWalletDiscount ? Math.min(rawTotal, walletBalance) : 0;
  const finalTotal = Math.max(0, rawTotal - walletDiscount);

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#64748b" style={{ marginBottom: 12 }} />
        <Text style={styles.emptyTitle}>Your CartMind Cart is Empty</Text>
        <Text style={styles.emptyDesc}>Add fresh products or use voice search to shop!</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={onNavigateHome}>
          <Text style={styles.shopBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const imageUri = item.product.imageUrl || (item.product.images && item.product.images[0]);
          return (
            <View style={styles.cartCard}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.itemImg} resizeMode="contain" />
              ) : (
                <View style={styles.imgPlaceholder}>
                  <Feather name="package" size={24} color="#64748b" />
                </View>
              )}

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.product.salePrice)} / {item.product.unit}</Text>

                {/* Quantity Controls */}
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" style={{ padding: 4 }} />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Summary Footer */}
      <View style={styles.footer}>
        {/* Store Wallet Checkbox */}
        <TouchableOpacity
          style={styles.walletToggle}
          onPress={() => setUseWalletDiscount(!useWalletDiscount)}
        >
          <View style={[styles.checkbox, useWalletDiscount && styles.checkboxActive]}>
            {useWalletDiscount && <Ionicons name="checkmark" size={14} color="#ffffff" />}
          </View>
          <Text style={styles.walletToggleText}>
            Apply CartMind Store Refund Balance ({formatPrice(walletBalance)})
          </Text>
        </TouchableOpacity>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee:</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sales Tax (8.5%):</Text>
          <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
        </View>

        {useWalletDiscount && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Refund Wallet Credit Applied:</Text>
            <Text style={styles.discountValue}>-{formatPrice(walletDiscount)}</Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Due:</Text>
          <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={onProceedCheckout || onNavigateHome}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout • {formatPrice(finalTotal)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  emptyContainer: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center", padding: 20 },
  emptyTitle: { color: "#ffffff", fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  emptyDesc: { color: "#94a3b8", fontSize: 14, marginBottom: 20 },
  shopBtn: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: "#ffffff", fontWeight: "bold" },
  listContent: { padding: 16 },
  cartCard: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 16, padding: 12, alignItems: "center", marginBottom: 12 },
  itemImg: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  imgPlaceholder: { width: 60, height: 60, backgroundColor: "#0f172a", borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { color: "#ffffff", fontSize: 15, fontWeight: "600", marginBottom: 2 },
  itemPrice: { color: "#4ade80", fontSize: 13, fontWeight: "bold", marginBottom: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { width: 28, height: 28, backgroundColor: "#334155", borderRadius: 6, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  qtyText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  footer: { backgroundColor: "#1e293b", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  walletToggle: { flexDirection: "row", alignItems: "center", marginBottom: 14, backgroundColor: "#0f172a", padding: 10, borderRadius: 10 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#2563eb", justifyContent: "center", alignItems: "center", marginRight: 10 },
  checkboxActive: { backgroundColor: "#2563eb" },
  walletToggleText: { color: "#e2e8f0", fontSize: 12, fontWeight: "600" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  summaryLabel: { color: "#94a3b8", fontSize: 13 },
  summaryValue: { color: "#ffffff", fontSize: 13, fontWeight: "600" },
  discountValue: { color: "#4ade80", fontSize: 13, fontWeight: "bold" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#334155", paddingTop: 8, marginTop: 4, marginBottom: 16 },
  totalLabel: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  totalValue: { color: "#4ade80", fontSize: 20, fontWeight: "bold" },
  checkoutBtn: { backgroundColor: "#16a34a", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  checkoutBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
