"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";

export default function PaymentSimulationPage({ params }: { params: { orderNumber: string } }) {
    const router = useRouter();
    const orderNumber = params.orderNumber;
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

    const handleSimulate = async (resultStatus: "success" | "failed") => {
        setStatus("processing");
        try {
            await api.post('/payments/webhook', {
                order_number: orderNumber,
                status: resultStatus
            });
            setStatus(resultStatus);

            // Redirect after brief delay
            setTimeout(() => {
                router.push("/customer/myOrders");
            }, 2000);

        } catch (error) {
            console.error("Webhook simulation failed:", error);
            setStatus("failed");
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-16 flex items-center justify-center p-4" style={{ fontFamily: JOST }}>
            <div className="bg-white max-w-md w-full p-8 border border-stone-200 text-center shadow-lg">

                {status === "idle" && (
                    <>
                        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center rounded-full mx-auto mb-6">
                            <CreditCard className="w-8 h-8 text-stone-800" />
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900 mb-2">Simulate Payment</h1>
                        <p className="text-stone-500 mb-2">Order <span className="font-bold text-stone-800">{orderNumber}</span></p>
                        <p className="text-sm text-stone-500 mb-8 border-t border-stone-100 pt-4">This is a development simulator for the Ravelle payment gateway. Choose an outcome to test the webhook.</p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleSimulate("success")}
                                className="w-full bg-stone-900 text-white font-medium py-3 rounded-none hover:bg-black transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Simulate Success
                            </button>
                            <button
                                onClick={() => handleSimulate("failed")}
                                className="w-full bg-white border border-stone-300 text-stone-700 font-medium py-3 rounded-none hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" /> Simulate Failure
                            </button>
                        </div>
                    </>
                )}

                {status === "processing" && (
                    <div className="py-12 flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-stone-800 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-stone-900 mb-2">Processing Payment...</h2>
                        <p className="text-stone-500">Contacting gateway simulator</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-6">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold tracking-wide text-stone-900 mb-2">Payment Successful!</h2>
                        <p className="text-stone-500 mb-6">Your order has been updated. Redirecting to your orders...</p>
                    </div>
                )}

                {status === "failed" && (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-full mb-6">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold tracking-wide text-stone-900 mb-2">Payment Failed</h2>
                        <p className="text-stone-500 mb-6">The simulation returned a failed status. Redirecting...</p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-stone-100 text-left">
                    <button onClick={() => router.push("/customer/myOrders")} className="text-sm font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Skip to Orders
                    </button>
                </div>
            </div>
        </div>
    );
}
