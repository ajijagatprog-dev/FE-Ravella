"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoyaltyTier = "BASIC" | "GOLD" | "PLATINUM";

interface Benefit {
    label: string;
    desc: string;
}

interface Props {
    tier: LoyaltyTier;
    activeSince: string;
    benefits: Benefit[];
    progressToNext: number;
    nextTier: string;
}

const tierStyle: Record<LoyaltyTier, { gradient: string; ring: string; label: string }> = {
    BASIC: {
        gradient: "from-slate-400 to-slate-500",
        ring: "ring-slate-200",
        label: "text-slate-600",
    },
    GOLD: {
        gradient: "from-amber-400 to-orange-500",
        ring: "ring-amber-200",
        label: "text-amber-600",
    },
    PLATINUM: {
        gradient: "from-sky-400 to-indigo-500",
        ring: "ring-sky-200",
        label: "text-sky-600",
    },
};

const tierBg: Record<LoyaltyTier, string> = {
    BASIC: "from-slate-50 to-stone-50 border-slate-200",
    GOLD: "from-amber-50 to-orange-50 border-amber-200",
    PLATINUM: "from-sky-50 to-indigo-50 border-sky-200",
};

export default function TierCard({
    tier,
    activeSince,
    benefits,
    progressToNext,
    nextTier,
}: Props) {
    const style = tierStyle[tier];

    return (
        <div
            className={cn(
                "rounded-2xl border bg-gradient-to-br p-6",
                tierBg[tier]
            )}
        >
            <div className="flex items-start gap-5">
                {/* Tier Badge */}
                <div
                    className={cn(
                        "flex-shrink-0 w-[88px] h-[88px] rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center shadow-lg",
                        style.gradient,
                        `ring-4 ${style.ring}`
                    )}
                >
                    <Crown className="w-7 h-7 text-white mb-1" />
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                        {tier}
                    </span>
                    <span className="text-[9px] font-semibold text-white/80 uppercase tracking-wider">
                        TIER
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-bold uppercase tracking-widest mb-0.5", style.label)}>
                        {tier} TIER MEMBER
                    </p>
                    <p className="text-xs text-stone-500 mb-4">Active since {activeSince}</p>

                    {/* Benefits grid */}
                    <p className="text-xs font-bold text-stone-700 mb-2">Your Unlocked Benefits</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                        {benefits.map((b) => (
                            <div key={b.label} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 font-bold text-xs mt-0.5">✓</span>
                                <div>
                                    <p className="text-xs font-semibold text-stone-700 leading-tight">{b.label}</p>
                                    <p className="text-[10px] text-stone-400 leading-tight">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-stone-500 font-medium uppercase tracking-wider">
                                Progress to {nextTier}
                            </span>
                            <span className={cn("font-bold", style.label)}>{progressToNext}%</span>
                        </div>
                        <div className="h-2 bg-white/70 rounded-full overflow-hidden border border-white">
                            <div
                                className={cn(
                                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                                    style.gradient
                                )}
                                style={{ width: `${progressToNext}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}