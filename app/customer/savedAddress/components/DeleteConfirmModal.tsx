"use client";

import { useEffect } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface Props {
    open: boolean;
    addressLabel: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, addressLabel, onClose, onConfirm }: Props) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-6 h-6 text-rose-500" />
                    </div>

                    <h2 className="text-base font-bold text-stone-800 text-center mb-1">
                        Delete Address?
                    </h2>
                    <p className="text-sm text-stone-500 text-center mb-6">
                        Are you sure you want to delete your{" "}
                        <span className="font-semibold text-stone-700">{addressLabel}</span> address?
                        This action cannot be undone.
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors active:scale-[0.98]"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}