"use client";

import { cn } from "@/lib/utils";
import {
  Gift,
  Ticket,
  Zap,
  Loader2,
  Star,
  CheckCircle2,
  Truck,
} from "lucide-react";
import type { ClaimableReward } from "../page";

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  points_required: number;
  type: "voucher" | "perk" | "free_ship";
  voucher_code?: string;
  voucher_id?: number;
  canRedeem: boolean;
  min_purchase?: number;
}

const typeConfig = {
  voucher: {
    icon: Ticket,
    colors: [
      "bg-blue-50 border-blue-100",
      "bg-violet-50 border-violet-100",
      "bg-rose-50 border-rose-100",
      "bg-emerald-50 border-emerald-100",
    ],
    title: [
      "text-blue-700",
      "text-violet-700",
      "text-rose-700",
      "text-emerald-700",
    ],
    btn: [
      "bg-blue-600 hover:bg-blue-700",
      "bg-violet-600 hover:bg-violet-700",
      "bg-rose-600 hover:bg-rose-700",
      "bg-emerald-600 hover:bg-emerald-700",
    ],
  },
  free_ship: {
    icon: Truck,
    colors: ["bg-cyan-50 border-cyan-100"],
    title: ["text-cyan-700"],
    btn: ["bg-cyan-600 hover:bg-cyan-700"],
  },
  perk: {
    icon: Gift,
    colors: ["bg-amber-50 border-amber-100"],
    title: ["text-amber-700"],
    btn: ["bg-amber-600 hover:bg-amber-700"],
  },
};

interface Props {
  rewards: Reward[];
  availablePoints: number;
  loading?: boolean;
  onRedeem?: (reward: Reward) => void;
  redeemingId?: string | null;
  // Claimable tier rewards
  claimable?: ClaimableReward[];
  claimedHistory?: ClaimableReward[];
  claimableLoading?: boolean;
  onClaim?: (reward: ClaimableReward) => void;
  claimingId?: string | null;
}

export default function RewardsTab({
  rewards,
  availablePoints,
  loading,
  onRedeem,
  redeemingId,
  claimable = [],
  claimedHistory = [],
  claimableLoading = false,
  onClaim,
  claimingId,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3">
        <Loader2 size={20} className="animate-spin text-blue-500" />
        <p className="text-sm text-stone-400">Memuat rewards...</p>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-10">
        <Gift className="w-10 h-10 text-stone-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-stone-500">
          Belum ada reward tersedia
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Terus belanja untuk membuka reward eksklusif
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Section 1: Tier Claimable Rewards ── */}
      {(claimable.length > 0 ||
        claimedHistory.length > 0 ||
        claimableLoading) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star size={15} className="text-amber-500" />
            <h4 className="text-sm font-bold text-stone-800">
              Tier Rewards — Siap Diklaim
            </h4>
            {claimable.length > 0 && (
              <span className="text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                {claimable.length} baru
              </span>
            )}
          </div>

          {claimableLoading ? (
            <div className="flex items-center gap-2 text-stone-400 py-2">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-xs">Memuat...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Unclaimed */}
              {claimable.map((cr) => {
                const isClaiming = claimingId === cr.id;
                return (
                  <div
                    key={cr.id}
                    className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      {cr.type === "voucher_code" ? (
                        <Ticket size={18} className="text-amber-600" />
                      ) : (
                        <Star size={18} className="text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-amber-900 leading-tight truncate">
                        {cr.label}
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        {cr.type === "voucher_code"
                          ? (cr.voucher_label ?? "Voucher Diskon")
                          : `+${cr.points?.toLocaleString()} poin`}
                        {" · "}
                        {cr.tier_name} Tier
                      </p>
                    </div>
                    <button
                      disabled={isClaiming}
                      onClick={() => onClaim?.(cr)}
                      className="shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaiming ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Gift size={12} />
                      )}
                      {isClaiming ? "Klaim..." : "Klaim"}
                    </button>
                  </div>
                );
              })}

              {/* Already claimed */}
              {claimedHistory.map((cr) => (
                <div
                  key={cr.id}
                  className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 opacity-70"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-600 leading-tight truncate">
                      {cr.label}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {cr.type === "voucher_code"
                        ? `Kode: ${cr.claimed_value}`
                        : `+${cr.claimed_value} poin`}
                      {cr.claimed_at && ` · ${cr.claimed_at}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                    ✓ Diklaim
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-stone-100 pt-2" />
        </div>
      )}

      {/* ── Section 2: Tukar Poin ── */}
      {/* Point balance reminder */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
        <Zap className="w-4 h-4 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700">
          Poin kamu saat ini:{" "}
          <span className="font-bold">
            {availablePoints.toLocaleString()} pts
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {rewards.map((reward, i) => {
          const canAfford =
            reward.points_required === 0 ||
            availablePoints >= reward.points_required;
          const Icon = typeConfig[reward.type]?.icon ?? Gift;
          const colors = typeConfig[reward.type]?.colors ?? [
            "bg-stone-50 border-stone-100",
          ];
          const titleColors = typeConfig[reward.type]?.title ?? [
            "text-stone-600",
          ];
          const btnColors = typeConfig[reward.type]?.btn ?? ["bg-stone-400"];
          const colorIdx = i % colors.length;
          const isRedeeming = redeemingId === reward.id;

          return (
            <div
              key={reward.id}
              className={cn(
                "rounded-xl border p-4 flex flex-col gap-3 transition-all",
                reward.canRedeem && canAfford
                  ? cn(colors[colorIdx], "hover:shadow-sm")
                  : "bg-stone-50 border-stone-100 opacity-60",
              )}
            >
              {/* Icon + title */}
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    reward.canRedeem && canAfford
                      ? "bg-white/70"
                      : "bg-stone-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      reward.canRedeem && canAfford
                        ? titleColors[colorIdx]
                        : "text-stone-400",
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-black leading-tight",
                      reward.canRedeem && canAfford
                        ? titleColors[colorIdx]
                        : "text-stone-400",
                    )}
                  >
                    {reward.title}
                  </p>
                  {reward.subtitle && (
                    <p className="text-xs font-semibold text-stone-500 mt-0.5">
                      {reward.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed flex-1">
                {reward.description}
                {reward.min_purchase && reward.min_purchase > 0 ? (
                  <span className="block mt-1 font-semibold text-stone-400">
                    Min. Rp {reward.min_purchase.toLocaleString("id-ID")}
                  </span>
                ) : null}
              </p>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-600">
                  {reward.points_required === 0 ? (
                    <span className="text-emerald-600">Tier Perk</span>
                  ) : (
                    `${reward.points_required.toLocaleString()} pts`
                  )}
                </span>
                {reward.points_required > 0 ? (
                  <button
                    disabled={!canAfford || !reward.canRedeem || isRedeeming}
                    onClick={() => onRedeem?.(reward)}
                    className={cn(
                      "text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1",
                      canAfford && reward.canRedeem
                        ? cn(btnColors[colorIdx], "text-white")
                        : "bg-stone-200 text-stone-400 cursor-not-allowed",
                    )}
                  >
                    {isRedeeming ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : null}
                    {isRedeeming ? "..." : "Redeem"}
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                    ✓ Aktif
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
