import { HelpCircle, MessageCircle } from "lucide-react";

export default function LiveSupportBanner() {
    return (
        <div className="mt-5 flex items-center justify-between bg-white rounded-2xl border border-stone-200 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-stone-700">Need help with a payment?</p>
                    <p className="text-xs text-stone-400">
                        Our billing team is available 24/7 to assist with transaction issues.
                    </p>
                </div>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap">
                <MessageCircle className="w-4 h-4" />
                Live Support
            </button>
        </div>
    );
}