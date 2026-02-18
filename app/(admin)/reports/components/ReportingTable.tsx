"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpDown,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface ReportingTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  page?: number;
  limit?: number;
  total?: number;
  handlePageChange?: (page: number) => void;
  handleLimitChange?: (limit: number) => void;
  emptyMessage?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  return key.split(".").reduce((acc: unknown, k) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
}

// ── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ReportingTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  page = 1,
  limit = 10,
  total = 0,
  handlePageChange,
  handleLimitChange,
  emptyMessage = "No data available.",
}: ReportingTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = getNestedValue(a, sortKey);
    const bv = getNestedValue(b, sortKey);
    if (av === bv) return 0;
    const cmp = String(av) < String(bv) ? -1 : 1;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 select-none ${col.className ?? ""} ${col.sortable ? "cursor-pointer hover:text-gray-800 transition-colors" : ""}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <ArrowUpDown
                        size={12}
                        className={
                          sortKey === col.key
                            ? "text-blue-500"
                            : "text-gray-400"
                        }
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: limit > 5 ? 5 : limit }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-100"
                >
                  {columns.map((col) => {
                    const value = getNestedValue(row, col.key);
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-gray-700 ${col.className ?? ""}`}
                      >
                        {col.render
                          ? col.render(value, row)
                          : String(value ?? "-")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: rows per page + pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
        {/* Left: count + rows-per-page */}
        <div className="flex items-center gap-3">
          <span>
            {total === 0
              ? "No results"
              : `Showing ${startItem}–${endItem} of ${total}`}
          </span>
          {handleLimitChange && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs">Rows:</span>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: page navigation */}
        {handlePageChange && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-md border border-gray-200 bg-white p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(Number(p))}
                  className={`min-w-[30px] rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                    page === p
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="rounded-md border border-gray-200 bg-white p-1.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Utility render helpers (exported for reuse in page) ───────────────────────

export function TrendBadge({ value }: { value: string }) {
  const isUp = value.startsWith("+");
  const isDown = value.startsWith("-");
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isUp ? "text-emerald-600" : isDown ? "text-red-500" : "text-gray-500"
      }`}
    >
      {isUp ? (
        <TrendingUp size={12} />
      ) : isDown ? (
        <TrendingDown size={12} />
      ) : (
        <Minus size={12} />
      )}
      {value}
    </span>
  );
}

export function StockBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Low Stock": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "Out of Stock": "bg-red-50 text-red-600 ring-1 ring-red-200",
  };
  const base = Object.keys(styles).find((k) => label.startsWith(k)) ?? "";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[base] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
}
