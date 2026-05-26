"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Gift, Ticket, Star } from "lucide-react";
import api from "@/lib/axios";

interface ClaimableReward {
    id: string;
    label: string;
    type: "bonus_points" | "voucher_code";
    points?: number;
    voucher_id?: number;
    one_time: boolean;
}

interface Tier {
    name: string;
    label?: string;
    min: number;
    max: number | null;
    perks: string[];
    claimable_rewards?: ClaimableReward[];
}

interface Voucher {
    id: number;
    code: string;
    description: string;
    type: string;
    value: string;
}

interface TierEditModalProps {
    tier: Tier;
    isOpen: boolean;
    onClose: () => void;
    onSave: (tier: Tier) => void;
    saving: boolean;
    mode?: "edit" | "add";
}

const DEFAULT_LABELS: Record<string, string> = {
    Basic: "Entry Level",
    Gold: "Most Popular",
    Platinum: "Premium",
};

export default function TierEditModal({ tier, isOpen, onClose, onSave, saving, mode = "edit" }: TierEditModalProps) {
    const getLabel = (t: Tier) => t.label || DEFAULT_LABELS[t.name] || "";

    const [name, setName] = useState(tier.name);
    const [label, setLabel] = useState(getLabel(tier));
    const [min, setMin] = useState(String(tier.min));
    const [max, setMax] = useState(tier.max !== null ? String(tier.max) : "");
    const [perks, setPerks] = useState<string[]>(tier.perks);
    const [newPerk, setNewPerk] = useState("");

    // Claimable rewards state
    const [claimableRewards, setClaimableRewards] = useState<ClaimableReward[]>(tier.claimable_rewards ?? []);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [showAddReward, setShowAddReward] = useState(false);
    const [newReward, setNewReward] = useState<Partial<ClaimableReward>>({
        type: "bonus_points",
        one_time: true,
        points: 500,
    });

    useEffect(() => {
        setName(tier.name);
        setLabel(getLabel(tier));
        setMin(String(tier.min));
        setMax(tier.max !== null ? String(tier.max) : "");
        setPerks([...tier.perks]);
        setClaimableRewards(tier.claimable_rewards ?? []);
        setNewPerk("");
        setShowAddReward(false);
    }, [tier, isOpen]);

    useEffect(() => {
        // Fetch active vouchers for dropdown
        api.get("/admin/vouchers")
            .then((res) => {
                if (res.data.status === "success") {
                    setVouchers(res.data.data?.filter((v: Voucher & { is_active: boolean }) => v.is_active) ?? []);
                }
            })
            .catch(() => { });
    }, []);

    if (!isOpen) return null;

    const handleNumeric = (val: string) => val.replace(/[^0-9]/g, "").replace(/^0+/, "") || "";

    const handleAddPerk = () => {
        if (newPerk.trim()) {
            setPerks([...perks, newPerk.trim()]);
            setNewPerk("");
        }
    };

    const handleEditPerk = (index: number, value: string) => {
        const updated = [...perks];
        updated[index] = value;
        setPerks(updated);
    };

    const handleRemovePerk = (index: number) => {
        setPerks(perks.filter((_, i) => i !== index));
    };

    const handleAddClaimableReward = () => {
        if (!newReward.label?.trim()) return;
        if (newReward.type === "bonus_points" && (!newReward.points || newReward.points <= 0)) return;
        if (newReward.type === "voucher_code" && !newReward.voucher_id) return;

        const reward: ClaimableReward = {
            id: `${name.toLowerCase()}_${Date.now()}`,
            label: newReward.label!.trim(),
            type: newReward.type as "bonus_points" | "voucher_code",
            one_time: newReward.one_time ?? true,
            ...(newReward.type === "bonus_points" && { points: newReward.points }),
            ...(newReward.type === "voucher_code" && { voucher_id: newReward.voucher_id }),
        };
        setClaimableRewards([...claimableRewards, reward]);
        setShowAddReward(false);
        setNewReward({ type: "bonus_points", one_time: true, points: 500 });
    };

    const handleRemoveClaimableReward = (index: number) => {
        setClaimableRewards(claimableRewards.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        let allPerks = [...perks];
        if (newPerk.trim()) allPerks.push(newPerk.trim());
        const cleanedPerks = allPerks.filter((p) => p.trim() !== "");
        onSave({
            name,
            label: label.trim() || undefined,
            min: parseInt(min) || 0,
            max: max ? parseInt(max) : null,
            perks: cleanedPerks,
            claimable_rewards: claimableRewards,
        });
    };

    const getVoucherLabel = (v: Voucher) =>
        `${v.code} — ${v.type === "percent" ? `${v.value}% OFF` : `Rp ${Number(v.value).toLocaleString("id-ID")}`} (${v.description ?? ""})`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {mode === "add" ? "Add New Tier" : `Edit Tier: ${tier.name}`}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tier Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Basic, Silver, Gold, Diamond, Platinum, VIP..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Label */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tier Label / Kelas</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Entry Level, Most Popular, Premium, Exclusive..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Min/Max */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Spend (Rp)</label>
                            <input
                                type="text" inputMode="numeric" value={min}
                                onChange={(e) => setMin(handleNumeric(e.target.value))}
                                placeholder="0"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {min && <p className="text-xs text-gray-400 mt-1">Rp {parseInt(min).toLocaleString("id-ID")}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Spend (Rp)</label>
                            <input
                                type="text" inputMode="numeric" value={max}
                                onChange={(e) => setMax(handleNumeric(e.target.value))}
                                placeholder="Unlimited"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {max ? (
                                <p className="text-xs text-gray-400 mt-1">Rp {parseInt(max).toLocaleString("id-ID")}</p>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">No limit (highest tier)</p>
                            )}
                        </div>
                    </div>

                    {/* Perks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Perks &amp; Benefits ({perks.length})
                        </label>
                        <div className="space-y-2">
                            {perks.map((perk, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30 transition-colors group">
                                    <div className="pl-3 py-2 text-gray-300 group-hover:text-gray-400">
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
                                            <circle cx="2" cy="2" r="1.5" /><circle cx="6" cy="2" r="1.5" />
                                            <circle cx="2" cy="7" r="1.5" /><circle cx="6" cy="7" r="1.5" />
                                            <circle cx="2" cy="12" r="1.5" /><circle cx="6" cy="12" r="1.5" />
                                        </svg>
                                    </div>
                                    <input type="text" value={perk} onChange={(e) => handleEditPerk(index, e.target.value)}
                                        className="flex-1 text-sm text-gray-700 bg-transparent py-2 focus:outline-none" placeholder="Enter benefit..." />
                                    <button onClick={() => handleRemovePerk(index)} className="p-1.5 mr-1.5 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <input type="text" value={newPerk} onChange={(e) => setNewPerk(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddPerk()}
                                placeholder="Add new benefit..."
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            <button onClick={handleAddPerk} disabled={!newPerk.trim()}
                                className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ── Claimable Rewards ──────────────────────────────────────────────────── */}
                    <div className="border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    🎁 Claimable Rewards ({claimableRewards.length})
                                </label>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Reward yang bisa diklaim customer saat mencapai tier ini
                                </p>
                            </div>
                            {!showAddReward && (
                                <button onClick={() => setShowAddReward(true)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                                    <Plus size={13} /> Tambah
                                </button>
                            )}
                        </div>

                        {/* Existing claimable rewards list */}
                        {claimableRewards.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {claimableRewards.map((cr, idx) => (
                                    <div key={cr.id} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                            {cr.type === "voucher_code" ? (
                                                <Ticket size={14} className="text-amber-600" />
                                            ) : (
                                                <Star size={14} className="text-amber-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-amber-800 truncate">{cr.label}</p>
                                            <p className="text-[11px] text-amber-600">
                                                {cr.type === "voucher_code"
                                                    ? `Voucher #${cr.voucher_id}`
                                                    : `+${cr.points?.toLocaleString()} poin`}
                                                {cr.one_time && " · Sekali klaim"}
                                            </p>
                                        </div>
                                        <button onClick={() => handleRemoveClaimableReward(idx)}
                                            className="p-1 rounded-lg hover:bg-amber-200 text-amber-400 hover:text-amber-700 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add new claimable reward form */}
                        {showAddReward && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                                <p className="text-xs font-semibold text-emerald-800">Tambah Reward Baru</p>

                                {/* Label */}
                                <input type="text" placeholder="Label reward (e.g. Welcome Gold Voucher)"
                                    value={newReward.label ?? ""} onChange={(e) => setNewReward({ ...newReward, label: e.target.value })}
                                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />

                                {/* Type */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setNewReward({ ...newReward, type: "bonus_points" })}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${newReward.type === "bonus_points" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                                        <Gift size={13} /> Bonus Poin
                                    </button>
                                    <button onClick={() => setNewReward({ ...newReward, type: "voucher_code" })}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${newReward.type === "voucher_code" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                                        <Ticket size={13} /> Voucher
                                    </button>
                                </div>

                                {/* Type-specific fields */}
                                {newReward.type === "bonus_points" ? (
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">Jumlah Poin</label>
                                        <input type="number" min={1} placeholder="500"
                                            value={newReward.points ?? ""}
                                            onChange={(e) => setNewReward({ ...newReward, points: parseInt(e.target.value) || 0 })}
                                            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs text-gray-600 mb-1 block">Pilih Voucher</label>
                                        <select value={newReward.voucher_id ?? ""}
                                            onChange={(e) => setNewReward({ ...newReward, voucher_id: parseInt(e.target.value) || undefined })}
                                            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                            <option value="">-- Pilih Voucher --</option>
                                            {vouchers.map((v) => (
                                                <option key={v.id} value={v.id}>{getVoucherLabel(v)}</option>
                                            ))}
                                        </select>
                                        {vouchers.length === 0 && (
                                            <p className="text-xs text-amber-600 mt-1">⚠ Belum ada voucher aktif. Buat voucher di menu Voucher dulu.</p>
                                        )}
                                    </div>
                                )}

                                {/* One-time toggle */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newReward.one_time ?? true}
                                        onChange={(e) => setNewReward({ ...newReward, one_time: e.target.checked })}
                                        className="rounded" />
                                    <span className="text-xs text-gray-700">Hanya bisa diklaim sekali (one-time)</span>
                                </label>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button onClick={handleAddClaimableReward}
                                        disabled={!newReward.label?.trim() || (newReward.type === "bonus_points" && !newReward.points) || (newReward.type === "voucher_code" && !newReward.voucher_id)}
                                        className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                        Tambah Reward
                                    </button>
                                    <button onClick={() => setShowAddReward(false)}
                                        className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                                        Batal
                                    </button>
                                </div>
                            </div>
                        )}

                        {claimableRewards.length === 0 && !showAddReward && (
                            <div className="text-center py-4 text-gray-400">
                                <Gift size={20} className="mx-auto mb-1 opacity-40" />
                                <p className="text-xs">Belum ada reward yang bisa diklaim. Klik &quot;Tambah&quot; untuk membuat.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving || !name.trim() || perks.length === 0}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
