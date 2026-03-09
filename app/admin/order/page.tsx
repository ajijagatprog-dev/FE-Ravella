"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, Search, TrendingUp, TrendingDown, ShoppingBag, Truck } from "lucide-react";
import { OrderTable, Order } from "./components/OrderTable";

import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type TabStatus = "all" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const TABS: { key: TabStatus; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "PENDING", label: "Pending" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

const LIMIT = 5;

// ── Page ──────────────────────────────────────────────────────────────────────

interface OrderStats {
  total_revenue: number;
  revenue_trend: number;
  active_orders: number;
  active_trend: number;
  pending_shipments: number;
  pending_trend: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/orders/stats');
      if (res.data.status === 'success') {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders');
        if (res.data.status === 'success') {
          const formatted: Order[] = res.data.data.map((o: any) => ({
            id: o.order_number,
            customer: {
              name: o.user.name,
              initials: o.user.name.substring(0, 2).toUpperCase(),
              avatarColor: "#8B5CF6"
            },
            date: new Date(o.created_at).toLocaleDateString("id-ID", {
              year: "numeric", month: "short", day: "numeric"
            }),
            status: o.status,
            total: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(o.total_amount),
            rawOrder: o
          }));
          setOrders(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    fetchStats();
  }, []);

  const filtered = useMemo(() => {
    let result = orders;
    if (activeTab !== "all") result = result.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) => o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, activeTab, search]);

  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const tabCount = (key: TabStatus) =>
    key === "all" ? orders.length : orders.filter((o) => o.status === key).length;

  const handleTabChange = (key: TabStatus) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleUpdateStatus = async (orderNumber: string, status: string) => {
    try {
      const res = await api.put(`/admin/orders/${orderNumber}/status`, { status });
      if (res.data.status === 'success') {
        setOrders(prev => prev.map(o => o.id === orderNumber ? { ...o, status: res.data.data.status as any } : o));
        fetchStats(); // Refresh stats after status change
        toast.success("Order status updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status. Please try again.");
    }
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
          {statsLoading ? (
            <div className="mt-3 h-8 w-36 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {formatCurrency(stats?.total_revenue ?? 0)}
            </p>
          )}
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${(stats?.revenue_trend ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {(stats?.revenue_trend ?? 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {(stats?.revenue_trend ?? 0) >= 0 ? "+" : ""}{stats?.revenue_trend ?? 0}% vs last month
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
          {statsLoading ? (
            <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-gray-900">{stats?.active_orders ?? 0}</p>
          )}
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${(stats?.active_trend ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {(stats?.active_trend ?? 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {(stats?.active_trend ?? 0) >= 0 ? "+" : ""}{stats?.active_trend ?? 0}% from yesterday
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
          {statsLoading ? (
            <div className="mt-3 h-8 w-12 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <p className="mt-3 text-2xl font-bold text-gray-900">{stats?.pending_shipments ?? 0}</p>
          )}
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${(stats?.pending_trend ?? 0) <= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {(stats?.pending_trend ?? 0) <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            {(stats?.pending_trend ?? 0) >= 0 ? "+" : ""}{stats?.pending_trend ?? 0}% since last week
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
                className={`relative flex shrink-0 items-center gap-1.5 px-4 pb-3 text-sm font-medium transition-colors ${activeTab === tab.key
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-blue-500"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${activeTab === tab.key
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
            isLoading={loading}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
}