import { Crown } from "lucide-react";

export default function MembershipCard() {
    const progress = 75;
    const spendMore = 250;

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row">
                {/* Left — Furniture Image + Gold Status */}
                <div className="relative sm:w-56 h-44 sm:h-auto bg-gradient-to-br from-stone-100 to-amber-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-stone-200/40" />
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/30 to-transparent" />

                    {/* Gold Status Badge */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest">
                            Gold Status
                        </span>
                    </div>
                </div>

                {/* Right — Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-black text-stone-800 mb-0.5">
                                Premium Membership Benefits
                            </h3>
                            <p className="text-sm text-stone-500 leading-relaxed max-w-sm">
                                You're currently in our Gold Tier. Enjoy exclusive early access to seasonal collections, complimentary interior design consultations, and priority shipping on all orders.
                            </p>
                        </div>
                        {/* Points */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                                Points Balance
                            </p>
                            <p className="text-3xl font-black text-blue-600 leading-none">2,450</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-stone-600">Platinum Tier Progress</p>
                            <p className="text-xs font-black text-emerald-600">{progress}% Complete</p>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1.5">
                            Spend <span className="font-bold text-stone-600">${spendMore} more</span> to unlock Platinum perks and 2x point multipliers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}