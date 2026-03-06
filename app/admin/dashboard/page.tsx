"use client";

import { useState, useEffect } from "react";
import { Download, ChevronRight, ShoppingBag, Users, Zap, Package, AlertTriangle, Loader2 } from "lucide-react";
import StatCard from "./components/Statcard";
import RecentOrders from "./components/RecentOrders";
import PendapatanChart from "./components/PendapatanChart";
import api from "@/lib/axios";

interface DashboardData {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    pending_orders: number;
    processing_orders: number;
    delivered_orders: number;
    low_stock: number;
    out_of_stock: number;
  };
  chart: {
    daily: { label: string; value: number }[];
    weekly: { label: string; value: number }[];
    summary: { total: number; avg_daily: number; peak: { label: string; value: number } };
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

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        if (res.data.status === 'success') {
          setData(res.data.data);
        }
      })
      .catch(err => console.error("Failed to load dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="flex items-center justify-center py-20 gap-2 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div className="text-center py-20 text-slate-400">Failed to load dashboard data</div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Admin</span>
        <ChevronRight size={13} />
        <span className="font-medium text-blue-600">Dashboard Overview</span>
      </nav>

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Ravelle Admin. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 w-fit">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 shadow-sm">
            <span className="text-gray-400 text-xs">📅</span>
            {today}
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all duration-150">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Penjualan"
          value={formatRp(data.stats.total_revenue)}
          change={`${data.stats.delivered_orders} delivered`}
          trend="up"
          icon={<ShoppingBag size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Pesanan"
          value={String(data.stats.total_orders)}
          change={`${data.stats.pending_orders} pending`}
          trend="up"
          icon={<Zap size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Total Pengguna"
          value={String(data.stats.total_users)}
          change={`Customer & B2B`}
          trend="up"
          icon={<Users size={18} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Stock Alert"
          value={String(data.stats.low_stock + data.stats.out_of_stock)}
          change={`${data.stats.out_of_stock} out of stock`}
          trend={data.stats.out_of_stock > 0 ? "down" : "up"}
          icon={<AlertTriangle size={18} className="text-red-500" />}
          iconBg="bg-red-50"
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

      {/* ── Help Banner ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-base">
            ?
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Need help with the new B2B management tool?
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Check out our internal documentation or contact technical support.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Read Docs
          </button>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}