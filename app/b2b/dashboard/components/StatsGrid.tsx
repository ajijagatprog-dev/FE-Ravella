"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatItem {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

interface StatsGridProps {
    stats: StatItem[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div className={`${stat.iconBg} p-3 rounded-xl transition-colors`}>
                            <stat.icon size={22} className={stat.iconColor} />
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                            {stat.trend}
                            {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
