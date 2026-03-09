"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    Eye,
    ArrowLeft,
    ArrowRight,
    Share2,
    BookmarkPlus,
    User,
    Tag,
} from "lucide-react";
import Header from "../../../HomePage/components/Header";
import Footer from "../../../HomePage/components/Footer";
import api from "@/lib/axios";
import { type PublicArticle } from "../page";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<PublicArticle | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArticleData = async () => {
        try {
            const res = await api.get(`/news/${id}`);
            if (res.data.status === 'success') {
                const item = res.data.data;
                setArticle({
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
                    content: item.content ? item.content.split('\n\n') : [""],
                });

                // Fetch all to get related
                const allRes = await api.get('/news?limit=100&status=published');
                if (allRes.data.status === 'success') {
                    const mapped = allRes.data.data.data.map((allItem: any) => ({
                        id: allItem.id,
                        title: allItem.title,
                        slug: allItem.slug,
                        excerpt: allItem.excerpt || (allItem.content ? allItem.content.substring(0, 100) + '...' : ''),
                        image: allItem.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
                        category: allItem.category,
                        date: allItem.published_at ? new Date(allItem.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : '-',
                        readTime: allItem.read_time || "5 min",
                        views: allItem.views?.toString() || "0",
                        isFeatured: allItem.is_featured ? true : false,
                        author: allItem.author || "Admin",
                        content: [allItem.content],
                    }));

                    const catRelated = mapped.filter((a: any) => a.category === item.category && a.id !== item.id).slice(0, 3);
                    const suggestions = catRelated.length >= 3 ? catRelated : [
                        ...catRelated,
                        ...mapped.filter((a: any) => a.id !== item.id && !catRelated.some((r: any) => r.id === a.id)).slice(0, 3 - catRelated.length)
                    ];
                    setRelatedArticles(suggestions);
                }
            }
        } catch (error) {
            console.error("Failed to fetch article", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticleData();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    }

    /* ─── 404 state ─── */
    if (!article) {
        return (
            <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
                <Header />
                <div className="flex flex-col items-center justify-center py-32 px-6">
                    <h1
                        className="text-5xl sm:text-6xl font-light text-neutral-900 mb-4"
                        style={{ fontFamily: CORMORANT }}
                    >
                        Artikel Tidak Ditemukan
                    </h1>
                    <div className="w-10 h-[1px] bg-neutral-300 mb-6" />
                    <p
                        className="text-neutral-500 text-sm font-light mb-10 text-center max-w-md"
                        style={{ fontFamily: JOST }}
                    >
                        Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                        style={{ fontFamily: JOST }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali ke Artikel
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
            <Header />

            {/* ── HERO ── */}
            <section className="relative h-[340px] sm:h-[440px] md:h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

                <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-10 sm:pb-14 max-w-[1000px]">
                    {/* Category */}
                    <span
                        className="inline-block self-start px-3 py-1 bg-white text-neutral-900 text-[10px] tracking-[0.15em] uppercase font-medium mb-5"
                        style={{ fontFamily: JOST }}
                    >
                        {article.category}
                    </span>

                    {/* Title */}
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-5 leading-[1.1]"
                        style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
                    >
                        {article.title}
                    </h1>

                    {/* Meta */}
                    <div
                        className="flex flex-wrap items-center gap-4 sm:gap-5 text-white/60 text-[11px] tracking-wide"
                        style={{ fontFamily: JOST }}
                    >
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{article.author}</span>
                        </div>
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
                            <span>{article.views} views</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16">
                <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
                    {/* Article Body */}
                    <article>
                        {/* Back link */}
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-neutral-400 text-[11px] tracking-[0.15em] uppercase font-medium hover:text-neutral-900 transition-colors mb-8 group"
                            style={{ fontFamily: JOST }}
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Artikel
                        </Link>

                        {/* Excerpt / Lead */}
                        <p
                            className="text-neutral-600 text-base sm:text-lg font-light leading-relaxed mb-8 border-l-2 border-neutral-200 pl-5"
                            style={{ fontFamily: JOST }}
                        >
                            {article.excerpt}
                        </p>

                        <div className="w-full h-[1px] bg-neutral-100 mb-8" />

                        {/* Paragraphs */}
                        <div className="space-y-5">
                            {article.content.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-neutral-600 text-[15px] font-light leading-[1.85]"
                                    style={{ fontFamily: JOST }}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Tags & Share */}
                        <div className="mt-12 pt-8 border-t border-neutral-100">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-neutral-400" />
                                    <span
                                        className="px-3 py-1 border border-neutral-200 text-neutral-600 text-[10px] tracking-[0.12em] uppercase font-medium"
                                        style={{ fontFamily: JOST }}
                                    >
                                        {article.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-9 h-9 border border-neutral-200 flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-all">
                                        <BookmarkPlus className="w-4 h-4 text-neutral-500" />
                                    </button>
                                    <button className="w-9 h-9 border border-neutral-200 flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-all">
                                        <Share2 className="w-4 h-4 text-neutral-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Author card */}
                        <div className="mt-8 p-6 bg-neutral-50 border border-neutral-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                    <p
                                        className="text-neutral-900 text-sm font-medium"
                                        style={{ fontFamily: JOST }}
                                    >
                                        {article.author}
                                    </p>
                                    <p
                                        className="text-neutral-400 text-[11px] tracking-wide font-light"
                                        style={{ fontFamily: JOST }}
                                    >
                                        Penulis
                                    </p>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8">
                            {/* Info Box */}
                            <div className="p-5 border border-neutral-100 mb-6">
                                <h4
                                    className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-4"
                                    style={{ fontFamily: JOST }}
                                >
                                    Info Artikel
                                </h4>
                                <div className="space-y-3">
                                    {[
                                        {
                                            icon: Calendar,
                                            label: "Tanggal",
                                            value: article.date,
                                        },
                                        {
                                            icon: Clock,
                                            label: "Waktu Baca",
                                            value: article.readTime,
                                        },
                                        {
                                            icon: Eye,
                                            label: "Dilihat",
                                            value: `${article.views}×`,
                                        },
                                        {
                                            icon: User,
                                            label: "Penulis",
                                            value: article.author,
                                        },
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0"
                                            >
                                                <div className="flex items-center gap-2 text-neutral-400">
                                                    <Icon className="w-3.5 h-3.5" />
                                                    <span
                                                        className="text-[11px] font-light tracking-wide"
                                                        style={{ fontFamily: JOST }}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <span
                                                    className="text-neutral-700 text-[12px] font-medium"
                                                    style={{ fontFamily: JOST }}
                                                >
                                                    {item.value}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/news"
                                className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-200 text-neutral-700 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-neutral-800 hover:text-neutral-900 hover:bg-neutral-50 transition-all group"
                                style={{ fontFamily: JOST }}
                            >
                                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                Semua Artikel
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ── RELATED ARTICLES ── */}
            {relatedArticles.length > 0 && (
                <section className="bg-neutral-50 py-14 sm:py-20">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
                        <div className="inline-flex items-center gap-2.5 mb-8">
                            <div className="w-4 h-[1px] bg-neutral-400" />
                            <span
                                className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.22em]"
                                style={{ fontFamily: JOST }}
                            >
                                Artikel Terkait
                            </span>
                            <div className="w-4 h-[1px] bg-neutral-400" />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {relatedArticles.map((related: PublicArticle) => (
                                <Link
                                    key={related.id}
                                    href={`/news/${related.id}`}
                                    className="group bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 sm:h-52 overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url(${related.image})`,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                        <div className="absolute top-3.5 left-3.5">
                                            <span
                                                className="px-2.5 py-1 bg-white text-neutral-900 text-[10px] tracking-[0.12em] uppercase font-medium border border-neutral-100"
                                                style={{ fontFamily: JOST }}
                                            >
                                                {related.category}
                                            </span>
                                        </div>

                                        <div
                                            className="absolute bottom-3.5 left-3.5 flex items-center gap-3 text-white/70 text-[11px]"
                                            style={{ fontFamily: JOST }}
                                        >
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{related.readTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{related.views}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div
                                            className="flex items-center gap-2 text-[11px] text-neutral-400 mb-3 tracking-wide"
                                            style={{ fontFamily: JOST }}
                                        >
                                            <Calendar className="w-3 h-3" />
                                            <span>{related.date}</span>
                                            <span className="text-neutral-200">•</span>
                                            <span>{related.author}</span>
                                        </div>
                                        <h3
                                            className="text-lg sm:text-xl font-light text-neutral-900 mb-3 line-clamp-2 group-hover:text-neutral-600 transition-colors leading-snug"
                                            style={{ fontFamily: CORMORANT }}
                                        >
                                            {related.title}
                                        </h3>
                                        <p
                                            className="text-neutral-500 text-sm font-light mb-5 line-clamp-2 leading-relaxed"
                                            style={{ fontFamily: JOST }}
                                        >
                                            {related.excerpt}
                                        </p>
                                        <div
                                            className="flex items-center gap-2 text-neutral-700 text-[11px] tracking-[0.18em] uppercase font-medium group-hover:text-neutral-900 transition-colors"
                                            style={{ fontFamily: JOST }}
                                        >
                                            <span>Baca Artikel</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <Footer />
        </div>
    );
}
