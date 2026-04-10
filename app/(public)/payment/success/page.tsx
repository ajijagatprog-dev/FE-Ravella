"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Package, ArrowRight } from "lucide-react";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");
    const source = searchParams.get("source") || "retail";
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderNumber) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/payments/status/${orderNumber}`);
                if (res.data.status === "success") {
                    setOrderData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch order status", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber]);

    const formatPrice = (p: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(p);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center" style={{ fontFamily: JOST }}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
                    <p className="text-stone-500">Memverifikasi pembayaran...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" style={{ fontFamily: JOST }}>
            <div className="bg-white border border-stone-200 max-w-md w-full p-10 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-stone-900 mb-2">
                    Pembayaran Berhasil!
                </h1>
                <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                    Terima kasih! Pembayaran Anda telah kami terima dan sedang diproses.
                </p>

                {orderData && (
                    <div className="bg-stone-50 border border-stone-100 p-4 mb-6 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">No. Pesanan</span>
                            <span className="font-bold text-stone-800">{orderData.order_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Total</span>
                            <span className="font-bold text-stone-800">{formatPrice(orderData.total_amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">Status</span>
                            <span className="font-bold text-green-600">{orderData.order_status}</span>
                        </div>
                        {orderData.payment_channel && (
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-500">Metode</span>
                                <span className="font-medium text-stone-800">{orderData.payment_channel}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href={source === "b2b" ? "/b2b/orders" : "/customer/myOrders"}
                        className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3.5 font-medium text-[11px] uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        <Package className="w-4 h-4" />
                        Lihat Pesanan Saya
                    </Link>
                    <Link
                        href={source === "b2b" ? "/b2b/products" : "/"}
                        className="flex items-center justify-center gap-2 w-full border border-stone-200 text-stone-600 py-3.5 font-medium text-[11px] uppercase tracking-widest hover:bg-stone-50 transition-colors"
                    >
                        Lanjut Belanja
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center" style={{ fontFamily: JOST }}>
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
