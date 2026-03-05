"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Order {
  id: string; // Maps to order_number
  customer: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  date: string; // formatted date
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: string; // formatted total
  rawOrder: any; // Add raw order data for modals
}

interface OrderTableProps {
  data: Order[];
  isLoading?: boolean;
  page: number;
  limit: number;
  total: number;
  handlePageChange: (page: number) => void;
  onUpdateStatus?: (orderNumber: string, newStatus: string) => void;
}

// ── Order Status Badge ──────────────────────────────────────────────────────

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600 border border-amber-200",
    PROCESSING: "bg-blue-50 text-blue-600 border border-blue-200",
    SHIPPED: "bg-purple-50 text-purple-600 border border-purple-200",
    DELIVERED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    CANCELLED: "bg-red-50 text-red-500 border border-red-200",
  };
  const dotColors = {
    PENDING: "bg-amber-400",
    PROCESSING: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    DELIVERED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {status}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ── Row Action Menu ───────────────────────────────────────────────────────────

function RowMenu({ orderId, currentStatus, onUpdateStatus }: { orderId: string, currentStatus: string, onUpdateStatus?: (id: string, st: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 origin-top-right rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">Update Status</div>
          {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(st => (
            st !== currentStatus && (
              <button
                key={st}
                disabled={!onUpdateStatus}
                onClick={() => { onUpdateStatus?.(orderId, st); setOpen(false); }}
                className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
              >
                Mark as {st}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[60, 140, 80, 80, 70, 24].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded bg-gray-200" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function OrderTable({
  data,
  isLoading = false,
  page,
  limit,
  total,
  handlePageChange,
  onUpdateStatus,
}: OrderTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1, 2, 3];
    if (page > 4) pages.push("...");
    if (page > 3 && page < totalPages - 1) pages.push(page);
    pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {["Order ID", "Customer", "Date", "Payment Status", "Total", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-100">
                  <td className="px-4 py-4">
                    <span className="font-semibold text-blue-500 hover:underline cursor-pointer">
                      #{order.id}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={order.customer.initials} color={order.customer.avatarColor} />
                      <span className="font-medium text-gray-800">{order.customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{order.date}</td>
                  <td className="px-4 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{order.total}</td>
                  <td className="px-4 py-4">
                    <RowMenu orderId={order.id} currentStatus={order.status} onUpdateStatus={onUpdateStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No orders found.</p>
        ) : (
          data.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-blue-500">#{order.id}</span>
                <RowMenu orderId={order.id} currentStatus={order.status} onUpdateStatus={onUpdateStatus} />
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                <Avatar initials={order.customer.initials} color={order.customer.avatarColor} />
                <span className="font-medium text-gray-800">{order.customer.name}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400">Date</span>
                  <span className="text-gray-600">{order.date}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs text-gray-400">Status</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="font-semibold text-gray-900">{order.total}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
        <span>
          Showing {startItem} to {endItem} of {total} entries
        </span>
        {totalPages > 1 && (
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
                <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(Number(p))}
                  className={`min-w-[30px] rounded-md border px-2 py-1 text-xs font-medium transition-colors ${page === p
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              )
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