"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useBanners } from "@/lib/useBanners";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Instagram,
  Phone,
  Facebook,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem("ravelle_cart");
    if (!stored) return 0;
    const cart = JSON.parse(stored);
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  } catch {
    return 0;
  }
}

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
}

// Category icon mapping
const CATEGORY_ICONS: Record<string, string> = {
  default: "◈",
  homeliving: "🏠",
  "home living": "🏠",
  homekitchen: "🍳",
  "home kitchen": "🍳",
  knifeset: "🔪",
  "knife set": "🔪",
  ezyseries: "⚡",
  "ezy series": "⚡",
  kitchen: "🍳",
  bedroom: "🛏",
  bathroom: "🚿",
  living: "🛋",
  outdoor: "🌿",
  decor: "✨",
  furniture: "🪑",
  lighting: "💡",
  storage: "📦",
  textile: "🧵",
};

function getCategoryIcon(cat: string): string {
  const key = cat.toLowerCase().replace(/\s+/g, "");
  return (
    CATEGORY_ICONS[key] ||
    CATEGORY_ICONS[cat.toLowerCase()] ||
    CATEGORY_ICONS.default
  );
}

export default function Header({
  userName = "User",
  avatarUrl = "",
  onSearch = () => {},
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [authObj, setAuthObj] = useState<{
    role: string;
    email: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Dynamic banners for the product dropdown mega-menu
  const dropdownBanners = useBanners("product-dropdown", [
    "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
    "",
    "/Product/Ravelle-Cooking-BG.png",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80",
  ]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setCartCount(readCartCount());

    const handleCartUpdate = () => setCartCount(readCartCount());

    const fetchCategories = async () => {
      try {
        const cached = sessionStorage.getItem("ravelle_categories_v4");
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < 60 * 60 * 1000) {
            // Cache for 1 hour since categories rarely change
            setCategories(data);
            return;
          }
        }
      } catch {}

      try {
        const res = await api.get("/products", { params: { limit: 100 } });
        if (res.data.status === "success") {
          const items = res.data.data.data || res.data.data;
          const rawCats = items.map((i: any) => i.category).filter(Boolean);
          const catMap = new Map<string, string>();
          rawCats.forEach((c: string) => {
            let normalized = c.toLowerCase().replace(/\s+/g, "");
            if (normalized === "homeliving") {
              catMap.set("homeliving", "Home Living");
            } else if (
              normalized.includes("kitchen") ||
              normalized.includes("appliance") ||
              normalized.includes("knife") ||
              normalized.includes("cook") ||
              normalized === "homekitchen"
            ) {
              catMap.set("homekitchen", "Home Kitchen");
            }
          });

          // Use hardcoded curated categories as requested by the user
          const fetchedCategories = ["Home Living", "Home Kitchen"];
          setCategories(fetchedCategories);

          try {
            sessionStorage.setItem(
              "ravelle_categories_v4",
              JSON.stringify({ data: fetchedCategories, ts: Date.now() }),
            );
          } catch {}
        }
      } catch {}
    };
    fetchCategories();

    const checkAuth = () => {
      try {
        const stored = localStorage.getItem("auth");
        if (stored && stored !== "undefined") {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") setAuthObj(parsed);
          else setAuthObj(null);
        } else setAuthObj(null);
      } catch {
        setAuthObj(null);
        localStorage.removeItem("auth");
      }
    };
    checkAuth();

    window.addEventListener("ravelle_cart_updated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("ravelle_cart_updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuthObj(null);
    window.location.href = "/";
  };

  const openMega = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    leaveTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const menus = [
    { label: "HOME", href: "/" },
    { label: "COMPANY", href: "/company" },
    { label: "PRODUCT", href: "/product" },
    { label: "NEWS", href: "/news" },
    { label: "CONTACT", href: "/contact" },
    { label: "CONTENTS", href: "/contents" },
  ];

  const saleMenu = { label: "SALE", href: "/sale" };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_4px_24px_-4px_rgba(0,0,0,0.05)]"
            : "bg-white border-b border-neutral-100"
        }`}
      >
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 py-3.5">
          <div className="flex items-center justify-between">
            {/* ── LEFT: Logo + Nav ── */}
            <div className="flex items-center gap-8 xl:gap-14">
              <Link href="/" className="flex items-center flex-shrink-0 group">
                <img
                  src="/lg-ravella-gold.png"
                  alt="Ravelle Logo"
                  className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto transition-all duration-500 group-hover:opacity-80"
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
                {menus.map((menu) =>
                  menu.label === "PRODUCT" ? (
                    <div
                      key="PRODUCT"
                      className="relative"
                      onMouseEnter={openMega}
                      onMouseLeave={closeMega}
                    >
                      <button
                        className={`nav-link-underline text-[11.5px] tracking-[0.16em] font-semibold transition-colors duration-200 py-1 ${
                          megaOpen
                            ? "text-black"
                            : "text-neutral-500 hover:text-black"
                        } ${pathname.startsWith("/product") ? "active text-black" : ""}`}
                      >
                        PRODUCT
                      </button>
                    </div>
                  ) : (
                    <Link
                      key={menu.label}
                      href={menu.href}
                      className={`nav-link-underline text-[11.5px] tracking-[0.16em] font-semibold transition-colors duration-200 py-1 ${
                        pathname === menu.href
                          ? "active text-black"
                          : "text-neutral-500 hover:text-black"
                      }`}
                    >
                      {menu.label}
                    </Link>
                  ),
                )}

                {/* SALE */}
                <Link
                  href={saleMenu.href}
                  className="relative text-[11.5px] tracking-[0.16em] font-bold text-rose-500 hover:text-rose-600 transition-colors duration-200 flex items-center gap-2 py-1 group"
                >
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span className="sale-ring absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                  SALE
                </Link>
              </nav>
            </div>

            {/* ── RIGHT: Icons ── */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all duration-200"
                aria-label="Cart"
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden md:block relative group">
                {authObj ? (
                  <>
                    <Link
                      href={
                        authObj.role === "admin"
                          ? "/admin/dashboard"
                          : authObj.role === "b2b"
                            ? "/b2b/dashboard"
                            : "/customer/dashboard"
                      }
                      className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] font-semibold border border-neutral-200 text-neutral-800 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">PROFILE</span>
                    </Link>
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-neutral-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 rounded-md overflow-hidden">
                      <Link
                        href={
                          authObj.role === "admin"
                            ? "/admin/dashboard"
                            : authObj.role === "b2b"
                              ? "/b2b/dashboard"
                              : "/customer/dashboard"
                        }
                        className="block px-5 py-3.5 text-[11px] tracking-[0.1em] text-neutral-700 hover:bg-neutral-50 hover:text-black border-b border-neutral-50 transition-colors"
                      >
                        MY ACCOUNT
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3.5 text-[11px] tracking-[0.1em] text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        LOGOUT
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.15em] font-semibold border border-neutral-200 text-neutral-800 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-sm"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">ACCOUNT</span>
                    </Link>
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-neutral-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 rounded-md overflow-hidden">
                      <Link
                        href="/auth/login"
                        className="block px-5 py-3.5 text-[11px] tracking-[0.1em] text-neutral-700 hover:bg-neutral-50 hover:text-black border-b border-neutral-50 transition-colors"
                      >
                        LOGIN
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-5 py-3.5 text-[11px] tracking-[0.1em] text-neutral-700 hover:bg-neutral-50 hover:text-black border-b border-neutral-50 transition-colors"
                      >
                        DAFTAR CUSTOMER
                      </Link>
                      <Link
                        href="/auth/register-b2b"
                        className="block px-5 py-3.5 text-[11px] tracking-[0.1em] text-neutral-700 hover:bg-neutral-50 hover:text-[#5E492C] transition-colors"
                      >
                        DAFTAR MITRA B2B
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 text-neutral-700 hover:text-black transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* ══════════════════════════════════════
            MEGA MENU DROPDOWN — PRODUCT
        ══════════════════════════════════════ */}
        <div
          ref={megaRef}
          className={`mega-panel absolute left-0 w-full border-t border-neutral-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] z-40 overflow-hidden ${megaOpen ? "open" : ""}`}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          style={{ background: dropdownBanners[2] ? "transparent" : "#fff" }}
        >
          {/* Dynamic Background Banner (slot 3) */}
          {dropdownBanners[2] && (
            <>
              <img
                src={dropdownBanners[2]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/55 to-black/40" />
            </>
          )}
          <div className="relative max-w-[1320px] mx-auto px-6 md:px-12 py-6">
            <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
              {/* ── LEFT: Categories ── */}
              <div className="flex-1 min-w-0">
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <p
                      className={`text-[10px] font-bold tracking-[0.28em] uppercase mb-0.5 ${dropdownBanners[2] ? "text-white/50" : "text-neutral-400"}`}
                    >
                      Koleksi Kami
                    </p>
                    <h3
                      className={`text-[17px] font-bold tracking-tight leading-tight ${dropdownBanners[2] ? "text-white" : "text-neutral-900"}`}
                    >
                      Jelajahi Kategori
                    </h3>
                  </div>
                  <div
                    className={`h-[1px] flex-1 divider-line ml-3 ${dropdownBanners[2] ? "bg-gradient-to-r from-white/20 to-transparent" : "bg-gradient-to-r from-neutral-200 to-transparent"}`}
                  />
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {categories.length > 0 ? (
                    categories.map((cat, i) => {
                      const isLiving = cat.toLowerCase().includes("living");
                      const isKitchen = cat.toLowerCase().includes("kitchen");
                      const cardBanner = isLiving
                        ? dropdownBanners[3]
                        : isKitchen
                          ? dropdownBanners[4]
                          : null;

                      return (
                        <Link
                          key={cat}
                          href={
                            cat.toLowerCase().includes("kitchen")
                              ? `/product?category=${encodeURIComponent("Home & Kitchen Appliance")}`
                              : cat.toLowerCase().includes("living")
                                ? `/product?category=${encodeURIComponent("home living")}`
                                : `/product?category=${encodeURIComponent(cat)}`
                          }
                          className={`cat-card cat-card-stagger rounded-xl p-4 block relative overflow-hidden transition-all duration-300 ${
                            cardBanner
                              ? "border border-white/10 hover:scale-[1.02] shadow-sm hover:shadow-md"
                              : dropdownBanners[2]
                                ? "!bg-white/10 backdrop-blur-md border border-white/10 hover:!bg-white/20"
                                : "border border-neutral-100 hover:bg-neutral-50"
                          }`}
                          style={{ transitionDelay: `${0.05 + i * 0.04}s` }}
                          onMouseEnter={() => setHoveredCat(cat)}
                          onMouseLeave={() => setHoveredCat(null)}
                        >
                          {cardBanner && (
                            <>
                              <img
                                src={cardBanner}
                                alt={cat}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/45 hover:bg-black/35 transition-colors duration-300" />
                            </>
                          )}
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <span className="cat-icon text-2xl leading-none">
                                {getCategoryIcon(cat)}
                              </span>
                              <span
                                className={`cat-arrow text-sm font-light ${cardBanner || dropdownBanners[2] ? "text-white/80" : "text-neutral-300"}`}
                              >
                                →
                              </span>
                            </div>
                            <h4
                              className={`cat-label text-[13px] font-bold tracking-wide capitalize leading-tight mb-1 ${cardBanner || dropdownBanners[2] ? "text-white" : "text-neutral-800"}`}
                            >
                              {cat}
                            </h4>
                            <p
                              className={`cat-eksplor text-[9.5px] uppercase tracking-[0.22em] font-semibold flex items-center gap-1 ${cardBanner || dropdownBanners[2] ? "text-white/85" : "text-neutral-400"}`}
                            >
                              Eksplor
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="col-span-full flex items-center py-10">
                      <Loader2
                        className={`w-4 h-4 animate-spin ${dropdownBanners[2] ? "text-white/40" : "text-neutral-300"}`}
                      />
                      <span
                        className={`ml-3 text-[12px] tracking-wide ${dropdownBanners[2] ? "text-white/50" : "text-neutral-400"}`}
                      >
                        Memuat kategori...
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div
                  className={`mt-5 pt-4 flex flex-wrap items-center gap-6 xl:gap-8 ${dropdownBanners[2] ? "border-t border-white/10" : "border-t border-neutral-100"}`}
                >
                  {[
                    { value: "500+", label: "Produk" },
                    { value: "15+", label: "Kategori" },
                    { value: "10K+", label: "Pelanggan" },
                  ].map((s) => (
                    <div key={s.label} className="stat-item text-center">
                      <p
                        className={`text-[15px] font-bold ${dropdownBanners[2] ? "text-white" : "text-neutral-900"}`}
                      >
                        {s.value}
                      </p>
                      <p
                        className={`text-[10px] tracking-[0.18em] uppercase font-medium ${dropdownBanners[2] ? "text-white/50" : "text-neutral-400"}`}
                      >
                        {s.label}
                      </p>
                    </div>
                  ))}
                  <div className="ml-auto">
                    <Link
                      href="/product"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-[10.5px] tracking-[0.2em] font-bold uppercase rounded-sm transition-all duration-300 group/btn ${
                        dropdownBanners[2]
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-black text-white hover:bg-neutral-800"
                      }`}
                    >
                      Semua Produk
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Featured Card (hidden on smaller screens) ── */}
              <div className="hidden xl:flex w-[300px] xl:w-[340px] flex-shrink-0 flex-col gap-4">
                {/* Main featured */}
                <Link
                  href="/product"
                  className="featured-card block aspect-[4/5] w-full flex-1 relative shadow-sm hover:shadow-xl transition-shadow duration-500 group/feat rounded-xl overflow-hidden"
                >
                  <img
                    src={
                      dropdownBanners[0] ||
                      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80"
                    }
                    alt="Featured Collection"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B79F5D] text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-sm shadow-lg">
                      <Sparkles className="w-2.5 h-2.5" />
                      Koleksi Terbaru
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 overlay-content">
                    <h4 className="text-white text-[17px] font-bold leading-snug tracking-tight mb-1 drop-shadow-md">
                      Ravelle Premium
                      <br />
                      Collection
                    </h4>
                    <p className="text-neutral-300 text-[11px] mb-5 font-light">
                      Desain eksklusif untuk gaya hidup modern
                    </p>
                    <div className="flex items-center gap-2 shop-btn text-white">
                      <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                        Shop Now
                      </span>
                      <div className="h-[1px] w-8 bg-[#B79F5D] group-hover/feat:w-12 transition-all duration-500" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#B79F5D] group-hover/feat:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                {/* Mini promo card */}
                <Link
                  href="/sale"
                  className="relative overflow-hidden rounded-xl p-5 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-700 hover:from-neutral-800 hover:to-neutral-600 transition-all duration-500 group/sale"
                >
                  {/* Dynamic background image for slot 2 */}
                  {dropdownBanners[1] && (
                    <>
                      <img
                        src={dropdownBanners[1]}
                        alt="Promo Banner"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                    </>
                  )}
                  <div className="relative z-10">
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-rose-400 mb-1">
                      🔥 Flash Sale
                    </p>
                    <p className="text-white text-[13px] font-bold leading-tight">
                      Diskon hingga
                      <br />
                      <span className="text-rose-400 text-xl font-black">
                        70%
                      </span>
                    </p>
                  </div>
                  <div className="relative z-10 text-right">
                    <p className="text-neutral-400 text-[9px] tracking-widest uppercase mb-1">
                      Lihat
                    </p>
                    <ArrowRight className="w-5 h-5 text-white group-hover/sale:translate-x-1 transition-transform duration-300 ml-auto" />
                  </div>
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Search Overlay ── */}
        <div
          className={`absolute inset-x-0 top-0 z-[60] bg-white/95 backdrop-blur-3xl shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] border-b border-neutral-150 transition-all duration-300 origin-top ${
            searchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="mx-auto max-w-[1320px] px-6 md:px-12 py-8">
            {/* Input Row */}
            <div className="flex items-center gap-4 border-b border-neutral-150 pb-5">
              <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari produk, kategori, koleksi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(
                      `/product?q=${encodeURIComponent(searchQuery.trim())}`,
                    );
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                autoFocus={searchOpen}
                className="flex-1 text-lg sm:text-xl font-medium bg-transparent outline-none text-neutral-900 placeholder:text-neutral-300"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    onSearch("");
                  }}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-black rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black transition-all"
              >
                Tutup <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Suggestions & Categories Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Popular Searches */}
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                  Pencarian Terpopuler
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Slow Juicer",
                    "Air Purifier",
                    "Kompor Induksi",
                    "Knife Set",
                    "Ezy Series",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item);
                        let productUrl = `/product?q=${encodeURIComponent(item)}`;
                        if (item.toLowerCase().includes("ezy")) {
                          productUrl = `/product?category=${encodeURIComponent("ezy series")}`;
                        } else if (item.toLowerCase().includes("knife")) {
                          productUrl = `/product?category=${encodeURIComponent("Knife set")}`;
                        }
                        router.push(productUrl);
                        setSearchOpen(false);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-blue-50 hover:text-blue-600 border border-neutral-100 text-xs font-medium text-neutral-600 transition-all active:scale-95"
                    >
                      🔥 {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Shortcut */}
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                  Kategori Unggulan
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSearchQuery(cat);
                        const productUrl = cat.toLowerCase().includes("kitchen")
                          ? `/product?category=${encodeURIComponent("Home & Kitchen Appliance")}`
                          : cat.toLowerCase().includes("living")
                            ? `/product?category=${encodeURIComponent("home living")}`
                            : `/product?category=${encodeURIComponent(cat)}`;
                        router.push(productUrl);
                        setSearchOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-neutral-100 hover:border-blue-200 bg-neutral-50/50 hover:bg-blue-50/20 text-left transition-all active:scale-[0.98] group"
                    >
                      <span className="text-xl bg-white shadow-sm border border-neutral-100 p-1 rounded-lg">
                        {getCategoryIcon(cat)}
                      </span>
                      <span className="text-xs font-bold text-neutral-700 group-hover:text-blue-600 transition-colors">
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Products Spotlight */}
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-neutral-400 mb-3">
                  Rekomendasi Koleksi
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      router.push("/product");
                      setSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-150 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&q=80"
                        alt="Best Seller"
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 group-hover:text-blue-600 transition-colors">
                        Koleksi Best Seller
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        Lihat perlengkapan terlaris kami
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════
          MOBILE PANEL
      ════════════════════════════ */}
      {mounted && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
              mobileOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`fixed right-0 top-0 h-full z-50 w-[85%] max-w-[340px] bg-white flex flex-col shadow-[−40px_0_80px_rgba(0,0,0,0.12)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
              <img
                src="/lg-ravella-gold.png"
                alt="Ravelle"
                className="h-5 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-200 rounded-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200/80 rounded-2xl focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-inner">
                <Search className="w-4.5 h-4.5 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari produk, kategori..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && mobileSearchQuery.trim()) {
                      router.push(
                        `/product?q=${encodeURIComponent(mobileSearchQuery.trim())}`,
                      );
                      setMobileOpen(false);
                    }
                  }}
                  className="flex-1 text-sm bg-transparent outline-none text-neutral-800 placeholder:text-neutral-400 font-medium"
                />
                {mobileSearchQuery && (
                  <button
                    onClick={() => setMobileSearchQuery("")}
                    className="p-1 rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-7 py-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-5">
                Menu
              </p>
              <div className="flex flex-col">
                {menus.map((menu) => (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    className="mobile-nav-link flex items-center justify-between py-4 border-b border-neutral-50 text-[12.5px] tracking-[0.2em] font-semibold text-neutral-700"
                  >
                    {menu.label}
                  </Link>
                ))}
                <Link
                  href={saleMenu.href}
                  className="flex items-center justify-between py-4 border-b border-neutral-50 text-[12.5px] tracking-[0.2em] font-bold text-rose-500"
                >
                  🔥 SALE
                </Link>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3">
                {authObj ? (
                  <>
                    <Link
                      href={
                        authObj.role === "admin"
                          ? "/admin/dashboard"
                          : authObj.role === "b2b"
                            ? "/b2b/dashboard"
                            : "/customer/dashboard"
                      }
                      className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-neutral-800 transition-colors rounded-sm"
                    >
                      <User className="w-3.5 h-3.5" /> My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 border border-rose-300 text-rose-500 text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-rose-50 transition-colors rounded-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-neutral-800 transition-colors rounded-sm"
                  >
                    <User className="w-3.5 h-3.5" /> Login / Daftar
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-200 text-neutral-800 text-[10.5px] tracking-[0.22em] uppercase font-semibold hover:bg-neutral-50 transition-colors rounded-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Keranjang
                  {cartCount > 0 && (
                    <span className="ml-1 min-w-[18px] h-4 px-1 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-neutral-100">
              <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-semibold mb-3">
                Ikuti Kami
              </p>
              <div className="flex gap-2.5 mb-4">
                {[
                  {
                    icon: Instagram,
                    href: "https://instagram.com/ravelle",
                    label: "Instagram",
                  },
                  {
                    icon: Facebook,
                    href: "https://facebook.com/ravelle",
                    label: "Facebook",
                  },
                  {
                    icon: Phone,
                    href: "https://wa.me/628123456789",
                    label: "WhatsApp",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-500 hover:bg-black hover:text-white hover:border-black transition-all duration-200 rounded-sm"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wide">
                © 2026 Ravelle. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
