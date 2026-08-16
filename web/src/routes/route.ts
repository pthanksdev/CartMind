import AccountAddressesPage from "@/pages/account/addresses";
import AccountReviewsPage from "@/pages/account/reviews";
import AccountProfilePage from "@/pages/account/profile";
import CheckoutPage from "@/pages/checkout";
import CheckoutSuccessPage from "@/pages/checkout/success";
import HomePage from "@/pages/home";
import OrderTrackingPage from "@/pages/orders/order-tracking";
import OrdersPage from "@/pages/orders/orders";
import ProductDetailPage from "@/pages/product-detail";
import ProductsPage from "@/pages/products";
import SearchResultPage from "@/pages/search-results";
import WishlistPage from "@/pages/wishlist";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminProductsPage from "@/pages/admin/products";
import AdminNewProductPage from "@/pages/admin/new-product";
import AdminEditProductPage from "@/pages/admin/edit-product";
import AdminCategoriesPage from "@/pages/admin/categories";
import OrderInvoicePage from "@/pages/orders/invoice";
import CompareProductsPage from "@/pages/compare";
import HelpPage from "@/pages/help";
import AdminCustomersPage from "@/pages/admin/customers";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminCouponsPage from "@/pages/admin/coupons";
import AdminInventoryPage from "@/pages/admin/inventory";
import AccountWalletPage from "@/pages/account/wallet";
import AdminWalletPage from "@/pages/admin/wallet";
import AdminInquiriesPage from "@/pages/admin/inquiries";


// export const AUTH_ROUTES = {
//   SIGN_IN: '/',
//   SIGN_UP: '/',
// };


export const PUBLIC_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  SEARCH_RESULTS: '/search-results',
  COMPARE: '/compare',
  HELP: '/help',
};


export const PROTECTED_ROUTES = {
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  ORDERS: '/orders',
  ORDER_TRACKING: '/orders/:orderId',
  ORDER_INVOICE: '/orders/:orderId/invoice',
  WISHLIST: '/wishlist',
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_REVIEWS: '/account/reviews',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_WALLET: '/account/wallet',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_PRODUCTS_EDIT: '/admin/products/:id/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_WALLET: '/admin/wallet',
  ADMIN_INQUIRIES: '/admin/inquiries',
};


// export const authRouthsPaths: Array<{ path: string; element: React.ComponentType }> = [];

export const publicRoutesPaths = [
  {
    path: PUBLIC_ROUTES.HOME,
    element: HomePage,
  },
  {
    path: PUBLIC_ROUTES.PRODUCTS,
    element: ProductsPage,
  },
  {
    path: PUBLIC_ROUTES.PRODUCT_DETAIL,
    element: ProductDetailPage,
  },
  {
    path: PUBLIC_ROUTES.SEARCH_RESULTS,
    element: SearchResultPage,
  },
  {
    path: PUBLIC_ROUTES.COMPARE,
    element: CompareProductsPage,
  },
  {
    path: PUBLIC_ROUTES.HELP,
    element: HelpPage,
  },
];

export const protectedRoutesPaths = [
  {
    path: PROTECTED_ROUTES.CHECKOUT,
    element: CheckoutPage,
  },
  {
    path: PROTECTED_ROUTES.CHECKOUT_SUCCESS,
    element: CheckoutSuccessPage,
  },
  {
    path: PROTECTED_ROUTES.ORDERS,
    element: OrdersPage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ORDER_TRACKING,
    element: OrderTrackingPage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ORDER_INVOICE,
    element: OrderInvoicePage,
  },
  {
    path: PROTECTED_ROUTES.WISHLIST,
    element: WishlistPage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ACCOUNT_PROFILE,
    element: AccountProfilePage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ACCOUNT_REVIEWS,
    element: AccountReviewsPage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ACCOUNT_ADDRESSES,
    element: AccountAddressesPage,
    account: true,
  },
  {
    path: PROTECTED_ROUTES.ACCOUNT_WALLET,
    element: AccountWalletPage,
    account: true,
  }
];


export const adminRoutesPaths = [
  {
    path: PROTECTED_ROUTES.ADMIN_DASHBOARD,
    element: AdminDashboardPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_ORDERS,
    element: AdminOrdersPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_CATEGORIES,
    element: AdminCategoriesPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_PRODUCTS,
    element: AdminProductsPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_PRODUCTS_NEW,
    element: AdminNewProductPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_PRODUCTS_EDIT,
    element: AdminEditProductPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_CUSTOMERS,
    element: AdminCustomersPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_SETTINGS,
    element: AdminSettingsPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_COUPONS,
    element: AdminCouponsPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_INVENTORY,
    element: AdminInventoryPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_WALLET,
    element: AdminWalletPage,
  },
  {
    path: PROTECTED_ROUTES.ADMIN_INQUIRIES,
    element: AdminInquiriesPage,
  },
];
