import { Truck, Heart, Tag } from "lucide-react";
import Link from "next/link";

const cards = [
    {
        title: "Active Orders",
        value: 2,
        subtitle: "-1 from last month",
        subtitleColor: "text-rose-500",
        icon: Truck,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        href: "/customer/myOrders",
    },
    {
        title: "Saved Items",
        value: 14,
        subtitle: "+3 added today",
        subtitleColor: "text-emerald-600",
        icon: Heart,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        href: "/customer/wishlist",
    },
    {
        title: "Coupons Available",
        value: 3,
        subtitle: "Expiring in 5 days",
        subtitleColor: "text-amber-500",
        icon: Tag,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        href: "/customer/coupons",
    },
];

export default function SummaryCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map(({ title, value, subtitle, subtitleColor, icon: Icon, iconBg, iconColor, href }) => (
                <Link
                    key={title}
                    href={href}
                    className="group bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-200"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-stone-800 mb-0.5">{value}</p>
                    <p className="text-sm font-semibold text-stone-600 mb-1">{title}</p>
                    <p className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</p>
                </Link>
            ))}
        </div>
    );
}