export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  originalPrice: number;
  salePrice: number;
  discountPercent?: number;
  discountLabel?: string;
  unit: string;
  stockCount: number;
  imageUrl?: string;
  images?: string[];
  ratingAverage?: number;
  reviewCount?: number;
  isActive: boolean;
  categoryId?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  walletDiscountAmount: number;
  status: "PENDING" | "PROCESSING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentMethod: "CASH_ON_DELIVERY" | "STRIPE" | "WALLET";
  shippingAddress: any;
  items: OrderItem[];
  createdAt: string;
};

export type Wallet = {
  balance: number;
  transactions?: {
    id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    createdAt: string;
  }[];
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  expiresAt?: string;
};

export type Inquiry = {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
};

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
};
