"use client";

import dynamic from "next/dynamic";

// Disable SSR sepenuhnya untuk halaman ini
// karena bergantung pada localStorage yang tidak ada di server
const KeranjangContent = dynamic(() => import("./components/KeranjangContent"), {
    ssr: false,
    loading: () => (
        <div className="px-6 py-6 max-w-5xl mx-auto">
            <div className="h-4 w-32 bg-stone-100 rounded animate-pulse mb-4" />
            <div className="h-8 w-48 bg-stone-100 rounded-xl animate-pulse mb-2" />
            <div className="h-4 w-72 bg-stone-100 rounded animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                    <div className="h-20 bg-stone-100 rounded-2xl animate-pulse" />
                    <div className="h-32 bg-stone-100 rounded-2xl animate-pulse" />
                </div>
                <div className="h-72 bg-stone-100 rounded-2xl animate-pulse" />
            </div>
        </div>
    ),
});

export default function KeranjangPage() {
    return <KeranjangContent />;
}