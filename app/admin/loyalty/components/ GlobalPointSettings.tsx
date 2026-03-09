"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2, Check, AlertCircle } from "lucide-react";

export default function GlobalPointSettings() {
  const [multiplier, setMultiplier] = useState("10");
  const [redemption, setRedemption] = useState("5");
  const [expiration, setExpiration] = useState("12");

  const handleNumericChange = (value: string, setter: (v: string) => void) => {
    const cleaned = value.replace(/[^0-9]/g, '').replace(/^0+/, '') || '';
    setter(cleaned);
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    api.get('/admin/loyalty/settings')
      .then(res => {
        if (res.data.status === 'success') {
          setMultiplier(String(res.data.data.earning_multiplier));
          setRedemption(String(res.data.data.redemption_value));
          setExpiration(String(res.data.data.point_expiration));
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load settings" }))
      .finally(() => setLoading(false));
  }, []);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await api.put('/admin/loyalty/settings', {
        earning_multiplier: parseInt(multiplier) || 1,
        redemption_value: parseInt(redemption) || 1,
        point_expiration: parseInt(expiration) || 1,
      });
      if (res.data.status === 'success') {
        setToast({ type: "success", msg: "Settings saved successfully!" });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", msg: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-center justify-center gap-2 text-slate-400">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Global Point Economy
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure how points are earned and redeemed
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* ── Setting Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Earning Multiplier */}
        <div className="group border border-slate-200 rounded-xl p-4 space-y-3 hover:border-blue-300 hover:shadow-sm transition-all bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              Earning Multiplier
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={multiplier}
              onChange={(e) => handleNumericChange(e.target.value, setMultiplier)}
              placeholder="10"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              pts
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Points per Rp 10.000 spent
          </p>
        </div>

        {/* Redemption Value */}
        <div className="group border border-slate-200 rounded-xl p-4 space-y-3 hover:border-emerald-300 hover:shadow-sm transition-all bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              Redemption Value
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={redemption}
              onChange={(e) => handleNumericChange(e.target.value, setRedemption)}
              placeholder="5"
              className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-gray-900 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
          <p className="text-xs text-slate-400">
            Discount per 1 point redeemed
          </p>
        </div>

        {/* Point Expiration */}
        <div className="group border border-slate-200 rounded-xl p-4 space-y-3 hover:border-amber-300 hover:shadow-sm transition-all bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              Point Expiration
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={expiration}
              onChange={(e) => handleNumericChange(e.target.value, setExpiration)}
              placeholder="12"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition-colors pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              months
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Points expire after this period
          </p>
        </div>

      </div>

      {/* ── Toast + Save Button ── */}
      <div className="flex items-center justify-between pt-1">
        {toast && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${toast.type === "success"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
            }`}>
            {toast.type === "success"
              ? <Check size={14} />
              : <AlertCircle size={14} />
            }
            {toast.msg}
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

    </div>
  );
}