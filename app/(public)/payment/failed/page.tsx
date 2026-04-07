"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowRight } from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";

export default function PaymentFailedPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" style={{ fontFamily: JOST }}>
            <div className="bg-white border border-stone-200 max-w-md w-full p-10 text-center">
                {/* Failed Icon */}
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-stone-900 mb-2">
                    Pembayaran Gagal
                </h1>
                <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                    Maaf, pembayaran Anda tidak berhasil atau telah kedaluwarsa.
                    Silakan coba lagi atau hubungi customer service kami.
                </p>

                {orderNumber && (
                    <div className="bg-stone-50 border border-stone-100 p-4 mb-6 text-left">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-500">No. Pesanan</span>
                            <span className="font-bold text-stone-800">{orderNumber}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href="/customer/orders"
                        className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3.5 font-medium text-[11px] uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Bayar Ulang
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full border border-stone-200 text-stone-600 py-3.5 font-medium text-[11px] uppercase tracking-widest hover:bg-stone-50 transition-colors"
                    >
                        Kembali ke Beranda
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
