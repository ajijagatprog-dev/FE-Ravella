"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard, ChevronRight, CheckCircle2, Loader2, Package } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, X } from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Add Address State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: "",
        recipient_name: "",
        phone_number: "",
        full_address: "",
        city: "",
        province: "",
        postal_code: ""
    });
    const [savingAddress, setSavingAddress] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // Load cart
                const stored = localStorage.getItem("ravelle_cart");
                if (stored) {
                    const parsed = JSON.parse(stored).filter((i: any) => i.selected);
                    setCart(parsed);
                }

                // Load addresses
                const fetchAddresses = async () => {
                    const res = await api.get('/customer/addresses');
                    if (res.data.status === 'success') {
                        setAddresses(res.data.data);
                        if (res.data.data.length > 0) {
                            const defaultAddr = res.data.data.find((a: any) => a.is_primary) || res.data.data[0];
                            setSelectedAddress(defaultAddr);
                        }
                    }
                };
                await fetchAddresses();
            } catch (error) {
                console.error("Error initializing checkout:", error);
            } finally {
                setLoading(false);
            }
        };
        init();
        setHydrated(true);
    }, []);

    if (!hydrated || loading) {
        return (
            <div className="w-full text-stone-500 h-[60vh] flex flex-col justify-center items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Loading Checkout...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" style={{ fontFamily: JOST }}>
                <div className="bg-white p-10 max-w-sm w-full rounded-2xl border border-stone-100 text-center shadow-lg">
                    <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-stone-800 mb-2">Checkout Error</h2>
                    <p className="text-sm text-stone-500 mb-6">Your cart is empty or no valid items were selected for checkout.</p>
                    <Link
                        href="/cart"
                        className="block w-full text-center bg-stone-900 text-white font-medium py-3 px-4 hover:bg-black transition-colors"
                    >
                        Back to Cart
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 500000 ? 0 : 25000;
    const grandTotal = subtotal + shippingFee;

    const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a shipping address.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                shipping_address_id: selectedAddress.id,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const res = await api.post('/customer/orders', payload);
            if (res.data.status === 'success') {
                localStorage.removeItem("ravelle_cart");
                window.dispatchEvent(new Event("ravelle_cart_updated"));
                router.push(`/payment/${res.data.data.order_number}`);
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to place order. Please check your connection or try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveNewAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingAddress(true);
        try {
            const res = await api.post('/customer/addresses', {
                ...newAddress,
                is_primary: addresses.length === 0
            });
            if (res.data.status === 'success') {
                const addedAddress = res.data.data;
                const updatedRes = await api.get('/customer/addresses');
                if (updatedRes.data.status === 'success') {
                    setAddresses(updatedRes.data.data);
                    setSelectedAddress(updatedRes.data.data.find((a: any) => a.id === addedAddress.id));
                }
                setIsAddingAddress(false);
                setNewAddress({
                    label: "",
                    recipient_name: "",
                    phone_number: "",
                    full_address: "",
                    city: "",
                    province: "",
                    postal_code: ""
                });
            }
        } catch (error) {
            console.error("Failed to add address:", error);
            alert("Failed to add address. Please check your inputs.");
        } finally {
            setSavingAddress(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-10" style={{ fontFamily: JOST }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

                {/* ── LEFT COLUMN ── */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => router.back()} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-600">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-none border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <MapPin className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Shipping Address</h2>
                        </div>

                        {addresses.length === 0 && !isAddingAddress ? (
                            <div className="text-sm text-stone-500 py-4 text-center">
                                No addresses saved.
                                <button onClick={() => setIsAddingAddress(true)} className="block mt-3 w-full border border-stone-300 py-2 font-medium hover:bg-stone-50 transition-colors">
                                    + Add New Address
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {!isAddingAddress && addresses.map((addr) => (
                                    <label key={addr.id} className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${selectedAddress?.id === addr.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                                        <div className="pt-1">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddress?.id === addr.id ? 'border-stone-900' : 'border-stone-300'}`}>
                                                {selectedAddress?.id === addr.id && <div className="w-3 h-3 rounded-full bg-stone-900" />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-stone-800">{addr.label}</span>
                                                {addr.is_primary && (
                                                    <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-sm">Default</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-stone-600 font-medium">{addr.recipient_name} &middot; {addr.phone_number}</p>
                                            <p className="text-sm text-stone-500 mt-1">{addr.full_address}, {addr.city}, {addr.province} {addr.postal_code}</p>
                                        </div>
                                    </label>
                                ))}

                                {!isAddingAddress && addresses.length > 0 && (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="w-full flex items-center justify-center gap-2 border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add New Address
                                    </button>
                                )}

                                {isAddingAddress && (
                                    <form onSubmit={handleSaveNewAddress} className="border border-stone-200 bg-stone-50 p-4 relative">
                                        <button type="button" onClick={() => setIsAddingAddress(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase">Add Address</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                                            <div className="sm:col-span-2">
                                                <input required type="text" placeholder="Address Label (e.g. Home, Office)" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="Recipient Name" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.recipient_name} onChange={e => setNewAddress({ ...newAddress, recipient_name: e.target.value })} />
                                            </div>
                                            <div>
                                                <input required type="tel" placeholder="Phone Number" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.phone_number} onChange={e => setNewAddress({ ...newAddress, phone_number: e.target.value })} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <textarea required rows={2} placeholder="Full Street Address" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none resize-none"
                                                    value={newAddress.full_address} onChange={e => setNewAddress({ ...newAddress, full_address: e.target.value })} />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="City" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="Province" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.province} onChange={e => setNewAddress({ ...newAddress, province: e.target.value })} />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="Postal Code" className="w-full border border-stone-300 bg-white py-2 px-3 text-sm text-stone-900 focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none"
                                                    value={newAddress.postal_code} onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={savingAddress}
                                                className="bg-stone-900 text-white px-5 py-2 text-sm font-medium hover:bg-black disabled:bg-stone-300 flex items-center gap-2"
                                            >
                                                {savingAddress && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Save & Select
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-none border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <CreditCard className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Payment Method</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Bank Transfer", "Credit Card", "QRIS", "Virtual Account"].map(method => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={`flex items-center gap-3 p-4 border transition-colors text-left w-full ${paymentMethod === method ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center ${paymentMethod === method ? 'border-stone-900' : 'border-stone-300'}`}>
                                        {paymentMethod === method && <div className="w-3 h-3 rounded-full bg-stone-900" />}
                                    </div>
                                    <span className="font-medium text-stone-700 text-sm">{method}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-none border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <Package className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Order Items</h2>
                        </div>
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="w-20 h-20 bg-stone-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-stone-800 text-sm">{item.name}</p>
                                        <p className="text-stone-500 text-xs mt-1">Qty: {item.quantity}</p>
                                        <p className="font-bold text-stone-900 text-sm mt-2">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="font-bold text-stone-900 text-sm">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (SUMMARY) ── */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white p-6 border border-stone-200 sticky top-24">
                        <h2 className="text-lg font-bold text-stone-800 mb-5">Order Summary</h2>

                        <div className="space-y-3 pb-5 border-b border-stone-100 text-sm">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal ({cart.length} items)</span>
                                <span className="font-medium text-stone-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                                <span>Shipping Fee</span>
                                <span className="font-medium text-stone-800">{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-5 mb-8">
                            <div>
                                <p className="text-stone-500 text-xs font-medium uppercase tracking-wider mb-1">Grand Total</p>
                            </div>
                            <span className="text-2xl font-black text-stone-900">{formatPrice(grandTotal)}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting || !selectedAddress}
                            className="w-full bg-stone-900 hover:bg-black disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-4 px-6 tracking-widest uppercase text-[11px] flex items-center justify-center gap-2 transition-colors"
                        >
                            {submitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            ) : (
                                <><CheckCircle2 className="w-4 h-4" /> Place Order</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
