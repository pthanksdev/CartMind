import type { AuthResponse, LoginType, RegisterType, CreateAddressInput, AddressResponse, GetAddressesResponse } from "@/types/auth.type";
import type { CreateOrderInput, CreateOrderResponse, GetOrdersResponse, GetOrderByIdResponse } from "@/types/order.type";
import API from "./axios-client";
import type { CategoryResponseType } from "@/types/categories.type";
import type { DealsResponseType, ProductParams, ProductResponseType, ProductDetailResponseType, ReviewsResponseType } from "@/types/products.type";
import type { CartResponseType } from "@/types/cart.type";

export const getProductByIdQueryFn = async (id: string): Promise<any> => {
    const response = await API.get(`/admin/products/${id}`);
    return response.data;
};

export const updateProductMutationFn = async (params: {
    id: string;
    data: {
        categoryId?: string;
        name?: string;
        description?: string;
        images?: string[];
        originalPrice?: number;
        discountPercent?: number;
        discountLabel?: string | null;
        unit?: string;
        stockCount?: number;
        isActive?: boolean;
    }
}): Promise<any> => {
    const response = await API.put(`/admin/products/${params.id}`, params.data);
    return response.data;
};

export const createCategoryMutationFn = async (data: {
    name: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
}): Promise<any> => {
    const response = await API.post("/admin/categories", data);
    return response.data;
};

export const updateCategoryMutationFn = async (params: {
    id: string;
    data: {
        name?: string;
        description?: string;
        imageUrl?: string;
        isActive?: boolean;
    }
}): Promise<any> => {
    const response = await API.put(`/admin/categories/${params.id}`, params.data);
    return response.data;
};

export const updateUserProfileMutationFn = async (data: {
    name?: string;
    phone?: string;
    avatar?: string;
    password?: string;
}): Promise<any> => {
    const response = await API.put("/auth/profile", data);
    return response.data;
};

export const loginMutationFn = async (data:LoginType):Promise<AuthResponse> => {
    const response = await API.post<AuthResponse>("/auth/login", data);
    return response.data
}

export const registerMutationFn = async (data: RegisterType): Promise<AuthResponse> => {
    const response = await API.post<AuthResponse>("/auth/register", data);
    return response.data;
}

export const logoutMutationFn = async (): Promise<{ message: string }> => {
    const response = await API.post<{ message: string }>("/auth/logout");
    return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    const response = await API.get<AuthResponse>("/auth/status");
    return response.data;
}

export const getAllCategoriesQueryFn = async (): Promise<CategoryResponseType> => {
    const response = await API.get<CategoryResponseType>("/categories");
    return response.data;
};

export const getProductDealsQueryFn = async (limit: number = 6): Promise<DealsResponseType> => {
    const response = await API.get<DealsResponseType>("/products/deals", {
        params: { limit },
    });
    return response.data;
};

export const getProductsQueryFn = async (params?: ProductParams): Promise<ProductResponseType> => {
    const queryParams: Record<string, any> = {};
    if (params) {
        if (params.categoryId !== undefined) queryParams.categoryId = params.categoryId;
        if (params.hasDiscount !== undefined) queryParams.hasDiscount = params.hasDiscount;
        if (params.inStock !== undefined) queryParams.inStock = params.inStock;
        if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
        if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
        if (params.sort !== undefined) queryParams.sort = params.sort;
        if (params.keyword !== undefined) queryParams.keyword = params.keyword;
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.limit !== undefined) queryParams.limit = params.limit;
        if (params.skip !== undefined) queryParams.skip = params.skip;
    }
    const response = await API.get<ProductResponseType>("/products", {
        params: queryParams,
    });
    return response.data;
};

export const getProductBySlugQueryFn = async (slug: string): Promise<ProductDetailResponseType> => {
    const response = await API.get<ProductDetailResponseType>(`/products/${slug}`);
    return response.data;
};

export const getProductReviewsQueryFn = async (
    slug: string,
    params?: { page?: number; limit?: number }
): Promise<ReviewsResponseType> => {
    const response = await API.get<ReviewsResponseType>(`/products/${slug}/reviews`, {
        params,
    });
    return response.data;
};

export const getCartQueryFn = async (): Promise<CartResponseType> => {
    const response = await API.get<CartResponseType>("/cart");
    return response.data;
};

export const updateCartMutationFn = async (items: { productId: string; quantity: number }[]): Promise<CartResponseType> => {
    const response = await API.post<CartResponseType>("/cart", { items });
    return response.data;
};


export const getAddressesQueryFn = async (): Promise<GetAddressesResponse> => {
    const response = await API.get<GetAddressesResponse>("/addresses");
    return response.data;
};

export const createAddressMutationFn = async (data: CreateAddressInput): Promise<AddressResponse> => {
    const response = await API.post<AddressResponse>("/addresses", data);
    return response.data;
};

export const createOrderMutationFn = async (data: CreateOrderInput): Promise<CreateOrderResponse> => {
    const response = await API.post<CreateOrderResponse>("/orders", data);
    return response.data;
};

export const getOrdersQueryFn = async (): Promise<GetOrdersResponse> => {
    const response = await API.get<GetOrdersResponse>("/orders");
    return response.data;
};

export const getOrderByIdQueryFn = async (orderId: string): Promise<GetOrderByIdResponse> => {
    const response = await API.get<GetOrderByIdResponse>(`/orders/${orderId}`);
    return response.data;
};

export const getReviewableOrderItemsQueryFn = async (): Promise<any> => {
    const response = await API.get("/reviews/reviewable");
    return response.data;
};

export const getUserReviewsQueryFn = async (): Promise<any> => {
    const response = await API.get("/reviews");
    return response.data;
};

export const createReviewMutationFn = async (data: {
    orderId: string;
    orderItemId: string;
    rating: number;
    comment: string;
}): Promise<any> => {
    const response = await API.post("/reviews", data);
    return response.data;
};


export const getAdminAnalyticsQueryFn = async (): Promise<any> => {
    const response = await API.get("/admin/analytics");
    return response.data;
};

export const getAdminOrdersQueryFn = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<any> => {
    const response = await API.get("/admin/orders", {
        params: { page, limit },
    });
    return response.data;
};

export const updateOrderStatusMutationFn = async ({
    orderId,
    status,
    note,
}: {
    orderId: string;
    status: string;
    note?: string;
}): Promise<any> => {
    const response = await API.put(`/admin/orders/${orderId}/status`, { status, note });
    return response.data;
};

export const getAdminProductsQueryFn = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<any> => {
    const response = await API.get("/admin/products", {
        params: { page, limit },
    });
    return response.data;
};


export const createProductMutationFn = async (data: {
    categoryId: string;
    name: string;
    description?: string;
    images: string[];
    originalPrice: number;
    discountPercent?: number;
    discountLabel?: string | null;
    unit: string;
    stockCount?: number;
    isActive?: boolean;
}): Promise<any> => {
    const response = await API.post("/admin/products", data);
    return response.data;
};

export const uploadProductImagesMutationFn = async (files: File[]): Promise<{ images: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const response = await API.post("/admin/products/upload", formData, {
        headers: { 
            "Content-Type": "multipart/form-data" 
        },
    });
    return response.data;
};

export const generateProductAiMutationFn = async (data: {
    action: "rephrase-title" | "generate-desc";
    title: string;
    unit?: string;
    description?: string;
}): Promise<{ result: string }> => {
    const response = await API.post("/admin/ai/generate", data);
    return response.data;
};

export const getAdminCustomersQueryFn = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<any> => {
    const response = await API.get("/admin/customers", {
        params: { page, limit },
    });
    return response.data;
};

export const updateProductStockMutationFn = async ({
    id,
    stockCount,
}: {
    id: string;
    stockCount: number;
}): Promise<any> => {
    const response = await API.put(`/admin/products/${id}/stock`, { stockCount });
    return response.data;
};

// Wallet API
export const getWalletQueryFn = async (): Promise<any> => {
    const response = await API.get("/wallet");
    return response.data;
};

export const topupWalletMutationFn = async (data: { amount: number }): Promise<any> => {
    const response = await API.post("/wallet/topup", data);
    return response.data;
};

export const requestWithdrawalMutationFn = async (data: { amount: number; bankDetails: string }): Promise<any> => {
    const response = await API.post("/wallet/withdraw", data);
    return response.data;
};

export const getAdminPayoutsQueryFn = async (): Promise<any> => {
    const response = await API.get("/wallet/admin/payouts");
    return response.data;
};

export const approvePayoutMutationFn = async (transactionId: string): Promise<any> => {
    const response = await API.put(`/wallet/admin/payouts/${transactionId}/approve`);
    return response.data;
};

export const issueRefundCreditMutationFn = async (data: { customerEmail: string; amount: number; note?: string }): Promise<any> => {
    const response = await API.post("/wallet/admin/refund", data);
    return response.data;
};

// Coupon API
export const getActiveCouponsQueryFn = async (): Promise<any> => {
    const response = await API.get("/coupons/active");
    return response.data;
};

export const getCouponsQueryFn = async (): Promise<any> => {
    const response = await API.get("/coupons");
    return response.data;
};

export const createCouponMutationFn = async (data: any): Promise<any> => {
    const response = await API.post("/coupons", data);
    return response.data;
};

export const toggleCouponStatusMutationFn = async (id: string): Promise<any> => {
    const response = await API.put(`/coupons/${id}/toggle`);
    return response.data;
};

export const deleteCouponMutationFn = async (id: string): Promise<any> => {
    const response = await API.delete(`/coupons/${id}`);
    return response.data;
};

export const validateCouponMutationFn = async (data: { code: string; cartTotal: number }): Promise<any> => {
    const response = await API.post("/coupons/validate", data);
    return response.data;
};

// Settings API
export const getStoreSettingsQueryFn = async (): Promise<any> => {
    const response = await API.get("/settings");
    return response.data;
};

export const updateStoreSettingsMutationFn = async (data: any): Promise<any> => {
    const response = await API.put("/settings", data);
    return response.data;
};

// Inquiries API
export const createInquiryMutationFn = async (data: { name: string; email: string; subject?: string; message: string }): Promise<any> => {
    const response = await API.post("/inquiries", data);
    return response.data;
};

export const getInquiriesQueryFn = async (): Promise<any> => {
    const response = await API.get("/inquiries");
    return response.data;
};

export const resolveInquiryMutationFn = async (id: string): Promise<any> => {
    const response = await API.put(`/inquiries/${id}/resolve`);
    return response.data;
};

// AI Voice Command API
export const parseVoiceCommandMutationFn = async (command: string): Promise<any> => {
    const response = await API.post("/voice/parse", { command });
    return response.data;
};

// Hero Banners API
export const getHeroBannersQueryFn = async (): Promise<any> => {
    const response = await API.get("/hero-banners");
    return response.data;
};






