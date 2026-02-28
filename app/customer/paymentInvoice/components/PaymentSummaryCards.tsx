import { TrendingUp, Clock, CreditCard } from "lucide-react";

interface Props {
    totalSpent: number;
    pendingAmount: number;
    pendingCount: number;
    savedMethod: string;
    savedMethodType: string;
    growthPercent: number;
}

export default function PaymentSummaryCards({
    totalSpent,
    pendingAmount,
    pendingCount,
    savedMethod,
    savedMethodType,
    growthPercent,
}: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Spent */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                    Total Spent (Year)
                </p>
                <p className="text-2xl font-black text-stone-800 mb-1">
                    Rp. {totalSpent.toLocaleString("id-ID")}
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{growthPercent}% from last month</span>
                </div>
            </div>

            {/* Pending Payments */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                    Pending Payments
                </p>
                <p className="text-2xl font-black text-amber-500 mb-1">
                    Rp. {pendingAmount.toLocaleString("id-ID")}
                </p>
                <div className="flex items-center gap-1 text-xs text-stone-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingCount} item awaiting settlement</span>
                </div>
            </div>

            {/* Saved Payment Method */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                    Saved Payment Method
                </p>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                    </div>
                    <p className="text-sm font-bold text-stone-800">{savedMethod}</p>
                </div>
                <p className="text-xs text-stone-400">{savedMethodType}</p>
            </div>
        </div>
    );
}