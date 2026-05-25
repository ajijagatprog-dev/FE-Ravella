"use client";

import { useState } from "react";
import GlobalPointSettings from "./components/GlobalPointSettings";
import MembershipTiers from "./components/MembershipTiers";
import CustomerLoyaltyTable from "./components/CustomerLoyaltyTable";
import {
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "@/lib/axios";

interface SyncResult {
  synced_count: number;
  skipped_count: number;
  multiplier_used: number;
  details: {
    order_number: string;
    user: string;
    amount: number;
    points_awarded: number;
  }[];
}

export default function LoyaltyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showSyncDetail, setShowSyncDetail] = useState(false);

  const handleSyncPoints = async () => {
    if (
      !confirm(
        "Jalankan sync poin loyalty?\n\nIni akan memberikan poin ke semua order DELIVERED yang belum tercatat. Proses ini aman dan tidak akan menduplikasi poin.",
      )
    )
      return;

    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);

    try {
      const res = await api.post("/admin/loyalty/sync-points");
      if (res.data.status === "success") {
        setSyncResult(res.data.data);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSyncError(error?.response?.data?.message ?? "Gagal melakukan sync.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Loyalty Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Configure membership tiers, manage point economy, and monitor
              customer engagement.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Sync Button */}
            <button
              onClick={handleSyncPoints}
              disabled={syncing}
              title="Sinkronkan poin untuk order DELIVERED yang belum tercatat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {syncing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              <span>{syncing ? "Syncing..." : "Sync Poin"}</span>
            </button>

            {/* Edit Mode Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border shrink-0
                ${
                  isEditing
                    ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {isEditing ? <Unlock size={16} /> : <Lock size={16} />}
              <span className="hidden xs:inline">
                {isEditing ? "Exit Edit Mode" : "Edit Loyalty System"}
              </span>
              <span className="xs:hidden">{isEditing ? "Exit" : "Edit"}</span>
            </button>
          </div>
        </div>

        {/* ── Sync Result Banner ── */}
        {syncResult !== null && (
          <div className="mt-4 border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Sync berhasil! {syncResult.synced_count} order disinkronkan
                    {syncResult.skipped_count > 0 &&
                      `, ${syncResult.skipped_count} dilewati`}
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Menggunakan multiplier: {syncResult.multiplier_used}x
                  </p>
                  {syncResult.synced_count === 0 && (
                    <p className="text-xs text-emerald-600">
                      Semua order sudah memiliki poin tercatat. ✓
                    </p>
                  )}
                </div>
              </div>
              {syncResult.synced_count > 0 && (
                <button
                  onClick={() => setShowSyncDetail(!showSyncDetail)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 shrink-0"
                >
                  {showSyncDetail ? "Sembunyikan" : "Lihat Detail"}
                </button>
              )}
            </div>

            {/* Detail table */}
            {showSyncDetail && syncResult.details.length > 0 && (
              <div className="mt-3 overflow-auto">
                <table className="w-full text-xs text-emerald-800">
                  <thead>
                    <tr className="border-b border-emerald-200">
                      <th className="text-left py-1.5 font-semibold">Order</th>
                      <th className="text-left py-1.5 font-semibold">
                        Customer
                      </th>
                      <th className="text-right py-1.5 font-semibold">Total</th>
                      <th className="text-right py-1.5 font-semibold">
                        Poin Diberikan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncResult.details.map((d) => (
                      <tr
                        key={d.order_number}
                        className="border-b border-emerald-100/50"
                      >
                        <td className="py-1.5 font-mono">{d.order_number}</td>
                        <td className="py-1.5">{d.user}</td>
                        <td className="py-1.5 text-right">
                          Rp {d.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="py-1.5 text-right font-bold">
                          +{d.points_awarded.toLocaleString()} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {syncError && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{syncError}</p>
          </div>
        )}
      </div>

      {/* ── Main Content Area ── */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-10">
        <GlobalPointSettings
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
        <MembershipTiers isEditing={isEditing} />
        <CustomerLoyaltyTable />
      </div>
    </div>
  );
}
