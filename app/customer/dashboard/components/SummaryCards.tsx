import { Truck, Heart, Tag } from "lucide-react";
import Link from "next/link";

export default function SummaryCards({ orders, profile }: { orders: any[]; profile: any }) {
    const activeOrdersCount = orders?.filter(o => !["DELIVERED", "CANCELLED", "COMPLETED"].includes(o.status.toUpperCase())).length || 0;

    const cards = [
        {
            title: "Active Orders",
            value: activeOrdersCount,
            subtitle: "Currently processing",
            subtitleColor: "text-blue-500",
            icon: Truck,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            href: "/customer/myOrders",
        },
        {
            title: "Saved Items",
            value: 0,
            subtitle: "Wishlist feature coming soon",
            subtitleColor: "text-emerald-600",
            icon: Heart,
            iconBg: "bg-rose-100",
            iconColor: "text-rose-500",
            href: "#",
        },
        {
            title: "Coupons Available",
            value: 0,
            subtitle: "No active coupons",
            subtitleColor: "text-amber-500",
            icon: Tag,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            href: "#",
        },
    ];

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