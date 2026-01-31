"use client";

import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Eye,
  Star,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Package,
  Zap,
  Shield,
  Award,
  X,
  Check,
} from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../HomePage/components/Header";
import Footer from "../HomePage/components/Footer";

export default function ProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { id: "all", name: "ALL PRODUCTS", icon: Package, count: 48 },
    { id: "appliance", name: "HOME & KITCHEN APPLIANCE", icon: Zap, count: 24 },
    { id: "knife", name: "KNIFE SET", icon: Award, count: 8 },
    { id: "ezy", name: "EZY SERIES", icon: TrendingUp, count: 6 },
    { id: "homeliving", name: "HOMELIVING", icon: Shield, count: 10 },
    { id: "keyboard", name: "KEYBOARD", icon: Sparkles, count: 0 },
  ];

  const products = [
    {
      id: 1,
      name: "Ravelle Airflex Vacuum Cleaner",
      price: 598900,
      originalPrice: 798900,
      image:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
      category: "homeliving",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      discount: 25,
      features: ["HEPA Filter", "Cordless", "2h Battery"],
      inStock: true,
      isNew: false,
      description:
        "Vacuum cleaner cordless dengan teknologi HEPA filter untuk pembersihan maksimal. Dilengkapi baterai tahan lama hingga 2 jam.",
      specifications: {
        Power: "120W",
        Battery: "2000mAh",
        Weight: "2.5kg",
        Warranty: "1 Year",
      },
    },
    {
      id: 2,
      name: "Ravelle SOLIS Dehumidifier & Air Purifier 2in1 2L",
      price: 1399900,
      originalPrice: 1799900,
      image:
        "https://www.ravelle.co.id/data/product_cover/224-20250520175323.png",
      category: "homeliving",
      rating: 4.9,
      reviews: 89,
      badge: "Premium",
      discount: 22,
      features: ["2-in-1", "Smart Sensor", "Ultra Quiet"],
      inStock: true,
      isNew: true,
      description:
        "Dehumidifier dan air purifier 2 in 1 dengan smart sensor otomatis. Operasi ultra quiet cocok untuk kamar tidur.",
      specifications: {
        Capacity: "2L",
        Coverage: "30m²",
        "Noise Level": "35dB",
        Warranty: "1 Year",
      },
    },
    {
      id: 3,
      name: "Ravelle High Speed Hair Dryer-grey",
      price: 799900,
      originalPrice: 899900,
      image:
        "https://www.ravelle.co.id/data/product_cover/207-20250109102859.png",
      category: "homeliving",
      rating: 4.7,
      reviews: 156,
      badge: "Popular",
      discount: 20,
      features: ["Digital Display", "Auto Shutoff", "Portable"],
      inStock: true,
      isNew: false,
      description:
        "Dehumidifier digital portabel dengan auto shutoff untuk keamanan maksimal. Display digital menampilkan kelembaban real-time.",
      specifications: {
        Capacity: "1L",
        Coverage: "20m²",
        Weight: "1.8kg",
        Warranty: "1 Year",
      },
    },
    {
      id: 4,
      name: "Ravelle Luxe Air Purifier HEPA13 + Anti-Allergen",
      price: 1199900,
      originalPrice: 1499900,
      image:
        "https://www.ravelle.co.id/data/product_cover/223-20250520175032.png",
      category: "homeliving",
      rating: 4.9,
      reviews: 203,
      badge: "Premium",
      discount: 20,
      features: ["HEPA13", "Anti-Allergen", "Smart Mode"],
      inStock: true,
      isNew: false,
      description:
        "Air purifier premium dengan HEPA13 filter yang mampu menyaring 99.97% partikel allergen. Dilengkapi smart mode untuk efisiensi energi.",
      specifications: {
        Filter: "HEPA13",
        Coverage: "50m²",
        CADR: "300m³/h",
        Warranty: "1 Year",
      },
    },
    {
      id: 5,
      name: "Ravelle Ezy Squeenze Citrus Juicer- Cream",
      price: 559900,
      originalPrice: 749900,
      image:
        "https://www.ravelle.co.id/data/product_cover/218-20250520162617.png",
      category: "homeliving",
      rating: 4.6,
      reviews: 98,
      badge: "New",
      discount: 25,
      features: ["Aromatherapy", "Night Light", "Compact"],
      inStock: true,
      isNew: true,
      description:
        "Air purifier compact dengan fitur aromatherapy dan night light. Sempurna untuk kamar tidur dengan desain modern.",
      specifications: {
        Filter: "HEPA13",
        Coverage: "25m²",
        Features: "Aromatherapy, LED Light",
        Warranty: "1 Year",
      },
    },
    {
      id: 6,
      name: "Ravelle Smart Rice Cooker 1.8L",
      price: 899900,
      originalPrice: 1199900,
      image:
        "https://cdn.ruparupa.io/fit-in/850x850/filters:format(webp)/filters:watermark(content.ruparupa.io,products/wm/rr.png,0,-0,0,100,100)/ruparupa-com/image/upload/Products/10632435_1.jpg",
      category: "appliance",
      rating: 4.8,
      reviews: 234,
      badge: "Best Seller",
      discount: 25,
      features: ["Smart Cook", "Keep Warm", "Non-stick"],
      inStock: true,
      isNew: false,
      description:
        "Rice cooker pintar dengan teknologi smart cook untuk hasil nasi sempurna. Fitur keep warm hingga 12 jam.",
      specifications: {
        Capacity: "1.8L",
        Power: "600W",
        Material: "Non-stick coating",
        Warranty: "1 Year",
      },
    },
    {
      id: 7,
      name: "Ravelle Premium Blender 2L",
      price: 699900,
      originalPrice: 899900,
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80",
      category: "appliance",
      rating: 4.7,
      reviews: 167,
      badge: "Popular",
      discount: 22,
      features: ["800W Motor", "Glass Jar", "6 Speeds"],
      inStock: true,
      isNew: false,
      description:
        "Blender premium dengan motor 800W untuk hasil blending sempurna. Jar kaca tahan panas dan 6 speed settings.",
      specifications: {
        Power: "800W",
        Capacity: "2L",
        Material: "Glass Jar",
        Warranty: "1 Year",
      },
    },
    {
      id: 8,
      name: "Ravelle Professional Knife Set 8pcs",
      price: 1299900,
      originalPrice: 1799900,
      image:
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80",
      category: "knife",
      rating: 4.9,
      reviews: 145,
      badge: "Premium",
      discount: 28,
      features: ["German Steel", "Ergonomic", "Block Included"],
      inStock: true,
      isNew: true,
      description:
        "Set pisau profesional 8 pieces dengan material German steel berkualitas tinggi. Dilengkapi knife block kayu premium.",
      specifications: {
        Material: "German Stainless Steel",
        Pieces: "8pcs",
        Includes: "Wooden Block",
        Warranty: "1 Year",
      },
    },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== "ALL PRODUCTS") {
      const categoryId = categories.find((c) => c.name === activeCategory)?.id;
      filtered = filtered.filter((p) => p.category === categoryId);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

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
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy, priceRange, products, categories]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "700ms" }}
        />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6 hover:bg-white/20 transition-all">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                SHOP RAVELLE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Find Your{" "}
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Perfect Product
              </span>
            </h1>

            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Temukan peralatan rumah tangga berkualitas premium untuk kebutuhan
              Anda
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari produk yang Anda inginkan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-orange-500 focus:outline-none shadow-lg text-gray-900 placeholder:text-gray-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16">
        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-4 min-w-max">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`group flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      activeCategory === cat.name
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{cat.name}</span>
                    {cat.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          activeCategory === cat.name
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-5 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-900 text-base font-bold">
              {filteredProducts.length}
            </span>
            <span className="text-gray-600 text-sm">Products Found</span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:border-orange-300 focus:border-orange-500 focus:outline-none cursor-pointer transition-all"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL PRODUCTS");
                setPriceRange([0, 5000000]);
              }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                : "flex flex-col gap-6"
            }
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-300 ${
                  viewMode === "grid" ? "hover:-translate-y-2" : "flex flex-row"
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative overflow-hidden bg-gray-50 ${
                    viewMode === "grid" ? "h-72" : "w-72 h-72 flex-shrink-0"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        NEW
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        -{product.discount}%
                      </span>
                    )}
                    {product.badge && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl shadow-lg transition-all ${
                        favorites.includes(product.id)
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white scale-110"
                          : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(product.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => openQuickView(product)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 hover:scale-105">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div
                  className={`p-6 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}
                >
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-gray-900">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-br from-orange-50 to-pink-50 text-orange-700 text-xs font-semibold rounded-lg border border-orange-100"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="space-y-1 mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through font-medium">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-emerald-600 font-bold">
                        Save{" "}
                        {formatPrice(product.originalPrice - product.price)}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  {viewMode === "grid" && (
                    <button className="w-full py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all border-2 border-orange-200 hover:border-orange-300 flex items-center justify-center gap-2 group/btn">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>

                {/* List View CTA */}
                {viewMode === "list" && (
                  <div className="flex items-center gap-3 p-6 border-l-2 border-gray-100">
                    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all">
                      Add to Cart
                    </button>
                    <button
                      onClick={() => openQuickView(product)}
                      className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-orange-300 transition-all"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 text-center">
            <button className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:border-orange-300 hover:shadow-lg transition-all">
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative">
                <div className="sticky top-0">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {selectedProduct.isNew && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-lg shadow-lg">
                          NEW
                        </span>
                      )}
                      {selectedProduct.discount > 0 && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                          -{selectedProduct.discount}%
                        </span>
                      )}
                      {selectedProduct.badge && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                          {selectedProduct.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedProduct.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedProduct.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({selectedProduct.reviews} reviews)
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-100">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-gray-400 line-through font-medium">
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <p className="text-sm text-emerald-600 font-bold">
                      Hemat{" "}
                      {formatPrice(
                        selectedProduct.originalPrice - selectedProduct.price,
                      )}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Fitur Utama
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map(
                      (feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white text-orange-700 text-sm font-semibold rounded-xl border-2 border-orange-100"
                        >
                          <Check className="w-4 h-4 inline mr-1" />
                          {feature}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Spesifikasi
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(
                      selectedProduct.specifications as Record<string, string>,
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-gray-100"
                      >
                        <span className="text-gray-600 font-medium">{key}</span>
                        <span className="text-gray-900 font-semibold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => toggleFavorite(selectedProduct.id)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                      favorites.includes(selectedProduct.id)
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white scale-105"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-orange-300"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        favorites.includes(selectedProduct.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </button>
                  <button className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Stock Status */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${selectedProduct.inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${selectedProduct.inStock ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 sm:py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Shield,
                title: "Official Warranty",
                desc: "1 Year Warranty",
                gradient: "from-orange-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                desc: "Same Day Delivery",
                gradient: "from-pink-500 to-purple-500",
              },
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Certified Products",
                gradient: "from-purple-500 to-blue-500",
              },
              {
                icon: TrendingUp,
                title: "Best Price",
                desc: "Guaranteed Lowest",
                gradient: "from-blue-500 to-cyan-500",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

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
