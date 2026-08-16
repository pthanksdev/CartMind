import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import tw from "twrnc";

import { fetchProducts, fetchCategories, parseVoiceCommand } from "../api";
import { Product, Category } from "../types";
import { useMobileCart } from "../context/CartContext";
import { useMobileCurrency } from "../context/CurrencyContext";

type HomeScreenProps = {
  onSelectProduct: (product: Product) => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const { addToCart } = useMobileCart();
  const { formatPrice } = useMobileCurrency();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        fetchProducts().catch((e) => {
          console.log("Backend offline or unreachable for products:", e.message);
          return [];
        }),
        fetchCategories().catch((e) => {
          console.log("Backend offline or unreachable for categories:", e.message);
          return [];
        }),
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.log("Unable to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceMicTap = () => {
    setIsVoiceListening(true);
    setSearchQuery("");
    setTimeout(async () => {
      const sampleVoicePrompts = [
        "Add organic milk to cart",
        "Search for apples",
        "Buy fresh eggs",
      ];
      const randomPrompt = sampleVoicePrompts[Math.floor(Math.random() * sampleVoicePrompts.length)];
      setSearchQuery(randomPrompt);
      setIsVoiceListening(false);

      try {
        const result = await parseVoiceCommand(randomPrompt);
        if (result.action === "add_to_cart" && result.matchedProduct) {
          addToCart(result.matchedProduct);
          Alert.alert("CartMind Voice AI", result.aiResponse || `Added ${result.matchedProduct.name}`);
        } else if (result.aiResponse) {
          Alert.alert("CartMind AI Assistant", result.aiResponse);
        }
      } catch {
        // Ignore
      }
    }, 2000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? (p as any).categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-[#090d16]`}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={tw`text-slate-400 mt-2.5`}>Loading CartMind Catalog...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-[#090d16]`}>
      {/* Search Header */}
      <View style={tw`flex-row px-4 pt-3 pb-2 gap-2.5`}>
        <View style={tw`flex-1 flex-row items-center bg-slate-800 rounded-xl px-3 h-11`}>
          <Ionicons name="search-outline" size={18} color="#64748b" style={tw`mr-2`} />
          <TextInput
            style={tw`flex-1 text-white text-sm`}
            placeholder="Search CartMind or speak..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={tw`w-11 h-11 rounded-xl justify-center items-center ${isVoiceListening ? "bg-red-600" : "bg-blue-600"}`}
          onPress={handleVoiceMicTap}
        >
          <Ionicons name="mic" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <View style={tw`py-1.5 px-4`}>
        <ScrollViewHorizontal
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* Products Grid with Enhanced Headers and Footers */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={tw`justify-between mb-4`}
        contentContainerStyle={tw`px-4 pb-8 pt-2`}
        ListHeaderComponent={
          <View style={tw`mb-3`}>
            {/* 1. Voice AI Quick-Trigger Banner */}
            <TouchableOpacity
              style={tw`bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-4 rounded-2xl border border-sky-500/30 mb-4 shadow-lg`}
              onPress={handleVoiceMicTap}
              activeOpacity={0.85}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View
                  style={tw`w-12 h-12 rounded-full ${
                    isVoiceListening ? "bg-red-500" : "bg-sky-500"
                  } justify-center items-center`}
                >
                  <Ionicons name="mic" size={24} color="#ffffff" />
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center gap-1.5 mb-0.5`}>
                    <Ionicons name="sparkles" size={13} color="#38bdf8" />
                    <Text style={tw`text-sky-400 text-xs font-bold uppercase tracking-wider`}>
                      CartMind Voice AI
                    </Text>
                  </View>
                  <Text style={tw`text-white font-bold text-sm`}>
                    {isVoiceListening ? "Listening to your request..." : "Tap & Speak to Shop 3x Faster"}
                  </Text>
                  <Text style={tw`text-slate-400 text-xs mt-0.5`}>
                    Try: &quot;Add 2L organic milk to cart&quot;
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#38bdf8" />
              </View>
            </TouchableOpacity>

            {/* 2. Trust Signals & Social Proof Strip */}
            <View style={tw`flex-row flex-wrap justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4`}>
              <View style={tw`w-[48%] flex-row items-center gap-2 mb-2`}>
                <Ionicons name="flash" size={16} color="#f59e0b" />
                <Text style={tw`text-slate-300 text-xs font-medium`}>30-Min Delivery</Text>
              </View>
              <View style={tw`w-[48%] flex-row items-center gap-2 mb-2`}>
                <Ionicons name="star" size={16} color="#38bdf8" />
                <Text style={tw`text-slate-300 text-xs font-medium`}>50k+ Happy Buyers</Text>
              </View>
              <View style={tw`w-[48%] flex-row items-center gap-2`}>
                <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                <Text style={tw`text-slate-300 text-xs font-medium`}>Stripe Protected</Text>
              </View>
              <View style={tw`w-[48%] flex-row items-center gap-2`}>
                <Ionicons name="headset" size={16} color="#a855f7" />
                <Text style={tw`text-slate-300 text-xs font-medium`}>24/7 AI Support</Text>
              </View>
            </View>

            {/* 3. Flash Sale Header Banner */}
            <View style={tw`bg-gradient-to-r from-rose-950/60 to-slate-900 p-3.5 rounded-xl border border-rose-500/30 flex-row justify-between items-center mb-3`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Ionicons name="flame" size={20} color="#f43f5e" />
                <View>
                  <Text style={tw`text-white font-bold text-sm`}>Flash Sale Deals</Text>
                  <Text style={tw`text-rose-300 text-[10px]`}>Up to 40% OFF Groceries</Text>
                </View>
              </View>
              <View style={tw`bg-rose-500/20 px-2.5 py-1 rounded-md border border-rose-500/40`}>
                <Text style={tw`text-rose-400 font-mono text-xs font-bold`}>02:45:30</Text>
              </View>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={tw`mt-4 mb-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 p-4 rounded-2xl border border-sky-500/30 text-center`}>
            <View style={tw`flex-row items-center justify-center gap-2 mb-1`}>
              <Ionicons name="pricetag" size={16} color="#10b981" />
              <Text style={tw`text-emerald-400 font-bold text-xs uppercase tracking-wider`}>
                Promo Offer
              </Text>
            </View>
            <Text style={tw`text-white font-bold text-base text-center`}>
              Unlock 15% OFF Your Order
            </Text>
            <Text style={tw`text-slate-400 text-xs text-center mt-1 mb-3`}>
              Use promo code WELCOME15 at checkout
            </Text>
            <TouchableOpacity
              style={tw`bg-sky-500 rounded-xl py-2.5 items-center`}
              onPress={() => Alert.alert("Promo Code", "Use WELCOME15 at checkout for 15% OFF!")}
            >
              <Text style={tw`text-white font-bold text-xs`}>Claim 15% OFF Coupon</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const imageUri = item.imageUrl || (item.images && item.images[0]);
          return (
            <TouchableOpacity
              style={tw`w-[48%] bg-slate-800 rounded-2xl p-3 justify-between`}
              activeOpacity={0.8}
              onPress={() => onSelectProduct(item)}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={tw`w-full h-28 rounded-lg mb-2`} resizeMode="contain" />
              ) : (
                <View style={tw`w-full h-28 bg-slate-900 rounded-lg justify-center items-center mb-2`}>
                  <Feather name="package" size={32} color="#64748b" />
                </View>
              )}

              <Text style={tw`text-white text-sm font-semibold mb-1.5 leading-4.5`} numberOfLines={2}>
                {item.name}
              </Text>

              <View style={tw`flex-row items-baseline gap-1.5 mb-2`}>
                <Text style={tw`text-green-400 text-base font-bold`}>{formatPrice(item.salePrice)}</Text>
                {item.originalPrice > item.salePrice && (
                  <Text style={tw`text-slate-400 text-xs line-through`}>{formatPrice(item.originalPrice)}</Text>
                )}
              </View>

              <TouchableOpacity
                style={tw`bg-blue-600 rounded-lg py-2 items-center`}
                onPress={() => {
                  addToCart(item);
                  Alert.alert("Added", `${item.name} added to cart`);
                }}
              >
                <Text style={tw`text-white font-bold text-xs`}>+ Add</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const ScrollViewHorizontal: React.FC<{
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}> = ({ categories, selectedCategory, onSelectCategory }) => (
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={[{ id: "all", name: "All Items" }, ...categories]}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => {
      const isSelected = item.id === "all" ? selectedCategory === null : selectedCategory === item.id;
      return (
        <TouchableOpacity
          style={tw`px-3.5 py-2 rounded-full mr-2 ${isSelected ? "bg-blue-600" : "bg-slate-800"}`}
          onPress={() => onSelectCategory(item.id === "all" ? null : item.id)}
        >
          <Text style={tw`text-xs font-semibold ${isSelected ? "text-white" : "text-slate-400"}`}>{item.name}</Text>
        </TouchableOpacity>
      );
    }}
  />
);
