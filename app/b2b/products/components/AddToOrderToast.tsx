"use client";

import { useEffect } from "react";
import { CheckCircle, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    productName: string | null;
    onClose: () => void;
}

export default function AddToOrderToast({ productName, onClose }: Props) {
    useEffect(() => {
        if (!productName) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [productName, onClose]);

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl transition-all duration-300",
                productName
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
            )}
        >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-white leading-tight">{productName}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Added to your order</p>
            </div>
            <a
                href="/b2b/keranjang"
                className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors ml-2 whitespace-nowrap"
            >
                <ShoppingCart className="w-3.5 h-3.5" />
                View Cart
            </a>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}