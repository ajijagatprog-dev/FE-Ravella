"use client";

import { CheckCircle2, Clock, Minus } from "lucide-react";
import { formatRp } from "../types";

interface StatsCardsProps {
  totalPaid: number;
  totalPending: number;
  pendingCount: number;
}

export default function StatsCards({ totalPaid, totalPending, pendingCount }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Total Paid */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Dibayar (YTD)
          </p>
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={14} className="text-green-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800">{formatRp(totalPaid)}</p>
        <p className="text-xs text-green-500 font-medium mt-1.5">
          +12.5%{" "}
          <span className="text-gray-400 font-normal">vs kuartal lalu</span>
        </p>
      </div>

      {/* Pending Settlement */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Pending Settlement
          </p>
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock size={14} className="text-amber-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-800">{formatRp(totalPending)}</p>
        <p className="text-xs mt-1.5">
          <span className="text-amber-500 font-medium">{pendingCount} Invoice</span>{" "}
          <span className="text-gray-400">jatuh tempo 5 hari lagi</span>
        </p>
      </div>
    </div>
  );
}