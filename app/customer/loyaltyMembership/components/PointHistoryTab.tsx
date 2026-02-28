"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PointTransaction {
    id: string;
    description: string;
    date: string;
    points: number;
    type: "earn" | "redeem";
}

interface Props {
    transactions: PointTransaction[];
}

export default function PointHistoryTab({ transactions }: Props) {
    return (
        <div className="divide-y divide-stone-100">
            {transactions.map((item) => {
                const isEarn = item.type === "earn";
                return (
                    <div key={item.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                isEarn ? "bg-emerald-100" : "bg-rose-100"
                            )}
                        >
                            {isEarn ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <ArrowDownLeft className="w-4 h-4 text-rose-500" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-700">{item.description}</p>
                            <p className="text-xs text-stone-400">{item.date}</p>
                        </div>
                        <span
                            className={cn(
                                "text-sm font-bold flex-shrink-0",
                                isEarn ? "text-emerald-600" : "text-rose-500"
                            )}
                        >
                            {isEarn ? "+" : ""}
                            {item.points} pts
                        </span>
                    </div>
                );
            })}
        </div>
    );
}