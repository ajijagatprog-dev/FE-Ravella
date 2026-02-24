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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Paid */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
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

      {/* Available Credit */}
      <div className="bg-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Kredit Tersedia
          </p>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Minus size={14} className="text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold">Rp 50.000.000</p>
        <div className="mt-3">
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <div className="bg-white rounded-full h-1.5" style={{ width: "65%" }} />
          </div>
          <p className="text-xs text-blue-200 mt-1.5 text-right">65% terpakai</p>
        </div>
      </div>
    </div>
  );
}