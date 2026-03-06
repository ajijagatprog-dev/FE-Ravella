"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

// ─── Per-tier visual config ───────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { pill: string; dot: string }> = {
  PLATINUM: {
    pill: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
  },
  GOLD: {
    pill: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  BASIC: {
    pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  },
};

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ name, tier }: { name: string; tier: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const color =
    tier === "PLATINUM" ? "bg-blue-100 text-blue-700" :
      tier === "GOLD" ? "bg-amber-100 text-amber-700" :
        "bg-slate-100 text-slate-600";
  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

interface LoyaltyCustomer {
  id: number;
  name: string;
  email: string;
  tier: string;
  points: number;
  total_spent: number;
  total_orders: number;
  member_since: string;
}

export default function CustomerLoyaltyTable() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/loyalty')
      .then(res => {
        if (res.data.status === 'success') {
          setCustomers(res.data.data.customers);
        }
      })
      .catch(err => console.error("Failed to load loyalty data", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Loyalty Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? "Loading..." : `${filtered.length} customers found`}
          </p>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full sm:w-52"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tl-lg">
                Customer
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tier
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Points
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tr-lg">
                Orders
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Loading loyalty data...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-slate-400 text-sm">
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((customer) => {
                const cfg = TIER_CONFIG[customer.tier] ?? TIER_CONFIG["BASIC"];

                return (
                  <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={customer.name} tier={customer.tier} />
                        <div>
                          <span className="font-medium text-gray-900">{customer.name}</span>
                          <p className="text-xs text-slate-400">{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {customer.tier}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="px-3 py-3">
                      <span className="font-semibold text-gray-900 tabular-nums">
                        {customer.points.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400 ml-1">pts</span>
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-3 py-3">
                      <span className="text-sm font-medium text-gray-800">
                        Rp {customer.total_spent.toLocaleString('id-ID')}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="px-3 py-3">
                      <span className="text-sm text-gray-700">{customer.total_orders}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}