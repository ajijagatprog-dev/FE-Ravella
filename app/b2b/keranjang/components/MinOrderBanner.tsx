import { Info } from "lucide-react";

const MIN_ORDER = 2000000;
const GOLD_TIER = 2000000;

const formatIDR = (n: number) => "Rp " + n.toLocaleString("id-ID");

interface Props {
    subtotal: number;
}

export default function MinOrderBanner({ subtotal }: Props) {
    const progress = Math.min(100, (subtotal / MIN_ORDER) * 100);
    const remaining = Math.max(0, GOLD_TIER - subtotal);
    const reachedMin = subtotal >= MIN_ORDER;

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-stone-700">
                        Minimum Order Requirement
                    </span>
                </div>
                <span className="text-sm font-bold text-stone-700">
                    <span className={reachedMin ? "text-emerald-600" : "text-blue-600"}>
                        {formatIDR(subtotal)}
                    </span>
                    {" "}/{" "}
                    {formatIDR(MIN_ORDER)}
                </span>
            </div>

            <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${reachedMin ? "bg-emerald-500" : "bg-blue-500"
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {reachedMin ? (
                <p className="text-xs text-emerald-600 font-semibold">
                    ✓ Minimum order requirement met. You qualify for Gold Tier Bulk Pricing!
                </p>
            ) : (
                <p className="text-xs text-stone-500">
                    You are{" "}
                    <span className="font-bold text-blue-600">{formatIDR(remaining)}</span>{" "}
                    away from unlocking{" "}
                    <span className="font-semibold text-stone-700">Gold Tier Bulk Pricing</span>{" "}
                    (Additional 5% discount).
                </p>
            )}
        </div>
    );
}