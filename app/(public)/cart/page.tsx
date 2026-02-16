"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  Tag,
  Truck,
  Shield,
  ChevronRight,
  Store,
  Package,
  CheckCircle,
  X,
  Ticket,
} from "lucide-react";
import Link from "next/link";

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

export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("add");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const [showCheckoutAnim, setShowCheckoutAnim] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ravelle_cart");
    let currentCart: CartItem[] = stored ? JSON.parse(stored) : [];

    if (productId) {
      // Try to get product data from localStorage (set by product page)
      const pendingRaw = localStorage.getItem("ravelle_pending_product");
      let newItem: CartItem;

      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        newItem = {
          id: pending.id,
          name: pending.name,
          price: pending.price,
          originalPrice: pending.originalPrice || pending.price,
          image: pending.image,
          badge: pending.badge,
          discount: pending.discount,
          category: pending.category,
          quantity: 1,
          selected: true,
        };
        localStorage.removeItem("ravelle_pending_product");
      } else {
        // Fallback if no pending product stored
        const id = Number(productId);
        newItem = {
          id,
          name: `Product ${id}`,
          price: 500000,
          originalPrice: 650000,
          image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80",
          quantity: 1,
          selected: true,
        };
      }

      const exists = currentCart.find((item) => item.id === newItem.id);
      if (exists) {
        currentCart = currentCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        currentCart = [...currentCart, newItem];
      }

      localStorage.setItem("ravelle_cart", JSON.stringify(currentCart));
    }

    setCart(currentCart);
  }, [productId]);

  // Persist cart to localStorage on change
  useEffect(() => {
    if (cart.length > 0 || productId === null) {
      localStorage.setItem("ravelle_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleSelect = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setCart((prev) => prev.map((item) => ({ ...item, selected: newVal })));
  };

  useEffect(() => {
    const allSelected = cart.length > 0 && cart.every((i) => i.selected);
    setSelectAll(allSelected);
  }, [cart]);

  const applyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "ravelle10") {
      setCouponApplied(true);
    }
  };

  const selectedItems = cart.filter((i) => i.selected);
  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const originalTotal = selectedItems.reduce(
    (sum, i) => sum + (i.originalPrice || i.price) * i.quantity,
    0,
  );
  const totalDiscount = originalTotal - subtotal;
  const couponDiscount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const grandTotal = subtotal - couponDiscount + shippingFee;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleCheckout = () => {
    setShowCheckoutAnim(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 1200);
  };

  // Group by category/store (simple grouping)
  const stores = Array.from(
    new Set(cart.map((item) => item.category || "Ravelle Official")),
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/product"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm hidden sm:block">
              Lanjut Belanja
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-black text-gray-900">Keranjang</h1>
            {cart.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-28 h-28 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-14 h-14 text-orange-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-gray-500 mb-8">
              Yuk, temukan produk yang kamu suka!
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
              <Package className="w-5 h-5" />
              Lihat Produk
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left - Cart Items */}
            <div className="flex-1 space-y-4">
              {/* Select All Row */}
              <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectAll
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectAll && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  Pilih Semua ({cart.length} produk)
                </span>
                {selectedItems.length > 0 && (
                  <button
                    onClick={() =>
                      setCart((prev) =>
                        prev.filter((item) => !item.selected),
                      )
                    }
                    className="ml-auto text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Dipilih
                  </button>
                )}
              </div>

              {/* Store Groups */}
              {stores.map((store) => {
                const storeItems = cart.filter(
                  (item) => (item.category || "Ravelle Official") === store,
                );
                return (
                  <div
                    key={store}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Store Header */}
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                      <Store className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-sm text-gray-900 capitalize">
                        Ravelle Official Store
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-gray-50">
                      {storeItems.map((item) => (
                        <div
                          key={item.id}
                          className="px-5 py-5 flex items-start gap-4"
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleSelect(item.id)}
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                              item.selected
                                ? "bg-orange-500 border-orange-500"
                                : "border-gray-300"
                            }`}
                          >
                            {item.selected && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </button>

                          {/* Product Image */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-100"
                            />
                            {item.discount && item.discount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
                                -{item.discount}%
                              </span>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
                              {item.name}
                            </p>
                            {item.badge && (
                              <span className="inline-block text-xs px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-md font-semibold mb-2">
                                {item.badge}
                              </span>
                            )}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-base font-black text-orange-600">
                                {formatPrice(item.price)}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Qty + Delete */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-orange-50 text-orange-500 transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:block text-xs font-medium">
                                  Hapus
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping info per store */}
                    <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs text-blue-700 font-semibold">
                        {subtotal > 500000
                          ? "✓ Gratis ongkir untuk pesanan ini"
                          : "Tambah belanja untuk gratis ongkir"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Voucher / Coupon */}
              <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-sm text-gray-900">
                    Kode Promo
                  </span>
                </div>
                {couponApplied ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-300 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-green-700 text-sm">
                        RAVELLE10 — Diskon 10% diterapkan!
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCouponApplied(false);
                        setCouponCode("");
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Masukkan kode promo..."
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-400 font-semibold focus:border-orange-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      className="px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
                    >
                      Pakai
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Coba kode: RAVELLE10 untuk diskon 10%
                </p>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="w-full lg:w-80 space-y-4 lg:sticky lg:top-24">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-black text-gray-900">Ringkasan Belanja</h2>
                  <p className="text-sm text-gray-500">
                    {selectedItems.length} produk dipilih
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Harga</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(originalTotal)}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Diskon Produk</span>
                      <span className="font-semibold text-green-600">
                        -{formatPrice(totalDiscount)}
                      </span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diskon Kode Promo</span>
                      <span className="font-semibold text-green-600">
                        -{formatPrice(couponDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ongkos Kirim</span>
                    <span
                      className={`font-semibold ${shippingFee === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {shippingFee === 0 ? "Gratis!" : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-dashed border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        Total Belanja
                      </span>
                      <span className="text-xl font-black text-orange-600">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    {(totalDiscount > 0 || couponApplied) && (
                      <p className="text-right text-xs text-green-600 font-semibold mt-1">
                        Hemat{" "}
                        {formatPrice(totalDiscount + couponDiscount)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || showCheckoutAnim}
                    className={`w-full py-4 font-black rounded-xl text-white transition-all relative overflow-hidden ${
                      selectedItems.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-2xl hover:scale-105 active:scale-95"
                    }`}
                  >
                    {showCheckoutAnim ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 animate-bounce" />
                        Memproses...
                      </span>
                    ) : (
                      `Beli Sekarang (${selectedItems.length})`
                    )}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-2xl shadow-sm px-5 py-4 space-y-3">
                {[
                  {
                    icon: Shield,
                    color: "text-green-500",
                    bg: "bg-green-50",
                    text: "Pembayaran 100% Aman & Terenkripsi",
                  },
                  {
                    icon: Truck,
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                    text: "Pengiriman ke seluruh Indonesia",
                  },
                  {
                    icon: Package,
                    color: "text-orange-500",
                    bg: "bg-orange-50",
                    text: "Garansi Resmi 1 Tahun",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
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
    </div>
  );
}