"use client";

import { X } from "lucide-react";
import { FilterStatus, FilterMethod } from "../types";

interface FilterDrawerProps {
  statusFilter: FilterStatus;
  setStatusFilter: (v: FilterStatus) => void;
  methodFilter: FilterMethod;
  setMethodFilter: (v: FilterMethod) => void;
  onClose: () => void;
  onReset: () => void;
}

export default function FilterDrawer({
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  onClose,
  onReset,
}: FilterDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Filter Transaksi</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Status Pembayaran
            </p>
            <div className="flex flex-wrap gap-2">
              {(["All", "Paid", "Pending"] as FilterStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === s
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {s === "All" ? "Semua" : s === "Paid" ? "Lunas" : "Pending"}
                </button>
              ))}
            </div>
          </div>

          {/* Method */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Metode Pembayaran
            </p>
            <div className="flex flex-wrap gap-2">
              {(["All", "QRIS", "VA"] as FilterMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethodFilter(m)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    methodFilter === m
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {m === "All" ? "Semua" : m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}