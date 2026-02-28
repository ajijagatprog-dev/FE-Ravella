"use client";

import { Zap, AlertCircle } from "lucide-react";

interface Props {
    points: number;
    expiringPoints?: number;
    expiryDate?: string;
}

export default function PointsCard({ points, expiringPoints, expiryDate }: Props) {
    return (
        <div className="rounded-2xl bg-blue-600 p-6 flex flex-col justify-between text-white h-full">
            <div>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">
                    Available Points Balance
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tight leading-none">
                        {points.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-blue-300 mb-1">pts</span>
                </div>
            </div>

            {expiringPoints && expiryDate && (
                <div className="mt-5 flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0" />
                    <div>
                        <p className="text-[11px] font-semibold text-white leading-tight">
                            {expiringPoints} pts expiring soon
                        </p>
                        <p className="text-[10px] text-blue-200">Expires on {expiryDate}</p>
                    </div>
                </div>
            )}

            <button className="mt-4 w-full bg-white text-blue-600 text-sm font-bold py-2.5 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all">
                Redeem Points
            </button>
        </div>
    );
}