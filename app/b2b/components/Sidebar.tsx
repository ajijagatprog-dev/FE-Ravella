"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  CreditCard,
  ShoppingCart,
  UserCircle,
  X,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/b2b/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Products",
    href: "/b2b/products",
    icon: Boxes
  },
  {
    label: "Orders",
    href: "/b2b/orders",
    icon: ClipboardList
  },
  {
    label: "Payments",
    href: "/b2b/payments",
    icon: CreditCard
  },
  {
    label: "Keranjang",
    href: "/b2b/keranjang",
    icon: ShoppingCart
  },
  {
    label: "My Profile",
    href: "/b2b/profile",
    icon: UserCircle
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── Mobile Overlay ─────────────────────────────────── */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0
          h-screen bg-white border-r border-gray-200
          flex flex-col z-40
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[72px]" : "w-64"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div className={`border-b border-gray-100 shrink-0 transition-all duration-300 ${collapsed ? "lg:px-2 lg:py-3 px-4 py-5" : "px-4 py-5"}`}>
          <div className={`flex items-center justify-between ${collapsed ? "lg:flex-col lg:gap-3" : ""}`}>
            <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? "lg:flex-col lg:gap-1" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shadow-md shadow-blue-200 shrink-0">
                B2B
              </div>
              {/* Text - hidden when collapsed on desktop, always visible on mobile */}
              <div className={`min-w-0 transition-all duration-300 ${collapsed ? "lg:hidden" : ""}`}>
                <p className="text-sm font-bold text-gray-900 truncate whitespace-nowrap">Ravelle Fashion</p>
                <p className="text-[11px] text-gray-400 truncate whitespace-nowrap">B2B Panel</p>
              </div>
            </div>

            {/* Close on mobile / collapse toggle on desktop */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onMobileClose();
                } else {
                  setCollapsed((v) => !v);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
            >
              {/* Mobile: X, Desktop: chevron */}
              <X size={16} className="lg:hidden" />
              <ChevronRight
                size={16}
                className={`hidden lg:block transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
              />
            </button>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-2">
              Menu Utama
            </p>
          )}

          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                className={`
                  relative flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                  ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/50 rounded-r-full" />
                )}

                <Icon
                  size={18}
                  className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`}
                />

                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}