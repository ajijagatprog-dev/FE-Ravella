"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Trash2, ArrowLeft, Plus, Minus,
  Tag, Truck, Shield, ChevronRight, Store, Package,
  CheckCircle, X, Ticket, Lock
} from "lucide-react";
import Link from "next/link";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  badge?: string;
  discount?: number;
  category?: string;
  selected: boolean;
}

export default function CartClient() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [showCheckoutAnim, setShowCheckoutAnim] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ── LOAD cart dari localStorage sekali saat mount ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ravelle_cart");
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        // Pastikan semua item punya field selected
        const normalized = parsed.map((item) => ({
          ...item,
          selected: item.selected !== false, // default true
        }));
        setCart(normalized);
      }
    } catch (e) {
      console.error("Failed to parse cart:", e);
    }
    setHydrated(true);
  }, []);

  // ── SIMPAN ke localStorage setiap kali cart berubah (setelah hydrated) ──
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("ravelle_cart", JSON.stringify(cart));
      // Update badge di header
      window.dispatchEvent(new Event("ravelle_cart_updated"));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [cart, hydrated]);

  // ── SYNC selectAll state ──
  useEffect(() => {
    setSelectAll(cart.length > 0 && cart.every((i) => i.selected));
  }, [cart]);

  // ── ACTIONS ──
  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const toggleSelect = (id: number) =>
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, selected: !item.selected } : item)
    );

  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setCart((prev) => prev.map((item) => ({ ...item, selected: newVal })));
  };

  const applyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "ravelle10") setCouponApplied(true);
  };

  const handleCheckout = () => {
    try {
      const authStored = localStorage.getItem("auth");
      if (!authStored) {
        setShowAuthOverlay(true);
        return;
      }
      const auth = JSON.parse(authStored);
      if (!auth.loggedIn || !auth.token) {
        setShowAuthOverlay(true);
        return;
      }
    } catch (e) {
      console.error("Auth check failed:", e);
      setShowAuthOverlay(true);
      return;
    }

    setShowCheckoutAnim(true);
    setTimeout(() => router.push("/checkout"), 1200);
  };

  // ── COMPUTED ──
  const selectedItems = cart.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalTotal = selectedItems.reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0);
  const totalDiscount = originalTotal - subtotal;
  const couponDiscount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const grandTotal = subtotal - couponDiscount + shippingFee;

  const stores = Array.from(new Set(cart.map((item) => item.category || "Ravelle Official")));

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0,
    }).format(price);

  // Jangan render sampai localStorage sudah dibaca
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: JOST }}>

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-5">
          <Link
            href="/product"
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] tracking-[0.18em] uppercase font-medium hidden sm:block" style={{ fontFamily: JOST }}>
              Lanjut Belanja
            </span>
          </Link>

          <div className="w-[1px] h-4 bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-4 h-4 text-neutral-600" />
            <h1 className="text-base font-medium text-neutral-900 tracking-wide" style={{ fontFamily: JOST }}>
              Keranjang
            </h1>
            {cart.length > 0 && (
              <span className="bg-neutral-900 text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── EMPTY STATE ── */}
        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-100 p-16 text-center">
            <ShoppingCart className="w-12 h-12 text-neutral-200 mx-auto mb-5" />
            <h2 className="text-4xl font-light text-neutral-900 mb-2" style={{ fontFamily: CORMORANT }}>
              Keranjang <em style={{ fontStyle: "italic" }}>Kosong</em>
            </h2>
            <div className="w-8 h-[1px] bg-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-400 text-sm font-light mb-8" style={{ fontFamily: JOST }}>
              Yuk, temukan produk yang kamu suka!
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-black transition-colors"
              style={{ fontFamily: JOST }}
            >
              <Package className="w-4 h-4" />
              Lihat Produk
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── LEFT — CART ITEMS ── */}
            <div className="flex-1 space-y-3">

              {/* Select All */}
              <div className="bg-white border border-neutral-100 px-5 py-4 flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className={`w-4 h-4 border flex items-center justify-center transition-all flex-shrink-0 ${selectAll ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"
                    }`}
                >
                  {selectAll && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                <span className="text-[11px] tracking-[0.15em] uppercase text-neutral-600 font-medium" style={{ fontFamily: JOST }}>
                  Pilih Semua ({cart.length} produk)
                </span>
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setCart((prev) => prev.filter((item) => !item.selected))}
                    className="ml-auto flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-900 font-medium transition-colors"
                    style={{ fontFamily: JOST }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Dipilih
                  </button>
                )}
              </div>

              {/* Store Groups */}
              {stores.map((store) => {
                const storeItems = cart.filter(
                  (item) => (item.category || "Ravelle Official") === store
                );
                return (
                  <div key={store} className="bg-white border border-neutral-100 overflow-hidden">

                    {/* Store Header */}
                    <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-[11px] tracking-[0.18em] uppercase text-neutral-700 font-medium" style={{ fontFamily: JOST }}>
                        Ravelle Official Store
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 ml-auto" />
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-neutral-50">
                      {storeItems.map((item) => (
                        <div key={item.id} className="px-5 py-5 flex items-start gap-4">

                          {/* Checkbox */}
                          <button
                            onClick={() => toggleSelect(item.id)}
                            className={`mt-1 w-4 h-4 border flex items-center justify-center transition-all flex-shrink-0 ${item.selected ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"
                              }`}
                          >
                            {item.selected && <CheckCircle className="w-3 h-3 text-white" />}
                          </button>

                          {/* Image */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-neutral-100"
                            />
                            {item.discount && item.discount > 0 && (
                              <span
                                className="absolute -top-1.5 -right-1.5 bg-neutral-900 text-white text-[10px] font-medium px-1.5 py-0.5 tracking-wide"
                                style={{ fontFamily: JOST }}
                              >
                                -{item.discount}%
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-light text-neutral-900 text-sm leading-snug line-clamp-2 mb-1.5" style={{ fontFamily: JOST }}>
                              {item.name}
                            </p>
                            {item.badge && (
                              <span
                                className="inline-block text-[10px] px-2 py-0.5 bg-white text-neutral-600 border border-neutral-200 tracking-[0.1em] uppercase font-medium mb-2"
                                style={{ fontFamily: JOST }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-base font-medium text-neutral-900" style={{ fontFamily: JOST }}>
                                {formatPrice(item.price)}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-xs text-neutral-400 line-through font-light" style={{ fontFamily: JOST }}>
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Qty + Delete */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-neutral-200 overflow-hidden">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors border-r border-neutral-200"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-9 text-center text-sm font-medium text-neutral-900" style={{ fontFamily: JOST }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors border-l border-neutral-200"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors px-2 py-1 hover:bg-neutral-50"
                                style={{ fontFamily: JOST }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:block">Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping info */}
                    <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                      <span className="text-[11px] text-neutral-500 font-light tracking-wide" style={{ fontFamily: JOST }}>
                        {subtotal > 500000
                          ? "Gratis ongkir untuk pesanan ini"
                          : "Tambah belanja untuk gratis ongkir"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Coupon */}
              <div className="bg-white border border-neutral-100 px-5 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 font-medium" style={{ fontFamily: JOST }}>
                    Kode Promo
                  </span>
                </div>

                {couponApplied ? (
                  <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-neutral-600" />
                      <span className="font-medium text-neutral-900 text-[11px] tracking-wide" style={{ fontFamily: JOST }}>
                        RAVELLE10 — Diskon 10% diterapkan
                      </span>
                    </div>
                    <button
                      onClick={() => { setCouponApplied(false); setCouponCode(""); }}
                      className="text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
                      <input
                        type="text"
                        placeholder="Masukkan kode promo..."
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-4 py-3 border border-neutral-200 text-sm text-neutral-700 font-light focus:border-neutral-800 focus:outline-none transition-colors placeholder:text-neutral-400"
                        style={{ fontFamily: JOST }}
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      className="px-5 py-3 bg-neutral-900 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-black transition-colors"
                      style={{ fontFamily: JOST }}
                    >
                      Pakai
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-neutral-400 mt-2 font-light tracking-wide" style={{ fontFamily: JOST }}>
                  Coba kode: RAVELLE10 untuk diskon 10%
                </p>
              </div>
            </div>

            {/* ── RIGHT — ORDER SUMMARY ── */}
            <div className="w-full lg:w-72 space-y-3 lg:sticky lg:top-24">

              {/* Summary */}
              <div className="bg-white border border-neutral-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100">
                  <h2 className="text-2xl font-light text-neutral-900" style={{ fontFamily: CORMORANT }}>
                    Ringkasan <em style={{ fontStyle: "italic" }}>Belanja</em>
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-light tracking-wide mt-0.5" style={{ fontFamily: JOST }}>
                    {selectedItems.length} produk dipilih
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm" style={{ fontFamily: JOST }}>
                    <span className="text-neutral-500 font-light">Total Harga</span>
                    <span className="font-medium text-neutral-900">{formatPrice(originalTotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm" style={{ fontFamily: JOST }}>
                      <span className="text-neutral-500 font-light">Diskon Produk</span>
                      <span className="font-medium text-neutral-700">-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between text-sm" style={{ fontFamily: JOST }}>
                      <span className="text-neutral-500 font-light">Diskon Promo</span>
                      <span className="font-medium text-neutral-700">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm" style={{ fontFamily: JOST }}>
                    <span className="text-neutral-500 font-light">Ongkos Kirim</span>
                    <span className={`font-medium ${shippingFee === 0 ? "text-neutral-700" : "text-neutral-900"}`}>
                      {shippingFee === 0 ? "Gratis" : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-neutral-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 font-medium" style={{ fontFamily: JOST }}>
                        Total Belanja
                      </span>
                      <span className="text-xl font-light text-neutral-900" style={{ fontFamily: CORMORANT }}>
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    {(totalDiscount > 0 || couponApplied) && (
                      <p className="text-right text-[11px] text-neutral-500 font-light mt-1 tracking-wide" style={{ fontFamily: JOST }}>
                        Hemat {formatPrice(totalDiscount + couponDiscount)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || showCheckoutAnim}
                    className={`w-full py-4 text-[11px] tracking-[0.22em] uppercase font-medium transition-all flex items-center justify-center gap-2 ${selectedItems.length === 0
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-black"
                      }`}
                    style={{ fontFamily: JOST }}
                  >
                    {showCheckoutAnim ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Memproses...
                      </>
                    ) : (
                      `Beli Sekarang (${selectedItems.length})`
                    )}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white border border-neutral-100 px-5 py-4 space-y-3.5">
                {[
                  { icon: Shield, text: "Pembayaran 100% Aman & Terenkripsi" },
                  { icon: Truck, text: "Pengiriman ke seluruh Indonesia" },
                  { icon: Package, text: "Garansi Resmi 1 Tahun" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <span className="text-[11px] text-neutral-500 font-light tracking-wide" style={{ fontFamily: JOST }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── AUTH REQUIRED MODAL ── */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 transition-all animate-in fade-in duration-300" style={{ fontFamily: JOST }}>
          <div className="bg-white w-full max-w-sm rounded-none border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-neutral-800" />
              </div>
              <h3 className="text-xl font-light text-neutral-900 mb-3" style={{ fontFamily: CORMORANT }}>
                Login Diperlukan
              </h3>
              <p className="text-sm text-neutral-500 font-light mb-8 leading-relaxed">
                Silakan masuk ke akun Anda terlebih dahulu untuk dapat melanjutkan ke proses pembayaran dengan aman.
              </p>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="w-full py-3.5 bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-black transition-colors"
                >
                  Login Sekarang
                </button>
                <button
                  onClick={() => setShowAuthOverlay(false)}
                  className="w-full py-3.5 bg-white border border-neutral-200 text-neutral-600 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}