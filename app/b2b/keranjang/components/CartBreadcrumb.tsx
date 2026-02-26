"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function CartBreadcrumb() {
    return (
        <nav className="flex items-center gap-2 text-sm mb-4">
            <Link
                href="/b2b/dashboard"
                className="flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors"
            >
                <Home className="w-4 h-4" />
                <span>Home</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />

            <Link
                href="/b2b/products"
                className="text-stone-500 hover:text-stone-800 transition-colors"
            >
                Products
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />

            <span className="font-bold text-stone-800">Shopping Cart</span>
        </nav>
    );
}
