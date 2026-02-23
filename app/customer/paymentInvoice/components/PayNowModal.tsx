"use client";

import { useEffect, useState } from "react";
import { X, Copy, CheckCircle, Clock, QrCode, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "./TransactionTable";

interface Props {
    transaction: Transaction | null;
    onClose: () => void;
    onPaymentSuccess: (txnId: string) => void;
}

export default function PayNowModal({ transaction, onClose, onPaymentSuccess }: Props) {
    const [copied, setCopied] = useState(false);
    const [countdown, setCountdown] = useState(7200); // 2 jam dalam detik
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (!transaction) return;
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [transaction]);

    // Lock body scroll
    useEffect(() => {
        if (transaction) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [transaction]);

    // ESC close
    useEffect(() => {
        if (!transaction) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [transaction, onClose]);

    if (!transaction) return null;

    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    const pad = (n: number) => String(n).padStart(2, "0");

    const virtualAccount = "8277 0089 5523 1234";
    const isQris = transaction.methodType === "qris";

    const handleCopy = () => {
        navigator.clipboard.writeText(virtualAccount.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmPayment = async () => {
        setPaying(true);
        await new Promise((r) => setTimeout(r, 1800)); // simulate API call
        setPaid(true);
        await new Promise((r) => setTimeout(r, 1200));
        onPaymentSuccess(transaction.id);
        onClose();
    };

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                        <div>
                            <h2 className="text-base font-bold text-stone-800">Complete Payment</h2>
                            <p className="text-xs text-stone-400">{transaction.txnId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        {/* Amount */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-sm text-blue-600 font-medium">Total Payment</span>
                            <span className="text-xl font-black text-blue-700">
                                Rp. {transaction.amount.toLocaleString("id-ID")}
                            </span>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold">Payment expires in</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                            </div>
                        </div>

                        {/* Payment detail */}
                        {isQris ? (
                            <div className="flex flex-col items-center gap-3 py-2">
                                <div className="w-40 h-40 bg-stone-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-stone-300">
                                    <QrCode className="w-16 h-16 text-stone-400" />
                                </div>
                                <p className="text-xs text-stone-500 text-center">
                                    Scan QR code with your e-wallet app
                                </p>
                                <div className="flex items-center gap-2 w-full">
                                    <div className="flex-1 h-px bg-stone-200" />
                                    <span className="text-xs text-stone-400">or pay via</span>
                                    <div className="flex-1 h-px bg-stone-200" />
                                </div>
                                <p className="text-sm font-bold text-stone-700">{transaction.method}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-stone-600">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Virtual Account Number</span>
                                </div>
                                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                                    <span className="flex-1 font-mono text-lg font-bold text-stone-800 tracking-widest">
                                        {virtualAccount}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className={cn(
                                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                                            copied
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        )}
                                    >
                                        {copied ? (
                                            <><CheckCircle className="w-3.5 h-3.5" /> Copied!</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                                        )}
                                    </button>
                                </div>
                                <div className="text-xs text-stone-400 space-y-1">
                                    <p>• Transfer to the virtual account above</p>
                                    <p>• Payment will be confirmed automatically</p>
                                    <p>• Keep your transfer receipt as proof</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-5 flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmPayment}
                            disabled={paying || paid}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all",
                                paid
                                    ? "bg-emerald-500 text-white"
                                    : paying
                                        ? "bg-blue-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            {paid ? "✓ Payment Confirmed!" : paying ? "Processing..." : "I've Already Paid"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}