"use client";

import { useEffect } from "react";
import { X, Download, Printer, Building, CheckCircle } from "lucide-react";
import type { OrderDetail } from "./OrderDetailModal";

interface Props {
    order: OrderDetail | null;
    onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: Props) {
    useEffect(() => {
        if (order) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [order]);

    useEffect(() => {
        if (!order) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [order, onClose]);

    const handlePrint = () => window.print();

    const handleDownload = () => {
        alert(`Downloading invoice ${order?.orderNumber}.pdf\n\n(Connect to real PDF generation API in production)`);
    };

    if (!order) return null;

    return (
        <>
            <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 print:p-0 print:bg-white print:block">
                <div
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] print:shadow-none print:max-h-full print:rounded-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 flex-shrink-0 print:hidden">
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
                    <div className="overflow-y-auto flex-1 px-8 py-8 space-y-8">
                        {/* Brand + Invoice No */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Building className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-black text-stone-800 text-xl tracking-tight">Ravella</span>
                                </div>
                                <p className="text-xs text-stone-500">Premium Kitchen & Home Decor</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-stone-400 mb-0.5 uppercase tracking-widest">Invoice</p>
                                <p className="text-xl font-black text-stone-800 tracking-tight">#{order.orderNumber}</p>
                                {order.paymentStatus === "PAID" && (
                                    <div className="flex items-center gap-1.5 justify-end mt-1">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold tracking-widest text-emerald-600">PAID</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* From / To */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">From</p>
                                <p className="text-sm font-bold text-stone-800 tracking-wide">Ravella Store</p>
                                <p className="text-xs text-stone-500 mt-1.5">Kawasan Industri Candi</p>
                                <p className="text-xs text-stone-500">Semarang, Jawa Tengah</p>
                                <p className="text-xs text-stone-500 mt-1">support@ravella.com</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">Bill To / Ship To</p>
                                <p className="text-sm font-bold text-stone-800 tracking-wide">{order.shippingAddress.fullName}</p>
                                <p className="text-xs text-stone-500 mt-1.5">{order.shippingAddress.street}</p>
                                <p className="text-xs text-stone-500">{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}</p>
                                <p className="text-xs text-stone-500 mt-1">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: "Invoice Date", value: order.placedAt },
                                { label: "Payment Method", value: order.paymentMethod },
                                { label: "Courier", value: order.courier ? `${order.courier.toUpperCase()} - ${order.trackingNumber || '-'}` : '-' },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-stone-50 border border-stone-100 rounded-xl p-3.5 print:border-stone-300 print:bg-white">
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
                                    <p className="text-[13px] font-semibold text-stone-700">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Items Table */}
                        <div className="border border-stone-200 rounded-xl overflow-hidden print:border-stone-300">
                            <div className="grid grid-cols-[1fr_80px_120px] gap-4 px-4 py-3 bg-stone-50 border-b border-stone-200 print:bg-stone-100">
                                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">Item Description</p>
                                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest text-center">Qty</p>
                                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest text-right">Amount</p>
                            </div>
                            <div className="divide-y divide-stone-100 print:divide-stone-200">
                                {order.items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-[1fr_80px_120px] gap-4 px-4 py-3.5">
                                        <div>
                                            <p className="text-sm font-semibold text-stone-700">{item.name}</p>
                                            {item.variant && item.variant !== "-" && <p className="text-xs text-stone-400 mt-0.5">{item.variant}</p>}
                                        </div>
                                        <p className="text-sm font-semibold text-stone-500 text-center">{item.qty}</p>
                                        <p className="text-sm font-bold text-stone-800 text-right">
                                            Rp. {(item.price * item.qty).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-stone-700">
                                        Rp. {(order.totalAmount - order.shippingCost - order.tax).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-stone-100 pb-2.5">
                                    <span className="text-stone-500 font-medium">Shipping Cost</span>
                                    <span className="font-bold text-stone-700">
                                        Rp. {order.shippingCost.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500 font-medium">Tax</span>
                                    <span className="font-bold text-stone-700">
                                        Rp. {order.tax.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-3 border-t border-stone-200 print:border-stone-300">
                                    <span className="font-bold text-stone-600 uppercase tracking-widest text-[11px]">Grand Total</span>
                                    <span className="text-xl font-black text-stone-900 tracking-tight">
                                        Rp. {order.totalAmount.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="border-t border-stone-200 mt-10 pt-6 text-center">
                            <p className="text-[11px] uppercase tracking-widest font-bold text-stone-400">
                                Thank you for your business!
                            </p>
                            <p className="text-[10px] text-stone-400 mt-2">
                                If you have any questions about this invoice, please contact support@ravella.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
