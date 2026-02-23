"use client";

import { cn } from "@/lib/utils";

export interface Reward {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    points: number;
    canRedeem: boolean;
}

const titleColor = [
    "text-blue-700",
    "text-emerald-700",
    "text-violet-700",
    "text-rose-700",
];

const bgColor = [
    "bg-blue-50 border-blue-100",
    "bg-emerald-50 border-emerald-100",
    "bg-violet-50 border-violet-100",
    "bg-rose-50 border-rose-100",
];

interface Props {
    rewards: Reward[];
    availablePoints: number;
}

export default function RewardsTab({ rewards, availablePoints }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rewards.map((reward, i) => {
                const canAfford = availablePoints >= reward.points;
                return (
                    <div
                        key={reward.id}
                        className={cn(
                            "rounded-xl border p-4 flex flex-col gap-3 transition-all",
                            reward.canRedeem && canAfford
                                ? cn(bgColor[i % bgColor.length], "hover:shadow-sm")
                                : "bg-stone-50 border-stone-100 opacity-60"
                        )}
                    >
                        <div>
                            <p className={cn("text-xl font-black leading-tight", reward.canRedeem && canAfford ? titleColor[i % titleColor.length] : "text-stone-400")}>
                                {reward.title}
                            </p>
                            {reward.subtitle && (
                                <p className="text-xs font-semibold text-stone-500 mt-0.5">{reward.subtitle}</p>
                            )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-relaxed flex-1">
                            {reward.description}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-amber-600">
                                {reward.points.toLocaleString()} pts
                            </span>
                            <button
                                disabled={!canAfford || !reward.canRedeem}
                                className={cn(
                                    "text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all",
                                    canAfford && reward.canRedeem
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                                )}
                            >
                                Redeem
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}