"use client";

import { useState, useEffect } from "react";
import TierCard from "./TierCard";
import TierEditModal from "./TierEditModal";
import api from "@/lib/axios";
import { Loader2, Check, AlertCircle, Plus, Trash2, X } from "lucide-react";

interface Tier {
  name: string;
  label?: string;
  min: number;
  max: number | null;
  perks: string[];
}

/* ─── Delete Confirm Toast ─────────────────────────────────────────────────── */
function DeleteConfirmToast({
  tierName,
  onConfirm,
  onCancel,
}: {
  tierName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 bg-white border border-slate-200 shadow-xl rounded-2xl px-5 py-4 min-w-[360px]">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Hapus Tier?</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Tier{" "}
            <span className="font-semibold text-red-500">"{tierName}"</span>{" "}
            akan dihapus permanen
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Hapus
          </button>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function MembershipTiers({ isEditing }: { isEditing: boolean }) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editTier, setEditTier] = useState<Tier | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    index: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    api
      .get("/admin/loyalty/tiers")
      .then((res) => {
        if (res.data.status === "success") {
          setTiers(res.data.data);
        }
      })
      .catch(() => setToast({ type: "error", msg: "Failed to load tiers" }))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    // Spread all data including label so it pre-populates in the modal
    setEditTier({ ...tiers[index], perks: [...tiers[index].perks] });
  };

  const handleAddNew = () => {
    const newTier: Tier = { name: "", label: "", min: 0, max: null, perks: [] };
    setEditTier(newTier);
    setEditIndex(-1);
    setIsAddingNew(true);
  };

  const handleSaveNew = async (newTier: Tier) => {
    setSaving(true);
    try {
      const newTiers = [...tiers, newTier];
      const res = await api.put("/admin/loyalty/tiers", { tiers: newTiers });
      if (res.data.status === "success") {
        setTiers(res.data.data);
        setEditTier(null);
        setIsAddingNew(false);
        showToast("success", `Tier "${newTier.name}" berhasil ditambahkan!`);
      } else {
        showToast("error", "Server response unexpected");
      }
    } catch (err) {
      console.error("Failed to add tier:", err);
      showToast("error", "Gagal menambahkan tier. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (updatedTier: Tier) => {
    setSaving(true);
    try {
      const newTiers = [...tiers];
      newTiers[editIndex] = updatedTier;
      const res = await api.put("/admin/loyalty/tiers", { tiers: newTiers });
      if (res.data.status === "success") {
        setTiers(res.data.data);
        setEditTier(null);
        setEditIndex(-1);
        showToast("success", `Tier "${updatedTier.name}" berhasil diperbarui!`);
      } else {
        showToast("error", "Server response unexpected");
      }
    } catch (err) {
      console.error("Failed to save tier:", err);
      showToast("error", "Gagal menyimpan tier. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  // Step 1: show confirm toast (no browser alert)
  const handleDeleteRequest = (index: number) => {
    setDeleteConfirm({ index, name: tiers[index].name });
  };

  // Step 2: confirmed — do the actual delete
  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return;
    const { index, name } = deleteConfirm;
    setDeleteConfirm(null);
    setSaving(true);
    try {
      const newTiers = tiers.filter((_, i) => i !== index);
      const res = await api.put("/admin/loyalty/tiers", { tiers: newTiers });
      if (res.data.status === "success") {
        setTiers(res.data.data);
        showToast("success", `Tier "${name}" berhasil dihapus!`);
      } else {
        showToast("error", "Gagal menghapus tier.");
      }
    } catch {
      showToast("error", "Gagal menghapus tier. Coba lagi.");
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
        {/* Toast notification */}
        {toast && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            {toast.msg}
          </div>
        )}
      </div>

      {/* ── Tier Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <TierCard
            key={`${tier.name}-${index}-${tier.label}-${tier.perks?.length ?? 0}-${tier.perks?.join(",")}`}
            tier={tier}
            index={index}
            isEditing={isEditing}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDeleteRequest(index)}
          />
        ))}

        {/* ── Add New Tier Card ── */}
        {isEditing && (
          <button
            onClick={handleAddNew}
            className="flex flex-col items-center justify-center gap-3 min-h-[220px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus
                size={22}
                className="text-slate-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                Add New Tier
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Create a membership level
              </p>
            </div>
          </button>
        )}
      </div>

      {/* ── Edit / Add Modal ── */}
      {editTier && (
        <TierEditModal
          tier={editTier}
          isOpen={!!editTier}
          onClose={() => {
            setEditTier(null);
            setIsAddingNew(false);
          }}
          onSave={isAddingNew ? handleSaveNew : handleSave}
          saving={saving}
          mode={isAddingNew ? "add" : "edit"}
        />
      )}

      {/* ── Delete Confirm Toast ── */}
      {deleteConfirm && (
        <DeleteConfirmToast
          tierName={deleteConfirm.name}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
