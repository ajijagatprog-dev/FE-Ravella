"use client";

import { useEffect } from "react";
import {
    X,
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    FileText,
    Download,
} from "lucide-react";
import OrderStatusBadge, { type OrderStatus } from "./OrderStatusBadge";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface OrderItem {
    id: string;
    name: string;
    variant?: string;
    qty: number;
    price: number;
    image?: string;
}

export interface OrderDetail {
    id: string;
    orderNumber: string;
    placedAt: string;
    status: OrderStatus;
    totalAmount: number;
    shippingCost: number;
    tax: number;
    estimatedDelivery?: string;
    deliveryDate?: string;
    // Items
    items: OrderItem[];
    // Shipping
    shippingAddress: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        province: string;
        postalCode: string;
    };
    // Payment
    paymentMethod: string;
    paymentStatus: "PAID" | "PENDING" | "FAILED";
}

// ── Timeline step config ──────────────────────────────────────────────────────
const timelineSteps: Record<OrderStatus, string[]> = {
    PROCESSING: ["Order Placed", "Processing"],
    SHIPPED: ["Order Placed", "Processing", "Shipped"],
    DELIVERED: ["Order Placed", "Processing", "Shipped", "Delivered"],
    CANCELLED: ["Order Placed", "Cancelled"],
};

const stepIcons = [Clock, Package, Truck, CheckCircle];

// ── Modal ─────────────────────────────────────────────────────────────────────
interface Props {
    order: OrderDetail | null;
    onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
    // Close on ESC
    useEffect(() => {
        if (!order) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [order, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (order) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [order]);

    if (!order) return null;

    const subtotal = order.totalAmount - order.shippingCost - order.tax;
    const steps = timelineSteps[order.status];
    const isCancelled = order.status === "CANCELLED";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="flex items-start justify-between px-6 py-5 border-b border-stone-100 flex-shrink-0">
                        <div>
                            <div className="flex items-center gap-2.5 mb-1">
                                <h2 className="text-lg font-bold text-stone-800">
                                    Order #{order.orderNumber}
                                </h2>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="text-xs text-stone-400">Placed on {order.placedAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                Invoice
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── Scrollable body ── */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                        {/* Timeline */}
                        {!isCancelled && (
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">
                                    Order Progress
                                </p>
                                <div className="flex items-center">
                                    {steps.map((step, i) => {
                                        const Icon = stepIcons[i] ?? CheckCircle;
                                        const isActive = i <= steps.length - 1;
                                        const isDone = i < steps.length - 1;
                                        return (
                                            <div key={step} className="flex items-center flex-1 last:flex-none">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <div
                                                        className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                                                            isDone
                                                                ? "bg-blue-600 text-white"
                                                                : isActive && i === steps.length - 1
                                                                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                                                    : "bg-stone-100 text-stone-400"
                                                        )}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-medium text-stone-500 whitespace-nowrap">
                                                        {step}
                                                    </span>
                                                </div>
                                                {i < steps.length - 1 && (
                                                    <div
                                                        className={cn(
                                                            "flex-1 h-0.5 mx-2 mb-5 rounded-full",
                                                            isDone ? "bg-blue-600" : "bg-stone-200"
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isCancelled && (
                            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                                <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-rose-700">Order Cancelled</p>
                                    <p className="text-xs text-rose-500">This order was cancelled on {order.deliveryDate}.</p>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div>
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">
                                Items Ordered
                            </p>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        {/* Image placeholder */}
                                        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-stone-300" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-stone-700 truncate">{item.name}</p>
                                            {item.variant && (
                                                <p className="text-xs text-stone-400">{item.variant}</p>
                                            )}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-stone-400 mb-0.5">Qty: {item.qty}</p>
                                            <p className="text-sm font-bold text-stone-800">
                                                Rp.{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Subtotal</span>
                                <span>Rp.{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Shipping</span>
                                <span>
                                    {order.shippingCost === 0
                                        ? <span className="text-emerald-600 font-medium">Gratis</span>
                                        : `Rp.${order.shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-500">
                                <span>Tax</span>
                                <span>Rp.{order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-stone-800 pt-2 border-t border-stone-200">
                                <span>Total</span>
                                <span>Rp.{order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Shipping + Payment - 2 col */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Shipping Address */}
                            <div className="bg-stone-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                        Shipping Address
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-stone-700">{order.shippingAddress.fullName}</p>
                                <p className="text-xs text-stone-500 mt-0.5">{order.shippingAddress.phone}</p>
                                <p className="text-xs text-stone-500 mt-0.5">{order.shippingAddress.street}</p>
                                <p className="text-xs text-stone-500">
                                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                                    {order.shippingAddress.postalCode}
                                </p>
                            </div>

                            {/* Payment */}
                            <div className="bg-stone-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                                        Payment
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-stone-700">{order.paymentMethod}</p>
                                <div className="mt-2">
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold px-2 py-1 rounded-full border",
                                            order.paymentStatus === "PAID"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : order.paymentStatus === "PENDING"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                        )}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                {order.estimatedDelivery && (
                                    <p className="text-xs text-stone-500 mt-3">
                                        Est. Delivery:{" "}
                                        <span className="font-semibold text-stone-700">
                                            {order.estimatedDelivery}
                                        </span>
                                    </p>
                                )}
                                {order.deliveryDate && !isCancelled && (
                                    <p className="text-xs text-stone-500 mt-3">
                                        Delivered:{" "}
                                        <span className="font-semibold text-stone-700">
                                            {order.deliveryDate}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-stone-100 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                        >
                            Close
                        </button>
                        {!isCancelled && (
                            <button className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-200">
                                Lacak Pengiriman
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}