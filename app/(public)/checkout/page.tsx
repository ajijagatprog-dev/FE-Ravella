"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, MapPin, CreditCard, CheckCircle2, Loader2, Package,
    ShoppingCart, Sparkles, Truck, RefreshCw, Search, X as XIcon, Trash2, Plus, X, Lock, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

const JOST = "'Jost', system-ui, sans-serif";

const COURIERS = [
    { value: "jnt",      label: "J&T Express" },
    { value: "jne",      label: "JNE" },
    { value: "sicepat",  label: "SiCepat" },
    { value: "anteraja", label: "Anteraja" },
    { value: "pos",      label: "Pos Indonesia" },
];

// ── Origin: Subdistrict ID lokasi gudang Ravella ──────────────
// Ubah sesuai lokasi gudang Anda dengan mencari di:
// GET /api/rajaongkir/search-destination?search=<nama_kecamatan>
// Contoh di bawah: Gambir, Jakarta Pusat (ID: 17490)
const ORIGIN_SUBDISTRICT_ID = 17490;

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [paymentMethod] = useState("Xendit");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
    const [addedToCart, setAddedToCart] = useState<number | null>(null);

    // Voucher state
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherResult, setVoucherResult] = useState<any>(null);
    const [voucherError, setVoucherError] = useState('');
    const [applyingVoucher, setApplyingVoucher] = useState(false);
    const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

    // ── RajaOngkir: Shipping State ────────────────────────────────
    const [selectedCourier, setSelectedCourier] = useState("jnt");
    const [shippingOptions, setShippingOptions] = useState<any[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<any>(null);
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingError, setShippingError] = useState('');

    // ── RajaOngkir: Destination Search Autocomplete ───────────────
    const [destSearch, setDestSearch] = useState('');
    const [destResults, setDestResults] = useState<any[]>([]);
    const [loadingDest, setLoadingDest] = useState(false);
    const [selectedDest, setSelectedDest] = useState<any>(null);

    // Modern Modal States
    const [addrToDelete, setAddrToDelete] = useState<number | null>(null);
    const destDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Add Address State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: "", recipient_name: "", phone_number: "", full_address: "", postal_code: "",
        city: "", province: "", subdistrict_name: "",
        province_id: 0, city_id: 0, subdistrict_id: 0,
    });
    const [savingAddress, setSavingAddress] = useState(false);

    // ── Berat total barang (gram) ─────────────────────────────────
    const totalWeight = cart.reduce((sum, item) => sum + ((item.weight || 500) * item.quantity), 0) || 1000;

    // ── Fetch ongkir real-time ────────────────────────────────────
    const fetchShippingCost = useCallback(async (address: any, courier: string) => {
        if (!address?.subdistrict_id) {
            setShippingOptions([]);
            setSelectedShipping(null);
            setShippingError('Alamat belum punya data kecamatan. Tambah alamat baru dan pilih kecamatan via search.');
            return;
        }
        setLoadingShipping(true);
        setShippingError('');
        setShippingOptions([]);
        setSelectedShipping(null);
        try {
            const res = await api.post('/rajaongkir/cost', {
                origin:      ORIGIN_SUBDISTRICT_ID,
                destination: address.subdistrict_id,
                weight:      totalWeight,
                courier,
            });
            if (res.data.success && res.data.data?.length > 0) {
                const costs = res.data.data;
                setShippingOptions(costs);
                if (costs.length > 0) setSelectedShipping(costs[0]);
            } else {
                setShippingError('Tidak ada layanan tersedia untuk rute ini.');
            }
        } catch (err: any) {
            setShippingError(err?.response?.data?.message || 'Gagal mengambil data ongkir.');
        } finally {
            setLoadingShipping(false);
        }
    }, [totalWeight]);

    useEffect(() => {
        if (selectedAddress && cart.length > 0) {
            fetchShippingCost(selectedAddress, selectedCourier);
        }
    }, [selectedAddress, selectedCourier, fetchShippingCost]);

    // ── Search Destination Autocomplete ───────────────────────────
    const handleDestSearch = (val: string) => {
        setDestSearch(val);
        setSelectedDest(null);
        if (destDebounceRef.current) clearTimeout(destDebounceRef.current);
        if (val.length < 3) { setDestResults([]); return; }
        destDebounceRef.current = setTimeout(async () => {
            setLoadingDest(true);
            try {
                const res = await api.get(`/rajaongkir/search-destination?search=${encodeURIComponent(val)}`);
                if (res.data.success) setDestResults(res.data.data.slice(0, 8));
            } catch { }
            finally { setLoadingDest(false); }
        }, 400);
    };

    const handleSelectDest = (d: any) => {
        setSelectedDest(d);
        setDestSearch(d.label);
        setDestResults([]);
        setNewAddress(prev => ({
            ...prev,
            province:         d.province_name || '',
            city:             d.city_name || '',
            subdistrict_name: d.subdistrict_name || '',
            postal_code:      prev.postal_code || d.zip_code || '',
            subdistrict_id:   d.id,
            city_id:          0,
            province_id:      0,
        }));
    };

    // ── Init ──────────────────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const authStored = localStorage.getItem("auth");
                if (!authStored) { setAuthError(true); setLoading(false); return; }
                try {
                    const auth = JSON.parse(authStored);
                    if (!auth.loggedIn || !auth.token) { setAuthError(true); setLoading(false); return; }
                } catch { setAuthError(true); setLoading(false); return; }

                const stored = localStorage.getItem("ravelle_cart");
                let parsedCart: any[] = [];
                if (stored) {
                    parsedCart = JSON.parse(stored).filter((i: any) => i.selected);
                    setCart(parsedCart);
                }

                const fetchAddresses = async () => {
                    const res = await api.get('/customer/addresses');
                    if (res.data.status === 'success') {
                        setAddresses(res.data.data);
                        if (res.data.data.length > 0) {
                            const def = res.data.data.find((a: any) => a.is_primary) || res.data.data[0];
                            setSelectedAddress(def);
                        }
                    }
                };
                await fetchAddresses();

                try {
                    let recRes = await api.get('/products', { params: { on_sale: true, limit: 12 } });
                    if (recRes.data.status !== 'success' || !recRes.data.data?.data?.length) {
                        recRes = await api.get('/products', { params: { limit: 12 } });
                    }
                    if (recRes.data.status === 'success' && recRes.data.data?.data) {
                        const cartIds = parsedCart.map((c: any) => c.id);
                        setRecommendedProducts(
                            recRes.data.data.data.filter((p: any) => !cartIds.includes(p.id)).slice(0, 4).map((p: any) => {
                                let curr = p.price, orig = p.price;
                                if (p.sale_price && p.sale_price > 0) { curr = Math.min(p.price, p.sale_price); orig = Math.max(p.price, p.sale_price); }
                                else if (p.discount && p.discount > 0) { curr = p.price - (p.price * p.discount / 100); }
                                return { id: p.id, name: p.name, price: curr, originalPrice: orig, discount: p.discount || Math.round((1 - curr / orig) * 100), image: p.image || 'https://images.unsplash.com/photo-1558317374-067fb5f30001', stock: p.stock };
                            })
                        );
                    }
                } catch { }

                try {
                    const vRes = await api.get('/vouchers/active');
                    if (vRes.data.status === 'success') setAvailableVouchers(vRes.data.data);
                } catch { }

                const av = localStorage.getItem("ravelle_active_voucher");
                const sub = parsedCart.reduce((s, i) => s + i.price * i.quantity, 0);
                if (av && sub > 0) {
                    try {
                        setVoucherCode(av);
                        const r = await api.get(`/vouchers/validate?code=${av}&subtotal=${sub}`);
                        if (r.data.status === 'success') setVoucherResult(r.data.data);
                    } catch { localStorage.removeItem("ravelle_active_voucher"); }
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
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
                <div className="bg-white p-10 max-w-sm w-full border border-stone-200 text-center shadow-lg">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-stone-800" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-3 uppercase tracking-wide">Akses Terkunci</h2>
                    <p className="text-sm text-stone-500 mb-8 font-light leading-relaxed">Silakan masuk ke akun Anda terlebih dahulu.</p>
                    <Link href="/auth/login" className="block w-full text-center bg-stone-900 text-white font-medium py-4 hover:bg-black transition-colors text-[11px] tracking-[0.2em] uppercase">Login Sekarang</Link>
                    <Link href="/cart" className="block mt-3 w-full text-center border border-stone-200 text-stone-600 font-medium py-4 hover:bg-stone-50 transition-colors text-[11px] tracking-[0.2em] uppercase">Kembali ke Keranjang</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6" style={{ fontFamily: JOST }}>
                <div className="bg-white p-10 max-w-sm w-full border border-stone-100 text-center shadow-lg">
                    <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-stone-800 mb-2">Keranjang Kosong</h2>
                    <p className="text-sm text-stone-500 mb-6">Tidak ada item yang dipilih untuk checkout.</p>
                    <Link href="/cart" className="block w-full text-center bg-stone-900 text-white font-medium py-3 hover:bg-black transition-colors">Kembali ke Keranjang</Link>
                </div>
            </div>
        );
    }

    const subtotal      = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const discountAmt   = voucherResult?.discount_amount || 0;
    const shippingFee   = selectedShipping?.cost ?? null;
    const grandTotal    = Math.max(0, subtotal - discountAmt + (shippingFee ?? 0));

    const fmt = (p: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setApplyingVoucher(true); setVoucherError(''); setVoucherResult(null);
        try {
            const r = await api.get('/vouchers/validate', { params: { code: voucherCode.trim(), subtotal } });
            if (r.data.status === 'success') setVoucherResult(r.data.data);
        } catch (e: any) {
            setVoucherError(e?.response?.data?.message || 'Kode voucher tidak valid.');
        } finally { setApplyingVoucher(false); }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress)    { toast.error("Pilih alamat pengiriman."); return; }
        if (shippingFee === null) { toast.error("Pilih layanan pengiriman."); return; }
        setSubmitting(true);
        try {
            const payload: any = {
                shipping_address_id: selectedAddress.id,
                payment_method:      paymentMethod,
                courier:             selectedCourier,
                courier_service:     selectedShipping?.service,
                shipping_cost:       shippingFee,
                items: cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
                utm_source: sessionStorage.getItem("ravella_utm_source"),
                utm_medium: sessionStorage.getItem("ravella_utm_medium"),
                utm_campaign: sessionStorage.getItem("ravella_utm_campaign"),
            };
            if (voucherResult?.code) payload.voucher_code = voucherResult.code;
            const r = await api.post('/customer/orders', payload);
            if (r.data.status === 'success') {
                // DON'T remove cart here - let it be removed on success page
                localStorage.removeItem("ravelle_active_voucher");
                window.dispatchEvent(new Event("ravelle_cart_updated"));
                if (r.data.payment_url) window.location.href = r.data.payment_url;
                else router.push('/customer/myOrders');
            }
        } catch (e) {
            console.error(e);
            toast.error("Gagal membuat pesanan. Coba lagi.");
        } finally { setSubmitting(false); }
    };

    const handleSaveNewAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.subdistrict_id) {
            toast.error("Pilih kecamatan tujuan via kolom pencarian agar ongkir bisa dihitung otomatis.");
            return;
        }
        setSavingAddress(true);
        try {
            const r = await api.post('/customer/addresses', { ...newAddress, is_primary: addresses.length === 0 });
            if (r.data.status === 'success') {
                const upd = await api.get('/customer/addresses');
                if (upd.data.status === 'success') {
                    setAddresses(upd.data.data);
                    setSelectedAddress(upd.data.data.find((a: any) => a.id === r.data.data.id));
                }
                setIsAddingAddress(false);
                setNewAddress({ label: "", recipient_name: "", phone_number: "", full_address: "", postal_code: "", city: "", province: "", subdistrict_name: "", province_id: 0, city_id: 0, subdistrict_id: 0 });
                setDestSearch(''); setSelectedDest(null); setDestResults([]);
            }
        } catch { toast.error("Gagal menyimpan alamat."); }
        finally { setSavingAddress(false); }
    };

    const handleDeleteAddress = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setAddrToDelete(id);
    };

    const confirmDeleteAddress = async () => {
        if (!addrToDelete) return;
        try {
            const r = await api.delete(`/customer/addresses/${addrToDelete}`);
            if (r.data.status === 'success') {
                toast.success("Alamat berhasil dihapus.");
                setAddresses(prev => prev.filter(a => a.id !== addrToDelete));
                if (selectedAddress?.id === addrToDelete) setSelectedAddress(null);
            }
        } catch { toast.error("Gagal menghapus alamat."); }
        finally { setAddrToDelete(null); }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-10" style={{ fontFamily: JOST }}>
            <Toaster position="top-center" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

                {/* ── LEFT COLUMN ── */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <button onClick={() => router.back()} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-600">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
                    </div>

                    {/* ── Shipping Address ── */}
                    <div className="bg-white p-6 border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <MapPin className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Alamat Pengiriman</h2>
                        </div>

                        {addresses.length === 0 && !isAddingAddress ? (
                            <div className="text-sm text-stone-500 py-4 text-center">
                                Belum ada alamat tersimpan.
                                <button onClick={() => setIsAddingAddress(true)}
                                    className="block mt-3 w-full border border-stone-300 py-2 font-medium hover:bg-stone-50 transition-colors">
                                    + Tambah Alamat Baru
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                 {!isAddingAddress && addresses.map((addr) => (
                                    <div key={addr.id}
                                        className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${selectedAddress?.id === addr.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}
                                        onClick={() => setSelectedAddress(addr)}>
                                        <div className="pt-1">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAddress?.id === addr.id ? 'border-stone-900' : 'border-stone-300'}`}>
                                                {selectedAddress?.id === addr.id && <div className="w-3 h-3 rounded-full bg-stone-900" />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-stone-800">{addr.label}</span>
                                                    {addr.is_primary && <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5">Default</span>}
                                                    {!addr.subdistrict_id && <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5">Ongkir manual</span>}
                                                </div>
                                                <button 
                                                    onClick={(e) => handleDeleteAddress(addr.id, e)}
                                                    className="p-1 text-stone-300 hover:text-red-500 transition-colors"
                                                    title="Hapus alamat"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-stone-600 font-medium">{addr.recipient_name} · {addr.phone_number}</p>
                                            <p className="text-sm text-stone-500 mt-1">
                                                {addr.full_address},{addr.subdistrict_name ? ` Kec. ${addr.subdistrict_name},` : ''} {addr.city}, {addr.province} {addr.postal_code}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {!isAddingAddress && (
                                    <button onClick={() => setIsAddingAddress(true)}
                                        className="w-full flex items-center justify-center gap-2 border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-600 hover:border-stone-500 hover:bg-stone-50 transition-colors">
                                        <Plus className="w-4 h-4" /> Tambah Alamat Baru
                                    </button>
                                )}

                                {isAddingAddress && (
                                    <form onSubmit={handleSaveNewAddress} className="border border-stone-200 bg-stone-50 p-5 relative">
                                        <button type="button" onClick={() => { setIsAddingAddress(false); setDestSearch(''); setDestResults([]); setSelectedDest(null); }}
                                            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase">Tambah Alamat</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div className="sm:col-span-2">
                                                <input required type="text" placeholder="Label Alamat (contoh: Rumah, Kantor)"
                                                    className="w-full border border-stone-300 bg-white py-2.5 px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all"
                                                    value={newAddress.label} onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))} />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="Nama Penerima"
                                                    className="w-full border border-stone-300 bg-white py-2.5 px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all"
                                                    value={newAddress.recipient_name} onChange={e => setNewAddress(p => ({ ...p, recipient_name: e.target.value }))} />
                                            </div>
                                            <div>
                                                <input required type="tel" placeholder="Nomor Telepon"
                                                    className="w-full border border-stone-300 bg-white py-2.5 px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all"
                                                    value={newAddress.phone_number} onChange={e => setNewAddress(p => ({ ...p, phone_number: e.target.value }))} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <textarea required rows={2} placeholder="Alamat Lengkap (nama jalan, nomor rumah, RT/RW)"
                                                    className="w-full border border-stone-300 bg-white py-2.5 px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all resize-none"
                                                    value={newAddress.full_address} onChange={e => setNewAddress(p => ({ ...p, full_address: e.target.value }))} />
                                            </div>

                                            {/* ── Search Kecamatan (RajaOngkir) ── */}
                                            <div className="sm:col-span-2">
                                                <label className="block text-[11px] text-stone-500 uppercase tracking-wide mb-1.5 font-semibold">
                                                    Kecamatan / Kota <span className="text-red-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ketik nama kecamatan atau kota... (min. 3 huruf)"
                                                        className="w-full border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all"
                                                        value={destSearch}
                                                        onChange={e => handleDestSearch(e.target.value)}
                                                    />
                                                    {destSearch && (
                                                        <button type="button" onClick={() => { setDestSearch(''); setDestResults([]); setSelectedDest(null); setNewAddress(p => ({ ...p, subdistrict_id: 0, subdistrict_name: '', city: '', province: '' })); }}
                                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                                            <XIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Hasil pencarian */}
                                                {loadingDest && (
                                                    <div className="mt-1.5 flex items-center gap-2 text-xs text-stone-500 py-1">
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sedang mencari...
                                                    </div>
                                                )}
                                                {destResults.length > 0 && !selectedDest && (
                                                    <div className="mt-1.5 border border-stone-200 bg-white shadow-lg z-10 max-h-48 overflow-y-auto rounded-md">
                                                        {destResults.map(d => (
                                                            <button key={d.id} type="button"
                                                                onClick={() => handleSelectDest(d)}
                                                                className="w-full text-left px-3.5 py-3 text-xs hover:bg-stone-50 border-b border-stone-100 last:border-0 transition-colors">
                                                                <span className="font-semibold text-stone-800 block">{d.subdistrict_name}, {d.district_name}</span>
                                                                <span className="text-stone-500 mt-0.5 block">{d.city_name}, {d.province_name} {d.zip_code}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Terpilih */}
                                                {selectedDest && (
                                                    <div className="mt-2 flex items-center gap-2.5 bg-green-50 border border-green-200 px-3.5 py-2.5 text-xs text-green-800 rounded-md">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        <span className="leading-relaxed"><strong>{selectedDest.subdistrict_name}</strong>, {selectedDest.district_name}, {selectedDest.city_name} · {selectedDest.zip_code}</span>
                                                    </div>
                                                )}
                                                {!selectedDest && !destSearch && (
                                                    <p className="text-[11px] text-stone-400 mt-1.5 italic">Ketikan minimal 3 huruf untuk mencari kecamatan.</p>
                                                )}
                                            </div>

                                            <div className="sm:col-span-1 border-t border-stone-200 pt-3 mt-1 sm:pt-0 sm:mt-0 sm:border-0">
                                                <input type="text" placeholder="Kode Pos (Opsional)"
                                                    className="w-full border border-stone-300 bg-white py-2.5 px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-all"
                                                    value={newAddress.postal_code} onChange={e => setNewAddress(p => ({ ...p, postal_code: e.target.value }))} />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button type="submit" disabled={savingAddress}
                                                className="bg-stone-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-black disabled:bg-stone-300 flex items-center gap-2">
                                                {savingAddress && <Loader2 className="w-3 h-3 animate-spin" />}
                                                Simpan & Pilih
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Layanan Pengiriman (RajaOngkir) ── */}
                    <div className="bg-white p-6 border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <Truck className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Layanan Pengiriman</h2>
                            {selectedAddress?.subdistrict_id && !loadingShipping && (
                                <button onClick={() => fetchShippingCost(selectedAddress, selectedCourier)}
                                    className="ml-auto text-stone-400 hover:text-stone-700" title="Refresh ongkir">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Pilih Kurir */}
                        <div className="mb-5">
                            <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Pilih Kurir</p>
                            <div className="flex flex-wrap gap-2">
                                {COURIERS.map(c => (
                                    <button key={c.value} onClick={() => setSelectedCourier(c.value)}
                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide border transition-colors ${selectedCourier === c.value ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-500'}`}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hasil Ongkir */}
                        {!selectedAddress?.subdistrict_id ? (
                            <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                                ⚠️ Pilih alamat yang sudah memiliki <strong>kecamatan</strong>, atau tambah alamat baru untuk menghitung ongkir otomatis.
                            </div>
                        ) : loadingShipping ? (
                            <div className="flex items-center gap-2 text-stone-500 text-sm py-3">
                                <Loader2 className="w-4 h-4 animate-spin" /> Menghitung ongkos kirim...
                            </div>
                        ) : shippingError ? (
                            <div className="bg-red-50 border border-red-200 p-4 text-sm text-red-600">{shippingError}</div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Pilih Layanan</p>
                                {shippingOptions.map((opt: any) => {
                                    const cost = opt.cost ?? 0;
                                    const etd  = opt.etd  || '-';
                                    const sel  = selectedShipping?.service === opt.service;
                                    return (
                                        <label key={opt.service}
                                            className={`flex items-center justify-between p-3.5 border cursor-pointer transition-colors ${sel ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
                                            onClick={() => setSelectedShipping(opt)}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sel ? 'border-stone-900' : 'border-stone-300'}`}>
                                                    {sel && <div className="w-2 h-2 rounded-full bg-stone-900" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-stone-800">{opt.service}</p>
                                                    <p className="text-xs text-stone-500">{opt.description} · Est. {etd} hari</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-stone-900">{fmt(cost)}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Metode Pembayaran ── */}
                    <div className="bg-white p-6 border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <CreditCard className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Metode Pembayaran</h2>
                        </div>
                        <div className="bg-stone-50 border border-stone-200 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-800 text-sm">Xendit Payment Gateway</p>
                                    <p className="text-xs text-stone-500">Pembayaran aman & terverifikasi</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {["Bank Transfer", "Virtual Account", "QRIS", "E-Wallet", "Credit Card", "Retail Outlet"].map(m => (
                                    <span key={m} className="text-[10px] font-medium text-stone-600 bg-white border border-stone-200 px-2.5 py-1 uppercase tracking-wide">{m}</span>
                                ))}
                            </div>
                            <p className="text-[11px] text-stone-400 mt-3">Anda akan diarahkan ke halaman pembayaran Xendit setelah Place Order.</p>
                        </div>
                    </div>

                    {/* ── Order Items ── */}
                    <div className="bg-white p-6 border border-stone-200">
                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                            <Package className="w-5 h-5 text-stone-800" />
                            <h2 className="text-lg font-bold text-stone-800">Order Items</h2>
                        </div>
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className="w-20 h-20 bg-stone-100 flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-stone-800 text-sm">{item.name}</p>
                                        <p className="text-stone-500 text-xs mt-1">Qty: {item.quantity}</p>
                                        <p className="font-bold text-stone-900 text-sm mt-2">{fmt(item.price)}</p>
                                    </div>
                                    <div className="font-bold text-stone-900 text-sm">{fmt(item.price * item.quantity)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Rekomendasi Produk ── */}
                    {recommendedProducts.length > 0 && (
                        <div className="bg-white p-6 border border-stone-200">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
                                <Sparkles className="w-5 h-5 text-stone-800" />
                                <h2 className="text-lg font-bold text-stone-800">Mungkin Kamu Suka</h2>
                                <span className="ml-auto text-xs text-stone-400">Tambahkan sebelum checkout</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {recommendedProducts.map((rec) => (
                                    <div key={rec.id} className="border border-stone-100 hover:border-stone-300 transition-colors group">
                                        <Link href={`/product/${rec.id}`} className="block">
                                            <div className="relative aspect-square overflow-hidden bg-stone-50">
                                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                {rec.discount > 0 && <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5">-{rec.discount}%</span>}
                                            </div>
                                        </Link>
                                        <div className="p-3">
                                            <Link href={`/product/${rec.id}`}>
                                                <p className="text-xs font-semibold text-stone-800 line-clamp-2 mb-1 hover:text-stone-600">{rec.name}</p>
                                            </Link>
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <span className="text-sm font-bold text-stone-900">{fmt(rec.price)}</span>
                                                {rec.originalPrice > rec.price && <span className="text-[11px] text-stone-400 line-through">{fmt(rec.originalPrice)}</span>}
                                            </div>
                                            <button onClick={() => {
                                                const s = localStorage.getItem("ravelle_cart");
                                                let currentCart: any[] = s ? JSON.parse(s) : [];
                                                const existing = currentCart.find((i: any) => i.id === rec.id);
                                                
                                                let newCart;
                                                if (existing) {
                                                    newCart = currentCart.map((i: any) => i.id === rec.id ? { ...i, quantity: i.quantity + 1 } : i);
                                                } else {
                                                    newCart = [...currentCart, { ...rec, quantity: 1, selected: true }];
                                                }
                                                
                                                localStorage.setItem("ravelle_cart", JSON.stringify(newCart));
                                                // Update local state to trigger rerender and recalculate totals
                                                setCart(newCart.filter((i: any) => i.selected));
                                                
                                                window.dispatchEvent(new Event("ravelle_cart_updated"));
                                                setAddedToCart(rec.id);
                                                setTimeout(() => setAddedToCart(null), 2000);
                                            }}
                                                className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${addedToCart === rec.id ? 'bg-green-600 text-white' : 'bg-stone-900 hover:bg-black text-white'}`}>
                                                <ShoppingCart className="w-3 h-3" />
                                                {addedToCart === rec.id ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN: ORDER SUMMARY ── */}
                <div className="w-full lg:w-[400px]">
                    <div className="bg-white p-6 border border-stone-200 sticky top-24">
                        <h2 className="text-lg font-bold text-stone-800 mb-5">Order Summary</h2>

                        {/* Voucher */}
                        <div className="mb-5">
                            <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-2">Kode Voucher</p>
                            <div className="flex gap-2">
                                <input type="text" value={voucherCode}
                                    onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(''); setVoucherResult(null); }}
                                    onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
                                    placeholder="Masukkan kode voucher"
                                    className="flex-1 border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-900 uppercase" />
                                <button onClick={handleApplyVoucher} disabled={applyingVoucher || !voucherCode.trim()}
                                    className="px-4 py-2 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black disabled:bg-stone-300 flex items-center gap-1">
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
                            {availableVouchers.length > 0 && !voucherResult && (
                                <div className="mt-3 pt-3 border-t border-stone-100">
                                    <p className="text-[10px] text-stone-500 mb-2 font-semibold uppercase tracking-wide">Voucher Tersedia:</p>
                                    <div className="flex flex-col gap-1.5">
                                        {availableVouchers.map(v => (
                                            <button key={v.id} onClick={() => { setVoucherCode(v.code); setVoucherError(""); }}
                                                className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 hover:border-stone-800 text-left transition-colors flex flex-col gap-0.5">
                                                <span className="text-[10px] font-bold text-stone-900 tracking-wide">{v.code}</span>
                                                <span className="text-[9px] text-stone-500">
                                                    {v.type === 'percent' ? `Diskon ${parseFloat(v.value)}%` : `Diskon Rp ${parseInt(v.value).toLocaleString('id-ID')}`}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rincian */}
                        <div className="space-y-3 pb-5 border-b border-stone-100 text-sm">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal ({cart.length} items)</span>
                                <span className="font-medium text-stone-800">{fmt(subtotal)}</span>
                            </div>
                            {discountAmt > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Diskon ({voucherResult?.code})</span>
                                    <span className="font-medium">-{fmt(discountAmt)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-stone-600">
                                <span>Ongkos Kirim</span>
                                <span className="font-medium text-stone-800">
                                    {loadingShipping ? <Loader2 className="w-3 h-3 animate-spin inline" />
                                        : shippingFee !== null ? (shippingFee === 0 ? 'Gratis' : fmt(shippingFee))
                                            : <span className="text-stone-400 text-xs italic">Pilih layanan</span>}
                                </span>
                            </div>
                            {selectedShipping && (
                                <div className="flex justify-between text-stone-400 text-xs">
                                    <span>{COURIERS.find(c => c.value === selectedCourier)?.label} — {selectedShipping.service}</span>
                                    <span>Est. {selectedShipping.etd || '-'} hari</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end pt-5 mb-8">
                            <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Grand Total</p>
                            <span className="text-2xl font-black text-stone-900">
                                {shippingFee !== null ? fmt(grandTotal) : '—'}
                            </span>
                        </div>

                        <button onClick={handlePlaceOrder}
                            disabled={submitting || !selectedAddress || shippingFee === null}
                            className="w-full bg-stone-900 hover:bg-black disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-4 tracking-widest uppercase text-[11px] flex items-center justify-center gap-2 transition-colors">
                            {submitting
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                : <><CheckCircle2 className="w-4 h-4" /> Place Order</>}
                        </button>

                        {shippingFee === null && !loadingShipping && selectedAddress && (
                            <p className="text-xs text-amber-600 text-center mt-2">⚠️ Pilih layanan pengiriman terlebih dahulu</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
