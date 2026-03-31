"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Award,
  BarChart3,
  X,
  ChevronRight,
  Newspaper,
  Tag,
} from "lucide-react";

// ── Menu Config ───────────────────────────────────────────────────────────────

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Order Management", href: "/admin/order", icon: ShoppingCart },
  { label: "User Management", href: "/admin/users_management", icon: Users },
  { label: "Loyalty System", href: "/admin/loyalty", icon: Award },
  { label: "Voucher", href: "/admin/vouchers", icon: Tag },
  { label: "Reporting", href: "/admin/reports", icon: BarChart3 },
];

const contentMenuItems = [
  { label: "Kelola Produk", href: "/admin/content/products", icon: Package },
  { label: "Kelola Berita", href: "/admin/content/news", icon: Newspaper },
];

// ── Badge helper ──────────────────────────────────────────────────────────────

const menuBadges: Record<string, { count: number; color: string }> = {
  "/admin/order": { count: 12, color: "bg-blue-500" },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// ── Helper: render a single nav link ──────────────────────────────────────────

function NavLink({
  item,
  pathname,
  collapsed,
  onMobileClose,
}: {
  item: { label: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  pathname: string;
  collapsed: boolean;
  onMobileClose: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;
  const badge = menuBadges[item.href];

  return (
    <Link
      href={item.href}
      onClick={onMobileClose}
      title={collapsed ? item.label : undefined}
      className={`
        relative flex items-center gap-3 rounded-xl text-sm font-medium
        transition-all duration-200 group
        ${collapsed ? "justify-center px-0 py-3 mx-auto w-12 h-12" : "px-3 py-2.5"}
        ${isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/50 rounded-r-full" />
      )}

      <Icon
        size={collapsed ? 20 : 18}
        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : ""}`}
      />

      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

      {!collapsed && badge && (
        <span
          className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-bold text-white rounded-full ${isActive ? "bg-white/30" : badge.color}`}
        >
          {badge.count}
        </span>
      )}

      {/* Tooltip on collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[9999] shadow-xl transition-opacity duration-150">
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
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    onMobileClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) onMobileClose();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [onMobileClose]);

  return (
    <>
      {/* ── Mobile Overlay ─────────────────────────────────── */}
      <div
        onClick={onMobileClose}
        className={`
          lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30
          transition-opacity duration-300
          ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0
          h-screen bg-white border-r border-gray-200
          flex flex-col z-40
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[72px] w-64" : "w-64"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────────── */}
        <div className={`border-b border-gray-100 shrink-0 transition-all duration-300 ${collapsed ? "lg:px-2 lg:py-3 px-4 py-5" : "px-4 py-5"}`}>
          {/* Expanded layout (or mobile always expanded) */}
          <div className={`flex items-center justify-between ${collapsed ? "lg:flex-col lg:gap-3" : ""}`}>
            <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? "lg:flex-col lg:gap-1" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-200 shrink-0">
                R
              </div>
              {/* Text - hidden when collapsed on desktop, always visible on mobile */}
              <div className={`min-w-0 transition-all duration-300 ${collapsed ? "lg:hidden" : ""}`}>
                <p className="text-sm font-bold text-gray-900 truncate whitespace-nowrap">Ravelle Fashion</p>
                <p className="text-[11px] text-gray-400 truncate whitespace-nowrap">Admin Panel</p>
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
              <X size={16} className="lg:hidden" />
              <ChevronRight
                size={16}
                className={`hidden lg:block transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
              />
            </button>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className={`flex-1 overflow-y-auto py-4 space-y-1 transition-all duration-300 ${collapsed ? "px-2" : "px-3"}`}>
          {/* ── Menu Utama ── */}
          <div className={`transition-all duration-200 overflow-hidden ${collapsed ? "lg:h-0 lg:mb-0" : "h-auto mb-1"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-2">
              Menu Utama
            </p>
          </div>

          {menuItems.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} collapsed={collapsed} onMobileClose={onMobileClose} />
          ))}

          {/* ── Divider ── */}
          <div className={`${collapsed ? "mx-1" : "mx-3"} border-t border-gray-100 !my-4`} />

          {/* ── Content Management ── */}
          <div className={`transition-all duration-200 overflow-hidden ${collapsed ? "lg:h-0 lg:mb-0" : "h-auto mb-1"}`}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pb-2">
              Content Management
            </p>
          </div>

          {contentMenuItems.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} collapsed={collapsed} onMobileClose={onMobileClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}