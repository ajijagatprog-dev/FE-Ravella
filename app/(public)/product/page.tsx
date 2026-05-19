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
import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import { products as fallbackProducts } from "./products";
import api from "@/lib/axios";
import { useBanners } from "@/lib/useBanners";

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}

function ProductPageContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(8);
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  useEffect(() => {
    // Try to restore from cache first
    try {
      const cached = sessionStorage.getItem("ravelle_all_products");
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 5 * 60 * 1000) {
          setProducts(data);
          setIsLoading(false);
          return;
        }
      }
    } catch {}

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/products", { params: { limit: 100 } });
        if (res.data.status === "success") {
          const fetchedData = res.data.data.data;
          const mapped = fetchedData.map((item: any) => {
            const activePromo = item.active_promotion;
            return {
              id: item.id,
              name: item.name,
              description: item.description || "Deskripsi produk",
              price: item.promoted_price || item.price,
              originalPrice: item.price,
              discount: activePromo
                ? activePromo.discount_type === "percent"
                  ? activePromo.discount_value
                  : Math.round(
                      ((item.price - item.promoted_price) / item.price) * 100,
                    )
                : item.discount || 0,
              active_promotion: activePromo,
              rating: item.rating ? parseFloat(item.rating) : 0,
              reviews: item.reviews || 0,
              category: item.category || "appliance",
              image:
                item.image ||
                "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
              features: Array.isArray(item.features) ? item.features : [],
              specifications:
                typeof item.specifications === "object" &&
                item.specifications !== null
                  ? item.specifications
                  : {},
              inStock: item.stock > 0,
              badge: item.badge || (item.is_featured ? "Best Seller" : ""),
              _variants: item.variants || [],
            };
          });
          setProducts(mapped);
          try {
            sessionStorage.setItem(
              "ravelle_all_products",
              JSON.stringify({ data: mapped, ts: Date.now() }),
            );
          } catch {}
        }
      } catch (err) {
        console.error("Failed to fetch public products", err);
        // Don't empty the array if it fails, maybe there's existing data or let it fail gracefully
        // setProducts([]); // removed so it doesn't empty the screen completely if a temporary error occurs
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
  const [hoveredVariantImage, setHoveredVariantImage] = useState<
    Record<number, string>
  >({}); // productId -> hovered variant image
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; productName: string }>(
    {
      visible: false,
      productName: "",
    },
  );

  const [productBanner] = useBanners("product", [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80",
  ]);

  const categories = useMemo(
    () => [
      {
        id: "all",
        name: "ALL PRODUCTS",
        icon: Package,
        count: products.length,
      },
      {
        id: "Home & Kitchen Appliance",
        name: "HOME & KITCHEN APPLIANCE",
        icon: Zap,
        count: products.filter((p) => p.category === "Home & Kitchen Appliance")
          .length,
      },
      {
        id: "Knife set",
        name: "KNIFE SET",
        icon: Award,
        count: products.filter((p) => p.category === "Knife set").length,
      },
      {
        id: "ezy series",
        name: "EZY SERIES",
        icon: TrendingUp,
        count: products.filter((p) => p.category === "ezy series").length,
      },
      {
        id: "home living",
        name: "HOMELIVING",
        icon: Shield,
        count: products.filter((p) => p.category === "home living").length,
      },
      {
        id: "Keyboard",
        name: "KEYBOARDS",
        icon: Sparkles,
        count: products.filter((p) => p.category === "Keyboard").length,
      },
    ],
    [products],
  );

  useEffect(() => {
    if (initialCategory) {
      const match = categories.find(
        (c) => c.id.toLowerCase() === initialCategory.toLowerCase(),
      );
      if (match) {
        setActiveCategory(match.name);
      }
    }
  }, [initialCategory, categories]);

  const handleAddToCart = (product: any) => {
    try {
      const stored = localStorage.getItem("ravelle_cart");
      let cart: any[] = [];
      try {
        if (stored) {
          const parsed = JSON.parse(stored);
          cart = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        cart = [];
      }
      const exists = cart.find((item) => item.id === product.id);
      if (exists) {
        cart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item,
        );
      } else {
        cart = [
          ...cart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            badge: product.badge,
            discount: product.discount,
            category: product.category,
            quantity: 1,
            selected: true,
          },
        ];
      }
      localStorage.setItem("ravelle_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("ravelle_cart_updated"));
      setToast({ visible: true, productName: product.name });
      setTimeout(() => setToast({ visible: false, productName: "" }), 2500);
    } catch (error) {
      console.error("Cart action failed:", error);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory !== "ALL PRODUCTS") {
      const categoryId = categories.find((c) => c.name === activeCategory)?.id;
      filtered = filtered.filter((p) => p.category === categoryId);
    }
    if (searchQuery)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }
    return filtered;
  }, [activeCategory, searchQuery, sortBy, priceRange, products, categories]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  useEffect(() => {
    setDisplayLimit(8);
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const toggleFavorite = (id: number) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Toast ── */}
      <div
        className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        <div className="flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-4 min-w-[280px] max-w-sm">
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

      {/* ── HERO ── */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${productBanner})`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/40 to-transparent pointer-events-none" />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
              <span className="text-white/90 font-medium text-[11px] sm:text-xs uppercase tracking-[0.3em]">
                Ravelle Shop
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight break-words">
              Find Your Perfect <br />
              <span className="font-light text-white/90">Product</span>
            </h1>

            <div className="w-16 h-[2px] bg-white/80 mb-6 origin-left" />

            <p className="text-white/90 text-sm sm:text-lg font-light leading-relaxed max-w-lg mb-4">
              Kurasi peralatan rumah tangga eksklusif yang memadukan
              fungsionalitas modern dengan estetika abadi untuk hunian impian
              Anda.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] rotate-90 mb-4 origin-left">
              Explore
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
              <motion.div
                animate={{ y: [0, 48] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-full h-1/3 bg-white"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MAIN ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16">
        {/* Search Bar — pill style, centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="flex items-center gap-4 w-full max-w-2xl px-8 py-5 rounded-full border border-neutral-200 bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] focus-within:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] focus-within:border-neutral-900 transition-all duration-500">
            <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari produk, koleksi, atau inspirasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-base text-neutral-700 placeholder:text-neutral-400 outline-none font-light"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery("")}
                className="text-neutral-400 hover:text-neutral-900 p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="mb-14 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-[1px] bg-neutral-900" />
            <span className="text-neutral-900 font-bold text-[10px] uppercase tracking-[0.3em]">
              Categories Products
            </span>
          </motion.div>
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-3 pb-2 min-w-max">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`group flex items-center gap-3 px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase font-bold transition-all relative overflow-hidden border ${
                      activeCategory === cat.name
                        ? "text-white border-neutral-900"
                        : "text-neutral-500 bg-neutral-50 border-neutral-100 hover:bg-neutral-100 hover:border-neutral-200"
                    }`}
                  >
                    {activeCategory === cat.name && (
                      <motion.div
                        layoutId="activeCat"
                        className="absolute inset-0 bg-neutral-900 z-0"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    {Icon ? (
                      <Icon
                        className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${activeCategory === cat.name ? "text-white" : "text-neutral-400"}`}
                      />
                    ) : null}
                    <span className="relative z-10">{cat.name}</span>
                    {cat.count > 0 && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.name ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"}`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 py-4 border-y border-neutral-100">
          <span className="text-sm text-neutral-500 font-light">
            <span className="font-medium text-neutral-900">
              {filteredProducts.length}
            </span>{" "}
            produk ditemukan
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
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 && !isLoading ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <Package className="w-16 h-16 text-neutral-200 mx-auto mb-6 stroke-[1]" />
              <h3 className="text-4xl font-light text-neutral-900 mb-4">
                No Products Found
              </h3>
              <p className="text-neutral-500 text-sm font-light mb-10">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL PRODUCTS");
                  setPriceRange([0, 5000000]);
                }}
                className="px-12 py-4 border border-neutral-900 text-neutral-900 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-neutral-900 hover:text-white transition-all duration-300"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery + sortBy}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12"
                  : "flex flex-col gap-8"
              }
            >
              {displayedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className={`group relative bg-white transition-all duration-500 ${
                    viewMode === "list"
                      ? "flex flex-col md:flex-row gap-8 lg:gap-16 border-b border-neutral-100 pb-12 pt-8 px-6 -mx-6 hover:bg-neutral-50/50"
                      : ""
                  }`}
                >
                  {/* Image Container — clickable to product detail */}
                  <Link
                    href={`/product/${product.id}`}
                    className={`block relative overflow-hidden bg-[#F9F9F9] group-hover:bg-[#F3F3F3] transition-colors duration-500 flex items-center justify-center p-4 sm:p-8 ${viewMode === "grid" ? "aspect-square" : "w-full md:w-[300px] flex-shrink-0 aspect-square"}`}
                  >
                    <motion.img
                      initial={false}
                      animate={{
                        scale: hoveredProduct === product.id ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      src={hoveredVariantImage[product.id] || product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />

                    {/* Overlay effects */}
                    <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors duration-500" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.badge && (
                        <span className="px-3 py-1.5 bg-white shadow-sm text-neutral-900 text-[9px] font-black tracking-[0.2em] uppercase">
                          {product.badge}
                        </span>
                      )}
                      {product.active_promotion?.type === "flash_sale" && (
                        <span className="px-3 py-1.5 bg-amber-500 text-white text-[9px] tracking-[0.2em] uppercase font-black shadow-sm flex items-center gap-1.5">
                          <Zap className="w-3 h-3 fill-white" /> Flash Sale
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="px-3 py-1.5 bg-neutral-900 text-white text-[9px] font-black tracking-[0.2em] uppercase">
                          -{Math.round(product.discount)}%
                        </span>
                      )}
                    </div>

                    {/* Action Buttons Floating */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 translate-x-0 sm:translate-x-4 opacity-100 sm:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openQuickView(product);
                        }}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`w-10 h-10 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-300 ${favorites.includes(product.id) ? "text-red-500 bg-red-50" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"}`}
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Quick Add at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={!product.inStock}
                        className="w-full py-4 bg-neutral-900 text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-3 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </Link>

                  {/* Info Area */}
                  <div
                    className={`pt-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : "flex flex-col"}`}
                  >
                    {/* Category Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
                        {product.category}
                      </span>
                      {product.rating > 0 && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-neutral-200" />
                          <div className="flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                            <span className="text-[10px] font-bold text-neutral-600">
                              {product.rating}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Variant Preview (Grid only) */}
                    {viewMode === "grid" && product._variants?.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        {product._variants.slice(0, 4).map((v: any) => {
                          const varThumb = v.media?.[0]?.url;
                          return (
                            <button
                              key={v.id}
                              onMouseEnter={() =>
                                varThumb &&
                                setHoveredVariantImage((prev) => ({
                                  ...prev,
                                  [product.id]: varThumb,
                                }))
                              }
                              onMouseLeave={() =>
                                setHoveredVariantImage((prev) => {
                                  const next = { ...prev };
                                  delete next[product.id];
                                  return next;
                                })
                              }
                              className="w-4 h-4 rounded-full overflow-hidden border border-neutral-200 hover:border-neutral-900 hover:scale-125 transition-all duration-300"
                            >
                              {varThumb ? (
                                <img
                                  src={varThumb}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Name */}
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-neutral-900 mb-2 sm:mb-3 line-clamp-2 hover:text-neutral-500 transition-colors leading-tight">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price & Description Area */}
                    <div className="mb-6 sm:mb-8">
                      <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className="text-base sm:text-lg font-bold text-neutral-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-neutral-400 line-through font-light">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {viewMode === "list" && (
                        <p className="text-neutral-400 text-sm font-light leading-relaxed line-clamp-3 max-w-xl italic">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* View Details Link */}
                    <div className="mt-auto">
                      <Link
                        href={`/product/${product.id}`}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 hover:text-neutral-500 transition-colors group/link"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {filteredProducts.length > displayLimit && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDisplayLimit((prev) => prev + 8)}
              className="group relative px-16 py-5 bg-white text-neutral-900 text-[10px] tracking-[0.3em] uppercase font-bold border border-neutral-200 overflow-hidden transition-all duration-500 hover:border-neutral-900 shadow-sm hover:shadow-xl flex items-center gap-3"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Load More
              </span>
              <motion.div className="absolute inset-0 bg-neutral-900 -z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="relative z-10 group-hover:text-white transition-colors duration-500"
              >
                ↓
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ── QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {showModal && selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-12 h-12 bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-all z-20 group shadow-xl"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Image Section */}
              <div className="relative w-full md:w-1/2 aspect-square bg-[#F9F9F9] flex items-center justify-center p-12 lg:p-24 overflow-hidden">
                <motion.img
                  layoutId={`img-${selectedProduct.id}`}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  {selectedProduct.badge && (
                    <span className="px-5 py-2 bg-white shadow-sm text-neutral-900 text-[10px] tracking-[0.2em] font-black uppercase border border-neutral-100">
                      {selectedProduct.badge}
                    </span>
                  )}
                  {selectedProduct.active_promotion?.type === "flash_sale" && (
                    <span className="px-4 py-2 bg-amber-500 text-white text-[10px] tracking-[0.2em] uppercase font-black shadow-sm flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 fill-white" /> Flash Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-10 sm:p-16 flex flex-col overflow-y-auto">
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                      {selectedProduct.category}
                    </span>
                    {selectedProduct.rating > 0 && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-neutral-200" />
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-[11px] font-bold text-neutral-600">
                            {selectedProduct.rating}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-light text-neutral-900 leading-tight mb-6">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl font-bold text-neutral-900">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-neutral-400 line-through font-light">
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-8 mb-12">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-black mb-3">
                      About This Piece
                    </p>
                    <p className="text-neutral-600 font-light leading-relaxed text-sm">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {selectedProduct.features?.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-black mb-4">
                        Features
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProduct.features
                          .slice(0, 4)
                          .map((f: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 text-xs text-neutral-600 font-medium"
                            >
                              <div className="w-1 h-1 rounded-full bg-neutral-900" />
                              {f}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      closeModal();
                    }}
                    className="w-full py-6 bg-neutral-900 text-white text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-neutral-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Shopping Bag
                  </button>

                  <Link
                    href={`/product/${selectedProduct.id}`}
                    onClick={closeModal}
                    className="w-full py-6 border border-neutral-200 text-neutral-900 text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-4 group/link"
                  >
                    View Full Experience
                    <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-[#352309] py-12 sm:py-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              {
                icon: Shield,
                title: "Official Warranty",
                desc: "1 Year Warranty",
              },
              { icon: Zap, title: "Fast Delivery", desc: "Same Day Delivery" },
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
                  className="flex items-center gap-4 px-5 sm:px-6 py-6 bg-[#352309] hover:bg-[#4a3210] transition-colors group"
                >
                  <Icon className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                  <div>
                    <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      {f.title}
                    </h4>
                    <p className="text-white/60 text-[9px] font-medium tracking-wide">
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
