"use client";

import { Suspense, useState } from "react";
import { Users, Download, ShieldCheck, X } from "lucide-react";
import UserManagementClient from "./components/UserManagementClient";
import { downloadFile } from "@/lib/download";
import toast from "react-hot-toast";

export default function UsersManagementPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      
      const queryStr = params.toString() ? `?${params.toString()}` : "";
      await downloadFile(`/admin/export/users${queryStr}`, `users_database_${dateFrom || 'all'}_to_${dateTo || 'all'}.xlsx`);
      toast.success("Database exported successfully");
    } catch (error) {
      toast.error("Failed to export database");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200">
              <Users size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                User Management
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Verified System</span>
              </div>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl mt-3 text-sm leading-relaxed">
            Manage your ecosystem of retail customers and B2B partners.
            Monitor activity, verify accounts, and handle partnership tiers seamlessly.
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm"
          >
            <Download size={18} className="text-slate-400" />
            Export Data
          </button>
        </div>
      </div>

      {/* ── Visual Separator ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── Calendar Date Range Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
          Filter Tanggal Pendaftaran
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 shrink-0">Dari</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 shrink-0">Sampai</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <X size={12} />
              Reset
            </button>
          )}
          {dateFrom && dateTo && (
            <span className="text-[11px] text-blue-500 font-medium">
              Menampilkan data {new Date(dateFrom).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} – {new Date(dateTo).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* ── Client Component: Stats + Tabs + Table ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading configuration...</div>}>
          <UserManagementClient dateFrom={dateFrom} dateTo={dateTo} />
        </Suspense>
      </div>

    </div>
  );
}