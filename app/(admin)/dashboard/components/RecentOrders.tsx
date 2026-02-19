"use client";

import { ShoppingBag, Users, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";

const activities = [
  {
    icon: ShoppingBag,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "New Order #12344",
    subtitle: "2 minutes ago by Sarah Jenkins",
  },
  {
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "New Loyalty Member",
    subtitle: "15 minutes ago from California, US",
  },
  {
    icon: CheckCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "B2B Application Approved",
    subtitle: "1 hour ago · FashionHub Inc.",
  },
  {
    icon: RefreshCw,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Inventory Synced",
    subtitle: "3 hours ago · 420 items updated",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    title: "Low Stock Warning",
    subtitle: '5 hours ago · "Silk Midi Dress" (Blue)',
  },
];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-gray-900">Latest Activity</h3>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-4">
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
              >
                <Icon size={14} className={item.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}