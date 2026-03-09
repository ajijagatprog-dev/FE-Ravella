"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, CreditCard, Receipt, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../../../keranjang/useCart";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

const formatIDR = (n: number) => "Rp " + n.toLocaleString("id-ID");
const SHIPPING_THRESHOLD = 500000;
const SHIPPING_FREE = 0;
const SHIPPING_FLAT = 25000;
const BULK_DISCOUNT_THRESHOLD = 2000000;
const BULK_DISCOUNT_RATE = 0.10;

export default function CheckoutClient() {
    const router = useRouter();
    const { items, hydrated, subtotal, totalItems, clearCart } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/customer/profile');
                if (res.data.status === 'success') {
                    setProfile(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    // Derived Financials (same as keranjang)
    const bulkDiscount = subtotal >= BULK_DISCOUNT_THRESHOLD ? subtotal * BULK_DISCOUNT_RATE : 0;
    const afterDiscount = subtotal - bulkDiscount;
    const shippingFee = subtotal > SHIPPING_THRESHOLD ? SHIPPING_FREE : SHIPPING_FLAT;
    const total = afterDiscount + shippingFee;

    if (!hydrated) return null;

    if (items.length === 0 && !success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6">
                <Receipt className="w-16 h-16 text-stone-300 mb-4" />
                <h2 className="text-xl font-bold text-stone-800">Your cart is empty</h2>
                <p className="text-stone-500 mt-2 mb-6">You need to add items before you can checkout.</p>
                <button
                    onClick={() => router.push("/b2b/products")}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Return to Catalog
                </button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // 1. Ensure a shipping address exists (we will just create a dummy one for the simulation or fetch the first one)
            let addressId = null;
            try {
                const addrRes = await api.get('/customer/addresses');
                if (addrRes.data.status === 'success' && addrRes.data.data.length > 0) {
                    addressId = addrRes.data.data[0].id;
                }
            } catch (e) {
                console.warn("Could not fetch addresses, trying to create one.", e);
            }

            // If no address, create one
            if (!addressId) {
                const newAddrRes = await api.post('/customer/addresses', {
                    label: `Kantor ${profile?.company_name || "B2B"}`,
                    recipient_name: profile?.name || "B2B Partner",
                    phone_number: profile?.phone_number || "08123456789",
                    full_address: profile?.address || "Graha Ravelle, Level 5",
                    city: "Jakarta Pusat",
                    province: "DKI Jakarta",
                    postal_code: "10220",
                    is_primary: true
                });
                if (newAddrRes.data.status === 'success') {
                    addressId = newAddrRes.data.data.id;
                } else {
                    throw new Error("Failed to configure shipping address.");
                }
            }

            // 2. Map items to Laravel API structure
            const orderItems = items.map(item => ({
                product_id: item.product.id,
                quantity: item.qty,
                price: item.product.price // using the b2b_price from the cart
            }));

            // 3. Post to /api/customer/orders
            const orderRes = await api.post('/customer/orders', {
                shipping_address_id: addressId,
                payment_method: "B2B Credit Term (Net 30)",
                items: orderItems
            });

            if (orderRes.data.status === 'success') {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    router.push('/b2b/orders');
                }, 2000);
            } else {
                throw new Error("API returned failure status");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "An unexpected error occurred during checkout.");
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 max-w-lg mx-auto text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-black text-stone-800 mb-2">Order Placed Successfully!</h1>
                <p className="text-stone-500 mb-8 leading-relaxed">
                    Your simulated B2B order has been generated and recorded in the database. Redirecting you to your order history...
                </p>
                <div className="h-6 w-6 border-3 border-stone-200 border-t-green-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="px-6 py-10 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-stone-800 tracking-tight">Checkout Request</h1>
                <p className="text-stone-500 mt-1">Review your corporate purchase order details.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-sm">Failed to submit order</h3>
                        <p className="text-xs mt-1">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* B2B Company Info Mock */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-stone-800">Billing Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-stone-500 mb-1">Company Name</p>
                                <p className="font-medium text-stone-800">{profile?.company_name || "Loading..."}</p>
                            </div>
                            <div>
                                <p className="text-stone-500 mb-1">Tax ID (NPWP)</p>
                                <p className="font-medium text-stone-800">{profile?.npwp || "-"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-stone-500 mb-1">Company Address</p>
                                <p className="font-medium text-stone-800">{profile?.address || "Loading..."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info Mock */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-stone-800">Payment Term</h2>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="font-bold text-blue-900 text-sm">B2B Credit Line (Net 30)</p>
                                <p className="text-xs text-blue-700 mt-1">Payment is expected 30 days from invoice date.</p>
                            </div>
                            <span className="px-3 py-1 bg-white text-blue-700 font-bold text-xs rounded-full shadow-sm">
                                APPROVED
                            </span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-200">
                        <h2 className="text-lg font-bold text-stone-800 mb-4">Order Items ({totalItems})</h2>
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.product.id} className="flex gap-4 py-3 border-b border-stone-100 last:border-0 last:pb-0">
                                    <div className="w-16 h-16 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-stone-800 text-sm truncate">{item.product.name}</h4>
                                        <p className="text-xs text-stone-500 mt-1">Qty: {item.qty} &times; {formatIDR(item.product.price)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-stone-800 text-sm">{formatIDR(item.product.price * item.qty)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-stone-200 p-6 sticky top-6">
                        <h2 className="text-lg font-bold text-stone-800 mb-5">Financial Summary</h2>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-stone-800">{formatIDR(subtotal)}</span>
                            </div>

                            {bulkDiscount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Bulk Discount</span>
                                    <span className="font-bold">-{formatIDR(bulkDiscount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-stone-600">
                                <span>Shipping Fee</span>
                                <span className={cn("font-semibold", shippingFee === 0 ? "text-emerald-600" : "text-stone-800")}>
                                    {shippingFee === 0 ? "FREE" : formatIDR(shippingFee)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-stone-200 pt-4 mb-6">
                            <p className="text-sm font-bold text-stone-800 mb-1">Total Payable</p>
                            <p className="text-3xl font-black text-stone-900">{formatIDR(total)}</p>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                        >
                            {isProcessing ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Contacting Server...</>
                            ) : (
                                "Simulate Order Placement"
                            )}
                        </button>

                        <p className="text-xs text-center text-stone-400 mt-4 leading-relaxed">
                            By clicking place order, you authorize the generation of a real database transaction. No real funds will be deducted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
