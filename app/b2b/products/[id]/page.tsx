"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, ShoppingCart, ShieldCheck, Truck, Package,
    ChevronRight, Info, Check
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { addProductToCart } from "../../cartUtils";
import AddToOrderToast from "../components/AddToOrderToast";

// We import the Product interface used across the B2B catalog
import type { Product } from "../types";

export default function B2BProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [toastProduct, setToastProduct] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                // Fetch product from standard backend endpoint
                const res = await api.get(`/products/${id}`);
                if (res.data.status === 'success') {
                    const p = res.data.data;

                    // Same formatting logic as grid
                    const formattedProduct: Product = {
                        id: String(p.id),
                        name: p.name,
                        sku: p.slug || `SKU-${p.id}`,
                        price: p.b2b_price && p.b2b_price > 0 ? p.b2b_price : p.price,
                        msrp: p.price,
                        badge: p.badge || null,
                        minOrder: p.b2b_min_order && p.b2b_min_order > 0 ? p.b2b_min_order : 1,
                        stock: p.stock || 0,
                        category: p.category || "All Products",
                        image: p.image || "https://placehold.co/600x600/f5f5f0/a8a29e?text=No+Image",
                        inStock: p.stock > 0,
                        features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features || "[]") : []),
                        specifications: typeof p.specifications === 'object' && p.specifications !== null ? p.specifications : (typeof p.specifications === 'string' ? JSON.parse(p.specifications || "{}") : {}),
                        description: p.description || "",
                    };

                    setProduct(formattedProduct);
                    setQuantity(formattedProduct.minOrder);
                }
            } catch (err) {
                console.error("Error fetching B2B product", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const formatIDR = (n: number) => "Rp " + n.toLocaleString("id-ID");

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > (product?.minOrder || 1) ? prev - 1 : prev));

    const handleAddToCart = () => {
        if (!product) return;

        // Add multiple copies if requested quantity is higher than 1
        // Usually cart utils would handle quantity merging, but assuming our standard helper
        for (let i = 0; i < quantity; i++) {
            addProductToCart(product);
        }

        setToastProduct(product.name);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
                <Package className="w-16 h-16 text-stone-300 mb-4" />
                <h1 className="text-2xl font-bold tracking-tight text-stone-800">Product not found</h1>
                <p className="text-stone-500 mt-2 mb-8">The product you are looking for does not exist or has been removed.</p>
                <Link href="/b2b/products" className="px-6 py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const discount = Math.round(((product.msrp - product.price) / product.msrp) * 100);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-stone-200 py-4 px-6 sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                        <Link href="/b2b/products" className="hover:text-stone-800 transition-colors">Catalog</Link>
                        <ChevronRight size={14} />
                        <span className="text-stone-800 truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col lg:flex-row">

                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 p-6 lg:border-r border-stone-200 bg-stone-50/50 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden flex items-center justify-center p-4">
                            <img
                                src={product.image || "https://placehold.co/600x600/f5f5f0/a8a29e?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x600/f5f5f0/a8a29e?text=No+Image";
                                }}
                            />

                            {/* Badges on image */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
                                {product.badge && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm bg-stone-900 text-white border border-white/10">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
                                {discount > 0 && (
                                    <span className="text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-xl shadow-sm">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white relative z-10">
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50/80 px-3 py-1.5 rounded-md border border-blue-100/50">
                                SKU: {product.sku}
                            </span>
                            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider px-3 py-1.5 bg-stone-100 rounded-md border border-stone-200/50">
                                {product.category || "General"}
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-[40px] font-black text-stone-900 tracking-tight leading-[1.1] mb-8">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-black text-blue-600 tracking-tight">
                                {formatIDR(product.price)}
                            </span>
                            {product.price < product.msrp && (
                                <span className="text-lg text-stone-400 line-through font-semibold pb-1">
                                    {formatIDR(product.msrp)}
                                </span>
                            )}
                            <span className="text-sm font-medium text-stone-500 pb-1.5 ml-2">/ unit</span>
                        </div>

                        {/* Minimum Order Info */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Info size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-900">B2B Order Requirements</p>
                                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                                    This product has a minimum order quantity (MOQ) of <strong className="text-blue-900">{product.minOrder} units</strong>. Current inventory stands at <strong>{product.stock} units</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-10 border-b border-stone-200">
                            {/* Quantity Control */}
                            <div className="flex items-center bg-stone-50 rounded-2xl p-1 border border-stone-200 shadow-inner">
                                <button
                                    onClick={handleDecrement}
                                    disabled={quantity <= product.minOrder}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm disabled:opacity-50 disabled:bg-transparent disabled:shadow-none transition-all"
                                >
                                    -
                                </button>
                                <div className="w-16 text-center font-bold text-lg text-stone-800">
                                    {quantity}
                                </div>
                                <button
                                    onClick={handleIncrement}
                                    disabled={quantity >= product.stock}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-stone-600 shadow-sm disabled:opacity-50 hover:bg-stone-50 active:scale-95 transition-all"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Order Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock < product.minOrder}
                                className="flex-1 flex items-center justify-center gap-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-base font-bold rounded-2xl transition-all shadow-lg shadow-stone-900/10 active:scale-[0.98]"
                            >
                                <ShoppingCart size={20} />
                                {product.stock < product.minOrder ? "Out of Stock" : "Add to Order"}
                            </button>
                        </div>

                        {/* Accordion/Details */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Product Description</h3>
                                <p className="text-stone-600 leading-relaxed text-sm whitespace-pre-wrap">
                                    {product.description || "No specific description available for this product. Suitable for retail and wholesale. Premium quality standard."}
                                </p>
                            </div>

                            {product.features && product.features.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Key Features</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check size={12} className="text-blue-600" />
                                                </div>
                                                <span className="leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Product Specifications</h3>
                                    <div className="bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden">
                                        {Object.entries(product.specifications).map(([key, value], idx) => (
                                            <div
                                                key={key}
                                                className={`flex justify-between px-5 py-3.5 text-sm ${idx !== Object.keys(product.specifications).length - 1 ? "border-b border-stone-200" : ""
                                                    }`}
                                            >
                                                <span className="text-stone-500 font-medium">{key}</span>
                                                <span className="text-stone-900 font-bold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">B2B Logistics Insights</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={16} className="text-stone-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">Quality Assured</p>
                                            <p className="text-[11px] text-stone-500 mt-0.5">Tested for wholesale distribution</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                            <Truck size={16} className="text-stone-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-900">Bulk Shipping</p>
                                            <p className="text-[11px] text-stone-500 mt-0.5">Optimized for LTL/FTL freight</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <AddToOrderToast productName={toastProduct} onClose={() => setToastProduct(null)} />
        </div>
    );
}
