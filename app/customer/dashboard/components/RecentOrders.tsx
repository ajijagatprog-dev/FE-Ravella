import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-stone-100 text-stone-700" },
    PAID: { label: "Paid", className: "bg-blue-100 text-blue-700" },
    SHIPPED: { label: "Shipped", className: "bg-indigo-100 text-indigo-700" },
    DELIVERED: { label: "Delivered", className: "bg-emerald-100 text-emerald-700" },
    PROCESSING: { label: "Processing", className: "bg-amber-100 text-amber-700" },
    CANCELLED: { label: "Cancelled", className: "bg-rose-100 text-rose-600" },
    COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700" }
};

export default function RecentOrders({ orders }: { orders: any[] }) {
    const displayOrders = orders?.slice(0, 3) || [];

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
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-stone-50/80 border-b border-stone-100">
                {["Order ID", "Date", "Total Amount", "Status"].map((h, i) => (
                    <p key={i} className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                        {h}
                    </p>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-stone-100">
                {displayOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-stone-500">
                        No recent orders found.
                    </div>
                ) : displayOrders.map((order) => {
                    const statusStr = order.status ? order.status.toUpperCase() : "PENDING";
                    const { label, className } = statusConfig[statusStr] || statusConfig.PENDING;

                    const dateObj = new Date(order.created_at);
                    const formattedDate = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

                    return (
                        <div
                            key={order.id}
                            className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-stone-50/40 transition-colors"
                        >
                            <p className="text-sm font-bold text-stone-900 tracking-tight">{order.order_number}</p>
                            <p className="text-xs font-medium text-stone-500">{formattedDate}</p>
                            <p className="text-sm font-bold text-[#8B5E3C]">Rp {parseInt(order.total_amount).toLocaleString('id-ID')}</p>
                            <div className="flex items-center">
                                <span className={cn("text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm", className)}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}