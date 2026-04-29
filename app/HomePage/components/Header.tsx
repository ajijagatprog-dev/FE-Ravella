"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/axios";
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
        const res = await api.get("/products", { params: { limit: 100 } });
        if (res.data.status === "success") {
          const items = res.data.data.data || res.data.data;
          const rawCats = items.map((i: any) => i.category).filter(Boolean);
          const catMap = new Map<string, string>();
          rawCats.forEach((c: string) => {
            let normalized = c.toLowerCase().replace(/\s+/g, "");
            if (normalized === "homeliving") {
              catMap.set("homeliving", "Home Living");
            } else if (!catMap.has(normalized)) {
              const display = c
                .split(" ")
                .map(
                  (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                )
                .join(" ");
              catMap.set(normalized, display);
            }
          });
          setCategories(Array.from(catMap.values()));
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
                        className="block px-5 py-3.5 text-[11px] tracking-[0.1em] text-neutral-700 hover:bg-neutral-50 hover:text-[#8B5E3C] transition-colors"
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
          className={`mega-panel absolute left-0 w-full bg-white border-t border-neutral-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] z-40 ${megaOpen ? "open" : ""}`}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-10">
            <div className="flex gap-12">
              {/* ── LEFT: Categories ── */}
              <div className="flex-1 min-w-0">
                {/* Section header */}
                <div className="flex items-center gap-3 mb-7">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.28em] text-neutral-400 uppercase mb-0.5">
                      Koleksi Kami
                    </p>
                    <h3 className="text-[17px] font-bold text-neutral-900 tracking-tight leading-tight">
                      Jelajahi Kategori
                    </h3>
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neutral-200 to-transparent divider-line ml-3" />
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {categories.length > 0 ? (
                    categories.map((cat, i) => (
                      <Link
                        key={cat}
                        href={`/search?q=${encodeURIComponent(cat)}`}
                        className="cat-card cat-card-stagger rounded-xl p-5 block"
                        style={{ transitionDelay: `${0.05 + i * 0.04}s` }}
                        onMouseEnter={() => setHoveredCat(cat)}
                        onMouseLeave={() => setHoveredCat(null)}
                      >
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <span className="cat-icon text-2xl leading-none">
                              {getCategoryIcon(cat)}
                            </span>
                            <span className="cat-arrow text-neutral-300 text-sm font-light">
                              →
                            </span>
                          </div>
                          <h4 className="cat-label text-[13px] font-bold text-neutral-800 tracking-wide capitalize leading-tight mb-1">
                            {cat}
                          </h4>
                          <p className="cat-eksplor text-[9.5px] uppercase tracking-[0.22em] font-semibold text-neutral-400 flex items-center gap-1">
                            Eksplor
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center py-10">
                      <Loader2 className="w-4 h-4 text-neutral-300 animate-spin" />
                      <span className="ml-3 text-[12px] text-neutral-400 tracking-wide">
                        Memuat kategori...
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-8">
                  {[
                    { value: "500+", label: "Produk" },
                    { value: "15+", label: "Kategori" },
                    { value: "10K+", label: "Pelanggan" },
                  ].map((s) => (
                    <div key={s.label} className="stat-item text-center">
                      <p className="text-[15px] font-bold text-neutral-900">
                        {s.value}
                      </p>
                      <p className="text-[10px] tracking-[0.18em] uppercase text-neutral-400 font-medium">
                        {s.label}
                      </p>
                    </div>
                  ))}
                  <div className="ml-auto">
                    <Link
                      href="/product"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[10.5px] tracking-[0.2em] font-bold uppercase rounded-sm hover:bg-neutral-800 transition-all duration-300 group/btn"
                    >
                      Semua Produk
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Featured Card ── */}
              <div className="w-[300px] xl:w-[340px] flex-shrink-0 flex flex-col gap-4">
                {/* Main featured */}
                <Link
                  href="/product"
                  className="featured-card block aspect-[3/4] w-full flex-1 relative shadow-sm hover:shadow-xl transition-shadow duration-500 group/feat"
                >
                  <img
                    src="https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80"
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C] text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-sm shadow-lg">
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
                      <div className="h-[1px] w-8 bg-[#C9A84C] group-hover/feat:w-12 transition-all duration-500" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A84C] group-hover/feat:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                {/* Mini promo card */}
                <Link
                  href="/sale"
                  className="relative overflow-hidden rounded-xl p-5 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-700 hover:from-neutral-800 hover:to-neutral-600 transition-all duration-500 group/sale"
                >
                  <div>
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
                  <div className="text-right">
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
          className={`absolute inset-0 z-[60] bg-white search-overlay-enter ${
            searchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="mx-auto max-w-[1320px] h-full px-6 md:px-12 flex items-center">
            <div className="flex-1 flex items-center gap-5">
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
                      `/search?q=${encodeURIComponent(searchQuery.trim())}`,
                    );
                    setSearchOpen(false);
                  }
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                autoFocus={searchOpen}
                className="flex-1 text-xl md:text-2xl font-light bg-transparent outline-none text-neutral-900 placeholder:text-neutral-300"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700" />
              </button>
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
            <div className="px-7 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2 px-3 py-2.5 border border-neutral-200 rounded-sm">
                <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && mobileSearchQuery.trim()) {
                      router.push(
                        `/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`,
                      );
                      setMobileOpen(false);
                    }
                  }}
                  className="flex-1 text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                />
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
