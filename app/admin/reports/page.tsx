"use client";

import { useState } from "react";
import {
  BarChart2,
  Users,
  Package,
  Clock,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Percent,
} from "lucide-react";
import {
  ReportingTable,
  TrendBadge,
  StockBadge,
  Column,
} from "./components/ReportingTable";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabKey = "sales" | "customer" | "stock" | "transaction";

// ── Dummy Data ────────────────────────────────────────────────────────────────

const salesData = [
  {
    product: "Velvet Lounge Chair",
    sku: "RVL-442",
    category: "Furniture",
    unitsSold: 452,
    todayDelta: "+12 today",
    revenue: "$38,420.00",
    stock: "In Stock (84)",
    margin: "24.5%",
    trend: "+12.5%",
  },
  {
    product: "Ceramic Pour-Over Set",
    sku: "RVL-901",
    category: "Kitchen",
    unitsSold: 821,
    todayDelta: "+34 today",
    revenue: "$22,988.00",
    stock: "Low Stock (12)",
    margin: "31.2%",
    trend: "+8.2%",
  },
  {
    product: "Cotton Duvet Cover",
    sku: "RVL-334",
    category: "Bedroom",
    unitsSold: 128,
    todayDelta: "-2 today",
    revenue: "$15,360.00",
    stock: "In Stock (210)",
    margin: "18.9%",
    trend: "-1.4%",
  },
  {
    product: "Modern Floor Lamp",
    sku: "RVL-112",
    category: "Lighting",
    unitsSold: 304,
    todayDelta: "0 today",
    revenue: "$21,280.00",
    stock: "Out of Stock",
    margin: "27.8%",
    trend: "0%",
  },
  {
    product: "Bamboo Shelf Unit",
    sku: "RVL-558",
    category: "Furniture",
    unitsSold: 189,
    todayDelta: "+5 today",
    revenue: "$17,010.00",
    stock: "In Stock (42)",
    margin: "22.1%",
    trend: "+3.4%",
  },
  {
    product: "Linen Throw Pillow",
    sku: "RVL-223",
    category: "Bedroom",
    unitsSold: 640,
    todayDelta: "+18 today",
    revenue: "$12,800.00",
    stock: "In Stock (320)",
    margin: "35.0%",
    trend: "+5.9%",
  },
  {
    product: "Minimalist Wall Clock",
    sku: "RVL-774",
    category: "Decor",
    unitsSold: 213,
    todayDelta: "+1 today",
    revenue: "$9,585.00",
    stock: "Low Stock (8)",
    margin: "29.4%",
    trend: "+1.2%",
  },
  {
    product: "Rattan Hanging Chair",
    sku: "RVL-661",
    category: "Furniture",
    unitsSold: 77,
    todayDelta: "0 today",
    revenue: "$18,480.00",
    stock: "In Stock (15)",
    margin: "21.3%",
    trend: "-0.8%",
  },
  {
    product: "Stoneware Mug Set",
    sku: "RVL-445",
    category: "Kitchen",
    unitsSold: 1032,
    todayDelta: "+43 today",
    revenue: "$20,640.00",
    stock: "In Stock (180)",
    margin: "40.5%",
    trend: "+9.3%",
  },
  {
    product: "Sheepskin Rug",
    sku: "RVL-882",
    category: "Decor",
    unitsSold: 55,
    todayDelta: "0 today",
    revenue: "$13,750.00",
    stock: "Out of Stock",
    margin: "17.6%",
    trend: "-2.1%",
  },
];

const customerData = [
  {
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    orders: 14,
    totalSpent: "$2,840.00",
    lastOrder: "Feb 15, 2026",
    status: "active",
    tier: "Gold",
  },
  {
    name: "Michael Chen",
    email: "m.chen@email.com",
    orders: 7,
    totalSpent: "$1,120.00",
    lastOrder: "Feb 10, 2026",
    status: "active",
    tier: "Silver",
  },
  {
    name: "Emma Wilson",
    email: "emma.w@email.com",
    orders: 32,
    totalSpent: "$7,680.00",
    lastOrder: "Feb 17, 2026",
    status: "active",
    tier: "Platinum",
  },
  {
    name: "James Davis",
    email: "j.davis@email.com",
    orders: 3,
    totalSpent: "$340.00",
    lastOrder: "Jan 28, 2026",
    status: "inactive",
    tier: "Bronze",
  },
  {
    name: "Olivia Martinez",
    email: "o.martinez@email.com",
    orders: 19,
    totalSpent: "$4,200.00",
    lastOrder: "Feb 16, 2026",
    status: "active",
    tier: "Gold",
  },
  {
    name: "Liam Thompson",
    email: "l.thompson@email.com",
    orders: 1,
    totalSpent: "$89.00",
    lastOrder: "Feb 1, 2026",
    status: "pending review",
    tier: "Bronze",
  },
  {
    name: "Ava Robinson",
    email: "ava.r@email.com",
    orders: 25,
    totalSpent: "$5,500.00",
    lastOrder: "Feb 14, 2026",
    status: "active",
    tier: "Platinum",
  },
  {
    name: "Noah Harris",
    email: "n.harris@email.com",
    orders: 8,
    totalSpent: "$960.00",
    lastOrder: "Feb 9, 2026",
    status: "active",
    tier: "Silver",
  },
  {
    name: "Sophia Clark",
    email: "s.clark@email.com",
    orders: 0,
    totalSpent: "$0.00",
    lastOrder: "—",
    status: "inactive",
    tier: "Bronze",
  },
  {
    name: "William Lewis",
    email: "w.lewis@email.com",
    orders: 11,
    totalSpent: "$2,100.00",
    lastOrder: "Feb 12, 2026",
    status: "active",
    tier: "Silver",
  },
];

const stockData = [
  {
    product: "Velvet Lounge Chair",
    sku: "RVL-442",
    category: "Furniture",
    stock: 84,
    reorderPoint: 20,
    warehouseLocation: "A-12",
    lastRestocked: "Feb 5, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Ceramic Pour-Over Set",
    sku: "RVL-901",
    category: "Kitchen",
    stock: 12,
    reorderPoint: 15,
    warehouseLocation: "B-04",
    lastRestocked: "Jan 28, 2026",
    stockStatus: "Low Stock",
  },
  {
    product: "Cotton Duvet Cover",
    sku: "RVL-334",
    category: "Bedroom",
    stock: 210,
    reorderPoint: 30,
    warehouseLocation: "C-07",
    lastRestocked: "Feb 10, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Modern Floor Lamp",
    sku: "RVL-112",
    category: "Lighting",
    stock: 0,
    reorderPoint: 10,
    warehouseLocation: "A-23",
    lastRestocked: "Jan 15, 2026",
    stockStatus: "Out of Stock",
  },
  {
    product: "Bamboo Shelf Unit",
    sku: "RVL-558",
    category: "Furniture",
    stock: 42,
    reorderPoint: 15,
    warehouseLocation: "A-09",
    lastRestocked: "Feb 1, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Linen Throw Pillow",
    sku: "RVL-223",
    category: "Bedroom",
    stock: 320,
    reorderPoint: 50,
    warehouseLocation: "C-02",
    lastRestocked: "Feb 14, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Minimalist Wall Clock",
    sku: "RVL-774",
    category: "Decor",
    stock: 8,
    reorderPoint: 10,
    warehouseLocation: "D-11",
    lastRestocked: "Jan 20, 2026",
    stockStatus: "Low Stock",
  },
  {
    product: "Rattan Hanging Chair",
    sku: "RVL-661",
    category: "Furniture",
    stock: 15,
    reorderPoint: 5,
    warehouseLocation: "A-31",
    lastRestocked: "Feb 8, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Stoneware Mug Set",
    sku: "RVL-445",
    category: "Kitchen",
    stock: 180,
    reorderPoint: 40,
    warehouseLocation: "B-17",
    lastRestocked: "Feb 16, 2026",
    stockStatus: "In Stock",
  },
  {
    product: "Sheepskin Rug",
    sku: "RVL-882",
    category: "Decor",
    stock: 0,
    reorderPoint: 8,
    warehouseLocation: "D-03",
    lastRestocked: "Jan 10, 2026",
    stockStatus: "Out of Stock",
  },
];

const transactionData = [
  {
    id: "TRX-8821",
    customer: "Emma Wilson",
    date: "Feb 17, 2026",
    items: 3,
    amount: "$620.00",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TRX-8820",
    customer: "Olivia Martinez",
    date: "Feb 16, 2026",
    items: 1,
    amount: "$249.00",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "TRX-8819",
    customer: "Sarah Johnson",
    date: "Feb 15, 2026",
    items: 2,
    amount: "$380.00",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TRX-8818",
    customer: "Ava Robinson",
    date: "Feb 14, 2026",
    items: 4,
    amount: "$890.00",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "TRX-8817",
    customer: "Noah Harris",
    date: "Feb 14, 2026",
    items: 1,
    amount: "$120.00",
    method: "Credit Card",
    status: "Refunded",
  },
  {
    id: "TRX-8816",
    customer: "William Lewis",
    date: "Feb 12, 2026",
    items: 2,
    amount: "$310.00",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "TRX-8815",
    customer: "Michael Chen",
    date: "Feb 10, 2026",
    items: 1,
    amount: "$89.00",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "TRX-8814",
    customer: "Liam Thompson",
    date: "Feb 9, 2026",
    items: 5,
    amount: "$1,240.00",
    method: "Credit Card",
    status: "Processing",
  },
  {
    id: "TRX-8813",
    customer: "James Davis",
    date: "Feb 8, 2026",
    items: 1,
    amount: "$75.00",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "TRX-8812",
    customer: "Sophia Clark",
    date: "Feb 7, 2026",
    items: 2,
    amount: "$198.00",
    method: "Credit Card",
    status: "Refunded",
  },
];

// ── Summary Cards ─────────────────────────────────────────────────────────────

const summaryCards = {
  sales: [
    {
      label: "Total Revenue",
      value: "$142,580.00",
      change: "+12.5% vs last month",
      up: true,
      icon: DollarSign,
    },
    {
      label: "Orders Count",
      value: "1,204",
      change: "+8.2% vs last month",
      up: true,
      icon: ShoppingCart,
    },
    {
      label: "Avg. Order Value",
      value: "$118.42",
      change: "-1.4% vs last month",
      up: false,
      icon: BarChart2,
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      change: "+0.4% vs last month",
      up: true,
      icon: Percent,
    },
  ],
  customer: [
    {
      label: "Total Customers",
      value: "3,842",
      change: "+6.1% vs last month",
      up: true,
      icon: Users,
    },
    {
      label: "Active Customers",
      value: "2,918",
      change: "+4.3% vs last month",
      up: true,
      icon: Users,
    },
    {
      label: "Avg. Orders / Customer",
      value: "4.2",
      change: "+0.8 vs last month",
      up: true,
      icon: ShoppingCart,
    },
    {
      label: "Customer LTV",
      value: "$920.00",
      change: "+11.0% vs last month",
      up: true,
      icon: DollarSign,
    },
  ],
  stock: [
    {
      label: "Total SKUs",
      value: "428",
      change: "+14 this month",
      up: true,
      icon: Package,
    },
    {
      label: "In Stock",
      value: "391",
      change: "-3 vs last month",
      up: false,
      icon: Package,
    },
    {
      label: "Low Stock",
      value: "24",
      change: "+7 vs last month",
      up: false,
      icon: Package,
    },
    {
      label: "Out of Stock",
      value: "13",
      change: "+2 vs last month",
      up: false,
      icon: Package,
    },
  ],
  transaction: [
    {
      label: "Total Transactions",
      value: "1,204",
      change: "+8.2% vs last month",
      up: true,
      icon: Clock,
    },
    {
      label: "Completed",
      value: "1,108",
      change: "+9.1% vs last month",
      up: true,
      icon: Clock,
    },
    {
      label: "Pending / Processing",
      value: "64",
      change: "-2.3% vs last month",
      up: true,
      icon: Clock,
    },
    {
      label: "Refunded",
      value: "32",
      change: "+3 vs last month",
      up: false,
      icon: Clock,
    },
  ],
};

// ── Tab Columns ───────────────────────────────────────────────────────────────

type SalesRow = (typeof salesData)[0];
type CustomerRow = (typeof customerData)[0];
type StockRow = (typeof stockData)[0];
type TransactionRow = (typeof transactionData)[0];

const salesColumns: Column<SalesRow>[] = [
  {
    key: "product",
    label: "Product Information",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-medium text-gray-800">{row.product}</p>
        <p className="text-xs text-gray-400">
          {row.category} · SKU: {row.sku}
        </p>
      </div>
    ),
  },
  {
    key: "unitsSold",
    label: "Units Sold",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-semibold text-gray-800">{row.unitsSold}</p>
        <p
          className={`text-xs ${row.todayDelta.startsWith("+") ? "text-emerald-500" : row.todayDelta.startsWith("-") ? "text-red-400" : "text-gray-400"}`}
        >
          {row.todayDelta}
        </p>
      </div>
    ),
  },
  {
    key: "revenue",
    label: "Revenue",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-gray-800">{String(v)}</span>
    ),
  },
  {
    key: "stock",
    label: "Stock Status",
    render: (_, row) => <StockBadge label={row.stock} />,
  },
  { key: "margin", label: "Profit Margin", sortable: true },
  {
    key: "trend",
    label: "Trend",
    render: (_, row) => <TrendBadge value={row.trend} />,
  },
];

const customerColumns: Column<CustomerRow>[] = [
  {
    key: "name",
    label: "Customer",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 shrink-0">
          {row.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  { key: "orders", label: "Orders", sortable: true },
  {
    key: "totalSpent",
    label: "Total Spent",
    sortable: true,
    render: (v) => (
      <span className="font-medium text-gray-800">{String(v)}</span>
    ),
  },
  { key: "lastOrder", label: "Last Order" },
  {
    key: "tier",
    label: "Tier",
    render: (_, row) => {
      const tierStyles: Record<string, string> = {
        Platinum: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        Gold: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        Silver: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
        Bronze: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
      };
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tierStyles[row.tier] ?? "bg-gray-100 text-gray-600"}`}
        >
          {row.tier}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (_, row) => {
      const s = row.status;
      const styles: Record<string, string> = {
        active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        inactive: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
        "pending review": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      };
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[s] ?? "bg-gray-100 text-gray-600"}`}
        >
          {s}
        </span>
      );
    },
  },
];

const stockColumns: Column<StockRow>[] = [
  {
    key: "product",
    label: "Product",
    sortable: true,
    render: (_, row) => (
      <div>
        <p className="font-medium text-gray-800">{row.product}</p>
        <p className="text-xs text-gray-400">
          {row.category} · SKU: {row.sku}
        </p>
      </div>
    ),
  },
  {
    key: "stock",
    label: "Stock Qty",
    sortable: true,
    render: (_, row) => (
      <span
        className={`font-semibold ${row.stock === 0 ? "text-red-500" : row.stock <= row.reorderPoint ? "text-amber-500" : "text-gray-800"}`}
      >
        {row.stock}
      </span>
    ),
  },
  { key: "reorderPoint", label: "Reorder Point", sortable: true },
  { key: "warehouseLocation", label: "Location" },
  { key: "lastRestocked", label: "Last Restocked" },
  {
    key: "stockStatus",
    label: "Status",
    render: (_, row) => <StockBadge label={row.stockStatus} />,
  },
];

const transactionColumns: Column<TransactionRow>[] = [
  {
    key: "id",
    label: "Transaction ID",
    render: (v) => (
      <span className="font-mono text-xs text-gray-500">{String(v)}</span>
    ),
  },
  { key: "customer", label: "Customer", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "items", label: "Items" },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (v) => (
      <span className="font-semibold text-gray-800">{String(v)}</span>
    ),
  },
  { key: "method", label: "Method" },
  {
    key: "status",
    label: "Status",
    render: (_, row) => {
      const styles: Record<string, string> = {
        Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        Processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        Refunded: "bg-red-50 text-red-600 ring-1 ring-red-200",
      };
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[row.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {row.status}
        </span>
      );
    },
  },
];

// ── Tab Config ────────────────────────────────────────────────────────────────

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "sales", label: "Sales Report", icon: BarChart2 },
  { key: "customer", label: "Customer Report", icon: Users },
  { key: "stock", label: "Stock Report", icon: Package },
  { key: "transaction", label: "Transaction History", icon: Clock },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("sales");
  const [dateRange, setDateRange] = useState("last_30");
  const [category, setCategory] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const tableDataMap = {
    sales: salesData,
    customer: customerData,
    stock: stockData,
    transaction: transactionData,
  };

  const columnsMap = {
    sales: salesColumns as Column<Record<string, unknown>>[],
    customer: customerColumns as Column<Record<string, unknown>>[],
    stock: stockColumns as Column<Record<string, unknown>>[],
    transaction: transactionColumns as Column<Record<string, unknown>>[],
  };

  const cards = summaryCards[activeTab];
  const tableData = tableDataMap[activeTab] as Record<string, unknown>[];
  const columns = columnsMap[activeTab];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Reporting &amp; Monitoring Hub
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Detailed insights and performance tracking across your e-commerce
            platform.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 active:scale-95 transition-all duration-150 w-fit">
          <Download size={15} />
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="today">Today</option>
            <option value="last_7">Last 7 Days</option>
            <option value="last_30">Last 30 Days</option>
            <option value="last_90">Last 90 Days</option>
            <option value="this_year">This Year</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Product Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="all">All Categories</option>
            <option value="furniture">Furniture</option>
            <option value="kitchen">Kitchen</option>
            <option value="bedroom">Bedroom</option>
            <option value="lighting">Lighting</option>
            <option value="decor">Decor</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <RefreshCw size={14} />
          Apply
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Icon size={15} className="text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <div className="flex items-center gap-1 text-xs font-medium">
                {card.up ? (
                  <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={12} className="text-red-400" />
                )}
                <span className={card.up ? "text-emerald-600" : "text-red-500"}>
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            {tabs.find((t) => t.key === activeTab)?.label} — Detail
          </h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
              {tableData.length * 42} records
            </span>
          </div>
        </div>

        <ReportingTable
          data={tableData}
          columns={columns}
          page={page}
          limit={limit}
          total={tableData.length * 42}
          handlePageChange={setPage}
          handleLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
