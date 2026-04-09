"use client";

import { useEffect, useState } from "react";
import { X, Tag, Copy, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

const POPUP_SESSION_KEY = "ravella_popup_dismissed";
const POPUP_DELAY_MS = 2500;

export default function WelcomePopup() {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [promoDescription, setPromoDescription] = useState("");

    useEffect(() => {
        setMounted(true);

        // If user already dismissed in this session, don't show
        const dismissed = sessionStorage.getItem(POPUP_SESSION_KEY);
        if (dismissed) return;

        // Fetch active vouchers from backend
        const fetchVoucher = async () => {
            try {
                const res = await api.get("/vouchers/active");
                if (res.data.status === "success" && res.data.data.length > 0) {
                    const voucher = res.data.data[0]; // Use the first active voucher
                    setPromoCode(voucher.code);
                    const desc = voucher.description
                        || (voucher.type === "percent"
                            ? `Diskon ${parseFloat(voucher.value)}% untuk pembelian Anda`
                            : `Diskon Rp ${parseInt(voucher.value).toLocaleString("id-ID")} untuk pembelian Anda`);
                    setPromoDescription(desc);

                    // Show popup after delay
                    const timer = setTimeout(() => setVisible(true), POPUP_DELAY_MS);
                    return () => clearTimeout(timer);
                }
                // No active voucher → don't show popup at all
            } catch (_e) {
                // API error → don't show popup
            }
        };
        fetchVoucher();
    }, []);

    const handleClose = () => {
        sessionStorage.setItem(POPUP_SESSION_KEY, "1");
        setVisible(false);
    };

    const handleCopy = () => {
        if (!promoCode) return;
        navigator.clipboard.writeText(promoCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!mounted || !visible) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                style={{ animation: "fadeIn 0.3s ease" }}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-[201] flex items-center justify-center p-4"
                style={{ pointerEvents: "none" }}
            >
                <div
                    className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden"
                    style={{
                        fontFamily: JOST,
                        pointerEvents: "auto",
                        animation: "popupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 p-1.5 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Top banner */}
                    <div className="bg-stone-900 px-8 pt-10 pb-8 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />

                        <div className="relative">
                            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-7 h-7 text-white" />
                            </div>
                            <p className="text-white/60 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">
                                Penawaran Spesial
                            </p>
                            <h2
                                className="text-3xl text-white font-light leading-tight"
                                style={{ fontFamily: CORMORANT }}
                            >
                                Selamat Datang
                                <br />
                                <span className="font-semibold italic">di Ravella</span>
                            </h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-7 text-center">
                        <p className="text-stone-600 text-sm font-light leading-relaxed mb-6">
                            {promoDescription}. Gunakan kode di bawah ini saat checkout.
                        </p>

                        {/* Voucher code display */}
                        <div className="border-2 border-dashed border-stone-200 bg-stone-50 px-5 py-4 mb-6 flex items-center justify-between gap-3">
                            <span className="font-mono font-bold text-stone-900 text-xl tracking-widest flex-1 text-center">
                                {promoCode}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${copied
                                    ? "bg-green-600 text-white"
                                    : "bg-stone-900 text-white hover:bg-black"
                                    }`}
                            >
                                {copied ? (
                                    <><Check className="w-3 h-3" /> Tersalin!</>
                                ) : (
                                    <><Copy className="w-3 h-3" /> Salin</>
                                )}
                            </button>
                        </div>

                        {/* CTA buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/product"
                                onClick={handleClose}
                                className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Belanja Sekarang
                            </Link>
                            <button
                                onClick={handleClose}
                                className="w-full text-stone-400 text-xs hover:text-stone-600 transition-colors py-2"
                            >
                                Nanti saja
                            </button>
                        </div>

                        <p className="text-stone-300 text-[10px] mt-4">
                            * Syarat & ketentuan berlaku. Kode tidak bisa digabung dengan promo lain.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popupIn {
                    from { opacity: 0; transform: scale(0.85) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </>
    );
}
