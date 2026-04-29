"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";

// Baca total qty dari localStorage
function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem("ravelle_cart");
    if (!stored) return 0;
    const cart = JSON.parse(stored);

    // Safety check: Ensure it's an array before reducing
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  } catch (error) {
    console.error("Error reading cart count:", error);
    return 0;
  }
}

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
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
  const pathname = usePathname();
  const router = useRouter();

  // Scroll listener
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Baca cart dari localStorage saat mount + listen event update
  useEffect(() => {
    setCartCount(readCartCount());

    const handleCartUpdate = () => setCartCount(readCartCount());

    const fetchCategories = async () => {
      try {
        const res = await api.get("/products", { params: { limit: 100 } });
        if (res.data.status === "success") {
          const items = res.data.data.data || res.data.data;

          // Normalize categories to fix 'homeliving' and 'home living' duplicates
          const rawCats = items.map((i: any) => i.category).filter(Boolean);
          const catMap = new Map<string, string>();

          rawCats.forEach((c: string) => {
            // Normalize: lowercase, remove spaces
            let normalized = c.toLowerCase().replace(/\s+/g, "");
            if (normalized === "homeliving") {
              // Force unified display and query for home living
              catMap.set("homeliving", "Home Living");
            } else if (!catMap.has(normalized)) {
              // Title case format
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
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();

    const checkAuth = () => {
      try {
        const stored = localStorage.getItem("auth");
        if (stored && stored !== "undefined") {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") {
            setAuthObj(parsed);
          } else {
            setAuthObj(null);
          }
        } else {
          setAuthObj(null);
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        setAuthObj(null);
        localStorage.removeItem("auth"); // Clear corrupted data
      }
    };
    checkAuth();

    // Custom event dari ProductPage setiap kali user add to cart
    window.addEventListener("ravelle_cart_updated", handleCartUpdate);
    // Storage event untuk sinkronisasi antar tab
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
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200"
            : "bg-white border-b border-neutral-200"
        }`}
        style={{ fontFamily: JOST }}
      >
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 py-3">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-6 xl:gap-14">
              <Link href="/" className="group flex items-center flex-shrink-0">
                <img
                  src="/lg-ravella-gold.png"
                  alt="Ravelle Logo"
                  className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-5 xl:gap-8 transition-opacity duration-300">
                {menus.map((menu) => (
                  <div
                    key={menu.label}
                    className="group flex items-center h-full"
                  >
                    <Link
                      href={menu.href}
                      className="relative text-[12px] tracking-[0.15em] font-medium text-neutral-600 hover:text-black transition-colors duration-300 whitespace-nowrap py-6"
                    >
                      {menu.label}
                      <span className="absolute bottom-5 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {menu.label === "PRODUCT" && (
                      <div
                        className="absolute left-0 top-full w-[100vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none group-hover:pointer-events-auto"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        {/* Invisible bridge to maintain hover */}
                        <div className="absolute w-full h-[40px] -top-[40px] bg-transparent pointer-events-auto" />
                        <div
                          className="w-full bg-white shadow-2xl border-t border-neutral-200"
                          style={{ fontFamily: JOST }}
                        >
                          <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-10 flex justify-between gap-10">
                            {/* Dynamic Categories Grid */}
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-neutral-900 mb-6 tracking-wider uppercase">
                                Jelajahi Kategori
                              </h4>
                              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                                {categories.length > 0 ? (
                                  categories.map((cat) => (
                                    <Link
                                      key={cat}
                                      href={`/search?q=${encodeURIComponent(cat)}`}
                                      className="group/cat relative flex flex-col justify-end p-5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-rose-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 overflow-hidden min-h-[100px]"
                                    >
                                      <div className="absolute right-0 top-0 w-20 h-20 bg-gradient-to-bl from-rose-100/50 to-transparent rounded-bl-[100px] opacity-0 group-hover/cat:opacity-100 transition-opacity duration-500" />
                                      <h4 className="text-[13px] font-bold text-neutral-800 group-hover/cat:text-rose-600 transition-colors z-10 capitalize tracking-wide">
                                        {cat}
                                      </h4>
                                      <p className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mt-2 z-10 group-hover/cat:text-rose-400 transition-colors flex items-center gap-1">
                                        Eksplor{" "}
                                        <span className="group-hover/cat:translate-x-1 transition-transform">
                                          →
                                        </span>
                                      </p>
                                    </Link>
                                  ))
                                ) : (
                                  <div className="col-span-full flex items-center py-10">
                                    <Loader2 className="w-5 h-5 text-neutral-300 animate-spin" />
                                    <span className="ml-3 text-sm text-neutral-400">
                                      Memuat kategori...
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Featured Image */}
                            <div className="w-[340px] flex-shrink-0">
                              <Link
                                href="/product"
                                className="group/featured block overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 aspect-[4/3] relative w-full shadow-sm hover:shadow-xl transition-all duration-500"
                              >
                                <img
                                  src="https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80"
                                  alt="Featured Product"
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/featured:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover/featured:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col justify-end">
                                  <span className="inline-block px-2.5 py-1 bg-rose-500/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase rounded mb-3 self-start">
                                    Koleksi Terbaru
                                  </span>
                                  <h4 className="text-lg font-bold mb-1 shadow-sm leading-tight tracking-wide">
                                    Ravelle Premium Collection
                                  </h4>
                                  <p className="text-[11px] font-medium tracking-[0.2em] text-rose-200 mt-3 flex items-center gap-2 group-hover/featured:gap-3 transition-all">
                                    SHOP NOW <span className="text-sm">→</span>
                                  </p>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* SALE - highlighted */}
                <Link
                  href={saleMenu.href}
                  className="group relative text-[12px] tracking-[0.15em] font-bold text-rose-600 hover:text-rose-700 transition-colors duration-300 flex items-center gap-1.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  {saleMenu.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-rose-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">
              {/* SEARCH */}
              <div className="hidden md:block">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center text-neutral-800 hover:text-black transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* CART — badge muncul otomatis dari localStorage */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center text-neutral-800 hover:text-black transition-colors duration-200"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2.5 min-w-[16px] h-4 px-1 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-medium leading-none"
                    style={{ fontFamily: JOST }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* LOGIN / ACCOUNT */}
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
                      className="flex items-center gap-2 px-5 py-2 text-[12px] tracking-[0.15em] font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden xl:inline">PROFILE</span>
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                      <Link
                        href={
                          authObj.role === "admin"
                            ? "/admin/dashboard"
                            : authObj.role === "b2b"
                              ? "/b2b/dashboard"
                              : "/customer/dashboard"
                        }
                        className="block px-4 py-3 text-[11px] tracking-[0.1em] text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-50"
                      >
                        MY ACCOUNT
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-3 text-[11px] tracking-[0.1em] text-red-600 hover:bg-red-50"
                      >
                        LOGOUT
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-5 py-2 text-[12px] tracking-[0.15em] font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden xl:inline">ACCOUNT</span>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                      <Link
                        href="/auth/login"
                        className="block px-4 py-3 text-[11px] tracking-[0.1em] text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-50"
                      >
                        LOGIN
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-3 text-[11px] tracking-[0.1em] text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-50"
                      >
                        DAFTAR CUSTOMER
                      </Link>
                      <Link
                        href="/auth/register-b2b"
                        className="block px-4 py-3 text-[11px] tracking-[0.1em] text-neutral-800 hover:bg-neutral-50 hover:text-[#8B5E3C]"
                      >
                        DAFTAR MITRA B2B
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center text-neutral-800 hover:text-black transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Overlay ── */}
        <div
          className={`absolute inset-0 z-[60] bg-white transition-all duration-500 ease-in-out ${
            searchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="mx-auto max-w-[1320px] h-full px-6 md:px-12 flex items-center">
            <div className="flex-1 flex items-center gap-6">
              <Search className="w-6 h-6 text-neutral-300" />
              <input
                type="text"
                placeholder="What are you looking for?"
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
                }}
                autoFocus={searchOpen}
                className="flex-1 text-xl md:text-2xl font-light bg-transparent outline-none text-neutral-900 placeholder:text-neutral-300"
                style={{ fontFamily: JOST }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-neutral-900" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE PANEL (Hydration Safe) ── */}
      {mounted && (
        <>
          <div
            className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
              mobileOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`fixed right-0 top-0 h-full z-50 w-[85%] max-w-[340px] bg-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ fontFamily: JOST }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
              <img
                src="/lg-ravella-gold.png"
                alt="Ravelle Logo"
                className="h-5 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-7 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2 px-3 py-2 border border-neutral-200">
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
                  style={{ fontFamily: JOST }}
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-7 py-6">
              <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-4">
                Menu
              </p>
              <div className="flex flex-col">
                {menus.map((menu) => (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    className="flex items-center justify-between py-4 border-b border-neutral-100 text-[13px] tracking-[0.2em] font-medium text-neutral-800 hover:text-black transition-colors duration-200 group"
                  >
                    <span>{menu.label}</span>
                    <span className="w-0 h-[1px] bg-black group-hover:w-4 transition-all duration-300" />
                  </Link>
                ))}
                {/* SALE */}
                <Link
                  href={saleMenu.href}
                  className="flex items-center justify-between py-4 border-b border-neutral-100 text-[13px] tracking-[0.2em] font-bold text-rose-600 hover:text-rose-700 transition-colors duration-200 group"
                >
                  <span>🔥 {saleMenu.label}</span>
                  <span className="w-0 h-[1px] bg-rose-500 group-hover:w-4 transition-all duration-300" />
                </Link>
              </div>

              {/* CTA Buttons */}
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
                      className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 border border-red-500 text-red-600 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Login / Daftar
                  </Link>
                )}
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-100 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Keranjang
                  {cartCount > 0 && (
                    <span
                      className="ml-1 min-w-[20px] h-5 px-1 bg-black text-white text-[10px] flex items-center justify-center rounded-full"
                      style={{ fontFamily: JOST }}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </nav>

            {/* Panel Footer */}
            <div className="px-7 py-5 border-t border-neutral-100">
              <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-3">
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
                ].map(({ icon: Icon, href, label }) => {
                  // Safety: Ensure Icon is a valid component
                  if (!Icon) return null;

                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-600 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
              <p className="text-[10px] text-neutral-400 font-light tracking-wide">
                © 2026 Ravelle. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
