"use client";

import { MapPin, Edit2, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Address {
    id: string;
    label: string;
    isPrimary: boolean;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
}

interface Props {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
    onSetPrimary: (id: string) => void;
}

const labelColors: Record<string, string> = {
    HOME: "bg-blue-100 text-blue-700",
    OFFICE: "bg-stone-100 text-stone-600",
    "PARENTS' HOUSE": "bg-purple-100 text-purple-700",
};

export default function AddressCard({ address, onEdit, onDelete, onSetPrimary }: Props) {
    const labelKey = address.label.toUpperCase();
    const labelStyle = labelColors[labelKey] ?? "bg-stone-100 text-stone-600";

    return (
        <div
            className={cn(
                "relative bg-white rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200",
                address.isPrimary
                    ? "border-blue-300 shadow-sm shadow-blue-100"
                    : "border-stone-200 hover:border-stone-300"
            )}
        >
            {/* Label Row */}
            <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded", labelStyle)}>
                    {address.label}
                </span>
                {address.isPrimary && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-widest">
                        Primary
                    </span>
                )}
            </div>

            {/* Address Info */}
            <div className="flex-1">
                <p className="text-sm font-bold text-stone-800">{address.fullName}</p>
                <p className="text-xs text-stone-500 mt-0.5">{address.phone}</p>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {address.street},<br />
                    {address.city}, {address.postalCode}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(address)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(address.id)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>

                {address.isPrimary ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                ) : (
                    <button
                        onClick={() => onSetPrimary(address.id)}
                        className="text-xs font-semibold text-stone-400 hover:text-blue-600 transition-colors"
                    >
                        Set as Primary
                    </button>
                )}
            </div>
        </div>
    );
}