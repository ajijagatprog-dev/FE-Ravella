"use client";

import { useEffect, useState } from "react";
import StatCard from "./components/Statcard";
import RecentOrders from "./components/RecentOrders";
import { Download, TrendingUp, Calendar } from "lucide-react";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [animateChart, setAnimateChart] = useState(false);
  const [range, setRange] = useState<"week" | "month">("week");

  useEffect(() => {
    const t = setTimeout(() => setAnimateChart(true), 200);
    return () => clearTimeout(t);
  }, []);

  const chartData = [
    { height: 40, label: "Sen", value: "200k" },
    { height: 70, label: "Sel", value: "350k" },
    { height: 55, label: "Rab", value: "275k" },
    { height: 90, label: "Kam", value: "450k" },
    { height: 50, label: "Jum", value: "250k" },
    { height: 75, label: "Sab", value: "375k" },
    { height: 85, label: "Min", value: "425k" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Selamat datang kembali, Admin Ravelle 👋
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-primary transition-all">
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-primary transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Pendapatan Hari Ini"
          value="Rp 450.000"
          change="+12.5%"
          trend="up"
        />
        <StatCard title="Total Booking" value="24" change="+8.2%" trend="up" />
        <StatCard
          title="Customer Aktif"
          value="156"
          change="+5.1%"
          trend="up"
        />
        <StatCard
          title="Rating Rata-rata"
          value="4.8"
          change="+0.3"
          trend="up"
        />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ================= SALES CHART ================= */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Trend Pendapatan
              </h3>
              <p className="text-sm text-gray-500">
                {range === "week" ? "7 hari terakhir" : "30 hari terakhir"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
              <button
                onClick={() => setRange("week")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all
          ${
            range === "week"
              ? "bg-white text-primary shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
              >
                Week
              </button>
              <button
                onClick={() => setRange("month")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all
          ${
            range === "month"
              ? "bg-white text-primary shadow-md"
              : "text-gray-500 hover:text-gray-700"
          }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* ================= CHART ================= */}
          <div className="relative">
            {/* Y Axis */}
            <div className="absolute left-0 top-0 h-72 flex flex-col justify-between text-xs font-semibold text-gray-400 pr-3">
              {["500k", "400k", "300k", "200k", "100k", "0"].map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>

            {/* Grid */}
            <div className="absolute left-14 right-0 top-0 h-72 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-50 to-transparent"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="h-72 flex items-end gap-2 sm:gap-4 ml-14 relative z-10 bg-white pb-6">
              {chartData.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-4"
                >
                  <div className="relative w-full group cursor-pointer">
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-xs px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-20 min-w-max">
                      <div className="font-bold text-sm">Rp {day.value}</div>
                      <div className="text-[10px] text-gray-300 mt-0.5">
                        {day.label}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900" />
                    </div>

                    {/* Value on top of bar */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100">
                        {day.value}
                      </span>
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-2xl transition-all duration-700 ease-out relative overflow-hidden
                group-hover:scale-105
                ${
                  i === 3
                    ? "bg-gradient-to-t from-primary via-primary/90 to-primary/70 shadow-xl shadow-primary/40"
                    : "bg-gradient-to-t from-blue-300 via-blue-200 to-blue-100 hover:from-blue-400 hover:via-blue-300 hover:to-blue-200"
                }`}
                      style={{
                        height: animateChart ? `${day.height}%` : "0%",
                      }}
                    >
                      {/* Shimmer effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
                        style={{
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s infinite",
                        }}
                      />

                      {/* Glow effect for highest bar */}
                      {i === 3 && (
                        <div className="absolute inset-0 rounded-t-2xl bg-primary/30 blur-2xl opacity-70 -z-10 animate-pulse" />
                      )}

                      {/* Top highlight */}
                      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl" />
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent ml-14 mt-1" />
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 mt-6">
            <div className="relative p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg hover:scale-[1.03] transition-all duration-300 border border-gray-200 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">💰</span>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Total
                  </p>
                </div>
                <p className="text-2xl font-black text-gray-900 mb-1">
                  Rp 2.3jt
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    ↑ 12.5%
                  </span>
                  <span className="text-xs text-gray-400">vs last period</span>
                </div>
              </div>
            </div>

            <div className="relative p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg hover:scale-[1.03] transition-all duration-300 border border-gray-200 overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📊</span>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Rata-rata
                  </p>
                </div>
                <p className="text-2xl font-black text-gray-900 mb-1">
                  Rp 330k
                </p>
                <p className="text-xs text-gray-500 font-medium">per hari</p>
              </div>
            </div>

            <div className="relative p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:scale-[1.03] transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-tl-full" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-primary text-lg">🏆</span>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                    Tertinggi
                  </p>
                </div>
                <p className="text-2xl font-black text-gray-900 mb-1">
                  Rp 450k
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-medium">
                    Kamis
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}</style>
        </div>

        {/* ================= ACTIVITY ================= */}
        <RecentOrders />
      </div>
    </div>
  );
}
