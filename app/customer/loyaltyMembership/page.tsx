"use client";

import { useState } from "react";
import TierCard from "./components/TierCard";
import PointsCard from "./components/PointsCard";
import RewardsTab, { type Reward } from "./components/RewardsTab";
import PointHistoryTab, { type PointTransaction } from "./components/PointHistoryTab";
import HowToEarnTab from "./components/HowToEarnTab";
import { cn } from "@/lib/utils";

// ── Mock data — replace with real API ─────────────────────────────────────────
const LOYALTY_DATA = {
    tier: "GOLD" as const,
    activeSince: "Jan 2023",
    availablePoints: 2450,
    expiringPoints: 150,
    expiryDate: "Expires Nov 30, 2023",
    progressToNext: 75,
    nextTier: "Platinum",
    benefits: [
        { label: "Free Express Shipping", desc: "On all orders over $50" },
        { label: "Early Access", desc: "Shop new drops 24hrs early" },
        { label: "Design Consultation", desc: "1x 30min session per quarter" },
        { label: "Birthday Bonus", desc: "500 points every year" },
    ],
};

const REWARDS: Reward[] = [
    {
        id: "r1",
        title: "$20 OFF",
        subtitle: "Discount Voucher",
        description: "Applicable on any furniture items",
        points: 500,
        canRedeem: true,
    },
    {
        id: "r2",
        title: "FREE SHIP",
        subtitle: "Standard Shipping",
        description: "One time free shipping coupon",
        points: 200,
        canRedeem: true,
    },
    {
        id: "r3",
        title: "$50 OFF",
        subtitle: "Premium Voucher",
        description: "Min. spend $500 required",
        points: 1200,
        canRedeem: true,
    },
    {
        id: "r4",
        title: "HOME KIT",
        subtitle: "Aroma Diffuser Set",
        description: "Limited edition seasonal set",
        points: 3000,
        canRedeem: true,
    },
];

const TRANSACTIONS: PointTransaction[] = [
    { id: "t1", description: "Purchase #RH-89231", points: 125, date: "Oct 24, 2023", type: "earn" },
    { id: "t2", description: "Redeemed Free Shipping", points: -200, date: "Oct 10, 2023", type: "redeem" },
    { id: "t3", description: "Purchase #RH-89104", points: 45, date: "Oct 12, 2023", type: "earn" },
    { id: "t4", description: "Birthday Bonus", points: 500, date: "Sep 01, 2023", type: "earn" },
    { id: "t5", description: "Write a Review — Lounge Chair", points: 10, date: "Aug 20, 2023", type: "earn" },
    { id: "t6", description: "Redeemed $20 Voucher", points: -500, date: "Aug 05, 2023", type: "redeem" },
    { id: "t7", description: "Referral Bonus — James T.", points: 500, date: "Jul 18, 2023", type: "earn" },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Available Rewards", "Point History Log", "How to Earn"] as const;
type Tab = (typeof TABS)[number];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoyaltyMembershipPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Available Rewards");

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
                        tier={LOYALTY_DATA.tier}
                        activeSince={LOYALTY_DATA.activeSince}
                        benefits={LOYALTY_DATA.benefits}
                        progressToNext={LOYALTY_DATA.progressToNext}
                        nextTier={LOYALTY_DATA.nextTier}
                    />
                </div>
                <div>
                    <PointsCard
                        points={LOYALTY_DATA.availablePoints}
                        expiringPoints={LOYALTY_DATA.expiringPoints}
                        expiryDate={LOYALTY_DATA.expiryDate}
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
                            availablePoints={LOYALTY_DATA.availablePoints}
                        />
                    )}
                    {activeTab === "Point History Log" && (
                        <PointHistoryTab transactions={TRANSACTIONS} />
                    )}
                    {activeTab === "How to Earn" && <HowToEarnTab />}
                </div>
            </div>
        </div>
    );
}