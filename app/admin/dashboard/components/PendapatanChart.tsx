"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

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

const CHART_H = 180;

function formatRp(val: number): string {
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
  if (val >= 1000) return `Rp ${Math.round(val / 1000)}k`;
  return `Rp ${val.toLocaleString('id-ID')}`;
}

export default function PendapatanChart({ dailyData, weeklyData, summary }: PendapatanChartProps) {
  const [animate, setAnimate] = useState(false);
  const [range, setRange] = useState<"week" | "month">("week");

  const rawData = range === "week" ? dailyData : weeklyData;

  // Normalize data to percentage of max for bar heights
  const maxVal = Math.max(...rawData.map(d => d.value), 1);
  const chartData = rawData.map(d => ({
    ...d,
    height: Math.max(5, Math.round((d.value / maxVal) * 100)),
  }));

  const peakIdx = chartData.reduce(
    (mi, d, i, arr) => (d.height > arr[mi].height ? i : mi),
    0
  );

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [range]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
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

      {/* ── Bar Chart ── */}
      <div className="flex gap-2 sm:gap-3 items-end" style={{ height: CHART_H }}>
        {chartData.map((d, i) => {
          const barPx = Math.round((d.height / 100) * CHART_H);
          const isPeak = i === peakIdx;

          return (
            <div
              key={`${range}-${i}`}
              className="relative flex-1 flex flex-col items-center justify-end group"
              style={{ height: CHART_H }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                {formatRp(d.value)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t-xl transition-all duration-700 ease-out ${isPeak
                    ? "bg-blue-600 shadow-lg shadow-blue-200"
                    : "bg-blue-100 group-hover:bg-blue-200"
                  }`}
                style={{
                  height: animate ? barPx : 0,
                  transitionDelay: `${i * 60}ms`,
                }}
              />

              {/* Label */}
              <span
                className={`absolute -bottom-6 text-[11px] font-semibold transition-colors ${isPeak ? "text-blue-600" : "text-gray-400"
                  }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-8" />
      <div className="h-px bg-gray-100 mb-5" />

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