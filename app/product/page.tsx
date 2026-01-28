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
} from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../HomePage/components/Header";
import Footer from "../HomePage/Footer";

export default function ProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

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
    },
    {
      id: 2,
      name: "Ravelle SOLIS Dehumidifier & Air Purifier 2in1 2L",
      price: 1399900,
      originalPrice: 1799900,
      image:
        "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&q=80",
      category: "homeliving",
      rating: 4.9,
      reviews: 89,
      badge: "Premium",
      discount: 22,
      features: ["2-in-1", "Smart Sensor", "Ultra Quiet"],
      inStock: true,
      isNew: true,
    },
    {
      id: 3,
      name: "Ravelle NOVA Digital Dehumidifier 1L",
      price: 559900,
      originalPrice: 699900,
      image:
        "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=500&q=80",
      category: "homeliving",
      rating: 4.7,
      reviews: 156,
      badge: "Popular",
      discount: 20,
      features: ["Digital Display", "Auto Shutoff", "Portable"],
      inStock: true,
      isNew: false,
    },
    {
      id: 4,
      name: "Ravelle Luxe Air Purifier HEPA13 + Anti-Allergen",
      price: 1199900,
      originalPrice: 1499900,
      image:
        "https://images.unsplash.com/photo-1583425423320-2386622cd2e4?w=500&q=80",
      category: "homeliving",
      rating: 4.9,
      reviews: 203,
      badge: "Premium",
      discount: 20,
      features: ["HEPA13", "Anti-Allergen", "Smart Mode"],
      inStock: true,
      isNew: false,
    },
    {
      id: 5,
      name: "Ravelle Airy Air Purifier HEPA13 + Aromatherapy",
      price: 559900,
      originalPrice: 749900,
      image:
        "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80",
      category: "homeliving",
      rating: 4.6,
      reviews: 98,
      badge: "New",
      discount: 25,
      features: ["Aromatherapy", "Night Light", "Compact"],
      inStock: true,
      isNew: true,
    },
    {
      id: 6,
      name: "Ravelle Smart Rice Cooker 1.8L",
      price: 899900,
      originalPrice: 1199900,
      image:
        "https://images.unsplash.com/photo-1556910109-76e43ce4d3f4?w=500&q=80",
      category: "appliance",
      rating: 4.8,
      reviews: 234,
      badge: "Best Seller",
      discount: 25,
      features: ["Smart Cook", "Keep Warm", "Non-stick"],
      inStock: true,
      isNew: false,
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
    },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== "ALL PRODUCTS") {
      const categoryId = categories.find(
        (c) => c.name === activeCategory,
      )?.id;
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
  }, [activeCategory, searchQuery, sortBy, priceRange, products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section - Clean & Professional */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 py-20 overflow-hidden border-b border-slate-200">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Product/bannerproduct.png"
            alt="Banner Product"
            className="w-full h-full object-cover"
          />
          {/* Overlay untuk memastikan text tetap readable */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95" />
        </div>

        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 font-semibold text-sm uppercase tracking-wider">
              SHOP RAVELLE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Find Your{" "}
            <span className="text-slate-600">Perfect Product</span>
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Temukan peralatan rumah tangga berkualitas premium untuk kebutuhan
            Anda
          </p>

          {/* Search Bar - Minimalist */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk yang Anda inginkan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-xl bg-white border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 shadow-sm text-slate-900 placeholder:text-slate-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs - Clean */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`group flex items-center gap-2.5 px-5 py-3 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeCategory === cat.name
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <cat.icon className="w-4.5 h-4.5" />
                <span>{cat.name}</span>
                {cat.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeCategory === cat.name
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar - Clean */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-sm font-medium">
              {filteredProducts.length} Products Found
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
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
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg font-medium text-sm text-slate-700 hover:border-slate-300 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 cursor-pointer transition-all"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No Products Found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("ALL PRODUCTS");
                setPriceRange([0, 5000000]);
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "hover:-translate-y-1"
                    : "flex flex-row"
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative overflow-hidden bg-slate-50 ${
                    viewMode === "grid" ? "h-64" : "w-64 h-64"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Subtle Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                        NEW
                      </span>
                    )}
                    {product.discount > 0 && (
                      <span className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                        -{product.discount}%
                      </span>
                    )}
                    {product.badge && (
                      <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
                        favorites.includes(product.id)
                          ? "bg-rose-600 text-white"
                          : "bg-white/90 text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Heart
                        className={`w-4.5 h-4.5 ${
                          favorites.includes(product.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-lg flex items-center justify-center hover:bg-white transition-all shadow-lg">
                      <Eye className="w-4.5 h-4.5 text-slate-700" />
                    </button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <button className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4.5 h-4.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg border border-slate-200">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className={`p-5 ${viewMode === "list" ? "flex-1" : ""}`}>
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-slate-900">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-base font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-700 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-emerald-600 font-medium">
                        Save {formatPrice(product.originalPrice - product.price)}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  {viewMode === "grid" && (
                    <button className="w-full py-2.5 bg-slate-50 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-2 group/btn">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>

                {/* List View CTA */}
                {viewMode === "list" && (
                  <div className="flex items-center gap-3 p-5 border-l border-slate-200">
                    <button className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all">
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
          <div className="mt-12 text-center">
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Features Section - Clean */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Warranty",
                desc: "1 Year Official Warranty",
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
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}