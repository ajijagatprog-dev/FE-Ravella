"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, Calendar, Clock, Eye, ShoppingCart, ArrowRight, ChevronRight, X } from "lucide-react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

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
                    setProducts(productRes.data.data.data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        price: item.sale_price > 0 ? item.sale_price : item.price,
                        originalPrice: item.price,
                        image: item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
                        discount: item.discount,
                        badge: item.badge
                    })));
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

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
            <Header />

            <main className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-neutral-900">Search Results</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-light text-neutral-900 mb-6" style={{ fontFamily: CORMORANT }}>
                        Search results for: <span className="italic font-normal">"{query}"</span>
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-neutral-100 pb-8">
                        <div className="flex gap-8">
                            {[
                                { id: "all", label: "All Results", count: totalResults },
                                { id: "products", label: "Products", count: products.length },
                                { id: "news", label: "News", count: news.length }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative py-2 text-[12px] tracking-[0.15em] uppercase font-medium transition-colors ${activeTab === tab.id ? "text-black" : "text-neutral-400 hover:text-neutral-600"
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                    {activeTab === tab.id && (
                                        <div className="absolute -bottom-[1px] left-0 w-full h-[1px] bg-black" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <p className="text-[13px] text-neutral-500 font-light">
                            Showing <span className="font-medium text-neutral-900">{totalResults}</span> total results
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mb-4"></div>
                        <p className="text-[12px] uppercase tracking-widest font-medium">Searching...</p>
                    </div>
                ) : totalResults === 0 ? (
                    <div className="py-24 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-6 h-6 text-neutral-300" />
                        </div>
                        <h2 className="text-3xl font-light text-neutral-900 mb-3" style={{ fontFamily: CORMORANT }}>
                            No results found
                        </h2>
                        <p className="text-neutral-500 text-sm font-light mb-10 max-w-md mx-auto">
                            Sorry, we couldn't find any products or news matching "{query}".
                            Please double check your spelling or try more general keywords.
                        </p>
                        <Link
                            href="/product"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Products Section */}
                        {(activeTab === "all" || activeTab === "products") && products.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-[1px] bg-neutral-300"></div>
                                        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-900">Products</h2>
                                    </div>
                                    <Link href="/product" className="text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-400 hover:text-black transition-colors flex items-center gap-2 group">
                                        View All
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                    {products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.id}`}
                                            className="group flex flex-col"
                                        >
                                            <div className="relative aspect-square bg-neutral-50 overflow-hidden mb-5">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-6"
                                                />
                                                {product.badge && (
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white shadow-sm border border-neutral-100 text-[10px] font-bold tracking-[0.1em] uppercase">
                                                        {product.badge}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <h3 className="text-lg font-light text-neutral-900 mb-2 group-hover:text-neutral-500 transition-colors line-clamp-1" style={{ fontFamily: CORMORANT }}>
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-neutral-900">{formatPrice(product.price)}</span>
                                                {product.originalPrice > product.price && (
                                                    <span className="text-xs text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* News Section */}
                        {(activeTab === "all" || activeTab === "news") && news.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-[1px] bg-neutral-300"></div>
                                        <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-neutral-900">Articles & News</h2>
                                    </div>
                                    <Link href="/news" className="text-[11px] uppercase tracking-[0.15em] font-medium text-neutral-400 hover:text-black transition-colors flex items-center gap-2 group">
                                        View All
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {news.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/news/${item.id}`}
                                            className="group flex flex-col"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden mb-5">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white border border-neutral-100 text-[10px] font-medium tracking-[0.1em] uppercase">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.date}
                                                </span>
                                                <span>•</span>
                                                <span>{item.readTime}</span>
                                            </div>
                                            <h3 className="text-xl font-light text-neutral-900 mb-3 group-hover:text-neutral-500 transition-colors line-clamp-2 leading-tight" style={{ fontFamily: CORMORANT }}>
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-neutral-500 font-light line-clamp-2 leading-relaxed mb-4">
                                                {item.excerpt}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold text-neutral-900 group-hover:gap-3 transition-all">
                                                Read Article
                                                <ArrowRight className="w-3.5 h-3.5" />
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
