"use client";

import { Download, Zap } from "lucide-react";

interface Props {
    total: number;
    onExportPDF: () => void;
    onQuickOrder: () => void;
}

export default function CatalogHeader({ total, onExportPDF, onQuickOrder }: Props) {
    return (
        <div className="flex items-start justify-between gap-4 mb-5">
            <div>
                <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                    Catalog Products
                </h1>
                <p className="text-sm text-stone-400 mt-0.5">
                    Autumn/Winter 2026 Collection •{" "}
                    <span className="font-semibold text-stone-600">{total} items available</span>
                </p>
            </div>

            {/* TODO: Add export PDF and quick order (optional) */}
            {/* <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={onExportPDF}
                    className="flex items-center gap-2 text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl transition-all active:scale-[0.97]"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
                <button
                    onClick={onQuickOrder}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"
                >
                    <Zap className="w-4 h-4" />
                    Quick Order
                </button>
            </div> */}
        </div>
    );
}