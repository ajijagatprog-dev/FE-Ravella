"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "../mockData";
import type { Category } from "../types";
import { cn } from "@/lib/utils";

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    activeCategory: Category;
    onCategoryChange: (c: Category) => void;
}

export default function CatalogFilters({
    search, onSearchChange, activeCategory, onCategoryChange,
}: Props) {
    return (
        <div className="space-y-3 mb-6">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name or SKU..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder:text-stone-400 text-stone-700 transition-shadow"
                />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat as Category)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                            activeCategory === cat
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                : "bg-white border border-stone-200 text-stone-600 hover:border-blue-300 hover:text-blue-600"
                        )}
                    >
                        {cat}
                    </button>
                ))}
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-stone-200 text-stone-600 hover:border-stone-300 transition-all ml-auto">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    More Filters
                </button>
            </div>
        </div>
    );
}