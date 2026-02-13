"use client";

import {
  Search,
  Calendar,
  Eye,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Filter,
  BookmarkPlus,
  Share2,
} from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const articles = [
    {
      id: 1,
      title: "5 Kebiasaan Sehari-hari yang Membuat Rice Cooker Cepat Rusak",
      excerpt:
        "Hindari kesalahan umum dalam penggunaan rice cooker yang dapat memperpendek umur perangkat Anda. Pelajari cara perawatan yang benar untuk investasi dapur jangka panjang.",
      image:
        "data:image/jpeg;base64,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",
      category: "Tips & Trik",
      date: "15 Januari 2026",
      readTime: "5 min",
      views: "2.5k",
      isFeatured: true,
      author: "Tim Ravella",
    },
    {
      id: 2,
      title: "Fungsi Tersembunyi Rice Cooker yang Jarang Disadari",
      excerpt:
        "Rice cooker Anda bisa lebih dari sekedar memasak nasi. Temukan berbagai fungsi tersembunyi yang akan mengubah cara Anda memasak sehari-hari.",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      category: "Tutorial",
      date: "12 Januari 2026",
      readTime: "7 min",
      views: "3.2k",
      isFeatured: true,
      author: "Chef Maria",
    },
    {
      id: 3,
      title: "Cara Membersihkan Blender Agar Tetap Awet dan Higienis",
      excerpt:
        "Panduan lengkap membersihkan blender dengan benar untuk menjaga kebersihan dan memperpanjang umur perangkat. Tips praktis dari ahli.",
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
      category: "Panduan",
      date: "10 Januari 2026",
      readTime: "6 min",
      views: "1.8k",
      isFeatured: false,
      author: "Dr. Clean",
    },
    {
      id: 4,
      title: "Kesalahan Umum Menggunakan Juicer yang Harus Dihindari",
      excerpt:
        "Maksimalkan hasil jus Anda dan hindari kerusakan pada juicer dengan menghindari kesalahan-kesalahan umum yang sering dilakukan pemula.",
      image:
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
      category: "Tips & Trik",
      date: "8 Januari 2026",
      readTime: "5 min",
      views: "2.1k",
      isFeatured: false,
      author: "Nutrisi Expert",
    },
    {
      id: 5,
      title: "Tren Peralatan Dapur Modern di Tahun 2026",
      excerpt:
        "Simak tren terbaru dalam dunia peralatan dapur yang akan membuat aktivitas memasak Anda lebih efisien, hemat energi, dan menyenangkan.",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      category: "Trend",
      date: "5 Januari 2026",
      readTime: "8 min",
      views: "4.5k",
      isFeatured: false,
      author: "Tim Ravella",
    },
    {
      id: 6,
      title: "Resep Sehat dengan Peralatan Dapur Ravella",
      excerpt:
        "Kumpulan resep sehat dan praktis yang bisa Anda buat menggunakan peralatan dapur Ravella kesayangan Anda. Mudah dan lezat!",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      category: "Resep",
      date: "3 Januari 2026",
      readTime: "10 min",
      views: "5.3k",
      isFeatured: false,
      author: "Chef Budi",
    },
    {
      id: 7,
      title: "Panduan Memilih Rice Cooker Sesuai Kebutuhan Keluarga",
      excerpt:
        "Tips memilih rice cooker yang tepat berdasarkan jumlah anggota keluarga, fitur yang dibutuhkan, dan budget yang tersedia.",
      image:
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
      category: "Panduan",
      date: "1 Januari 2026",
      readTime: "6 min",
      views: "3.7k",
      isFeatured: false,
      author: "Tim Ravella",
    },
    {
      id: 8,
      title: "Hemat Listrik dengan Teknik Memasak yang Tepat",
      excerpt:
        "Cara menggunakan peralatan dapur dengan bijak untuk menghemat tagihan listrik bulanan tanpa mengurangi kualitas masakan.",
      image:
        "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80",
      category: "Tips & Trik",
      date: "28 Desember 2025",
      readTime: "5 min",
      views: "2.9k",
      isFeatured: false,
      author: "Energy Saver",
    },
  ];

  const categories = [
    { name: "Semua", count: articles.length },
    {
      name: "Tips & Trik",
      count: articles.filter((a) => a.category === "Tips & Trik").length,
    },
    {
      name: "Tutorial",
      count: articles.filter((a) => a.category === "Tutorial").length,
    },
    {
      name: "Panduan",
      count: articles.filter((a) => a.category === "Panduan").length,
    },
    {
      name: "Trend",
      count: articles.filter((a) => a.category === "Trend").length,
    },
    {
      name: "Resep",
      count: articles.filter((a) => a.category === "Resep").length,
    },
  ];

  // Filter logic
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by category
    if (activeCategory !== "Semua") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory,
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, articles]);

  const featuredArticles = articles.filter((article) => article.isFeatured);
  const regularArticles = filteredArticles.filter(
    (article) => !article.isFeatured,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                Artikel & Tips
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Inspirasi{" "}
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Dapur Anda
              </span>
            </h1>
            <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Tips praktis, tutorial lengkap, dan tren terkini seputar peralatan
              dapur untuk memaksimalkan pengalaman memasak Anda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16">
        {/* Search & Filter Section */}
        <div className="mb-10 sm:mb-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari artikel, tips, atau tutorial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none bg-white shadow-sm transition-all text-gray-900 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div className="flex flex-wrap gap-3 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                    activeCategory === cat.name
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === cat.name
                        ? "bg-white/20"
                        : "bg-gray-100"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Menampilkan{" "}
              <span className="font-bold text-orange-600">
                {filteredArticles.length}
              </span>{" "}
              artikel
              {searchQuery && (
                <>
                  {" "}
                  untuk pencarian{" "}
                  <span className="font-bold text-gray-900">
                    "{searchQuery}"
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Featured Articles */}
        {!searchQuery && activeCategory === "Semua" && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Artikel Pilihan
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Featured Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold">Featured</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full">
                        {article.category}
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 group-hover:text-orange-300 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          <span>{article.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-base mb-5 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-medium">
                        Oleh {article.author}
                      </span>
                      <button className="group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                        <span>Baca</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {searchQuery
                ? "Hasil Pencarian"
                : activeCategory === "Semua"
                  ? "Artikel Terbaru"
                  : `Artikel ${activeCategory}`}
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Artikel Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                Coba kata kunci lain atau ubah filter kategori
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Semua");
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {regularArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${article.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-full shadow-lg">
                        {article.category}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                        <BookmarkPlus className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                        <Share2 className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                      <span className="text-gray-300">•</span>
                      <span>{article.author}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm sm:text-base mb-5 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <button className="group/btn w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 rounded-xl font-bold text-sm hover:from-orange-500 hover:to-pink-500 hover:text-white transition-all border border-orange-100 hover:border-transparent">
                      <span>Baca Artikel</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold hover:border-orange-500 hover:text-orange-600 transition-all hover:shadow-lg">
              Muat Artikel Lainnya
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
