"use client";

import dynamic from "next/dynamic";

// Disable SSR sepenuhnya untuk halaman ini
// karena bergantung pada localStorage yang tidak ada di server
const KeranjangContent = dynamic(() => import("./components/KeranjangContent"), {
    ssr: false,
    loading: () => (
        <div className="px-6 py-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-sm text-stone-500 mt-0.5">
                    Review your wholesale selections and adjust quantities before final checkout.
                </p>
            </div>
            <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 border-3 border-stone-200 border-t-stone-600 rounded-full animate-spin" />
            </div>
        </div>
    ),
});

export default function KeranjangPage() {
    return <KeranjangContent />;
}