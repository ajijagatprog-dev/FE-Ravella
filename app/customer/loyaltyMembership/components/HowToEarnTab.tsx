import { ShoppingBag, Star, Share2, LucideIcon } from "lucide-react";

interface EarnWay {
    icon: LucideIcon;
    label: string;
    desc: string;
    points: string;
    iconBg: string;
    iconColor: string;
}

const earnWays: EarnWay[] = [
    {
        icon: ShoppingBag,
        label: "Shop Furniture",
        desc: "Earn 1 point for every $1 spent in store or online",
        points: "1 pt / $1",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        icon: Star,
        label: "Write Reviews",
        desc: "Get 10 points for every verified product review",
        points: "10 pts / review",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        icon: Share2,
        label: "Refer a Friend",
        desc: "Get 500 points when your friend makes their first purchase",
        points: "500 pts / referral",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
    },
];

export default function HowToEarnTab() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {earnWays.map(({ icon: Icon, label, desc, points, iconBg, iconColor }) => (
                <div
                    key={label}
                    className="border border-stone-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <p className="text-sm font-bold text-stone-800 mb-1">{label}</p>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">{desc}</p>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                        {points}
                    </span>
                </div>
            ))}
        </div>
    );
}