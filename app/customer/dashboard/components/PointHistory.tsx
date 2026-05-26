"use client";

import Link from "next/link";
import { ShoppingBag, Gift, Loader2, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Transaction {
  id: string;
  description: string;
  points: number; // positive = earn, negative = redeem
  date: string;
  type: "earn" | "redeem";
}

export default function PointHistory({ profile }: { profile: any }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customer/loyalty")
      .then((res) => {
        if (res.data.status === "success") {
          const txs = res.data.data.transactions ?? [];
          setTransactions(txs.slice(0, 4)); // show only latest 4 on dashboard
        }
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
        <h3 className="text-sm font-bold text-stone-800">Point History</h3>
        {!loading && transactions.length > 0 && (
          <span className="text-[10px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {transactions.length} transaksi
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 divide-y divide-stone-100">
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-stone-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-stone-300">
            <Zap className="w-8 h-8" />
            <p className="text-xs font-medium text-stone-400">
              Belum ada riwayat poin
            </p>
            <p className="text-[11px] text-stone-400">
              Mulai belanja untuk mendapatkan poin!
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isEarn = tx.type === "earn";
            const Icon = isEarn ? ShoppingBag : Gift;
            const iconBg = isEarn ? "bg-blue-100" : "bg-rose-100";
            const iconColor = isEarn ? "text-blue-600" : "text-rose-500";
            const pointColor = isEarn ? "text-emerald-600" : "text-rose-500";
            const pointLabel = isEarn
              ? `+${Math.abs(tx.points).toLocaleString()}`
              : `-${Math.abs(tx.points).toLocaleString()}`;

            return (
              <div key={tx.id} className="flex items-center gap-3 px-6 py-3.5">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    iconBg,
                  )}
                >
                  <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-700 truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-stone-400">{tx.date}</p>
                </div>
                <span
                  className={cn("text-sm font-black flex-shrink-0", pointColor)}
                >
                  {pointLabel} pts
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 border-t border-stone-100 flex-shrink-0">
        <Link
          href="/customer/loyaltyMembership"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Full Log <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
