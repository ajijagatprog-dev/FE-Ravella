"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Check, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  rawPrice: number;
  image: string;
  badge: string;
  rating: number;
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ visible: boolean; productName: string }>(
    { visible: false, productName: "" },
  );

  useEffect(() => {
    // Check if cache is still valid (not invalidated by admin updates)
    const isCacheValid = (cacheTs: number) => {
      try {
        const version = localStorage.getItem("ravelle_cache_version");
        if (version && parseInt(version) > cacheTs) return false;
      } catch {}
      return Date.now() - cacheTs < 5 * 60 * 1000;
    };

    // Try to restore from cache first
    try {
      const cached = localStorage.getItem("ravelle_new_products");
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (isCacheValid(ts)) {
          setProducts(data);
          setIsLoading(false);
          return; // Cache is fresh, skip API call
        }
      }
    } catch {}

    const fetchNewProducts = async () => {
      try {
        const res = await api.get("/products", {
          params: { limit: 4, sort: "latest" },
        });
        if (res.data.status === "success") {
          const mapped = res.data.data.data.map((item: any) => {
            const displayPrice =
              item.sale_price && item.sale_price > 0
                ? item.sale_price
                : item.price;
            return {
              id: item.id,
              title: item.name,
              category: item.category || "Peralatan Masak",
              price: new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(displayPrice),
              rawPrice: displayPrice,
              image:
                item.image ||
                "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
              badge: item.badge || "New",
              rating: item.rating ? parseFloat(item.rating) : 0,
            };
          });
          setProducts(mapped);
          try {
            localStorage.setItem(
              "ravelle_new_products",
              JSON.stringify({ data: mapped, ts: Date.now() }),
            );
          } catch {}
        }
      } catch (error) {
        console.error("Failed to fetch new products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  const handleAddToCart = (p: Product) => {
    try {
      const stored = localStorage.getItem("ravelle_cart");
      let cart: any[] = [];
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          cart = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        cart = [];
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
            originalPrice: p.rawPrice,
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

  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20">
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
        className="max-w-[1600px] mx-auto"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 md:mb-14 gap-4">
          <div>
            {/* Eyebrow — Jost, wide tracking, matches header/hero style */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]">
                Koleksi Terbaru
              </span>
            </div>

            {/* Heading — Cormorant Garamond, brand-matched serif */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-neutral-900 mb-2">
              New Products
            </h2>

            <p className="text-neutral-500 text-xs sm:text-sm md:text-base font-normal tracking-wide">
              Produk terbaru yang baru saja kami tambahkan ke katalog
            </p>
          </div>

          {/* CTA — ghost style, consistent with HeroSection secondary button */}
          <Link
            href="/product"
            className="group flex items-center gap-2 px-4 sm:px-7 py-2 sm:py-3 border border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 text-[9px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Products Grid ── */}
        <div className="relative">
          {/* Mobile: 2-column Grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
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

/* ── BADGE COLORS ── */
const badgeStyle: Record<string, string> = {
  "Best Seller": "bg-neutral-900 text-white",
  Best: "bg-[#352309] text-white",
  "Hot Sales": "bg-red-600 text-white",
  New: "bg-white text-neutral-900 border border-neutral-200",
  Hot: "bg-neutral-700 text-white",
  Sale: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  Premium: "bg-neutral-800 text-white",
  Popular: "bg-neutral-600 text-white",
};

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div className="w-full md:w-auto md:min-w-0 flex-none snap-start group">
      {/* Image Container — clickable to product detail */}
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden mb-3 sm:mb-4 bg-neutral-50 rounded-xl border border-neutral-100 p-3 sm:p-5 flex items-center justify-center"
      >
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase shadow-sm ${
              badgeStyle[product.badge] ?? "bg-neutral-900 text-white"
            }`}
          >
            {product.badge}
          </span>
        </div>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.title}
          className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
        />

        {/* Hover overlay — desktop only */}
        <div className="absolute inset-0 bg-black/20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-400" />

        {/* Quick Add — always visible on mobile, hover on desktop */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 bg-white/95 backdrop-blur-sm py-2 md:py-3 font-medium text-neutral-900 text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] uppercase translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-neutral-100 z-20"
        >
          <ShoppingBag className="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span className="hidden sm:inline">Tambah ke Keranjang</span>
          <span className="sm:hidden">+ Keranjang</span>
        </button>
      </Link>

      {/* Product Info */}
      <div>
        {/* Category */}
        <p className="text-neutral-400 text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]">
          {product.category}
        </p>

        {/* Product Title — clickable to product detail */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-neutral-900 mb-1.5 sm:mb-2 line-clamp-1 group-hover:text-neutral-600 transition-colors leading-tight cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm sm:text-base md:text-lg text-neutral-900 tracking-wide">
            {product.price}
          </p>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-xs font-medium text-neutral-500 tracking-wide">
              {product.rating}
            </span>
          </div>
        </div>

        {/* Thin bottom border — editorial touch */}
        <div className="mt-4 h-[1px] bg-neutral-100 group-hover:bg-neutral-300 transition-colors duration-300" />
      </div>
    </div>
  );
}
