"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Check,
  ShoppingCart,
  Timer,
  Zap,
  Tag,
  Copy,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  rawPrice: number;
  originalPrice: number;
  image: string;
  badge: string;
  rating: number;
  discount: number;
}

export default function FlashSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; productName: string }>(
    { visible: false, productName: "" },
  );
  const [vouchers, setVouchers] = useState<
    Array<{ code: string; description: string }>
  >([]);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await api.get("/vouchers/active");
        if (res.data.status === "success" && res.data.data.length > 0) {
          const mappedVouchers = res.data.data.map((v: any) => {
            const desc =
              v.description ||
              (v.type === "percent"
                ? `Diskon ${parseFloat(v.value)}% untuk pembelian Anda`
                : `Diskon Rp ${parseInt(v.value).toLocaleString("id-ID")} untuk pembelian Anda`);
            return { code: v.code, description: desc };
          });
          setVouchers(mappedVouchers);
        }
      } catch (error) {
        console.error("Failed to fetch voucher", error);
      }
    };
    fetchVoucher();

    const fetchFlashSaleProducts = async () => {
      try {
        // Fetch products with active flash sale
        const res = await api.get("/products", {
          params: { is_flash_sale: true, limit: 4 },
        });
        if (res.data.status === "success") {
          const items = res.data.data.data || res.data.data;

          if (items.length === 0) {
            setIsLoading(false);
            return;
          }

          let earliestEnd: Date | null = null;

          const mapped = items.map((item: any) => {
            const activePromo = item.active_promotion;
            const finalPrice = item.promoted_price || item.price;
            const origPrice = item.price;

            let discPercent = item.discount || 0;
            if (activePromo) {
              if (activePromo.ends_at) {
                const endsAtDate = new Date(activePromo.ends_at);
                if (!earliestEnd || endsAtDate < earliestEnd) {
                  earliestEnd = endsAtDate;
                }
              }
              if (activePromo.discount_type === "percent") {
                discPercent = activePromo.discount_value;
              } else {
                discPercent = Math.round(
                  ((origPrice - finalPrice) / origPrice) * 100,
                );
              }
            }

            return {
              id: item.id,
              title: item.name,
              category: item.category || "Peralatan Masak",
              price: new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(finalPrice),
              rawPrice: finalPrice,
              originalPrice: origPrice,
              image:
                item.image ||
                "https://images.unsplash.com/photo-1558317374-067fb5f30001",
              badge: "Flash Sale",
              rating: item.rating ? parseFloat(item.rating) : 0,
              discount: discPercent,
            };
          });

          setProducts(mapped);
          if (earliestEnd) setEndTime(earliestEnd);
        }
      } catch (error) {
        console.error("Failed to fetch flash sale products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashSaleProducts();
  }, []);

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        // Optionally refetch or hide component
        return;
      }

      setTimeLeft({
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const handleAddToCart = (p: Product) => {
    try {
      const stored = localStorage.getItem("ravelle_cart");
      let cart: any[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        cart = Array.isArray(parsed) ? parsed : [];
      }

      const exists = cart.find((item) => item.id === p.id);
      if (exists) {
        cart = cart.map((item) =>
          item.id === p.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item,
        );
      } else {
        cart = [
          ...cart,
          {
            id: p.id,
            name: p.title,
            price: p.rawPrice,
            originalPrice: p.originalPrice,
            image: p.image,
            badge: p.badge,
            category: p.category,
            quantity: 1,
            selected: true,
          },
        ];
      }
      localStorage.setItem("ravelle_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("ravelle_cart_updated"));
      setToast({ visible: true, productName: p.title });
      setTimeout(() => setToast({ visible: false, productName: "" }), 2500);
    } catch (error) {
      console.error("Cart action failed:", error);
    }
  };

  if (!isLoading && products.length === 0) {
    return null; // Hide section if no flash sale
  }

  return (
    <section className="bg-stone-900 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Toast */}
      <div
        className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${
          toast.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-4 min-w-[280px] max-w-sm">
          <ShoppingCart className="w-4 h-4 text-neutral-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-neutral-900 text-sm">
              Ditambahkan ke Keranjang
            </p>
            <p className="text-xs text-neutral-400 truncate mt-0.5">
              {toast.productName}
            </p>
          </div>
          <Check className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1600px] mx-auto relative z-10"
      >
        {/* Voucher Banners */}
        {vouchers.length > 0 && (
          <div className="mb-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {vouchers.map((v, idx) => (
              <VoucherCard key={idx} voucher={v} />
            ))}
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 sm:mb-10 md:mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Zap className="w-4 h-4 text-red-500" fill="currentColor" />
              <span className="text-red-400 font-bold text-[11px] uppercase tracking-[0.25em]">
                Penawaran Terbatas
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-3">
              Flash Sale
            </h2>

            {/* Countdown Timer */}
            {timeLeft && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 flex-col">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg shadow-inner">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">
                    Jam
                  </span>
                </div>
                <span className="text-white text-xl font-bold self-start mt-2">
                  :
                </span>
                <div className="flex items-center gap-1.5 flex-col">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg shadow-inner">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">
                    Mnt
                  </span>
                </div>
                <span className="text-white text-xl font-bold self-start mt-2">
                  :
                </span>
                <div className="flex items-center gap-1.5 flex-col">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 items-center text-rose-400 w-12 h-12 flex justify-center text-xl font-bold rounded-lg shadow-inner">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest">
                    Dtk
                  </span>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/sale"
            className="group flex items-center gap-2.5 px-7 py-3 border border-white/20 text-white hover:bg-white hover:text-stone-900 transition-all duration-300 text-[11px] tracking-[0.2em] uppercase font-medium bg-white/5 backdrop-blur-sm"
          >
            <span>Lihat Semua Promo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Products Grid ── */}
        <div className="relative">
          {isLoading ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto gap-4 lg:gap-6 pb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[200px] animate-pulse">
                  <div className="aspect-square bg-white/5 rounded-xl mb-3 sm:mb-4" />
                  <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal Scroll */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide">
                {products.map((item, i) => (
                  <ProductCard
                    key={i}
                    product={item}
                    index={i}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Tablet & Desktop: Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((item, i) => (
                  <ProductCard
                    key={i}
                    product={item}
                    index={i}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: (p: Product) => void;
}) {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  return (
    <div className="min-w-[200px] sm:min-w-[240px] md:min-w-0 snap-start group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden mb-3 sm:mb-4 bg-white rounded-xl border border-white/10 p-4 sm:p-5 flex items-center justify-center">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-lg shadow-red-600/30">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Quick Add */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-4 right-4 bg-stone-900 border border-stone-800 text-white py-3 font-bold text-[11px] tracking-[0.2em] uppercase translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-black shadow-xl"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>

      {/* Product Info */}
      <div>
        <p className="text-white/50 text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]">
          {product.category}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-base sm:text-lg md:text-xl text-white mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-red-400 transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-red-400 font-bold tracking-wide bg-red-400/10 px-2 py-0.5 rounded">
                Hemat {formatPrice(product.originalPrice - product.rawPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm sm:text-base md:text-lg text-white tracking-wide">
              {product.price}
            </p>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-xs font-medium text-white/50 tracking-wide">
                {product.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 h-[1px] bg-white/10 group-hover:bg-red-500/50 transition-colors duration-300" />
      </div>
    </div>
  );
}

function VoucherCard({
  voucher,
}: {
  voucher: { code: string; description: string };
}) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full"
    >
      <div className="border border-white/20 bg-stone-900/40 backdrop-blur-md rounded-[1.5rem] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 shadow-2xl overflow-hidden relative h-full">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-10 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-red-400/80 uppercase tracking-[0.25em] font-bold mb-1.5 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Voucher Promo
            </p>
            <p className="text-white text-xs sm:text-sm md:text-base font-light tracking-wide line-clamp-2">
              {voucher.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full sm:w-auto bg-black/50 rounded-2xl p-2 border border-white/10 relative z-10">
          <div className="px-3 sm:px-4 py-2 w-full md:w-auto text-center md:text-left md:border-r border-white/10 border-dashed">
            <span className="font-mono text-white text-sm sm:text-base lg:text-lg font-bold tracking-[0.1em] sm:tracking-[0.15em] break-all md:break-normal">
              {voucher.code}
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(voucher.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 min-w-[120px] w-full md:w-auto ${
              copied
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-white text-stone-900 hover:bg-stone-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Tersalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Salin Kode
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
