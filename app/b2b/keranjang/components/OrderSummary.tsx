"use client";

import { ArrowRight, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formatIDR = (n: number) => "Rp " + n.toLocaleString("id-ID");

const SHIPPING = 450000;
const TAX_RATE = 0.08;
const BULK_DISCOUNT_THRESHOLD = 2000000;
const BULK_DISCOUNT_RATE = 0.10;

interface Props {
    subtotal: number;
    totalItems: number;
}

export default function OrderSummary({ subtotal, totalItems }: Props) {
    const router = useRouter();
    const [checkingOut, setCheckingOut] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);

    const bulkDiscount =
        subtotal >= BULK_DISCOUNT_THRESHOLD ? subtotal * BULK_DISCOUNT_RATE : 0;
    const afterDiscount = subtotal - bulkDiscount;
    const tax = afterDiscount * TAX_RATE;
    const total = afterDiscount + SHIPPING + tax;
    const saving = bulkDiscount;

    const handleCheckout = async () => {
        setCheckingOut(true);
        await new Promise((r) => setTimeout(r, 1200));
        router.push("/b2b/orders/checkout");
    };

    const handleSaveDraft = async () => {
        setSavingDraft(true);
        await new Promise((r) => setTimeout(r, 800));
        setSavingDraft(false);
        alert("Draft quotation saved!\n\nYou can find it in Orders > Draft Quotations.");
    };

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-6 space-y-4">
            <h2 className="text-base font-bold text-stone-800">Order Summary</h2>

            {/* Line items */}
            <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-stone-800">{formatIDR(subtotal)}</span>
                </div>

                {bulkDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <span>Bulk Discount (Tier 1)</span>
                        <span className="font-bold">-{formatIDR(bulkDiscount)}</span>
                    </div>
                )}

                <div className="flex justify-between text-stone-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-stone-800">{formatIDR(SHIPPING)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                    <span>Tax (VAT 8%)</span>
                    <span className="font-semibold text-stone-800">{formatIDR(tax)}</span>
                </div>
            </div>

            <div className="border-t border-stone-100 pt-3">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-stone-800">Total Amount</p>
                    {saving > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            YOU SAVE {formatIDR(saving)}
                        </span>
                    )}
                </div>
                <p className="text-3xl font-black text-stone-900 mt-1">
                    {formatIDR(total)}
                </p>
            </div>

            {/* CTAs */}
            <button
                onClick={handleCheckout}
                disabled={checkingOut || subtotal === 0}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] py-3.5 rounded-xl transition-all shadow-sm shadow-blue-200"
            >
                {checkingOut ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                    <><span>Proceed to Checkout</span><ArrowRight className="w-4 h-4" /></>
                )}
            </button>

            <button
                onClick={handleSaveDraft}
                disabled={savingDraft || subtotal === 0}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 disabled:opacity-50 active:scale-[0.97] py-2.5 rounded-xl transition-all"
            >
                {savingDraft ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                    <><FileText className="w-4 h-4" /> Save as Draft Quotation</>
                )}
            </button>

            {/* B2B Protection */}
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-blue-700 mb-0.5">B2B Buyer Protection</p>
                    <p className="text-[11px] text-blue-600 leading-relaxed">
                        Quality guarantee and secure net-30 payment options available for your business account.
                    </p>
                </div>
            </div>
        </div>
    );
}