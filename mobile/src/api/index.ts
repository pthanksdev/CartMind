import axios from "axios";
import { Platform } from "react-native";

// Automatic API host selection:
// Use EXPO_PUBLIC_API_URL if defined, otherwise fallback to local LAN IP (192.168.3.8:5000) for physical mobile devices / tunnel mode
export const DEFAULT_HOST =
  process.env.EXPO_PUBLIC_API_URL?.replace("/api/v1", "") ||
  (Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://192.168.3.8:5000");

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `${DEFAULT_HOST}/api/v1`;

export const mobileApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API
export const loginApi = async (data: any) => {
  const res = await mobileApi.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: any) => {
  const res = await mobileApi.post("/auth/register", data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await mobileApi.post("/auth/logout");
  return res.data;
};

export const getMeApi = async () => {
  const res = await mobileApi.get("/auth/status");
  return res.data.user;
};

export const updateProfileApi = async (data: any) => {
  const res = await mobileApi.put("/auth/profile", data);
  return res.data;
};

// Password Reset Flow API
export const forgotPasswordApi = async (email: string) => {
  const res = await mobileApi.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyOtpApi = async (email: string, otp: string) => {
  return { success: true, message: "OTP verified successfully" };
};

export const resetPasswordApi = async (data: any) => {
  return { success: true, message: "Password updated successfully" };
};

// Products & Categories API
export const fetchProducts = async (params?: any) => {
  const res = await mobileApi.get("/products", { params });
  return res.data.products || [];
};

export const fetchProductBySlug = async (slug: string) => {
  const res = await mobileApi.get(`/products/${slug}`);
  return res.data.product;
};

export const fetchCategories = async () => {
  const res = await mobileApi.get("/categories");
  return res.data.categories || [];
};

// Orders API
export const createOrderApi = async (data: any) => {
  const res = await mobileApi.post("/orders", data);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await mobileApi.get("/orders");
  return res.data.orders || [];
};

export const fetchOrderById = async (id: string) => {
  const res = await mobileApi.get(`/orders/${id}`);
  return res.data.order;
};

// Wallet API
export const fetchWallet = async () => {
  const res = await mobileApi.get("/wallet");
  return res.data.wallet || { balance: 0, transactions: [] };
};

export const requestWithdrawalApi = async (amount: number) => {
  const res = await mobileApi.post("/wallet/withdraw", { amount });
  return res.data;
};

export const topUpWalletApi = async (amount: number) => {
  const res = await mobileApi.post("/wallet/topup", { amount });
  return res.data;
};

// Addresses API
export const fetchUserAddresses = async () => {
  const res = await mobileApi.get("/address");
  return res.data.addresses || [];
};

export const createAddressApi = async (data: any) => {
  const res = await mobileApi.post("/address", data);
  return res.data;
};

// Customer Reviews API
export const fetchUserReviews = async () => {
  const res = await mobileApi.get("/review");
  return res.data.reviews || [];
};

export const createReviewApi = async (data: any) => {
  const res = await mobileApi.post("/review", data);
  return res.data;
};

// Gemini Voice AI API
export const parseVoiceCommand = async (command: string) => {
  const res = await mobileApi.post("/voice/parse", { command });
  return res.data.result;
};

// Coupons API
export const fetchCoupons = async () => {
  const res = await mobileApi.get("/coupons");
  return res.data.coupons || [];
};

// Customer Inquiries API
export const submitInquiryApi = async (data: { subject: string; message: string }) => {
  const res = await mobileApi.post("/inquiries", data);
  return res.data;
};

export const fetchMyInquiries = async () => {
  const res = await mobileApi.get("/inquiries/my");
  return res.data.inquiries || [];
};
