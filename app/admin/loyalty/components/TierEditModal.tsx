"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";

interface Tier {
    name: string;
    min: number;
    max: number | null;
    perks: string[];
}

interface TierEditModalProps {
    tier: Tier;
    isOpen: boolean;
    onClose: () => void;
    onSave: (tier: Tier) => void;
    saving: boolean;
}

export default function TierEditModal({ tier, isOpen, onClose, onSave, saving }: TierEditModalProps) {
    const [name, setName] = useState(tier.name);
    const [min, setMin] = useState(String(tier.min));
    const [max, setMax] = useState(tier.max !== null ? String(tier.max) : "");
    const [perks, setPerks] = useState<string[]>(tier.perks);
    const [newPerk, setNewPerk] = useState("");

    useEffect(() => {
        setName(tier.name);
        setMin(String(tier.min));
        setMax(tier.max !== null ? String(tier.max) : "");
        setPerks([...tier.perks]);
        setNewPerk("");
    }, [tier, isOpen]);

    if (!isOpen) return null;

    const handleNumeric = (val: string) => val.replace(/[^0-9]/g, "").replace(/^0+/, "") || "";

    const handleAddPerk = () => {
        if (newPerk.trim()) {
            setPerks([...perks, newPerk.trim()]);
            setNewPerk("");
        }
    };

    const handleRemovePerk = (index: number) => {
        setPerks(perks.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        onSave({
            name,
            min: parseInt(min) || 0,
            max: max ? parseInt(max) : null,
            perks,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Tier: {tier.name}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tier Name</label>
                        <select
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="Basic">Basic</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                    </div>

                    {/* Min/Max Spend */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Spend (Rp)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={min}
                                onChange={(e) => setMin(handleNumeric(e.target.value))}
                                placeholder="0"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {min && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Rp {parseInt(min).toLocaleString("id-ID")}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Spend (Rp)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={max}
                                onChange={(e) => setMax(handleNumeric(e.target.value))}
                                placeholder="Unlimited"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {max ? (
                                <p className="text-xs text-gray-400 mt-1">
                                    Rp {parseInt(max).toLocaleString("id-ID")}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">No limit (highest tier)</p>
                            )}
                        </div>
                    </div>

                    {/* Perks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Perks & Benefits ({perks.length})
                        </label>
                        <div className="space-y-2">
                            {perks.map((perk, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                                >
                                    <span className="flex-1 text-sm text-gray-700">{perk}</span>
                                    <button
                                        onClick={() => handleRemovePerk(index)}
                                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add new perk */}
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                value={newPerk}
                                onChange={(e) => setNewPerk(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddPerk()}
                                placeholder="Add new benefit..."
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleAddPerk}
                                disabled={!newPerk.trim()}
                                className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || !name.trim() || perks.length === 0}
                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
