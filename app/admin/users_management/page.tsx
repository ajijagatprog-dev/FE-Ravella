"use client";

import { Users, Download, ShieldCheck } from "lucide-react";
import UserManagementClient from "./components/UserManagementClient";
import { downloadFile } from "@/lib/download";
import toast from "react-hot-toast";

export default function UsersManagementPage() {
  const handleExport = async () => {
    try {
      await downloadFile('/admin/export/users', 'users_database.xlsx');
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
            Export Database
          </button>
        </div>
      </div>

      {/* ── Visual Separator ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── Client Component: Stats + Tabs + Table ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <UserManagementClient />
      </div>

    </div>
  );
}