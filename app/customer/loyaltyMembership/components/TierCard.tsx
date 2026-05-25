"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

// Tier type is now a string to support dynamic admin-defined tiers
export type LoyaltyTier = string;

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
  totalSpent?: number;
}

// Dynamic tier style resolver based on tier name keywords
function getTierStyle(tierName: string): {
  gradient: string;
  ring: string;
  label: string;
  bg: string;
} {
  const name = tierName.toUpperCase();
  if (
    name.includes("PLATINUM") ||
    name.includes("DIAMOND") ||
    name.includes("VIP")
  ) {
    return {
      gradient: "from-sky-400 to-indigo-500",
      ring: "ring-sky-200",
      label: "text-sky-600",
      bg: "from-sky-50 to-indigo-50 border-sky-200",
    };
  }
  if (
    name.includes("GOLD") ||
    name.includes("PREMIUM") ||
    name.includes("ELITE")
  ) {
    return {
      gradient: "from-amber-400 to-orange-500",
      ring: "ring-amber-200",
      label: "text-amber-600",
      bg: "from-amber-50 to-orange-50 border-amber-200",
    };
  }
  if (
    name.includes("SILVER") ||
    name.includes("MEMBER") ||
    name.includes("REGULAR")
  ) {
    return {
      gradient: "from-slate-400 to-slate-500",
      ring: "ring-slate-200",
      label: "text-slate-600",
      bg: "from-slate-50 to-stone-50 border-slate-200",
    };
  }
  if (name.includes("BRONZE") || name.includes("STARTER")) {
    return {
      gradient: "from-orange-400 to-amber-600",
      ring: "ring-orange-200",
      label: "text-orange-600",
      bg: "from-orange-50 to-amber-50 border-orange-200",
    };
  }
  // Default: BASIC / any other
  return {
    gradient: "from-slate-400 to-slate-500",
    ring: "ring-slate-200",
    label: "text-slate-600",
    bg: "from-slate-50 to-stone-50 border-slate-200",
  };
}

export default function TierCard({
  tier,
  activeSince,
  benefits,
  progressToNext,
  nextTier,
  totalSpent,
}: Props) {
  const style = getTierStyle(tier);

  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-6", style.bg)}>
      <div className="flex items-start gap-5">
        {/* Tier Badge */}
        <div
          className={cn(
            "flex-shrink-0 w-[88px] h-[88px] rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center shadow-lg",
            style.gradient,
            `ring-4 ${style.ring}`,
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
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-widest mb-0.5",
              style.label,
            )}
          >
            {tier} TIER MEMBER
          </p>
          <p className="text-xs text-stone-500 mb-1">
            Active since {activeSince}
          </p>
          {totalSpent !== undefined && totalSpent > 0 && (
            <p className="text-xs text-stone-400 mb-4">
              Total spent:{" "}
              <span className="font-semibold text-stone-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Math.round(totalSpent))}
              </span>
            </p>
          )}

          {/* Benefits grid */}
          {benefits.length > 0 && (
            <>
              <p className="text-xs font-bold text-stone-700 mb-2">
                Your Unlocked Benefits
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {benefits.map((b) => (
                  <div key={b.label} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold text-xs mt-0.5">
                      ✓
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-stone-700 leading-tight">
                        {b.label}
                      </p>
                      {b.desc !== b.label && (
                        <p className="text-[10px] text-stone-400 leading-tight">
                          {b.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Progress */}
          {nextTier !== "MAX" && (
            <div className="mt-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-stone-500 font-medium uppercase tracking-wider">
                  Progress to {nextTier}
                </span>
                <span className={cn("font-bold", style.label)}>
                  {progressToNext}%
                </span>
              </div>
              <div className="h-2 bg-white/70 rounded-full overflow-hidden border border-white">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                    style.gradient,
                  )}
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          )}
          {nextTier === "MAX" && (
            <div className="mt-4">
              <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-bold text-amber-600">
                  Tier Tertinggi — Anda di puncak!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
