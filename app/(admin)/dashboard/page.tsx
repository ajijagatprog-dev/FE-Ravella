"use client";

import { Download, ChevronRight, ShoppingBag, Users, Zap } from "lucide-react";
import StatCard from "./components/Statcard";
import RecentOrders from "./components/RecentOrders";
import PendapatanChart from "./components/PendapatanChart";

export default function DashboardPage() {
  const dateRange = "Oct 12 - Oct 19, 2023";

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Admin</span>
        <ChevronRight size={13} />
        <span className="font-medium text-blue-600">Dashboard Overview</span>
      </nav>

      {/* ── Header ─────────────────────────────────────────── */}
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
            {dateRange}
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all duration-150">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Today's Sales"
          value="$12,450.00"
          change="+12.5%"
          trend="up"
          icon={<ShoppingBag size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Orders"
          value="1,240"
          change="+8.2%"
          trend="up"
          icon={<Zap size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Active Users"
          value="450"
          change="-2.4%"
          trend="down"
          icon={<Users size={18} className="text-amber-600" />}
          iconBg="bg-amber-50"
        />
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart — spans 2 cols on xl */}
        <div className="xl:col-span-2">
          <PendapatanChart />
        </div>

        {/* Latest Activity */}
        <div>
          <RecentOrders />
        </div>
      </div>

      {/* ── Help Banner ────────────────────────────────────── */}
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