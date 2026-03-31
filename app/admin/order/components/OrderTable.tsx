"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

export interface Order {
  id: string;
  customer: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  date: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: string;
  rawOrder: any;
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

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  PROCESSING: <RefreshCw size={14} />,
  SHIPPED: <Truck size={14} />,
  DELIVERED: <CheckCircle size={14} />,
  CANCELLED: <XCircle size={14} />,
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_MENU_STYLES: Record<string, { iconBg: string; iconText: string; hover: string; hoverText: string }> = {
  PENDING: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
    hover: "hover:bg-amber-50",
    hoverText: "hover:text-amber-700",
  },
  PROCESSING: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-500",
    hover: "hover:bg-blue-50",
    hoverText: "hover:text-blue-700",
  },
  SHIPPED: {
    iconBg: "bg-purple-50",
    iconText: "text-purple-500",
    hover: "hover:bg-purple-50",
    hoverText: "hover:text-purple-700",
  },
  DELIVERED: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-500",
    hover: "hover:bg-emerald-50",
    hoverText: "hover:text-emerald-700",
  },
  CANCELLED: {
    iconBg: "bg-red-50",
    iconText: "text-red-500",
    hover: "hover:bg-red-50",
    hoverText: "hover:text-red-600",
  },
};

// ── Dropdown Portal ─────────────────────────────────────────────────────────

function DropdownPortal({
  anchorRef,
  onClose,
  children,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; openUp: boolean } | null>(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const menuHeight = 280; // estimated max height
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

    setPos({
      top: openUp ? rect.top : rect.bottom + 4,
      left: rect.right - 208, // w-52 = 208px, align right edge
      openUp,
    });
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!pos) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] w-52 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
      style={{
        top: pos.openUp ? undefined : pos.top,
        bottom: pos.openUp ? window.innerHeight - pos.top + 4 : undefined,
        left: Math.max(8, pos.left),
        animation: "dropdownIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// ── Row Menu ────────────────────────────────────────────────────────────────

function RowMenu({
  orderId,
  currentStatus,
  onUpdateStatus,
}: {
  orderId: string;
  currentStatus: string;
  onUpdateStatus?: (id: string, st: string) => void;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 outline-none ${open ? "bg-blue-50 text-blue-600 shadow-sm" : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <DropdownPortal anchorRef={btnRef} onClose={close}>
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Update Status
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2 mb-1" />
          {(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(
            (st) =>
              st !== currentStatus && (
                <button
                  key={st}
                  disabled={!onUpdateStatus}
                  onClick={() => {
                    onUpdateStatus?.(orderId, st);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-150 text-left group ${STATUS_MENU_STYLES[st].hover} ${STATUS_MENU_STYLES[st].hoverText} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-lg ${STATUS_MENU_STYLES[st].iconBg} ${STATUS_MENU_STYLES[st].iconText} transition-transform duration-150 group-hover:scale-110`}
                  >
                    {STATUS_ICONS[st]}
                  </span>
                  <span className="leading-tight">Mark as {STATUS_LABELS[st]}</span>
                </button>
              )
          )}
        </DropdownPortal>
      )}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      ` }} />
    </>
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
              data.map((order, i) => (
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
                    <div className="flex flex-col gap-1 items-start">
                        <OrderStatusBadge status={order.status} />
                        {order.rawOrder?.tracking_number && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase tracking-widest mt-1">
                                {order.rawOrder.courier}: {order.rawOrder.tracking_number}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{order.total}</td>
                  <td className="px-4 py-4">
                    <RowMenu orderId={order.id} currentStatus={order.status} onUpdateStatus={onUpdateStatus} isLast={i >= (data.length > 2 ? data.length - 2 : data.length - 1)} />
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
          data.map((order, i) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-blue-500">#{order.id}</span>
                <RowMenu orderId={order.id} currentStatus={order.status} onUpdateStatus={onUpdateStatus} isLast={i >= data.length - 1} />
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
              {order.rawOrder?.tracking_number && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Resi Pengiriman</span>
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        {order.rawOrder.courier}: {order.rawOrder.tracking_number}
                    </span>
                </div>
              )}
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