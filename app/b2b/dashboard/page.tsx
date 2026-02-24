"use client";

import {
    Activity,
    DollarSign,
    Clock,
    CheckCircle2,
} from "lucide-react";
import WelcomeSection from "./components/WelcomeSection";
import StatsGrid from "./components/StatsGrid";
import RecentOrders from "./components/RecentOrders";

export default function B2BDashboardPage() {
    const stats = [
        {
            label: "Total Transaksi",
            value: "128",
            trend: "+12%",
            trendUp: true,
            icon: Activity,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            label: "Total Pengeluaran",
            value: "Rp. 45.200",
            trend: "+8%",
            trendUp: true,
            icon: DollarSign,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600"
        },
        {
            label: "Pesanan Pending",
            value: "12",
            trend: "-2%",
            trendUp: false,
            icon: Clock,
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
        },
        {
            label: "Pesanan Selesai",
            value: "116",
            trend: "+15%",
            trendUp: true,
            icon: CheckCircle2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600"
        },
    ];

    const recentOrders = [
        { id: "RF-44021", date: "Oct 24, 2023", amount: "Rp. 2,450.00", status: "Processing" },
        { id: "RF-44018", date: "Oct 22, 2023", amount: "Rp. 12,800.00", status: "Shipped" },
        { id: "RF-43082", date: "Oct 19, 2023", amount: "Rp. 5,320.50", status: "Shipped" },
        { id: "RF-43940", date: "Oct 15, 2023", amount: "Rp. 940.00", status: "Delivered" },
        { id: "RF-43812", date: "Oct 12, 2023", amount: "Rp. 1,100.00", status: "Delivered" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            <WelcomeSection userName="Acme Corp" partnerId="RF-99283" />
            <StatsGrid stats={stats} />
            <RecentOrders orders={recentOrders} />
        </div>
    );
}
