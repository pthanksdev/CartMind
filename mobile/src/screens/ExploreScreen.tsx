import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { fetchCategories, fetchProducts } from "../api";
import { Category, Product } from "../types";
import { useMobileCurrency } from "../context/CurrencyContext";

export const ExploreScreen: React.FC<{
  onSelectCategory: (category: Category) => void;
  onSelectProduct: (product: Product) => void;
}> = ({ onSelectCategory, onSelectProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useMobileCurrency();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([
        fetchCategories().catch(() => []),
        fetchProducts().catch(() => []),
      ]);
      setCategories(catData);
      setProducts(prodData);
    } catch (err) {
      console.log("Explore load notice: Backend service unavailable");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = searchQuery
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchHeader}>
        <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories & products..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Search Results vs Categories */}
      {searchQuery ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productRow} onPress={() => onSelectProduct(item)}>
              <Text style={styles.prodName}>{item.name}</Text>
              <Text style={styles.prodPrice}>{formatPrice(item.salePrice)}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.categoryRow}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.catCard} onPress={() => onSelectCategory(item)}>
              <Feather name="grid" size={32} color="#38bdf8" style={{ marginBottom: 8 }} />
              <Text style={styles.catName}>{item.name}</Text>
              <Text style={styles.catSub}>Browse Items →</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  centered: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center" },
  searchHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", margin: 16, borderRadius: 12, paddingHorizontal: 12, height: 46 },
  searchInput: { flex: 1, color: "#ffffff", fontSize: 15 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  categoryRow: { justifyContent: "space-between", marginBottom: 14 },
  catCard: { width: "48%", backgroundColor: "#1e293b", borderRadius: 16, padding: 16, alignItems: "center" },
  catName: { color: "#ffffff", fontSize: 15, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  catSub: { color: "#38bdf8", fontSize: 12, fontWeight: "600" },
  productRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#1e293b", padding: 14, borderRadius: 12, marginBottom: 8 },
  prodName: { color: "#ffffff", fontSize: 15, fontWeight: "500" },
  prodPrice: { color: "#4ade80", fontSize: 15, fontWeight: "bold" },
});
