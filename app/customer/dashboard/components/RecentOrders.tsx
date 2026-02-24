import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "SHIPPED" | "DELIVERED" | "PROCESSING" | "CANCELLED";

const orders: {
    id: string;
    date: string;
    total: string;
    status: Status;
}[] = [
        { id: "#RH-89231", date: "Oct 24, 2023", total: "$1,249.00", status: "SHIPPED" },
        { id: "#RH-89104", date: "Oct 12, 2023", total: "$450.00", status: "DELIVERED" },
        { id: "#RH-88762", date: "Sep 28, 2023", total: "$3,120.00", status: "DELIVERED" },
    ];

const statusConfig: Record<Status, { label: string; className: string }> = {
    SHIPPED: { label: "Shipped", className: "bg-blue-100 text-blue-700" },
    DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
    PROCESSING: { label: "Processing", className: "bg-amber-100 text-amber-700" },
    CANCELLED: { label: "Cancelled", className: "bg-rose-100 text-rose-600" },
};

export default function RecentOrders() {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-800">Recent Orders</h3>
                <Link
                    href="/customer/myOrders"
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-2.5 bg-stone-50/60 border-b border-stone-100">
                {["Order ID", "Date", "Total", "Status", ""].map((h, i) => (
                    <p key={i} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        {h}
                    </p>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-stone-100">
                {orders.map((order) => {
                    const { label, className } = statusConfig[order.status];
                    return (
                        <div
                            key={order.id}
                            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-stone-50/60 transition-colors"
                        >
                            <p className="text-sm font-bold text-stone-800">{order.id}</p>
                            <p className="text-xs text-stone-400">{order.date}</p>
                            <p className="text-sm font-semibold text-stone-700">{order.total}</p>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide", className)}>
                                    {label}
                                </span>
                                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-stone-400 hover:text-blue-600 transition-colors">
                                    <Eye className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}