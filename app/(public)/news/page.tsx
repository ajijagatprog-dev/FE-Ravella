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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const categories = useMemo(() => [
    { name: "Semua", count: articles.length },
    { name: "Tips & Trik", count: articles.filter((a) => a.category === "Tips & Trik").length },
    { name: "Tutorial", count: articles.filter((a) => a.category === "Tutorial").length },
    { name: "Panduan", count: articles.filter((a) => a.category === "Panduan").length },
    { name: "Trend", count: articles.filter((a) => a.category === "Trend").length },
    { name: "Resep", count: articles.filter((a) => a.category === "Resep").length },
  ], [articles]);

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
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden bg-neutral-900">
        <motion.div
           initial={{ scale: 1.1, opacity: 0 }}
           animate={{ scale: 1, opacity: 0.5 }}
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24 xl:px-40">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-white/60" />
              <span className="text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em]">
                Ravella Journal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-7xl md:text-8xl font-light text-white mb-6 leading-[1]"
              style={{ fontFamily: CORMORANT }}
            >
              Culinary <br />
              <span className="font-semibold italic text-neutral-200">Inspiration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white/60 text-sm sm:text-lg font-light leading-relaxed max-w-lg"
            >
              Temukan tips eksklusif, tutorial mendalam, dan tren gaya hidup terkini dari para ahli Ravella.
            </motion.p>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ── MAIN ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-20 sm:py-24">

        {/* Search & Filter */}
        <div className="mb-20">
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 w-full max-w-2xl px-8 py-5 rounded-full border border-neutral-200 bg-white shadow-xl focus-within:border-neutral-900 transition-all duration-500"
            >
              <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari artikel, tips, atau resep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base text-neutral-700 placeholder:text-neutral-400 outline-none font-light"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveCategory(cat.name)}
                className={`relative px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-black transition-all ${
                  activeCategory === cat.name ? "text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {activeCategory === cat.name && (
                  <motion.div 
                    layoutId="activeNewsCat"
                    className="absolute inset-0 bg-neutral-900 rounded-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
                <span className={`ml-2 text-[9px] ${activeCategory === cat.name ? "text-white/50" : "text-neutral-300"}`}>
                  ({cat.count})
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── FEATURED SECTION ── */}
        {!searchQuery && activeCategory === "Semua" && featuredArticles.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
               <Sparkles className="w-4 h-4 text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Editor's Picks</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white overflow-hidden"
                >
                  <Link href={`/news/${article.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />
                      
                      <div className="absolute bottom-8 left-8 right-8">
                         <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black tracking-[0.2em] uppercase mb-4 border border-white/20">
                           {article.category}
                         </span>
                         <h3 className="text-3xl sm:text-4xl font-light text-white mb-4 line-clamp-2 leading-tight" style={{ fontFamily: CORMORANT }}>
                           {article.title}
                         </h3>
                         <div className="flex items-center gap-6 text-white/60 text-[10px] tracking-widest uppercase font-bold">
                            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── ALL ARTICLES ── */}
        <section>
          <div className="flex items-center justify-between mb-12 border-b border-neutral-100 pb-8">
             <div className="flex items-center gap-4">
                <TrendingUp className="w-5 h-5 text-neutral-900" />
                <h2 className="text-3xl font-light text-neutral-900" style={{ fontFamily: CORMORANT }}>
                  {activeCategory === "Semua" ? "Latest Articles" : activeCategory}
                </h2>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
               {activeCategory === "Semua" && !searchQuery ? regularArticles.length : filteredArticles.length} Stories
             </span>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] bg-neutral-100 mb-6" />
                    <div className="h-3 bg-neutral-100 mb-4 w-1/3" />
                    <div className="h-6 bg-neutral-100 mb-4 w-3/4" />
                    <div className="h-10 bg-neutral-100 w-full" />
                 </div>
               ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-32 bg-neutral-50 border border-dashed border-neutral-200">
               <BookmarkPlus className="w-12 h-12 text-neutral-200 mx-auto mb-6" />
               <h3 className="text-2xl font-light text-neutral-900 mb-2" style={{ fontFamily: CORMORANT }}>No articles found</h3>
               <p className="text-neutral-500 text-sm font-light">Coba kata kunci lain untuk hasil yang lebih baik.</p>
            </div>
          ) : (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { 
                    staggerChildren: 0.1,
                    duration: 0.8
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              {(activeCategory === "Semua" && !searchQuery ? regularArticles : filteredArticles).map((article) => (
                <motion.div
                  key={article.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="group flex flex-col"
                >
                  <Link href={`/news/${article.id}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50 mb-6">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors duration-500" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white text-neutral-900 text-[9px] font-black tracking-[0.2em] uppercase shadow-xl">
                          {article.category}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      <div className="absolute top-3.5 right-3.5 flex gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all">
                          <BookmarkPlus className="w-3.5 h-3.5 text-neutral-400 group-hover:text-inherit" />
                        </span>
                        <span className="w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all">
                          <Share2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-inherit" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-neutral-400 text-[10px] tracking-widest uppercase font-bold mb-4">
                       <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                       <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                    </div>

                    <Link href={`/news/${article.id}`}>
                      <h3 className="text-2xl font-medium text-neutral-900 mb-4 line-clamp-2 hover:text-neutral-500 transition-colors leading-snug" style={{ fontFamily: CORMORANT }}>
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-neutral-500 text-sm font-light mb-8 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="mt-auto">
                      <Link
                        href={`/news/${article.id}`}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 hover:text-neutral-500 transition-colors group/link"
                      >
                        Read Article
                        <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Load More */}
        {!isLoading && filteredArticles.length > 6 && (
          <div className="mt-24 text-center">
             <button className="group relative px-12 py-5 border border-neutral-200 text-neutral-900 text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:border-neutral-900">
                <span className="relative z-10">Discover More Stories</span>
                <div className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 group-hover:text-white ml-2">↓</span>
             </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}