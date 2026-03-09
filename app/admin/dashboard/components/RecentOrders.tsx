"use client";

import { ShoppingBag, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

interface Order {
  order_number: string;
  customer: string;
  total: number;
  status: string;
  time_ago: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  DELIVERED: { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600" },
  PENDING: { icon: Clock, bg: "bg-amber-100", color: "text-amber-600" },
  PROCESSING: { icon: Clock, bg: "bg-blue-100", color: "text-blue-600" },
  SHIPPED: { icon: Truck, bg: "bg-cyan-100", color: "text-cyan-600" },
  CANCELLED: { icon: XCircle, bg: "bg-red-100", color: "text-red-500" },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Pesanan Terbaru</h3>
        <span className="text-xs font-medium text-gray-400">{orders.length} orders</span>
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-4">
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No recent orders</p>
        ) : (
          orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING;
            const Icon = cfg.icon;
            return (
              <div
                key={order.order_number}
                className="flex items-start gap-3 group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={14} className={cfg.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      #{order.order_number}
                    </p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    {order.customer} • <span className="text-gray-900 font-semibold">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{order.time_ago}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}