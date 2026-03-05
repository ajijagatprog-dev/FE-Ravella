"use client";

import { useEffect, useState } from "react";
import WelcomeHeader from "./components/WelcomeHeader";
import MembershipCard from "./components/MembershipCard";
import SummaryCards from "./components/SummaryCards";
import RecentOrders from "./components/RecentOrders";
import PointHistory from "./components/PointHistory";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function CustomerDashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    api.get("/customer/profile"),
                    api.get("/customer/orders")
                ]);

                if (profileRes.data.status === "success") {
                    setProfile(profileRes.data.data);
                }
                if (ordersRes.data.status === "success") {
                    setOrders(ordersRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center gap-4 text-stone-500">
                <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
                <p className="text-sm font-medium">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-5">
            {/* Welcome */}
            <WelcomeHeader profile={profile} />

            {/* Membership Banner */}
            <MembershipCard profile={profile} />

            {/* Summary Stats */}
            <SummaryCards orders={orders} profile={profile} />

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <RecentOrders orders={orders} />
                </div>
                <PointHistory profile={profile} />
            </div>
        </div>
    );
}