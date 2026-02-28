"use client";

import { ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "../types";

interface Props {
    product: Product;
    onAddToOrder: (product: Product) => void;
}

const badgeConfig = {
    NEW: { label: "NEW", className: "bg-emerald-500 text-white" },
    LIMITED: { label: "LIMITED", className: "bg-amber-500 text-white" },
    PREMIUM: { label: "PREMIUM", className: "bg-stone-800 text-white" },
    SALE: { label: "SALE", className: "bg-rose-500 text-white" },
};

const stockColor = (stock: number) => {
    if (stock > 200) return "text-emerald-600";
    if (stock > 50) return "text-amber-600";
    return "text-rose-500";
};

const formatIDR = (n: number) =>
    "Rp " + n.toLocaleString("id-ID");

export default function ProductCard({ product, onAddToOrder }: Props) {
    const discount = Math.round(((product.msrp - product.price) / product.msrp) * 100);

    return (
        <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/60 transition-all duration-200 flex flex-col">
            {/* Image */}
            <div className="relative h-52 bg-stone-50 overflow-hidden flex-shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x300/f5f5f0/a8a29e?text=No+Image";
                    }}
                />
                {/* Badge */}
                {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm",
                            badgeConfig[product.badge].className
                        )}>
                            {badgeConfig[product.badge].label}
                        </span>
                    </div>
                )}
                {/* Discount */}
                <div className="absolute top-3 right-3 z-10">
                    <span className="text-[11px] font-bold text-blue-700 bg-white/95 border border-blue-200 px-2 py-1 rounded-lg shadow-sm">
                        -{discount}%
                    </span>
                </div>
                {/* In Stock */}
                <div className="absolute bottom-3 left-3 z-10">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-white/95 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        IN STOCK
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-2.5">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                    SKU: {product.sku}
                </p>

                <p className="text-sm font-bold text-stone-800 leading-snug line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </p>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-base font-black text-blue-600">
                        {formatIDR(product.price)}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                        {formatIDR(product.msrp)}
                    </span>
                </div>

                {/* Min Order + Stock */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                        <ShoppingCart className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium">MIN {product.minOrder}PCS</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <Package className="w-3 h-3 text-stone-400 flex-shrink-0" />
                        <span className={cn("font-bold", stockColor(product.stock))}>
                            {product.stock} IN STOCK
                        </span>
                    </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                    {product.features.map((f) => (
                        <span key={f} className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            {f}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onAddToOrder(product)}
                    className="mt-auto w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.97] py-3 rounded-xl transition-all shadow-sm"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Order
                </button>
            </div>
        </div>
    );
}