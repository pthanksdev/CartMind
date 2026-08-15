# CartMind AI - Full-Stack & Mobile Ecommerce Platform

[![Expo SDK](https://img.shields.io/badge/Expo-SDK_54-blue.svg?style=flat-square&logo=expo)](https://expo.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg?style=flat-square&logo=node.js)](https://nodejs.org)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-6772E5.svg?style=flat-square&logo=stripe)](https://stripe.com)

> **CartMind AI** is an enterprise-grade, multi-platform e-commerce ecosystem powered by Node.js, Express, MongoDB, React, and React Native (Expo SDK 54). Features an interactive Voice AI Shopping Assistant, glassmorphic UI design, instant digital wallet payments, Stripe integration, guest-to-user cart synchronization, and real-time administrative analytics.

---

## Key Platform Features

### 1. Voice AI Shopping Agent
* **Natural Language Processing**: Speech-to-cart parsing allows users to discover products, check stock, and build carts using voice commands.
* **Multi-Platform Support**: Available in both the Web Storefront modal and the Mobile Application.

### 2. Mobile App (Expo SDK 54)
* **Glassmorphic Navigation Bar**: Translucent backdrop blur, glowing active indicators, and an elevated floating mic action button.
* **Vector Iconography**: Standardized on `@expo/vector-icons` (`Ionicons` and `Feather`) for high-fidelity native aesthetics.
* **Tunnel & Offline Support**: Pre-configured with `@expo/ngrok` tunnel mode for zero-configuration testing on physical iOS & Android devices.

### 3. Authentication & OTP Verification
* **Cookie-Based JWT Auth**: Secure `httpOnly` authentication tokens.
* **Gmail SMTP OTP Engine**: Real-time Nodemailer integration for password resets, email verification, and order confirmation receipts.
* **Seamless Guest Cart Sync**: Automatic guest cart (`instant_guest_cart_id`) merging into user profiles upon registration or login.

### 4. Payments, Wallet & Checkout
* **Stripe Payment Gateway**: End-to-end card payments with automatic stock reservation on Stripe webhook status confirmation.
* **CartMind Digital Wallet**: Integrated user balance for top-ups, instant wallet checkouts, and withdrawal tracking.
* **Calculated Pricing & Security**: Subtotals, taxes, and shipping fees are strictly recalculated server-side from Mongoose DB prices.

### 5. Admin Portal & Telemetry
* **Dashboard Analytics**: Revenue charts, user acquisition metrics, order dispatch management, and coupon code campaign management.
* **Support Ticket Dispatch**: Customer inquiry resolution flow with email notification dispatch.

---

## Architecture & Monorepo Structure

```
MERN-AI-Ecommerce-Platform/
├── backend/                  # Node.js + Express 5 + TypeScript Server
│   ├── src/
│   │   ├── config/           # DB, Passport JWT, & Environment Configs
│   │   ├── controllers/      # Route Controllers wrapped in asyncHandler
│   │   ├── middlewares/      # Zod validation, Auth Guards, Error Handler
│   │   ├── models/           # Mongoose DB Schemas (User, Product, Order, etc.)
│   │   ├── routes/           # RESTful API Endpoints
│   │   └── services/         # Async Business Logic Services
├── web/                      # React 19 + Vite Storefront & Admin Portal
│   ├── src/
│   │   ├── components/       # Glassmorphic UI & Voice Shopping Modal
│   │   ├── context/          # React State & Context Providers
│   │   ├── pages/            # Customer & Admin Dashboard Pages
├── mobile/                   # React Native (Expo SDK 54) Mobile App
│   ├── src/
│   │   ├── api/              # Axios Client configured with Auto LAN IP
│   │   ├── context/          # Auth, Cart, & Currency Contexts
│   │   ├── screens/          # 15+ Native Screens (Home, Voice AI, Wallet, etc.)
│   └── scripts/              # Linux DevTools Sandbox Auto-Fix Scripts
```

---

## Quick Start Guide

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection URI

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cartmind
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_ORIGIN=http://localhost:5173
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

Run the backend development server:
```bash
npm run dev
```

---

### 2. Web Storefront & Admin Setup

```bash
cd web
npm install
npm run dev
```
Access the Web Storefront at `http://localhost:5173`.

---

### 3. Mobile App Setup (Expo SDK 54)

```bash
cd mobile
npm install --legacy-peer-deps
```

Create `.env` inside `mobile/.env`:
```env
ELECTRON_NO_SANDBOX=1
EXPO_NO_DEVTOOLS=1
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api/v1
```

Start Metro Bundler in **Tunnel Mode**:
```bash
npm start
```
Scan the QR code with **Expo Go** on iOS or Android.

---

## Core API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user & sync guest cart |
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate & issue `httpOnly` JWT |
| **Products** | `GET` | `/api/v1/products` | Fetch paginated catalog with filters |
| **Categories**| `GET` | `/api/v1/categories` | Fetch category catalog |
| **Cart** | `GET` | `/api/v1/cart` | Get current user / guest cart |
| **Orders** | `POST` | `/api/v1/orders` | Create order (Wallet or Stripe) |
| **Wallet** | `GET` | `/api/v1/wallet` | Fetch wallet balance & transaction history |
| **Voice AI** | `POST` | `/api/v1/voice/parse` | Parse natural language voice query |

---

## Linux Development Environment Hardening

> [!NOTE]
> On Linux environments (Ubuntu 23.10+ / 24.04+), Electron SUID sandbox restrictions can interrupt Expo DevTools. CartMind includes an automated postinstall script in `mobile/scripts/fix-sandbox.js` that wraps DevTools with `--no-sandbox` to guarantee stable execution.

---

## License & Acknowledgments

This project is open-source for educational and personal development. For commercial deployment, SaaS licensing, or consulting inquiries, please check license terms.

Developed using **MERN Stack**, **React Native**, and **Google Antigravity Design Engineering**.
