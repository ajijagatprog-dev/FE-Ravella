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
    ChevronLeft,
    Share,
    Facebook,
    Twitter,
    Instagram,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
            setLoading(true);
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

                // Fetch related
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
        // Track view
        api.post(`/news/${id}/view`).then(res => {
            if (res.data.status === 'success') {
                setArticle(prev => prev ? { ...prev, views: res.data.views.toString() } : prev);
            }
        }).catch(() => {});
    }, [id]);

    if (loading) {
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
                <Header />
                <div className="flex flex-col items-center justify-center py-40 px-6">
                    <h1 className="text-6xl font-light text-neutral-900 mb-6" style={{ fontFamily: CORMORANT }}>Story Not Found</h1>
                    <p className="text-neutral-500 text-sm font-light mb-12 text-center max-w-md">
                        Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Journal
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
            <section className="relative h-[450px] sm:h-[550px] md:h-[650px] overflow-hidden bg-neutral-900">
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                   <img
                       src={article.image}
                       alt={article.title}
                       className="w-full h-full object-cover"
                   />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 lg:px-24 xl:px-40 pb-16 sm:pb-24">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="max-w-4xl"
                    >
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] tracking-[0.3em] font-black uppercase mb-8 border border-white/20">
                            {article.category}
                        </span>
                        
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-10 leading-[0.95]" style={{ fontFamily: CORMORANT }}>
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-white/60 text-[10px] tracking-[0.3em] uppercase font-black">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                   <User className="w-3.5 h-3.5" />
                                </div>
                                <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Calendar className="w-4 h-4" />
                                <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime} Read</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Eye className="w-4 h-4 text-amber-500" />
                                <span className="text-amber-500">{article.views} Views</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-20 sm:py-28"
            >
                <div className="grid lg:grid-cols-[1fr_320px] gap-20 xl:gap-32">
                    {/* Article Body */}
                    <article className="max-w-4xl">
                        {/* Navigation Bar */}
                        <div className="flex items-center justify-between mb-16 pb-8 border-b border-neutral-100">
                           <Link
                                href="/news"
                                className="inline-flex items-center gap-2.5 text-neutral-400 text-[10px] tracking-[0.2em] uppercase font-black hover:text-neutral-900 transition-all group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Back to All Stories
                            </Link>
                            
                            <div className="flex items-center gap-6">
                               <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><Facebook className="w-4 h-4" /></button>
                               <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><Twitter className="w-4 h-4" /></button>
                               <button className="text-neutral-400 hover:text-neutral-900 transition-colors"><Instagram className="w-4 h-4" /></button>
                               <button className="text-neutral-400 hover:text-neutral-900 transition-colors ml-2"><Share className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="mb-16 relative">
                           <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-neutral-200" />
                           <p className="text-neutral-900 text-2xl sm:text-3xl font-light italic leading-relaxed pl-10" style={{ fontFamily: CORMORANT }}>
                               "{article.excerpt}"
                           </p>
                        </div>

                        {/* Main Body */}
                        <div className="space-y-10">
                            {article.content.map((paragraph, index) => {
                                const trimmed = paragraph.trim();
                                if (!trimmed) return null;

                                // Numbered heading
                                const numberedHeading = trimmed.match(/^(\d+)\.\s+(.+)/);
                                if (numberedHeading) {
                                    return (
                                        <div key={index} className="pt-12 pb-4">
                                            <div className="flex items-center gap-5 mb-6">
                                                <span className="text-5xl font-light text-neutral-200" style={{ fontFamily: CORMORANT }}>{numberedHeading[1].padStart(2, '0')}</span>
                                                <h2 className="text-3xl sm:text-4xl font-medium text-neutral-900 leading-tight" style={{ fontFamily: CORMORANT }}>
                                                    {numberedHeading[2]}
                                                </h2>
                                            </div>
                                            <div className="w-20 h-[1px] bg-neutral-900" />
                                        </div>
                                    );
                                }

                                // List items
                                const lines = trimmed.split('\n');
                                const isList = lines.every(l => /^[\-•✓⭐✅]\s/.test(l.trim()) || l.trim() === '');
                                if (isList && lines.filter(l => l.trim()).length > 0) {
                                    return (
                                        <ul key={index} className="space-y-4 py-4">
                                            {lines.filter(l => l.trim()).map((line, li) => {
                                                const cleaned = line.trim().replace(/^[\-•✓⭐✅]\s*/, '');
                                                return (
                                                    <li key={li} className="flex items-start gap-4 text-neutral-600 text-lg font-light leading-relaxed">
                                                        <div className="mt-2.5 w-1.5 h-1.5 bg-neutral-900 rounded-full flex-shrink-0" />
                                                        <span dangerouslySetInnerHTML={{ __html: cleaned.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-neutral-900">$1</strong>') }} />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                }

                                // Paragraph
                                const htmlContent = trimmed
                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-neutral-900">$1</strong>')
                                    .replace(/\n/g, '<br/>');

                                return (
                                    <p
                                        key={index}
                                        className="text-neutral-600 text-lg font-light leading-[1.8] first-letter:text-6xl first-letter:font-light first-letter:text-neutral-900 first-letter:float-left first-letter:mr-4 first-letter:mt-2"
                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                    />
                                );
                            })}
                        </div>

                        {/* Footer Meta */}
                        <div className="mt-24 pt-12 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                               <Tag className="w-4 h-4 text-neutral-400" />
                               <span className="px-4 py-2 bg-neutral-50 text-neutral-900 text-[10px] font-black uppercase tracking-widest border border-neutral-100">
                                  {article.category}
                               </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-3 border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all"><BookmarkPlus className="w-5 h-5" /></button>
                                <button className="p-3 border border-neutral-100 hover:bg-neutral-900 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-12">
                            {/* Author */}
                            <div className="p-10 border border-neutral-100 bg-neutral-50">
                                <div className="flex flex-col items-center text-center">
                                   <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-6">
                                      <User className="w-10 h-10 text-neutral-400" />
                                   </div>
                                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">Written By</p>
                                   <h4 className="text-xl font-medium text-neutral-900 mb-4" style={{ fontFamily: CORMORANT }}>{article.author}</h4>
                                   <p className="text-xs text-neutral-500 font-light leading-relaxed">
                                      Expert contributor focusing on kitchen innovation and lifestyle trends.
                                   </p>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-6">
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 border-b border-neutral-100 pb-4">Article Details</p>
                               {[
                                 { icon: Calendar, label: "Published", value: article.date },
                                 { icon: Clock, label: "Reading Time", value: article.readTime },
                                 { icon: Eye, label: "Audience", value: `${article.views} Views` }
                               ].map((item, i) => (
                                 <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-neutral-400">
                                       <item.icon className="w-4 h-4" />
                                       <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <span className="text-sm text-neutral-900 font-medium">{item.value}</span>
                                 </div>
                               ))}
                            </div>
                            
                            {/* CTA */}
                            <Link
                                href="/news"
                                className="flex items-center justify-center gap-4 w-full py-5 bg-neutral-900 text-white text-[11px] font-black tracking-[0.3em] uppercase hover:bg-black transition-all shadow-2xl shadow-neutral-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                All Stories
                            </Link>
                        </div>
                    </aside>
                </div>
            </motion.div>

            {/* ── RELATED ARTICLES ── */}
            {relatedArticles.length > 0 && (
                <section className="bg-neutral-50 py-24 sm:py-32 border-t border-neutral-100">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
                        <div className="flex items-center justify-between mb-16">
                           <h2 className="text-4xl font-light text-neutral-900" style={{ fontFamily: CORMORANT }}>You Might <span className="italic font-medium">Also Enjoy</span></h2>
                           <Link href="/news" className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900 transition-colors">View All Stories</Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {relatedArticles.map((related: PublicArticle) => (
                                <Link
                                    key={related.id}
                                    href={`/news/${related.id}`}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-white mb-6">
                                        <img
                                            src={related.image}
                                            alt={related.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white text-neutral-900 text-[9px] font-black tracking-[0.2em] uppercase border border-neutral-100">
                                                {related.category}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-medium text-neutral-900 mb-4 line-clamp-2 group-hover:text-neutral-600 transition-colors leading-snug" style={{ fontFamily: CORMORANT }}>
                                        {related.title}
                                    </h3>
                                    
                                    <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 group-hover:text-neutral-900 transition-colors">
                                        Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </span>
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
