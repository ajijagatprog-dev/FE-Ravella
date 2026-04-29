"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface PendapatanChartProps {
  dailyData: ChartDataPoint[];
  weeklyData: ChartDataPoint[];
  summary: {
    total: number;
    avg_daily: number;
    peak: { label: string; value: number };
  };
}

const CHART_H = 220;

function formatRp(val: number): string {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
  if (val >= 1000) return `Rp ${Math.round(val / 1000)}k`;
  return `Rp ${val.toLocaleString("id-ID")}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-[10px] font-semibold px-3 py-2 rounded-lg shadow-xl border border-gray-800">
        <p className="mb-0.5 text-gray-400">{label}</p>
        <p className="text-blue-400 text-xs">{formatRp(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function PendapatanChart({
  dailyData,
  weeklyData,
  summary,
}: PendapatanChartProps) {
  const [range, setRange] = useState<"week" | "month">("week");
  const [mounted, setMounted] = useState(false);

  const rawData = range === "week" ? dailyData : weeklyData;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: CHART_H + 200 }} />;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-base font-bold text-gray-900">Trafik Penjualan</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Total Ringkasan Penjualan {range === "week" ? "7 hari" : "30 hari"}
          </p>
        </div>
        <button
          onClick={() => setRange((r) => (r === "week" ? "month" : "week"))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {range === "week" ? "Weekly View" : "Monthly View"}
          <ChevronDown size={12} />
        </button>
      </div>

      {/* ── Line/Area Chart ── */}
      <div className="w-full" style={{ height: CHART_H }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={rawData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickFormatter={(val) => (val >= 1000000 ? `${val / 1000000}jt` : val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-10" />
      <div className="h-px bg-gray-100 mb-6" />

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            emoji: "💰",
            label: "TOTAL",
            value: formatRp(summary.total),
            sub: "periode ini",
            subColor: "text-emerald-600",
          },
          {
            emoji: "📊",
            label: "RATA-RATA",
            value: formatRp(summary.avg_daily),
            sub: "per hari",
            subColor: "text-gray-400",
          },
          {
            emoji: "🏆",
            label: "TERTINGGI",
            value: formatRp(summary.peak.value),
            sub: summary.peak.label,
            subColor: "text-blue-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
          >
            <span className="text-base">{s.emoji}</span>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {s.label}
            </p>
            <p className="text-sm font-bold text-gray-900">{s.value}</p>
            <p className={`text-[10px] font-medium ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}