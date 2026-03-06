"use client";

import { useState, useEffect } from "react";
import TierCard, { type LoyaltyTier } from "./components/TierCard";
import PointsCard from "./components/PointsCard";
import RewardsTab, { type Reward } from "./components/RewardsTab";
import PointHistoryTab, { type PointTransaction } from "./components/PointHistoryTab";
import HowToEarnTab from "./components/HowToEarnTab";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";

// ── Static rewards (these can later come from backend) ────────────────────────
const REWARDS: Reward[] = [
    {
        id: "r1",
        title: "Rp 50.000",
        subtitle: "Voucher Diskon",
        description: "Berlaku untuk semua produk furnitur",
        points: 500,
        canRedeem: true,
    },
    {
        id: "r2",
        title: "FREE SHIP",
        subtitle: "Gratis Ongkir",
        description: "Gratis ongkir untuk 1x pengiriman",
        points: 200,
        canRedeem: true,
    },
    {
        id: "r3",
        title: "Rp 100.000",
        subtitle: "Voucher Premium",
        description: "Minimal belanja Rp 1.000.000",
        points: 1000,
        canRedeem: true,
    },
    {
        id: "r4",
        title: "GIFT SET",
        subtitle: "Home Decor Set",
        description: "Set dekorasi edisi terbatas",
        points: 3000,
        canRedeem: true,
    },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Available Rewards", "Point History Log", "How to Earn"] as const;
type Tab = (typeof TABS)[number];

// ── Page ──────────────────────────────────────────────────────────────────────
interface LoyaltyData {
    points: number;
    tier: LoyaltyTier;
    tier_progress: number;
    next_tier: string;
    member_since: string;
    total_spent: number;
    total_orders: number;
    benefits: { label: string; desc: string }[];
    transactions: PointTransaction[];
}

export default function LoyaltyMembershipPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Available Rewards");
    const [data, setData] = useState<LoyaltyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/loyalty')
            .then(res => {
                if (res.data.status === 'success') {
                    setData(res.data.data);
                }
            })
            .catch(err => console.error("Failed to load loyalty data", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 size={24} className="animate-spin text-blue-500" />
                <p className="text-sm text-stone-400">Loading loyalty data...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-stone-400">
                <p className="text-sm">Gagal memuat data loyalty. Silakan coba lagi.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* ── Header ── */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-800 mb-1">
                    Customer Loyalty Rewards Center
                </h1>
                <p className="text-sm text-stone-500">
                    Unlock exclusive benefits and redeem your earned points.
                </p>
            </div>

            {/* ── Top Section: Tier + Points ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2">
                    <TierCard
                        tier={data.tier}
                        activeSince={data.member_since}
                        benefits={data.benefits}
                        progressToNext={data.tier_progress}
                        nextTier={data.next_tier}
                    />
                </div>
                <div>
                    <PointsCard
                        points={data.points}
                    />
                </div>
            </div>

            {/* ── Tabs Section ── */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {/* Tab Bar */}
                <div className="flex border-b border-stone-100">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 text-sm font-medium py-3.5 transition-all duration-150",
                                activeTab === tab
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5">
                    {activeTab === "Available Rewards" && (
                        <RewardsTab
                            rewards={REWARDS}
                            availablePoints={data.points}
                        />
                    )}
                    {activeTab === "Point History Log" && (
                        <PointHistoryTab transactions={data.transactions} />
                    )}
                    {activeTab === "How to Earn" && <HowToEarnTab />}
                </div>
            </div>
        </div>
    );
}