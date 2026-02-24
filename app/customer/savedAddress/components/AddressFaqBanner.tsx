import { HelpCircle } from "lucide-react";

export default function AddressFaqBanner() {
    return (
        <div className="mt-5 flex items-center justify-between bg-white rounded-2xl border border-stone-200 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-stone-700">Need multiple recipients?</p>
                    <p className="text-xs text-stone-400">
                        You can save up to 10 different addresses. Useful for sending gifts or managing office deliveries.
                    </p>
                </div>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors whitespace-nowrap ml-4">
                Read FAQ
            </button>
        </div>
    );
}