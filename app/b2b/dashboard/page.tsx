"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Activity, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import WelcomeSection from "./components/WelcomeSection";
import StatsGrid from "./components/StatsGrid";
import RecentOrders from "./components/RecentOrders";
import api from "@/lib/axios";

export default function B2BDashboardPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<{ name: string, email: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, userRes] = await Promise.all([
                    api.get('/customer/orders'),
                    api.get('/auth/me')
                ]);

                if (ordersRes.data?.status === 'success') {
                    setOrders(ordersRes.data.data);
                }
                if (userRes.data?.status === 'success') {
                    // Fix: Access nested user object
                    setUser(userRes.data.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const { stats, recentOrders } = useMemo(() => {
        let totalSpend = 0;
        let pending = 0;
        let completed = 0;

        // Process orders
        orders.forEach(o => {
            const rawStatus = o.status || "PENDING";
            // Match order mapping logical statuses
            if (["PENDING", "PROCESSING", "ON_HOLD", "CANCELLED"].includes(rawStatus)) {
                pending++;
            } else if (["SHIPPED", "DELIVERED"].includes(rawStatus)) {
                completed++;
            }
            totalSpend += parseFloat(o.total_amount) || 0;
        });

        const fmtPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

        const currentStats = [
            {
                label: "Total Transaksi",
                value: orders.length.toString(),
                trend: "updated just now",
                trendUp: true,
                icon: Activity,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600"
            },
            {
                label: "Total Pengeluaran",
                value: fmtPrice(totalSpend),
                trend: "updated just now",
                trendUp: true,
                icon: DollarSign,
                iconBg: "bg-amber-50",
                iconColor: "text-amber-600"
            },
            {
                label: "Pesanan Pending",
                value: pending.toString(),
                trend: "awaiting action",
                trendUp: false,
                icon: Clock,
                iconBg: "bg-red-50",
                iconColor: "text-red-600"
            },
            {
                label: "Pesanan Selesai",
                value: completed.toString(),
                trend: "updated just now",
                trendUp: true,
                icon: CheckCircle2,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600"
            },
        ];

        // Format recent 5 orders
        const recent = orders.slice(0, 5).map(o => {
            const date = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const pStatusMap: any = {
                PENDING: "Pending",
                PAID: "Paid",
                FAILED: "Failed",
            };
            const oStatusMap: any = {
                PENDING: "Processing",
                PROCESSING: "Processing",
                SHIPPED: "Shipped",
                DELIVERED: "Delivered",
                CANCELLED: "On Hold",
            };

            return {
                id: o.order_number,
                date: date,
                amount: fmtPrice(parseFloat(o.total_amount) || 0),
                status: oStatusMap[o.status] || "Processing",
            };
        });

        return { stats: currentStats, recentOrders: recent };
    }, [orders]);

    if (isLoading) {
        return (
            <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center p-8 text-gray-400 gap-3">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <p>Loading Dashboard...</p>
            </div>
        );
    }
    // Return normal view


    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
            <WelcomeSection
                userName={user?.name || "B2B Partner"}
                partnerId={user?.email || "RF-B2B"}
            />
            <StatsGrid stats={stats} />
            <RecentOrders orders={recentOrders} />
        </div>
    );
}
