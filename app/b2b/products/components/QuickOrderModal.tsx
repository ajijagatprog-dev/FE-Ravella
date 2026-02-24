"use client";

import { useEffect, useState } from "react";
import { X, Zap, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickOrderItem {
    sku: string;
    qty: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (items: QuickOrderItem[]) => void;
}

export default function QuickOrderModal({ open, onClose, onSubmit }: Props) {
    const [items, setItems] = useState<QuickOrderItem[]>([
        { sku: "", qty: "" },
    ]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (open) { setItems([{ sku: "", qty: "" }]); setSubmitted(false); }
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    const addRow = () => setItems((p) => [...p, { sku: "", qty: "" }]);
    const removeRow = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof QuickOrderItem, value: string) =>
        setItems((p) => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

    const handleSubmit = async () => {
        const valid = items.filter((i) => i.sku.trim() && i.qty.trim());
        if (valid.length === 0) return;
        setSubmitted(true);
        await new Promise((r) => setTimeout(r, 1000));
        onSubmit(valid);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-stone-800">Quick Order</h2>
                                <p className="text-xs text-stone-400">Enter SKU and quantity to order fast</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
                        {/* Column Headers */}
                        <div className="grid grid-cols-[1fr_100px_32px] gap-2 mb-1">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">SKU / Product Name</p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Qty (PCS)</p>
                            <div />
                        </div>

                        {items.map((item, i) => (
                            <div key={i} className="grid grid-cols-[1fr_100px_32px] gap-2 items-center">
                                <input
                                    type="text"
                                    value={item.sku}
                                    onChange={(e) => updateItem(i, "sku", e.target.value)}
                                    placeholder="e.g. RV-2204-SB"
                                    className="h-10 px-3.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                />
                                <input
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => updateItem(i, "qty", e.target.value)}
                                    placeholder="12"
                                    min="1"
                                    className="h-10 px-3.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                                />
                                <button
                                    onClick={() => removeRow(i)}
                                    disabled={items.length === 1}
                                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-stone-300 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addRow}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add another item
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2 px-6 py-4 border-t border-stone-100 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitted}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2",
                                submitted
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                            )}
                        >
                            {submitted ? "Processing..." : "Submit Order"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}