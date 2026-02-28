import { cn } from "@/lib/utils";

export type OrderStatus = "SHIPPED" | "DELIVERED" | "PROCESSING" | "CANCELLED";

const config: Record<OrderStatus, { label: string; dot: string; pill: string }> = {
    SHIPPED: {
        label: "Shipped",
        dot: "bg-blue-500",
        pill: "bg-blue-50 text-blue-700 border-blue-200",
    },
    DELIVERED: {
        label: "Delivered",
        dot: "bg-emerald-500",
        pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    PROCESSING: {
        label: "Processing",
        dot: "bg-amber-400",
        pill: "bg-amber-50 text-amber-700 border-amber-200",
    },
    CANCELLED: {
        label: "Cancelled",
        dot: "bg-rose-400",
        pill: "bg-rose-50 text-rose-600 border-rose-200",
    },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const { label, dot, pill } = config[status];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 border text-[11px] font-semibold px-2.5 py-1 rounded-full",
                pill
            )}
        >
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
            {label}
        </span>
    );
}