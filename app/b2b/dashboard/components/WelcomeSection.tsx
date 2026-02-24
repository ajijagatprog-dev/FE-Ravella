"use client";

import { Download, Plus } from "lucide-react";
import Link from "next/link";

interface WelcomeSectionProps {
    userName: string;
    partnerId: string;
}

export default function WelcomeSection({ userName, partnerId }: WelcomeSectionProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {userName}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500 font-medium tracking-wide">
                        Partner ID: <span className="text-gray-900 font-bold">{partnerId}</span>
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Partnership: Approved
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                    <Download size={18} />
                    Download Report
                </button>
                <Link
                    href="/b2b/products"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex-shrink-0"
                >
                    <Plus size={18} />
                    Add New Product
                </Link> 
            </div>
        </div>
    );
}
