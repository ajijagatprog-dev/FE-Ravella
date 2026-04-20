"use client";

import { ShoppingCart, Package, Flame } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product } from "../types";

interface Props {
    product: Product;
    onAddToOrder: (product: Product) => void;
}

const badgeConfig = {
    NEW: { label: "NEW", className: "bg-emerald-600 text-white" },
    LIMITED: { label: "LIMITED", className: "bg-amber-600 text-white" },
    PREMIUM: { label: "PREMIUM", className: "bg-stone-900 text-white" },
    SALE: { label: "SALE", className: "bg-rose-600 text-white" },
};

const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function ProductCard({ product, onAddToOrder }: Props) {
    const discount = Math.round(((product.msrp - product.price) / product.msrp) * 100);

    return (
        <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/60 transition-all duration-300 flex flex-col h-full">
            {/* Image */}
            <Link href={`/b2b/products/${product.id}`} className="relative aspect-square bg-white overflow-hidden flex-shrink-0 block p-6 flex items-center justify-center border-b border-stone-100 mix-blend-multiply">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x300/f5f5f0/a8a29e?text=No+Image";
                    }}
                />
                
                {/* Badges Container */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {/* Flash Sale Indicator vs Normal Badge */}
                    {product.active_promotion && product.active_promotion.type === 'flash_sale' ? (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm border border-black/5 bg-stone-900 text-amber-400 flex items-center gap-1 w-fit">
                            <Flame className="w-3 h-3 fill-amber-400" />
                            Flash Sale
                        </span>
                    ) : product.badge ? (
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm border border-black/5 w-fit",
                            badgeConfig[product.badge as keyof typeof badgeConfig]?.className || "bg-stone-900 text-white"
                        )}>
                            {badgeConfig[product.badge as keyof typeof badgeConfig]?.label || product.badge}
                        </span>
                    ) : null}
                </div>
                {/* Discount */}
                {discount > 0 && (
                    <div className="absolute top-4 right-4 z-10">
                        <span className="text-[11px] font-black text-blue-600 bg-white/95 border border-blue-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                            -{discount}%
                        </span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 gap-4">
                <Link href={`/b2b/products/${product.id}`} className="text-base font-bold text-stone-900 leading-snug line-clamp-2 min-h-[2.75rem] hover:text-blue-600 transition-colors">
                    {product.name}
                </Link>

                {/* Pricing */}
                <div className="flex flex-col gap-0.5 mt-auto">
                    <p className="text-xs text-stone-400 line-through">
                        {formatIDR(product.msrp)}
                    </p>
                    <p className="text-lg font-black text-blue-600">
                        {formatIDR(product.price)}
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={() => onAddToOrder(product)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.97] py-3.5 rounded-xl transition-all shadow-md active:shadow-sm"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Order
                </button>
            </div>
        </div>
    );
}