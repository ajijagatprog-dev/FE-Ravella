"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const weekData = [
  { height: 44, label: "Mon", value: "200k" },
  { height: 70, label: "Tue", value: "350k" },
  { height: 55, label: "Wed", value: "275k" },
  { height: 100, label: "Thu", value: "450k" },
  { height: 50, label: "Fri", value: "250k" },
  { height: 65, label: "Sat", value: "325k" },
  { height: 60, label: "Sun", value: "300k" },
];

const monthData = [
  { height: 48, label: "W1", value: "2.1jt" },
  { height: 62, label: "W2", value: "2.8jt" },
  { height: 100, label: "W3", value: "3.7jt" },
  { height: 75, label: "W4", value: "3.2jt" },
];

const CHART_H = 180; // fixed px height

export default function PendapatanChart() {
  const [animate, setAnimate] = useState(false);
  const [range, setRange] = useState<"week" | "month">("week");

  const chartData = range === "week" ? weekData : monthData;
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
      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Sales Trend</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Revenue analytics over the last{" "}
            {range === "week" ? "7 days" : "30 days"}
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

      {/* ── Bar Chart (fixed px height so bars always show) ── */}
      <div
        className="flex gap-2 sm:gap-3 items-end"
        style={{ height: CHART_H }}
      >
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
                Rp {d.value}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                  isPeak
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
                className={`absolute -bottom-6 text-[11px] font-semibold transition-colors ${
                  isPeak ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spacer for labels */}
      <div className="h-8" />

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-5" />

      {/* ── Summary cards ──────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            emoji: "💰",
            label: "TOTAL",
            value: "Rp 2.3jt",
            sub: "↑ 12.5% vs period lalu",
            subColor: "text-emerald-600",
          },
          {
            emoji: "📊",
            label: "RATA-RATA",
            value: "Rp 330k",
            sub: "per hari",
            subColor: "text-gray-400",
          },
          {
            emoji: "🏆",
            label: "TERTINGGI",
            value: "Rp 450k",
            sub: range === "week" ? "Kamis" : "Week 3",
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