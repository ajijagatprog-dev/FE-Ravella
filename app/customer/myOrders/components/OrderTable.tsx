"use client";

import { Eye, FileText, Package } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { type Order } from "./OrderCard";
import { cn } from "@/lib/utils";

interface OrderTableProps {
  orders: any[];
  onOrderDetail: (id: string) => void;
  onViewInvoice: (id: string) => void;
}

export default function OrderTable({ orders, onOrderDetail, onViewInvoice }: OrderTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50/50">
            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">No. Pesanan</th>
            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">Tanggal</th>
            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">Total</th>
            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">Status</th>
            <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-stone-400 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-stone-400">
                <div className="flex flex-col items-center justify-center">
                   <Package className="w-10 h-10 mb-2 opacity-20" />
                   <p className="text-sm font-medium">Belum ada pesanan ditemukan.</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const formattedDate = new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return (
                <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-stone-800 tracking-tight">#{order.order_number}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-stone-500 font-medium">{formattedDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-black text-stone-900">
                      Rp {parseFloat(order.total_amount).toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status?.toUpperCase() || "PENDING"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button
                        onClick={() => onViewInvoice(order.id.toString())}
                        className="p-2 text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200 rounded-lg transition-all"
                        title="Lihat Invoice"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => onOrderDetail(order.id.toString())}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all active:scale-95"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
