"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    page: number;
    totalPages: number;
    total: number;
    showing: number;
    onPageChange: (p: number) => void;
}

export default function OrderPagination({
    page,
    totalPages,
    total,
    showing,
    onPageChange,
}: Props) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between text-sm text-stone-500 mt-5">
            <span className="text-xs">
                Showing{" "}
                <span className="font-semibold text-stone-700">{showing}</span> of{" "}
                <span className="font-semibold text-stone-700">{total}</span> orders
            </span>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={cn(
                            "w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-150",
                            page === p
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                                : "text-stone-500 hover:bg-stone-100"
                        )}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}