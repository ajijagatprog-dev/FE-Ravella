"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export default function CatalogPagination({
  page, totalPages, totalItems, pageSize, onPageChange,
}: Props) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  // Build page numbers with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <p className="text-xs text-stone-400">
        Showing <span className="font-semibold text-stone-600">{from} to {to}</span> of{" "}
        <span className="font-semibold text-stone-600">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-stone-500" />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1 text-stone-400 text-xs">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-semibold transition-all",
                page === p
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "text-stone-500 hover:bg-stone-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>
      </div>
    </div>
  );
}