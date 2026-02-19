"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

interface Product {
  title: string;
  category: string;
  price: string;
  image: string;
  badge: string;
}

export default function NewProducts() {
  const products: Product[] = [
    {
      title: "Panci Set Premium",
      category: "Peralatan Masak",
      price: "Rp 450.000",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      badge: "Best Seller",
    },
    {
      title: "Knife Set Professional",
      category: "Pisau Dapur",
      price: "Rp 380.000",
      image:
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
      badge: "New",
    },
    {
      title: "Blender Multifungsi",
      category: "Elektronik",
      price: "Rp 595.000",
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
      badge: "Hot",
    },
    {
      title: "Food Container Set",
      category: "Penyimpanan",
      price: "Rp 220.000",
      image:
        "https://down-id.img.susercontent.com/file/d3ebf96f72eb08a71fd762fe6b6cd666_tn.webp",
      badge: "Sale",
    },
  ];

  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">
                Koleksi Terbaru
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 text-gray-900">
              New Products
            </h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              Produk terbaru yang baru saja kami tambahkan ke katalog
            </p>
          </div>

          <Link
            href="/product"
            className="group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r bg-gray-900 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
          >
            <span className="text-sm sm:text-base">Lihat Semua</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile, Grid on Desktop */}
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

          {/* Scroll Indicator for Mobile */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
            {products.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>

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

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <div className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start group">
      {/* Product Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
              product.badge === "Best Seller"
                ? "bg-gradient-to-r from-orange-500 to-pink-500"
                : product.badge === "New"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : product.badge === "Hot"
                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                    : "bg-gradient-to-r from-green-500 to-teal-500"
            }`}
          >
            {product.badge}
          </span>
        </div>

        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add Button */}
        <button className="absolute bottom-4 left-4 right-4 bg-white hover:bg-gray-50 py-3 rounded-xl font-bold text-gray-900 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl">
          <ShoppingBag className="w-4 h-4" />
          <span>Tambah ke Keranjang</span>
        </button>
      </div>

      {/* Product Info */}
      <div className="px-1">
        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-black text-lg sm:text-xl bg-gradient-to-r bg-black bg-clip-text text-transparent">
            {product.price}
          </p>
          <div className="flex items-center gap-1 text-yellow-400">
            <span className="text-xs sm:text-sm font-bold text-gray-700">
              4.9
            </span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
