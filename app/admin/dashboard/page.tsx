"use client";

import { useState, useEffect } from "react";
import {
  Download,
  ChevronRight,
  ShoppingBag,
  Users,
  Zap,
  Package,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import StatCard from "./components/Statcard";
import RecentOrders from "./components/RecentOrders";
import PendapatanChart from "./components/PendapatanChart";
import api from "@/lib/axios";
import { downloadFile } from "@/lib/download";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  stats: {
    total_revenue: number;
    success_revenue: number;
    cancelled_revenue: number;
    total_orders: number;
    total_users: number;
    pending_orders: number;
    processing_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    success_rate: number;
    low_stock: number;
    out_of_stock: number;
  };
  chart: {
    daily: { label: string; value: number }[];
    weekly: { label: string; value: number }[];
    summary: {
      total: number;
      avg_daily: number;
      peak: { label: string; value: number };
    };
  };
  recent_orders: {
    order_number: string;
    customer: string;
    total: number;
    status: string;
    time_ago: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [loadingTraffic, setLoadingTraffic] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchDashboard = (from: string = "", to: string = "") => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (from) params.date_from = from;
    if (to) params.date_to = to;

    api
      .get("/admin/dashboard", { params })
      .then((res) => {
        if (res.data.status === "success") {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load dashboard", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard(dateFrom, dateTo);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    // Fetch Traffic (once on mount)
    api
      .get("/admin/reports/traffic", { params: { period: "last_30" } })
      .then((res) => {
        if (res.data.status === "success") {
          setTrafficData(res.data.data.traffic || []);
        }
      })
      .catch((err) => console.error("Failed to load traffic data", err))
      .finally(() => setLoadingTraffic(false));
  }, []);

  const formatRp = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">
            Admin
          </span>
          <ChevronRight size={13} />
          <span className="font-medium text-blue-600">Dashboard Overview</span>
        </nav>
        <div className="flex items-center justify-center py-32 gap-2 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="text-center py-20 text-slate-400">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 relative">
      {/* Loading Overlay for Background Reloads */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-2xl">
          <div className="bg-white/80 px-4 py-2.5 rounded-xl border border-gray-100 shadow-md flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            Memperbarui data...
          </div>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <nav className="nav-breadcrumb flex items-center gap-1.5 text-sm text-gray-400">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">
          Admin
        </span>
        <ChevronRight size={13} />
        <span className="font-medium text-blue-600">Dashboard Overview</span>
      </nav>

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Ravelle Admin. Here&apos;s what&apos;s happening
            today.
          </p>
        </div>
        <div className="flex items-center gap-2 w-fit">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 shadow-sm">
            <span className="text-gray-400 text-xs">📅</span>
            {today}
          </div>
          <button
            onClick={async () => {
              try {
                let exportUrl = "/admin/export/orders";
                const params = new URLSearchParams();
                if (dateFrom) params.append("date_from", dateFrom);
                if (dateTo) params.append("date_to", dateTo);
                const queryString = params.toString();
                if (queryString) {
                  exportUrl += `?${queryString}`;
                }
                await downloadFile(
                  exportUrl,
                  "dashboard_report.xlsx",
                );
                toast.success("Report exported successfully");
              } catch (error) {
                toast.error("Failed to export report");
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all duration-150"
          >
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Date Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
          Filter Tanggal
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 shrink-0">Dari</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 shrink-0">Sampai</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <X size={12} />
              Reset
            </button>
          )}
          {dateFrom && dateTo && (
            <span className="text-[11px] text-blue-500 font-medium">
              Menampilkan data{" "}
              {new Date(dateFrom).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              –{" "}
              {new Date(dateTo).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Penjualan"
          value={formatRp(data.stats.total_revenue)}
          change={`${data.stats.delivered_orders} delivered, ${data.stats.pending_orders} pending`}
          trend="up"
          icon={<ShoppingBag size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Penjualan Sukses"
          value={formatRp(data.stats.success_revenue)}
          change={`${data.stats.success_rate}% success rate`}
          trend="up"
          icon={<Package size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Penjualan Batal"
          value={formatRp(data.stats.cancelled_revenue)}
          change={
            data.stats.cancelled_orders > 0
              ? `${data.stats.cancelled_orders} orders dibatalkan`
              : `Tidak ada pembatalan`
          }
          trend={data.stats.cancelled_orders > 0 ? "down" : "up"}
          icon={<AlertTriangle size={18} className="text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* ── Stat Cards Row 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Pesanan"
          value={String(data.stats.total_orders)}
          change={`${data.stats.pending_orders} pesanan perlu diproses`}
          trend="up"
          icon={<Zap size={18} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Total Pengguna"
          value={String(data.stats.total_users)}
          change={`Customer & Mitra B2B`}
          trend="up"
          icon={<Users size={18} className="text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Stock Alert"
          value={String(data.stats.low_stock + data.stats.out_of_stock)}
          change={`${data.stats.out_of_stock} produk habis, ${data.stats.low_stock} menipis`}
          trend={
            data.stats.out_of_stock > 0 || data.stats.low_stock > 0
              ? "down"
              : "up"
          }
          icon={<AlertTriangle size={18} className="text-orange-500" />}
          iconBg="bg-orange-50"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PendapatanChart
            dailyData={data.chart.daily}
            weeklyData={data.chart.weekly}
            summary={data.chart.summary}
          />
        </div>
        <div>
          <RecentOrders orders={data.recent_orders} />
        </div>
      </div>

      {/* ── Traffic Chart Row ── */}
      {!loadingTraffic && trafficData.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Top 10 Laman Teraktif (Traffic)
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Visualisasi 10 halaman organik paling sering diakses (semua
                waktu)
              </p>
            </div>
            <div className="mt-2 sm:mt-0 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trafficData.slice(0, 10).map((d: any) => ({
                  name: d.human_readable_path || d.page_path,
                  views: parseInt(d.views || 0, 10),
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "8px 12px",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "11px",
                    marginBottom: "4px",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    color: "#10B981",
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Tayangan"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
