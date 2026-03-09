"use client";

import { ArrowRight, Home, Utensils, Package, Sofa, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function CategoryGrid() {
  const router = useRouter();
  const categories = [
    {
      id: "Home & Kitchen Appliance",
      title: "Home & Kitchen Appliance",
      subtitle: "Peralatan Rumah & Dapur",
      icon: Home,
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      count: "150+ Produk",
    },
    {
      id: "Knife set",
      title: "Knife Set",
      subtitle: "Pisau & Alat Potong",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
      count: "80+ Produk",
    },
    {
      id: "ezy series",
      title: "Ezy Series",
      subtitle: "Koleksi Premium",
      icon: Package,
      image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
      count: "120+ Produk",
    },
    {
      id: "home living",
      title: "Home Living",
      subtitle: "Dekorasi & Furniture",
      icon: Sofa,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      count: "200+ Produk",
    },
    {
      id: "Kitchen Tools",
      title: "Kitchen Tools",
      subtitle: "Alat Masak Modern",
      icon: Laptop,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      count: "95+ Produk",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/product?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section
      className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden"
      style={{ fontFamily: JOST }}
    >
      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-5 h-[1px] bg-neutral-400" />
            <span
              className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]"
              style={{ fontFamily: JOST }}
            >
              Kategori Produk
            </span>
            <div className="w-5 h-[1px] bg-neutral-400" />
          </div>

          {/* Heading — Cormorant Garamond */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-neutral-900 mb-4"
            style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
          >
            Shop by{" "}
            <em
              className="font-semibold not-italic"
              style={{ fontFamily: CORMORANT, fontStyle: "italic" }}
            >
              Category
            </em>
          </h2>

          {/* Thin rule */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-[1px] bg-neutral-300" />
          </div>

          <p
            className="text-neutral-500 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed tracking-wide"
            style={{ fontFamily: JOST }}
          >
            Temukan produk berkualitas dalam kategori yang telah kami kurasi khusus untuk Anda
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={i}
              category={cat}
              index={i}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>

        {/* ── View All CTA ── */}
        <div className="text-center mt-12 sm:mt-16">
          <button
            className="group inline-flex items-center gap-3 px-10 py-4 border border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 text-[11px] tracking-[0.2em] uppercase font-medium"
            style={{ fontFamily: JOST }}
          >
            <span>Lihat Semua Kategori</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index, onClick }: { category: any; index: number; onClick: () => void }) {
  const Icon = category.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden cursor-pointer
        shadow-sm hover:shadow-xl transition-all duration-700 ease-out
        hover:-translate-y-1 ${index === 1 ? "lg:mt-8" : index === 3 ? "lg:mt-4" : ""}`}
    >
      {/* Image Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${category.image})` }}
      />

      {/* Gradient — strong bottom for legibility, subtle top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-all duration-700" />

      {/* Hover: slight warm tint */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Top Badge */}
      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-10">
        <div
          className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm"
          style={{ fontFamily: JOST }}
        >
          <Icon className="w-3.5 h-3.5 text-neutral-700" />
          <span className="text-[10px] font-medium text-neutral-800 tracking-[0.12em] uppercase">
            {category.count}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8">

        {/* Subtitle — appears on hover */}
        <p
          className="text-white/70 text-[10px] sm:text-[11px] font-light mb-1.5 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
          style={{ fontFamily: JOST }}
        >
          {category.subtitle}
        </p>

        {/* Title — Cormorant Garamond */}
        <h3
          className="text-white text-2xl sm:text-3xl md:text-4xl font-light leading-tight mb-4 drop-shadow-lg transition-all duration-700 group-hover:-translate-y-1"
          style={{ fontFamily: CORMORANT, letterSpacing: "0" }}
        >
          {category.title}
        </h3>

        {/* Jelajahi Button — appears on hover */}
        <button
          className="inline-flex items-center gap-2.5 bg-white text-neutral-900 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-neutral-100"
          style={{ fontFamily: JOST }}
        >
          Jelajahi
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Bottom line — thin, white, slides in on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
      </div>
    </div>
  );
}