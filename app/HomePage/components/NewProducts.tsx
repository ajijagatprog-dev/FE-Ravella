"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  badge: string;
  rating: number;
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const res = await api.get('/products', { params: { limit: 4, sort: 'latest' } });
        if (res.data.status === 'success') {
          const mapped = res.data.data.data.map((item: any) => {
            const displayPrice = item.sale_price && item.sale_price > 0 ? item.sale_price : item.price;
            return {
              id: item.id,
              title: item.name,
              category: item.category || 'Peralatan Masak',
              price: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(displayPrice),
              image: item.image || "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
              badge: item.badge || (item.is_featured ? "Best Seller" : "New"),
              rating: item.rating ? parseFloat(item.rating) : 0,
            };
          });
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch new products", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  return (
    <section
      className="bg-white px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20"
      style={{ fontFamily: JOST }}
    >
      <div className="max-w-[1600px] mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 md:mb-14 gap-4">
          <div>
            {/* Eyebrow — Jost, wide tracking, matches header/hero style */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span
                className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]"
                style={{ fontFamily: JOST }}
              >
                Koleksi Terbaru
              </span>
            </div>

            {/* Heading — Cormorant Garamond, brand-matched serif */}
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] text-neutral-900 mb-3"
              style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
            >
              New{" "}
              <em
                className="font-semibold not-italic"
                style={{ fontFamily: CORMORANT, fontStyle: "italic" }}
              >
                Products
              </em>
            </h2>

            <p
              className="text-neutral-500 text-sm sm:text-base font-light tracking-wide"
              style={{ fontFamily: JOST }}
            >
              Produk terbaru yang baru saja kami tambahkan ke katalog
            </p>
          </div>

          {/* CTA — ghost style, consistent with HeroSection secondary button */}
          <Link
            href="/product"
            className="group flex items-center gap-2.5 px-7 py-3 border border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 text-[11px] tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: JOST }}
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── Products Grid ── */}
        <div className="relative">
          {/* Mobile: Horizontal Scroll */}
          <div className="flex lg:hidden overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
            {products.map((item, i) => (
              <ProductCard key={i} product={item} index={i} />
            ))}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {products.map((item, i) => (
              <ProductCard key={i} product={item} index={i} />
            ))}
          </div>

          {/* Scroll dots — mobile */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
            {products.map((_, i) => (
              <div key={i} className="w-4 h-[1px] bg-neutral-300" />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

/* ── BADGE COLORS ── */
const badgeStyle: Record<string, string> = {
  "Best Seller": "bg-neutral-900 text-white",
  "New": "bg-white text-neutral-900 border border-neutral-200",
  "Hot": "bg-neutral-700 text-white",
  "Sale": "bg-neutral-100 text-neutral-700 border border-neutral-200",
};

function ProductCard({ product }: { product: Product; index: number }) {
  return (
    <div
      className="min-w-[260px] sm:min-w-[300px] lg:min-w-0 snap-start group"
      style={{ fontFamily: JOST }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-neutral-100">

        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-3 py-1 text-[10px] font-medium tracking-[0.15em] uppercase shadow-sm ${badgeStyle[product.badge] ?? "bg-neutral-900 text-white"
              }`}
            style={{ fontFamily: JOST }}
          >
            {product.badge}
          </span>
        </div>

        {/* Product Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Quick Add */}
        <button
          className="absolute bottom-4 left-4 right-4 bg-white py-3 font-medium text-neutral-900 text-[11px] tracking-[0.2em] uppercase translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-neutral-100"
          style={{ fontFamily: JOST }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Tambah ke Keranjang
        </button>
      </div>

      {/* Product Info */}
      <div>
        {/* Category */}
        <p
          className="text-neutral-400 text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]"
          style={{ fontFamily: JOST }}
        >
          {product.category}
        </p>

        {/* Product Title — Cormorant Garamond */}
        <h3
          className="font-light text-xl sm:text-2xl text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-600 transition-colors leading-tight"
          style={{ fontFamily: CORMORANT, letterSpacing: "0" }}
        >
          {product.title}
        </h3>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <p
            className="font-medium text-base sm:text-lg text-neutral-900 tracking-wide"
            style={{ fontFamily: JOST }}
          >
            {product.price}
          </p>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span
              className="text-xs font-medium text-neutral-500 tracking-wide"
              style={{ fontFamily: JOST }}
            >
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