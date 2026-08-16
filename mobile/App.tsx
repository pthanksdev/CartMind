import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import tw from "twrnc";

import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider, useMobileCart } from "./src/context/CartContext";
import { CurrencyProvider } from "./src/context/CurrencyContext";

// Customer Screens
import { HomeScreen } from "./src/screens/HomeScreen";
import { ExploreScreen } from "./src/screens/ExploreScreen";
import { VoiceAssistantScreen } from "./src/screens/VoiceAssistantScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { CheckoutScreen } from "./src/screens/CheckoutScreen";
import { OrderConfirmationScreen } from "./src/screens/OrderConfirmationScreen";
import { OrderHistoryScreen } from "./src/screens/OrderHistoryScreen";
import { WalletScreen } from "./src/screens/WalletScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { VerifyOTPScreen } from "./src/screens/VerifyOTPScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { AddressBookScreen } from "./src/screens/AddressBookScreen";
import { SupportScreen } from "./src/screens/SupportScreen";
import { CouponsScreen } from "./src/screens/CouponsScreen";
import { Product } from "./src/types";

type Tab = "home" | "explore" | "voice" | "cart" | "account";
type SubScreen =
  | "none"
  | "login"
  | "register"
  | "forgotPassword"
  | "verifyOtp"
  | "resetPassword"
  | "productDetail"
  | "addressBook"
  | "checkout"
  | "orderConfirmation"
  | "orders"
  | "support"
  | "coupons";

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeSubScreen, setActiveSubScreen] = useState<SubScreen>("none");
  const [resetEmail, setResetEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const { totalItems } = useMobileCart();

  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab);
    setActiveSubScreen("none");
  };

  const handleOpenProductDetail = (p: Product) => {
    setSelectedProduct(p);
    setActiveSubScreen("productDetail");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#090d16]`}>
      <StatusBar style="light" />

      {/* Top App Header */}
      <View style={tw`flex-row justify-between items-center px-5 py-3.5 border-b border-slate-800`}>
        <TouchableOpacity style={tw`flex-row items-center`} onPress={() => handleTabPress("home")}>
          <Ionicons name="flash-sharp" size={20} color="#38bdf8" style={tw`mr-1.5`} />
          <Text style={tw`text-xl font-bold text-white`}>CartMind AI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center bg-green-600 px-3 py-1.5 rounded-full`} onPress={() => handleTabPress("cart")}>
          <Feather name="shopping-bag" size={16} color="#ffffff" style={tw`mr-1.5`} />
          <Text style={tw`text-white font-bold text-xs`}>{totalItems}</Text>
        </TouchableOpacity>
      </View>

      {/* Main View Router */}
      <View style={tw`flex-1`}>
        {activeSubScreen === "login" && (
          <LoginScreen
            onNavigateRegister={() => setActiveSubScreen("register")}
            onSuccess={() => setActiveSubScreen("none")}
          />
        )}

        {activeSubScreen === "register" && (
          <RegisterScreen
            onNavigateLogin={() => setActiveSubScreen("login")}
            onSuccess={() => setActiveSubScreen("none")}
          />
        )}

        {activeSubScreen === "forgotPassword" && (
          <ForgotPasswordScreen
            onNavigateLogin={() => setActiveSubScreen("login")}
            onNavigateVerify={(email) => {
              setResetEmail(email);
              setActiveSubScreen("verifyOtp");
            }}
          />
        )}

        {activeSubScreen === "verifyOtp" && (
          <VerifyOTPScreen
            email={resetEmail}
            onBack={() => setActiveSubScreen("forgotPassword")}
            onNavigateReset={() => setActiveSubScreen("resetPassword")}
          />
        )}

        {activeSubScreen === "resetPassword" && (
          <ResetPasswordScreen onSuccess={() => setActiveSubScreen("login")} />
        )}

        {activeSubScreen === "productDetail" && selectedProduct && (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setActiveSubScreen("none")}
            onNavigateCart={() => handleTabPress("cart")}
          />
        )}

        {activeSubScreen === "addressBook" && (
          <AddressBookScreen onBack={() => setActiveSubScreen("none")} />
        )}

        {activeSubScreen === "checkout" && (
          <CheckoutScreen
            onBack={() => setActiveSubScreen("none")}
            onOrderSuccess={(ord) => {
              setConfirmedOrder(ord);
              setActiveSubScreen("orderConfirmation");
            }}
          />
        )}

        {activeSubScreen === "orderConfirmation" && (
          <OrderConfirmationScreen
            order={confirmedOrder}
            onNavigateOrders={() => setActiveSubScreen("orders")}
            onNavigateHome={() => handleTabPress("home")}
          />
        )}

        {activeSubScreen === "orders" && (
          <OrderHistoryScreen onBack={() => setActiveSubScreen("none")} />
        )}

        {activeSubScreen === "support" && (
          <SupportScreen onBack={() => setActiveSubScreen("none")} />
        )}

        {activeSubScreen === "coupons" && (
          <CouponsScreen onBack={() => setActiveSubScreen("none")} />
        )}

        {activeSubScreen === "none" && (
          <>
            {activeTab === "home" && (
              <HomeScreen onSelectProduct={handleOpenProductDetail} />
            )}
            {activeTab === "explore" && (
              <ExploreScreen
                onSelectCategory={() => handleTabPress("home")}
                onSelectProduct={handleOpenProductDetail}
              />
            )}
            {activeTab === "voice" && (
              <VoiceAssistantScreen
                onNavigateCart={() => handleTabPress("cart")}
                onNavigateWallet={() => handleTabPress("account")}
              />
            )}
            {activeTab === "cart" && (
              <CartScreen
                onNavigateHome={() => handleTabPress("home")}
                onProceedCheckout={() => setActiveSubScreen("checkout")}
              />
            )}
            {activeTab === "account" && (
              <AccountScreen
                onNavigateLogin={() => setActiveSubScreen("login")}
                onNavigateOrders={() => setActiveSubScreen("orders")}
                onNavigateWallet={() => handleTabPress("account")}
                onNavigateSupport={() => setActiveSubScreen("support")}
                onNavigateCoupons={() => setActiveSubScreen("coupons")}
              />
            )}
          </>
        )}
      </View>

      {/* 5-Tab Premium Glassmorphic Bottom Navigation Bar */}
      <View
        style={[
          tw`flex-row justify-around items-center px-2 pt-2 pb-6`,
          {
            backgroundColor: "rgba(15, 23, 42, 0.88)",
            borderTopWidth: 1,
            borderTopColor: "rgba(255, 255, 255, 0.12)",
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 16,
          },
        ]}
      >
        {/* Shop Tab */}
        <TouchableOpacity
          style={tw`flex-1 items-center py-1`}
          onPress={() => handleTabPress("home")}
          activeOpacity={0.7}
        >
          <View style={tw`items-center justify-center`}>
            <Ionicons
              name={activeTab === "home" ? "storefront" : "storefront-outline"}
              size={22}
              color={activeTab === "home" ? "#10b981" : "#64748b"}
            />
            {activeTab === "home" && (
              <View style={tw`w-1 h-1 rounded-full bg-emerald-400 mt-0.5`} />
            )}
          </View>
          <Text
            style={tw`text-[11px] font-semibold mt-0.5 ${
              activeTab === "home" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            Shop
          </Text>
        </TouchableOpacity>

        {/* Explore Tab */}
        <TouchableOpacity
          style={tw`flex-1 items-center py-1`}
          onPress={() => handleTabPress("explore")}
          activeOpacity={0.7}
        >
          <View style={tw`items-center justify-center`}>
            <Ionicons
              name={activeTab === "explore" ? "search" : "search-outline"}
              size={22}
              color={activeTab === "explore" ? "#10b981" : "#64748b"}
            />
            {activeTab === "explore" && (
              <View style={tw`w-1 h-1 rounded-full bg-emerald-400 mt-0.5`} />
            )}
          </View>
          <Text
            style={tw`text-[11px] font-semibold mt-0.5 ${
              activeTab === "explore" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            Explore
          </Text>
        </TouchableOpacity>

        {/* Floating Glass Voice AI Center Action */}
        <TouchableOpacity
          style={tw`flex-1 items-center -top-4`}
          onPress={() => handleTabPress("voice")}
          activeOpacity={0.85}
        >
          <View
            style={[
              tw`w-13 h-13 rounded-full justify-center items-center bg-emerald-600 border-2 border-emerald-300/40`,
              {
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 8,
              },
            ]}
          >
            <Ionicons name="mic" size={24} color="#ffffff" />
          </View>
          <Text style={tw`text-[10px] font-bold text-emerald-400 mt-0.5 tracking-wide`}>
            Voice AI
          </Text>
        </TouchableOpacity>

        {/* Cart Tab */}
        <TouchableOpacity
          style={tw`flex-1 items-center py-1`}
          onPress={() => handleTabPress("cart")}
          activeOpacity={0.7}
        >
          <View style={tw`relative items-center justify-center`}>
            <Ionicons
              name={activeTab === "cart" ? "cart" : "cart-outline"}
              size={22}
              color={activeTab === "cart" ? "#10b981" : "#64748b"}
            />
            {totalItems > 0 && (
              <View
                style={tw`absolute -top-1 -right-2 bg-rose-500 rounded-full w-4.5 h-4.5 justify-center items-center border border-slate-900`}
              >
                <Text style={tw`text-white text-[9px] font-extrabold`}>
                  {totalItems}
                </Text>
              </View>
            )}
            {activeTab === "cart" && (
              <View style={tw`w-1 h-1 rounded-full bg-emerald-400 mt-0.5`} />
            )}
          </View>
          <Text
            style={tw`text-[11px] font-semibold mt-0.5 ${
              activeTab === "cart" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            Cart
          </Text>
        </TouchableOpacity>

        {/* Account Tab */}
        <TouchableOpacity
          style={tw`flex-1 items-center py-1`}
          onPress={() => handleTabPress("account")}
          activeOpacity={0.7}
        >
          <View style={tw`items-center justify-center`}>
            <Ionicons
              name={activeTab === "account" ? "person" : "person-outline"}
              size={22}
              color={activeTab === "account" ? "#10b981" : "#64748b"}
            />
            {activeTab === "account" && (
              <View style={tw`w-1 h-1 rounded-full bg-emerald-400 mt-0.5`} />
            )}
          </View>
          <Text
            style={tw`text-[11px] font-semibold mt-0.5 ${
              activeTab === "account" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
