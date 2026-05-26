"use client";

import { Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface LoyaltyData {
  points: number;
  tier: string;
  tier_progress: number;
  next_tier: string;
  total_spent: number;
  benefits: { label: string; desc: string }[];
}

function getTierGradient(tier: string) {
  const t = tier.toUpperCase();
  if (t.includes("PLATINUM") || t.includes("DIAMOND"))
    return "from-sky-400 to-indigo-500";
  if (t.includes("GOLD") || t.includes("PREMIUM"))
    return "from-amber-400 to-orange-500";
  if (t.includes("SILVER")) return "from-slate-400 to-slate-500";
  return "from-stone-400 to-stone-500"; // BASIC
}

function getTierBadgeColor(tier: string) {
  const t = tier.toUpperCase();
  if (t.includes("PLATINUM") || t.includes("DIAMOND"))
    return "text-sky-700 bg-sky-100 border-sky-200";
  if (t.includes("GOLD") || t.includes("PREMIUM"))
    return "text-amber-700 bg-amber-100 border-amber-200";
  if (t.includes("SILVER"))
    return "text-slate-700 bg-slate-100 border-slate-200";
  return "text-stone-700 bg-stone-100 border-stone-200"; // BASIC
}

export default function MembershipCard({ profile }: { profile: any }) {
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customer/loyalty")
      .then((res) => {
        if (res.data.status === "success") {
          setLoyalty(res.data.data);
        }
      })
      .catch(() => {
        // fallback ke data dari profile jika ada
        if (profile) {
          setLoyalty({
            points: profile.loyalty_points || 0,
            tier: "BASIC",
            tier_progress: 0,
            next_tier: "-",
            total_spent: 0,
            benefits: [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, [profile]);

  const tier = loyalty?.tier ?? "BASIC";
  const points = loyalty?.points ?? (profile?.loyalty_points || 0);
  const progress = loyalty?.tier_progress ?? 0;
  const nextTier = loyalty?.next_tier ?? "-";
  const totalSpent = loyalty?.total_spent ?? 0;
  const benefits = loyalty?.benefits ?? [];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Left — Tier Badge */}
        <div className="relative sm:w-56 h-44 sm:h-auto bg-gradient-to-br from-stone-100 to-amber-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-stone-200/40" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg ${getTierGradient(tier)}`}
            >
              <Crown className="w-8 h-8 text-white" />
            </div>
            <span
              className={`text-xs font-black border px-3 py-1 rounded-full uppercase tracking-widest ${getTierBadgeColor(tier)}`}
            >
              {tier}
            </span>
          </div>
        </div>

        {/* Right — Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-black text-stone-800 mb-0.5">
                {tier} Member Benefits
              </h3>
              {loading ? (
                <p className="text-sm text-stone-400 italic">Loading...</p>
              ) : benefits.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {benefits.slice(0, 3).map((b) => (
                    <span
                      key={b.label}
                      className="text-[11px] font-medium text-stone-600 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full"
                    >
                      ✓ {b.label}
                    </span>
                  ))}
                  {benefits.length > 3 && (
                    <span className="text-[11px] text-stone-400">
                      +{benefits.length - 3} lainnya
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-stone-500 leading-relaxed">
                  Terus belanja untuk naik ke tier berikutnya dan dapatkan
                  keuntungan eksklusif!
                </p>
              )}
              {totalSpent > 0 && (
                <p className="text-xs text-stone-400 mt-2">
                  Total belanja:{" "}
                  <span className="font-semibold text-stone-600">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Math.round(totalSpent))}
                  </span>
                </p>
              )}
            </div>
            {/* Points Balance */}
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                Points Balance
              </p>
              <p className="text-3xl font-black text-blue-600 leading-none">
                {loading ? "..." : points.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-stone-600">
                {nextTier === "MAX"
                  ? "Tier Tertinggi 🏆"
                  : `Progress ke ${nextTier}`}
              </p>
              <p className="text-xs font-black text-emerald-600">
                {progress}% Complete
              </p>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getTierGradient(tier)} rounded-full transition-all duration-700`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[11px] text-stone-400">
                {nextTier === "MAX"
                  ? "Anda sudah di tier tertinggi!"
                  : `Terus belanja untuk mencapai tier ${nextTier}`}
              </p>
              <Link
                href="/customer/loyaltyMembership"
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Detail <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
