import { cn } from "@/lib/utils";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

const config: Record<PaymentStatus, { label: string; dot: string; className: string }> = {
    SUCCESS: {
        label: "Success",
        dot: "bg-emerald-500",
        className: "text-emerald-700",
    },
    PENDING: {
        label: "Pending",
        dot: "bg-amber-400",
        className: "text-amber-600",
    },
    FAILED: {
        label: "Failed",
        dot: "bg-rose-500",
        className: "text-rose-600",
    },
};

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const { label, dot, className } = config[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", className)}>
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
            {label}
        </span>
    );
}