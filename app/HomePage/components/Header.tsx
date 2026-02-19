"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, Instagram, Phone, Facebook } from "lucide-react";

const JOST = "'Jost', system-ui, sans-serif";

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
  const [cartCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const menus = [
    { label: "HOME", href: "/" },
    { label: "COMPANY", href: "/company" },
    { label: "PRODUCT", href: "/product" },
    { label: "NEWS", href: "/news" },
    { label: "CONTACT", href: "/contact" },
  ];

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
              {/* LOGO */}
              <Link href="/" className="group flex items-center">
                <img
                  src="/lg-ravella-gold.png"
                  alt="Ravelle Logo"
                  className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* DESKTOP NAV */}
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
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-5">

              {/* SEARCH — borderless icon */}
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

              {/* CART — borderless icon */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center text-neutral-800 hover:text-black transition-colors duration-200"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* LOGIN — border dipertahankan sesuai screenshot */}
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-2 px-5 py-2 text-[12px] tracking-[0.15em] font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <User className="w-4 h-4" />
                LOGIN
              </Link>

              {/* MOBILE MENU TOGGLE — borderless */}
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full z-50 w-[85%] max-w-[340px] bg-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"
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
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-800 transition-colors"
            >
              <User className="w-4 h-4" />
              Login / Daftar
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 border border-neutral-800 text-neutral-900 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-neutral-100 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Keranjang
              {cartCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
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