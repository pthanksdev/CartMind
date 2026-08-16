import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Product } from "../types";
import { useMobileCart } from "../context/CartContext";
import { useMobileCurrency } from "../context/CurrencyContext";

export const ProductDetailScreen: React.FC<{
  product: Product;
  onBack: () => void;
  onNavigateCart: () => void;
}> = ({ product, onBack, onNavigateCart }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useMobileCart();
  const { formatPrice } = useMobileCurrency();

  const imageUri = product.imageUrl || (product.images && product.images[0]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert("CartMind Cart", `Added ${quantity} x ${product.name} to cart!`, [
      { text: "Continue Shopping", style: "cancel" },
      { text: "View Cart", onPress: onNavigateCart },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Navigation Header */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={16} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back to Catalog</Text>
        </TouchableOpacity>

        {/* Product Image */}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="package" size={64} color="#64748b" />
          </View>
        )}

        {/* Title & Unit */}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.unitTag}>Unit: {product.unit}</Text>

        {/* Rating & Stock */}
        <View style={styles.rowInfo}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#f59e0b" style={{ marginRight: 4 }} />
            <Text style={styles.ratingText}>{product.ratingAverage || 4.8} ({product.reviewCount || 12} Reviews)</Text>
          </View>

          <View style={[styles.stockBadge, product.stockCount > 0 ? styles.inStock : styles.outStock]}>
            <Text style={styles.stockText}>
              {product.stockCount > 0 ? `In Stock (${product.stockCount})` : "Out of Stock"}
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>{formatPrice(product.salePrice)}</Text>
          {product.originalPrice > product.salePrice && (
            <Text style={styles.origPrice}>{formatPrice(product.originalPrice)}</Text>
          )}
        </View>

        {/* Description */}
        <Text style={styles.sectionHeader}>Product Overview</Text>
        <Text style={styles.description}>
          {product.description || "Fresh, premium quality product delivered directly to your doorstep. Backed by CartMind AI Quality Guarantee."}
        </Text>

        {/* Quantity Stepper */}
        <Text style={styles.sectionHeader}>Select Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyVal}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addCartBtnText}>
            Add {quantity} to Cart • {formatPrice(product.salePrice * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  content: { padding: 20, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  image: { width: "100%", height: 240, borderRadius: 16, backgroundColor: "#1e293b", marginBottom: 16 },
  imagePlaceholder: { width: "100%", height: 240, borderRadius: 16, backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  name: { color: "#ffffff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  unitTag: { color: "#94a3b8", fontSize: 13, marginBottom: 12 },
  rowInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { color: "#f59e0b", fontSize: 14, fontWeight: "600" },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  inStock: { backgroundColor: "rgba(22, 163, 74, 0.2)" },
  outStock: { backgroundColor: "rgba(220, 38, 38, 0.2)" },
  stockText: { color: "#4ade80", fontSize: 12, fontWeight: "bold" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginBottom: 20 },
  salePrice: { color: "#4ade80", fontSize: 26, fontWeight: "bold" },
  origPrice: { color: "#94a3b8", fontSize: 16, textDecorationLine: "line-through" },
  sectionHeader: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 12 },
  description: { color: "#cbd5e1", fontSize: 14, lineHeight: 22, marginBottom: 16 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 },
  qtyBtn: { width: 40, height: 40, backgroundColor: "#1e293b", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { color: "#ffffff", fontSize: 20, fontWeight: "bold" },
  qtyVal: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#1e293b", padding: 16, borderTopWidth: 1, borderTopColor: "#334155" },
  addCartBtn: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  addCartBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});
