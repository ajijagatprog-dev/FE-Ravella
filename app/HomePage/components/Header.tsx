"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 md:px-10 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-12">
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-black text-white">
                  <svg
                    className="size-4"
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
                <h2 className="text-lg font-semibold tracking-[0.15em] text-gray-900">
                  RAVELLE
                </h2>
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden md:flex items-center gap-10">
                {menus.map((menu) => (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    className="text-sm font-medium tracking-wide text-gray-700
                    hover:text-black transition-colors"
                  >
                    {menu.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* SEARCH */}
              <div
                className="hidden sm:flex items-center gap-2 rounded-full 
                bg-gray-100 px-4 py-2 w-56
                focus-within:ring-1 focus-within:ring-white transition"
              >
                <input
                  type="text"
                  placeholder="Search product..."
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-sm 
                  text-gray-800 placeholder:text-gray-500 focus:ring-0"
                />
              </div>

              {/* LOGIN */}
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center px-5 py-2 rounded-full
                border border-gray-900 text-gray-900 text-sm font-medium
                hover:bg-gray-900 hover:text-white transition-all"
              >
                Login
              </Link>

              {/* HAMBURGER */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center size-9 rounded-lg
                border border-gray-50 bg-gray-900 hover:bg-gray-900 transition"
              >
                <svg
                  className="size-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          {/* SLIDE PANEL */}
          <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-xl animate-slideIn">
            {/* HEADER MOBILE */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <button
                onClick={() => setMobileOpen(false)}
                className="size-9 flex items-center justify-center rounded-lg
                border border-gray-300 hover:bg-gray-100"
              >
                <svg
                  className="size-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* MENU LIST */}
            <nav className="flex flex-col px-6 py-6 space-y-6">
              {menus.map((menu) => (
                <Link
                  key={menu.label}
                  href={menu.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-gray-800
                  hover:text-black transition"
                >
                  {menu.label}
                </Link>
              ))}

              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex items-center justify-center py-3 rounded-full
                border border-gray-900 text-gray-900 text-sm font-medium
                hover:bg-gray-900 hover:text-white transition"
              >
                Login
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
