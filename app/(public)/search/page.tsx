"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Calendar, Clock, ArrowRight, ChevronRight, X } from "lucide-react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import api from "@/lib/axios";


export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "products" | "news">("all");
    const [localQuery, setLocalQuery] = useState(query);

    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    useEffect(() => {
        if (!query) {
            setProducts([]);
            setNews([]);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, newsRes] = await Promise.all([
                    api.get("/products", { params: { search: query, limit: 12 } }),
                    api.get("/news", { params: { search: query, limit: 12, status: 'published' } })
                ]);

                if (productRes.data.status === "success") {
                    setProducts(productRes.data.data.data.map((item: any) => {
                        const activePromo = item.active_promotion;
                        const finalPrice = item.promoted_price || item.price;
                        const discPercent = activePromo ? (activePromo.discount_type === 'percent' ? activePromo.discount_value : Math.round((item.price - finalPrice) / item.price * 100)) : (item.discount || 0);
                        
                        return {
                            id: item.id,
                            name: item.name,
                            price: finalPrice,
                            originalPrice: item.price,
                            image: item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
                            discount: discPercent,
                            badge: item.badge,
                            active_promotion: activePromo
                        };
                    }));
                }

                if (newsRes.data.status === "success") {
                    setNews(newsRes.data.data.data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        excerpt: item.excerpt || (item.content ? item.content.substring(0, 100) + '...' : ''),
                        image: item.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
                        date: item.published_at ? new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : '-',
                        category: item.category,
                        readTime: item.read_time || "5 min",
                        author: item.author || "Admin"
                    })));
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

    const totalResults = products.length + news.length;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(localQuery.trim())}`;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between" >
            <Header />

            <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-12 md:py-20 flex-1 font-sans">
                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-6 sm:mb-8 font-sans">
                    <Link href="/" className="hover:text-black transition-colors font-medium">Home</Link>
                    <ChevronRight className="w-3 h-3 text-neutral-300" />
                    <span className="text-neutral-900 font-semibold">Search</span>
                </div>

                {/* ── Header & Search Input Box ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm mb-8 sm:mb-12 transition-all hover:shadow-md">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                            <Search className="w-3.5 h-3.5" />
                            Discover Ravella
                        </span>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-none mb-6">
                            {query ? (
                                <>
                                    Hasil Pencarian: <span className="text-blue-600 font-light italic">"{query}"</span>
                                </>
                            ) : (
                                "Cari Koleksi Ravella"
                            )}
                        </h1>
                        
                        {/* Dynamic Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="relative mt-4 group">
                            <input
                                type="text"
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                                placeholder="Cari kompor induksi, air purifier, slow juicer..."
                                className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-24 sm:pr-32 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder-neutral-400 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                            />
                            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                            
                            {localQuery && (
                                <button
                                    type="button"
                                    onClick={() => setLocalQuery("")}
                                    className="absolute right-20 sm:right-28 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Recommendation Tags */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] sm:text-xs">
                            <span className="text-neutral-400 font-medium">Rekomendasi:</span>
                            {["Air Purifier", "Slow Juicer", "Kompor Induksi", "Bestseller"].map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-blue-50 hover:text-blue-600 font-medium text-neutral-600 transition-all active:scale-95"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tabs & Counter Bar ── */}
                {totalResults > 0 && !loading && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 mb-8 sm:mb-12">
                        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar pb-2 sm:pb-0">
                            {[
                                { id: "all", label: "Semua Hasil", count: totalResults },
                                { id: "products", label: "Produk", count: products.length },
                                { id: "news", label: "Artikel & Berita", count: news.length }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "bg-neutral-900 text-white shadow-md shadow-neutral-200"
                                            : "bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                                        activeTab === tab.id ? "bg-white text-neutral-950" : "bg-neutral-100 text-neutral-500"
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-neutral-500 font-medium shrink-0">
                            Menampilkan <span className="font-extrabold text-neutral-900">{totalResults}</span> hasil untuk Anda
                        </p>
                    </div>
                )}

                {/* ── Main Content Area ── */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-xs uppercase tracking-widest font-extrabold text-neutral-400">Sedang Mencari Koleksi Terbaik...</p>
                    </div>
                ) : totalResults === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm max-w-4xl mx-auto px-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-3">
                            Hasil Tidak Ditemukan
                        </h2>
                        <p className="text-neutral-500 text-sm font-medium mb-8 max-w-md mx-auto leading-relaxed">
                            Kami tidak dapat menemukan produk atau artikel yang cocok dengan "{query}". Silakan cek ejaan kata kunci Anda atau gunakan kata kunci lain yang lebih umum.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/product"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-xs tracking-wider uppercase font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
                            >
                                <Package className="w-4 h-4" />
                                Jelajahi Produk
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 text-neutral-700 text-xs tracking-wider uppercase font-bold rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16 sm:space-y-24">
                        {/* ── Products Section ── */}
                        {(activeTab === "all" || activeTab === "products") && products.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6 sm:mb-8 border-l-4 border-blue-600 pl-4">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">Koleksi Produk</h2>
                                        <p className="text-xs text-neutral-400 font-medium">Temukan peralatan rumah tangga berkualitas tinggi</p>
                                    </div>
                                    <Link href="/product" className="text-xs uppercase tracking-wider font-extrabold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 group shrink-0">
                                        Lihat Semua
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            className="group relative bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-neutral-100/50 transition-all duration-300 flex flex-col h-full"
                                        >
                                            <div className="relative overflow-hidden bg-slate-50 flex items-center justify-center p-6 aspect-square rounded-t-3xl">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                                
                                                {/* Float Badge tags */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                                                    {product.badge && (
                                                        <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-100 text-[8px] font-extrabold tracking-wider uppercase text-blue-600" >
                                                            {product.badge}
                                                        </span>
                                                    )}
                                                    {product.discount > 0 && (
                                                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-extrabold rounded-lg shadow-sm tracking-wider uppercase">
                                                            -{product.discount}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <div className="p-4 sm:p-5 flex flex-col flex-1">
                                                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2 leading-snug" >
                                                    {product.name}
                                                </h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-auto pt-3 border-t border-neutral-50">
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <span className="text-xs sm:text-sm font-extrabold text-neutral-950" >{formatPrice(product.price)}</span>
                                                        {product.originalPrice > product.price && (
                                                            <span className="text-[10px] sm:text-xs text-neutral-400 line-through" >{formatPrice(product.originalPrice)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── News Section ── */}
                        {(activeTab === "all" || activeTab === "news") && news.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6 sm:mb-8 border-l-4 border-blue-600 pl-4">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">Inspirasi & Artikel</h2>
                                        <p className="text-xs text-neutral-400 font-medium">Tips, trik, dan berita menarik seputar rumah modern</p>
                                    </div>
                                    <Link href="/news" className="text-xs uppercase tracking-wider font-extrabold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 group shrink-0">
                                        Lihat Semua
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                    {news.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/news/${item.id}`}
                                            className="group bg-white border border-neutral-100 rounded-3xl overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-neutral-100/50 transition-all duration-300 flex flex-col h-full"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm text-[9px] font-extrabold tracking-wider uppercase text-blue-600 border border-neutral-100">
                                                    {item.category}
                                                </span>
                                            </div>
                                            
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3">
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <Calendar className="w-3.5 h-3.5 text-neutral-300" />
                                                        {item.date}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <Clock className="w-3.5 h-3.5 text-neutral-300" />
                                                        {item.readTime}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug" >
                                                    {item.title}
                                                </h3>
                                                
                                                <p className="text-xs sm:text-sm text-neutral-500 font-normal line-clamp-2 leading-relaxed mb-5">
                                                    {item.excerpt}
                                                </p>
                                                
                                                <div className="mt-auto pt-4 border-t border-neutral-50 flex items-center gap-1.5 text-xs tracking-wider uppercase font-extrabold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                                    Baca Selengkapnya
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
