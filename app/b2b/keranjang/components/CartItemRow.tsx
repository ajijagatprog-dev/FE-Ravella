"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "../types";

const formatIDR = (n: number) =>
    "Rp " + Math.round(n).toLocaleString("id-ID");

interface Props {
    item: CartItemType;
    onUpdateQty: (productId: string, qty: number) => void;
    onRemove: (productId: string) => void;
}

export default function CartItemRow({ item, onUpdateQty, onRemove }: Props) {
    const { product, qty } = item;
    const subtotal = product.price * qty;
    const canDecrease = qty > 1;

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4 items-start hover:border-stone-300 transition-colors">
            {/* Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/f5f5f0/a8a29e?text=IMG";
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-0.5">
                    SKU: {product.sku}
                </p>
                <p className="text-sm font-bold text-stone-800 leading-tight mb-1 line-clamp-2">
                    {product.name}
                </p>
                <p className="text-xs text-blue-600 font-semibold mb-3">
                    MOQ: {product.minOrder} UNITS
                </p>

                {/* Controls row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Unit price */}
                        <div>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                                Unit Price
                            </p>
                            <p className="text-sm font-bold text-stone-800">
                                {formatIDR(product.price)}
                            </p>
                        </div>

                        {/* Qty Stepper */}
                        <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1">
                            <button
                                onClick={() => onUpdateQty(product.id, qty - 1)}
                                disabled={!canDecrease}
                                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <Minus className="w-3 h-3" />
                            </button>

                            <input
                                type="number"
                                value={qty}
                                min={1}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value);
                                    if (!isNaN(v) && v >= 1) {
                                        onUpdateQty(product.id, v);
                                    }
                                }}
                                className="w-12 text-center text-sm font-bold text-stone-800 bg-transparent focus:outline-none"
                            />

                            <button
                                onClick={() => onUpdateQty(product.id, qty + 1)}
                                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Subtotal + Remove */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-0.5">
                                Subtotal
                            </p>
                            <p className="text-base font-black text-blue-600">
                                {formatIDR(subtotal)}
                            </p>
                        </div>
                        <button
                            onClick={() => onRemove(product.id)}
                            className="p-2 rounded-xl hover:bg-rose-50 text-stone-300 hover:text-rose-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}