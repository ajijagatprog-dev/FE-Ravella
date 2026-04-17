"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Loader2, Check, AlertCircle, Power } from "lucide-react";

export default function GlobalPointSettings({ 
  isEditing, 
  setIsEditing 
}: { 
  isEditing: boolean; 
  setIsEditing: (v: boolean) => void 
}) {
  const [multiplier, setMultiplier] = useState("10");
  const [redemption, setRedemption] = useState("5");
  const [expiration, setExpiration] = useState("12");
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);

  // Edit mode state data storage
  const [originalData, setOriginalData] = useState({ multiplier: "10", redemption: "5", expiration: "12" });

  const handleNumericChange = (value: string, setter: (v: string) => void) => {
    const cleaned = value.replace(/[^0-9]/g, "").replace(/^0+/, "") || "";
    setter(cleaned);
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingEnabled, setTogglingEnabled] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    api
      .get("/admin/loyalty/settings")
      .then((res) => {
        if (res.data.status === "success") {
          const m = String(res.data.data.earning_multiplier || "10");
          const r = String(res.data.data.redemption_value || "5");
          const e = String(res.data.data.point_expiration || "12");
          setMultiplier(m);
          setRedemption(r);
          setExpiration(e);
          setOriginalData({ multiplier: m, redemption: r, expiration: e });
          setLoyaltyEnabled(!!res.data.data.loyalty_enabled);
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load settings" }))
      .finally(() => setLoading(false));
  }, []);

  // Toggle loyalty system on/off
  const handleToggleLoyalty = async () => {
    const newValue = !loyaltyEnabled;
    const action = newValue ? "mengaktifkan" : "menonaktifkan";
    if (!confirm(`Apakah Anda yakin ingin ${action} sistem loyalty? Perubahan ini akan langsung berlaku.`)) return;

    setTogglingEnabled(true);
    setToast(null);
    try {
      await api.put("/admin/loyalty/settings", { loyalty_enabled: newValue });
      setLoyaltyEnabled(newValue);
      setToast({
        type: "success",
        msg: `Sistem loyalty berhasil ${newValue ? "diaktifkan" : "dinonaktifkan"}!`,
      });
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast({ type: "error", msg: "Gagal mengubah status loyalty" });
    } finally {
      setTogglingEnabled(false);
    }
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await api.put("/admin/loyalty/settings", {
        earning_multiplier: parseInt(multiplier) || 1,
        redemption_value: parseInt(redemption) || 1,
        point_expiration: parseInt(expiration) || 1,
      });
      if (res.data.status === "success") {
        setOriginalData({ multiplier, redemption, expiration });
        setIsEditing(false);
        setToast({ type: "success", msg: "Settings saved successfully!" });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", msg: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMultiplier(originalData.multiplier);
    setRedemption(originalData.redemption);
    setExpiration(originalData.expiration);
    setIsEditing(false);
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

      {/* ── Header + Disable Toggle ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Global Point Economy</h2>
          <p className="text-xs text-slate-400 mt-0.5">Configure how points are earned and redeemed</p>
        </div>

        {/* Disable Button */}
        <button
          onClick={handleToggleLoyalty}
          disabled={togglingEnabled || !isEditing}
          title={!isEditing ? "Aktifkan Edit Mode untuk mengubah status loyalty" : (loyaltyEnabled ? "Nonaktifkan sistem loyalty" : "Aktifkan sistem loyalty")}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border
            ${loyaltyEnabled
              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
              : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
            }
            ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {togglingEnabled ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Power size={14} />
          )}
          {loyaltyEnabled ? "Nonaktifkan Loyalty" : "Aktifkan Loyalty"}
        </button>
      </div>

      {/* ── Status Banner ── */}
      {!loyaltyEnabled && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Sistem Loyalty Dinonaktifkan</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Pelanggan tidak dapat earn atau redeem poin saat ini. Aktifkan kembali untuk melanjutkan program loyalty.
            </p>
          </div>
        </div>
      )}

      {/* ── Setting Cards ── */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${!loyaltyEnabled ? "opacity-40 pointer-events-none" : ""}`}>

        {/* Earning Multiplier */}
        <div className={`group border border-slate-200 rounded-xl p-4 space-y-3 transition-all bg-slate-50/50 ${isEditing ? "hover:border-blue-300 hover:shadow-sm" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Perolehan Poin</p>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={multiplier}
              readOnly={!isEditing}
              onChange={(e) => handleNumericChange(e.target.value, setMultiplier)}
              placeholder="10"
              className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-semibold bg-white transition-colors pr-12 focus:outline-none ${
                isEditing 
                  ? "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text" 
                  : "cursor-not-allowed text-slate-500 bg-slate-50/50"
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">pts</span>
          </div>
          <p className="text-xs text-slate-400">Points per Rp 10.000 spent</p>
        </div>

        {/* Redemption Value */}
        <div className={`group border border-slate-200 rounded-xl p-4 space-y-3 transition-all bg-slate-50/50 ${isEditing ? "hover:border-emerald-300 hover:shadow-sm" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Nilai Tukar Poin</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={redemption}
              readOnly={!isEditing}
              onChange={(e) => handleNumericChange(e.target.value, setRedemption)}
              placeholder="5"
              className={`w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-gray-900 text-sm font-semibold bg-white transition-colors focus:outline-none ${
                isEditing 
                  ? "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-text" 
                  : "cursor-not-allowed text-slate-500 bg-slate-50/50"
              }`}
            />
          </div>
          <p className="text-xs text-slate-400">Discount per 1 point redeemed</p>
        </div>

        {/* Point Expiration */}
        <div className={`group border border-slate-200 rounded-xl p-4 space-y-3 transition-all bg-slate-50/50 ${isEditing ? "hover:border-amber-300 hover:shadow-sm" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Masa Berlaku Poin</p>
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={expiration}
              readOnly={!isEditing}
              onChange={(e) => handleNumericChange(e.target.value, setExpiration)}
              placeholder="12"
              className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-semibold bg-white transition-colors pr-16 focus:outline-none ${
                isEditing 
                  ? "focus:ring-2 focus:ring-amber-500 focus:border-amber-400 cursor-text" 
                  : "cursor-not-allowed text-slate-500 bg-slate-50/50"
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">months</span>
          </div>
          <p className="text-xs text-slate-400">Points expire after this period</p>
        </div>
      </div>

      {/* ── Toast + Action Buttons ── */}
      <div className="flex items-center justify-between pt-1">
        {toast && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            toast.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </div>
        )}
        <div className="flex-1" />
        
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              disabled={!loyaltyEnabled}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Settings
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}