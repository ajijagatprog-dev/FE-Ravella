"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Instagram, Phone, Facebook } from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";

// Baca total qty dari localStorage
function readCartCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem("ravelle_cart");
    if (!stored) return 0;
    const cart: { quantity: number }[] = JSON.parse(stored);
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

export default function Header({
  userName = "User",
  avatarUrl = "",
  onSearch = () => { },
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const [authObj, setAuthObj] = useState<{ role: string; email: string } | null>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Baca cart dari localStorage saat mount + listen event update
  useEffect(() => {
    setCartCount(readCartCount());

    const handleCartUpdate = () => setCartCount(readCartCount());

    const checkAuth = () => {
      const stored = localStorage.getItem("auth");
      if (stored) {
        setAuthObj(JSON.parse(stored));
      } else {
        setAuthObj(null);
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
  ];

  const saleMenu = { label: "SALE", href: "/sale" };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-neutral-200"
          : "bg-white border-b border-neutral-200"
          }`}
        style={{ fontFamily: JOST }}
      >
        <div className="mx-auto max-w-[1320px] px-6 md:px-12 py-3">
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-14">
              <Link href="/" className="group flex items-center">
                <img
                  src="/lg-ravella-gold.png"
                  alt="Ravelle Logo"
                  className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              <nav className="hidden lg:flex items-center gap-10">
                {menus.map((menu) => (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    className="group relative text-[13px] tracking-[0.18em] font-medium text-neutral-800 hover:text-black transition-colors duration-300"
                  >
                    {menu.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
                {/* SALE - highlighted */}
                <Link
                  href={saleMenu.href}
                  className="group relative text-[13px] tracking-[0.18em] font-bold text-rose-600 hover:text-rose-700 transition-colors duration-300 animate-pulse"
                >
                  {saleMenu.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-rose-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">

              {/* SEARCH */}
              <div className="hidden md:block relative">
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center justify-center text-neutral-800 hover:text-black transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-300">
                    <Search className="w-4 h-4 text-neutral-700" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        onSearch(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchOpen(false);
                        }
                      }}
                      autoFocus
                      className="w-40 text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                      style={{ fontFamily: JOST }}
                    />
                    <button onClick={() => setSearchOpen(false)}>
                      <X className="w-4 h-4 text-neutral-700" />
                    </button>
                  </div>
                )}
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
                      href={authObj.role === "admin" ? "/admin/dashboard" : authObj.role === "b2b" ? "/b2b/dashboard" : "/customer/dashboard"}
                      className="flex items-center gap-2 px-5 py-2 text-[12px] tracking-[0.15em] font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      PROFILE
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                      <Link
                        href={authObj.role === "admin" ? "/admin/dashboard" : authObj.role === "b2b" ? "/b2b/dashboard" : "/customer/dashboard"}
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
                      ACCOUNT
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
      </header>

      {/* ── MOBILE PANEL ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 h-full z-50 w-[85%] max-w-[340px] bg-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ fontFamily: JOST }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
          <img src="/lg-ravella-gold.png" alt="Ravelle Logo" className="h-5 w-auto" />
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
                  router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
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
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-4 border-b border-neutral-100 text-[13px] tracking-[0.2em] font-medium text-neutral-800 hover:text-black transition-colors duration-200 group"
              >
                <span>{menu.label}</span>
                <span className="w-0 h-[1px] bg-black group-hover:w-4 transition-all duration-300" />
              </Link>
            ))}
            {/* SALE */}
            <Link
              href={saleMenu.href}
              onClick={() => setMobileOpen(false)}
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
                  href={authObj.role === "admin" ? "/admin/dashboard" : authObj.role === "b2b" ? "/b2b/dashboard" : "/customer/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-red-500 text-red-600 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-800 transition-colors"
              >
                <User className="w-4 h-4" />
                Login / Daftar
              </Link>
            )}
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
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
              { icon: Instagram, href: "https://instagram.com/ravelle", label: "Instagram" },
              { icon: Facebook, href: "https://facebook.com/ravelle", label: "Facebook" },
              { icon: Phone, href: "https://wa.me/628123456789", label: "WhatsApp" },
            ].map(({ icon: Icon, href, label }) => (
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
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 font-light tracking-wide">
            © 2026 Ravelle. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}