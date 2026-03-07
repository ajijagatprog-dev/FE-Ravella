"use client";

import {
  Search,
  ShoppingCart,
  Heart,
  Eye,
  Star,
  ChevronDown,
  Grid,
  List,
  TrendingUp,
  ArrowRight,
  Package,
  Zap,
  Shield,
  Award,
  X,
  Check,
  Filter,
  Sparkles,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import { products as fallbackProducts } from "./products";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/products', { params: { limit: 100 } });
        if (res.data.status === 'success') {
          const fetchedData = res.data.data.data;
          const mapped = fetchedData.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description || "Deskripsi produk",
            price: item.sale_price && item.sale_price > 0 ? item.sale_price : item.price,
            originalPrice: item.price,
            discount: item.discount || 0,
            rating: item.rating ? parseFloat(item.rating) : 0,
            reviews: item.reviews || 0,
            category: item.category || "appliance",
            image: item.image || "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
            features: Array.isArray(item.features) ? item.features : [],
            specifications: typeof item.specifications === 'object' && item.specifications !== null ? item.specifications : {},
            inStock: item.stock > 0,
            badge: item.badge || (item.is_featured ? "Best Seller" : ""),
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch public products", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; productName: string }>({
    visible: false,
    productName: "",
  });


  const categories = useMemo(() => [
    { id: "all", name: "ALL PRODUCTS", icon: Package, count: products.length },
    { id: "Home & Kitchen Appliance", name: "HOME & KITCHEN APPLIANCE", icon: Zap, count: products.filter(p => p.category === "Home & Kitchen Appliance").length },
    { id: "Knife set", name: "KNIFE SET", icon: Award, count: products.filter(p => p.category === "Knife set").length },
    { id: "ezy series", name: "EZY SERIES", icon: TrendingUp, count: products.filter(p => p.category === "ezy series").length },
    { id: "home living", name: "HOMELIVING", icon: Shield, count: products.filter(p => p.category === "home living").length },
    { id: "keyboard", name: "KEYBOARD", icon: Sparkles, count: products.filter(p => p.category === "keyboard").length },
  ], [products]);

  const handleAddToCart = (product: any) => {
    // Baca cart yang ada
    const stored = localStorage.getItem("ravelle_cart");
    let cart: any[] = stored ? JSON.parse(stored) : [];

    // Tambahkan atau update qty
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      cart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cart = [
        ...cart,
        {
          id: product.id, name: product.name, price: product.price,
          originalPrice: product.originalPrice, image: product.image,
          badge: product.badge, discount: product.discount,
          category: product.category, quantity: 1, selected: true,
        },
      ];
    }

    // Simpan ke localStorage
    localStorage.setItem("ravelle_cart", JSON.stringify(cart));

    // Beritahu Header agar update cart badge
    window.dispatchEvent(new Event("ravelle_cart_updated"));

    // Tampilkan toast — TIDAK redirect ke /cart
    setToast({ visible: true, productName: product.name });
    setTimeout(() => setToast({ visible: false, productName: "" }), 2500);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeCategory !== "ALL PRODUCTS") {
      const categoryId = categories.find((c) => c.name === activeCategory)?.id;
      filtered = filtered.filter((p) => p.category === categoryId);
    }
    if (searchQuery) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating": filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => b.reviews - a.reviews);
    }
    return filtered;
  }, [activeCategory, searchQuery, sortBy, priceRange, products]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  useEffect(() => {
    setDisplayLimit(12);
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const toggleFavorite = (id: number) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const openQuickView = (product: any) => { setSelectedProduct(product); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setTimeout(() => setSelectedProduct(null), 300); };

  const badgeStyle: Record<string, string> = {
    "Best Seller": "bg-neutral-900 text-white",
    "Premium": "bg-neutral-700 text-white",
    "Popular": "bg-neutral-100 text-neutral-700 border border-neutral-200",
    "New": "bg-white text-neutral-900 border border-neutral-200",
    "Sale": "bg-neutral-100 text-neutral-700 border border-neutral-200",
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: JOST }}>
      <Header />

      {/* ── Toast ── */}
      <div className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-4 min-w-[280px] max-w-sm" style={{ fontFamily: JOST }}>
          <ShoppingCart className="w-4 h-4 text-neutral-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-neutral-900 text-sm">Ditambahkan ke Keranjang</p>
            <p className="text-xs text-neutral-400 truncate mt-0.5">{toast.productName}</p>
          </div>
          <Check className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span className="text-white/70 font-medium text-[11px] uppercase tracking-[0.25em]" style={{ fontFamily: JOST }}>
                Shop Ravelle
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-[1.05]" style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}>
              Find Your{" "}
              <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
                Perfect Product
              </em>
            </h1>

            <div className="w-10 h-[1px] bg-white/30 mb-5" />

            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-lg" style={{ fontFamily: JOST }}>
              Temukan peralatan rumah tangga berkualitas premium untuk kebutuhan Anda.
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16">

        {/* Search Bar — pill style, centered */}
        <div className="flex justify-center mb-10">
          <div
            className="flex items-center gap-3 w-full max-w-lg px-5 py-3.5 rounded-full border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors"
            style={{ fontFamily: JOST }}
          >
            <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari produk, tips, atau tutorial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 outline-none font-light"
              style={{ fontFamily: JOST }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-4 h-[1px] bg-neutral-400" />
            <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.22em]" style={{ fontFamily: JOST }}>
              Categories
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 pb-2 min-w-max">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase font-medium transition-all whitespace-nowrap ${activeCategory === cat.name
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    style={{ fontFamily: JOST }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    {cat.count > 0 && (
                      <span className={`text-[10px] ${activeCategory === cat.name ? "text-white/60" : "text-neutral-400"}`}>
                        ({cat.count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 py-4 border-y border-neutral-100">
          <span className="text-sm text-neutral-500 font-light" style={{ fontFamily: JOST }}>
            <span className="font-medium text-neutral-900">{filteredProducts.length}</span> produk ditemukan
          </span>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center border border-neutral-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2 border border-neutral-200 text-[11px] tracking-[0.12em] uppercase text-neutral-700 hover:border-neutral-400 focus:outline-none cursor-pointer bg-white"
                style={{ fontFamily: JOST }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 && !isLoading ? (
          <div className="text-center py-24">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-5" />
            <h3 className="text-4xl font-light text-neutral-900 mb-3" style={{ fontFamily: CORMORANT }}>
              No Products Found
            </h3>
            <p className="text-neutral-500 text-sm font-light mb-8" style={{ fontFamily: JOST }}>
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("ALL PRODUCTS"); setPriceRange([0, 5000000]); }}
              className="px-8 py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-colors"
              style={{ fontFamily: JOST }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`group relative bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 ${viewMode === "list" ? "flex flex-row" : ""}`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden bg-neutral-50 ${viewMode === "grid" ? "aspect-[3/4]" : "w-56 sm:w-72 flex-shrink-0 aspect-square"}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.badge && (
                      <span className="px-3 py-1 bg-white shadow-sm text-neutral-900 text-[10px] font-bold tracking-[0.14em] uppercase border border-neutral-100" style={{ fontFamily: JOST }}>
                        {product.badge}
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-medium tracking-[0.12em] uppercase" style={{ fontFamily: JOST }}>
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick view */}
                  <button
                    onClick={() => openQuickView(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 hover:bg-neutral-100"
                  >
                    <Eye className="w-3.5 h-3.5 text-neutral-700" />
                  </button>

                  {/* Quick Add */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 bg-neutral-900 text-white text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: JOST }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Out of Stock */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                      <span className="px-5 py-2.5 bg-neutral-900 text-white text-[11px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: JOST }}>
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                {/* Info */}
                <div className={`p-4 sm:p-5 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : "flex flex-col items-center text-center"}`}>

                  {/* Name */}
                  <h3 className="text-lg sm:text-lg font-medium text-neutral-900 mb-2 line-clamp-2 group-hover:text-neutral-500 transition-colors leading-snug" style={{ fontFamily: CORMORANT }}>
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-base sm:text-base font-semibold text-neutral-900" style={{ fontFamily: JOST }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-neutral-400 line-through" style={{ fontFamily: JOST }}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* View Details — grid only */}
                  {viewMode === "grid" && (
                    <Link
                      href={`/product/${product.id}`}
                      className="w-full mt-4 py-2.5 border border-neutral-200 bg-white text-neutral-900 text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                      style={{ fontFamily: JOST }}
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* List CTA */}
                {viewMode === "list" && (
                  <div className="flex items-center gap-2 p-4 border-l border-neutral-100">
                    <button onClick={() => handleAddToCart(product)} className="px-5 py-2.5 bg-neutral-900 text-white text-[11px] tracking-[0.18em] uppercase font-medium hover:bg-black transition-colors" style={{ fontFamily: JOST }}>
                      Add to Cart
                    </button>
                    <Link href={`/product/${product.id}`} className="px-5 py-2.5 border border-neutral-200 text-neutral-700 text-[11px] tracking-[0.18em] uppercase font-medium hover:border-neutral-800 transition-colors" style={{ fontFamily: JOST }}>
                      Details
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > displayLimit && !isLoading && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setDisplayLimit(prev => prev + 12)}
              className="px-10 py-3.5 border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.2em] uppercase font-medium hover:border-neutral-800 hover:text-neutral-900 transition-all cursor-pointer"
              style={{ fontFamily: JOST }}
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* ── QUICK VIEW MODAL ── */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal} style={{ fontFamily: JOST }}>
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button onClick={closeModal} className="absolute top-5 right-5 w-9 h-9 bg-white border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all z-10">
              <X className="w-4 h-4" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {selectedProduct.badge && <span className="px-3 py-1 bg-white shadow-sm text-neutral-900 text-[10px] tracking-[0.14em] font-bold uppercase border border-neutral-100" style={{ fontFamily: JOST }}>{selectedProduct.badge}</span>}
                  {selectedProduct.discount > 0 && <span className="px-2.5 py-1 bg-neutral-900 text-white text-[10px] tracking-[0.12em] uppercase" style={{ fontFamily: JOST }}>-{selectedProduct.discount}%</span>}
                </div>
              </div>

              {/* Details */}
              <div className="p-7 sm:p-8 flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}`} />
                  ))}
                  <span className="text-xs text-neutral-500 ml-1" style={{ fontFamily: JOST }}>{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                </div>

                {/* Name */}
                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-2 leading-tight" style={{ fontFamily: CORMORANT }}>
                  {selectedProduct.name}
                </h2>
                <div className="w-8 h-[1px] bg-neutral-200 mb-4" />

                {/* Description */}
                <p className="text-neutral-500 text-sm font-light leading-relaxed mb-5" style={{ fontFamily: JOST }}>
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="border border-neutral-100 bg-neutral-50 p-4 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-neutral-900" style={{ fontFamily: JOST }}>
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-sm text-neutral-400 line-through" style={{ fontFamily: JOST }}>
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <p className="text-[11px] text-neutral-500 mt-1 tracking-wide" style={{ fontFamily: JOST }}>
                      Hemat {formatPrice(selectedProduct.originalPrice - selectedProduct.price)}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-2.5" style={{ fontFamily: JOST }}>Fitur Utama</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((f: string, i: number) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 text-[11px] tracking-[0.1em] uppercase font-medium" style={{ fontFamily: JOST }}>
                        <Check className="w-3 h-3" />{f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium mb-2.5" style={{ fontFamily: JOST }}>Spesifikasi</p>
                  <div className="space-y-1.5">
                    {Object.entries(selectedProduct.specifications as Record<string, string>).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1.5 border-b border-neutral-100 text-sm" style={{ fontFamily: JOST }}>
                        <span className="text-neutral-400 font-light">{k}</span>
                        <span className="text-neutral-800 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`w-11 h-11 flex items-center justify-center border transition-all ${favorites.includes(selectedProduct.id) ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-200 text-neutral-500 hover:border-neutral-800"}`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(selectedProduct.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => { closeModal(); handleAddToCart(selectedProduct); }}
                    className="flex-1 py-3 bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: JOST }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

                {/* Stock */}
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedProduct.inStock ? "bg-green-500" : "bg-red-400"}`} />
                  <span className="text-[11px] text-neutral-400 tracking-wide" style={{ fontFamily: JOST }}>
                    {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURES STRIP ── */}
      <section className="bg-neutral-900 py-12 sm:py-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              { icon: Shield, title: "Official Warranty", desc: "1 Year Warranty" },
              { icon: Zap, title: "Fast Delivery", desc: "Same Day Delivery" },
              { icon: Award, title: "Premium Quality", desc: "Certified Products" },
              { icon: TrendingUp, title: "Best Price", desc: "Guaranteed Lowest" },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-5 sm:px-6 py-6 bg-neutral-900 hover:bg-neutral-800 transition-colors group">
                  <Icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  <div>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-white font-medium mb-0.5" style={{ fontFamily: JOST }}>
                      {f.title}
                    </p>
                    <p className="text-[11px] text-white/40 font-light tracking-wide" style={{ fontFamily: JOST }}>
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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}