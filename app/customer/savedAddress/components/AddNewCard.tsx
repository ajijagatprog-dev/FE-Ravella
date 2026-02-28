import { Plus, MapPin } from "lucide-react";

interface Props {
    onClick: () => void;
}

export default function AddNewCard({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[200px] group w-full"
        >
            <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <MapPin className="w-5 h-5 text-stone-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-stone-500 group-hover:text-blue-600 transition-colors">
                    Add New Address
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                    Save a new location for your deliveries.
                </p>
            </div>
        </button>
    );
}