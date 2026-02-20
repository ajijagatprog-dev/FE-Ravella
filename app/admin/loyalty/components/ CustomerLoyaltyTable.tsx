"use client";

import { useState } from "react";

const customers = [
  { name: "Adrienne Laurent", tier: "Platinum", points: 4820 },
  { name: "Julian Black", tier: "Gold", points: 1450 },
  { name: "Elena Martinez", tier: "Basic", points: 280 },
];

// ─── Per-tier visual config ───────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { pill: string; dot: string; max: number }> = {
  Platinum: {
    pill: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500",
    max: 5000,
  },
  Gold: {
    pill: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    max: 2000,
  },
  Basic: {
    pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
    max: 500,
  },
};

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ name, tier }: { name: string; tier: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const color =
    tier === "Platinum" ? "bg-blue-100 text-blue-700" :
    tier === "Gold"     ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600";
  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

export default function CustomerLoyaltyTable() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
            {filtered.length} customers found
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
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tr-lg">
                Total Points
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-10 text-center text-slate-400 text-sm">
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((customer, index) => {
                const cfg = TIER_CONFIG[customer.tier] ?? TIER_CONFIG["Basic"];
                const pct = Math.min((customer.points / cfg.max) * 100, 100);

                return (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">

                    {/* Customer */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={customer.name} tier={customer.tier} />
                        <span className="font-medium text-gray-900">{customer.name}</span>
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
                      <div className="space-y-1.5">
                        <span className="font-semibold text-gray-900 tabular-nums">
                          {customer.points.toLocaleString()}
                          <span className="text-xs font-normal text-slate-400 ml-1">pts</span>
                        </span>
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.dot}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
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