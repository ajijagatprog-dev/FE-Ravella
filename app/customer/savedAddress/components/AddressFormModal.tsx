"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "./AddressCard";

interface Props {
    open: boolean;
    editData: Address | null;
    onClose: () => void;
    onSave: (address: Omit<Address, "id" | "isPrimary">) => void;
}

const LABEL_OPTIONS = ["Home", "Office", "Parents' House", "Other"];

const EMPTY_FORM = {
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
};

// ── Field — didefinisikan di LUAR component agar tidak re-mount tiap render ──
interface FieldProps {
    label: string;
    field: string;
    placeholder: string;
    type?: string;
    value: string;
    error?: string;
    onChange: (field: string, value: string) => void;
}

function Field({ label, field, placeholder, type = "text", value, error, onChange }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "w-full h-10 px-3.5 text-sm rounded-xl border bg-white text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all",
                    error
                        ? "border-red-400"
                        : "border-stone-200 hover:border-stone-300 focus:border-blue-400"
                )}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AddressFormModal({ open, editData, onClose, onSave }: Props) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Populate form when open/editData changes
    useEffect(() => {
        if (!open) return;
        if (editData) {
            setForm({
                label: editData.label,
                fullName: editData.fullName,
                phone: editData.phone,
                street: editData.street,
                city: editData.city,
                province: editData.province,
                postalCode: editData.postalCode,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [editData, open]);

    // Lock scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // ESC close
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    const handleChange = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.fullName.trim()) e.fullName = "Name is required";
        if (!form.phone.trim()) e.phone = "Phone is required";
        if (!form.street.trim()) e.street = "Address is required";
        if (!form.city.trim()) e.city = "City is required";
        if (!form.postalCode.trim()) e.postalCode = "Postal code is required";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length > 0) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        onSave(form);
        setSaving(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <h2 className="text-base font-bold text-stone-800">
                                {editData ? "Edit Address" : "Add New Address"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                        {/* Label Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">
                                Address Label
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {LABEL_OPTIONS.map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => handleChange("label", l)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                            form.label === l
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-stone-600 border-stone-200 hover:border-blue-300"
                                        )}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Full Name" field="fullName" placeholder="Budi Setiawan"
                                value={form.fullName} error={errors.fullName} onChange={handleChange}
                            />
                            <Field
                                label="Phone Number" field="phone" placeholder="+62 812 3456 7890"
                                type="tel" value={form.phone} error={errors.phone} onChange={handleChange}
                            />
                        </div>

                        <Field
                            label="Street Address" field="street"
                            placeholder="Jl. Sudirman No. 45, Apt. City View Tower A Lt. 12"
                            value={form.street} error={errors.street} onChange={handleChange}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="City" field="city" placeholder="Jakarta Selatan"
                                value={form.city} error={errors.city} onChange={handleChange}
                            />
                            <Field
                                label="Province" field="province" placeholder="DKI Jakarta"
                                value={form.province} error={errors.province} onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="Postal Code" field="postalCode" placeholder="12190"
                                value={form.postalCode} error={errors.postalCode} onChange={handleChange}
                            />
                            <div />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2 px-6 py-4 border-t border-stone-100 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2",
                                saving
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                            )}
                        >
                            {saving ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                            ) : (
                                editData ? "Save Changes" : "Add Address"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}