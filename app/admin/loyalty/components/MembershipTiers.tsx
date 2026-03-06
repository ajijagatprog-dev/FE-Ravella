"use client";

import { useState, useEffect } from "react";
import TierCard from "./TierCard";
import TierEditModal from "./TierEditModal";
import api from "@/lib/axios";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface Tier {
  name: string;
  min: number;
  max: number | null;
  perks: string[];
}

export default function MembershipTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTier, setEditTier] = useState<Tier | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    api.get('/admin/loyalty/tiers')
      .then(res => {
        if (res.data.status === 'success') {
          setTiers(res.data.data);
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load tiers" }))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditTier({ ...tiers[index], perks: [...tiers[index].perks] });
  };

  const handleSave = async (updatedTier: Tier) => {
    setSaving(true);
    setToast(null);
    try {
      const newTiers = [...tiers];
      newTiers[editIndex] = updatedTier;
      const res = await api.put('/admin/loyalty/tiers', { tiers: newTiers });
      if (res.data.status === 'success') {
        setTiers(res.data.data);
        setEditTier(null);
        setToast({ type: "success", msg: `Tier "${updatedTier.name}" updated!` });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", msg: "Failed to update tier" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const tierName = tiers[index].name;
    if (!confirm(`Are you sure you want to delete the "${tierName}" tier?`)) return;

    setSaving(true);
    setToast(null);
    try {
      const newTiers = tiers.filter((_, i) => i !== index);
      const res = await api.put('/admin/loyalty/tiers', { tiers: newTiers });
      if (res.data.status === 'success') {
        setTiers(res.data.data);
        setToast({ type: "success", msg: `Tier "${tierName}" deleted!` });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ type: "error", msg: "Failed to delete tier" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-400 py-8">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm">Loading tiers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Membership Tiers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {tiers.length} tiers configured — Based on total lifetime spend
          </p>
        </div>
        {toast && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}>
            {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </div>
        )}
      </div>

      {/* ── Tier Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <TierCard
            key={`${tier.name}-${index}`}
            tier={tier}
            index={index}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>

      {/* ── Edit Modal ── */}
      {editTier && (
        <TierEditModal
          tier={editTier}
          isOpen={!!editTier}
          onClose={() => setEditTier(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}