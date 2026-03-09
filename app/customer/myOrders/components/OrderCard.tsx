"use client";

import { Package, FileText, ArrowRight } from "lucide-react";
import OrderStatusBadge, { type OrderStatus } from "./OrderStatusBadge";
import { cn } from "@/lib/utils";

export interface Order {
    id: string;
    orderNumber: string;
    placedAt: string;
    totalAmount: number;
    status: OrderStatus;
    /** shown for SHIPPED / PROCESSING */
    estimatedDelivery?: string;
    /** shown for DELIVERED / CANCELLED */
    deliveryDate?: string;
}

const iconBg: Record<OrderStatus, string> = {
    PENDING: "bg-gray-100",
    SHIPPED: "bg-blue-100",
    DELIVERED: "bg-emerald-100",
    PROCESSING: "bg-amber-100",
    CANCELLED: "bg-stone-100",
};

const iconColor: Record<OrderStatus, string> = {
    PENDING: "text-gray-500",
    SHIPPED: "text-blue-500",
    DELIVERED: "text-emerald-500",
    PROCESSING: "text-amber-500",
    CANCELLED: "text-stone-400",
};

const deliveryLabel: Record<OrderStatus, string> = {
    PENDING: "Est. Shipping",
    SHIPPED: "Est. Delivery",
    DELIVERED: "Delivered On",
    PROCESSING: "Est. Shipping",
    CANCELLED: "Status Date",
};

export default function OrderCard({
    order,
    onOrderDetail,
}: {
    order: Order;
    onOrderDetail?: (id: string) => void;
}) {
    const isCancelled = order.status === "CANCELLED";
    const deliveryValue = order.estimatedDelivery ?? order.deliveryDate ?? "—";

    return (
        <div
            className={cn(
                "group flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-2xl border px-5 py-4 transition-all duration-200",
                isCancelled
                    ? "border-stone-200 opacity-60"
                    : "border-stone-200 hover:border-blue-200 hover:shadow-[0_2px_16px_rgba(59,130,246,0.08)]"
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                    iconBg[order.status]
                )}
            >
                <Package className={cn("w-5 h-5", iconColor[order.status])} />
            </div>

            {/* Order info */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-stone-800">
                        Order {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-stone-400">Placed on {order.placedAt}</p>
            </div>

            {/* Total */}
            <div className="hidden md:block text-right flex-shrink-0 w-32">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-0.5">
                    Total Amount
                </p>
                <p className="text-sm font-black text-stone-800">
                    Rp.
                    {order.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                    })}
                </p>
            </div>

            {/* Delivery */}
            <div className="hidden lg:block text-right flex-shrink-0 w-32">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-0.5">
                    {deliveryLabel[order.status]}
                </p>
                <p className="text-xs font-semibold text-stone-600">{deliveryValue}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 sm:ml-2">
                <button className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Invoice</span>
                </button>
                <button
                    disabled={isCancelled}
                    onClick={() => !isCancelled && onOrderDetail?.(order.id)}
                    className={cn(
                        "flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all",
                        isCancelled
                            ? "border border-stone-200 text-stone-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white shadow-sm shadow-blue-200"
                    )}
                >
                    Order Details
                    {!isCancelled && (
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
}