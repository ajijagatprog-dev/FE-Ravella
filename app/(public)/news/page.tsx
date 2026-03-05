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
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export interface PublicArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  views: string;
  isFeatured: boolean;
  author: string;
  content: string[];
}

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [articles, setArticles] = useState<PublicArticle[]>([]);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/news?limit=100&status=published');
      if (res.data.status === 'success') {
        const mapped = res.data.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt || (item.content ? item.content.substring(0, 100) + '...' : ''),
          image: item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
          category: item.category,
          date: item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : '-',
          readTime: item.read_time || "5 min",
          views: item.views?.toString() || "0",
          isFeatured: item.is_featured ? true : false,
          author: item.author || "Admin",
          content: [item.content],
        }));
        setArticles(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const categories = [
    { name: "Semua", count: articles.length },
    { name: "Tips & Trik", count: articles.filter((a) => a.category === "Tips & Trik").length },
    { name: "Tutorial", count: articles.filter((a) => a.category === "Tutorial").length },
    { name: "Panduan", count: articles.filter((a) => a.category === "Panduan").length },
    { name: "Trend", count: articles.filter((a) => a.category === "Trend").length },
    { name: "Resep", count: articles.filter((a) => a.category === "Resep").length },
  ];

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    if (activeCategory !== "Semua") filtered = filtered.filter((a) => a.category === activeCategory);
    if (searchQuery) filtered = filtered.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [articles, activeCategory, searchQuery]);

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
                className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-medium transition-all ${activeCategory === cat.name
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
                <Link key={article.id} href={`/news/${article.id}`} className="group relative bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-500 overflow-hidden block">

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
                      <span
                        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-black transition-colors group/btn"
                        style={{ fontFamily: JOST }}
                      >
                        <span>Baca</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
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
                <Link key={article.id} href={`/news/${article.id}`} className="group bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden block">

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
                      <span className="w-7 h-7 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors">
                        <BookmarkPlus className="w-3.5 h-3.5 text-neutral-700" />
                      </span>
                      <span className="w-7 h-7 bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors">
                        <Share2 className="w-3.5 h-3.5 text-neutral-700" />
                      </span>
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

                    <span
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-200 text-neutral-700 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-neutral-800 hover:text-neutral-900 hover:bg-neutral-50 transition-all group/btn"
                      style={{ fontFamily: JOST }}
                    >
                      <span>Baca Artikel</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
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