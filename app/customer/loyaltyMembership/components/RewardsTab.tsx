"use client";

import { cn } from "@/lib/utils";
import { Tag, Truck, Gift, Ticket, Zap, Loader2 } from "lucide-react";

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
}

export default function RewardsTab({
  rewards,
  availablePoints,
  loading,
  onRedeem,
  redeemingId,
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
    <div className="space-y-4">
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
