"use client";

import { useEffect } from "react";
import { X, Download, Printer, Building, MapPin, CheckCircle } from "lucide-react";
import type { Transaction } from "./TransactionTable";

interface Props {
    transaction: Transaction | null;
    onClose: () => void;
}

export default function InvoiceModal({ transaction, onClose }: Props) {
    useEffect(() => {
        if (transaction) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [transaction]);

    useEffect(() => {
        if (!transaction) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [transaction, onClose]);

    const handlePrint = () => window.print();

    const handleDownload = () => {
        // In production: call API to get PDF blob, then trigger download
        const element = document.createElement("a");
        element.href = "#";
        alert(`Downloading invoice ${transaction?.txnId}.pdf\n\n(Connect to real PDF generation API in production)`);
    };

    if (!transaction) return null;

    const invoiceItems = [
        { name: "Furniture Purchase", qty: 1, price: transaction.amount * 0.85 },
        { name: "Shipping Fee", qty: 1, price: transaction.amount * 0.1 },
        { name: "Tax (10%)", qty: 1, price: transaction.amount * 0.05 },
    ];

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0">
                        <h2 className="text-base font-bold text-stone-800">Invoice</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                Print
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download PDF
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Invoice Content */}
                    <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                        {/* Brand + Invoice No */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Building className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-black text-stone-800 text-lg">Ravelle</span>
                                </div>
                                <p className="text-xs text-stone-400">Furniture & Home Decor</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-stone-400 mb-0.5 uppercase tracking-wider">Invoice</p>
                                <p className="text-lg font-black text-stone-800">#{transaction.txnId}</p>
                                <div className="flex items-center gap-1.5 justify-end mt-1">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-600">PAID</span>
                                </div>
                            </div>
                        </div>

                        {/* From / To */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">From</p>
                                <p className="text-sm font-bold text-stone-700">Ravelle Home</p>
                                <p className="text-xs text-stone-500 mt-1">Jl. Sudirman No. 123</p>
                                <p className="text-xs text-stone-500">Jakarta Pusat, 10220</p>
                                <p className="text-xs text-stone-500">billing@ravelle.com</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Bill To</p>
                                <p className="text-sm font-bold text-stone-700">Sarah Jenkins</p>
                                <p className="text-xs text-stone-500 mt-1">123 Maple Street</p>
                                <p className="text-xs text-stone-500">San Francisco, CA 94102</p>
                                <p className="text-xs text-stone-500">sarah@email.com</p>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: "Invoice Date", value: transaction.date },
                                { label: "Payment Method", value: transaction.method },
                                { label: "Due Date", value: transaction.date },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-stone-50 rounded-xl p-3">
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
                                    <p className="text-xs font-semibold text-stone-700">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Items Table */}
                        <div>
                            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-2 bg-stone-100 rounded-lg mb-2">
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Description</p>
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Qty</p>
                                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider text-right">Amount</p>
                            </div>
                            <div className="divide-y divide-stone-100">
                                {invoiceItems.map((item) => (
                                    <div key={item.name} className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 py-3">
                                        <p className="text-sm text-stone-700">{item.name}</p>
                                        <p className="text-sm text-stone-500">{item.qty}</p>
                                        <p className="text-sm font-semibold text-stone-800 text-right">
                                            Rp. {Math.round(item.price).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-stone-200 pt-3 space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Subtotal</span>
                                <span className="font-semibold text-stone-700">
                                    Rp. {Math.round(transaction.amount * 0.95).toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Tax (5%)</span>
                                <span className="font-semibold text-stone-700">
                                    Rp. {Math.round(transaction.amount * 0.05).toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                                <span>Total</span>
                                <span>Rp. {transaction.amount.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        {/* Footer note */}
                        <p className="text-[11px] text-stone-400 text-center border-t border-stone-100 pt-4">
                            Thank you for shopping at Ravelle Home. For questions, contact support@ravelle.com
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}