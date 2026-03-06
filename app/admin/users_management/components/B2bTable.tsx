"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface B2bTableProps {
  data: any[];
  columns: any[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  onUserAction?: (userId: number, action: string) => void;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; pill: string; label: string }> = {
    active: {
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      label: "Active",
    },
    inactive: {
      dot: "bg-slate-400",
      pill: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      label: "Inactive",
    },
    "pending review": {
      dot: "bg-amber-400",
      pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      label: "Pending Review",
    },
  };
  const key = status?.toLowerCase() ?? "inactive";
  const cfg = map[key] ?? map["inactive"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const isB2B = type?.toUpperCase() === "B2B PARTNER" || type?.toUpperCase() === "B2B";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${isB2B
          ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
          : "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
        }`}
    >
      {isB2B ? "B2B Partner" : "Retail"}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, isB2B }: { name: string; isB2B: boolean }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${isB2B
          ? "bg-blue-100 text-blue-700"
          : "bg-violet-100 text-violet-700"
        }`}
    >
      {initials}
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────
function ActionButtons({ row, onAction }: { row: any; onAction?: (userId: number, action: string) => void }) {
  const status = row.status?.toLowerCase();
  const type = row.type?.toUpperCase();

  if (type === "B2B PARTNER" || type === "B2B") {
    if (status === "active") {
      return (
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Transactions
          </button>
          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Details
          </button>
        </div>
      );
    }
    if (status === "pending review") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onAction?.(row.id, 'approve')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Verify Now
          </button>
          <button
            onClick={() => onAction?.(row.id, 'reject')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onAction?.(row.id, 'approve')}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Re-activate
        </button>
      </div>
    );
  }

  // Retail — always active
  return (
    <div className="flex gap-2">
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Activity
      </button>
      <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
        Details
      </button>
    </div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  page,
  total,
  limit,
  handlePageChange,
}: {
  page: number;
  total: number;
  limit: number;
  handlePageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100">
      <span className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}–{end}</span> of{" "}
        <span className="font-medium text-slate-700">{total.toLocaleString()}</span> users
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function B2bTable({
  data,
  columns,
  isLoading,
  page,
  limit,
  total,
  handlePageChange,
  handleLimitChange,
  onUserAction,
}: B2bTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  // Filter locally (or remove if server-side)
  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      row.name?.toLowerCase().includes(q) ||
      row.company?.toLowerCase().includes(q) ||
      row.email?.toLowerCase().includes(q) ||
      row.taxId?.toLowerCase().includes(q);
    const matchType =
      typeFilter === "all" ||
      row.type?.toLowerCase().replace(" ", "") === typeFilter;
    const matchStatus =
      statusFilter === "all" ||
      row.status?.toLowerCase() === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-slate-100">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email, or tax ID..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Type: All</option>
            <option value="b2bpartner">B2B Partner</option>
            <option value="retail">Retail</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending review">Pending</option>
          </select>

          {/* Rows per page */}
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="pl-3 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table (desktop) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User / Business</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Transaction</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-medium text-slate-500">No users found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => {
                const isB2B = row.type?.toUpperCase().includes("B2B");
                return (
                  <tr
                    key={row.id ?? idx}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* User / Business */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.name ?? row.company ?? "?"} isB2B={isB2B} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{row.name ?? row.company}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {row.email ?? row.taxId ?? row.npwp}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <TypeBadge type={row.type} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Last Transaction */}
                    <td className="px-4 py-3.5">
                      {row.lastTransaction ? (
                        <div>
                          <p className="font-semibold text-slate-700">{row.lastTransaction.amount}</p>
                          <p className="text-xs text-slate-400">{row.lastTransaction.date}</p>
                        </div>
                      ) : (
                        <span className="text-xs italic text-slate-400">No transactions yet</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end">
                        <ActionButtons row={row} onAction={onUserAction} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Card view (mobile) ── */}
      <div className="md:hidden divide-y divide-slate-100">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-slate-200 rounded-lg" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No users found</div>
        ) : (
          filtered.map((row, idx) => {
            const isB2B = row.type?.toUpperCase().includes("B2B");
            return (
              <div key={row.id ?? idx} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={row.name ?? row.company ?? "?"} isB2B={isB2B} />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{row.name ?? row.company}</p>
                      <p className="text-xs text-slate-400 truncate">{row.email ?? row.taxId ?? row.npwp}</p>
                    </div>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <TypeBadge type={row.type} />
                  {row.lastTransaction ? (
                    <div className="text-right">
                      <p className="font-semibold text-slate-700 text-xs">{row.lastTransaction.amount}</p>
                      <p className="text-xs text-slate-400">{row.lastTransaction.date}</p>
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-400">No transactions yet</span>
                  )}
                </div>

                <ActionButtons row={row} onAction={onUserAction} />
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination page={page} total={total} limit={limit} handlePageChange={handlePageChange} />
    </div>
  );
}