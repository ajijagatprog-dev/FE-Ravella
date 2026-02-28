"use client";

import {
  Search,
  Calendar,
  Eye,
  Clock,
  ArrowRight,
  TrendingUp,
  BookmarkPlus,
  Share2,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const articles = [
    { id: 1, title: "5 Kebiasaan Sehari-hari yang Membuat Rice Cooker Cepat Rusak", excerpt: "Hindari kesalahan umum dalam penggunaan rice cooker yang dapat memperpendek umur perangkat Anda. Pelajari cara perawatan yang benar untuk investasi dapur jangka panjang.", image: "data:image/jpeg;base64,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", category: "Tips & Trik", date: "15 Januari 2026", readTime: "5 min", views: "2.5k", isFeatured: true, author: "Tim Ravelle" },
    { id: 2, title: "Fungsi Tersembunyi Rice Cooker yang Jarang Disadari", excerpt: "Rice cooker Anda bisa lebih dari sekedar memasak nasi. Temukan berbagai fungsi tersembunyi yang akan mengubah cara Anda memasak sehari-hari.", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", category: "Tutorial", date: "12 Januari 2026", readTime: "7 min", views: "3.2k", isFeatured: true, author: "Chef Maria" },
    { id: 3, title: "Cara Membersihkan Blender Agar Tetap Awet dan Higienis", excerpt: "Panduan lengkap membersihkan blender dengan benar untuk menjaga kebersihan dan memperpanjang umur perangkat. Tips praktis dari ahli.", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80", category: "Panduan", date: "10 Januari 2026", readTime: "6 min", views: "1.8k", isFeatured: false, author: "Dr. Clean" },
    { id: 4, title: "Kesalahan Umum Menggunakan Juicer yang Harus Dihindari", excerpt: "Maksimalkan hasil jus Anda dan hindari kerusakan pada juicer dengan menghindari kesalahan-kesalahan umum yang sering dilakukan pemula.", image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80", category: "Tips & Trik", date: "8 Januari 2026", readTime: "5 min", views: "2.1k", isFeatured: false, author: "Nutrisi Expert" },
    { id: 5, title: "Tren Peralatan Dapur Modern di Tahun 2026", excerpt: "Simak tren terbaru dalam dunia peralatan dapur yang akan membuat aktivitas memasak Anda lebih efisien, hemat energi, dan menyenangkan.", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80", category: "Trend", date: "5 Januari 2026", readTime: "8 min", views: "4.5k", isFeatured: false, author: "Tim Ravelle" },
    { id: 6, title: "Resep Sehat dengan Peralatan Dapur Ravelle", excerpt: "Kumpulan resep sehat dan praktis yang bisa Anda buat menggunakan peralatan dapur Ravelle kesayangan Anda. Mudah dan lezat!", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", category: "Resep", date: "3 Januari 2026", readTime: "10 min", views: "5.3k", isFeatured: false, author: "Chef Budi" },
    { id: 7, title: "Panduan Memilih Rice Cooker Sesuai Kebutuhan Keluarga", excerpt: "Tips memilih rice cooker yang tepat berdasarkan jumlah anggota keluarga, fitur yang dibutuhkan, dan budget yang tersedia.", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80", category: "Panduan", date: "1 Januari 2026", readTime: "6 min", views: "3.7k", isFeatured: false, author: "Tim Ravelle" },
    { id: 8, title: "Hemat Listrik dengan Teknik Memasak yang Tepat", excerpt: "Cara menggunakan peralatan dapur dengan bijak untuk menghemat tagihan listrik bulanan tanpa mengurangi kualitas masakan.", image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80", category: "Tips & Trik", date: "28 Desember 2025", readTime: "5 min", views: "2.9k", isFeatured: false, author: "Energy Saver" },
  ];

  const categories = [
    { name: "Semua",     count: articles.length },
    { name: "Tips & Trik", count: articles.filter((a) => a.category === "Tips & Trik").length },
    { name: "Tutorial",  count: articles.filter((a) => a.category === "Tutorial").length },
    { name: "Panduan",   count: articles.filter((a) => a.category === "Panduan").length },
    { name: "Trend",     count: articles.filter((a) => a.category === "Trend").length },
    { name: "Resep",     count: articles.filter((a) => a.category === "Resep").length },
  ];

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    if (activeCategory !== "Semua") filtered = filtered.filter((a) => a.category === activeCategory);
    if (searchQuery) filtered = filtered.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [activeCategory, searchQuery]);

  const featuredArticles = articles.filter((a) => a.isFeatured);
  const regularArticles = filteredArticles.filter((a) => !a.isFeatured);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
      <Header />

      {/* ── HERO ── */}
      <section className="relative h-[300px] sm:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span className="text-white/70 font-medium text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: JOST }}>
                Artikel &amp; Tips
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4 leading-[1.05]" style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}>
              Inspirasi{" "}
              <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
                Dapur Anda
              </em>
            </h1>

            <div className="w-10 h-[1px] bg-white/30 mb-5" />

            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-lg" style={{ fontFamily: JOST }}>
              Tips praktis, tutorial lengkap, dan tren terkini seputar peralatan dapur untuk memaksimalkan pengalaman memasak Anda.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16">

        {/* Search & Filter */}
        <div className="mb-10 sm:mb-12">

          {/* Search Bar — pill style, centered (same as ProductPage) */}
          <div className="flex justify-center mb-8">
            <div
              className="flex items-center gap-3 w-full max-w-lg px-5 py-3.5 rounded-full border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors"
              style={{ fontFamily: JOST }}
            >
              <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari artikel, tips, atau tutorial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 outline-none font-light"
                style={{ fontFamily: JOST }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-medium transition-all ${
                  activeCategory === cat.name
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                }`}
                style={{ fontFamily: JOST }}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${activeCategory === cat.name ? "text-white/60" : "text-neutral-400"}`}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-center text-neutral-500 text-[12px] tracking-wide font-light" style={{ fontFamily: JOST }}>
            Menampilkan{" "}
            <span className="font-medium text-neutral-900">{filteredArticles.length}</span>{" "}
            artikel
            {searchQuery && (
              <> untuk <span className="font-medium text-neutral-900">"{searchQuery}"</span></>
            )}
          </p>
        </div>

        {/* ── FEATURED ARTICLES ── */}
        {!searchQuery && activeCategory === "Semua" && (
          <section className="mb-16">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-4 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: JOST }}>
                Artikel Pilihan
              </span>
              <div className="w-4 h-[1px] bg-neutral-400" />
            </div>

            <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
              {featuredArticles.map((article) => (
                <article key={article.id} className="group relative bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-500 overflow-hidden">

                  {/* Image */}
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] tracking-[0.15em] uppercase font-medium" style={{ fontFamily: JOST }}>
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-white text-neutral-900 text-[10px] tracking-[0.15em] uppercase font-medium border border-neutral-100" style={{ fontFamily: JOST }}>
                        {article.category}
                      </span>
                    </div>

                    {/* Bottom overlay content */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-xl sm:text-2xl font-light text-white mb-3 line-clamp-2 group-hover:text-white/80 transition-colors leading-snug" style={{ fontFamily: CORMORANT }}>
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/60 text-[11px] tracking-wide" style={{ fontFamily: JOST }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-neutral-500 text-sm font-light leading-relaxed mb-5 line-clamp-2" style={{ fontFamily: JOST }}>
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 tracking-wide font-light" style={{ fontFamily: JOST }}>
                        Oleh {article.author}
                      </span>
                      <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-black transition-colors group/btn"
                        style={{ fontFamily: JOST }}
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── ALL ARTICLES ── */}
        <section>
          <div className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-4 h-[1px] bg-neutral-400" />
            <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: JOST }}>
              {searchQuery ? "Hasil Pencarian" : activeCategory === "Semua" ? "Artikel Terbaru" : `Artikel ${activeCategory}`}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-24">
              <Search className="w-10 h-10 text-neutral-300 mx-auto mb-5" />
              <h3 className="text-3xl font-light text-neutral-900 mb-3" style={{ fontFamily: CORMORANT }}>
                Artikel Tidak Ditemukan
              </h3>
              <p className="text-neutral-500 text-sm font-light mb-8" style={{ fontFamily: JOST }}>
                Coba kata kunci lain atau ubah filter kategori
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("Semua"); }}
                className="px-8 py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                style={{ fontFamily: JOST }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {regularArticles.map((article) => (
                <article key={article.id} className="group bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden">

                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-2.5 py-1 bg-white text-neutral-900 text-[10px] tracking-[0.12em] uppercase font-medium border border-neutral-100" style={{ fontFamily: JOST }}>
                        {article.category}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3.5 right-3.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors">
                        <BookmarkPlus className="w-3.5 h-3.5 text-neutral-700" />
                      </button>
                      <button className="w-7 h-7 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors">
                        <Share2 className="w-3.5 h-3.5 text-neutral-700" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-3.5 left-3.5 flex items-center gap-3 text-white/70 text-[11px]" style={{ fontFamily: JOST }}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-3 tracking-wide" style={{ fontFamily: JOST }}>
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                      <span className="text-neutral-200">•</span>
                      <span>{article.author}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-light text-neutral-900 mb-3 line-clamp-2 group-hover:text-neutral-600 transition-colors leading-snug" style={{ fontFamily: CORMORANT }}>
                      {article.title}
                    </h3>

                    <p className="text-neutral-500 text-sm font-light mb-5 line-clamp-2 leading-relaxed" style={{ fontFamily: JOST }}>
                      {article.excerpt}
                    </p>

                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 text-neutral-700 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-neutral-800 hover:text-neutral-900 hover:bg-neutral-50 transition-all group/btn"
                      style={{ fontFamily: JOST }}
                    >
                      <span>Baca Artikel</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {filteredArticles.length > 0 && (
          <div className="mt-14 text-center">
            <button
              className="px-10 py-3.5 border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.2em] uppercase font-medium hover:border-neutral-800 hover:text-neutral-900 transition-all"
              style={{ fontFamily: JOST }}
            >
              Muat Artikel Lainnya
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}