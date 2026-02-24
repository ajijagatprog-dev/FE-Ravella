import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    onClear: () => void;
}

export default function CartActions({ onClear }: Props) {
    return (
        <div className="flex items-center justify-between pt-2">
            <Link
                href="/b2b/products"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add more products
            </Link>
            <button
                onClick={onClear}
                className="flex items-center gap-1.5 text-sm font-semibold text-stone-400 hover:text-rose-500 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Clear Entire Cart
            </button>
        </div>
    );
}