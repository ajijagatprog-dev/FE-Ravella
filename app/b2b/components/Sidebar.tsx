"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  X,
  ChevronRight,
} from "lucide-react";

// ── Menu Config ───────────────────────────────────────────────────────────────

const menuItems = [
  { label: "Dashboard", href: "/b2b/dashboard", icon: LayoutDashboard },
  { label: "Product Management", href: "/b2b/products", icon: Package },
  { label: "Order Management", href: "/b2b/order", icon: ShoppingCart },
];

// ── Badge helper (optional per-menu badge) ────────────────────────────────────

const menuBadges: Record<string, { count: number; color: string }> = {
  "/b2b/order": { count: 12, color: "bg-blue-500" },
  "/b2b/products": { count: 3, color: "bg-amber-500" },
};

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
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-200 shrink-0">
              B2B
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Ravelle Fashion</p>
                <p className="text-[11px] text-gray-400 truncate">B2B Panel</p>
              </div>
            )}
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
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            {/* Mobile: X, Desktop: chevron */}
            <X size={16} className="lg:hidden" />
            <ChevronRight
              size={16}
              className={`hidden lg:block transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
            />
          </button>
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
            const badge = menuBadges[item.href];

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

                {/* Badge */}
                {!collapsed && badge && (
                  <span
                    className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-bold text-white rounded-full ${isActive ? "bg-white/30" : badge.color
                      }`}
                  >
                    {badge.count}
                  </span>
                )}

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
                    {item.label}
                    {badge && (
                      <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full ${badge.color}`}>
                        {badge.count}
                      </span>
                    )}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}