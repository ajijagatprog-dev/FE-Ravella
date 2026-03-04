"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Star,
    ArrowLeft,
    ArrowRight,
    ShoppingCart,
    Heart,
    Check,
    Shield,
    Zap,
    Award,
    TrendingUp,
    Share2,
    Package,
} from "lucide-react";
import Header from "../../../HomePage/components/Header";
import Footer from "../../../HomePage/components/Footer";
import { products, type Product } from "../products";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const productId = id; // use string id or slug
    const [product, setProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/products/${productId}`);
                if (res.data.status === 'success') {
                    const item = res.data.data;
                    setProduct({
                        id: item.id,
                        name: item.name,
                        description: item.description || "Deskripsi produk",
                        price: item.price,
                        originalPrice: item.price + (item.price * 0.2), // Mock 20% discount if empty
                        discount: 20,
                        rating: 5.0, // Mock
                        reviews: 128, // Mock
                        category: item.category || "appliance",
                        image: item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001",
                        features: ["Premium Quality"],
                        specifications: { "Berat": `${item.weight || 1000}g`, "SKU": item.slug },
                        inStock: item.stock > 0,
                        isNew: true,
                        badge: item.is_featured ? "Best Seller" : "",
                    });

                    // Fetch related products (mock category matching by just fetching all limit 4)
                    const relRes = await api.get('/products', { params: { limit: 4, category: item.category || undefined } });
                    if (relRes.data.status === 'success') {
                        const relMapped = relRes.data.data.data.map((r: any) => ({
                            id: r.id, name: r.name, price: r.price, image: r.image || "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
                            rating: 4.9, reviews: 89, originalPrice: r.price + (r.price * 0.2), discount: 20, badge: 'Hot', isNew: true
                        }));
                        setRelatedProducts(relMapped);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetail();
    }, [productId]);

    const [isFavorite, setIsFavorite] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; productName: string }>(
        { visible: false, productName: "" }
    );

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    const handleAddToCart = (p: Product) => {
        const stored = localStorage.getItem("ravelle_cart");
        let cart: any[] = stored ? JSON.parse(stored) : [];
        const exists = cart.find((item) => item.id === p.id);
        if (exists) {
            cart = cart.map((item) =>
                item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            cart = [
                ...cart,
                {
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    originalPrice: p.originalPrice,
                    image: p.image,
                    badge: p.badge,
                    discount: p.discount,
                    category: p.category,
                    quantity: 1,
                    selected: true,
                },
            ];
        }
        localStorage.setItem("ravelle_cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("ravelle_cart_updated"));
        setToast({ visible: true, productName: p.name });
        setTimeout(() => setToast({ visible: false, productName: "" }), 2500);
    };

    const badgeStyle: Record<string, string> = {
        "Best Seller": "bg-neutral-900 text-white",
        Premium: "bg-neutral-700 text-white",
        Popular: "bg-neutral-100 text-neutral-700 border border-neutral-200",
        New: "bg-white text-neutral-900 border border-neutral-200",
    };

    /* Loading state */
    if (isLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div></div>;
    }

    /* 404 */
    if (!product) {
        return (
            <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
                <Header />
                <div className="flex flex-col items-center justify-center py-32 px-6">
                    <Package className="w-12 h-12 text-neutral-300 mb-6" />
                    <h1
                        className="text-5xl sm:text-6xl font-light text-neutral-900 mb-4"
                        style={{ fontFamily: CORMORANT }}
                    >
                        Produk Tidak Ditemukan
                    </h1>
                    <div className="w-10 h-[1px] bg-neutral-300 mb-6" />
                    <p
                        className="text-neutral-500 text-sm font-light mb-10 text-center max-w-md"
                        style={{ fontFamily: JOST }}
                    >
                        Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                    <Link
                        href="/product"
                        className="inline-flex items-center gap-2 px-8 py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                        style={{ fontFamily: JOST }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Kembali ke Produk
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
            <Header />

            {/* Toast */}
            <div
                className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${toast.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div
                    className="flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-4 min-w-[280px] max-w-sm"
                    style={{ fontFamily: JOST }}
                >
                    <ShoppingCart className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 text-sm">
                            Ditambahkan ke Keranjang
                        </p>
                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                            {toast.productName}
                        </p>
                    </div>
                    <Check className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                </div>
            </div>

            {/* ── BREADCRUMB ── */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 pt-6">
                <Link
                    href="/product"
                    className="inline-flex items-center gap-2 text-neutral-400 text-[11px] tracking-[0.15em] uppercase font-medium hover:text-neutral-900 transition-colors group"
                    style={{ fontFamily: JOST }}
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Produk
                </Link>
            </div>

            {/* ── PRODUCT DETAIL ── */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
                    {/* Image */}
                    <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                            {product.isNew && (
                                <span
                                    className="px-2.5 py-1 bg-white text-neutral-900 text-[10px] tracking-[0.12em] uppercase font-medium border border-neutral-200"
                                    style={{ fontFamily: JOST }}
                                >
                                    New
                                </span>
                            )}
                            {product.discount > 0 && (
                                <span
                                    className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] tracking-[0.12em] uppercase font-medium"
                                    style={{ fontFamily: JOST }}
                                >
                                    -{product.discount}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        {/* Badge */}
                        <span
                            className={`inline-block self-start px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-medium mb-4 ${badgeStyle[product.badge] || badgeStyle["Popular"]
                                }`}
                            style={{ fontFamily: JOST }}
                        >
                            {product.badge}
                        </span>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-neutral-200"
                                        }`}
                                />
                            ))}
                            <span
                                className="text-xs text-neutral-500 ml-1"
                                style={{ fontFamily: JOST }}
                            >
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        {/* Name */}
                        <h1
                            className="text-3xl sm:text-4xl font-light text-neutral-900 mb-3 leading-tight"
                            style={{ fontFamily: CORMORANT }}
                        >
                            {product.name}
                        </h1>

                        <div className="w-8 h-[1px] bg-neutral-200 mb-5" />

                        {/* Description */}
                        <p
                            className="text-neutral-500 text-sm font-light leading-relaxed mb-6"
                            style={{ fontFamily: JOST }}
                        >
                            {product.description}
                        </p>

                        {/* Price */}
                        <div className="border border-neutral-100 bg-neutral-50 p-5 mb-6">
                            <div className="flex items-baseline gap-3">
                                <span
                                    className="text-2xl sm:text-3xl font-medium text-neutral-900"
                                    style={{ fontFamily: JOST }}
                                >
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice > product.price && (
                                    <span
                                        className="text-sm text-neutral-400 line-through"
                                        style={{ fontFamily: JOST }}
                                    >
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                            {product.originalPrice > product.price && (
                                <p
                                    className="text-[11px] text-neutral-500 mt-1.5 tracking-wide"
                                    style={{ fontFamily: JOST }}
                                >
                                    Hemat {formatPrice(product.originalPrice - product.price)}
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <div className="mb-5">
                            <p
                                className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-3"
                                style={{ fontFamily: JOST }}
                            >
                                Fitur Utama
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.features?.map((f: string, i: number) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 text-[11px] tracking-[0.1em] uppercase font-medium"
                                        style={{ fontFamily: JOST }}
                                    >
                                        <Check className="w-3 h-3" />
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="mb-6">
                            <p
                                className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-3"
                                style={{ fontFamily: JOST }}
                            >
                                Spesifikasi
                            </p>
                            <div className="space-y-1.5">
                                {Object.entries(product.specifications || {}).map(([k, v]) => (
                                    <div
                                        key={k}
                                        className="flex justify-between py-2 border-b border-neutral-100 text-sm"
                                        style={{ fontFamily: JOST }}
                                    >
                                        <span className="text-neutral-400 font-light">{k}</span>
                                        <span className="text-neutral-800 font-medium">{v as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-12 h-12 flex items-center justify-center border transition-all ${isFavorite
                                    ? "bg-neutral-900 border-neutral-900 text-white"
                                    : "border-neutral-200 text-neutral-500 hover:border-neutral-800"
                                    }`}
                            >
                                <Heart
                                    className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                                />
                            </button>
                            <button
                                onClick={() => navigator.share?.({ title: product.name, url: window.location.href }).catch(() => { })}
                                className="w-12 h-12 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:border-neutral-800 transition-all"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 py-3 bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                                style={{ fontFamily: JOST }}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>

                        {/* Stock */}
                        <div className="mt-3 flex items-center gap-2">
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"
                                    }`}
                            />
                            <span
                                className="text-[11px] text-neutral-400 tracking-wide"
                                style={{ fontFamily: JOST }}
                            >
                                {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RELATED PRODUCTS ── */}
            {relatedProducts.length > 0 && (
                <section className="bg-neutral-50 py-14 sm:py-20">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
                        <div className="inline-flex items-center gap-2.5 mb-8">
                            <div className="w-4 h-[1px] bg-neutral-400" />
                            <span
                                className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.22em]"
                                style={{ fontFamily: JOST }}
                            >
                                Produk Terkait
                            </span>
                            <div className="w-4 h-[1px] bg-neutral-400" />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                            {relatedProducts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/product/${related.id}`}
                                    className="group bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden block"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                                        <img
                                            src={related.image}
                                            alt={related.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                            {related.isNew && (
                                                <span
                                                    className="px-2.5 py-1 bg-white text-neutral-900 text-[10px] font-medium tracking-[0.12em] uppercase border border-neutral-200"
                                                    style={{ fontFamily: JOST }}
                                                >
                                                    New
                                                </span>
                                            )}
                                            {related.discount > 0 && (
                                                <span
                                                    className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-medium tracking-[0.12em] uppercase"
                                                    style={{ fontFamily: JOST }}
                                                >
                                                    -{related.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            <span
                                                className="text-xs font-medium text-neutral-800"
                                                style={{ fontFamily: JOST }}
                                            >
                                                {related.rating}
                                            </span>
                                            <span
                                                className="text-[11px] text-neutral-400"
                                                style={{ fontFamily: JOST }}
                                            >
                                                ({related.reviews})
                                            </span>
                                        </div>
                                        <h3
                                            className="text-lg font-light text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-600 transition-colors leading-snug"
                                            style={{ fontFamily: CORMORANT }}
                                        >
                                            {related.name}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className="text-base font-medium text-neutral-900"
                                                style={{ fontFamily: JOST }}
                                            >
                                                {formatPrice(related.price)}
                                            </span>
                                            {related.originalPrice > related.price && (
                                                <span
                                                    className="text-xs text-neutral-400 line-through"
                                                    style={{ fontFamily: JOST }}
                                                >
                                                    {formatPrice(related.originalPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FEATURES STRIP ── */}
            <section className="bg-neutral-900 py-12 sm:py-14">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                        {[
                            {
                                icon: Shield,
                                title: "Official Warranty",
                                desc: "1 Year Warranty",
                            },
                            {
                                icon: Zap,
                                title: "Fast Delivery",
                                desc: "Same Day Delivery",
                            },
                            {
                                icon: Award,
                                title: "Premium Quality",
                                desc: "Certified Products",
                            },
                            {
                                icon: TrendingUp,
                                title: "Best Price",
                                desc: "Guaranteed Lowest",
                            },
                        ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 px-5 sm:px-6 py-6 bg-neutral-900 hover:bg-neutral-800 transition-colors group"
                                >
                                    <Icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                                    <div>
                                        <p
                                            className="text-[11px] tracking-[0.18em] uppercase text-white font-medium mb-0.5"
                                            style={{ fontFamily: JOST }}
                                        >
                                            {f.title}
                                        </p>
                                        <p
                                            className="text-[11px] text-white/40 font-light tracking-wide"
                                            style={{ fontFamily: JOST }}
                                        >
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
