import Link from "next/link";
import { ShoppingBag, Star, Gift, PartyPopper, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const history = [
    {
        label: "Purchase Reward",
        desc: "Order #RH-89231",
        points: "+150",
        icon: ShoppingBag,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        pointColor: "text-emerald-600",
    },
    {
        label: "Product Review Bonus",
        desc: "Write a product review",
        points: "+50",
        icon: Star,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        pointColor: "text-emerald-600",
    },
    {
        label: "Redemption",
        desc: "$20 discount coupon",
        points: "-500",
        icon: Gift,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        pointColor: "text-rose-500",
    },
    {
        label: "Anniversary Bonus",
        desc: "2 years with Ravelle",
        points: "+1,000",
        icon: PartyPopper,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        pointColor: "text-emerald-600",
    },
];

export default function PointHistory({ profile }: { profile: any }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
                <h3 className="text-sm font-bold text-stone-800">Point History</h3>
            </div>

            {/* List */}
            <div className="flex-1 divide-y divide-stone-100">
                {history.map(({ label, desc, points, icon: Icon, iconBg, iconColor, pointColor }) => (
                    <div key={label} className="flex items-center gap-3 px-6 py-3.5">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
                            <Icon className={cn("w-4 h-4", iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-700 truncate">{label}</p>
                            <p className="text-xs text-stone-400">{desc}</p>
                        </div>
                        <span className={cn("text-sm font-black flex-shrink-0", pointColor)}>
                            {points}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-stone-100 flex-shrink-0">
                <Link
                    href="/customer/loyaltyMembership"
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View Full Log <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}