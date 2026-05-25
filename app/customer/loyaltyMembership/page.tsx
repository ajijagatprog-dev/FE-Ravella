"use client";

import { useState, useEffect, useCallback } from "react";
import TierCard, { type LoyaltyTier } from "./components/TierCard";
import PointsCard from "./components/PointsCard";
import RewardsTab, { type Reward } from "./components/RewardsTab";
import PointHistoryTab, {
  type PointTransaction,
} from "./components/PointHistoryTab";
import HowToEarnTab from "./components/HowToEarnTab";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, Copy, X } from "lucide-react";
import api from "@/lib/axios";

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Available Rewards", "Point History Log", "How to Earn"] as const;
type Tab = (typeof TABS)[number];

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoyaltyData {
  points: number;
  tier: LoyaltyTier;
  tier_progress: number;
  next_tier: string;
  member_since: string;
  total_spent: number;
  total_orders: number;
  benefits: { label: string; desc: string }[];
  transactions: PointTransaction[];
}

interface RedeemResult {
  voucher_code: string;
  voucher_description: string;
  points_spent: number;
  remaining_points: number;
}

// ── Toast Component ───────────────────────────────────────────────────────────
function VoucherSuccessToast({
  result,
  onClose,
}: {
  result: RedeemResult;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.voucher_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-white border border-emerald-200 shadow-2xl rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-bold text-stone-800">
              Penukaran Berhasil!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-3">
          Voucher{" "}
          <span className="font-semibold">{result.voucher_description}</span>{" "}
          berhasil ditambahkan. Gunakan kode berikut saat checkout:
        </p>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
          <span className="text-base font-black tracking-widest text-emerald-700 flex-1">
            {result.voucher_code}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-white border border-emerald-200 px-2.5 py-1.5 rounded-lg"
          >
            <Copy size={12} />
            {copied ? "Copied!" : "Salin"}
          </button>
        </div>
        <p className="text-[11px] text-stone-400 mt-2 text-center">
          Poin terpakai: {result.points_spent.toLocaleString()} pts • Sisa poin:{" "}
          {result.remaining_points.toLocaleString()} pts
        </p>
      </div>
    </div>
  );
}

// ── Error Toast ───────────────────────────────────────────────────────────────
function ErrorToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div className="bg-white border border-red-200 shadow-2xl rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-semibold text-stone-700 flex-1">
            {message}
          </p>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LoyaltyMembershipPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Available Rewards");
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  // Rewards state
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);

  // Redeem state
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<RedeemResult | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Fetch main loyalty data
  const fetchLoyaltyData = useCallback(() => {
    setLoading(true);
    api
      .get("/customer/loyalty")
      .then((res) => {
        if (res.data.status === "success") {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load loyalty data", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch rewards from backend
  const fetchRewards = useCallback(() => {
    setRewardsLoading(true);
    api
      .get("/customer/loyalty/rewards")
      .then((res) => {
        if (res.data.status === "success") {
          const rawRewards = res.data.data?.rewards ?? res.data.data ?? [];
          setRewards(rawRewards);
        }
      })
      .catch((err) => console.error("Failed to load rewards", err))
      .finally(() => setRewardsLoading(false));
  }, []);

  useEffect(() => {
    fetchLoyaltyData();
    fetchRewards();
  }, [fetchLoyaltyData, fetchRewards]);

  // Handle redeem
  const handleRedeem = async (reward: Reward) => {
    if (!reward.voucher_id || !reward.points_required) return;

    setRedeemingId(reward.id);
    setRedeemError(null);
    setRedeemSuccess(null);

    try {
      const res = await api.post("/customer/loyalty/redeem", {
        voucher_id: reward.voucher_id,
        points_to_spend: reward.points_required,
      });

      if (res.data.status === "success") {
        setRedeemSuccess(res.data.data);
        // Refresh data after successful redeem
        fetchLoyaltyData();
        fetchRewards();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg =
        error?.response?.data?.message ?? "Gagal menukar poin. Coba lagi.";
      setRedeemError(msg);
      setTimeout(() => setRedeemError(null), 5000);
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 size={24} className="animate-spin text-blue-500" />
        <p className="text-sm text-stone-400">Loading loyalty data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-stone-400">
        <p className="text-sm">Gagal memuat data loyalty. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">
          Customer Loyalty Rewards Center
        </h1>
        <p className="text-sm text-stone-500">
          Unlock exclusive benefits and redeem your earned points.
        </p>
      </div>

      {/* ── Top Section: Tier + Points ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <TierCard
            tier={data.tier}
            activeSince={data.member_since}
            benefits={data.benefits}
            progressToNext={data.tier_progress}
            nextTier={data.next_tier}
            totalSpent={data.total_spent}
          />
        </div>
        <div>
          <PointsCard points={data.points} />
        </div>
      </div>

      {/* ── Tabs Section ── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-stone-100">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 text-sm font-medium py-3.5 transition-all duration-150",
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === "Available Rewards" && (
            <RewardsTab
              rewards={rewards}
              availablePoints={data.points}
              loading={rewardsLoading}
              onRedeem={handleRedeem}
              redeemingId={redeemingId}
            />
          )}
          {activeTab === "Point History Log" && (
            <PointHistoryTab transactions={data.transactions} />
          )}
          {activeTab === "How to Earn" && <HowToEarnTab />}
        </div>
      </div>

      {/* ── Toast Notifications ── */}
      {redeemSuccess && (
        <VoucherSuccessToast
          result={redeemSuccess}
          onClose={() => setRedeemSuccess(null)}
        />
      )}
      {redeemError && (
        <ErrorToast
          message={redeemError}
          onClose={() => setRedeemError(null)}
        />
      )}
    </div>
  );
}
