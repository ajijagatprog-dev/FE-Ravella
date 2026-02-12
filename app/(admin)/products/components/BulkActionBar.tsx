"use client";

interface BulkActionBarProps {
  selectedCount: number;
  onChangeCategory?: () => void;
  onMarkInactive?: () => void;
  onBulkDelete?: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onChangeCategory,
  onMarkInactive,
  onBulkDelete,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-black">
            {selectedCount} SELECTED
          </span>
          <p className="text-sm font-medium">
            Quickly update price or status for selected items.
          </p>
        </div>

        <div className="flex items-center gap-3 border-l border-white/20 pl-6">
          <button
            onClick={onChangeCategory}
            className="text-xs font-bold hover:underline transition-all"
          >
            Ubah Kategori
          </button>
          <button
            onClick={onMarkInactive}
            className="text-xs font-bold hover:underline transition-all"
          >
            Mark as Inactive
          </button>
          <button
            onClick={onBulkDelete}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-black hover:bg-gray-100 transition-colors"
          >
            Hapus Pemilihan
          </button>
        </div>
      </div>
    </div>
  );
}
