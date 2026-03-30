"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Flame, Tag } from "lucide-react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function SalePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState<number | null>(null);

    const formatPrice = (p: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const res = await api.get("/products", { params: { on_sale: true, limit: 50 } });
                if (res.data.status === "success") {
                    const allProducts = res.data.data.data || res.data.data;
                    const saleProducts = allProducts
                        .filter((p: any) => p.discount > 0 || (p.sale_price && p.sale_price < p.price))
                        .map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            price: p.sale_price && p.sale_price > 0 ? p.sale_price : p.price,
                            originalPrice: p.price,
                            discount: p.discount || (p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : 0),
                            image: p.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001",
                            badge: p.badge || "",
                            category: p.category || "",
                            stock: p.stock,
                        }));
                    setProducts(saleProducts);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSaleProducts();
    }, []);

    const handleAddToCart = (product: any) => {
        const stored = localStorage.getItem("ravelle_cart");
        let cart: any[] = stored ? JSON.parse(stored) : [];
        const exists = cart.find((item: any) => item.id === product.id);
        if (exists) {
            cart = cart.map((item: any) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        } else {
            cart = [...cart, { ...product, quantity: 1, selected: true }];
        }
        localStorage.setItem("ravelle_cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("ravelle_cart_updated"));
        setAddedToCart(product.id);
        setTimeout(() => setAddedToCart(null), 2000);
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
            <Header />

            {/* Hero Banner */}
            <section className="relative bg-stone-900 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-900/20 to-stone-900 pointer-events-none" />
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-800/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-rose-400" />
                        <span className="text-rose-400 text-[11px] font-bold uppercase tracking-[0.3em]">Penawaran Terbatas</span>
                        <Flame className="w-5 h-5 text-rose-400" />
                    </div>
                    <h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-4"
                        style={{ fontFamily: CORMORANT }}
                    >
                        SALE
                    </h1>
                    <div className="w-16 h-[1px] bg-rose-500 mx-auto mb-5" />
                    <p className="text-stone-400 text-sm font-light max-w-md mx-auto">
                        Produk pilihan dengan diskon eksklusif. Persediaan terbatas, segera dapatkan sebelum kehabisan!
                    </p>
                    {products.length > 0 && (
                        <p className="text-rose-400 text-sm font-bold mt-4">
                            {products.length} produk tersedia
                        </p>
                    )}
                </div>
            </section>

            {/* Products Grid */}
            <section className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-14">
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-[3/4] bg-stone-100 mb-3" />
                                <div className="h-4 bg-stone-100 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-stone-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32">
                        <Tag className="w-16 h-16 text-stone-200 mx-auto mb-6" />
                        <h2 className="text-3xl font-light text-stone-300 mb-2" style={{ fontFamily: CORMORANT }}>
                            Belum Ada Produk Sale
                        </h2>
                        <p className="text-stone-400 text-sm mb-8">Nantikan promo menarik dari kami!</p>
                        <Link
                            href="/product"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors"
                        >
                            Lihat Semua Produk
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white border border-neutral-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                {/* Image */}
                                <Link href={`/product/${product.id}`} className="block">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Discount badge */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                            <span className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
                                                -{product.discount}%
                                            </span>
                                            {product.badge && (
                                                <span className="px-2.5 py-1 bg-white text-stone-900 text-[10px] font-medium tracking-[0.12em] uppercase border border-neutral-200">
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-4 sm:p-5">
                                    <Link href={`/product/${product.id}`}>
                                        <h3
                                            className="text-lg font-light text-neutral-900 mb-2 line-clamp-2 group-hover:text-stone-600 transition-colors leading-snug"
                                            style={{ fontFamily: CORMORANT }}
                                        >
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-base font-bold text-rose-600" style={{ fontFamily: JOST }}>
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-sm text-neutral-400 line-through" style={{ fontFamily: JOST }}>
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-green-600 font-medium mb-3">
                                        Hemat {formatPrice(product.originalPrice - product.price)}
                                    </p>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 ${addedToCart === product.id
                                            ? "bg-green-600 text-white"
                                            : "bg-stone-900 hover:bg-black text-white"
                                            }`}
                                    >
                                        {addedToCart === product.id ? (
                                            <><Check className="w-3.5 h-3.5" /> Ditambahkan!</>
                                        ) : (
                                            <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
