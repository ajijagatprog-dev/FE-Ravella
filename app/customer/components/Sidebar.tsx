"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  BadgePercent,
  X,
  ChevronRight,
  CreditCard,
  MapPin,
  User,
  LogOut,
} from "lucide-react";

// ── Menu Config ───────────────────────────────────────────────────────────────

const menuItems = [
  { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/customer/myOrders", icon: ReceiptText },
  { label: "Payments & Invoice", href: "/customer/paymentInvoice", icon: CreditCard },
  { label: "Loyalty & Membership", href: "/customer/loyaltyMembership", icon: BadgePercent },
  { label: "Saved Addresses", href: "/customer/savedAddress", icon: MapPin },
];

// ── Badge helper ──────────────────────────────────────────────────────────────

const menuBadges: Record<string, { count: number; color: string }> = {
  "/customer/myOrders": { count: 2, color: "bg-blue-500" },
  "/customer/paymentInvoice": { count: 1, color: "bg-amber-500" },
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

  const renderMenu = (items: typeof menuItems) =>
    items.map((item) => {
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
          <Icon size={18} className="shrink-0" />

          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

          {!collapsed && badge && (
            <span
              className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-bold text-white rounded-full ${isActive ? "bg-white/30" : badge.color
                }`}
            >
              {badge.count}
            </span>
          )}
        </Link>
      );
    });

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0
          h-screen bg-white border-r border-gray-200
          flex flex-col z-40
          transition-all duration-300 ease-in-out
          ${isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
          ${collapsed ? "lg:w-[72px]" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-600 flex items-center justify-center text-white font-bold">
              R
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold text-gray-900">Ravelle</p>
                <p className="text-[11px] text-gray-400">Customer Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                onMobileClose();
              } else {
                setCollapsed((v) => !v);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={16} className="lg:hidden" />
            <ChevronRight
              size={16}
              className={`hidden lg:block transition-transform ${collapsed ? "" : "rotate-180"
                }`}
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-2">
              Menu
            </p>
          )}

          {renderMenu(menuItems)}
        </nav>
      </aside>
    </>
  );
}