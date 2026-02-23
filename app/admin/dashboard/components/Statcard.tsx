"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon?: ReactNode;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  iconBg = "bg-blue-50",
}: StatCardProps) {
  const isUp = trend === "up";

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
        )}
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isUp
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-500 bg-red-50"
          }`}
        >
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}