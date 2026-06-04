"use client";

import { useState } from "react";
import GlobalPointSettings from "./components/GlobalPointSettings";
import MembershipTiers from "./components/MembershipTiers";
import CustomerLoyaltyTable from "./components/CustomerLoyaltyTable";
import LoyaltyVouchers from "./components/LoyaltyVouchers";
import {
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Zap,
  Users,
  TrendingUp,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Shield,
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

// ─── Custom Confirm Modal ─────────────────────────────────────────────────────
function SyncConfirmModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Top gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <RefreshCw size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Sync Poin Loyalty
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sinkronisasi poin retroaktif
                </p>
              </div>
            </div>
            {!loading && (
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Info cards */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Shield size={15} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Aman &amp; Tidak Menduplikasi
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Sistem hanya akan memproses order yang <strong>belum</strong>{" "}
                  memiliki catatan poin. Order yang sudah tercatat tidak akan
                  diubah.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Zap size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700">
                  Cara Kerja Sync
                </p>
                <ol className="text-[11px] text-amber-600 mt-1 space-y-0.5 leading-relaxed list-decimal list-inside">
                  <li>
                    Scan semua order ber-status <strong>DELIVERED</strong>
                  </li>
                  <li>Filter order yang belum ada di riwayat poin</li>
                  <li>
                    Hitung poin = (Total Belanja ÷ Rp 10.000) × Multiplier
                  </li>
                  <li>Tambah poin ke saldo customer secara otomatis</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  Jalankan Sync
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sync Result Modal ────────────────────────────────────────────────────────
function SyncResultModal({
  result,
  onClose,
}: {
  result: SyncResult;
  onClose: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const isAllGood = result.synced_count === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isAllGood ? "Semua Sudah Sinkron ✓" : "Sync Berhasil! 🎉"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Menggunakan multiplier {result.multiplier_used}x
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ShoppingBag size={13} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-700">
                {result.synced_count}
              </p>
              <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                Order Disinkronkan
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={13} className="text-slate-500" />
              </div>
              <p className="text-2xl font-black text-slate-600">
                {result.skipped_count}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                Dilewati
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp size={13} className="text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-700">
                {result.details
                  .reduce((s, d) => s + d.points_awarded, 0)
                  .toLocaleString()}
              </p>
              <p className="text-[10px] font-semibold text-blue-600 mt-0.5">
                Total Poin Diberikan
              </p>
            </div>
          </div>

          {isAllGood ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Semua order DELIVERED sudah memiliki poin yang tercatat
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Tidak ada perubahan yang perlu dilakukan.
              </p>
            </div>
          ) : (
            <>
              {/* Toggle detail */}
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700 mb-3"
              >
                <span>Detail Poin per Order ({result.details.length})</span>
                {showDetail ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </button>

              {showDetail && (
                <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr className="border-b border-slate-200">
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">
                          Order
                        </th>
                        <th className="text-left px-3 py-2 font-semibold text-slate-500">
                          Customer
                        </th>
                        <th className="text-right px-3 py-2 font-semibold text-slate-500">
                          Total
                        </th>
                        <th className="text-right px-3 py-2 font-semibold text-slate-500">
                          Poin
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.details.map((d) => (
                        <tr key={d.order_number} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-slate-600 text-[10px]">
                            {d.order_number}
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-700">
                            {d.user}
                          </td>
                          <td className="px-3 py-2 text-right text-slate-600">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(d.amount)}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-emerald-600">
                            +{d.points_awarded.toLocaleString()} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-xl transition-all shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "vouchers">(
    "settings",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSyncConfirm = async () => {
    setSyncing(true);
    setSyncError(null);

    try {
      const res = await api.post("/admin/loyalty/sync-points");
      if (res.data.status === "success") {
        setSyncResult(res.data.data);
        setShowSyncConfirm(false);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSyncError(error?.response?.data?.message ?? "Gagal melakukan sync.");
      setShowSyncConfirm(false);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-5 mb-6">
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

          {activeTab === "settings" && (
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Sync Button */}
              <button
                onClick={() => setShowSyncConfirm(true)}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>

        {/* ── Error Banner ── */}
        {syncError && (
          <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 flex-1">{syncError}</p>
            <button
              onClick={() => setSyncError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all duration-200 ${
              activeTab === "settings"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Sistem &amp; Tier Membership
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all duration-200 ${
              activeTab === "vouchers"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Hadiah Voucher Loyalty
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="px-4 sm:px-6 lg:px-8 space-y-8 pb-10">
        {activeTab === "settings" ? (
          <>
            <GlobalPointSettings
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <MembershipTiers isEditing={isEditing} />
            <CustomerLoyaltyTable />
          </>
        ) : (
          <LoyaltyVouchers />
        )}
      </div>

      {/* ── Sync Confirm Modal ── */}
      {showSyncConfirm && (
        <SyncConfirmModal
          onConfirm={handleSyncConfirm}
          onCancel={() => !syncing && setShowSyncConfirm(false)}
          loading={syncing}
        />
      )}

      {/* ── Sync Result Modal ── */}
      {syncResult !== null && (
        <SyncResultModal
          result={syncResult}
          onClose={() => setSyncResult(null)}
        />
      )}
    </div>
  );
}
