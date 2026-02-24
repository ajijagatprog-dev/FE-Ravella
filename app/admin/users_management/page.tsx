// app/user-managements/page.tsx
// ✅ Server Component — TIDAK pakai "use client"

import { Users, UserPlus, Download, ShieldCheck } from "lucide-react";
import UserManagementClient from "./components/UserManagementClient";

export const metadata = {
  title: "User Management | Ravelle Fashion Admin",
  description: "Manage retail customers and B2B partners",
};

export default async function UsersManagementPage() {
  // Simulasi fetch data jika nanti dibutuhkan:
  // const stats = await fetchStats();

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
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm">
            <Download size={18} className="text-slate-400" />
            Export Database
          </button>

          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100 group">
            <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
            Create New Account
          </button>
        </div>
      </div>

      {/* ── Visual Separator ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── Client Component: Stats + Tabs + Table ── */}
      {/* Tempat UserManagementClient merender statistik (Cards), 
          Filter Tabs (Retail vs B2B), dan Tabel utama.
      */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <UserManagementClient />
      </div>
      
    </div>
  );
}