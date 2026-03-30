"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Loader2, Package, ShoppingCart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { Plus, X, Lock } from "lucide-react";

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
    const [authError, setAuthError] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
    const [addedToCart, setAddedToCart] = useState<number | null>(null);

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
                // Check auth first
                const authStored = localStorage.getItem("auth");
                if (!authStored) {
                    setAuthError(true);
                    setLoading(false);
                    return;
                }
                try {
                    const auth = JSON.parse(authStored);
                    if (!auth.loggedIn || !auth.token) {
                        setAuthError(true);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    setAuthError(true);
                    setLoading(false);
                    return;
                }

                // Load cart
                const stored = localStorage.getItem("ravelle_cart");
                let parsedCart: any[] = [];
                if (stored) {
                    parsedCart = JSON.parse(stored).filter((i: any) => i.selected);
                    setCart(parsedCart);
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

                // Load recommended products (featured, not in cart)
                try {
                    const recRes = await api.get('/products', { params: { is_featured: true, limit: 8 } });
                    if (recRes.data.status === 'success') {
                        const cartIds = parsedCart.map((c: any) => c.id);
                        const recs = recRes.data.data.data
                            .filter((p: any) => !cartIds.includes(p.id))
                            .slice(0, 4)
                            .map((p: any) => ({
                                id: p.id,
                                name: p.name,
                                price: p.sale_price && p.sale_price > 0 ? p.sale_price : p.price,
                                originalPrice: p.price,
                                discount: p.discount || 0,
                                image: p.image || 'https://images.unsplash.com/photo-1558317374-067fb5f30001',
                                badge: p.badge || '',
                                category: p.category || '',
                                stock: p.stock,
                            }));
                        setRecommendedProducts(recs);
                    }
                } catch (_e) { /* non-critical */ }
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

    if (authError) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" style={{ fontFamily: JOST }}>
                <div className="bg-white p-10 max-w-sm w-full rounded-none border border-stone-200 text-center shadow-lg">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-stone-800" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-3 uppercase tracking-wide">Akses Terkunci</h2>
                    <p className="text-sm text-stone-500 mb-8 font-light leading-relaxed">
                        Silakan masuk ke akun Anda terlebih dahulu untuk mengakses halaman checkout dan melanjutkan pembayaran.
                    </p>
                    <Link
                        href="/auth/login"
                        className="block w-full text-center bg-stone-900 text-white font-medium py-4 px-4 hover:bg-black transition-colors text-[11px] tracking-[0.2em] uppercase"
                    >
                        Login Sekarang
                    </Link>
                    <Link
                        href="/cart"
                        className="block mt-3 w-full text-center bg-white border border-stone-200 text-stone-600 font-medium py-4 px-4 hover:bg-stone-50 transition-colors text-[11px] tracking-[0.2em] uppercase"
                    >
                        Kembali Ke Keranjang
                    </Link>
                </div>
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
    // Voucher state
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherResult, setVoucherResult] = useState<any>(null);
    const [voucherError, setVoucherError] = useState('');
    const [applyingVoucher, setApplyingVoucher] = useState(false);

    const discountAmount = voucherResult?.discount_amount || 0;
    const shippingFee = subtotal > 500000 ? 0 : 25000;
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setApplyingVoucher(true);
        setVoucherError('');
        setVoucherResult(null);
        try {
            const res = await api.get('/vouchers/validate', { params: { code: voucherCode.trim(), subtotal } });
            if (res.data.status === 'success') {
                setVoucherResult(res.data.data);
            }
        } catch (err: any) {
            setVoucherError(err?.response?.data?.message || 'Kode voucher tidak valid.');
        } finally {
            setApplyingVoucher(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a shipping address.");
            return;
        }

        setSubmitting(true);
        try {
            const payload: any = {
                shipping_address_id: selectedAddress.id,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            if (voucherResult?.code) {
                payload.voucher_code = voucherResult.code;
            }

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

                    {/* ── PRODUCT RECOMMENDATIONS ── */}
                    {recommendedProducts.length > 0 && (
                        <div className="bg-white p-6 rounded-none border border-stone-200">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                                <Sparkles className="w-5 h-5 text-stone-800" />
                                <h2 className="text-lg font-bold text-stone-800">Mungkin Kamu Suka</h2>
                                <span className="ml-auto text-xs text-stone-400 font-light">Tambahkan sebelum checkout</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {recommendedProducts.map((rec) => (
                                    <div key={rec.id} className="border border-stone-100 hover:border-stone-300 transition-colors group">
                                        <Link href={`/product/${rec.id}`} className="block">
                                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                {rec.discount > 0 && (
                                                    <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                                                        -{rec.discount}%
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="p-3">
                                            <Link href={`/product/${rec.id}`}>
                                                <p className="text-xs font-semibold text-stone-800 line-clamp-2 mb-1 hover:text-stone-600 transition-colors">{rec.name}</p>
                                            </Link>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <span className="text-sm font-bold text-stone-900">{formatPrice(rec.price)}</span>
                                                {rec.originalPrice > rec.price && (
                                                    <span className="text-[11px] text-stone-400 line-through">{formatPrice(rec.originalPrice)}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const stored = localStorage.getItem("ravelle_cart");
                                                    let c: any[] = stored ? JSON.parse(stored) : [];
                                                    const exists = c.find((item: any) => item.id === rec.id);
                                                    if (exists) {
                                                        c = c.map((item: any) => item.id === rec.id ? { ...item, quantity: item.quantity + 1 } : item);
                                                    } else {
                                                        c = [...c, { ...rec, quantity: 1, selected: true }];
                                                    }
                                                    localStorage.setItem("ravelle_cart", JSON.stringify(c));
                                                    window.dispatchEvent(new Event("ravelle_cart_updated"));
                                                    setAddedToCart(rec.id);
                                                    setTimeout(() => setAddedToCart(null), 2000);
                                                }}
                                                className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${addedToCart === rec.id
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-stone-900 hover:bg-black text-white'
                                                    }`}
                                            >
                                                <ShoppingCart className="w-3 h-3" />
                                                {addedToCart === rec.id ? 'Ditambahkan!' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN (SUMMARY) ── */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white p-6 border border-stone-200 sticky top-24">
                        <h2 className="text-lg font-bold text-stone-800 mb-5">Order Summary</h2>

                        {/* Voucher Input */}
                        <div className="mb-5">
                            <p className="text-[11px] uppercase tracking-wider text-stone-500 font-medium mb-2">Kode Voucher</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(''); setVoucherResult(null); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
                                    placeholder="Masukkan kode voucher"
                                    className="flex-1 border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 uppercase"
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={applyingVoucher || !voucherCode.trim()}
                                    className="px-4 py-2 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black disabled:bg-stone-300 transition-colors flex items-center gap-1"
                                >
                                    {applyingVoucher ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Pakai'}
                                </button>
                            </div>
                            {voucherError && <p className="text-xs text-red-500 mt-1.5">{voucherError}</p>}
                            {voucherResult && (
                                <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <p className="text-xs text-green-700 font-medium">{voucherResult.description || `Voucher ${voucherResult.code} berhasil!`}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pb-5 border-b border-stone-100 text-sm">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal ({cart.length} items)</span>
                                <span className="font-medium text-stone-800">{formatPrice(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Diskon Voucher ({voucherResult?.code})</span>
                                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-stone-600">
                                <span>Ongkos Kirim</span>
                                <span className="font-medium text-stone-800">{shippingFee === 0 ? 'Gratis' : formatPrice(shippingFee)}</span>
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
