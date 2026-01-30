"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

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
  const [cartCount, setCartCount] = useState(3); // Example cart count

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const menus = [
    { label: "Home", href: "/" },
    { label: "Company", href: "/company" },
    { label: "Product", href: "/product" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-12">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-black tracking-[0.15em] bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  RAVELLE
                </h2>
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden lg:flex items-center gap-8">
                {menus.map((menu) => (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    className="relative text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors group"
                  >
                    {menu.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* SEARCH - Desktop */}
              <div className="hidden md:block relative">
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border-2 border-orange-300 animate-slideIn">
                    <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onBlur={() => {
                        if (!searchQuery) {
                          setTimeout(() => setSearchOpen(false), 200);
                        }
                      }}
                      autoFocus
                      className="w-48 bg-transparent border-none text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          onSearch("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* CART */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 hover:text-white transition-all hover:scale-105 group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* LOGIN BUTTON - Desktop */}
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm hover:shadow-xl hover:scale-105 transition-all group"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Login</span>
              </Link>

              {/* HAMBURGER */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 hover:bg-gray-800 transition-all hover:scale-105"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* SLIDE PANEL */}
          <div
            className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER MOBILE */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50">
              <h3 className="text-lg font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                MENU
              </h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 hover:border-orange-300 transition-all hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* SEARCH MOBILE */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200 focus-within:border-orange-300 transition-all">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-transparent border-none text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      onSearch("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* MENU LIST */}
            <nav className="flex flex-col px-6 py-6 space-y-2">
              {menus.map((menu) => (
                <Link
                  key={menu.label}
                  href={menu.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all"
                >
                  {menu.label}
                </Link>
              ))}

              {/* CART MOBILE */}
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-orange-600 transition-all mt-4"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shopping Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* LOGIN MOBILE */}
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 mt-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                <User className="w-5 h-5" />
                <span>Login to Account</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}