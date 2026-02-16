"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Building2,
  Award,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Product Management", href: "/products", icon: Package },
  { label: "Order Management", href: "/order", icon: ShoppingCart },
  { label: "User Management", href: "/users_management", icon: Users },
  // { label: "Customer Management", href: "/customers", icon: Users },
  // { label: "B2B Management", href: "/b2b", icon: Building2 },
  { label: "Loyalty System", href: "/loyalty", icon: Award },
  { label: "Reporting", href: "/reports", icon: BarChart3 },
];

export default function SidebarB2B() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-gray-600" />
        ) : (
          <Menu size={20} className="text-gray-600" />
        )}
      </button>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0
          w-64 h-screen
          bg-white border-r border-gray-200
          px-4 py-6
          z-40
          transition-transform duration-300
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            R
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Ravelle Fashion
            </p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              AR
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Alex Rivera</p>
              <p className="text-xs text-gray-500">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
