# 🌟 Ravella E-Commerce & B2B Platform - Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-ff69b4?logo=framer)](https://www.framer.com/motion/)

Welcome to the frontend repository of **Ravella**, a premium E-Commerce and Business-to-Business (B2B) platform. This application is engineered with a modern tech stack centered around **Next.js 14 (App Router)** and **Tailwind CSS v4** to deliver exceptional performance, rich aesthetics, fluid animations, and highly structured portals for both customers and administrators.

---

## 🚀 Key Features

### 🛒 1. Customer Shopping Portal

- **Dynamic Homepage:** Highly interactive homepage equipped with curated promotional banners, intelligent popups (Welcome & Discount alerts), and modular product showcase sections.
- **Shopping Cart & Smart Checkout:** Unified cart system supporting item quantity modifications and immediate sync. Checkout flow is integrated with RajaOngkir API for dynamic shipping cost calculations based on destination/courier.
- **Payment Gateway Integration:** Seamless checkout transition and redirect handling utilizing Xendit invoice links.
- **Customer Dashboard:** A personalized space where customers can manage their profiles, save multiple shipping addresses, toggle primary addresses, track active shipments, and view transaction history.

### 💼 2. B2B Portal (Wholesale Access)

- **B2B Client Registration:** Specialized registration flow for businesses needing bulk orders.
- **Wholesale Pricing Rules:** Automatically applies B2B pricing models and minimum quantity purchase rules once the user is authenticated as a wholesale client.

### 💎 3. Gamified Loyalty Program

- **Tier Progress Tracking:** Calculates and visually shows customer progress toward the next tier (e.g., Bronze, Silver, Gold, Platinum) based on lifetime purchase value.
- **Benefits & Rewards Showcase:** Details specific privileges and perks unlocked by each membership level.
- **Points Ledger:** Transparent transaction history displaying point accumulation (earning) and redemption values.

### 📊 4. Admin Dashboard & Operations Console

- **Interactive Analytics Charts:** Rich visual graphs powered by **Recharts** detailing sales growth, traffic, active transaction status, and low-stock alerts.
- **Voucher & Promotion Control:** Manage storewide promotions and vouchers. Supports bulk upload features via templates.
- **Review Moderation:** View, approve, or reject customer reviews, and post official administrator replies.
- **Order Fulfillment:** Unified interface for managing order status updates (processing, shipping) and recording tracking receipts.
- **Export Center:** Easily generate and download Excel reports for sales, products, active users, and vouchers.

---

## 🛠️ Tech Stack & Architecture Choices

| Technology                  | Purpose            | Rationale                                                                                                                                                               |
| :-------------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 14 (App Router)** | Core Framework     | Leverages Server and Client Component separation, optimized static generation, and folder-based routing structures (`(public)`, `admin`, `customer`, `b2b`).            |
| **Tailwind CSS v4**         | Fluid Styling      | Embraces modern CSS properties, native variables, and sub-millisecond compile times for utility-first styling.                                                          |
| **Framer Motion**           | Micro-interactions | Enhances user experience (UX) with hardware-accelerated animations on buttons, modal popups, page transitions, and hover states.                                        |
| **Axios & Interceptors**    | Network Layer      | Standardizes request configurations. Utilizes request interceptors to automatically attach Bearer Tokens retrieved from local storage for seamless session persistence. |
| **Recharts**                | Data Visualization | Renders lightweight, fully responsive SVG charts for complex administrative sales and traffic reports.                                                                  |
| **React Hot Toast**         | Feedback Alerts    | Offers sleek, non-blocking toast notifications for system alerts (e.g., "Item added to cart", "Login success").                                                         |

---

## 📂 Directory Structure

```text
FE-Ravella/
├── app/
│   ├── (public)/          # Guest pages (catalog, product details, auth, cart, payments)
│   ├── admin/             # Restricted admin controls (reports, vouchers, reviews, users)
│   ├── b2b/               # Dedicated B2B wholesale client portal
│   ├── customer/          # User profiles, order tracking, address books, loyalty tiers
│   ├── HomePage/          # Home modular visual components (BestSellers, WelcomePopup, etc.)
│   ├── components/        # Reusable global UI elements (Buttons, Inputs, Modals, Cards)
│   ├── lib/               # Utility scripts & configurations (Axios clients, helper functions)
│   ├── types/             # Shared TypeScript type definitions
│   ├── globals.css        # Global styles & Tailwind directive configurations
│   └── layout.tsx         # Global HTML layout and context providers
├── public/                # Static assets (images, icons, vectors)
├── package.json           # Project dependencies & script commands
└── tsconfig.json          # TypeScript configurations
```

---

## 💻 Installation & Setup

Follow these steps to run the frontend application locally:

### 1. Prerequisites

Ensure you have **Node.js (v20 or higher)** and **npm** installed on your system.

### 2. Clone the Repository & Navigate

```bash
git clone <repository-url>
cd FE-Ravella
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` (or `.env.local`) file in the root of the frontend folder and specify your backend API target URL:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🎯 Recruiter Highlights (Engineering Focus)

- **Robust Session Lifecycle:** The Axios instance automatically recovers bearer tokens from Local Storage and mounts them on every outgoing request via interceptors, ensuring seamless page-reload authentication.
- **Strict Type Safety:** Fully typed props, API responses, and database model representations using TypeScript, reducing run-time failures.
- **Modular Component Architecture:** Adheres to clean-code separation of concerns. UI elements (cards, headers, layouts) are abstract, highly reusable, and fully decoupled from business-logic controllers.
- **Advanced Layout Nesting:** Makes extensive use of Next.js route groups (`(public)`) and nested layout layouts to isolate styles and components between standard users, B2B clients, and the Admin system.
- **Modern Web Design:** Curated dark/light aesthetics, smooth glassmorphism layers, custom animated buttons, and responsive grid layouts designed for exceptional mobile and desktop representation.
