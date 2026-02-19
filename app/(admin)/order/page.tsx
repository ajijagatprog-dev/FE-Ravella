"use client";

import { useState, useMemo } from "react";
import { Download, Search, TrendingUp, TrendingDown, ShoppingBag, Truck } from "lucide-react";
import { OrderTable, Order } from "./components/OrderTable";

// ── Dummy Data ────────────────────────────────────────────────────────────────

const ALL_ORDERS: Order[] = [
  { id: "RVL-4921", customer: { name: "Sarah Jenkins", initials: "SJ", avatarColor: "#8B5CF6" }, date: "Oct 24, 2023", paymentStatus: "Success", total: "$248.50" },
  { id: "RVL-4922", customer: { name: "Marcus Thorne", initials: "MT", avatarColor: "#EC4899" }, date: "Oct 24, 2023", paymentStatus: "Pending", total: "$1,120.00" },
  { id: "RVL-4923", customer: { name: "Emma Laurent", initials: "EL", avatarColor: "#10B981" }, date: "Oct 23, 2023", paymentStatus: "Failed", total: "$84.99" },
  { id: "RVL-4924", customer: { name: "Brian Kim", initials: "BK", avatarColor: "#3B82F6" }, date: "Oct 23, 2023", paymentStatus: "Success", total: "$312.00" },
  { id: "RVL-4925", customer: { name: "Chloe Davis", initials: "CD", avatarColor: "#F59E0B" }, date: "Oct 22, 2023", paymentStatus: "Success", total: "$145.20" },
  { id: "RVL-4926", customer: { name: "Noah Patel", initials: "NP", avatarColor: "#EF4444" }, date: "Oct 22, 2023", paymentStatus: "Pending", total: "$670.00" },
  { id: "RVL-4927", customer: { name: "Lily Zhang", initials: "LZ", avatarColor: "#06B6D4" }, date: "Oct 21, 2023", paymentStatus: "Success", total: "$390.75" },
  { id: "RVL-4928", customer: { name: "James Ford", initials: "JF", avatarColor: "#84CC16" }, date: "Oct 21, 2023", paymentStatus: "Failed", total: "$55.00" },
  { id: "RVL-4929", customer: { name: "Ava Morgan", initials: "AM", avatarColor: "#F97316" }, date: "Oct 20, 2023", paymentStatus: "Success", total: "$820.00" },
  { id: "RVL-4930", customer: { name: "Ethan Cole", initials: "EC", avatarColor: "#6366F1" }, date: "Oct 20, 2023", paymentStatus: "Success", total: "$199.99" },
  { id: "RVL-4931", customer: { name: "Mia Turner", initials: "MT", avatarColor: "#D946EF" }, date: "Oct 19, 2023", paymentStatus: "Pending", total: "$445.00" },
  { id: "RVL-4932", customer: { name: "Oliver Brooks", initials: "OB", avatarColor: "#0EA5E9" }, date: "Oct 19, 2023", paymentStatus: "Success", total: "$230.50" },
  { id: "RVL-4933", customer: { name: "Isabelle Scott", initials: "IS", avatarColor: "#14B8A6" }, date: "Oct 18, 2023", paymentStatus: "Failed", total: "$92.00" },
  { id: "RVL-4934", customer: { name: "Liam Harris", initials: "LH", avatarColor: "#A78BFA" }, date: "Oct 18, 2023", paymentStatus: "Success", total: "$560.00" },
  { id: "RVL-4935", customer: { name: "Sophia Reed", initials: "SR", avatarColor: "#FB7185" }, date: "Oct 17, 2023", paymentStatus: "Success", total: "$310.00" },
  { id: "RVL-4936", customer: { name: "Lucas Wright", initials: "LW", avatarColor: "#22C55E" }, date: "Oct 17, 2023", paymentStatus: "Pending", total: "$785.00" },
  { id: "RVL-4937", customer: { name: "Charlotte King", initials: "CK", avatarColor: "#FB923C" }, date: "Oct 16, 2023", paymentStatus: "Success", total: "$140.00" },
  { id: "RVL-4938", customer: { name: "Benjamin Hall", initials: "BH", avatarColor: "#38BDF8" }, date: "Oct 16, 2023", paymentStatus: "Success", total: "$920.50" },
  { id: "RVL-4939", customer: { name: "Amelia Young", initials: "AY", avatarColor: "#C084FC" }, date: "Oct 15, 2023", paymentStatus: "Failed", total: "$67.00" },
  { id: "RVL-4940", customer: { name: "Henry Adams", initials: "HA", avatarColor: "#4ADE80" }, date: "Oct 15, 2023", paymentStatus: "Success", total: "$450.00" },
  { id: "RVL-4941", customer: { name: "Grace Nelson", initials: "GN", avatarColor: "#F472B6" }, date: "Oct 14, 2023", paymentStatus: "Success", total: "$275.00" },
  { id: "RVL-4942", customer: { name: "William Carter", initials: "WC", avatarColor: "#60A5FA" }, date: "Oct 14, 2023", paymentStatus: "Pending", total: "$1,050.00" },
  { id: "RVL-4943", customer: { name: "Hannah Evans", initials: "HE", avatarColor: "#2DD4BF" }, date: "Oct 13, 2023", paymentStatus: "Success", total: "$385.00" },
  { id: "RVL-4944", customer: { name: "Jack Martinez", initials: "JM", avatarColor: "#FDE047" }, date: "Oct 13, 2023", paymentStatus: "Failed", total: "$110.00" },
  { id: "RVL-4945", customer: { name: "Ella Thompson", initials: "ET", avatarColor: "#FB7185" }, date: "Oct 12, 2023", paymentStatus: "Success", total: "$599.99" },
  { id: "RVL-4946", customer: { name: "Mason White", initials: "MW", avatarColor: "#818CF8" }, date: "Oct 12, 2023", paymentStatus: "Success", total: "$230.00" },
  { id: "RVL-4947", customer: { name: "Victoria Lee", initials: "VL", avatarColor: "#A3E635" }, date: "Oct 11, 2023", paymentStatus: "Pending", total: "$870.00" },
  { id: "RVL-4948", customer: { name: "Daniel Brown", initials: "DB", avatarColor: "#67E8F9" }, date: "Oct 11, 2023", paymentStatus: "Success", total: "$160.00" },
];

type TabStatus = "all" | "Pending" | "Success" | "Failed";

const TABS: { key: TabStatus; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "Pending", label: "Pending" },
  { key: "Success", label: "Success" },
  { key: "Failed", label: "Failed" },
];

const LIMIT = 5;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = ALL_ORDERS;
    if (activeTab !== "all") result = result.filter((o) => o.paymentStatus === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, search]);

  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const tabCount = (key: TabStatus) =>
    key === "all" ? ALL_ORDERS.length : ALL_ORDERS.filter((o) => o.paymentStatus === key).length;

  const handleTabChange = (key: TabStatus) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Home</span>
        <span>/</span>
        <span className="font-medium text-gray-700">Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Manage and track all customer orders from here.
          </p>
        </div>
        <button className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-150">
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Pendapatan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Pendapatan
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <ShoppingBag size={15} className="text-blue-500" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">Rp.45,280.00</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp size={12} />
            +12.5% vs last month
          </div>
        </div>

        {/* Pesanan Aktif */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pesanan Aktif
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <ShoppingBag size={15} className="text-emerald-500" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">124</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp size={12} />
            +3.2% from yesterday
          </div>
        </div>

        {/* Pengiriman Tertunda */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pengiriman Tertunda
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Truck size={15} className="text-red-400" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">18</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-red-500">
            <TrendingDown size={12} />
            -5.1% since Monday
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Tabs + Search */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 pt-5 pb-0 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`relative flex shrink-0 items-center gap-1.5 px-4 pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tabCount(tab.key)}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3 sm:mb-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search ID, customer..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full mb-2 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-5">
          <OrderTable
            data={paginated}
            page={page}
            limit={LIMIT}
            total={filtered.length}
            handlePageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}