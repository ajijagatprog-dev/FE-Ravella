import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-stone-300" />
            </div>
            <p className="text-base font-bold text-stone-600 mb-1">Your cart is empty</p>
            <p className="text-sm text-stone-400 mb-6 text-center max-w-xs">
                Browse the wholesale catalog and add products to start your order.
            </p>
            <Link
                href="/b2b/products"
                className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors"
            >
                Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}